import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import axios from "axios";

const Results = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get("q") || "";
  const centralityMetric = searchParams.get("metric") || "";

  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchResults = async () => {
      if (!query) {
        setLoading(false);
        return;
      }

      const currentPath = window.location.pathname;
      let url;

      if (currentPath.includes("search_regex")) {
        url = `http://127.0.0.1:8000/search_regex/?q=${encodeURIComponent(query)}`;
      } else if (currentPath.includes("search_by_centrality")) {
        url = `http://127.0.0.1:8000/search_by_centrality/?q=${encodeURIComponent(query)}&metric=${encodeURIComponent(centralityMetric)}`;
      } else {
        url = `http://127.0.0.1:8000/search/?q=${encodeURIComponent(query)}`;
      }

      console.log("Requête API :", url);

      try {
        const response = await axios.get(url);
        console.log("Réponse API :", response.data);
        setResults(response.data.resultats || []);
      } catch (err) {
        setError("Aucun livre trouvé.");
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [query, centralityMetric]);

  const handleSearch = () => {
    navigate("/");
  };

  const highlightText = (text, query) => {
    if (!query) return text;
    const regex = new RegExp(`(${query})`, "gi");
    return text.replace(
      regex,
      '<span class="bg-yellow-400 text-black px-1 rounded">$1</span>'
    );
  };

  const getSearchModeText = () => {
    const currentPath = window.location.pathname;
    if (currentPath.includes("search_regex")) {
      return "Expression régulière";
    } else if (currentPath.includes("search_by_centrality")) {
      const metricNames = {
        pagerank: "PageRank",
        closeness: "Closeness",
        betweenness: "Betweenness",
      };
      return `Centralité (${metricNames[centralityMetric] || centralityMetric})`;
    } else {
      return "Standard";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-gray-200 flex flex-col">
      <header className="sticky top-0 backdrop-blur-md bg-gray-900/80 border-b border-gray-700/50 z-10">
        <div className="container mx-auto flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-4">
            <img
              src="/logo1.png"
              alt="Logo"
              className="h-12 opacity-90 transition-transform duration-300 transform hover:opacity-100 cursor-pointer hover:scale-125"
              onClick={handleSearch}
            />
            <h2 className="text-xl font-bold text-gray-100 hidden sm:block">
              BiblioSearch
            </h2>
          </div>
          <div className="text-gray-400 text-sm">
            Recherche :{" "}
            <span className="text-gray-100 font-medium">{query}</span>
            {centralityMetric && (
              <span className="ml-2 text-indigo-300">
                (Tri: {getSearchModeText()})
              </span>
            )}
          </div>
        </div>
      </header>

      <main className="flex-grow container mx-auto px-4 py-8">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-100 text-center mb-2">
          Recherche de Livres
        </h1>
        <p className="text-gray-400 text-center mb-4 text-lg">
          Résultats pour :{" "}
          <span className="text-indigo-300 font-semibold">{query}</span>
        </p>
        <p className="text-gray-500 text-center mb-10 text-sm">
          Mode de recherche : {getSearchModeText()}
        </p>

        {loading && (
          <div className="flex justify-center items-center py-16">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-400"></div>
          </div>
        )}

        {error && (
          <div className="flex justify-center items-center py-16">
            <div className="bg-red-900/30 border border-red-700 text-red-200 px-6 py-4 rounded-lg flex items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 mr-2"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              {error}
            </div>
          </div>
        )}

        {!loading && !error && results.length > 0 && (
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50 shadow-xl">
            <h2 className="text-2xl font-semibold text-gray-100 border-b border-gray-700/70 pb-3 mb-6 flex items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 mr-2 text-indigo-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                />
              </svg>
              {results.length} Livres trouvés
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {results.map((book, index) => (
                <div
                  key={index}
                  onClick={() => navigate(`/book/${book.id}`, { state: { book } })}
                  className="cursor-pointer group bg-gray-700/30 rounded-xl overflow-hidden border border-gray-700/50 hover:border-indigo-500/50 shadow-md hover:shadow-indigo-700/20 transition-all duration-300 flex flex-col"
                >
                  <div className="relative overflow-hidden h-48">
                    <img
                      src={book.cover_url}
                      alt={`Couverture de ${book.title}`}
                      className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-300"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = "/placeholder-book.jpg";
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-gray-900 to-transparent opacity-0 group-hover:opacity-60 transition-opacity" />
                    {centralityMetric && book.centrality_score && (
                      <div className="absolute top-2 right-2 bg-indigo-600/80 text-white text-xs px-2 py-1 rounded-full">
                        Score: {parseFloat(book.centrality_score).toFixed(4)}
                      </div>
                    )}
                  </div>

                  <div className="p-4 flex-grow flex flex-col justify-between bg-gray-800/80">
                    <strong
                      className="font-bold text-gray-100 leading-tight line-clamp-2 mb-2 group-hover:text-indigo-300 transition-colors"
                      dangerouslySetInnerHTML={{
                        __html: highlightText(book.title, query),
                      }}
                    />
                    <p className="text-gray-400 text-sm italic">
                      {book.author}
                    </p>
                  </div>

                  <div className="px-4 py-2 bg-gray-800 border-t border-gray-700/50 flex justify-end">
                    <span className="text-xs text-indigo-400 font-medium flex items-center">
                      Voir plus
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4 ml-1"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M14 5l7 7m0 0l-7 7m7-7H3"
                        />
                      </svg>
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {!loading && !error && results.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-16 w-16 text-gray-600 mb-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1}
                d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
              />
            </svg>
            <p className="text-gray-400 text-xl mb-2">Aucun résultat trouvé</p>
            <p className="text-gray-500">
              Essayez d'autres termes de recherche
            </p>
          </div>
        )}
      </main>
    </div>
  );
};

export default Results;
