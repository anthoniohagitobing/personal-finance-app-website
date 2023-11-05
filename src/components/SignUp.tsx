import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { auth } from '../firebase';
import { createUserWithEmailAndPassword, signOut } from 'firebase/auth';
import axios, {AxiosResponse} from 'axios';

export default function SignUp(): JSX.Element {
  const [email, setEmail] = useState<string>('client1@gmail.com');
  const [password, setPassword] = useState<string>('password123');
  const [firstName, setFirstName] = useState<string>('firstname123');
  const [lastName, setLastName] = useState<string>('lastname123');
  const navigate = useNavigate();

  async function signUp(e: any) {
    e.preventDefault();
      // this prevents the email and password to dissapear when button is clicked, achieved by removing default

    // Creating account
    createUserWithEmailAndPassword(auth, email, password)
      .then(async (userCredintial) => {
        // Indicate success
        console.log(userCredintial);
        alert("Create account successful in firebase");

        // Logging out and sent to sign in page
        signOut(auth)
          .then(() => {
            navigate("/SignIn");
          })
          .catch((err) => {
            console.log(err);
          });

        // Registering user to the backend
        const newUserData = {
          email: email,
          firstName: firstName,
          lastName: lastName
        };
        const url: string = 'http://localhost:8080/user';
        // const url: string = 'https://personal-finance-app-server.onrender.com/user';
        await axios.post(url, newUserData)
          .then(res => alert(res))
          .catch(error => console.log(error)); 
      })
      .catch((error) => {
        console.log(error);
        alert("invalid username and password");
      });
  }

  return (
    <>
      <div>
        <form onSubmit={signUp}>
          <h1>Create Account</h1>
          <input 
            type="email" 
            placeholder='Enter your email'
            value={email}
            onChange={(e) => setEmail(e.target.value) }
          ></input>
          <input 
            type="pasword" 
            placeholder='Enter your password'
            value={password}
            onChange={(e) => setPassword(e.target.value) }
          ></input>
          <input 
            type="text" 
            placeholder='Enter your first name'
            value={firstName}
            onChange={(e) => setFirstName(e.target.value) }
          ></input>
          <input 
            type="text" 
            placeholder='Enter your last name'
            value={lastName}
            onChange={(e) => setLastName(e.target.value) }
          ></input>
          <button type="submit">Sign up</button>
        </form>
        <Link to="/"><button>Go to Sign In</button></Link>
      </div>
    </>
  )
}