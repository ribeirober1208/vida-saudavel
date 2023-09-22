import {
  addDoc,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  onSnapshot,
  orderBy,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { db, dbPosts, dbUsers } from "./firebaseConfig";
import { getCurrentUserInfo } from "./firebase";

export const createUserInfo = async (name, email) => {
  await addDoc(dbUsers, {
    name,
    email,
  });
};

export const getUserByEmail = async (email) =>
  await getDocs(query(dbUsers, where("email", "==", email)));

// esta função é responsável por adicionar um novo post no banco de dados. Ela recebe como parâmetro o nome do usuário, o email do usuário, a mensagem e a quantidade de curtidas. Ela usa a função addDoc do firebase para adicionar um novo documento no banco de dados. O primeiro parâmetro é a coleção que queremos adicionar o documento. O segundo parâmetro é um objeto com os dados que queremos adicionar. O id é gerado automaticamente pelo firebase.
export const addNewPostToDb = async (message, likes = 0) => {
  try {
    const { user, userEmail } = await getCurrentUserInfo();

    console.log({
      user,
      userEmail,
      message,
      likes,
      createdAt: new Date(),
    });

    await addDoc(dbPosts, {
      user,
      userEmail,
      message,
      likes,
      createdAt: new Date(),
    });
  } catch (e) {
    console.error("Error adding document: ", e);
  }
};

//Esta função chamada updateLike é uma função assíncrona (async) que toma um id como argumento e tem o objetivo de atualizar a quantidade de curtidas (likes) e a lista de usuários que curtiram um post em um banco de dados Firestore.
export const updateLike = async (id) => {
  try {
    const postRef = doc(db, "posts", id);

    const docSnap = await getDoc(postRef);
    const { userEmail } = await getCurrentUserInfo();

    if (docSnap.exists()) {
      let likes = docSnap.data().likes || 0;
      let likesUsers = docSnap.data().likesUsers || [];

      if (!likesUsers.includes(userEmail)) {
        likes += 1;
        likesUsers.push(userEmail);

        await updateDoc(postRef, { likes, likesUsers, updatedAt: new Date() });
      } else {
        likes -= 1;
        const likesUserWithoutMe = likesUsers.filter(
          (item) => item !== userEmail
        );
        likesUsers = likesUserWithoutMe;
        await updateDoc(postRef, { likes, likesUsers, updatedAt: new Date() });
      }
    } else {
      console.log("No such document!");
    }
  } catch (e) {
    console.error("Error updating document: ", e);
  }
};

//Esta função chamada setupPostsSnapshot é utilizada para configurar um observador (snapshot listener) que monitora em tempo real as mudanças nos documentos em uma coleção específica (presumivelmente uma coleção de posts) no Firestore, e renderiza os posts quando há alguma alteração.
export const setupPostsSnapshot = (callback) => {
  const q = query(dbPosts, orderBy("createdAt", "asc"));
  onSnapshot(q, (snapshot) => {
    const posts = [];
    snapshot.forEach((doc) => {
      posts.push({ ...doc.data(), id: doc.id });
    });
    callback && callback(posts);
  });
};

// Esta função é responsável por excluir um post do banco de dados com base em seu ID.
export const deletePostFromDb = async (postId) => {
  try {
    const postRef = doc(db, "posts", postId);
    const docSnap = await getDoc(postRef);

    if (docSnap.exists()) {
      await deleteDoc(postRef);
    }
  } catch (e) {
    console.error("Erro ao excluir post: ", e);
  }
};
