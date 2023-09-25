export default () => {
  const container = document.createElement("div");
  container.classList.add("about");
  const template = `
    <header class="header-page">
      <span id="container-user">
        <img src="./img/MaleUser.png" alt="user" class="icons">
        <p id="user-name"></p>
      </span>
    </header>
    <main class="container-about">
     <h1> About </h1>
    </main> 
   <footer>
     <span id="containerIcons">
       <a href="./#home"><img src="./img/Home.png" alt="home" class="icons"></a>
       <a href="./#about"><img src="./img/Heart.png" alt="heart" class="icons"></a>
       <a data-logout><img src="./img/Logout.png" alt="logout" class="icons"></a>
     </span>
   </footer> 
     `;
  container.innerHTML = template;
  return container;
};
