# Firebase Authentication Setup Guide

This guide explains how to set up Firebase Authentication with Google Sign-In for the LinkedIn Job Organizer application.

## Prerequisites

- A Google account
- Node.js installed on your machine
- The LinkedIn Job Organizer frontend-next project

## Step 1: Create a Firebase Project

1. Go to the [Firebase Console](https://console.firebase.google.com/)
2. Click **Add project**
3. Enter a project name (e.g., "LinkedIn Job Organizer")
4. (Optional) Enable Google Analytics
5. Click **Create project**

## Step 2: Register Your Web App

1. In the Firebase Console, click the **Web** icon (`</>`) to add a web app
2. Enter an app nickname (e.g., "LinkedIn Job Organizer Web")
3. (Optional) Check "Also set up Firebase Hosting"
4. Click **Register app**
5. **Copy the Firebase configuration** - you'll need these values:

```javascript
const firebaseConfig = {
  apiKey: "AIza...",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abc123"
};
```

## Step 3: Enable Google Sign-In

1. In the Firebase Console, go to **Authentication** > **Sign-in method**
2. Click **Google** in the providers list
3. Toggle **Enable**
4. Select a **Project support email** (your email)
5. Click **Save**

## Step 4: Configure Authorized Domains

1. In **Authentication** > **Settings** > **Authorized domains**
2. Ensure `localhost` is in the list (it should be by default)
3. Add any production domains you'll be using

## Step 5: Set Up Environment Variables

1. Copy the example environment file:
   ```bash
   cp .env.local.example .env.local
   ```

2. Edit `.env.local` with your Firebase configuration:
   ```env
   NEXT_PUBLIC_FIREBASE_API_KEY=AIza...
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
   NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789:web:abc123
   ```

## Step 6: Restart the Development Server

After adding the environment variables, restart your development server:

```bash
npm run dev
```

## Usage

### Sign In

Click the **Sign In with Google** button in the header. A popup will appear for Google authentication.

### Sign Out

When signed in, click the **Sign Out** button next to your profile picture.

## Project Files

The Firebase authentication is implemented in these files:

| File | Description |
|------|-------------|
| `src/lib/firebase.js` | Firebase initialization and auth functions |
| `src/providers/AuthProvider.jsx` | React context for auth state management |
| `src/app/layout.jsx` | Wraps app with AuthProvider |
| `src/components/layout/Header.jsx` | Shows user avatar and sign in/out buttons |

## Security Notes

1. **Never commit `.env.local`** - It's already in `.gitignore`
2. **Firebase API keys are safe to expose** - Firebase uses security rules to protect data
3. **Set up Security Rules** - Configure Firestore/Realtime Database rules if you use them

## Troubleshooting

### "Firebase: Error (auth/popup-closed-by-user)"
The user closed the sign-in popup before completing authentication. Try again.

### "Firebase: Error (auth/unauthorized-domain)"
Your domain isn't in the authorized domains list. Add it in:
Firebase Console > Authentication > Settings > Authorized domains

### "Firebase: Error (auth/configuration-not-found)"
Check that your environment variables are set correctly and restart the dev server.

### User Photo Not Loading
Ensure `lh3.googleusercontent.com` is in `next.config.js` image domains (already configured).

## Advanced: Protected Routes

To protect routes that require authentication, create a middleware or wrapper component:

```jsx
'use client';

import { useAuth } from '@/providers/AuthProvider';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return user ? children : null;
}
```

## Additional Resources

- [Firebase Authentication Docs](https://firebase.google.com/docs/auth)
- [Firebase Web Setup Guide](https://firebase.google.com/docs/web/setup)
- [Next.js Environment Variables](https://nextjs.org/docs/basic-features/environment-variables)
