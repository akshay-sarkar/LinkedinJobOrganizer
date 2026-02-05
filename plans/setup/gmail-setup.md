# Gmail App Password Setup Guide

## What is a Gmail App Password?

A Gmail App Password is a 16-digit code that allows third-party applications to access your Gmail account securely without using your main password. This is required for our LinkedIn Job Organizer to read your job alert emails.

---

## Prerequisites

- You must have a Gmail account
- 2-Step Verification must be enabled on your account
- App Passwords only work with accounts that have 2-Step Verification turned on

---

## Step 1: Enable 2-Step Verification

### 1.1 Access Google Account Security Settings

1. Open your web browser and go to: **https://accounts.google.com**
2. Sign in to your Gmail account if you haven't already
3. Click on **"Security"** in the left sidebar

### 1.2 Enable 2-Step Verification

1. Scroll down to the **"How you sign in to Google"** section
2. Look for **"2-Step Verification"** and click on it
3. Click the **"Get Started"** button
4. Follow the on-screen instructions to verify your identity
5. Enter your phone number
6. Choose how to receive verification codes:
   - Text message (SMS)
   - Phone call
7. Click **"Next"**
8. Enter the verification code you received
9. Click **"Next"** again
10. Click **"Turn On"** to enable 2-Step Verification

---

## Step 2: Generate App Password

### 2.1 Access App Passwords Page

1. Go directly to: **https://myaccount.google.com/apppasswords**
2. You may need to sign in again to verify your identity

**Alternative Method:**
- If the direct link doesn't work:
  1. Go to **https://myaccount.google.com**
  2. Click on **"Security"** in the left menu
  3. In the search bar, type **"App Password"**
  4. Select **"App Passwords"** from the dropdown

### 2.2 Create the App Password

1. Under **"Select app"** dropdown, choose **"Other (Custom name)"**
2. Enter a descriptive name (e.g., "LinkedIn Job Organizer")
3. Click **"Generate"**

### 2.3 Copy Your App Password

1. Google will display a **16-character password** in a yellow box
2. **IMPORTANT:** Copy this password immediately and save it securely
3. **DO NOT** click "Done" until you've copied the password
4. Once you close this window, you won't be able to see this password again

**Example format:** `abcd efgh ijkl mnop` (4 groups of 4 characters)

---

## Step 3: Use the App Password in LinkedIn Job Organizer

### 3.1 Configure the Backend .env File

1. Navigate to the `backend` folder in your project
2. Create a `.env` file (copy from `.env.example`)
3. Add your Gmail credentials:

```
GMAIL_USER=your-email@gmail.com
GMAIL_APP_PASSWORD=abcdefghijklmnop
```

**Note:** Remove all spaces when entering the app password in the `.env` file

### 3.2 Security Best Practices

- Never share your app password with anyone
- Never commit the `.env` file to GitHub
- The `.gitignore` file is already configured to exclude `.env`
- If you suspect your app password is compromised, revoke it and generate a new one

---

## Troubleshooting

### Can't Find App Password Option?

- Make sure 2-Step Verification is enabled first
- Some Google Workspace accounts may have this feature disabled by administrators
- Try using the search bar in Google Account Security settings

### App Password Not Working?

- Ensure you copied the entire 16-character password without spaces
- Check that IMAP is enabled in Gmail settings:
  1. Go to Gmail
  2. Click the gear icon (Settings)
  3. Select "See all settings"
  4. Go to "Forwarding and POP/IMAP" tab
  5. Enable IMAP
  6. Click "Save Changes"

### Need to Revoke an App Password?

1. Go to **https://myaccount.google.com/apppasswords**
2. Find the app password you want to revoke
3. Click the trash/delete icon next to it
4. Confirm the deletion

---

## Additional Resources

- [Official Google Support - Sign in with app passwords](https://support.google.com/mail/answer/185833?hl=en)
- [Google Account App Passwords Page](https://myaccount.google.com/apppasswords)

---

## Summary Checklist

- [ ] Enable 2-Step Verification on your Gmail account
- [ ] Generate an App Password for "LinkedIn Job Organizer"
- [ ] Copy and save the 16-character password securely
- [ ] Add the password to your `backend/.env` file
- [ ] Ensure IMAP is enabled in Gmail settings
- [ ] Test the connection when running the application

---

**Created for LinkedIn Job Alert Organizer Project**

Last Updated: January 2026
