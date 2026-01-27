import axios from "axios";

const baseURL = import.meta.env.VITE_API_URL as string;

export const apiClient = axios.create({
  baseURL,
  timeout: 10_000,
  withCredentials: true, // если будут httpOnly cookie (refresh)
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json"
  }
});
