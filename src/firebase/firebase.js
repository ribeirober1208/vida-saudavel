import { async } from 'regenerator-runtime';
import { app } from './firebaseConfig.js';
import {
  getAuth,
  signInWithEmailAndPassword,
  setPersistence,
  browserLocalPersistence
} from "firebase/auth";

const auth = getAuth(app);


export const loginUser = async (email, password) => {
  try {
    await setPersistence(auth, browserLocalPersistence);
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    console.log("Login bem-sucedido!", userCredential.user);
    return userCredential.user;
  } catch (error) {
    console.error("Erro no login:", error.code, error.message);
    throw error;
  }
};

// "abf.ferreirac@gmail.com", "123456789"