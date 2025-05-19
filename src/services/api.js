import axios from "axios";

// Cria uma instância do Axios com a URL base da API
const api = axios.create({
  baseURL: "https://pack-and-promote.azurewebsites.net/", // URL base da API
  // baseURL: "https://api.com.br/", // URL base da API
});

export default api;