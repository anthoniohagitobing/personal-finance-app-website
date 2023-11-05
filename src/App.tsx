// IMPORT REACT
import React, { useState, useEffect, createContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";


// IMPORT COMPONENTS
import SignIn from './components/SignIn';
import SignUp from './components/SignUp';
import Home from "./components/Home";
import { MyContext } from "./MyContext";

// IMPORT OTHERS
import './App.css';
import axios from "axios";




function App(): JSX.Element {
  // const [test, setTest] = useState<string>("abc");
  // async function testFunction() {
  //   const fetchData = await axios.get("http://localhost:8080/");
  //   setTest(fetchData.data);
  //   console.log(fetchData);
  // }
  // useEffect(() => {
  //   testFunction();
  //   console.log(test);
  // }, []);

  

  const [userId, setUserId] = useState<number>(1);
  const [userEmail, setUserEmail] = useState<string>("testEmail");
  const [userFirstName, setUserFirstName] = useState<string>("testFirstName");
  const [userLastName, setUserLastName] = useState<string>("testLastName");

  return (
    <>
      <MyContext.Provider value={{userId, userEmail, userFirstName, userLastName, setUserId, setUserEmail, setUserFirstName, setUserLastName}}>
        <Router>
          <Routes>
            <Route path="/SignIn" element= {<SignIn />} />
            <Route path="/SignUp" element= {<SignUp />} />
            <Route path="/Home" element= {<Home />} />
            <Route path="*" element={<Navigate to="/SignIn" />} />
          </Routes>
        </Router>
      </MyContext.Provider>
    </>
  )
}

export default App
