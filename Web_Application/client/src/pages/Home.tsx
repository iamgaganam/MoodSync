import React from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const HomePage: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Navbar */}
      <div className="fixed top-0 left-0 right-0 z-50">
        <Navbar />
      </div>

      {/* Main Content */}
      <main className="pt-20 p-4 flex-grow">
        <h1 className="text-4xl font-bold">Welcome to the Homepage</h1>
        <p className="mt-2 text-lg">
          This is the main content of your homepage.
        </p>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default HomePage;
