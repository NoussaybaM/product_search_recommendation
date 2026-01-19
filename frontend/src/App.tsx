import { useEffect, useState } from "react";
import { getProducts, getRecommendations } from "./components/api";
import ProductCard from "./components/ProductCard";
import SearchBox from "./components/SearchBox";
import type { Product } from "./components/types";

export default function App() {
  const [products, setProducts] = useState<string[]>([]);
  const [selected, setSelected] = useState("");
  const [recs, setRecs] = useState<Product[]>([]);

  const handleReset = ()=> {
    setSelected("");
    setRecs([]);
  };

  useEffect(() => {
    getProducts().then(setProducts);
  }, []);

  const search = async () => {
    const data = await getRecommendations(selected);
    setRecs(data);
  };

  return (
    <div className="max-w-7xl mx-auto p-10">
      <h1 className="text-3xl font-bold mb-6">
        Product Recommendation Engine
      </h1>

      <div className="flex gap-4">
        <SearchBox products={products} value={selected} onSelect={setSelected} onReset={handleReset} />
        <button
          onClick={search}
          className="bg-black text-white px-6 rounded"
        >
          Search
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-10">
        {recs.map(r => <ProductCard key={r.name} {...r} />)}
      </div>
    </div>
  );
}
