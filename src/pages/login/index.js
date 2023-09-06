export default () => {
    const container = document.createElement("div");
    const template = `
    <figure>
    <img src="./img/Logo.png" alt="logo" id="logo">
    <h3>Compartilhe o melhor da alimentação saudável na sua nova rede social</h3>
  </figure>
  <section>
    <input type="email" name="email" placeholder="E-mail">
    <input type="password" name="senha" placeholder="Senha">
    <button>Entrar</button>
    <p>ou</p>
    <button><img src="./img/icon-google.png" class="icon-google" alt="icon-google"><a href="">Continue com o Google</a></button>
    <a href="./#registro">Não tem uma conta? Cadastre-se</a>
  </section>
       `;
    container.innerHTML = template;

    container.innerHTML = template;
  // Adicione classes ou IDs aos elementos que você deseja estilizar
  const logo = container.querySelector("#logo");
  const emailInput = container.querySelector('input[name="email"]');
  const senhaInput = container.querySelector('input[name="senha"]');
  const entrarButton = container.querySelector('button');
  const googleButton = container.querySelector('.icon-google');
  // Atribua classes ou IDs aos elementos
  logo.id = "logo";
  emailInput.id = "email-input";
  senhaInput.id = "senha-input";
  entrarButton.id = "entrar-button";
  googleButton.id = "google-button";
  
    return container;
  };