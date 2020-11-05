import axios from "axios";

const TOKEN_API_KEY =
  "YOUR_API_KEY";

export const api = axios.create({
  baseURL: "http://min-api.cryptocompare.com/data",
  headers: {
    authorization: `Apikey ${TOKEN_API_KEY}`,
  },
});

export default api;
