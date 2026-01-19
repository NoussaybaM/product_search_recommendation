interface Props {
  products: string[];
  value: string;
  onSelect: (value: string) => void;
  onReset: ()=> void;
}

export default function SearchBox({ products, value, onSelect, onReset }: Props) {
  return (
    <>
    <input
      list="products"
      className="border p-2 w-96 rounded"
      placeholder="Search product..."
      value ={value}
      onChange={(e) => onSelect(e.target.value)}
    />
    <datalist id="products">
      {products.map(p => <option key={p} value={p} />)}
    </datalist>
    <button
      type="button"
      onClick={onReset}
      className="ml-2 px-4 py-2 border rounded"
    >
      Reset
    </button>
        </>
  );
}
