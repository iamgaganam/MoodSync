import React from "react";
import { useState } from "react";
import "./App.css";
import MainPage from "./pages/MainPage";

const App: React.FC = () => {
  const [count, setCount] = useState<number>(0);

  return (
    <div>
      <MainPage />
    </div>
  );
};

export default App;
