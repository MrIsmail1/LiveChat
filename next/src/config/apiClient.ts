import { navigate } from "@/lib/navigation";
import axios, {
  AxiosError,
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
} from "axios";
import queryClient from "./queryClient";

const expressAPIOptions: AxiosRequestConfig = {
  baseURL: process.env.NEXT_PUBLIC_EXPRESS_API_URL, // Express API
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
};

const denoHonoAPIOptions: AxiosRequestConfig = {
  baseURL: process.env.NEXT_PUBLIC_DENO_HONO_API_URL, // Deno Hono API
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
};

const expressAPI: AxiosInstance = axios.create(expressAPIOptions);
const denoHonoAPI: AxiosInstance = axios.create(denoHonoAPIOptions);

const TokenRefreshClient: AxiosInstance = axios.create(expressAPIOptions);

TokenRefreshClient.interceptors.response.use(
  (response: AxiosResponse) => response.data
);

expressAPI.interceptors.response.use(
  (response: AxiosResponse) => response.data,
  async (error: AxiosError): Promise<never> => {
    if (error.response) {
      const { config, response } = error;
      const { status, data } = response || {};
      const dataObj = typeof data === "object" && data !== null ? data : {};

      if (status === 401 && (data as any)?.errorCode === "Unauthorized") {
        try {
          await TokenRefreshClient.get("/auth/refresh");
          return TokenRefreshClient(config!);
        } catch (error) {
          queryClient.clear();
          navigate("/login");
        }
      }
      return Promise.reject({ status, ...dataObj });
    }
    return Promise.reject(error);
  }
);

denoHonoAPI.interceptors.response.use(
  (response: AxiosResponse) => response.data,
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

export { denoHonoAPI, expressAPI };
