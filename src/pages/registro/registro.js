import { createUser } from "../../firebase/firebaseConfig";
import { createUserInfo, getUserByEmail } from "../../firebase/firestore";
import show from "../../img/Show.png";

//Aqui é onde eu pego os elementos do html
export const form = {
  confirmPassword: () => document.getElementById("confirmPassword"),
  confirmPasswordDoesntMatchError: () =>
    document.getElementById("password--doesnt-match-error"),
  name: () => document.getElementById("name"),
  email: () => document.getElementById("email"),
  emailInvalidError: () => document.getElementById("email-invalid-error"),
  emailExistsError: () => document.getElementById("email-exists-error"),
  emailRequiredError: () => document.getElementById("email-required-error"),
  password: () => document.getElementById("password"),
  passwordRequiredError: () =>
    document.getElementById("password-required-error"),
  passwordMinLengthError: () =>
    document.getElementById("password-min-length-error"),
  registerButton: () => document.getElementById("register-button"),
  togglePassword: () => document.getElementsByClassName("toggle-password"),
};

// Essa função é responsável por validar o email
export async function validateEmail(email) {
  form.email().classList.remove("error-input");
  form.emailExistsError().style.display = "none";

  if (!email) {
    form.email().classList.add("error-input");
    return false;
  }

  const emailExistInDatabase = await getUserByEmail(email);

  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const isValid = re.test(String(email).toLowerCase());

  form.emailInvalidError().style.display = isValid ? "none" : "block";
  if (!isValid) {
    form.email().classList.add("error-input");
    return false;
  }

  if (!emailExistInDatabase.docs.length) {
    form.email().classList.remove("error-input");
    return true;
  }

  if (emailExistInDatabase.docs.length) {
    form.email().classList.add("error-input");
    form.emailExistsError().style.display = "block";
    return false;
  }

  form.email().classList.remove("error-input");

  return isValid;
}

// Essa função é responsável por validar o nome
export async function onChangeName() {
  const name = form.name().value;
  document.getElementById("name-required-error").style.display = name
    ? "none"
    : "block";
  document.getElementById("name-min-length-error").style.display =
    name && name.length >= 3 ? "none" : "block";

  if (name && name.length >= 3) {
    form.name().classList.remove("error-input");
  } else {
    form.name().classList.add("error-input");
  }
  await toggleRegisterButtonDisable();
}

// Essa função é responsável por validar o email
export async function onChangeEmail() {
  const email = form.email().value;
  form.emailRequiredError().style.display = email ? "none" : "block";

  await validateEmail(email);

  await toggleRegisterButtonDisable();
}

// Essa função é responsável por validar a senha
export async function onChangePassword() {
  const password = form.password().value;
  form.passwordRequiredError().style.display = password ? "none" : "block";

  form.passwordMinLengthError().style.display =
    password.length >= 6 ? "none" : "block";

  if (password.length >= 6) {
    form.password().classList.remove("error-input");
  } else {
    form.password().classList.add("error-input");
  }

  validatePasswordMatch();
  await toggleRegisterButtonDisable();
}

// Essa função é responsável por validar a confirmação de senha
export async function onChangeConfirmPassword() {
  validatePasswordMatch();
  await toggleRegisterButtonDisable();
}

// Essa função é responsável por validar a confirmação de senha
export function validatePasswordMatch() {
  const password = form.password().value;
  const confirmPassword = form.confirmPassword().value;

  form.confirmPasswordDoesntMatchError().style.display =
    password === confirmPassword ? "none" : "block";

  if (password === confirmPassword) {
    form.confirmPassword().classList.remove("error-input");
  } else {
    form.confirmPassword().classList.add("error-input");
  }
}
// Essa função é responsável por validar o formulário
export async function toggleRegisterButtonDisable() {
  const isValid = !(await isFormValid());
  form.registerButton().disabled = isValid;
}
// Essa função é responsável por validar o formulário
export async function isFormValid() {
  const email = form.email().value;
  if (!email || !(await validateEmail(email))) {
    return false;
  }

  const password = form.password().value;
  if (!password || password.length < 6) {
    return false;
  }

  const confirmPassword = form.confirmPassword().value;
  if (password !== confirmPassword) {
    return false;
  }

  return true;
}

// Essa função é responsável por mostrar ou ocultar a senha
export function toggleTypePassword() {
  const inputTarget = this.getAttribute("data-target");
  const inputElement = form[inputTarget]();

  const type = inputElement.type === "password" ? "text" : "password";

  inputElement.type = type;

  const icon = type === "password" ? hide : show;
  this.setAttribute("src", `../../img/${icon}.png`);
}
// Essa função é responsável por criar a conta no firebase
export async function createAccountFirebase() {
  const email = form.email().value;
  const name = form.name().value;
  const password = form.password().value;

  await createUser(email, password)
    .then(async () => {
      await createUserInfo(name, email);
    })
    .catch((error) => {
      const errorMessage = error.message;
      alert(errorMessage);
    });
}
// Essa função é responsável por criar a conta
export async function handleCreateAccount() {
  await onChangeConfirmPassword();
  await onChangePassword();
  await onChangeEmail();
  await onChangeName();

  if (!(await isFormValid())) {
    return;
  }

  createAccountFirebase();
}

// Essa função é responsável por chamar as funções de validação
export function bindEvents() {
  form.confirmPassword().addEventListener("change", onChangeConfirmPassword);
  form.password().addEventListener("change", onChangePassword);

  form.email().addEventListener("change", onChangeEmail);
  form.name().addEventListener("change", onChangeName);

  form.registerButton().addEventListener("click", handleCreateAccount);

  for (const togglePassword of form.togglePassword()) {
    togglePassword.addEventListener("click", toggleTypePassword);
  }
}
