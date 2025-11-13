import axios from "axios";

const API = axios.create({
  baseURL: "http://10.41.11.72:5000/api",
  withCredentials: true,
});

export default API;
