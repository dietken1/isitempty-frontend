const TOKEN_LOCAL_STORAGE_KEY = "pironeer_token";

export const TokenLocalStorageRepository = {
  getToken: () => {
    return localStorage.getItem(TOKEN_LOCAL_STORAGE_KEY);
  },
  setToken: ({ token }) => {
    localStorage.setItem(TOKEN_LOCAL_STORAGE_KEY, token);
  },
  removeToken: () => {
    localStorage.removeItem(TOKEN_LOCAL_STORAGE_KEY);
  },
};
