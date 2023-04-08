import { useEffect, useState } from "react";
import useDebounce from "./hooks/useDebounce";

function App() {
  function searchApi(search) {
    const apiKey = "b3d7513e669169551c86a221bb67c912";
    return fetch(
      `https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&query=${search}`
    )
      .then((r) => r.json())
      .then((r) => r.results)
      .catch((error) => {
        console.error(error);
        return [];
      });
  }

  const [searchTerm, setSearchTerm] = useState("");
  const [results, setResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);

  const debouncedSearchTerm = useDebounce(searchTerm, 1000);

  useEffect(() => {
    if (debouncedSearchTerm) {
      setIsSearching(true);
      searchApi(debouncedSearchTerm).then((results) => {
        setIsSearching(false);
        setResults(results);
      });
    } else {
      setResults([]);
      setIsSearching(false);
    }
  }, [debouncedSearchTerm]);
  return (
    <div style={{ width: "50%", margin: "auto", height: "5vh" }}>
      <input
        placeholder='Search Marvel Comics'
        onChange={(e) => setSearchTerm(e.target.value)}
        style={{ width: "100%", height: "100%" }}
      />
      {isSearching && <div>Searching...</div>}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: "2rem",
        }}
      >
        {results.length > 0 ? (
          results.map((result) => (
            <div key={result.id}>
              <h4>{result.title}</h4>
              <img
                src={`https://image.tmdb.org/t/p/w500/${result.poster_path}`}
                style={{ width: "100%" }}
              />
            </div>
          ))
        ) : (
          <iframe style={{border: 'none', width: '50vw', height: '70vh'}} src='https://embed.lottiefiles.com/animation/109247'></iframe>
        )}
      </div>
    </div>
  );
}

export default App;
