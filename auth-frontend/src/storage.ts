import Cookies from 'js-cookie';

export const STORAGE_KEYS = {
  AUTH_TOKEN: 'AUTH_TOKEN',
  USER_DATA: 'USER_DATA',
};

// Wrapper around js-cookie to match your axiosConfig usage
export const cookies = {
  get: (key: string) => Cookies.get(key),
  set: (key: string, value: string, options?: any) => Cookies.set(key, value, options),
  remove: (key: string, options?: any) => Cookies.remove(key, options),
};

export const clearAllStorage = () => {
  // Clear cookies
  Cookies.remove(STORAGE_KEYS.AUTH_TOKEN);
  Cookies.remove(STORAGE_KEYS.USER_DATA);
  
  // Clear local/session storage just in case
  localStorage.clear();
  sessionStorage.clear();
};
