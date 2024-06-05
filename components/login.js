// login
import { httpClient } from "../util/client.js";
import { config } from "../util/config.js";

httpClient.baseUrl = config.serverApi;

const container = document.querySelector(".container");
const signupForm = document.querySelector(".signup-form");
const signInForm = document.querySelector(".signin-form");
const btnSignup = document.querySelector("#signUp");
const btnSignIn = document.querySelector("#signIn");
const loading = document.querySelector("#loading");

btnSignup.addEventListener("click", function () {
  container.classList.add("right-panel-active");
});

btnSignIn.addEventListener("click", function () {
  container.classList.remove("right-panel-active");
});

signupForm.addEventListener("submit", async function (e) {
  e.preventDefault();
  try {
    loading.style.display = "block";

    const formData = new FormData(e.target);
    const body = Object.fromEntries(formData.entries());

    const { response } = await httpClient.post("/auth/register", body);

    if (!response) {
      throw new Error("Đăng ký không thành công! Vui lòng thử lại.");
    } else {
      alert("Đăng ký thành công");
      container.classList.remove("right-panel-active");
    }
  } catch (err) {
    alert(err);
  } finally {
    signupForm.reset();
    loading.style.display = "none";
  }
});

signInForm.addEventListener("submit", async function (e) {
  e.preventDefault();

  try {
    loading.style.display = "block";

    const formData = new FormData(e.target);
    const body = Object.fromEntries(formData.entries());

    const { response, data } = await httpClient.post("/auth/login", body);

    if (!response) {
      throw new Error("Đăng nhập thất bại! Mật khẩu hoặc email không đúng");
    }

    const tokens = {
      accessToken: data.data.accessToken,
      refreshToken: data.data.refreshToken,
    };

    localStorage.setItem("login_token", JSON.stringify(tokens));

    window.location.href = `/index.html`;
  } catch (err) {
    alert(err);
  } finally {
    loading.style.display = "none";
  }
});
