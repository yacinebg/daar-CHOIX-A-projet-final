import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./components/Home";
import Results from "./components/Results";
import BookDetails from "./components/BookDetails";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/results" element={<Results />} />
        <Route path="/search_regex" element={<Results />} />
        <Route path="/search_by_centrality" element={<Results />} />
        <Route path="/book/:id" element={<BookDetails />} />
      </Routes>
    </Router>
  );
};

export default App;
