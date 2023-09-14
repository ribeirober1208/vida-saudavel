import { loginUser, loginWithGoogle } from "../../firebase/firebase.js";

export default () => {
  const container = document.createElement("div");
  container.classList.add("container-login");

  const template = `
  <figure class="figure-login">
    <img src="./img/Logo.png" alt="logo" class="logo">
    <h3 class="frase-login">Compartilhe o melhor da alimentação saudável na sua nova rede social</h3>
  </figure>
  <section class="forms-login">
  <div class="input-container">
  <img src="./img/MaleUser.png" alt="maleUser" class="input-icon">
  <input type="email" name="email" placeholder="E-mail" class="input-login" id="input-email">
  </div>
  <div class="error">Email é obrigatório</div>
  <div class="error">Email é inválido</div>
  <div class="input-container">
  <img src="./img/lock.png" alt="lock" class="input-icon">
  <input type="password" name="senha" placeholder="Senha" class="input-login" id="input-password">
  <img src="./img/Hide.png" alt="hide" class="input-icon-hide">
  </div>
  <div class="error">Senha é obrigatória</div>
    <button id="button-login">Entrar</button>
    <p class="p-login">ou</p>
    <button class="button-google-login"><img src="./img/icon-google.png" alt="icon-google" class="icon-google"><a href="" class="continue-login">Continue com o Google</a></button>
    <a href="./#registro" class="cadastrese-login">Não tem uma conta? Cadastre-se</a>    
    </section>
     `;

  container.innerHTML = template;
  document.body.appendChild(container);
  const emailInput = document.querySelector("#input-email");
  const passwordInput = document.querySelector("#input-password");
  const togglePasswordIcon = document.querySelector(".input-icon-hide");
  const btnLogin = document.querySelector("#button-login");
  const messageError = document.querySelectorAll(".error");

  togglePasswordIcon.addEventListener('click', () => {
    const type = passwordInput.type === "password" ? "text" : "password";
    passwordInput.type = type;
    const icon = type === "password" ? "Hide" : "Show";
    togglePasswordIcon.setAttribute("src", `./img/${icon}.png`);
  });

  btnLogin.addEventListener("click", (event) => {
    event.preventDefault(); // Impede o envio do formulário padrão

  if(!emailInput.value){
    messageError[0].style.display="block";
  }
  if(!passwordInput.value){
    messageError[2].style.display="block";
  }

    loginUser(emailInput.value, passwordInput.value)
      .then((userCredential) => {
        window.location.href = "#home";
        const user = userCredential.user;
      })
      .catch((error) => {
        const errorCode = error.code;
      });

    function getErrorMessage(error) {
      const errorMessage = error.message;
      if (error == "auth/user-not-found") {
        return "Usuário não encontrado";
      }
      return errorMessage;
    }
  });

  const btnGoogle = document.querySelector(".button-google-login")

  btnGoogle.addEventListener("click", (event) => {
    event.preventDefault()
    loginWithGoogle()
      .then(() => {
        window.location.href = "#home";
      })
      .catch((error) => {
        const errorCode = error.code;
        console.log(errorCode);
      });

  });


  return container;
};

//senha incorreta
//nome ao invés de email