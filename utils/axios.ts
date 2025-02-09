import axios from "axios";
import Cookies from "js-cookie";
import dotenv from "dotenv";

dotenv.config();
// Buat instance Axios
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || "https://api.example.com", // Ganti dengan URL API Anda
  timeout: 300000, // Timeout dalam milidetik
  withCredentials: true, // Kirim cookie otomatis dengan setiap permintaan
});
// Interceptor untuk menambahkan token dari cookie ke header Authorization (jika diperlukan)
api.interceptors.request.use((config) => {
  const token = Cookies.get("token"); // Ambil token dari cookie
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Fungsi untuk memperbarui token jika diperlukan secara manual
export const setAuthToken = (token: string) => {
  if (token) {
    api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  } else {
    delete api.defaults.headers.common["Authorization"];
  }
};

export default api;
