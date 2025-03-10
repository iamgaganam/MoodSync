import { Brain } from "lucide-react";
import React, { useState, useRef, useEffect } from "react";

// Navigation links for the main menu
const NAV_LINKS = [
  { label: "Home", href: "#" },
  { label: "Mood Tracker", href: "#" },
  { label: "Mental Health Resources", href: "#" },
  { label: "Therapists Directory", href: "#" },
  { label: "Support Groups", href: "#" },
];

// Dropdown items for the user menu
const DROPDOWN_ITEMS = [
  { label: "Dashboard", href: "#" },
  { label: "Settings", href: "#" },
  { label: "Earnings", href: "#" },
  { label: "Sign out", href: "#" },
];

const Navbar: React.FC = () => {
  // State for dropdown and mobile menu visibility
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Refs for DOM elements
  const userButtonRef = useRef<HTMLButtonElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const mobileMenuRef = useRef<HTMLDivElement>(null);

  // Toggle functions
  const toggleDropdown = () => setIsDropdownOpen((prev) => !prev);
  const toggleMobileMenu = () => setIsMobileMenuOpen((prev) => !prev);

  // Handle clicks outside to close dropdown and mobile menu
  const handleClickOutside = (event: MouseEvent) => {
    const target = event.target as Node;
    if (
      dropdownRef.current &&
      !dropdownRef.current.contains(target) &&
      userButtonRef.current &&
      !userButtonRef.current.contains(target)
    ) {
      setIsDropdownOpen(false);
    }
    if (
      mobileMenuRef.current &&
      !mobileMenuRef.current.contains(target) &&
      !(event.target as HTMLElement).closest(".mobile-menu-toggle")
    ) {
      setIsMobileMenuOpen(false);
    }
  };

  // Close dropdown and mobile menu on scroll
  const handleScroll = () => {
    setIsDropdownOpen(false);
    setIsMobileMenuOpen(false);
  };

  // Simulate login
  const handleLogin = () => setIsLoggedIn(true);

  // Add event listeners for click outside and scroll
  useEffect(() => {
    document.addEventListener("click", handleClickOutside);
    window.addEventListener("scroll", handleScroll);
    return () => {
      document.removeEventListener("click", handleClickOutside);
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  // Common dropdown list content
  const dropdownList = (
    <ul className="py-2" aria-labelledby="user-menu-button">
      {DROPDOWN_ITEMS.map((item) => (
        <li key={item.label}>
          <a
            href={item.href}
            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white"
          >
            {item.label}
          </a>
        </li>
      ))}
    </ul>
  );

  return (
    <nav className="bg-white border-gray-200 dark:bg-gray-900 w-full fixed top-0 left-0 z-50 shadow-md h-16">
      <div className="flex justify-between items-center mx-auto p-4 w-full relative">
        {/* Logo */}
        <a href="" className="flex items-center space-x-1">
          <Brain className="h-8 w-8 text-blue-600" />
          <span className="self-center text-2xl font-semibold whitespace-nowrap dark:text-white">
            MoodSync
          </span>
        </a>

        {/* Desktop Navigation Links */}
        <div className="hidden md:flex flex-1 justify-center items-center">
          <ul className="flex space-x-8 font-medium">
            {NAV_LINKS.map((link) => (
              <li key={link.label}>
                <a
                  href={link.href}
                  className="text-gray-900 hover:text-blue-700 dark:text-white dark:hover:text-blue-500"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Mobile Menu Toggle Button */}
        <button
          type="button"
          className="mobile-menu-toggle md:hidden inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-500 rounded-lg hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
          aria-controls="navbar-user"
          aria-expanded={isMobileMenuOpen}
          onClick={toggleMobileMenu}
        >
          <span className="sr-only">Open main menu</span>
          <svg
            className="w-5 h-5"
            fill="none"
            viewBox="0 0 17 14"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M1 1h15M1 7h15M1 13h15"
            />
          </svg>
        </button>

        {/* Desktop Right Section (Login/Profile) */}
        <div className="hidden md:flex items-center space-x-3">
          {!isLoggedIn ? (
            <button
              type="button"
              onClick={handleLogin}
              className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
            >
              Get started
            </button>
          ) : (
            <>
              <button
                ref={userButtonRef}
                type="button"
                className="flex text-sm bg-gray-800 rounded-full focus:ring-4 focus:ring-gray-300 dark:focus:ring-gray-600"
                aria-expanded={isDropdownOpen}
                onClick={toggleDropdown}
              >
                <span className="sr-only">Open user menu</span>
                <div className="relative">
                  <img
                    className="w-10 h-10 rounded-full ring-2 ring-gray-300 dark:ring-gray-500"
                    src="https://i1.sndcdn.com/artworks-lEAsN83kbdQScsx7-DmxtKw-t500x500.jpg"
                    alt="Bordered avatar"
                  />

                  <span className="top-0 left-7 absolute w-3 h-3 bg-green-400 border-2 border-white dark:border-gray-800 rounded-full" />
                </div>
              </button>
              {/* Desktop Dropdown */}
              {isDropdownOpen && !isMobileMenuOpen && (
                <div
                  ref={dropdownRef}
                  className="z-50 absolute text-sm list-none bg-white divide-y divide-gray-100 rounded-lg shadow-sm dark:bg-gray-700 dark:divide-gray-600"
                  style={{
                    left:
                      userButtonRef.current!.getBoundingClientRect().left -
                      170 +
                      "px",
                    top:
                      userButtonRef.current!.getBoundingClientRect().bottom +
                      5 +
                      "px",
                    width: "200px",
                    maxHeight: "none",
                  }}
                >
                  <div className="px-4 py-2 text-xs text-gray-700 dark:text-gray-300">
                    <span className="block">Gagana Methmal</span>
                    <span className="block text-gray-500 truncate dark:text-gray-400">
                      gaganam220@gmail.com
                    </span>
                  </div>
                  {dropdownList}
                </div>
              )}
            </>
          )}
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div
            ref={mobileMenuRef}
            className="absolute top-16 left-0 w-full md:hidden bg-white dark:bg-gray-900 shadow-md"
          >
            <ul className="flex flex-col font-medium p-4 space-y-2">
              {NAV_LINKS.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="block py-2 text-gray-900 hover:text-blue-700 dark:text-white dark:hover:text-blue-500"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
              <li className="border-t pt-4 dark:border-gray-700">
                {!isLoggedIn ? (
                  <button
                    type="button"
                    onClick={handleLogin}
                    className="w-full text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                  >
                    Get started
                  </button>
                ) : (
                  <div>
                    <button
                      ref={userButtonRef}
                      type="button"
                      className="flex items-center space-x-4 w-full focus:outline-none"
                      onClick={toggleDropdown}
                    >
                      <img
                        className="w-10 h-10 rounded-full"
                        src="https://i1.sndcdn.com/artworks-lEAsN83kbdQScsx7-DmxtKw-t500x500.jpg"
                        alt="user photo"
                      />
                      <div className="text-left">
                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                          Gagana Methmal
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          gaganam220@gmail.com
                        </div>
                      </div>
                      <svg
                        className="ml-auto w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d={
                            isDropdownOpen ? "M5 15l7-7 7 7" : "M19 9l-7 7-7-7"
                          }
                        />
                      </svg>
                    </button>
                    {/* Mobile Dropdown */}
                    {isDropdownOpen && (
                      <div
                        ref={dropdownRef}
                        className="z-50 text-sm list-none bg-white divide-y divide-gray-100 rounded-lg shadow-sm dark:bg-gray-700 dark:divide-gray-600 mt-2"
                        style={{ position: "static", width: "100%" }}
                      >
                        {dropdownList}
                      </div>
                    )}
                  </div>
                )}
              </li>
            </ul>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
