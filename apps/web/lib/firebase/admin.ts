import { initializeApp, getApps, cert, type App } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { getFirestore } from 'firebase-admin/firestore';

function getAdminApp(): App {
  if (getApps().length > 0) return getApps()[0];

  const privateKey = process.env.FIREBASE_ADMIN_PRIVATE_KEY?.replace(/\\n/g, '\n');

  return initializeApp({
    credential: cert({
      projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
      privateKeyId: process.env.FIREBASE_ADMIN_PRIVATE_KEY_ID,
      privateKey,
      clientEmail: process.env.FIREBASE_ADMIN_CLIENT_EMAIL,
      clientId: process.env.FIREBASE_ADMIN_CLIENT_ID,
    } as Parameters<typeof cert>[0]),
  });
}

export const adminAuth = () => getAuth(getAdminApp());
export const adminDb = () => getFirestore(getAdminApp());
