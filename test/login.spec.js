import {
    getMultiFactorResolver,
    signInWithEmailAndPassword,
    signInWithPopup,
} from "firebase/auth";
  
import login from "../src/pages/login/index.js";
// const jsdom = require ("jsdom");
// import jsdom from "jsdom";
// const {JSDOM} = jsdom

// const {document} = (new JSDOM(`
// <!DOCTYPE html>
// <html lang="en">

// <head>
//   <meta charset="UTF-8">
//   <title>Vida Saudável</title>
// </head>

// <body>

//   <main id="root">
//   </main>

// </body>

// </html>
// `)).window;

jest.mock("firebase/auth");

jest.mock("../src/firebase/firebase.js", () => {
  loginUser = jest.fn();
  loginWithGoogle = jest.fn();
})
fdescribe("login", () => {
  it("redirecionamento para home caso login e senha cadastrados", () => {
    document.body.innerHTML = login()
    // const screenLogin = login()
    console.log(screenLogin)
    // screenLogin.getElementById("input-email").value = "any@gmail.com";
    // screenLogin.getElementById("input-password").value = "123456";
    document.getElementById("input-email")
  });
});
