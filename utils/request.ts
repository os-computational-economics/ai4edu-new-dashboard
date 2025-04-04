// request.ts
import axios, { AxiosRequestConfig, AxiosResponse } from "axios";
import https from "https";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Cookies from "js-cookie";
import { AUTH_PATH } from "./constants";

export const localBackend =
  process.env.NEXT_PUBLIC_LOCAL_BACKEND?.toUpperCase() === "TRUE";

// default values of the environment variables
const apiVersion = process.env.NEXT_PUBLIC_API_VERSION;
const role = process.env.NEXT_PUBLIC_ROLE;
let baseURL = process.env.NEXT_PUBLIC_ONLINE_BASE_URL;
let environment = process.env.NEXT_PUBLIC_DEV_ENVIRONMENT;
let httpsAgent = new https.Agent({
  rejectUnauthorized: process.env.NODE_ENV !== "development",
});

if (process.env.NODE_ENV === "development") {
  /*
  running in 'next dev' mode
  if the local backend is set to true, use the local backend.
  else use the online development backend
  sometimes frontend developers don't want / don't know how to run the backend locally
  */
  baseURL = localBackend
    ? process.env.NEXT_PUBLIC_LOCAL_BASE_URL
    : process.env.NEXT_PUBLIC_ONLINE_BASE_URL;
  environment = process.env.NEXT_PUBLIC_DEV_ENVIRONMENT;
} else if (process.env.NODE_ENV === "production") {
  /*
  running in 'next build' mode
  there are two possible environments: preview and production
  in preview mode, the NEXT_PUBLIC_CURRENT_ENV is set to 'development'
  in production mode, the NEXT_PUBLIC_CURRENT_ENV is set to 'production'
  NEXT_PUBLIC_CURRENT_ENV is set in the Vercel configuration
  */
  baseURL = process.env.NEXT_PUBLIC_ONLINE_BASE_URL;
  environment =
    process.env.NEXT_PUBLIC_CURRENT_ENV === "production"
      ? process.env.NEXT_PUBLIC_PROD_ENVIRONMENT
      : process.env.NEXT_PUBLIC_DEV_ENVIRONMENT;
} else {
  /*
  fail safe: all variables are set to default values
  the default is the online development backend
  */
  console.log("Unknown environment");
}

export const apiUrl = `${baseURL}/${apiVersion}/${environment}`;
console.log("****", apiUrl);

const instance = axios.create({
  baseURL: apiUrl,
  timeout: 100000, // 100s
  httpsAgent: httpsAgent,
});

// Request interceptor
instance.interceptors.request.use(
  async (config: AxiosRequestConfig) => {
    const access_token = Cookies.get("access_token");
    const refresh_token = Cookies.get("refresh_token");
    if (access_token && access_token !== "" && access_token !== "undefined") {
      // if access token is present, add it to the headers
      if (config.headers) {
        config.headers.Authorization = `Bearer access=${access_token}`;
      }
      return config as any;
    } else if (
      refresh_token &&
      refresh_token !== "" &&
      refresh_token !== "undefined"
    ) {
      // if access token is not present but refresh token is present, do a token refresh
      try {
        const response = await axios.get(
          `${apiUrl}/admin/generate_access_token`,
          {
            headers: {
              Authorization: `Bearer refresh=${refresh_token}`,
            },
          }
        );
        console.log("response", response);
        const new_access_token = response.data.data.access_token;
        Cookies.set("access_token", new_access_token, {
          expires: 29 / (24 * 60),
        });
        if (config.headers) {
          config.headers.Authorization = `Bearer access=${new_access_token}`;
        }
        return config as any;
      } catch (error) {
        Cookies.remove("access_token");
        Cookies.remove("refresh_token");
        window.location.href = AUTH_PATH;
      }
    }
    return config as any;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
instance.interceptors.response.use(
  (response: AxiosResponse) => {
    console.log("response", response);
    if (response.status === 200) {
      return response.data.data;
    } else {
      return Promise.reject(response);
    }
  },
  (error) => {
    console.log("error", error);
    if (error.response && error.response.status) {
      /* would show code errors to users
      toast.error(error.response.data.message, {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        progress: undefined,
      });*/
      if (error.response.status === 401) {
        // authorization error, logout
        Cookies.remove("access_token");
        Cookies.remove("refresh_token");
        localStorage.clear();
        setTimeout(() => {
          window.location.href = AUTH_PATH;
        }, 3000);
      } else if (error.response.status === 500) {
        // server error
        /* not an informative error message, should replace
        toast.error("please try again later", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          progress: undefined,
        });
        */
      } else {
      }
    }

    return Promise.reject(error);
  }
);

export default instance;
