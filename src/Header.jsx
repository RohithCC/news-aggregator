import { Link } from "react-router-dom";

export default function Header() {
  return (
    <nav className="bg-white shadow-md p-4">
      <div className="max-w-6xl mx-auto flex justify-between items-center">
        {/* Logo */}
        <Link to="/" className="text-2xl font-bold text-blue-600">
          MyApp
        </Link>

        {/* Navigation Links */}
        <ul className="hidden md:flex space-x-6">
          <li>
            <Link to="/" className="text-gray-700 hover:text-blue-600 transition">
              Home
            </Link>
          </li>
          <li>
            <Link to="/about" className="text-gray-700 hover:text-blue-600 transition">
              About
            </Link>
          </li>
          <li>
            <Link to="/contact" className="text-gray-700 hover:text-blue-600 transition">
              Contact
            </Link>
          </li>
        </ul>

        {/* Mobile Menu Button (for small screens) */}
        <button className="md:hidden text-gray-700">
          ☰
        </button>
      </div>
    </nav>
  );
}
