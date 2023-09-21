import {
  getAuth,
  signInWithEmailAndPassword,
  setPersistence,
  browserLocalPersistence,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";

import { app } from "./firebaseConfig.js";
import { getUserByEmail } from "./firestore.js";

export const auth = getAuth(app);

export const loginUser = async (email, password) => {
  try {
    await setPersistence(auth, browserLocalPersistence);
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );
    return userCredential.user;
  } catch (error) {
    throw error;
  }
};

export const loginWithGoogle = async () => {
  try {
    return await signInWithPopup(auth, new GoogleAuthProvider());
  } catch (error) {
    throw error;
  }
};

export const getCurrentUserInfo = async () => {
  const userEmail = auth.currentUser.email;

  const userDoc = await getUserByEmail(userEmail);
  const userDocData = userDoc.docs[0].data();

  const user = userDocData.name;

  return {
    userEmail,
    user,
  };
};
// "abf.ferreirac@gmail.com", "123456789"
