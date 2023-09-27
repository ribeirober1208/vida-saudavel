import heart from "../../img/Heart.png";  
import home from "../../img/Home.png";   
import Logout from "../../img/Logout.png"; 
import user from "../../img/MaleUser.png";  

export default () => {
  const container = document.createElement("div");
  container.classList.add("timeLine");
  const template = `
    <header class="header-page">
      <span id="container-user">
        <img src=${user} alt="user" class="icons">
        <p id="user-name"></p>
      </span>
    </header>
    <main class="container-timeline">
      <section class="form-post">
        <textarea id="new-post" placeholder="Compartilhe algo..."></textarea>
        <button id="add-post" class="button-post"> Postar </button>
      </section>
      <section class="feed-post"></section>
    </main> 
   <footer>
     <span id="containerIcons">
       <a href="./#"><img src=${home} alt="home" class="icons"></a>
       <a href="./#about"><img src=${heart} alt="heart" class="icons"></a>
       <a data-logout><img src=${Logout} alt="logout" class="icons"></a>
     </span>
   </footer> 
     `;
  container.innerHTML = template;
  return container;
};
