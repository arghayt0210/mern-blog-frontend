import { Link } from "react-router-dom";

export default function PublicNavbar() {
  return (
    <nav className="bg-gradient-to-r from-white to-gray-50 shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 py-8 flex justify-between items-center">
        {/* Logo Section */}
        <Link
          to="/"
          className="text-2xl font-bold text-gray-800 tracking-wider hover:text-blue-600 transition-colors duration-300"
        >
          MERNBLOG
        </Link>

        {/* Main Navigation */}
        <ul className="flex items-center space-x-8">
          <li>
            <Link
              to="/"
              className="text-gray-600 hover:text-blue-600 font-medium transition-all duration-300 hover:scale-105"
            >
              Home
            </Link>
          </li>
          <li>
            <Link
              to="/posts"
              className="text-gray-600 hover:text-blue-600 font-medium transition-all duration-300 hover:scale-105"
            >
              Latest Posts
            </Link>
          </li>
          <li>
            <Link
              to="/creators-ranking"
              className="text-gray-600 hover:text-blue-600 font-medium transition-all duration-300 hover:scale-105"
            >
              Creators Ranking
            </Link>
          </li>
          <li>
            <Link
              to="/pricing"
              className="text-gray-600 hover:text-blue-600 font-medium transition-all duration-300 hover:scale-105"
            >
              Pricing
            </Link>
          </li>
          <li>
            <Link
              to="/create-account"
              className="text-gray-600 hover:text-blue-600 font-medium transition-all duration-300 hover:scale-105"
            >
              Create Account
            </Link>
          </li>
        </ul>

        {/* Create Post Button */}
        <Link
          to="/login"
          className="bg-blue-600 text-white px-6 py-2 rounded-full font-medium hover:bg-blue-700 transition-colors duration-300 shadow-md hover:shadow-lg"
        >
          Create Post
        </Link>
      </div>
    </nav>
  );
}
