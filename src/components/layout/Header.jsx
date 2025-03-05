import React, { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import "./header.scss";

const Header = ({ onSearch, onSourceChange, onCountryChange, onCategoryChange, onLanguageChange }) => {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("all");
  const [language, setLanguage] = useState("all");
  const [country, setCountry] = useState("us");
  const [sources, setSources] = useState([]);
  const [menuOpen, setMenuOpen] = useState(false);

  const API_KEY = "c0a423aba69543328776600af0318700";

  const fetchSources = useCallback(async (country) => {
    try {
      const response = await axios.get(
        `https://newsapi.org/v2/top-headlines/sources?country=${country}&apiKey=${API_KEY}`
      );
      setSources(response.data.sources || []);
    } catch (error) {
      console.error("Error fetching sources:", error);
    }
  }, []);

  useEffect(() => {
    fetchSources(country);
  }, [country, fetchSources]);

  const fetchWithFilter = async (filterType, filterValue) => {
    try {
      let url = `https://newsapi.org/v2/top-headlines/sources?country=${country}&apiKey=${API_KEY}`;

      if (filterType === "category" && filterValue !== "all") {
        url += `&category=${filterValue}`;
      } else if (filterType === "language" && filterValue !== "all") {
        url += `&language=${filterValue}`;
      }

      const response = await axios.get(url);
      setSources(response.data.sources || []);
    } catch (error) {
      console.error("Error fetching filtered sources:", error);
    }
  };

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const handleSearch = (event) => {
    if (event.key === "Enter" && query.length > 0) {
      onSearch(query);
    }
  };

  const handleCategoryChange = (event) => {
    const selectedCategory = event.target.value;
    setCategory(selectedCategory);
    onCategoryChange(selectedCategory);
    fetchWithFilter("category", selectedCategory);
  };

  const handleLanguageChange = (event) => {
    const selectedLanguage = event.target.value;
    setLanguage(selectedLanguage);
    onLanguageChange(selectedLanguage);
    fetchWithFilter("language", selectedLanguage);
  };

  const handleCountryChange = (event) => {
    const selectedCountry = event.target.value;
    setCountry(selectedCountry);
    onCountryChange(selectedCountry);
  };

  const handleSourceChange = (event) => {
    const selectedSource = event.target.value;
    onSourceChange(selectedSource);
  };

  return (
    <header className="header">
      <div className="header-container">
        <Link to="/" className="logo">
          <img
            src="https://static.tv9kannada.com/wp-content/themes/tv9kannada/images/tv9-kannada-logo.svg?w=50"
            alt="Home Icon"
            className="logo-img"
          />
          <span className="logo-text">Tv9</span>
        </Link>

        <div className="hamburger-icon" onClick={toggleMenu}>
          <span className={`hamburger-icon-bar ${menuOpen ? "active" : ""}`}>☰</span>
        </div>

        <nav className={`nav ${menuOpen ? "show" : ""}`}>
          <ul className="nav-list">
            <li className="nav-item dropdown">
              Country
              <div className="dropdown-content">
                <select value={country} onChange={handleCountryChange}>
                  <option value="us">United States</option>
                  <option value="gb">United Kingdom</option>
                  <option value="de">Germany</option>
                  <option value="fr">France</option>
                  <option value="in">India</option>
                  <option value="au">Australia</option>
                  <option value="ca">Canada</option>
                </select>
              </div>
            </li>

            <li className="nav-item dropdown">
              Source
              <div className="dropdown-content">
                <select onChange={handleSourceChange}>
                  {sources.length > 0 ? (
                    sources.map((source) => (
                      <option key={source.id} value={source.id}>
                        {source.name}
                      </option>
                    ))
                  ) : (
                    <option value="none">No sources available</option>
                  )}
                </select>
              </div>
            </li>

            <li className="nav-item dropdown">
              Language
              <div className="dropdown-content">
                <select value={language} onChange={handleLanguageChange}>
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
            </li>

            <li className="nav-item dropdown">
              Category
              <div className="dropdown-content">
                <select value={category} onChange={handleCategoryChange}>
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
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;

