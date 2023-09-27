import { doc, getDoc } from "firebase/firestore";
import { db } from "../../firebase/firebaseConfig.js";
import { logout } from "../../main.js";
import { auth, getCurrentUserInfo } from "../../firebase/firebase.js";
import cancelar from "../../img/cancelar.png";   
import done from "../../img/done.png";  
import excluir from "../../img/excluir.png";  
import pencil from "../../img/pencil.png";  
import male from "../../img/MaleUser.png"; 
import deslike from "../../img/deslike.png";
import like from "../../img/like.png"; 

import {
  addNewPostToDb,
  deletePostFromDb,
  editPost,
  setupPostsSnapshot,
  updateLike,
} from "../../firebase/firestore.js";

// esta função é responsável por criar o template de cada post. Ela recebe como parâmetro o id, o nome do usuário, a mensagem e a quantidade de curtidas.
export const templatePostItem = (
  id,
  user,
  message,
  likes,
  email,
  likesUsers = []
) => {
  const handleAddPluralMessage = (likes) =>
    likes > 1 ? " curtidas" : " curtida";

  return `
    <div class="post" data-id="${id}">
        <div class="user-info">
            <img src=${male} alt="user" class="user-icon">
            <p class="user-name">${user}</p>
        </div>
        <p class="post-text">${message}</p>
        <div class="post-interactions">
            <span class="count-likes">${likes}</span> <span class="count-likes-message">${handleAddPluralMessage(
    likes
  )}</span>
        </div>
        <div class="post-actions">
        ${email === auth.currentUser.email
      ? `
            <button class="action buttonDelete" data-action="delete" data-id="${id}">
              <img src=${excluir} class="icon-delete">
            <button class="action edit" data-action="edit" data-id="${id}">
              <img src=${pencil}  alt="Editar post">
              <i class="icon"></i>
            </button>

    `
      : ""
    }
            <button class="action like " data-action="like" data-id="${id}">
               <img src="${likesUsers.includes(auth.currentUser.email) ? deslike: like}" alt="Curtir">
                <i class="icon"></i>
            </button>

        </div>
    </div>
`;
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
      post.userEmail,
      post.likesUsers
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

  await addNewPostToDb(postText);
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
    //função editar post parte I
    edit: async () => {
      const docSnap = await getDoc(doc(db, "posts", id));
      const userEmail = auth.currentUser.email;
      if (docSnap.data().userEmail === userEmail) {

        const postElement = document.querySelector(`[data-id="${id}"]`);
        const postTextElement = postElement.querySelector(".post-text");
        const textarea = document.createElement("textarea");
        textarea.value = postTextElement.textContent;
        textarea.id = `editTextarea-${id}`;
        postTextElement.replaceWith(textarea);
        const editActions = document.createElement("nav");
        const confirmImage = document.createElement("img");
        confirmImage.src = done;
        confirmImage.alt = "Confirmar Edição";
        confirmImage.classList.add("confirm-image");
        confirmImage.addEventListener("click", async () => {
          const newMessage = document.getElementById(
            `editTextarea-${id}`
          ).value;
          if (newMessage.trim() !== "") {
            await editPost(id, newMessage);
            // ...
          } else {
            alert("A nova mensagem não pode estar vazia");
          }
        });
        editActions.appendChild(confirmImage);
        const cancelImage = document.createElement("img");
        cancelImage.src =  cancelar;
        cancelImage.alt = "Cancelar Edição";
        cancelImage.classList.add("cancel-image");
        cancelImage.addEventListener("click", () => {
          textarea.replaceWith(postTextElement);
          confirmImage.remove();
          cancelImage.remove();
        });
        editActions.appendChild(cancelImage);
        postElement.appendChild(editActions);

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
  form.addPost().removeEventListener("click", handleAddNewPost);
  form.addPost().addEventListener("click", handleAddNewPost);

  form.btnLogout().removeEventListener("click", handleLogout);
  form.btnLogout().addEventListener("click", handleLogout);

  document.body.removeEventListener("click", handleBodyClick);
  document.body.addEventListener("click", handleBodyClick);

  setupPostsSnapshot(renderPosts);
}

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
  `;
  const modalContainer = document.createElement("section");
  modalContainer.classList.add("modalContainer");
  modalContainer.innerHTML = templateDelete;
  document.body.appendChild(modalContainer);
  const modal = modalContainer.querySelector("#modal");
  const fade = modalContainer.querySelector("#fade");
  const excluir = modalContainer.querySelector("#modal-excluir");
  const cancelar = modalContainer.querySelector("#modal-cancelar");
  cancelar.addEventListener("click", () => {
    modalContainer.remove();
  });
  excluir.addEventListener("click", async () => {
    await deletePostFromDb(id);
    modalContainer.remove();
  });

  return { fade, modal, excluir };
};
