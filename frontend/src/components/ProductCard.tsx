import type { Product } from "./types";

export default function ProductCard({ name, image, score }: Product) {
  return (
    <div className="rounded-xl shadow p-4 hover:shadow-xl transition">
      <img src={image} className="h-40 mx-auto object-contain" />
      <p className="font-semibold mt-2">{name}</p>
      <p className="text-sm text-gray-500">
        Similarity: {score}
      </p>
    </div>
  );
}
