import {
  addDoc,
  deleteDoc,
  updateDoc,
  getDoc,
  onSnapshot,
} from "firebase/firestore";

import {
  templatePostItem,
  handleAddPluralMessage,
  addNewPostToDb,
  deletePostFromDb,
  editPostInDb,
  updateLike,
  handleAddNewPost,
  setupPostsSnapshot,
  renderPosts,
  form,
} from "../src/pages/home/home";

jest.mock("firebase/firestore", () => ({
  addDoc: jest.fn(),
  deleteDoc: jest.fn(),
  updateDoc: jest.fn(),
  getDoc: jest.fn(() => ({
    exists: jest.fn(() => true),
    data: jest.fn(() => ({ likes: 1 })),
  })),
  onSnapshot: jest.fn(),
}));

jest.mock("../src/main.js", () => ({
  handleGetUserName: jest.fn(() => "TestUser"),
}));

describe("templatePostItem", () => {
  it("deveria retornar uma string de template com as informações do post incorporadas", () => {
    const result = templatePostItem("123", "UserTest", "TestMessage", 1);
    expect(result).toContain('data-id="123"');
    expect(result).toContain("UserTest");
    expect(result).toContain("TestMessage");
    expect(result).toContain("1 curtida");
  });
});

describe("handleAddPluralMessage", () => {
  it('deveria retornar "curtida" para 1 like', () => {
    expect(handleAddPluralMessage(1)).toBe(" curtida");
  });

  it('deveria retornar "curtidas" para mais de 1 like', () => {
    expect(handleAddPluralMessage(2)).toBe(" curtidas");
  });
});

describe("addNewPostToDb", () => {
  it("deveria chamar addDoc com os argumentos corretos", async () => {
    await addNewPostToDb("UserTest", "TestMessage", 0);
    expect(addDoc).toHaveBeenCalledWith(expect.anything(), {
      user: "UserTest",
      message: "TestMessage",
      likes: 0,
      createdAt: expect.any(Date),
    });
  });
});

describe("deletePostFromDb", () => {
  it("deveria chamar deleteDoc com o id correto", async () => {
    await deletePostFromDb("123");
    expect(deleteDoc).toHaveBeenCalledWith(expect.anything());
  });
});

describe("editPostInDb", () => {
  it("deveria chamar updateDoc com os argumentos corretos", async () => {
    global.prompt = jest.fn(() => "NewMessage");
    await editPostInDb("123", "NewMessage");
    expect(updateDoc).toHaveBeenCalledWith(expect.anything(), {
      message: "NewMessage",
      updatedAt: expect.any(Date),
    });
  });
});

describe("updateLike", () => {
  it("deveria chamar getDoc e updateDoc com os argumentos corretos", async () => {
    await updateLike("123");
    expect(getDoc).toHaveBeenCalledWith(expect.anything());
    expect(updateDoc).toHaveBeenCalledWith(expect.anything(), {
      likes: 2,
      updatedAt: expect.any(Date),
    });
  });
});

describe("handleAddNewPost", () => {
  it("deveria chamar addDoc se o post não estiver vazio", async () => {
    jest.spyOn(window, "alert").mockImplementation(() => {});
    form.post = jest.fn(() => ({ value: "Test Post", focus: jest.fn() }));
    await handleAddNewPost();
    expect(addDoc).toHaveBeenCalledWith(expect.anything(), {
      user: "TestUser",
      message: "Test Post",
      likes: 0,
      createdAt: expect.any(Date),
    });
  });

  it("deveria alertar e não chamar addDoc se o post estiver vazio", async () => {
    const alertMock = jest.spyOn(window, "alert");
    form.post = jest.fn(() => ({ value: "", focus: jest.fn() }));
    await handleAddNewPost();
    expect(alertMock).toHaveBeenCalledWith("Digite algo para postar");
    expect(addDoc).not.toHaveBeenCalled();
  });
});

describe("setupPostsSnapshot", () => {
  it("deveria chamar onSnapshot com a query correta", () => {
    setupPostsSnapshot();
    expect(onSnapshot).toHaveBeenCalledWith(
      expect.anything(),
      expect.any(Function)
    );
  });
});

describe("renderPosts", () => {
  it("deveria renderizar os posts", () => {
    document.body.innerHTML = '<div class="feed-post"></div>';
    form.feed = jest.fn(() => document.querySelector(".feed-post"));
    const posts = [
      { id: "1", user: "User1", message: "Message1", likes: 1 },
      { id: "2", user: "User2", message: "Message2", likes: 2 },
    ];
    renderPosts(posts);
    expect(document.body.innerHTML).toContain('data-id="1"');
    expect(document.body.innerHTML).toContain("User1");
    expect(document.body.innerHTML).toContain("Message1");
    expect(document.body.innerHTML).toContain("1 curtida");
    expect(document.body.innerHTML).toContain('data-id="2"');
    expect(document.body.innerHTML).toContain("User2");
    expect(document.body.innerHTML).toContain("Message2");
    expect(document.body.innerHTML).toContain("2 curtidas");
  });
});
