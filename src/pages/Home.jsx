import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Header, Footer } from '../components/layout';
import './home.scss';

const Home = () => {
  const [articles, setArticles] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [articlesPerPage] = useState(10);
  const [searchQuery, setSearchQuery] = useState('');
  const [category, setCategory] = useState('business');
  const [sortBy, setSortBy] = useState('publishedAt');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [loading, setLoading] = useState(true);
  const location = useLocation();



  const fetchArticles = async () => {
    if (!searchQuery.trim() && !category.trim()) return; 

    setLoading(true);
    let url = '';
    const apiKey = 'c0a423aba69543328776600af0318700'; 

    if (searchQuery.trim()) {
      url = `https://newsapi.org/v2/everything?q=${searchQuery}&sortBy=${sortBy}&from=${fromDate}&to=${toDate}&apiKey=${apiKey}`;
    } else if (category.trim()) {
      url = `https://newsapi.org/v2/top-headlines?category=${category}&sortBy=${sortBy}&apiKey=${apiKey}`;
    } else {
      url = `https://newsapi.org/v2/everything?q=${searchQuery}&sortBy=${sortBy}&from=${fromDate}&to=${toDate}&apiKey=${apiKey}`;
    }

    try {
      const response = await fetch(url);
      const data = await response.json();
      setArticles(data.articles); 
    } catch (error) {
      console.error('Error fetching the articles:', error);
    } finally {
      setLoading(false); 
    }
  };


  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const query = queryParams.get('q') || ''; 
    const sortOption = queryParams.get('sortBy') || 'publishedAt'; 
    const from = queryParams.get('from') || ''; 
    const to = queryParams.get('to') || ''; 

    setSearchQuery(query);
    setSortBy(sortOption);
    setFromDate(from);
    setToDate(to);
    setCurrentPage(1);  
  }, [location.search]);


  useEffect(() => {
    fetchArticles(); 
  }, [searchQuery, category, sortBy, fromDate, toDate]); 

  // Pagination Logic
  const indexOfLastArticle = currentPage * articlesPerPage;
  const indexOfFirstArticle = indexOfLastArticle - articlesPerPage;
  const currentArticles = articles.slice(indexOfFirstArticle, indexOfLastArticle);
  const totalPages = Math.ceil(articles.length / articlesPerPage);

  // Paginate handler
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Handle search form submit
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim() !== '') {
     
      setCurrentPage(1);  // Reset to first page on new search
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <Header />

      <main className="flex-grow container mx-auto p-4">
 
        <form onSubmit={handleSearchSubmit} className="search-form mb-6 flex items-center">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="border p-2 w-full"
            placeholder="Search for news..."
          />

       
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="border p-2 ml-4 rounded-md"
          >
            <option value="business">Business</option>
            <option value="entertainment">Entertainment</option>
            <option value="general">General</option>
            <option value="health">Health</option>
            <option value="science">Science</option>
            <option value="sports">Sports</option>
            <option value="technology">Technology</option>
          </select>

       
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="border p-2 ml-4 rounded-md"
          >
            <option value="publishedAt">Published At</option>
            <option value="relevancy">Relevancy</option>
            <option value="popularity">Popularity</option>
          </select>

        
          <input
            type="date"
            value={fromDate}
            onChange={(e) => setFromDate(e.target.value)}
            className="border p-2 ml-4 rounded-md"
            placeholder="From Date"
          />
          <input
            type="date"
            value={toDate}
            onChange={(e) => setToDate(e.target.value)}
            className="border p-2 ml-4 rounded-md"
            placeholder="To Date"
          />

          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 mt-2 ml-4 rounded-lg"
          >
            Search
          </button>
        </form>

    
        <div className="commonstory three_plus_two_collum mt-12">
          <h2 className="text-3xl font-bold text-center mb-8">Latest News</h2>

          {loading ? (
            <p className="text-center text-gray-600">Loading articles...</p>
          ) : currentArticles.length > 0 ? (
            <div className="custom-grid">
              {currentArticles.map((article, index) => (
                <figure
                  key={index}
                  className={`article-item ${index === 0 ? 'bigstory' : 'smallstory'} bg-white rounded-lg shadow-md`}
                >
                  <a href={article.url} title={article.title} target="_blank" rel="noopener noreferrer">
                    <div className="imgThumb">
                      <img
                        className="w-full h-48 object-cover rounded-t-lg"
                        src={article.urlToImage || 'https://via.placeholder.com/150'}
                        alt={article.title}
                      />
                    </div>
                    <div className="card_title p-4">
                      <h3 className="text-lg font-semibold">{article.title}</h3>
                      <p className="text-sm text-gray-500">{article.author ? `By: ${article.author}` : 'Author: Unknown'}</p>
                      <p className="text-sm text-gray-500">{article.publishedAt ? new Date(article.publishedAt).toLocaleDateString() : 'Published on: Unknown'}</p>
                      <p className="text-sm text-gray-600">{article.description}</p>
                    </div>
                  </a>
                </figure>
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-600">No articles found for "{searchQuery}"</p>
          )}
        </div>

     
        <div className="flex justify-center mt-6">
          <nav aria-label="Page navigation">
            <ul className="pagination flex flex-wrap space-x-2">
              <li>
                <button
                  onClick={() => paginate(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg disabled:opacity-50"
                >
                  Previous
                </button>
              </li>
              {Array.from({ length: totalPages }, (_, index) => (
                <li key={index}>
                  <button
                    onClick={() => paginate(index + 1)}
                    className={`px-4 py-2 rounded-lg ${currentPage === index + 1 ? 'bg-blue-500 text-white' : 'bg-gray-300'}`}
                  >
                    {index + 1}
                  </button>
                </li>
              ))}
              <li>
                <button
                  onClick={() => paginate(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg disabled:opacity-50"
                >
                  Next
                </button>
              </li>
            </ul>
          </nav>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Home;
