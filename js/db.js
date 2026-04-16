import { initializeApp } from "firebase/app";
import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  doc,
  updateDoc,
  deleteDoc,
  onSnapshot,
  query,
  orderBy,
  where,
} from "firebase/firestore";
import firebaseConfig from "./config.js";

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const usersCol = collection(db, "users");

/**
 * Add a new user to Firestore
 */
export const addUser = async (userData) => {
  try {
    const docRef = await addDoc(usersCol, {
      ...userData,
      createdAt: new Date(),
    });
    return docRef.id;
  } catch (error) {
    console.error("Error adding document: ", error);
    throw error;
  }
};

/**
 * Update an existing user in Firestore
 */
export const updateUser = async (id, userData) => {
  try {
    const userRef = doc(db, "users", id);
    await updateDoc(userRef, userData);
  } catch (error) {
    console.error("Error updating document: ", error);
    throw error;
  }
};

/**
 * Delete a user from Firestore
 */
export const deleteUser = async (id) => {
  try {
    const userRef = doc(db, "users", id);
    await deleteDoc(userRef);
  } catch (error) {
    console.error("Error deleting document: ", error);
    throw error;
  }
};

/**
 * Subscribe to real-time updates of users
 */
export const subscribeToUsers = (callback, onError) => {
  const q = query(usersCol, orderBy("createdAt", "desc"));
  return onSnapshot(
    q,
    (snapshot) => {
      const users = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      callback(users);
    },
    (error) => {
      console.error("Firestore subscription error:", error);
      if (onError) onError(error);
    },
  );
};

/**
 * Check if email or mobile already exists
 */
export const checkUniqueness = async (email, mobile, excludeId = null) => {
  try {
    // Check Email
    const emailQ = query(usersCol, where("email", "==", email));
    const emailSnap = await getDocs(emailQ);
    const emailConflict = emailSnap.docs.find((doc) => doc.id !== excludeId);

    if (emailConflict)
      return { field: "email", message: "This email is already registered." };

    // Check Mobile
    const mobileQ = query(usersCol, where("mobile", "==", mobile));
    const mobileSnap = await getDocs(mobileQ);
    const mobileConflict = mobileSnap.docs.find((doc) => doc.id !== excludeId);

    if (mobileConflict)
      return {
        field: "mobile",
        message: "This mobile number is already registered.",
      };

    return null;
  } catch (error) {
    console.error("Uniqueness check error:", error);
    return null;
  }
};
