import React from "react";

const Quotes = () => {
  const quotes = [
    "You are stronger than you think.",
    "Every day is a new opportunity.",
    "Believe in yourself!",
    "Take it one step at a time.",
    "It's okay to not be okay.",
    "You are enough just as you are.",
    "Keep pushing, you'll get there.",
  ];

  // Random quote generator
  const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-200 to-indigo-300 flex justify-center items-center p-6">
      <div className="bg-white p-8 rounded-xl shadow-lg max-w-lg w-full text-center">
        <h2 className="text-4xl font-semibold text-indigo-700 mb-6">
          Motivational Quotes
        </h2>
        <div className="italic text-lg text-gray-700 mb-6">
          <p>{randomQuote}</p>
        </div>
        <button
          onClick={() => window.location.reload()}
          className="bg-indigo-600 text-white py-2 px-6 rounded-full hover:bg-indigo-700 transition duration-300 mt-4"
        >
          Get Another Quote
        </button>
      </div>
    </div>
  );
};

export default Quotes;
