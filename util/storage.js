export const getTokenStorage = () => {
  const tokens = JSON.parse(localStorage.getItem("login_token"));
  return tokens;
};

export const setTokenStorage = (tokens) => {
  localStorage.setItem("login_token", JSON.stringify(tokens));
};
