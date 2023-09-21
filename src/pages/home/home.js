import {
  addDoc,
  query,
  onSnapshot,
  doc,
  deleteDoc,
  updateDoc,
  orderBy,
  getDoc,
} from "firebase/firestore";
import { db, dbPosts } from "../../firebase/firebaseConfig.js";
import { handleGetUserName, logout } from "../../main.js";
import { auth } from "../../firebase/firebase.js";
import { async } from "regenerator-runtime";

// o let userName e userEmail são variáveis globais que vão ser usadas em várias funções deste arquivo
let userName;
let userEmail;

// esta função é responsável por criar o template de cada post. Ela recebe como parâmetro o id, o nome do usuário, a mensagem e a quantidade de curtidas.
export const templatePostItem = (id, user, message, likes, email) => {
  // console.log(user,auth.currentUser.email, email)
  const handleAddPluralMessage = (likes) =>
    likes > 1 ? " curtidas" : " curtida";

  return `
    <div class="post"  data-id="${id}">
        <div class="user-info">
            <img src="./img/MaleUser.png" alt="user" class="user-icon">
            <p class="user-name">${user}</p>
        </div>
        <p class="post-text">${message}</p>
        <div class="post-interactions">
            <span class="count-likes">${likes}</span> <span class="count-likes-message">${handleAddPluralMessage(
    likes

  )}</span>
        </div>
        <div class="post-actions">
        ${email === auth.currentUser.email ?`
        <button class="action buttonDelete" data-action="delete" data-id="${id}">
            <img src="./img/excluir.png" class="icon-delete">
        </button>
    ` : ''}
            <button class="action" data-action="edit" data-id="${id}">
                <i class="icon">editar post</i>
            </button>
            <button class="action" data-action="like" data-id="${id}">
                <i class="icon">like action</i>
            </button>
        </div>
    </div>
`;
};

// esta função é responsável por adicionar um novo post no banco de dados. Ela recebe como parâmetro o nome do usuário, o email do usuário, a mensagem e a quantidade de curtidas. Ela usa a função addDoc do firebase para adicionar um novo documento no banco de dados. O primeiro parâmetro é a coleção que queremos adicionar o documento. O segundo parâmetro é um objeto com os dados que queremos adicionar. O id é gerado automaticamente pelo firebase.
export const addNewPostToDb = async (user, userEmail, message, likes) => {
  try {
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

    if (docSnap.exists()) {
      let likes = docSnap.data().likes || 0;
      let likesUsers = docSnap.data().likesUsers || [];

      if (!likesUsers.includes(userEmail)) {
        likes += 1;
        likesUsers.push(userEmail);

        await updateDoc(postRef, { likes, likesUsers, updatedAt: new Date() });
      } else {
        alert("Você já curtiu este post.");
      }
    } else {
      console.log("No such document!");
    }
  } catch (e) {
    console.error("Error updating document: ", e);
  }
};

//Esta função chamada setupPostsSnapshot é utilizada para configurar um observador (snapshot listener) que monitora em tempo real as mudanças nos documentos em uma coleção específica (presumivelmente uma coleção de posts) no Firestore, e renderiza os posts quando há alguma alteração.
export const setupPostsSnapshot = () => {
  const q = query(dbPosts, orderBy("createdAt", "asc"));
  onSnapshot(q, (snapshot) => {
    const posts = [];
    snapshot.forEach((doc) => {
      posts.push({ ...doc.data(), id: doc.id });
    });

    renderPosts(posts);
  });
};

//Esta função aceita um argumento posts, que é uma lista de objetos representando posts.
export const renderPosts = (posts) => {
  form.feed().innerHTML = "";
  posts.forEach((post) => {
    const postElement = templatePostItem(
      post.id,
      post.user,
      post.message,
      post.likes,
      post.userEmail
    );
    form.feed().insertAdjacentHTML("afterbegin", postElement);
  });
};

