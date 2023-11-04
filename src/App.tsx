// IMPORT REACT
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// IMPORT COMPONENTS
// import LoginForm from './components/LoginForm.tsx';

// IMPORT OTHERS
import './App.css';
import axios from "axios";

function App() {
  const [test, setTest] = useState<string>("abc");

  async function testFunction() {
    const fetchData = await axios.get("http://localhost:8080/");
    setTest(fetchData.data);
  }


  useEffect(() => {
    testFunction();
  }, []);


  return (
    <Router>
      <Routes>
        <Route path="/" element= {<LoginForm />} />
      </Routes>
    </Router>
  )
}

export default App
