import React, { useState } from "react";

const Footer: React.FC = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      console.log("Subscribed email:", email);
      setMessage("Thank you for subscribing!");
      setEmail("");
    } catch (error) {
      setMessage("Subscription failed. Please try again.");
    }
  };

  return (
    <footer className="bg-white dark:bg-gray-900">
      <div className="mx-auto w-full max-w-screen-xl p-4 py-6 lg:py-8">
        <div className="md:flex md:justify-between">
          {/* Logo and Brand Name with Email Subscription */}
          <div className="mb-6 md:mb-0 md:w-1/3">
            <a href="https://flowbite.com/" className="flex items-center">
              <img
                src="https://flowbite.com/docs/images/logo.svg"
                className="h-8 me-3"
                alt="FlowBite Logo"
              />
              <span className="self-center text-2xl font-semibold whitespace-nowrap dark:text-white">
                MoodSync
              </span>
            </a>
            {/* Email Subscription Form */}
            <div className="mt-8">
              <h2 className="mb-2 text-sm font-semibold text-gray-900 uppercase dark:text-white">
                Subscribe to our newsletter
              </h2>
              <form onSubmit={handleSubmit} className="flex flex-col">
                <input
                  type="email"
                  className="w-3/4 px-3 py-2 mb-2 text-gray-700 bg-gray-100 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                  placeholder="Your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                <button
                  type="submit"
                  className="w-1/3 px-3 py-2 text-sm text-white bg-red-500 rounded hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  Subscribe
                </button>
              </form>
              {message && (
                <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                  {message}
                </p>
              )}
            </div>
          </div>
          {/* Footer Links Organized by Topics */}
          <div className="grid grid-cols-2 gap-8 sm:gap-6 sm:grid-cols-5 md:grid-cols-5 lg:grid-cols-6">
            {/* Resources */}
            <div>
              <h2 className="mb-6 text-sm font-semibold text-gray-900 uppercase dark:text-white">
                Resources
              </h2>
              <ul className="text-gray-500 dark:text-gray-400 font-medium">
                <li className="mb-4">
                  <a href="/blog" className="hover:underline">
                    Mental Health Blog
                  </a>
                </li>
                <li className="mb-4">
                  <a href="/guides" className="hover:underline">
                    Wellness Guides
                  </a>
                </li>
                <li>
                  <a href="/self-care" className="hover:underline">
                    Self-Care Tips
                  </a>
                </li>
              </ul>
            </div>
            {/* Follow Us */}
            <div>
              <h2 className="mb-6 text-sm font-semibold text-gray-900 uppercase dark:text-white">
                Follow Us
              </h2>
              <ul className="text-gray-500 dark:text-gray-400 font-medium">
                <li className="mb-4">
                  <a href="https://github.com" className="hover:underline">
                    GitHub
                  </a>
                </li>
                <li className="mb-4">
                  <a href="https://linkedin.com" className="hover:underline">
                    LinkedIn
                  </a>
                </li>
                <li>
                  <a href="https://twitter.com" className="hover:underline">
                    Twitter
                  </a>
                </li>
              </ul>
            </div>
            {/* Support */}
            <div>
              <h2 className="mb-6 text-sm font-semibold text-gray-900 uppercase dark:text-white">
                Support
              </h2>
              <ul className="text-gray-500 dark:text-gray-400 font-medium">
                <li className="mb-4">
                  <a href="/faq" className="hover:underline">
                    Help Center
                  </a>
                </li>
                <li className="mb-4">
                  <a href="/contact" className="hover:underline">
                    Contact Us
                  </a>
                </li>
                <li>
                  <a href="/forum" className="hover:underline">
                    Community Forum
                  </a>
                </li>
              </ul>
            </div>
            {/* About Us */}
            <div>
              <h2 className="mb-6 text-sm font-semibold text-gray-900 uppercase dark:text-white">
                About Us
              </h2>
              <ul className="text-gray-500 dark:text-gray-400 font-medium">
                <li className="mb-4">
                  <a href="/mission" className="hover:underline">
                    Our Mission
                  </a>
                </li>
                <li className="mb-4">
                  <a href="/team" className="hover:underline">
                    Meet the Team
                  </a>
                </li>
                <li>
                  <a href="/partners" className="hover:underline">
                    Partnerships
                  </a>
                </li>
              </ul>
            </div>
            {/* Emergency Contact */}
            <div>
              <h2 className="mb-6 text-sm font-semibold text-gray-900 uppercase dark:text-white">
                Emergency
              </h2>
              <ul className="text-gray-500 dark:text-gray-400 font-medium">
                <li className="mb-4">
                  <a href="/hotlines" className="hover:underline">
                    24/7 Hotlines
                  </a>
                </li>
                <li className="mb-4">
                  <a href="/crisis" className="hover:underline">
                    Crisis Resources
                  </a>
                </li>
                <li>
                  <a href="/local" className="hover:underline">
                    Local Services
                  </a>
                </li>
              </ul>
            </div>
            {/* Tools */}
            <div>
              <h2 className="mb-6 text-sm font-semibold text-gray-900 uppercase dark:text-white">
                Tools
              </h2>
              <ul className="text-gray-500 dark:text-gray-400 font-medium">
                <li className="mb-4">
                  <a href="/mood-tracker" className="hover:underline">
                    Mood Tracker
                  </a>
                </li>
                <li className="mb-4">
                  <a href="/journal" className="hover:underline">
                    Digital Journal
                  </a>
                </li>
                <li>
                  <a href="/meditation" className="hover:underline">
                    Meditation Guide
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <hr className="my-6 border-gray-200 sm:mx-auto dark:border-gray-700 lg:my-8" />
        <div className="sm:flex sm:items-center sm:justify-between">
          <span className="text-sm text-gray-500 sm:text-center dark:text-gray-400">
            © 2025 MoodSync by GM. All Rights Reserved.
          </span>
          <div className="flex mt-4 sm:justify-center sm:mt-0">
            <a
              href="#"
              className="text-gray-500 hover:text-gray-900 dark:hover:text-white"
            >
              <svg
                className="w-4 h-4"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="currentColor"
                viewBox="0 0 8 19"
              >
                <path
                  fillRule="evenodd"
                  d="M6.135 3H8V0H6.135a4.147 4.147 0 0 0-4.142 4.142V6H0v3h2v9.938h3V9h2.021l.592-3H5V3.591A.6.6 0 0 1 5.592 3h.543Z"
                  clipRule="evenodd"
                />
              </svg>
              <span className="sr-only">Facebook page</span>
            </a>
            <a
              href="#"
              className="text-gray-500 hover:text-gray-900 dark:hover:text-white ms-5"
            >
              <svg
                className="w-4 h-4"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="currentColor"
                viewBox="0 0 21 16"
              >
                <path d="M16.942 1.556a16.3 16.3 0 0 0-4.126-1.3 ..." />
              </svg>
              <span className="sr-only">Twitter</span>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
