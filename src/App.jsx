import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./Header"; // Import Header component
import SimpleForm from "./SimpleForm"; // Import the form component

function App() {
  return (
    <Router>
      <Header />
      <div className="p-6">
        <Routes>
          <Route path="/" element={<h1 className="text-center text-3xl font-bold">Home Page</h1>} />
          <Route path="/about" element={<h1 className="text-center text-3xl font-bold">About Us</h1>} />
          <Route path="/contact" element={<SimpleForm />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
