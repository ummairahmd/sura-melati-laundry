import axios from "axios";

const API = axios.create({
    baseURL: "https://sura-melati-backend.onrender.com"
});

export default API;
