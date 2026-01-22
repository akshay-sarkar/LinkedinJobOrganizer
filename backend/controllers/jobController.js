import Job from '../models/Job.js';
import { fetchEmails } from '../services/emailService.js';
import { parseLinkedInEmail, cleanJobData } from '../services/parserService.js';
import { Op } from 'sequelize';

/**
 * Get all jobs with optional filtering and sorting
 * GET /api/jobs
 */
const getAllJobs = async (req, res) => {
  try {
    const {
      company,
      location,
      isFavorite,
      isApplied,
      isRejected,
      search,
      sortBy = 'createdAt',
      order = 'DESC',
      limit = 50,
      offset = 0,
    } = req.query;

    // Build filter conditions
    const where = {};

    if (company) where.company = { [Op.like]: `%${company}%` };
    if (location) where.location = { [Op.like]: `%${location}%` };
    if (isFavorite !== undefined) where.isFavorite = isFavorite === 'true';
    if (isApplied !== undefined) where.isApplied = isApplied === 'true';
    if (isRejected !== undefined) where.isRejected = isRejected === 'true';

    // Search in title, company, or location
    if (search) {
      where[Op.or] = [
        { title: { [Op.like]: `%${search}%` } },
        { company: { [Op.like]: `%${search}%` } },
        { location: { [Op.like]: `%${search}%` } },
      ];
    }

    const jobs = await Job.findAll({
      where,
      order: [[sortBy, order]],
      limit: parseInt(limit),
      offset: parseInt(offset),
    });

    const total = await Job.count({ where });

    res.json({
      success: true,
      data: jobs,
      pagination: {
        total,
        limit: parseInt(limit),
        offset: parseInt(offset),
        hasMore: total > parseInt(offset) + parseInt(limit),
      },
    });
  } catch (error) {
    console.error('Error fetching jobs:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch jobs',
      error: error.message,
    });
  }
};

/**
 * Get single job by ID
 * GET /api/jobs/:id
 */
const getJobById = async (req, res) => {
  try {
    const { id } = req.params;
    const job = await Job.findByPk(id);

    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job not found',
      });
    }

    res.json({
      success: true,
      data: job,
    });
  } catch (error) {
    console.error('Error fetching job:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch job',
      error: error.message,
    });
  }
};

/**
 * Fetch new jobs from Gmail and save to database
 * POST /api/jobs/fetch
 */
const fetchNewJobs = async (req, res) => {
  try {
    const { limit = 10 } = req.body;

    console.log('🔄 Fetching new job alerts from Gmail...');

    // Fetch emails from Gmail
    const emails = await fetchEmails({ limit });

    if (emails.length === 0) {
      return res.json({
        success: true,
        message: 'No new job alerts found',
        data: { jobsAdded: 0, emailsFetched: 0 },
      });
    }

    console.log(`📧 Processing ${emails.length} email(s)...`);

    let jobsAdded = 0;
    const errors = [];

    // Parse each email and extract jobs
    for (const email of emails) {
      try {
        const jobs = parseLinkedInEmail(email);

        for (const jobData of jobs) {
          const cleanedJob = cleanJobData(jobData);

          // Check if job already exists (by URL)
          if (cleanedJob.jobUrl) {
            const existingJob = await Job.findOne({
              where: { jobUrl: cleanedJob.jobUrl },
            });

            if (existingJob) {
              console.log(`⏭️  Job already exists: ${cleanedJob.title}`);
              continue;
            }
          }

          // Save new job to database
          await Job.create(cleanedJob);
          jobsAdded++;
          console.log(`✅ Added job: ${cleanedJob.title} at ${cleanedJob.company}`);
        }
      } catch (error) {
        console.error('Error processing email:', error);
        errors.push(error.message);
      }
    }

    res.json({
      success: true,
      message: `Successfully processed ${emails.length} email(s)`,
      data: {
        emailsFetched: emails.length,
        jobsAdded,
        errors: errors.length > 0 ? errors : undefined,
      },
    });
  } catch (error) {
    console.error('Error fetching new jobs:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch new jobs from email',
      error: error.message,
    });
  }
};

/**
 * Update job (mark as favorite, applied, etc.)
 * PUT /api/jobs/:id
 */
const updateJob = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const job = await Job.findByPk(id);

    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job not found',
      });
    }

    // Update allowed fields
    const allowedUpdates = ['isFavorite', 'isApplied', 'isRejected', 'notes'];
    const updateData = {};

    allowedUpdates.forEach((field) => {
      if (updates[field] !== undefined) {
        updateData[field] = updates[field];
      }
    });

    await job.update(updateData);

    res.json({
      success: true,
      message: 'Job updated successfully',
      data: job,
    });
  } catch (error) {
    console.error('Error updating job:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update job',
      error: error.message,
    });
  }
};

/**
 * Delete job
 * DELETE /api/jobs/:id
 */
const deleteJob = async (req, res) => {
  try {
    const { id } = req.params;
    const job = await Job.findByPk(id);

    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job not found',
      });
    }

    await job.destroy();

    res.json({
      success: true,
      message: 'Job deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting job:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete job',
      error: error.message,
    });
  }
};

/**
 * Delete all jobs
 * DELETE /api/jobs/deleteAll
 */
const deleteAllJobs = async (req, res) => {
  try {
    await Job.destroy({
      where: {},
    });

    res.json({
      success: true,
      message: 'All jobs deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting all jobs:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete all jobs',
      error: error.message,
    });
  }
};

/**
 * Get dashboard statistics
 * GET /api/jobs/stats
 */
const getJobStats = async (req, res) => {
  try {
    const total = await Job.count();
    const favorites = await Job.count({ where: { isFavorite: true } });
    const applied = await Job.count({ where: { isApplied: true } });
    const rejected = await Job.count({ where: { isRejected: true } });
    const pending = total - applied - rejected;

    // Get top companies
    const jobsByCompany = await Job.findAll({
      attributes: [
        'company',
        [Job.sequelize.fn('COUNT', Job.sequelize.col('company')), 'count'],
      ],
      group: ['company'],
      order: [[Job.sequelize.fn('COUNT', Job.sequelize.col('company')), 'DESC']],
      limit: 5,
    });

    res.json({
      success: true,
      data: {
        total,
        favorites,
        applied,
        rejected,
        pending,
        topCompanies: jobsByCompany.map((item) => ({
          company: item.company,
          count: parseInt(item.get('count')),
        })),
      },
    });
  } catch (error) {
    console.error('Error fetching stats:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch statistics',
      error: error.message,
    });
  }
};

export {
  getAllJobs,
  getJobById,
  fetchNewJobs,
  updateJob,
  deleteJob,
  deleteAllJobs,
  getJobStats,
};
