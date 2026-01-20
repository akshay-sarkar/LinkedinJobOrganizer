import Imap from 'node-imap';
import { simpleParser } from 'mailparser';
import dotenv from 'dotenv';

dotenv.config();

// IMAP configuration for Gmail
const imapConfig = {
  user: process.env.GMAIL_USER,
  password: process.env.GMAIL_APP_PASSWORD,
  host: 'imap.gmail.com',
  port: 993,
  tls: true,
  tlsOptions: {
    rejectUnauthorized: false,
  },
};

/**
 * Fetch emails from Gmail inbox
 * @param {Object} options - Search options
 * @param {number} options.limit - Max emails to fetch (default: 10)
 * @param {string} options.searchCriteria - IMAP search criteria
 * @returns {Promise<Array>} Array of parsed email objects
 */
const fetchEmails = (options = {}) => {
  return new Promise((resolve, reject) => {
    const {
      limit = 10,
      searchCriteria = ['UNSEEN', ['FROM', 'jobalerts-noreply@linkedin.com']],
    } = options;

    const imap = new Imap(imapConfig);
    const emails = [];

    imap.once('ready', () => {
      console.log('📧 Connected to Gmail IMAP...');

      // Open inbox in read-only mode
      imap.openBox('INBOX', false, (err, box) => {
        if (err) {
          imap.end();
          return reject(err);
        }

        console.log(`📬 Inbox opened. Total messages: ${box.messages.total}`);

        // Search for LinkedIn job alert emails
        imap.search(searchCriteria, (err, results) => {
          if (err) {
            imap.end();
            return reject(err);
          }

          if (!results || results.length === 0) {
            console.log('📭 No new LinkedIn job alerts found.');
            imap.end();
            return resolve([]);
          }

          console.log(`🔍 Found ${results.length} LinkedIn job alert(s)`);

          // Limit results
          const fetchResults = results.slice(-limit);

          // Fetch email messages
          const fetch = imap.fetch(fetchResults, {
            bodies: '',
            markSeen: false, // Don't mark as read yet
          });

          fetch.on('message', (msg) => {
            msg.on('body', (stream) => {
              // Parse email using mailparser
              simpleParser(stream, (err, parsed) => {
                if (err) {
                  console.error('Error parsing email:', err);
                  return;
                }

                emails.push({
                  subject: parsed.subject,
                  from: parsed.from?.text,
                  date: parsed.date,
                  text: parsed.text,
                  html: parsed.html,
                  messageId: parsed.messageId,
                });
              });
            });
          });

          fetch.once('error', (err) => {
            console.error('Fetch error:', err);
            imap.end();
            reject(err);
          });

          fetch.once('end', () => {
            console.log('✅ Email fetch completed');
            imap.end();
          });
        });
      });
    });

    imap.once('error', (err) => {
      console.error('IMAP connection error:', err);
      reject(err);
    });

    imap.once('end', () => {
      console.log('📪 IMAP connection closed');
      resolve(emails);
    });

    // Connect to Gmail
    imap.connect();
  });
};

/**
 * Mark emails as read
 * @param {Array} messageIds - Array of message IDs to mark as read
 */
const markEmailsAsRead = (messageIds) => {
  return new Promise((resolve, reject) => {
    const imap = new Imap(imapConfig);

    imap.once('ready', () => {
      imap.openBox('INBOX', false, (err) => {
        if (err) {
          imap.end();
          return reject(err);
        }

        imap.search([['HEADER', 'MESSAGE-ID', messageIds[0]]], (err, results) => {
          if (err || !results.length) {
            imap.end();
            return reject(err || new Error('Email not found'));
          }

          imap.addFlags(results, '\\Seen', (err) => {
            imap.end();
            if (err) return reject(err);
            resolve();
          });
        });
      });
    });

    imap.once('error', reject);
    imap.connect();
  });
};

export { fetchEmails, markEmailsAsRead };
