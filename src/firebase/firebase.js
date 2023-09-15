import { async } from "regenerator-runtime";
import { app } from "./firebaseConfig.js";
import {
  getAuth,
  signInWithEmailAndPassword,
  setPersistence,
  browserLocalPersistence,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";

import { app } from "./firebaseConfig.js";

const auth = getAuth(app);

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
// "abf.ferreirac@gmail.com", "123456789"
