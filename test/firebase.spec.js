import { jest } from "@jest/globals";
import { loginUser, loginWithGoogle, getCurrentUserInfo } from "../src/firebase/firebase.js";
import { setPersistence, signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { getUserByEmail } from "../src/firebase/firestore.js";
import { getAuth } from "firebase/auth";

jest.mock("firebase/auth");
jest.mock("firebase/firestore");
jest.mock("../src/firebase/firestore.js");
describe("loginUser", () => {
  it("deveria chamar setPersistence", async () => {
    setPersistence.mockResolvedValue();
    const email = "any@email.com"
    const password = "secretPassword"
    signInWithEmailAndPassword.mockResolvedValue();
    await loginUser(email, password);
    expect(setPersistence).toHaveBeenCalledTimes(1);
    expect(signInWithEmailAndPassword).toHaveBeenCalledTimes(1);
    expect(signInWithEmailAndPassword).toHaveBeenCalledWith(getAuth(), email, password);
  });
  it("deveria capturar e lançar um erro", async () => {
    setPersistence.mockRejectedValue(new Error("Erro simulado"));
    const email = "any@email.com"
    const password = "secretPassword"
    await expect(loginUser(email, password)).rejects.toThrow("Erro simulado");
  });
});
describe('loginWithGoogle', () => {
  it('deveria ser uma função', () => {
    expect(typeof loginWithGoogle).toBe('function');
  });
  it("deve chamar signInWithPopup com GoogleAuthProvider", async () => {
    signInWithPopup.mockResolvedValue();
    await loginWithGoogle()
    expect(signInWithPopup).toHaveBeenCalledTimes(1);
    expect(signInWithPopup).toHaveBeenCalledWith(getAuth(), expect.any(GoogleAuthProvider));
  });
  it("deveria capturar e lançar um erro", async () => {
    signInWithPopup.mockRejectedValue(new Error("Erro simulado"));
    await expect(loginWithGoogle()).rejects.toThrow("Erro simulado");
  });
});

describe("getCurrentUserInfo", () => {
  it("deveria armazenar email e nome do usuário atual", async () => {
    const userEmail = "any@email.com";

    // Configurar um objeto auth simulado com currentUser
    const auth = {
      currentUser: {
        email: userEmail,
      },
    };

    // Substituir getAuth pelo mock que retorna o objeto auth simulado
    getAuth.mockReturnValue(auth);

    getUserByEmail.mockResolvedValue({
      docs: [
        {
          data: () => ({
            name: "Nome do Usuário",
          }),
        },
      ],
    });

    const userInfo = await getCurrentUserInfo();

    expect(getUserByEmail).toHaveBeenCalledTimes(1);
    expect(getUserByEmail).toHaveBeenCalledWith(userEmail);

    // Verificar se a função getCurrentUserInfo retornou os valores esperados
    expect(userInfo).toEqual({
      userEmail,
      user: "Nome do Usuário",
    });
  });
});

