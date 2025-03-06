import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import './header.scss';

const Header = ({ onSearch, onSourceChange, onCountryChange, onCategoryChange, onLanguageChange }) => {
  const [category, setCategory] = useState('all');
  const [language, setLanguage] = useState('all');
  const [country, setCountry] = useState('us');
  const [sources, setSources] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Memoize the API URL based on dependencies (country, category, language)
  const apiUrl = useMemo(() => {
    let url = `/api/sources?country=${country}`;

    if (category !== 'all') {
      url += `&category=${category}`;
    }

    if (language !== 'all') {
      url += `&language=${language}`;
    }

    return url;
  }, [country, category, language]);

  // Fetch sources based on the generated URL
  const fetchSources = async () => {
    setLoading(true);
    setError(null); // Reset previous errors

    try {
      const response = await axios.get(apiUrl);

      // Check if the response is valid and contains the expected data
      if (response.data && Array.isArray(response.data.sources)) {
        setSources(response.data.sources);
      } else {
        throw new Error('Invalid data format');
      }
    } catch (error) {
      setError("Error fetching sources. Please try again.");
      console.error("Error fetching sources:", error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch sources whenever the URL changes (country, category, language)
  useEffect(() => {
    fetchSources();
  }, [apiUrl]);

  // Handle category change
  const handleCategoryChange = (event) => {
    const selectedCategory = event.target.value;
    setCategory(selectedCategory);
    onCategoryChange(selectedCategory);
  };

  // Handle language change
  const handleLanguageChange = (event) => {
    const selectedLanguage = event.target.value;
    setLanguage(selectedLanguage);
    onLanguageChange(selectedLanguage);
  };

  // Handle country change
  const handleCountryChange = (event) => {
    const selectedCountry = event.target.value;
    setCountry(selectedCountry);
    onCountryChange(selectedCountry);
  };

  return (
    <header className="header">
      <div className="header-container">
        <div className="logo">
          <h1>News App</h1>
        </div>

        {/* Country Dropdown */}
        <div className="dropdown">
          <label htmlFor="country-select">Country</label>
          <select
            id="country-select"
            value={country}
            onChange={handleCountryChange}
            aria-label="Select Country"
          >
            <option value="us">United States</option>
            <option value="gb">United Kingdom</option>
            <option value="de">Germany</option>
            <option value="fr">France</option>
            <option value="in">India</option>
            <option value="au">Australia</option>
            <option value="ca">Canada</option>
          </select>
        </div>

        {/* Source Dropdown */}
        <div className="dropdown">
          <label htmlFor="source-select">Source</label>
          {loading ? (
            <select id="source-select" disabled>
              <option value="none">Loading...</option>
            </select>
          ) : error ? (
            <select id="source-select" disabled>
              <option value="none">{error}</option>
            </select>
          ) : sources.length > 0 ? (
            <select id="source-select" onChange={(e) => onSourceChange(e.target.value)}>
              {sources.map((source) => (
                <option key={source.id} value={source.id}>
                  {source.name}
                </option>
              ))}
            </select>
          ) : (
            <select id="source-select" disabled>
              <option value="none">No sources available</option>
            </select>
          )}
        </div>

        {/* Language Dropdown */}
        <div className="dropdown">
          <label htmlFor="language-select">Language</label>
          <select
            id="language-select"
            value={language}
            onChange={handleLanguageChange}
            aria-label="Select Language"
          >
            <option value="all">Languages</option>
            <option value="ar">Arabic</option>
            <option value="de">German</option>
            <option value="en">English</option>
            <option value="es">Spanish</option>
            <option value="fr">French</option>
            <option value="it">Italian</option>
            <option value="nl">Dutch</option>
            <option value="pt">Portuguese</option>
            <option value="ru">Russian</option>
            <option value="zh">Chinese</option>
          </select>
        </div>

        {/* Category Dropdown */}
        <div className="dropdown">
          <label htmlFor="category-select">Category</label>
          <select
            id="category-select"
            value={category}
            onChange={handleCategoryChange}
            aria-label="Select Category"
          >
            <option value="all">Categories</option>
            <option value="business">Business</option>
            <option value="entertainment">Entertainment</option>
            <option value="general">General</option>
            <option value="health">Health</option>
            <option value="science">Science</option>
            <option value="sports">Sports</option>
            <option value="technology">Technology</option>
          </select>
        </div>

      </div>
    </header>
  );
};

export default Header;
