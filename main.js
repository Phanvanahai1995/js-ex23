"use strict";
import { httpClient } from "./util/client.js";
import { config } from "./util/config.js";
import { formattedDate } from "./util/formatDate.js";
import { createPostHtml } from "./layout/createPost.js";

httpClient.baseUrl = config.serverApi;

let isLogin = false;

const container = document.querySelector("#container");
const blogsInner = document.querySelector(".blogs-inner");
const newBlogInner = document.querySelector(".newBlog-inner");

const linkLogIn = `<div class="blog-post">
<div><a href="/layout/login.html">Login</a></div>
</div>`;

// render blog
async function getBlog() {
  try {
    isLogin = localStorage.getItem("login_token") ? true : false;

    newBlogInner.innerHTML = isLogin ? createPostHtml : linkLogIn;

    loading.style.display = "block";
    const { response, data } = await httpClient.get("/blogs");

    if (!response) {
      throw new Error("Blogs not found!");
    } else {
      const blogs = data.data;

      const html = blogs
        .map(
          (blog) => `
         <div class="blog">
        <div class="image">
          <img src="https://plus.unsplash.com/premium_photo-1683140874457-ba20cc63f9c8?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" alt="${
            blog.title
          }" />
          <div class="name">${blog.userId.name.toUpperCase()}</div>
        </div>
       <div class="post">
           <div class="contents">
                <div class="title">${blog.title}</div>
                <div class="content">${blog.content}</div>
           </div>
          <div class="time">
              ${formattedDate(blog.createdAt)}
          </div>
       </div>
        <div class="view-detail"><a href="#" data-id="${
          blog._id
        }">View Detail</a></div>
      </div> 
      `
        )
        .join("");

      blogsInner.innerHTML = html;
    }
  } catch (err) {
    alert(err);
    blogsInner.innerHTML = `Some thing went wrong!`;
  } finally {
    loading.style.display = "none";
  }
}

getBlog();

async function getProfile() {
  try {
    if (localStorage.getItem("login_token")) {
      const { accessToken, refreshToken } = JSON.parse(
        localStorage.getItem("login_token")
      );

      httpClient.token = accessToken;

      const { response, data } = await httpClient.get(`/users/profile`);

      if (!response) {
        throw new Error("Some thing went wrong!");
      } else {
        const name = container.querySelector(".profile .name");
        name.innerText = data.data.name;
      }
    }
  } catch {
    handleLogout();
  }
}

getProfile();

function handleLogout() {
  localStorage.removeItem("login_token");

  getBlog();
}

container.addEventListener("submit", async function (e) {
  e.preventDefault();
  try {
    const form = new FormData(e.target);
    const body = Object.fromEntries(form.entries());

    const { response } = await httpClient.post("/blogs", body);

    if (!response) {
      throw new Error("Có lỗi xảy ra! Vui lòng thử lại");
    } else {
      getProfile();
      getBlog();
    }
  } catch (err) {
    alert(err);
  } finally {
    e.target.reset();
  }
});

container.addEventListener("click", function (e) {
  if (e.target.classList.contains("logout")) {
    handleLogout();
    getBlog();
  }
});
