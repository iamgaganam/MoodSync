import React from "react";
import "./App.css";
import Chatbot from "../../moodsync/src/pages/Chatbot.tsx";

const App: React.FC = () => {
  return (
    <div className="App">
      <header className="App-header">
        <h1>Mental Health Chatbot</h1>
      </header>
      <Chatbot />
    </div>
  );
};

export default App;
