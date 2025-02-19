const Navbar = () => {
  return (
    <header className="bg-white shadow w-full">
      <nav className="flex items-center justify-between px-6 py-3 w-full">
        {/* Logo Section */}
        <div className="flex items-center">
          <div className="w-10 h-10 bg-orange-500 rounded-full"></div>
          <span className="ml-2 text-xl font-semibold">MoodSync</span>
        </div>

        {/* Navigation Links */}
        <ul className="hidden md:flex space-x-6 text-gray-700">
          <li className="hover:text-gray-900 cursor-pointer">Home</li>
          <li className="hover:text-gray-900 cursor-pointer">Features</li>
          <li className="relative group">
            <span className="hover:text-gray-900 cursor-pointer">
              Resources
            </span>
            <ul className="absolute hidden group-hover:flex flex-col bg-white shadow-lg rounded mt-2">
              <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">
                Mental Health Articles
              </li>
              <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">
                Guides & Videos
              </li>
              <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">
                Crisis Support
              </li>
            </ul>
          </li>
          <li className="hover:text-gray-900 cursor-pointer">Mood Tracker</li>
          <li className="hover:text-gray-900 cursor-pointer">Anonymous Chat</li>
          <li className="relative group">
            <span className="hover:text-gray-900 cursor-pointer">More</span>
            <ul className="absolute hidden group-hover:flex flex-col bg-white shadow-lg rounded mt-2">
              <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">
                About Us
              </li>
              <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">
                Blog
              </li>
              <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">
                FAQ
              </li>
              <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">
                Contact
              </li>
            </ul>
          </li>
          <li className="hover:text-gray-900 cursor-pointer">
            Plans & Pricing
          </li>
          <li className="hover:text-gray-900 cursor-pointer">Log in</li>
        </ul>

        {/* Call-to-action Button */}
        <button className="px-4 py-2 text-white bg-red-500 rounded-lg hover:bg-blue-600">
          Try for free
        </button>
      </nav>
    </header>
  );
};

export default Navbar;
