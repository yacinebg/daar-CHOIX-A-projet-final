import React, { useState, useEffect } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import Suggestions from "./Suggestions";

const BookDetails = () => {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const bookFromState = location.state?.book;

  const [book, setBook] = useState(bookFromState || null);
  const [loading, setLoading] = useState(!bookFromState);
  const [error, setError] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [fullContent, setFullContent] = useState(null);
  const [readingMode, setReadingMode] = useState(false);

  useEffect(() => {
    if (!bookFromState && id) {
      const fetchBookDetails = async () => {
        try {
          const response = await axios.get(`http://127.0.0.1:8000/book/${id}/`);
          setBook(response.data);

          const excerptResponse = await axios.get(`http://127.0.0.1:8000/book/${id}/excerpt/`);
          setExcerpt(excerptResponse.data.excerpt);
        } catch (err) {
          setError("Impossible de charger les détails du livre.");
        } finally {
          setLoading(false);
        }
      };

      fetchBookDetails();
    } else if (bookFromState) {
      setExcerpt(bookFromState.excerpt || "Extrait non disponible.");
    }
  }, [id, bookFromState]);

  const handleReadBook = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`http://127.0.0.1:8000/read_book/${id}/`);
      setFullContent(response.data.content);
      setReadingMode(true);
    } catch (error) {
      console.error("Erreur de chargement :", error);
    } finally {
      setLoading(false);
    }
  };

  const goBack = () => {
    if (readingMode) {
      setReadingMode(false);
      setFullContent(null);
    } else {
      navigate(-1);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 flex items-center justify-center">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-purple-500"></div>
          <p className="mt-4 text-purple-500 font-medium">Chargement en cours...</p>
        </div>
      </div>
    );
  }

  if (error || !book) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 flex items-center justify-center p-4">
        <div className="bg-red-100 dark:bg-red-900/30 border border-red-300 dark:border-red-700 text-red-800 dark:text-red-200 px-8 py-6 rounded-xl max-w-md mx-auto shadow-lg">
          <h2 className="text-2xl font-bold mb-2">Erreur</h2>
          <p className="mb-4">{error || "Livre non trouvé"}</p>
          <button 
            onClick={goBack} 
            className="px-5 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors shadow-md"
          >
            Retour
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      {readingMode ? (
        <div className="container mx-auto px-4 pt-6 pb-12 max-w-4xl">
          <button 
            onClick={goBack}
            className="mb-6 flex items-center text-purple-600 dark:text-purple-400 hover:text-purple-800 dark:hover:text-purple-300 transition-colors"
            aria-label="Retour"
          >
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className="h-5 w-5 mr-2" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Fermer la lecture
          </button>

          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden">
            <div className="px-6 py-5 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
              <h1 className="text-3xl font-bold">{book.title}</h1>
              <p className="text-lg text-gray-600 dark:text-gray-400">par {book.author}</p>
            </div>
            <div className="p-6 md:p-8 overflow-y-auto max-h-[75vh] prose dark:prose-invert max-w-none">
              {fullContent}
            </div>
          </div>
        </div>
      ) : (
        <div className="container mx-auto px-4 pt-6 pb-16 max-w-6xl">
          <button 
            onClick={goBack}
            className="mb-8 flex items-center text-purple-600 dark:text-purple-400 hover:text-purple-800 dark:hover:text-purple-300 transition-colors"
            aria-label="Retour aux résultats"
          >
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className="h-5 w-5 mr-2" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Retour aux résultats
          </button>

          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden">
            <div className="md:flex items-stretch">
              <div className="md:w-1/3 bg-gray-100 dark:bg-gray-700 p-8 flex items-center justify-center">
                <div className="relative max-w-xs transform transition-transform duration-300 hover:scale-105">
                  <img 
                    src={book.cover_url} 
                    alt={`Couverture de ${book.title}`}
                    className="w-full h-auto object-cover shadow-lg rounded-lg border border-gray-200 dark:border-gray-600"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = "/placeholder-book.jpg";
                    }}
                  />
                  <div className="absolute inset-0 rounded-lg shadow-inner pointer-events-none border border-white/5"></div>
                </div>
              </div>

              <div className="md:w-2/3 p-8">
                <div className="flex flex-col h-full justify-between">
                  <div>
                    <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-2">{book.title}</h1>
                    <p className="text-xl text-gray-700 dark:text-gray-300 mb-6">par <span className="italic font-medium">{book.author}</span></p>
                    
                    <div className="border-t border-b border-gray-200 dark:border-gray-700 py-6 my-6">
                      <h2 className="text-xl font-semibold mb-4">À propos de ce livre</h2>
                      <p className="text-gray-700 dark:text-gray-300">{excerpt || "Extrait non disponible."}</p>
                    </div>
                  </div>
                  
                  <div className="mt-6">
                    <button
                      onClick={handleReadBook}
                      className="w-full md:w-auto px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium transition-colors flex items-center justify-center shadow-md"
                    >
                      <svg 
                        xmlns="http://www.w3.org/2000/svg" 
                        className="h-5 w-5 mr-2" 
                        fill="none" 
                        viewBox="0 0 24 24" 
                        stroke="currentColor"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                      </svg>
                      Lire le livre
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-16">
            <h2 className="text-2xl font-bold mb-8 text-gray-900 dark:text-white">Vous pourriez aussi aimer</h2>
            <Suggestions bookId={id} />
          </div>
        </div>
      )}
    </div>
  );
};

export default BookDetails;