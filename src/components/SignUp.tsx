import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { auth } from '../firebase';
import { createUserWithEmailAndPassword, signOut } from 'firebase/auth';

export default function SignUp(): JSX.Element {
  const [email, setEmail] = useState<string>('user1@gmail.com');
  const [password, setPassword] = useState<string>('test123');
  const navigate = useNavigate();

  function signUp(e: any) {
    e.preventDefault();
      // this prevents the email and password to dissapear when button is clicked, achieved by removing default
      // console.log(email, password);

    // Creating account
    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredintial) => {
        console.log(userCredintial);
        alert("Create account successful");
        signOut(auth)
          .then(() => {
            navigate("/SignIn");
          })
          .catch((err) => {
            console.log(err);
          })
      })
      .catch((error) => {
        console.log(error);
        alert("invalid username and password");
      });
    
    // Logging out and sent to sign in page

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
          <button type="submit">Sign up</button>
        </form>
        <Link to="/"><button>Go to Sign In</button></Link>
      </div>
    </>
  )
}