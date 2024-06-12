"use strict";
import { httpClient } from "./util/client.js";
import { config } from "./util/config.js";
import { formattedDate } from "./util/formatDate.js";
import { createPostHtml } from "./layout/createPost.js";
import { datePicker, getTimePicker } from "./util/datepicker.js";
import regex, { deleteSpace } from "./util/regex.js";

httpClient.baseUrl = config.serverApi;

let isLogin = false;

const container = document.querySelector("#container");
const blogsInner = document.querySelector(".blogs-inner");
const newBlogInner = document.querySelector(".newBlog-inner");

const linkLogIn = `<div class="blog-post">
<div><a href="./layout/login.html">Login</a></div>
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

      let html = blogs
        .map((blog) => {
          return `
            <div class="blog">
           <div class="image">
            
             <div class="name">${blog.userId.name.toUpperCase()}</div>
           </div>
          <div class="post">
              <div class="contents">
                   <div class="title">${blog.title}</div>
                   <div class="content">${deleteSpace(blog.content)} </div>
              </div>
             <div class="time">
                 ${formattedDate(blog.createdAt)}
             </div>
          </div>
           <div class="view-detail"><span class="show-detail" data-id="${
             blog._id
           }">View Detail</span></div>
         </div> 
         `;
        })
        .join("");

      isLogin && getProfile();

      html = regex(html);

      blogsInner.innerHTML = html;

      // const linkArr = Array.from(blogsInner.querySelectorAll("a"));

      // const newLink = linkArr.filter((link) =>
      //   link.outerHTML.includes('href="https://<a href="')
      // );

      // console.log(newLink[0].href);
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
        datePicker();
      }
    }
  } catch {
    handleLogout();
  }
}

// getProfile();

function handleLogout() {
  localStorage.removeItem("login_token");

  getBlog();
}

let timerId;

container.addEventListener("submit", async function (e) {
  e.preventDefault();
  try {
    const form = new FormData(e.target);
    const body = Object.fromEntries(form.entries());

    const { response } = await httpClient.post("/blogs", body);

    if (!response) {
      throw new Error("Có lỗi xảy ra! Vui lòng thử lại");
    } else {
      const timeRemain = document.querySelector(".time-remain");
      timeRemain.innerText = "";
      if (timerId) {
        clearInterval(timerId);
        timerId = undefined;
      }

      const inputDatePicker = document.getElementById("datetime-picker");
      if (inputDatePicker.value && title && content) {
        const dateSelected = new Date(
          inputDatePicker._flatpickr.selectedDates[0].toString()
        );
        timerId = setInterval(() => {
          getTimePicker(dateSelected);
        }, 1000);
      }
      getProfile();
      getBlog();
    }
  } catch (err) {
    alert(err);
  } finally {
    e.target.reset();
  }
});

function renderDetailBlog(blog) {
  let html = `
     <div class="blog blog-detail">
        <div class="image">
        
          <div class="name">${blog.userId.name.toUpperCase()}</div>
        </div>
       <div class="post">
           <div class="contents">
                <div class="title">${blog.title}</div>
                <div class="content">${deleteSpace(blog.content)} </div>
           </div>
          <div class="time">
              ${formattedDate(blog.createdAt)}
          </div>
       </div>
        <div class="view-detail back-home">Back to home!</div>
      </div>
    

    `;

  html = regex(html);

  blogsInner.innerHTML = html;
}

async function showDetailBlog(id) {
  const { response, data } = await httpClient.get(`/blogs/${id}`);

  if (!response) throw new Error("Fetch blog not found!");

  renderDetailBlog(data.data);
}

container.addEventListener("click", function (e) {
  if (e.target.classList.contains("logout")) {
    handleLogout();
    getBlog();
  }

  if (e.target.classList.contains("show-detail")) {
    const userId = e.target.dataset.id;
    showDetailBlog(userId);
    newBlogInner.innerHTML = "";
  }

  if (e.target.classList.contains("back-home")) getBlog();
});
