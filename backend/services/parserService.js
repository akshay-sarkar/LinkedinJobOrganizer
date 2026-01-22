/**
 * Parse LinkedIn job alert emails and extract job information
 * LinkedIn sends HTML emails with job listings
 */

import * as cheerio from 'cheerio';

/**
 * List of non-job text patterns to filter out
 */
const EXCLUDED_TITLES = [
  'learn why',
  'unsubscribe',
  'manage job alerts',
  'help',
  'view all',
  'see all',
  'view more',
  'privacy policy',
  'terms of service',
  'linkedin',
  'job alert',
  'this email was',
  'you received this',
];

/**
 * Check if a string looks like a valid job title
 */
const isValidJobTitle = (title) => {
  if (!title || title.length < 3 || title.length > 200) return false;

  const lowerTitle = title.toLowerCase();

  // Exclude navigation/footer links
  if (EXCLUDED_TITLES.some(excluded => lowerTitle.includes(excluded))) {
    return false;
  }

  // Exclude strings that are mostly special characters or numbers
  const alphaCount = (title.match(/[a-zA-Z]/g) || []).length;
  if (alphaCount < title.length * 0.5) return false;

  return true;
};

/**
 * Check if a string looks like a valid company name
 */
const isValidCompany = (company) => {
  if (!company || company.length < 2 || company.length > 150) return false;

  const lowerCompany = company.toLowerCase();

  // Exclude common non-company strings
  const excluded = ['linkedin', 'unsubscribe', 'help', 'privacy', 'terms', 'view', 'see all'];
  if (excluded.some(ex => lowerCompany === ex)) return false;

  // Should not contain HTML attributes or excessive special characters
  if (company.includes('style=') || company.includes('class=')) return false;

  return true;
};

/**
 * Clean text by removing extra whitespace and HTML entities
 */
const cleanText = (text) => {
  if (!text) return '';
  return text
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&#\d+;/g, '')
    .replace(/\s+/g, ' ')
    .trim();
};

/**
 * Extract job listings from LinkedIn email HTML
 * @param {Object} email - Parsed email object
 * @returns {Array} Array of job objects
 */
