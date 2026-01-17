import React, { useContext, useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { useAppContext } from "../../context/AppContext";
import CitySelectorModal from "./CitySelectorModal";
import { IoIosArrowDown } from "react-icons/io";

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const { selectedCity } = useAppContext();
  const [isOpen, setIsOpen] = useState(false);
  const [showCityModal, setShowCityModal] = useState(false);
  const navigate = useNavigate();
  const navbarRef = useRef(null);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (navbarRef.current && !navbarRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/login");
    setIsOpen(false); // Close menu after logout
  };

  const handleCityModalOpen = () => {
    setShowCityModal(true);
    setIsOpen(false); // Close mobile menu when opening city modal
  };

  // Close mobile menu when navigating
  const handleNavigation = () => {
    setIsOpen(false);
  };

  return (
    <nav
      className="bg-gray-900 text-white px-6 py-4 shadow-md sticky top-0 z-50"
      ref={navbarRef}
    >
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <Link
          to="/"
          className="text-2xl font-bold text-white border-2 border-gray-600 p-1 rounded-xl"
          onClick={handleNavigation}
        >
          Eventzo
        </Link>

        {/* Mobile menu toggle */}
        <div className="lg:hidden">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="text-white focus:outline-none"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
        </div>

        {/* Main navigation items */}
        <ul className="hidden lg:flex gap-6 items-center">
          {/* City Selector Button */}
          <li>
            <button
              onClick={handleCityModalOpen}
              className="text-white px-4 py-2 rounded  flex items-center gap-2"
            >
              {selectedCity || "Select City"} <IoIosArrowDown />
            </button>
          </li>
          <li>
            <Link to="/events" className="hover:text-yellow-400">
              Events
            </Link>
          </li>
          {!user ? (
            <>
              <li>
                <Link to="/login" className="hover:text-yellow-400">
                  Login
                </Link>
              </li>
              <li>
                <Link to="/register" className="hover:text-yellow-400">
                  Register
                </Link>
              </li>
            </>
          ) : (
            <>
              <li>
                <Link to="/my-bookings" className="hover:text-yellow-400">
                  My Bookings
                </Link>
              </li>
              {user.role === "admin" && (
                <li>
                  <Link to="/admin" className="hover:text-yellow-400">
                    Admin
                  </Link>
                </li>
              )}
              <li>
                <button
                  onClick={handleLogout}
                  className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded"
                >
                  Logout
                </button>
              </li>
            </>
          )}
        </ul>
      </div>

      {/* Mobile menu items */}
      {isOpen && (
        <ul className="lg:hidden mt-4 space-y-2 text-center">
          <li>
            <Link
              to="/events"
              className="block hover:text-yellow-400"
              onClick={handleNavigation}
            >
              Events
            </Link>
          </li>
          {!user ? (
            <>
              <li>
                <Link
                  to="/login"
                  className="block hover:text-yellow-400"
                  onClick={handleNavigation}
                >
                  Login
                </Link>
              </li>
              <li>
                <Link
                  to="/register"
                  className="block hover:text-yellow-400"
                  onClick={handleNavigation}
                >
                  Register
                </Link>
              </li>
            </>
          ) : (
            <>
              <li>
                <Link
                  to="/my-bookings"
                  className="block hover:text-yellow-400"
                  onClick={handleNavigation}
                >
                  My Bookings
                </Link>
              </li>
              {user.role === "admin" && (
                <li>
                  <Link
                    to="/admin"
                    className="block hover:text-yellow-400"
                    onClick={handleNavigation}
                  >
                    Admin
                  </Link>
                </li>
              )}
              <li>
                <button
                  onClick={handleLogout}
                  className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded w-full"
                >
                  Logout
                </button>
              </li>
            </>
          )}

          {/* City Selector Button for Mobile */}
          <li className="flex justify-center">
            <button
              onClick={handleCityModalOpen}
              className="text-white px-4 py-2 rounded flex items-center  gap-2"
            >
              {selectedCity || "Select City"} <IoIosArrowDown />
            </button>
          </li>
        </ul>
      )}

      {/* City Selector Modal */}
      {showCityModal && (
        <CitySelectorModal
          onClose={() => {
            setShowCityModal(false);
            setIsOpen(false); // Also close mobile menu when city modal closes
          }}
        />
      )}
    </nav>
  );
};

export default Navbar;
