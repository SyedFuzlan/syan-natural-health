import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc, getDocs, deleteDoc, doc, onSnapshot, query, orderBy } from 'firebase/firestore';
import { AnalyticsData } from '../types';

// Firebase configuration - Replace with your actual config
const firebaseConfig = {
  apiKey: "your-api-key-here",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "123456789",
  appId: "your-app-id"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Collection name
const COLLECTION_NAME = 'user_analytics';

export const firebaseService = {
  // Add user data to Firebase
  async addUserData(data: AnalyticsData): Promise<void> {
    try {
      await addDoc(collection(db, COLLECTION_NAME), {
        ...data,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error('Error adding user data to Firebase:', error);
      throw error;
    }
  },

  // Get all user data from Firebase
  async getUserData(): Promise<AnalyticsData[]> {
    try {
      const q = query(collection(db, COLLECTION_NAME), orderBy('timestamp', 'desc'));
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          timestamp: data.timestamp,
          userName: data.userName,
          demographics: data.demographics,
          results: data.results
        } as AnalyticsData;
      });
    } catch (error) {
      console.error('Error fetching user data from Firebase:', error);
      throw error;
    }
  },

  // Real-time listener for user data
  onUserDataChange(callback: (data: AnalyticsData[]) => void): () => void {
    const q = query(collection(db, COLLECTION_NAME), orderBy('timestamp', 'desc'));
    
    return onSnapshot(q, (querySnapshot) => {
      const data = querySnapshot.docs.map(doc => {
        const docData = doc.data();
        return {
          id: doc.id,
          timestamp: docData.timestamp,
          userName: docData.userName,
          demographics: docData.demographics,
          results: docData.results
        } as AnalyticsData;
      });
      callback(data);
    }, (error) => {
      console.error('Error in real-time listener:', error);
    });
  },

  // Clear all user data
  async clearAllData(): Promise<void> {
    try {
      const querySnapshot = await getDocs(collection(db, COLLECTION_NAME));
      const deletePromises = querySnapshot.docs.map(document => 
        deleteDoc(doc(db, COLLECTION_NAME, document.id))
      );
      await Promise.all(deletePromises);
    } catch (error) {
      console.error('Error clearing Firebase data:', error);
      throw error;
    }
  },

  // Check if Firebase is configured
  isConfigured(): boolean {
    return firebaseConfig.apiKey !== "your-api-key-here";
  }
};
