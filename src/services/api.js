import axios from "axios";

// Cria uma instância do Axios com a URL base da API
const api = axios.create({
  baseURL: '/api', // Publicado no Vercel
  // baseURL: "https://ape-api.azurewebsites.net", // Ambiente de Produção
  // baseURL: "https://ape-dev.azurewebsites.net", // Ambiente de Desenvolvimento
  // baseURL: "http://localhost:5000" // Local
});

export default api;