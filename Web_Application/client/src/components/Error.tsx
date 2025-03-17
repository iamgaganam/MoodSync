import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const NotFound: React.FC = () => {
  const [quote, setQuote] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Array of supportive mental health quotes
  const quotes = [
    "Sometimes the wrong path can lead to the right destination.",
    "It's okay to feel lost sometimes. That's how we find new directions.",
    "Every detour is an opportunity for a new discovery.",
    "Getting lost is just another way of saying 'going exploring'.",
    "The path isn't always clear, but that doesn't mean you're not moving forward.",
    "Sometimes we need to get lost to find ourselves.",
    "Not all who wander are lost, but right now, this page is.",
    "Taking a wrong turn sometimes leads to the most beautiful views.",
  ];

  useEffect(() => {
    const timer = setTimeout(() => {
      const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
      setQuote(randomQuote);
      setIsLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 relative overflow-hidden bg-gradient-to-br from-blue-50 via-blue-100 to-blue-200">
      {/* Decorative elements */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob"></div>
        <div className="absolute top-1/3 right-1/4 w-72 h-72 bg-blue-400 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-1/4 left-1/3 w-80 h-80 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-4000"></div>
      </div>

      {/* Main content */}
      <div className="z-10 max-w-3xl w-full text-center">
        <div className="mb-8">
          <div className="inline-flex items-center justify-center relative">
            <svg
              className="w-32 h-32 text-blue-600"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z"
                stroke="currentColor"
                strokeWidth="2"
              />
              <path
                d="M16.2426 7.75736L7.75732 16.2426"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
              <path
                d="M9.87866 9.87868L7.75732 7.75735"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
              <path
                d="M16.2426 16.2426L14.1213 14.1213"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
              <circle cx="15.5355" cy="8.46447" r="1.5" fill="currentColor" />
              <circle cx="8.46447" cy="15.5355" r="1.5" fill="currentColor" />
            </svg>
            <div className="absolute top-0 right-0 p-2 bg-blue-600 rounded-full shadow-lg">
              <svg
                className="w-6 h-6 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                ></path>
              </svg>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <h1 className="text-7xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-blue-700">
            404
          </h1>

          <h2 className="text-3xl font-bold text-gray-800">Page Not Found</h2>

          <div className="h-24 flex items-center justify-center">
            {isLoading ? (
              <div className="flex space-x-2 justify-center items-center">
                <div className="h-2 w-2 bg-blue-600 rounded-full animate-bounce"></div>
                <div className="h-2 w-2 bg-blue-600 rounded-full animate-bounce animation-delay-200"></div>
                <div className="h-2 w-2 bg-blue-600 rounded-full animate-bounce animation-delay-400"></div>
              </div>
            ) : (
              <p className="text-xl text-gray-600 italic px-4 font-light">
                "{quote}"
              </p>
            )}
          </div>

          <p className="text-gray-600 text-lg max-w-lg mx-auto">
            The page you're looking for has drifted away into the digital ether.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/"
              className="group px-8 py-3 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 hover:shadow-xl transition-all duration-300 flex items-center justify-center"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 mr-2 group-hover:scale-110 transition-transform duration-300"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
              </svg>
              <span className="font-medium">Go Home</span>
            </Link>

            <button
              onClick={() => window.history.back()}
              className="group px-8 py-3 bg-white text-blue-600 border border-blue-200 rounded-full shadow-lg hover:shadow-xl hover:bg-blue-50 transition-all duration-300 flex items-center justify-center"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 mr-2 group-hover:scale-110 transition-transform duration-300"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z"
                  clipRule="evenodd"
                />
              </svg>
              <span className="font-medium">Go Back</span>
            </button>
          </div>
        </div>

        <div className="mt-12 text-gray-500">
          <p>
            Need support?{" "}
            <Link
              to="/contact"
              className="text-blue-600 hover:text-blue-800 font-medium hover:underline transition-colors"
            >
              Contact our team
            </Link>
          </p>
        </div>
      </div>

      {/* CSS animations */}
      <style>{`
        .animate-blob {
          animation: blob 7s infinite alternate;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
        .animation-delay-200 {
          animation-delay: 0.2s;
        }
        .animation-delay-400 {
          animation-delay: 0.4s;
        }
        @keyframes blob {
          0% {
            transform: translate(0px, 0px) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
          100% {
            transform: translate(0px, 0px) scale(1);
          }
        }
      `}</style>
    </div>
  );
};

export default NotFound;
