import { getTokenStorage, setTokenStorage } from "./storage.js";

export const httpClient = {
  token: null,
  baseUrl: null,
  refreshTokenPromise: null,
  send: async function (path, method = "GET", body = null, headers = {}) {
    let response = null;
    try {
      if (!this.baseUrl) {
        throw new Error("Vui lòng cập nhật baseUrl");
      }
      const url = this.baseUrl + path;
      const initialHeaders = { "Content-Type": "application/json" };
      Object.assign(initialHeaders, headers);
      if (this.token) {
        initialHeaders["Authorization"] = `Bearer ${this.token}`;
      }
      const options = {
        method,
        headers: initialHeaders,
      };
      if (body) {
        options.body = JSON.stringify(body);
      }
      response = await fetch(url, options);
      if (!response.ok) {
        throw new Error(response.statusText);
      }
      const data = await response.json();

      return { response, data };
    } catch (e) {
      console.log(e);
      //Xử lý cấp lại accessToken khi hết hạn
      if (!this.refreshTokenPromise) {
        this.refreshTokenPromise = this.getRefreshToken();
      }
      const newToken = await this.refreshTokenPromise;

      if (!newToken) {
        return { response };
      } else {
        //Lưu vào Storage
        setTokenStorage(newToken.data.token);
        //Gọi lại request bị failed
        this.token = newToken.data.token.accessToken;
        return await this.send(path, method, body, headers);
      }
    }
  },
  getRefreshToken: async function () {
    try {
      const { refreshToken } = getTokenStorage();
      const response = await fetch(`${this.baseUrl}/auth/refresh-token`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ refreshToken }),
      });
      if (!response.ok) {
        throw new Error("Refresh Token không hợp lệ");
      }
      const tokens = response.json();
      return tokens;
    } catch (e) {
      return false;
    }
  },
  get: function (url) {
    return this.send(url);
  },
  post: function (url, body, headers = {}) {
    return this.send(url, "POST", body, headers);
  },
  put: function (url, body, headers = {}) {
    return this.send(url, "PUT", body, headers);
  },
  patch: function (url, body, headers = {}) {
    return this.send(url, "PATCH", body, headers);
  },
  delete: function (url, headers = {}) {
    return this.send(url, "DELETE", null, headers);
  },
};

/*
const client = httpClient();
const users = client.get(url);
client.post(url, body)
client.put(url, body)
client.patch(url, body)
client.delete(url)
*/
