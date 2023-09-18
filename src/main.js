import { getDocs, query, where } from "firebase/firestore";
import home from "./pages/home/index.js";
import { bindEvents as bindHomeEvents } from "./pages/home/home.js";
import login from "./pages/login/index.js";
import favorite from "./pages/favorite/index.js";
import registro from "./pages/registro/index.js";
import { bindEvents as bindRegisterEvents } from "./pages/registro/registro.js";
import { dbUsers } from "./firebase/firebaseConfig.js";

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
//aqui acaba a parte que eu fiz (iris)

const main = document.querySelector("#root");
const init = () => {
  window.addEventListener("hashchange", () => {
    init();
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
  });
};

window.addEventListener("load", () => {
  main.appendChild(login());
  init();
});
