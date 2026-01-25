import axios from "axios";

const baseURL = import.meta.env.VITE_API_URL;

export const authAgent = axios.create({
    baseURL,
    withCredentials: true,
});

export const publicAgent = axios.create({
    baseURL,
    withCredentials: false,
});