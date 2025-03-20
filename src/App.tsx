import { useEffect, useState } from "react";
import "./App.scss";
import Spinner from "./components/Spinner";

export type TAdviceSlip = {
  slip: {
    id: number;
    advice: string;
  };
};
function App() {
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<TAdviceSlip | null>(null);

  const slip = data?.slip?.advice;

  const fetchAdvice = async () => {
    const abortController = new AbortController();
    const signal = abortController.signal;
    try {
      setLoading(true);
      const response = await fetch("https://api.adviceslip.com/advice", {
        signal,
      });
      if (!response.ok) {
        throw new Error(`HTTP error: Status ${response.status}`);
      }
      const advice = await response.json();
      setData(advice);
      setError("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
      setData(null);
    } finally {
      setLoading(false);
    }

    return () => abortController.abort();
  };
  useEffect(() => {
    fetchAdvice();
  }, []);

  return (
    <>
      <h1 className="life-advice">Life Advice</h1>
      {loading ? (
        <Spinner />
      ) : error ? (
        <p>Error loading advice</p>
      ) : (
        <div style={{ maxWidth: "70rem" }}>
          <p style={{ fontSize: "24px", fontStyle: "italic" }}>"{slip}"</p>
          <button
            onClick={fetchAdvice}
            title={"Refresh the advice"}
            type={"button"}
            className="refresh-button"
          >
            Refresh
          </button>
        </div>
      )}
    </>
  );
}

export default App;
