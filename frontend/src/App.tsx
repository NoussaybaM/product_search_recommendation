import { useEffect, useState } from "react";
import ProductCard from "./components/ProductCard";
import SearchBox from "./components/SearchBox";
import type { Product } from "./components/types";
import {
  getProducts,
  getRecommendations,
  getFilters,
  getSort,
  getTopDeals,
} from "./components/api";

export default function App() {
  const [products, setProducts] = useState<string[]>([]);
  const [selected, setSelected] = useState("");
  const [recs, setRecs] = useState<Product[]>([]);
  const [category, setCategory] = useState("");
  const [minRating, setMinRating] = useState(0);
  const [maxPrice, setMaxPrice] = useState(1000);
  const [sortBy, setSortBy] = useState("ratings");

  const handleReset = () => {
    setSelected("");
    setRecs([]);
    setCategory("");
    setMinRating(0);
    setMaxPrice(1000);
    setSortBy("ratings");
  };

  // Load product names on mount
  useEffect(() => {
    getProducts().then(setProducts).catch(console.error);
  }, []);

  // Search / hybrid recommendations
  const search = async () => {
    if (!selected) return;
    try {
      const data = await getRecommendations(selected);
      setRecs(data);
    } catch (err) {
      console.error(err);
    }
  };

  // Apply filters
  const applyFilters = async () => {
    try {
      const data = await getFilters(minRating, maxPrice, category);
      setRecs(data);
    } catch (err) {
      console.error(err);
    }
  };

  // Apply sorting
  const applySort = async (newSort: string) => {
    setSortBy(newSort);
    try {
      const data = await getSort(newSort);
      setRecs(data);
    } catch (err) {
      console.error(err);
    }
  };

  // Show top deals
  const showTopDeals = async () => {
    try {
      const data = await getTopDeals();
      setRecs(data);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-10">
      <h1 className="text-3xl font-bold mb-6">
        Product Recommendation Engine
      </h1>

      {/* Search + Buttons */}
      <div className="flex gap-4 flex-wrap mb-4">
        <SearchBox
          products={products}
          value={selected}
          onSelect={setSelected}
          onReset={handleReset}
        />
        <button
          onClick={search}
          className="bg-black text-white px-6 rounded"
        >
          Search
        </button>
        <button
          type="button"
          onClick={handleReset}
          className="ml-2 px-4 py-2 border rounded"
        >
          Reset
        </button>
        <button
          onClick={showTopDeals}
          className="ml-2 px-4 py-2 border rounded bg-yellow-400 hover:bg-yellow-300"
        >
          Top Deals
        </button>
      </div>

      {/* Filters */}
      <div className="flex gap-4 flex-wrap mb-6">
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="border p-2 rounded"
        >
          <option value="">All Categories</option>
          <option value="Electronics">Electronics</option>
          <option value="Accessories">Accessories</option>
          {/* add more categories if needed */}
        </select>

        <div>
          <label>Min Rating: {minRating}</label>
          <input
            type="range"
            min={0}
            max={5}
            step={0.5}
            value={minRating}
            onChange={(e) => setMinRating(parseFloat(e.target.value))}
            className="w-40"
          />
        </div>

        <div>
          <label>Max Price: ${maxPrice}</label>
          <input
            type="range"
            min={0}
            max={1000}
            step={1}
            value={maxPrice}
            onChange={(e) => setMaxPrice(parseFloat(e.target.value))}
            className="w-40"
          />
        </div>

        <button
          onClick={applyFilters}
          className="px-4 py-2 border rounded bg-gray-200 hover:bg-gray-300"
        >
          Apply Filters
        </button>

        <select
          value={sortBy}
          onChange={(e) => applySort(e.target.value)}
          className="border p-2 rounded"
        >
          <option value="ratings">Top Rated</option>
          <option value="popularity">Most Popular</option>
          <option value="price_low">Price Low → High</option>
          <option value="price_high">Price High → Low</option>
        </select>
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-10">
        {recs.map((r) => (
          <ProductCard key={r.name} {...r} />
        ))}
      </div>
    </div>
  );
}
