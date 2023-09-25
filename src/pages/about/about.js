import { logout } from "../../main";

export const form = {
  btnLogout: () => document.querySelector("[data-logout]"),
};

export const handleLogout = () => {
  logout();
};

export function bindEvents() {
  form.btnLogout().removeEventListener("click", handleLogout);
  form.btnLogout().addEventListener("click", handleLogout);
}
