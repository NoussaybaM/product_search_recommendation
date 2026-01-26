import axios from "axios";
import type { Product } from "./types";

const API = "http://localhost:8000";

export const getProducts = async (): Promise<string[]> =>
(await axios.get(`${API}/products`)).data;


export const getRecommendations = async (product: string): Promise<Product[]> => {
  const res = await axios.get(`${API}/search`, {
    params: { q: product },
  });
  return res.data;
};

// Apply filters: min rating, max price, category
export const getFilters = async (
  minRating: number,
  maxPrice: number,
  category: string
): Promise<Product[]> => {
  const res = await axios.get(`${API}/filter`, {
    params: {
      min_rating: minRating,
      max_price: maxPrice,
      category: category,
    },
  });
  return res.data;
};

// Sort products
export const getSort = async (sortBy: string): Promise<Product[]> => {
  const res = await axios.get(`${API}/sort`, {
    params: { sort_by: sortBy },
  });
  return res.data;
};

// Get top deals (highest discounts)
export const getTopDeals = async (): Promise<Product[]> => {
  const res = await axios.get(`${API}/deals`);
  return res.data;
};