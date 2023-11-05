import React, { useEffect, useState, useContext } from 'react';
import { auth } from "../firebase";
import { onAuthStateChanged } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { MyContext } from '../MyContext';
import axios, { AxiosResponse } from 'axios';

export default function CheckAuth() {
  const navigate = useNavigate();
  const { userId, userEmail, userFirstName, userLastName, setUserId, setUserEmail, setUserFirstName, setUserLastName } = useContext(MyContext);

  function test() {
    console.log(userId, userEmail, userFirstName, userLastName);
  }
  // function test2() {
  //   setUserId(2);
  //   setUserEmail("UpdateEmail");
  // }

  useEffect(() => {
    // Check if user is log-ed in. If not, return to sign in. If yes, assign context variable
    const listen = onAuthStateChanged(auth, async (user: any) => {
      console.log(user);
      if (user) {
        // Retrieve user data from backend database
        const url: string = `http://localhost:8080/user/${user.email}`;
        // const url: string = `https://personal-finance-app-server.onrender.com/user/${user.email}`;
        const userData: AxiosResponse<any, any> = await axios.get(url);
        console.log(userData);

        // Assign to global variables
        setUserId(userData.data.id);
        setUserEmail(userData.data.email);
        setUserFirstName(userData.data.firstName);
        setUserLastName(userData.data.lastName);
      } else {
        // Redirect to sign in if there is no log in
        navigate("/SignIn");
      }
    });

    return () => {
      listen();
    }
      // this unmount the listen function so that it does not have to be run twice
  }, []);


  return (
    <>
      <button onClick={test}>test</button>
      {/* <button onClick={test2}>test2</button>  */}
    </>
  )
}