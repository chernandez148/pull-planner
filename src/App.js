// src/App.js
import React from "react";
import MasterPlanner from "./components/MasterPlanner/MasterPlanner";
import taskData from "./helperData/taskData";
import "./App.css";

function App() {
  return (
    <div className="App">
      <main>
        <MasterPlanner taskData={taskData} />
      </main>
    </div>
  );
}

export default App;
