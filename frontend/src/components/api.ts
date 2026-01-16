import axios from "axios";
import { Product } from "./types";

const API = "http://localhost:8000";

export const getProducts = async (): Promise<string[]> =>
(await axios.get(`${API}/products`)).data;


export const getRecommendations = async (product: string): Promise<Product[]> =>
(await axios.post(`${API}/recommend`,{product})).data;
