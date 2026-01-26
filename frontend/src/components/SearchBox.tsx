import { useState, useEffect } from "react";

interface Props {
  products: string[];
  value: string;
  onSelect: (value: string) => void;
  onReset?: () => void;
}

export default function SearchBox({ products, value, onSelect, onReset }: Props) {
  const [suggestions, setSuggestions] = useState<string[]>([]);

  useEffect(() => {
    const fetchSuggestions = async () => {
      if (value.length < 2) {
        setSuggestions([]);
        return;
      }
      try {
        const res = await fetch(`/search?q=${encodeURIComponent(value)}`);
        const data = await res.json();
        setSuggestions(data.map((p: any) => p.name));
      } catch (err) {
        console.error(err);
      }
    };
    fetchSuggestions();
  }, [value]);

  return (
    <div className="relative w-full">
      <input
        list="products"
        className="border p-2 w-full rounded"
        placeholder="Search product..."
        value={value}
        onChange={(e) => onSelect(e.target.value)}
      />

      {onReset && value && (
        <button
          type="button"
          onClick={onReset}
          className="absolute right-2 top-2 text-sm px-2 py-1 border rounded bg-gray-200 hover:bg-gray-300"
        >
          Reset
        </button>
      )}

      {suggestions.length > 0 && (
        <datalist id="products">
          {suggestions.map((p) => (
            <option key={p} value={p} />
          ))}
        </datalist>
      )}
    </div>
  );
}
