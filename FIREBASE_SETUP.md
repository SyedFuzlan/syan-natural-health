# Firebase Setup Guide for SYAN Nutrition App

## Overview
This guide will help you set up Firebase for real-time data storage and analytics in your SYAN nutrition app.

## Step 1: Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Create a project"
3. Enter project name: `syan-nutrition-app`
4. Enable Google Analytics (optional)
5. Click "Create project"

## Step 2: Set up Firestore Database

1. In your Firebase project, go to "Firestore Database"
2. Click "Create database"
3. Choose "Start in test mode" (for development)
4. Select a location close to your users
5. Click "Done"

## Step 3: Get Firebase Configuration

1. Go to Project Settings (gear icon)
2. Scroll down to "Your apps"
3. Click "Web" icon (</>) to add a web app
4. Register app name: `syan-nutrition-web`
5. Copy the Firebase configuration object

## Step 4: Update Firebase Configuration

Replace the placeholder values in `src/utils/firebase.ts` with your actual Firebase config:

```typescript
const firebaseConfig = {
  apiKey: "your-actual-api-key",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-actual-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "your-sender-id",
  appId: "your-app-id"
};
```

## Step 5: Set up Firestore Security Rules

In Firestore Database > Rules, update the rules:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow read/write access to user_analytics collection
    match /user_analytics/{document} {
      allow read, write: if true; // For development only
    }
  }
}
```

**Important**: For production, implement proper authentication and security rules.

## Step 6: Test the Integration

1. Run your app: `npm run dev`
2. Fill out the nutrition calculator form
3. Check the admin dashboard - you should see "Live" status if Firebase is connected
4. Check your Firestore console to see the stored data

## Features Enabled

✅ **Real-time Data Storage**: All user calculations are automatically saved to Firebase
✅ **Live Admin Dashboard**: Real-time updates without page refresh
✅ **Data Persistence**: Data survives browser refreshes and is accessible across devices
✅ **Backup**: Automatic fallback to localStorage if Firebase is unavailable

## Security Considerations

- The current setup is for development only
- For production, implement proper authentication
- Set up proper Firestore security rules
- Consider data privacy regulations (GDPR, CCPA)
- Implement user consent for data collection

## Troubleshooting

**Firebase not connecting?**
- Check your API key and project ID
- Ensure Firestore is enabled in your Firebase project
- Check browser console for error messages

**Data not appearing in admin dashboard?**
- Verify Firebase configuration is correct
- Check that Firestore rules allow read/write access
- Look for error messages in browser console

## Environment Variables (Optional)

For better security, you can use environment variables:

1. Create `.env.local` file:
```
VITE_FIREBASE_API_KEY=your-api-key
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
```

2. Update `firebase.ts` to use environment variables:
```typescript
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  // ... other config
};
```

## Support

If you encounter issues, check:
- [Firebase Documentation](https://firebase.google.com/docs)
- [Firestore Getting Started](https://firebase.google.com/docs/firestore/quickstart)
- Browser developer console for error messages
