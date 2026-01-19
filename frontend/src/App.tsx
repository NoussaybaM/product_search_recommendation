// import { useState } from 'react'
// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'
// import './App.css'

// function App() {
//   const [count, setCount] = useState(0)

//   return (
//     <>
//       <div>
//         <a href="https://vite.dev" target="_blank">
//           <img src={viteLogo} className="logo" alt="Vite logo" />
//         </a>
//         <a href="https://react.dev" target="_blank">
//           <img src={reactLogo} className="logo react" alt="React logo" />
//         </a>
//       </div>
//       <h1>Vite + React</h1>
//       <div className="card">
//         <button onClick={() => setCount((count) => count + 1)}>
//           count is {count}
//         </button>
//         <p>
//           Edit <code>src/App.tsx</code> and save to test HMR
//         </p>
//       </div>
//       <p className="read-the-docs">
//         Click on the Vite and React logos to learn more
//       </p>
//     </>
//   )
// }

// export default App
import { useEffect, useState } from "react";
import { getProducts, getRecommendations } from "./components/api";
import ProductCard from "./components/ProductCard";
import SearchBox from "./components/SearchBox";
import type { Product } from "./components/types";

export default function App() {
  const [products, setProducts] = useState<string[]>([]);
  const [selected, setSelected] = useState("");
  const [recs, setRecs] = useState<Product[]>([]);

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
        <SearchBox products={products} onSelect={setSelected} />
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
