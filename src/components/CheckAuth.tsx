import { useEffect, useContext } from 'react';
import { auth } from "../firebase";
import { onAuthStateChanged } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { MyContext } from '../MyContext';
import axios from 'axios';

export default function CheckAuth() {
  const navigate = useNavigate();
  const { setUserId, setUserEmail, setUserFirstName, setUserLastName } = useContext(MyContext);

  // function checkCurrentUser() {
  //   console.log(userId, userEmail, userFirstName, userLastName);
  // }

  useEffect(() => {
    // Check if user is log-ed in. If not, return to sign in. If yes, assign context variable
    const listen = onAuthStateChanged(auth, async (user: any) => {
      // console.log(user);
      if (user) {
        // Retrieve user data from backend database
        // const url: string = `http://localhost:8080/user/${user.email}`;
        const url: string = `https://personal-finance-app-server.onrender.com/user/${user.email}`;
        const userData = await axios.get(url);
        // console.log(userData);

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
      {/* <button onClick={checkCurrentUser}>Check Current User</button> */}
    </>
  )
}