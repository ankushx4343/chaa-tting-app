import axios from "axios";

export const axiosInstance = axios.create({
  baseURL: "https://chaa-tting-app-backend.onrender.com/api",
  withCredentials: true,
});
