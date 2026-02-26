import axios, {
  type AxiosError,
  type AxiosInstance,
  type InternalAxiosRequestConfig,
} from "axios";
import { onAuthStateChanged, type User } from "firebase/auth";
import { auth, waitForAuthReady } from "@/firebase";

const baseURL = "http://localhost:8000/api";

let onUnauthorizedHandler: (() => void) | null = null;

export const setOnUnauthorizedHandler = (handler: () => void) => {
  onUnauthorizedHandler = handler;
};

export const apiClient: AxiosInstance = axios.create({
  baseURL,
});

const waitForSignedInUser = (timeoutMs = 1200): Promise<User | null> => {
  if (auth.currentUser) {
    return Promise.resolve(auth.currentUser);
  }

  return new Promise((resolve) => {
    const timeoutId = window.setTimeout(() => {
      unsubscribe();
      resolve(null);
    }, timeoutMs);

    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (!firebaseUser) return;
      window.clearTimeout(timeoutId);
      unsubscribe();
      resolve(firebaseUser);
    });
  });
};

const getReadyFirebaseUser = async (): Promise<User | null> => {
  await waitForAuthReady();
  return auth.currentUser ?? (await waitForSignedInUser());
};

apiClient.interceptors.request.use(
  async (
    config: InternalAxiosRequestConfig,
  ): Promise<InternalAxiosRequestConfig> => {
    const currentUser = await getReadyFirebaseUser();
    config.headers = config.headers ?? {};

    if (currentUser) {
      const token = await currentUser.getIdToken(false);
      config.headers.Authorization = `Bearer ${token}`;
    } else {
      delete config.headers.Authorization;
    }

    return config;
  },
  (error) => Promise.reject(error),
);

apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const { response, config } = error;

    if (!response || !config) return Promise.reject(error);

    const isUnauthorized = response.status === 401;
    const originalRequest = config as InternalAxiosRequestConfig & {
      _retry?: boolean;
    };

    if (isUnauthorized && !originalRequest._retry) {
      try {
        originalRequest._retry = true;
        const firebaseUser = await getReadyFirebaseUser();
        if (!firebaseUser) {
          throw new Error("No authenticated firebase user for retry");
        }
        const newToken = await firebaseUser.getIdToken(true);
        originalRequest.headers = originalRequest.headers ?? {};
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return apiClient(originalRequest);
      } catch {
        // ignore and fall through
      }
    }

    if (response.status === 401 && onUnauthorizedHandler) {
      onUnauthorizedHandler();
    }

    return Promise.reject(error);
  },
);
