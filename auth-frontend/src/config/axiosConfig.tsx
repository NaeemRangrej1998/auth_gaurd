import axios, {
  AxiosError,
  type AxiosResponse,
  type AxiosRequestConfig
} from 'axios';
import { clearAllStorage, cookies, STORAGE_KEYS } from '../storage';
// Create axios instance
export const api = axios.create({
  baseURL: undefined,
});

// Request interceptor
api.interceptors.request.use(
  (config: any) => {
    const authToken = cookies.get(STORAGE_KEYS.AUTH_TOKEN);
    if (authToken) {
      console.log({ authToken });

      config.headers.Authorization = `Bearer ${authToken}`
    }
    return config

  },
  (error: AxiosError) => {
    console.error('Request error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor

let count = 1
api.interceptors.response.use(
  (response: AxiosResponse) => {
    return response.data;
  },
  (error: AxiosError) => {
    if (error.response) {
      const status = error.response.status;
      if (status === 1000 || status === 401) {
        // if(timeout) clearTimeout(timeout)
        // handleAxiosResponse(error)
        // timeout=setTimeout(()=>{
        //   window.location.href= '/'
        //   count=1
        // },1000)
        clearAllStorage();
      } else throw error
    } else if (error.request) {
      console.error('No response received:', error.request);
    } else {
      console.error('Request setup error:', error);
    }

    return Promise.reject(error);
  }
);

// Options interface
interface Options {
  url: string;
  method: 'POST' | 'PUT' | 'GET' | 'PATCH' | 'DELETE';
  body?: object;
  params?: any;
  headers?: Record<string, string>;
  signal?: AbortSignal;
}

// Generate Axios config
const requestConfig = (options: Options): AxiosRequestConfig => {
  const config: AxiosRequestConfig = {
    url: options.url,
    method: options.method,
    data: options.body,
    params: options.params,
    signal: options.signal,
  };

  return config;
};

// Request function
export const request = async (options: Options): Promise<any> => {
  if (!navigator.onLine) {
    return Promise.reject({
      status: false,
      message: 'Internet Disconnected',
    });
  }

  const config = requestConfig(options);
  return api.request(config);
};
