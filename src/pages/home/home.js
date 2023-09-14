
import createTimeline from './pages/home/index.js';

app.appendChild(createTimeline());


function addPost() {
    var postText = document.getElementById("new-post").value;

    if (postText.trim() !== "") {
        var feed = document.querySelector(".feed-post");

        // Criar um novo elemento de postagem
        var postElement = document.createElement("div");
        postElement.classList.add("post");

        // Adicionar o conteúdo do post
        var postContent = document.createElement("p");
        postContent.textContent = postText;

        postElement.appendChild(postContent);
        feed.appendChild(postElement);

        // Limpar o textarea após a postagem
        document.getElementById("new-post").value = "";
    }
}

