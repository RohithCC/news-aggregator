import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const SearchPopup = ({ toggleSearchModal }) => {
  const [inputQuery, setInputQuery] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault(); 

    if (inputQuery.trim() === '') return; 

    const formData = {
      query: inputQuery,
    };


    navigate('/', { state: { formData } });

    toggleSearchModal(); 
  };

  return (
    <div className="searchPopup">
      <div className="searchPopcenter">
        <div className="container">
          <div id="closeMenus" onClick={toggleSearchModal}>
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
              <path d="M6 18L18 6M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>

          <div className="searchMenu_Header">
            <div className="search_bx">
              <form onSubmit={handleSearch} id="headerSearch" className="search">
                <input
                  type="text"
                  id="searchText2"
                  name="searchText2"
                  placeholder="Search..."
                  className="s_input"
                  value={inputQuery}
                  onChange={(e) => setInputQuery(e.target.value)} 
                />
                <button type="submit" aria-label="search" className="s_button">
                  <i className="search_icon">🔍</i>
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchPopup;
