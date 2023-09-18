import { getDocs, query, where } from "firebase/firestore";
import { onAuthStateChanged, signOut } from "firebase/auth";

import home from "./pages/home/index.js";
import { bindEvents as bindHomeEvents } from "./pages/home/home.js";
import login from "./pages/login/index.js";
import favorite from "./pages/favorite/index.js";
import registro from "./pages/registro/index.js";
import { bindEvents as bindRegisterEvents } from "./pages/registro/registro.js";
import { auth, dbUsers } from "./firebase/firebaseConfig.js";

//aqui começa a parte que eu fiz (iris)

//Esta função é responsável por pegar o nome do usuário e colocar na tela
export const handleGetUserName = (isReturnValue = false) => {
  const userInfo = JSON.parse(localStorage.getItem("userInfo"));

  //se o usuário estiver logado, ele vai retornar o nome e o email
  if (userInfo) {
    const userName = userInfo.name;
    const email = userInfo.email;
    //se o retorno for verdadeiro, ele vai retornar o nome e o email
    if (isReturnValue) {
      return {
        email,
        userName,
      };
    }

    const userNameElement = document.querySelector("#user-name");

    userNameElement.innerHTML = userName;
  }
};

//esta função é responsável por verificar se o usuário está logado
const handleUserLoggedIn = async () => {
  const userParsed = JSON.parse(localStorage.getItem("user"));
  //Se o usuário estiver logado, ele vai pegar o email do usuário e vai fazer uma query no banco de dados
  if (userParsed) {
    const email = userParsed.email;

    //userQuery é um objeto que contém o email do usuário
    const userQuery = query(dbUsers, where("email", "==", email));

    //aqui ele vai pegar o usuário que tem o email igual ao email do usuário logado e vai retornar um array de objetos
    const querySnapshot = await getDocs(userQuery);

    //querySnapshot é um array de objetos que contém os dados do usuário. Doc.data() é um método que retorna os dados do usuário. localStorage.setItem é um método que salva os dados do usuário no localStorage. handleGetUserName é uma função que pega o nome do usuário e coloca na tela.
    querySnapshot.forEach((doc) => {
      const user = doc.data();
      localStorage.setItem("userInfo", JSON.stringify(user));
      handleGetUserName();
    });
  }
};

export async function logout() {
  try {
    await signOut(auth);
    console.log("Usuário deslogado com sucesso");
    return (window.location.href = "/#login");
  } catch (error) {
    console.error("Erro ao deslogar: ", error);
  }
}
//aqui acaba a parte que eu fiz (iris)

const main = document.querySelector("#root");
const init = () => {
  console.log("hashchange", window.location.hash);
  //mudança de rota hashchange
  main.innerHTML = "";
  switch (window.location.hash) {
    case "#home":
      main.appendChild(home());
      bindHomeEvents();
      break;
    case "#login":
      main.appendChild(login());
      break;
    case "#favorite":
      main.appendChild(favorite());
      break;
    case "#registro":
      main.appendChild(registro());

      bindRegisterEvents();
      break;

    default:
      main.appendChild(home());
  }

  handleUserLoggedIn();

  onAuthStateChanged(auth, (user) => {
    if (user) {
      // O usuário está logado
      localStorage.setItem(
        "user",
        JSON.stringify({
          email: user.email,
          uid: user.uid,
        })
      );
      return (window.location.href = "/#home");
    } else {
      // Nenhum usuário está logado
      console.log("Nenhum usuário logado");
      return (window.location.href = "/#login");
    }
  });
};

window.addEventListener("load", () => {
  init();
});

window.addEventListener("hashchange", () => {
  init();
});
