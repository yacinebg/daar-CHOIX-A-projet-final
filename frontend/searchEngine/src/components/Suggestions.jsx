import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Suggestions = ({ bookId }) => {
  const [suggestions, setSuggestions] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSuggestions = async () => {
      try {
        const response = await axios.get(`http://127.0.0.1:8000/suggestions/${bookId}/`);
        console.log(response.data.suggestions);
        setSuggestions(response.data.suggestions);
      } catch (error) {
        console.error('Erreur lors de la récupération des suggestions :', error);
      }
    };

    if (bookId) fetchSuggestions();
  }, [bookId]);

  return (
    <div className="mt-8">
      <h2 className="text-xl font-semibold text-gray-100 mb-4">Livres similaires :</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {suggestions.map((book) => (
          <div
            key={book.id}
            onClick={() => navigate(`/book/${book.id}`)}
            className="cursor-pointer bg-gray-700/30 rounded-lg p-3 border border-gray-700 hover:border-indigo-500 transition"
          >
            <img
              src={book.cover_url}
              alt={`Couverture de ${book.title}`}
              className="w-full h-40 object-cover mb-3 rounded"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = "/placeholder-book.jpg";
              }}
            />
            <p className="text-gray-200 font-medium text-sm line-clamp-2">{book.title}</p>
            <p className="text-gray-400 text-xs italic">{book.author}</p>
            <p className="text-indigo-400 text-xs mt-1">Score: {book.score.toFixed(2)}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Suggestions;