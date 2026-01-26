import type { Product } from "./types";

export default function ProductCard({
  name,
  image,
  link,
  ratings,
  no_of_ratings,
  discount_price,
  actual_price,
}: Product) {
  const discountPercent = Math.round(((actual_price - discount_price) / actual_price) * 100);

  return (
    <a href={link} target="_blank" rel="noopener noreferrer" className="border p-2 rounded hover:shadow-lg">
      <img src={image} alt={name} className="w-full h-40 object-contain mb-2" />
      <h2 className="font-bold text-sm mb-1">{name}</h2>
      <div className="text-yellow-500 mb-1">⭐ {ratings} ({no_of_ratings})</div>
      <div className="flex items-center gap-2">
        <span className="font-bold text-green-600">${discount_price}</span>
        <span className="line-through text-gray-500 text-sm">${actual_price}</span>
        <span className="text-red-500 text-sm">-{discountPercent}%</span>
      </div>
    </a>
  );
}
