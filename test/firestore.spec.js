import {
  addDoc,
  getDocs,
  getDoc,
  updateDoc,
  deleteDoc,
  onSnapshot,
  doc,
} from "firebase/firestore";

import {
  createUserInfo,
  getUserByEmail,
  addNewPostToDb,
  updateLike,
  setupPostsSnapshot,
  deletePostFromDb,
  editPost,
} from "../src/firebase/firestore";
import { getCurrentUserInfo } from "../src/firebase/firebase";

jest.mock("firebase/firestore", () => ({
  addDoc: jest.fn(),
  getDocs: jest.fn(),
  getDoc: jest.fn(),
  updateDoc: jest.fn(),
  deleteDoc: jest.fn(),
  onSnapshot: jest.fn(),
  query: jest.fn(),
  where: jest.fn(),
  orderBy: jest.fn(),
  collection: jest.fn(),
  doc: jest.fn(),
  getFirestore: jest.fn(() => ({})),
  doc: jest.fn(),
}));

jest.mock("../src/firebase/firebase", () => ({
  getCurrentUserInfo: jest.fn(() => ({ userEmail: "testEmail@test.com" })),
}));
// teste para verificar se a função createUserInfo está sendo chamada
describe("Firebase functions tests", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(console, "error").mockImplementation(() => {});
    jest.spyOn(console, "log").mockImplementation(() => {});
  });

  it("should create user info", async () => {
    await createUserInfo("testName", "testEmail@test.com");
    expect(addDoc).toHaveBeenCalledWith(undefined, {
      name: "testName",
      email: "testEmail@test.com",
    });
  });

  it("should get user by email", async () => {
    await getUserByEmail("testEmail@test.com");
    expect(getDocs).toHaveBeenCalled();
  });

  it("should add new post to db", async () => {
    getCurrentUserInfo.mockResolvedValueOnce({
      user: "testUser",
      userEmail: "testEmail@test.com",
    });
    await addNewPostToDb("testMessage", 5);
    expect(addDoc).toHaveBeenCalledWith(undefined, {
      user: "testUser",
      userEmail: "testEmail@test.com",
      message: "testMessage",
      likes: 5,
      createdAt: expect.any(Date),
    });
  });

  it("should update like", async () => {
    const mockData = {
      exists: () => true,
      data: () => ({
        likes: 5,
        likesUsers: ["user1@test.com", "user2@test.com"],
      }),
    };
    getDoc.mockResolvedValueOnce(mockData);

    await updateLike("testId");

    expect(updateDoc).toHaveBeenCalledWith(undefined, {
      likes: 6,
      likesUsers: ["user1@test.com", "user2@test.com", "testEmail@test.com"],
      updatedAt: expect.anything(),
    });
  });

  it("should setup posts snapshot", () => {
    const mockCallback = jest.fn();
    setupPostsSnapshot(mockCallback);
    expect(onSnapshot).toHaveBeenCalled();
  });

  it("should setup posts snapshot with listener", () => {
    const mockPostsData = [
      { id: "1", data: () => ({ user: "user1", message: "message1" }) },
      { id: "2", data: () => ({ user: "user2", message: "message2" }) },
    ];
    onSnapshot.mockImplementation((query, callback) => {
      callback({
        forEach: (cb) => {
          mockPostsData.forEach(cb);
        },
      });
    });

    const mockCallback = jest.fn();
    setupPostsSnapshot(mockCallback);

    expect(mockCallback).toHaveBeenCalledWith([
      { ...mockPostsData[0].data(), id: mockPostsData[0].id },
      { ...mockPostsData[1].data(), id: mockPostsData[1].id },
    ]);
  });

  it("should delete post from db", async () => {
    const mockData = {
      exists: () => true,
      data: () => ({}),
    };
    getDoc.mockResolvedValueOnce(mockData);

    await deletePostFromDb("testId");
    expect(deleteDoc).toHaveBeenCalled();
  });

  it("should handle error when adding new post", async () => {
    const errorMessage = "Error adding document";
    addDoc.mockRejectedValueOnce(new Error(errorMessage));

    await addNewPostToDb("testMessage", 5);
    expect(console.error).toHaveBeenCalledWith(
      "Error adding document: ",
      expect.any(Error)
    );
  });

  it("should handle error when getCurrentUserInfo fails in addNewPostToDb", async () => {
    getCurrentUserInfo.mockRejectedValueOnce(new Error("User not found"));

    await addNewPostToDb("testMessage", 5);
    expect(console.error).toHaveBeenCalledWith(
      "Error adding document: ",
      expect.any(Error)
    );
  });

  it("should handle non-existing post in updateLike", async () => {
    getDoc.mockResolvedValueOnce({
      exists: () => false,
      data: () => ({}),
    });

    await updateLike("testId");
    expect(console.log).toHaveBeenCalledWith("No such document!");
  });

  //Teste verifica se a função updateLike está funcionando corretamente ao lidar com uma postagem que já foi curtida, realizando as atualizações necessárias nos dados da postagem no banco de dados.
  it("should handle a previously liked post in updateLike", async () => {
    const mockData = {
      exists: () => true,
      data: () => ({
        likes: 5,
        likesUsers: ["testEmail@test.com"],
      }),
    };
    getDoc.mockResolvedValueOnce(mockData);

    await updateLike("testId");
    expect(updateDoc).toHaveBeenCalledWith(undefined, {
      likes: 4,
      likesUsers: [],
      updatedAt: expect.anything(),
    });
  });
  // este teste está verificando se o código está tratando adequadamente um erro que pode ocorrer ao tentar excluir uma postagem do banco de dados.
  it("should handle error when deleting post", async () => {
    const errorMessage = "Erro ao excluir post";
    deleteDoc.mockRejectedValueOnce(new Error(errorMessage));

    await deletePostFromDb("testId");
    expect(console.error).toHaveBeenCalledWith(
      "Erro ao excluir post: ",
      expect.any(Error)
    );
  });
});

describe("editPost", () => {
  // Isto limpa os mocks após cada teste
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should edit the post successfully", async () => {
    // Mock do console.log para verificarmos se ele é chamado
    console.log = jest.fn();

    const mockId = "sampleId";
    const mockMessage = "Updated Message";
    await editPost(mockId, mockMessage);

    // Verifica se doc foi chamado com os argumentos corretos
    expect(doc).toHaveBeenNthCalledWith(2, {}, "posts", mockId);

    // Verifica se a mensagem de sucesso foi registrada
    expect(console.log).toHaveBeenCalledWith("Post editado com sucesso!");
  });

  it("should handle error when editing post", async () => {
    // Mock do console.error para verificarmos se ele é chamado
    console.error = jest.fn();

    // Fazemos o mock do updateDoc para rejeitar a promessa e simular um erro
    updateDoc.mockRejectedValueOnce(new Error("Editing error"));

    const mockId = "sampleId";
    const mockMessage = "Updated Message";
    await editPost(mockId, mockMessage);

    // Verifica se o erro foi registrado
    expect(console.error).toHaveBeenCalledWith(
      "Error editing document: ",
      expect.any(Error)
    );
  });
});
