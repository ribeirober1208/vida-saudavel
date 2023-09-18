import { getDocs, query, where } from "firebase/firestore";
import { onAuthStateChanged, signOut } from "firebase/auth";

import home from "./pages/home/index.js";
import { bindEvents as bindHomeEvents } from "./pages/home/home.js";
import login from "./pages/login/index.js";
import favorite from "./pages/favorite/index.js";
import registro from "./pages/registro/index.js";
import { bindEvents as bindRegisterEvents } from "./pages/registro/registro.js";
import { auth, dbUsers } from "./firebase/firebaseConfig.js";

// A const routes é um array de objetos que contém as rotas da aplicação. Cada objeto contém a rota, o componente, a função que vai ser executada quando a rota for acessada e se a rota é pública ou privada. Isso permite que o usuário só acesse as rotas privadas se estiver logado.
const routes = [
  {
    path: "#home",
    component: home,
    bindEvents: bindHomeEvents,
    isPublic: false,
  },
  {
    path: "#login",
    component: login,
    bindEvents: () => {},
    isPublic: true,
  },
  {
    path: "#favorite",
    component: favorite,
    bindEvents: () => {},
    isPublic: false,
  },
  {
    path: "#registro",
    component: registro,
    bindEvents: bindRegisterEvents,
    isPublic: true,
  },
];
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

  if (isReturnValue) {
    return {
      email: "",
      userName: "",
    };
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

const main = document.querySelector("#root");
const init = () => {
  console.log("hashchange", window.location.hash);
  //mudança de rota hashchange
  main.innerHTML = "";

  //verifica se a rota existe. Ele vai percorrer o array de rotas e vai verificar se a rota existe
  routes.forEach((route) => {
    if (route.path === window.location.hash) {
      main.appendChild(route.component());
      route.bindEvents();
    }
  });

  //verifica se o usuário está logado
  handleUserLoggedIn();

  // o onAuthStateChanged é um método que verifica se o usuário está logado ou não. Se o usuário estiver logado, ele vai retornar o usuário. Se o usuário não estiver logado, ele vai retornar null.
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

      //As rotas publicas são as rotas que não precisam de login para acessar. As rotas privadas são as rotas que precisam de login para acessar. Se a tela for publica, ele redireciona para as telas de login e registro. Se a tela for privada, ele redireciona para a tela de home. tela privada seria após logado, então se trata da home e favoritos.
      return (window.location.href = "/#home");
    }
      //se a rotas não for pública, ele vai redirecionar para a tela de login. Se a rota for pública, ele vai continuar na mesma rota.
      const isPublicRoute = routes.find(
        (route) => route.path === window.location.hash && route.isPublic
      );

      if (isPublicRoute) return;

      return (window.location.href = "/#login");
    }
  )
};

window.addEventListener("load", () => {
  init();
});

window.addEventListener("hashchange", () => {
  init();
});

//código spa anterior
//const main = document.querySelector("#root");
//const init = () => {
//window.addEventListener("hashchange", () => {
//init();
//mudança de rota hashchange
//main.innerHTML = "";
// switch (window.location.hash) {
//case "#home":
// main.appendChild(home());
// bindHomeEvents();
// break;
// case "#login":
// main.appendChild(login());
//  break;
// case "#favorite":
// main.appendChild(favorite());
// break;
// case "#registro":
//main.appendChild(registro());

// bindRegisterEvents();
//  break;

//default:
//   main.appendChild(home());
// }

// handleUserLoggedIn();
//});
//};

//window.addEventListener("load", () => {
//main.appendChild(login());
// init();
//});
