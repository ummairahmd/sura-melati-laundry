import axios from "axios";

const API = axios.create({
    baseURL: "https://copying-virginia-listed-cup.trycloudflare.com"
});

export default API;