//Esta é uma função assíncrona que manipula o processo de adicionar um novo post ao banco de dados. Ela é chamada quando o usuário clica no botão de adicionar um novo post.
export const handleAddNewPost = async () => {
  const postText = form.post().value;
  if (!postText.trim()) {
    alert("Digite algo para postar");
    return form.post().focus();
  }

  await addNewPostToDb(userName, auth.currentUser.email, postText, 0);
  form.post().value = "";
};

//definição do objeto form que agrupa três métodos que facilitam o acesso a diferentes elementos DOM na página.
export const form = {
  post: () => document.getElementById("new-post"),
  addPost: () => document.getElementById("add-post"),
  feed: () => document.querySelector(".feed-post"),
  btnLogout: () => document.querySelector("[data-logout]"),
};

//esta função serve como um manipulador centralizado de eventos de clique que pode realizar várias ações diferentes dependendo do elemento que foi clicado. Aqui já adicionei os eventos também para os botões de editar e deletar post. então quando a função for criada, ela já vai estar pronta para ser usada. Só precisa fazer as funções com os nomes que estão no data-action do html. Ou seja, se o data-action for delete, a função tem que se chamar delete.
export async function handleBodyClick(event) {
  let target = event.target;
  while (target !== null && !target.hasAttribute("data-action")) {
    target = target.parentElement;
  }

  if (target === null) return;

  const action = target.getAttribute("data-action");
  const id = target.getAttribute("data-id");

  const actions = {
    delete: async () => {
       await getDoc(doc(db, "posts", id));
       modalDelete(id);
       
        
    },
    edit: async () => {
      const docSnap = await getDoc(doc(db, "posts", id));
      if (docSnap.data().userEmail === userEmail) {
        const newMessage = prompt("Digite uma nova mensagem:");
        if (newMessage) {
          await editPostInDb(id, newMessage);
        }
      } else {
        alert("Você só pode editar seus próprios posts");
      }
    },
    like: async () => await updateLike(id),
  };

  actions[action] && (await actions[action]());
}

export const handleLogout = () => {
  logout();
};

// Esta função inicializa as variáveis userName e userEmail com os dados do usuário logado, e adiciona os eventos de clique nos botões de adicionar, editar e deletar post.
export function bindEvents() {
  const isReturnValue = true;
  const { userName: name, email } = handleGetUserName(isReturnValue);
  userName = name;
  userEmail = email;
  form.addPost().removeEventListener("click", handleAddNewPost);
  form.addPost().addEventListener("click", handleAddNewPost);

  form.btnLogout().removeEventListener("click", handleLogout);
  form.btnLogout().addEventListener("click", handleLogout);

  document.body.removeEventListener("click", handleBodyClick);
  document.body.addEventListener("click", handleBodyClick);

  setupPostsSnapshot();
}



// Esta função é responsável por excluir um post do banco de dados com base em seu ID.
export const deletePostFromDb = async (postId) => {
  try {
    const postRef = doc(db, "posts", postId);
    const docSnap = await getDoc(postRef);
    if (docSnap.exists()) {
      await deleteDoc(postRef); 
    }
  }catch (e) {
    console.error("Erro ao excluir post: ", e);
  }
};

const modalDelete = (id) => {
  const templateDelete = `
  <div id="fade" class="hide"></div>
  <div id="modal" class="hide">
  <p class='p-modal'>Tem certeza que deseja excluir?</p>
  <div class='button-modal'>
  <button id="modal-excluir">Excluir</button>
  <button id="modal-cancelar">Cancelar</button>
  </div>
  </div>
  `
  
 const modalContainer = document.createElement('section');
 modalContainer.classList.add("modalContainer");
 modalContainer.innerHTML = templateDelete;
 document.body.appendChild(modalContainer);
 const modal = modalContainer.querySelector('#modal')
 const fade = modalContainer.querySelector('#fade')
 const excluir = modalContainer.querySelector('#modal-excluir')
 const cancelar = modalContainer.querySelector('#modal-cancelar')
 cancelar.addEventListener('click', () =>{
  modalContainer.remove();
 });
 excluir.addEventListener('click', async() =>{
  await deletePostFromDb(id);
  modalContainer.remove();
 });
 return{ fade, modal, excluir};
};




