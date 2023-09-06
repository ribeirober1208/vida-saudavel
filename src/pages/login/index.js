export default () => {
  const container = document.createElement("div");
  container.classList.add("formContent");
  const template = `
    <figure>
      <img src="./img/Logo.png" alt="logo" class="logo">
      <h3>Compartilhe o melhor da alimentação saudável na sua nova rede social</h3>
    </figure>
    <section>
      <input type="email" name="email" placeholder="E-mail">
      <input type="password" name="senha" placeholder="Senha">
      <button>Entrar</button>
      <p>ou</p>
      <button><img src="./img/icon-google.png" alt="icon-google" class="icon-google"><a href="">Continue com o Google</a></button>
      <a href="./#registro">Não tem uma conta? Cadastre-se</a>    
      </section>
     
       `;
  container.innerHTML = template;
  
  return container;
};
