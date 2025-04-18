import React, { useState } from "react";
import "./App.css";
import ChatWindow from "./components/ChatWindow.tsx";

function App() {

  return (
    <div className="App">
      <div className="heading">
        Instalily Case Study
      </div>
        <ChatWindow/>
    </div>
  );
}

export default App;
