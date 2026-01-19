interface Props {
  products: string[];
  onSelect: (value: string) => void;
}

export default function SearchBox({ products, onSelect }: Props) {
  return (
    <>
    <input
      list="products"
      className="border p-2 w-96 rounded"
      placeholder="Search product..."
      onChange={(e) => onSelect(e.target.value)}
    />
    <datalist id="products">
      {products.map(p => <option key={p} value={p} />)}
    </datalist>
        </>

  );
}
