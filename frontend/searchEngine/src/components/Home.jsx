import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const [query, setQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [recentSearches, setRecentSearches] = useState([]);
  const [isRegex, setIsRegex] = useState(false);
  const [centrality, setCentrality] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const savedSearches = localStorage.getItem("recentSearches");
    if (savedSearches) {
      setRecentSearches(JSON.parse(savedSearches).slice(0, 5));
    }
  }, []);

  const saveToRecent = (searchQuery) => {
    const updatedSearches = [
      searchQuery,
      ...recentSearches.filter((s) => s !== searchQuery),
    ].slice(0, 5);

    setRecentSearches(updatedSearches);
    localStorage.setItem("recentSearches", JSON.stringify(updatedSearches));
  };

  const handleSearch = () => {
    const trimmedQuery = query.trim();
    if (!trimmedQuery) return;

    const encodedQuery = encodeURIComponent(trimmedQuery);
    setIsLoading(true);
    saveToRecent(trimmedQuery);

    setTimeout(() => {
      setIsLoading(false);
      if (isRegex) {
        navigate(`/search_regex?q=${encodedQuery}`);
      } else if (centrality) {
        navigate(`/search_by_centrality?q=${encodedQuery}&metric=${centrality}`);
      } else {
        navigate(`/results?q=${encodedQuery}`);
      }
    }, 300);
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      handleSearch();
    }
  };

  const toggleRegexSearch = () => {
    setIsRegex(!isRegex);
    if (!isRegex) {
      setCentrality("");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 text-gray-900 dark:text-gray-100 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl">
        <div className="flex flex-col items-center justify-center py-12 md:py-16">
          <div className="mb-10 transition-all duration-500 hover:scale-105 relative">
            <div className="absolute inset-0 bg-purple-500 rounded-full blur-xl opacity-20 animate-pulse"></div>
            <img
              src="/logo1.png"
              alt="Logo BiblioSearch"
              className="h-28 md:h-36 relative z-10 drop-shadow-xl"
            />
          </div>

          <div className="text-center mb-10 w-full max-w-2xl px-4">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 bg-gradient-to-r from-purple-600 via-purple-500 to-indigo-600 bg-clip-text text-transparent">
              Bibliothèque Numérique
            </h1>
            <p className="text-gray-600 dark:text-gray-300 text-lg md:text-xl font-light">
              Explorez des milliers de livres et trouvez votre prochaine aventure littéraire
            </p>
          </div>

          <div className="w-full max-w-2xl bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 border border-gray-200 dark:border-gray-700">
            <div className="relative mb-6">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                </svg>
              </div>
              <input
                type="text"
                placeholder={
                  isRegex
                    ? "Entrez une expression régulière..."
                    : "Recherchez par titre, auteur ou mot-clé..."
                }
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={handleKeyDown}
                className="w-full pl-10 pr-24 py-4 text-base md:text-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-xl border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 focus:outline-none transition-all duration-200"
              />
              <button
                onClick={handleSearch}
                disabled={isLoading || !query.trim()}
                className={`absolute right-2 top-2 bottom-2 px-5 rounded-lg font-medium flex items-center justify-center transition-all duration-300 ${
                  isLoading || !query.trim()
                    ? "bg-gray-200 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed"
                    : "bg-purple-600 hover:bg-purple-700 text-white"
                }`}
              >
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-gray-300 border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  "Rechercher"
                )}
              </button>
            </div>

            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
              <div className="flex items-center">
                <button
                  onClick={toggleRegexSearch}
                  className={`flex items-center justify-center text-sm px-4 py-2 rounded-lg transition-all duration-200 ${
                    isRegex
                      ? "bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800"
                      : "bg-gray-100 dark:bg-gray-700/50 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700 hover:bg-gray-200 dark:hover:bg-gray-700"
                  }`}
                >
                  <span className={`mr-2 ${isRegex ? "text-purple-600 dark:text-purple-400" : "text-transparent"}`}>✓</span>
                  Expression régulière
                </button>
              </div>

              <div className="relative">
                <select
                  value={centrality}
                  onChange={(e) => setCentrality(e.target.value)}
                  disabled={isRegex}
                  className={`appearance-none w-full md:w-auto bg-gray-100 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 rounded-lg px-4 py-2 pr-8 text-sm transition-colors ${
                    isRegex ? "opacity-50 cursor-not-allowed" : "hover:bg-gray-200 dark:hover:bg-gray-700"
                  }`}
                >
                  <option value="">Méthode de tri standard</option>
                  <option value="pagerank">Trier par PageRank</option>
                  <option value="closeness">Trier par Closeness</option>
                  <option value="betweenness">Trier par Betweenness</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700 dark:text-gray-300">
                  <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                    <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                  </svg>
                </div>
              </div>
            </div>

            {recentSearches.length > 0 && (
              <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
                <h3 className="text-sm text-gray-500 dark:text-gray-400 mb-3 font-medium">Recherches récentes</h3>
                <div className="flex flex-wrap gap-2">
                  {recentSearches.map((term, index) => (
                    <button
                      key={index}
                      onClick={() => {
                        setQuery(term);
                        setTimeout(() => handleSearch(), 100);
                      }}
                      className="px-3 py-1.5 bg-gray-100 dark:bg-gray-700/50 text-gray-700 dark:text-gray-300 rounded-full text-sm border border-gray-200 dark:border-gray-700 hover:bg-gray-200 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white transition-colors duration-200"
                    >
                      {term}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="w-full max-w-2xl mt-10 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white dark:bg-gray-800/50 p-4 rounded-xl shadow-md border border-gray-200 dark:border-gray-700 text-center">
              <div className="text-purple-500 mb-2 flex justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <h3 className="font-semibold text-gray-900 dark:text-white">Bibliothèque vaste</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Des milliers de livres à explorer</p>
            </div>
            
            <div className="bg-white dark:bg-gray-800/50 p-4 rounded-xl shadow-md border border-gray-200 dark:border-gray-700 text-center">
              <div className="text-purple-500 mb-2 flex justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <h3 className="font-semibold text-gray-900 dark:text-white">Recherche avancée</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Regex et algorithmes de centralité</p>
            </div>
            
            <div className="bg-white dark:bg-gray-800/50 p-4 rounded-xl shadow-md border border-gray-200 dark:border-gray-700 text-center">
              <div className="text-purple-500 mb-2 flex justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                </svg>
              </div>
              <h3 className="font-semibold text-gray-900 dark:text-white">Personnalisation</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Options adaptées à vos préférences</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;