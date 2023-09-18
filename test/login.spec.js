import {
    getMultiFactorResolver,
    signInWithEmailAndPassword,
    signInWithPopup,
} from "firebase/auth";
  
import {
  login
} from "../src/pages/login/index.js";
  
jest.mock("firebase/auth");

jest.mock("../src/firebase/firebase.js", () => {
  loginUser = jest.fn();
  loginWithGoogle = jest.fn();
})
describe("login", () => {
  it("redirecionamento para home caso login e senha cadastrados", () => {
    const screenLogin = login()
    screenLogin.getElementById("input-email").value = "any@gmail.com";
    screenLogin.getElementById("input-password").value = "123456";
  });
})


//    describe("loginWithGoogle", () => {
//     it("deverá ser uma função", () => {
//       expect(typeof loginWithGoogle).toBe("function");
//     });
//     it("deverá fazer login com a conta Google", )
  
  
  
//    });