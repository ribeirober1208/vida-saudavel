import { addDoc } from "firebase/firestore";
import { loginUser, loginWithGoogle } from "../../firebase/firebase.js";
import { dbUsers } from "../../firebase/firebaseConfig.js";

export default () => {
  const container = document.createElement("div");
  container.classList.add("container-login");

  const template = `
  <figure class="figure-login">
    <img src="./img/Logo.png" alt="logo" class="logo">
    <h3 class="frase-login">Compartilhe o melhor da alimentação <br> saudável na sua nova rede social</h3>
  </figure>
  <section class="forms-login">
  <div class="input-container">
  <input type="email" name="email" placeholder="E-mail" class="input-login" id="input-email">
  <div class="error">Email é obrigatório</div>
  <div class="error">Email é inválido</div>
  </div>
  <div class="input-container">
  <input type="password" name="senha" placeholder="Senha" class="input-login" id="input-password">
  <img src="./img/Hide.png" alt="hide" class="input-icon-hide">
  <div class="error">Senha é obrigatória</div>
  </div>
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

  togglePasswordIcon.addEventListener("click", () => {
    const type = passwordInput.type === "password" ? "text" : "password";
    passwordInput.type = type;
    const icon = type === "password" ? "Hide" : "Show";
    togglePasswordIcon.setAttribute("src", `./img/${icon}.png`);
  });

  btnLogin.addEventListener("click", (event) => {
    event.preventDefault(); // Impede o envio do formulário padrão

    // Oculte todas as mensagens de erro inicialmente
    messageError.forEach((error) => {
      error.style.display = "none";
    });

    emailInput.classList.remove("error-input");
    passwordInput.classList.remove("error-input");

    if (!emailInput.value) {
      messageError[0].style.display = "block";
      emailInput.classList.add("error-input");
    } else if (
      !/^[a-z0-9.]+@[a-z0-9]+\.[a-z]+(\.[a-z]+)?$/i.test(emailInput.value)
    ) {
      messageError[1].style.display = "block";
      emailInput.classList.add("error-input");
    }
    if (!passwordInput.value) {
      messageError[2].style.display = "block";
      passwordInput.classList.add("error-input");
    }

    loginUser(emailInput.value, passwordInput.value);
  });

  const btnGoogle = document.querySelector(".button-google-login");

  btnGoogle.addEventListener("click", (event) => {
    event.preventDefault();
    loginWithGoogle()
      .then(async (userCredential) => {
        const name = userCredential.user.displayName;
        const email = userCredential.user.email;
        await addDoc(
          dbUsers,
          {
            name,
            email,
          },
          { merge: true }
        );
        localStorage.setItem(
          "user",
          JSON.stringify({
            email: userCredential.user.email,
            uid: userCredential.user.uid,
          })
        );
        window.location.href = "#home";
      })
      .catch((error) => {
        const errorCode = error.code;
      });
  });

  return container;
};
