import axios from "axios";
import { jwtDecode } from "jwt-decode";

const API_BASE_URL = "http://127.0.0.1:8000/api"; // Django backend URL

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: { "Content-Type": "application/json" },
});


// Function to refresh access token
const refreshAccessToken = async () => {
  try {
    const refreshToken = localStorage.getItem("refreshToken");
    const response = await axios.post(`${API_BASE_URL}/token/refresh/`, {
      refresh: refreshToken,
    });

    localStorage.setItem("accessToken", response.data.access);
    return response.data.access;
  } catch (error) {
    console.error("Refresh token failed", error);
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    return null;
  }
};

// Axios request interceptor to handle expired tokens
api.interceptors.request.use(async (config) => {
  let accessToken = localStorage.getItem("accessToken");

  if (accessToken) {
    const decoded = jwtDecode(accessToken);
    if (Date.now() >= decoded.exp * 1000) {
      accessToken = await refreshAccessToken();
    }
  }

  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }

  return config;
});

export default api;
