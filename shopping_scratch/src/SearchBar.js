// SearchBar.js
import React, { useState } from 'react';

function SearchBar({ onSearchResults }) {
  const [searchTerm, setSearchTerm] = useState('');

  const handleChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleSearch = async () => {
    // Replace this URL with your API endpoint
    const API_URL = 'https://api.example.com/search';
    const response = await fetch(`${API_URL}?query=${searchTerm}`);
    const data = await response.json();
    onSearchResults(data.results);
  };

  return (
    <div className="SearchBar">
      <input
        type="text"
        placeholder="Search recipes..."
        value={searchTerm}
        onChange={handleChange}
      />
      <button onClick={handleSearch}>Search</button>
    </div>
  );
}

export default SearchBar;
