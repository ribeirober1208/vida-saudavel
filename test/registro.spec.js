import {
  validateEmail,
  onChangeName,
  onChangeEmail,
  onChangePassword,
  onChangeConfirmPassword,
  validatePasswordMatch,
  isFormValid,
  toggleTypePassword,
  createAccountFirebase,
  handleCreateAccount,
  bindEvents,
  form,
} from "../src/pages/registro/registro"; // Ajuste o caminho do seu arquivo

jest.mock("firebase/firestore");
jest.mock("../src/firebase/firebaseConfig");

jest.mock("../src/pages/registro/registro", () => ({
  ...jest.requireActual("../src/pages/registro/registro"),
  createAccountFirebase: jest.fn(),
  handleCreateAccount: jest.fn(),
  bindEvents: jest.fn(),
}));

beforeEach(() => {
  document.body.innerHTML = `
    <input id="name" />
    <input id="email" />
    <input id="password" />
    <input id="confirmPassword" />
    <div id="email-invalid-error"></div>
    <div id="email-exists-error"></div>
    <div id="email-required-error"></div>
    <div id="password-required-error"></div>
    <div id="password-min-length-error"></div>
    <div id="password--doesnt-match-error"></div>
    <button id="register-button"></button>
    <img class="toggle-password" data-target="password" />
    <img class="toggle-password" data-target="confirmPassword" />
  `;
});

describe("validateEmail", () => {
  it("should validate the email correctly", async () => {
    form.email().value = "test@example.com";
    const result = await validateEmail("test@example.com");
    expect(result).toBe(true);
  });
});

describe("onChangeEmail", () => {
  it("should handle the email change correctly when the email is valid", async () => {
    form.email().value = "test@example.com";
    await onChangeEmail();
    expect(document.getElementById("email-required-error").style.display).toBe(
      "none"
    );
  });

  it("should handle the email change correctly when the email is invalid", async () => {
    form.email().value = "invalid email";
    await onChangeEmail();
    expect(document.getElementById("email-required-error").style.display).toBe(
      "block"
    );
  });
});

describe("onChangeName", () => {
  it("should handle the name change correctly", async () => {
    form.name().value = "Test Name";
    await onChangeName();
    expect(document.getElementById("name-required-error").style.display).toBe(
      "none"
    );
    expect(document.getElementById("name-min-length-error").style.display).toBe(
      "none"
    );
  });
});

describe("onChangePassword", () => {
  it("should handle the password change correctly", async () => {
    form.password().value = "123456";
    await onChangePassword();
    expect(
      document.getElementById("password-required-error").style.display
    ).toBe("none");
    expect(
      document.getElementById("password-min-length-error").style.display
    ).toBe("none");
  });
});

describe("onChangeConfirmPassword", () => {
  it("should handle the confirmPassword change correctly", async () => {
    form.password().value = "123456";
    form.confirmPassword().value = "123456";
    await onChangeConfirmPassword();
    expect(
      document.getElementById("password--doesnt-match-error").style.display
    ).toBe("none");
  });
});

describe("validatePasswordMatch", () => {
  it("should validate if passwords match correctly", () => {
    form.password().value = "123456";
    form.confirmPassword().value = "123456";
    validatePasswordMatch();
    expect(
      document.getElementById("password--doesnt-match-error").style.display
    ).toBe("none");
  });
});

describe("isFormValid", () => {
  it("should validate the form correctly", async () => {
    form.email().value = "test@example.com";
    form.password().value = "123456";
    form.confirmPassword().value = "123456";
    const result = await isFormValid();
    expect(result).toBe(true);
  });
});

describe("toggleTypePassword", () => {
  it("should toggle the password type correctly", () => {
    const event = {
      getAttribute: jest.fn(() => "password"),
    };
    toggleTypePassword.call(event);
    expect(form.password().type).toBe("text");
  });
});

describe("createAccountFirebase", () => {
  it("should create an account on Firebase correctly", async () => {
    form.email().value = "test@example.com";
    form.name().value = "Test Name";
    form.password().value = "123456";
    await createAccountFirebase();

    // Verificando se a função foi chamada
    expect(createAccountFirebase).toHaveBeenCalled();
  });
});

describe("handleCreateAccount", () => {
  it("should handle the account creation correctly", async () => {
    form.email().value = "test@example.com";
    form.name().value = "Test Name";
    form.password().value = "123456";
    form.confirmPassword().value = "123456";
    await handleCreateAccount();

    // Verificando se a função foi chamada com os argumentos corretos
    expect(handleCreateAccount).toHaveBeenCalledWith(
      "test@example.com",
      "Test Name",
      "123456",
      "123456"
    );
  });
});

describe("bindEvents", () => {
  it("should bind events correctly", () => {
    bindEvents();

    // Verificando se a função foi chamada
    expect(bindEvents).toHaveBeenCalled();
  });
});