const parseLinkedInEmail = (email) => {
  const { html, text, subject, date } = email;
  const jobs = [];

  try {
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
 * Parse HTML content from LinkedIn email using cheerio
 * @param {string} html - HTML content
 * @param {string} subject - Email subject
 * @param {Date} date - Email date
 * @returns {Array} Array of job objects
 */
const parseHTMLContent = (html, subject, date) => {
  const jobs = [];
  const seenUrls = new Set();

  try {
    const $ = cheerio.load(html);

    // LinkedIn job URLs pattern
    const jobUrlPattern = /linkedin\.com\/comm\/jobs\/view\/(\d+)/;

    // Find all links that point to LinkedIn job pages
    $('a[href*="linkedin.com/comm/jobs/view"]').each((index, element) => {
      const $link = $(element);
      const href = $link.attr('href');

      if (!href || seenUrls.has(href)) return;

      const urlMatch = href.match(jobUrlPattern);
      if (!urlMatch) return;

      seenUrls.add(href);

      // Get the link text as potential job title
      let title = '';

      // Strategy 0: Look for specific title elements INSIDE the link first
      // This handles cases where the link wraps the whole card
      const $internalHeading = $link.find('h1, h2, h3, h4, div.font-bold, strong, b').first();
      if ($internalHeading.length) {
        title = cleanText($internalHeading.text());
      }

      // Fallback: Use link text if no internal heading found
      if (!title || !isValidJobTitle(title)) {
        title = cleanText($link.text());
      }

      // If text is still not a valid title, look for nearby text
      if (!isValidJobTitle(title)) {
        // Look for title in parent or sibling elements
        const $parent = $link.parent();
        const $grandparent = $parent.parent();

        // Try to find a heading or strong text nearby
        const $heading = $grandparent.find('h1, h2, h3, h4, strong, b').first();
        if ($heading.length) {
          const headingText = cleanText($heading.text());
          if (isValidJobTitle(headingText)) {
            title = headingText;
          }
        }
      }

      // Look for company name
      let company = null;

      // Strategy 1: Look for text after "at" or "·" pattern
      const $container = $link.closest('tr, div, td').first();
      // Get text from likely container elements, preserving structure
      const containerText = $container.text();

      // Pattern: "Job Title at Company Name"
      const atMatch = containerText.match(/at\s+([A-Za-z][A-Za-z0-9\s&.,'-]+?)(?:\s*[·|•|\-|–]|\s*\n|$)/i);
      if (atMatch && isValidCompany(atMatch[1])) {
        company = cleanText(atMatch[1]);
      }

      // Strategy 1.5: Look for "Company · Location" pattern in specific elements
      if (!company) {
        // Instead of checking the whole container text (which includes title), 
        // check individual text nodes or elements for the pattern
        $container.find('*').each((i, el) => {
          if (company) return;
          const $el = $(el);
          // Only check leaf elements (no children) to avoid checking container text
          if ($el.children().length > 0) return;

          // Check identifying children directly to avoid merging unrelated text
          const text = $el.text();
          const dotMatch = text.match(/^\s*([A-Za-z0-9\s&.,'-]+?)\s+[·|•]\s+([A-Za-z\s,()]+)/);

          if (dotMatch) {
            const potentialCompany = cleanText(dotMatch[1]);
            // Validate: company shouldn't be the same as title, and should be short
            if (isValidCompany(potentialCompany) && potentialCompany !== title && potentialCompany.length < 50) {
              company = potentialCompany;
            }
          }
        });
      }

      // Strategy 2: Look for company in sibling/nearby elements
      if (!company) {
        // LinkedIn often puts company in a separate element after the job title
        const $siblings = $link.parent().siblings();
        $siblings.each((i, sib) => {
          if (company) return;
          const sibText = cleanText($(sib).text());
          // Company names are usually short and don't look like job titles
          if (sibText.length > 2 && sibText.length < 100 &&
            !sibText.includes('ago') && !sibText.includes('Applied') &&
            isValidCompany(sibText)) {
            company = sibText;
          }
        });
      }

      // Strategy 3: Look for company logo alt text
      if (!company) {
        const $img = $container.find('img[alt]');
        $img.each((i, img) => {
          if (company) return;
          const alt = $(img).attr('alt');
          if (alt && alt.length > 2 && alt.length < 100 &&
            !alt.toLowerCase().includes('linkedin') && isValidCompany(alt)) {
            company = cleanText(alt);
          }
        });
      }

      // Look for location
      let location = null;

      // Pattern: "City, State" or "City, Country"
      const locationMatch = containerText.match(/([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*,\s*[A-Z]{2,}(?:\s+\([^)]+\))?)/);
      if (locationMatch) {
        location = cleanText(locationMatch[1]);
      }

      // Strategy: Look for "Company · Location" pattern again for location
      if (!location) {
        const dotMatch = containerText.match(/[·|•]\s+([A-Za-z\s,()]+)/);
        if (dotMatch) {
          // Heuristic: location often contains City or (Remote/Hybrid)
          const text = cleanText(dotMatch[1]);
          if (text.includes(',') || text.includes('(') || text.length < 50) {
            location = text;
          }
        }
      }

      // Alternative location pattern: look for Remote, Hybrid, etc.
      if (!location) {
        // Capture "Stockholm (Hybrid)" or just "Hybrid"
        const remoteMatch = containerText.match(/([A-Z][a-zA-Z\s]+)\s*\((Remote|Hybrid|On-site|Onsite)\)/i);
        if (remoteMatch) {
          location = cleanText(remoteMatch[0]);
        } else {
          const simpleRemote = containerText.match(/(Remote|Hybrid|On-site|Onsite)(?:\s+in\s+([^·\n]+))?/i);
          if (simpleRemote) {
            location = cleanText(simpleRemote[0]);
          }
        }
      }

      // Check for Easy Apply
      let isEasyApply = false;
      const easyApplyMatch = containerText.match(/Easy Apply/i);
      if (easyApplyMatch) {
        isEasyApply = true;
      }

      // Only add if we have a valid title
      if (isValidJobTitle(title)) {
        const job = {
          title: title,
          company: company || 'Unknown Company',
          location: location,
          jobUrl: href,
          emailSubject: subject,
          emailDate: date,
          isEasyApply: isEasyApply,
          rawEmailBody: html, // Store full HTML, no character limit
        };
        jobs.push(job);
      }
    });

    // Fallback: If cheerio parsing found no jobs, try regex patterns
    if (jobs.length === 0) {
      jobs.push(...parseHTMLWithRegex(html, subject, date));
    }

    console.log(`📊 Extracted ${jobs.length} jobs from HTML`);
  } catch (error) {
    console.error('Error parsing HTML:', error);
  }

  return jobs;
};

/**
 * Fallback regex-based HTML parsing
 */
const parseHTMLWithRegex = (html, subject, date) => {
  const jobs = [];
  const seenUrls = new Set();

  try {
    // Find all LinkedIn job URLs
    const urlPattern = /https?:\/\/(?:www\.)?linkedin\.com\/comm\/jobs\/view\/[\w\-?=&%]+/gi;
    const urls = [...new Set(html.match(urlPattern) || [])];

    // For each URL, try to extract surrounding context
    urls.forEach(url => {
      if (seenUrls.has(url)) return;
      seenUrls.add(url);

      // Find the position of this URL in the HTML
      const urlIndex = html.indexOf(url);
      if (urlIndex === -1) return;

      // Get surrounding context (500 chars before and after)
      const start = Math.max(0, urlIndex - 500);
      const end = Math.min(html.length, urlIndex + url.length + 500);
      const context = html.substring(start, end);

      // Extract text content from context (strip HTML tags)
      const textContent = context.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ');

      // Try to find job title - usually appears before the URL
      let title = null;
      const titlePatterns = [
        /([A-Z][a-zA-Z\s\-\/&,]+(?:Engineer|Developer|Manager|Designer|Analyst|Specialist|Lead|Director|Architect|Consultant|Associate|Coordinator|Administrator))/,
        /([A-Z][a-zA-Z\s\-\/&,]{5,50})\s+at\s+/,
      ];

      for (const pattern of titlePatterns) {
        const match = textContent.match(pattern);
        if (match && isValidJobTitle(match[1])) {
          title = cleanText(match[1]);
          break;
        }
      }

      // Try to find company
      let company = null;
      const companyMatch = textContent.match(/at\s+([A-Za-z][A-Za-z0-9\s&.,'-]+?)(?:\s*[·|•|\-|–]|\s+\d|\s*$)/i);
      if (companyMatch && isValidCompany(companyMatch[1])) {
        company = cleanText(companyMatch[1]);
      }

      // Try to find location
      let location = null;
      const locationMatch = textContent.match(/([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*,\s*[A-Z]{2,})/);
      if (locationMatch) {
        location = cleanText(locationMatch[1]);
      }

      if (title) {
        jobs.push({
          title,
          company: company || 'Unknown Company',
          location,
          jobUrl: url,
          emailSubject: subject,
          emailDate: date,
          rawEmailBody: html,
        });
      }
    });
  } catch (error) {
    console.error('Error in regex HTML parsing:', error);
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
  const seenUrls = new Set();

  try {
    // Extract LinkedIn job URLs
    const urlPattern = /https?:\/\/(?:www\.)?linkedin\.com\/comm\/jobs\/view\/[\w\-?=&%]+/gi;
    const urls = text.match(urlPattern) || [];

    // Split text into sections around each URL
    urls.forEach(url => {
      if (seenUrls.has(url)) return;
      seenUrls.add(url);

      const urlIndex = text.indexOf(url);
      if (urlIndex === -1) return;

      // Get context around the URL
      const start = Math.max(0, urlIndex - 300);
      const end = Math.min(text.length, urlIndex + 300);
      const context = text.substring(start, end);

      // Split into lines and look for job info
      const lines = context.split('\n').map(l => l.trim()).filter(l => l.length > 0);

      let title = null;
      let company = null;
      let location = null;

      // Look for patterns in lines before the URL
      for (const line of lines) {
        if (!title && isValidJobTitle(line) && line.length < 100) {
          title = line;
          continue;
        }

        if (title && !company) {
          // Check for "at Company" pattern
          const atMatch = line.match(/^at\s+(.+)$/i);
          if (atMatch && isValidCompany(atMatch[1])) {
            company = atMatch[1];
            continue;
          }
          // Or just the company name on its own line
          if (isValidCompany(line) && line.length < 100) {
            company = line;
            continue;
          }
        }

        if (!location) {
          const locationMatch = line.match(/^([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*,\s*[A-Z]{2,})$/);
          if (locationMatch) {
            location = locationMatch[1];
          }
        }
      }

      if (title) {
        jobs.push({
          title,
          company: company || 'Unknown Company',
          location,
          jobUrl: url,
          emailSubject: subject,
          emailDate: date,
          rawEmailBody: text,
        });
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
  let location = job.location?.trim() || null;

  if (location) {
    // Regex to identify noise at the end of the location string
    // Handles case-insensitivity, partial matches (like "Actively r"), and explicit requested patterns
    const noisePattern = /(?:\s+|^)(?:Actively|Easy App|Be an early|See more|View job|\(On|\d*[a-z]?\s+ago|\bago).*/i;

    location = location.replace(noisePattern, '').trim();

    // Clean up any double spaces created
    location = location.replace(/\s+/g, ' ').trim();
  }

  return {
    title: job.title?.trim() || 'N/A',
    company: job.company?.trim() || 'Unknown Company',
    location: location,
    jobUrl: job.jobUrl || null,
    description: job.description?.trim() || null,
    employmentType: job.employmentType || null,
    experienceLevel: job.experienceLevel || null,
    salary: job.salary || null,
    emailSubject: job.emailSubject || null,
    emailDate: job.emailDate || new Date(),
    rawEmailBody: job.rawEmailBody || null,
    isEasyApply: job.isEasyApply || false,
  };
};

export { parseLinkedInEmail, cleanJobData };
