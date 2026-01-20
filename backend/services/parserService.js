/**
 * Parse LinkedIn job alert emails and extract job information
 * LinkedIn sends HTML emails with job listings
 */

/**
 * Extract job listings from LinkedIn email HTML
 * @param {Object} email - Parsed email object
 * @returns {Array} Array of job objects
 */
const parseLinkedInEmail = (email) => {
  const { html, text, subject, date } = email;
  const jobs = [];

  try {
    // LinkedIn emails contain job information in specific patterns
    // We'll extract: title, company, location, URL

    // Method 1: Parse HTML content (more reliable)
    if (html) {
      jobs.push(...parseHTMLContent(html, subject, date));
    }

    // Method 2: Fallback to plain text if HTML parsing fails
    if (jobs.length === 0 && text) {
      jobs.push(...parseTextContent(text, subject, date));
    }

    return jobs;
  } catch (error) {
    console.error('Error parsing LinkedIn email:', error);
    return [];
  }
};

/**
 * Parse HTML content from LinkedIn email
 * @param {string} html - HTML content
 * @param {string} subject - Email subject
 * @param {Date} date - Email date
 * @returns {Array} Array of job objects
 */
const parseHTMLContent = (html, subject, date) => {
  const jobs = [];

  try {
    // LinkedIn job URLs pattern: https://www.linkedin.com/comm/jobs/view/
    const urlPattern = /https?:\/\/(www\.)?linkedin\.com\/comm\/jobs\/view\/[\w\-?=&]+/gi;
    const urls = html.match(urlPattern) || [];

    // Extract job title - usually in <a> tags or specific classes
    // Pattern: Job title is often before the company name
    const titlePattern = /<a[^>]*>([^<]+)<\/a>/gi;
    const titleMatches = [...html.matchAll(titlePattern)];

    // Extract company names
    // LinkedIn format usually: "at Company Name"
    const companyPattern = /at\s+([A-Z][^<\n]+?)(?:<|$|\n)/gi;
    const companyMatches = [...html.matchAll(companyPattern)];

    // Extract locations
    const locationPattern = /([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*,\s*[A-Z]{2,})/g;
    const locationMatches = [...html.matchAll(locationPattern)];

    // Combine extracted data
    const maxJobs = Math.max(urls.length, titleMatches.length, companyMatches.length);

    for (let i = 0; i < maxJobs; i++) {
      const job = {
        title: titleMatches[i]?.[1]?.trim() || 'Title not found',
        company: companyMatches[i]?.[1]?.trim() || 'Company not found',
        location: locationMatches[i]?.[1]?.trim() || null,
        jobUrl: urls[i] || null,
        emailSubject: subject,
        emailDate: date,
        rawEmailBody: html.substring(0, 5000), // Store first 5000 chars for debugging
      };

      // Only add if we have at least a URL or title
      if (job.jobUrl || job.title !== 'Title not found') {
        jobs.push(job);
      }
    }

    console.log(`📊 Extracted ${jobs.length} jobs from HTML`);
  } catch (error) {
    console.error('Error parsing HTML:', error);
  }

  return jobs;
};

/**
 * Parse plain text content from LinkedIn email (fallback)
 * @param {string} text - Plain text content
 * @param {string} subject - Email subject
 * @param {Date} date - Email date
 * @returns {Array} Array of job objects
 */
const parseTextContent = (text, subject, date) => {
  const jobs = [];

  try {
    // Extract LinkedIn job URLs
    const urlPattern = /https?:\/\/(www\.)?linkedin\.com\/comm\/jobs\/view\/[\w\-?=&]+/gi;
    const urls = text.match(urlPattern) || [];

    // Split text into sections (LinkedIn usually separates jobs by blank lines)
    const sections = text.split(/\n\s*\n/);

    sections.forEach((section, index) => {
      // Try to find job title (usually first line or bold text)
      const lines = section.split('\n').filter(line => line.trim());

      if (lines.length > 0 && urls[index]) {
        const job = {
          title: lines[0]?.trim() || 'Title not found',
          company: lines[1]?.trim() || 'Company not found',
          location: lines[2]?.trim() || null,
          jobUrl: urls[index],
          emailSubject: subject,
          emailDate: date,
          rawEmailBody: text.substring(0, 5000),
        };

        jobs.push(job);
      }
    });

    console.log(`📊 Extracted ${jobs.length} jobs from plain text`);
  } catch (error) {
    console.error('Error parsing text:', error);
  }

  return jobs;
};

/**
 * Clean and validate job data
 * @param {Object} job - Raw job object
 * @returns {Object} Cleaned job object
 */
const cleanJobData = (job) => {
  return {
    title: job.title?.trim() || 'N/A',
    company: job.company?.trim() || 'N/A',
    location: job.location?.trim() || null,
    jobUrl: job.jobUrl || null,
    description: job.description?.trim() || null,
    employmentType: job.employmentType || null,
    experienceLevel: job.experienceLevel || null,
    salary: job.salary || null,
    emailSubject: job.emailSubject || null,
    emailDate: job.emailDate || new Date(),
    rawEmailBody: job.rawEmailBody || null,
  };
};

export { parseLinkedInEmail, cleanJobData };
