import express from 'express';
import {
  getAllJobs,
  getJobById,
  fetchNewJobs,
  updateJob,
  deleteJob,
  deleteAllJobs,
  getJobStats,
} from '../controllers/jobController.js';

const router = express.Router();

// GET /api/jobs - Get all jobs with filtering
router.get('/', getAllJobs);

// GET /api/jobs/stats - Get dashboard statistics
router.get('/stats', getJobStats);

// GET /api/jobs/:id - Get single job
router.get('/:id', getJobById);

// POST /api/jobs/fetch - Fetch new jobs from email
router.post('/fetch', fetchNewJobs);

// PUT /api/jobs/:id - Update job
router.put('/:id', updateJob);

// DELETE /api/jobs/deleteAll - Delete all jobs
router.delete('/deleteAll', deleteAllJobs);

// DELETE /api/jobs/:id - Delete job
router.delete('/:id', deleteJob);

export default router;
