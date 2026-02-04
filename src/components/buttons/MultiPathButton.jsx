import { usePath } from "../../contexts/PathContext";


export function MultiPathButton({children ,onClick , destinationsID,className }) {
  const { fetchManyPathsV2, loading } = usePath();

  const handleClick = () => {
      onClick()
    fetchManyPathsV2({
      start: 5,
      ends: destinationsID,
    });
  };

  return (
    <button onClick={handleClick} disabled={loading} className={className}>
      {loading ? "در حال دریافت مسیرها..." : children}
    </button>
  );
}
