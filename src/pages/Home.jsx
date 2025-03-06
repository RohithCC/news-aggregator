import React, { useState, useEffect, useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import { Header, Footer } from '../components/layout';
import './home.scss';

const Home = () => {
  const [articles, setArticles] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [articlesPerPage] = useState(10);
  const [searchQuery, setSearchQuery] = useState('trump');
  const [category, setCategory] = useState('business');
  const [sortBy, setSortBy] = useState('publishedAt');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const location = useLocation();

  const apiUrl = useMemo(() => {
    // Build the URL for the proxy route with the necessary parameters
    if (searchQuery.trim()) {
      return `/api/articles?query=${searchQuery}&sortBy=${sortBy}&fromDate=${fromDate}&toDate=${toDate}`;
    }
    return `/api/articles?category=${category}&sortBy=${sortBy}`;
  }, [searchQuery, category, sortBy, fromDate, toDate]);

  const fetchArticles = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(apiUrl);
      if (!response.ok) {
        throw new Error(`Failed to fetch articles: ${response.statusText}`);
      }

      const data = await response.json();
      setArticles(data.articles || []);
    } catch (err) {
      console.error('Error fetching articles:', err);
      setError('Failed to load articles. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Handle URL search params and update state accordingly
  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    setSearchQuery(queryParams.get('q') || 'trump');
    setSortBy(queryParams.get('sortBy') || 'publishedAt');
    setFromDate(queryParams.get('from') || '');
    setToDate(queryParams.get('to') || '');
    setCurrentPage(1);
  }, [location.search]);

  useEffect(() => {
    fetchArticles();
  }, [apiUrl]); // Re-fetch articles when the API URL changes

  const paginatedArticles = useMemo(() => {
    const startIndex = (currentPage - 1) * articlesPerPage;
    return articles.slice(startIndex, startIndex + articlesPerPage);
  }, [articles, currentPage, articlesPerPage]);

  const totalPages = Math.ceil(articles.length / articlesPerPage);

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <Header />

      <main className="flex-grow container mx-auto p-4">
        <form className="search-form mb-6 flex items-center" onSubmit={(e) => e.preventDefault()}>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="border p-2 w-full"
            placeholder="Search for news..."
          />

          <select value={category} onChange={(e) => setCategory(e.target.value)} className="border p-2 ml-4 rounded-md">
            <option value="business">Business</option>
            <option value="entertainment">Entertainment</option>
            <option value="general">General</option>
            <option value="health">Health</option>
            <option value="science">Science</option>
            <option value="sports">Sports</option>
            <option value="technology">Technology</option>
          </select>

          <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="border p-2 ml-4 rounded-md">
            <option value="publishedAt">Published At</option>
            <option value="relevancy">Relevancy</option>
            <option value="popularity">Popularity</option>
          </select>

          <input type="date" value={fromDate} onChange={(e) => setFromDate(e.target.value)} className="border p-2 ml-4 rounded-md" />
          <input type="date" value={toDate} onChange={(e) => setToDate(e.target.value)} className="border p-2 ml-4 rounded-md" />

          <button 
            type="submit" 
            className="bg-blue-500 text-white px-4 py-2 mt-2 ml-4 rounded-lg"
            onClick={fetchArticles}
          >
            Search
          </button>
        </form>

        <div className="commonstory three_plus_two_collum mt-12">
          <h2 className="text-3xl font-bold text-center mb-8">Latest News</h2>

          {loading ? (
            <p className="text-center text-gray-600">Loading articles...</p>
          ) : error ? (
            <p className="text-center text-red-600">{error}</p>
          ) : paginatedArticles.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {paginatedArticles.map((article, index) => (
                <figure key={index} className="article-item bg-white rounded-lg shadow-md overflow-hidden">
                  <a href={article.url} title={article.title} target="_blank" rel="noopener noreferrer">
                    <div className="imgThumb">
                      <img 
                        className="w-full h-48 object-cover" 
                        src={article.urlToImage || 'https://via.placeholder.com/150'} 
                        alt={article.title} 
                      />
                    </div>
                    <div className="p-4">
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
            <p className="text-center text-gray-600">No articles found.</p>
          )}
        </div>

        {/* Pagination */}
        <div className="flex justify-center mt-6">
          <nav aria-label="Page navigation">
            <ul className="pagination flex flex-wrap space-x-2">
              <li>
                <button
                  onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg disabled:opacity-50"
                >
                  Previous
                </button>
              </li>
              {Array.from({ length: totalPages }, (_, index) => (
                <li key={index}>
                  <button
                    onClick={() => setCurrentPage(index + 1)}
                    className={`px-4 py-2 rounded-lg ${currentPage === index + 1 ? 'bg-blue-500 text-white' : 'bg-gray-300'}`}
                  >
                    {index + 1}
                  </button>
                </li>
              ))}
              <li>
                <button
                  onClick={() => setCurrentPage((prev) => (prev < totalPages ? prev + 1 : prev))}
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
