import React, { useEffect, useState, useContext} from 'react';
import { Link, useNavigate, NavigateFunction } from 'react-router-dom';
import { auth } from '../firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';
import SkipSignIn from './SkipSignIn';
import { MyContext } from '../MyContext';

export default function SignIn(): JSX.Element {
  const [email, setEmail] = useState<string>('user1@gmail.com');
  const [password, setPassword] = useState<string>('test123');

  const navigate: NavigateFunction = useNavigate();
  const { userId, userEmail, setUserId, setUserEmail } = useContext(MyContext);

  async function signIn(e: any): Promise<void> {
    e.preventDefault();
      // this prevents the email and password to dissapear when button is clicked, achieved by removing default

    const response: string | void | null = await signInWithEmailAndPassword(auth, email, password)
      .then((userCredintial) => {
        // console.log(userCredintial);
        // console.log(userCredintial.user.email);
        return userCredintial.user.email;
      })
      .catch((error) => {
        console.log(error);
      });
      // this will send email and password to firebase. If correct it will return user email
    // console.log(response);
    
    if (response) {
      navigate("/home");
    } else alert('Invalid username or password');
  }

  // function test() {
  //   console.log(userId, userEmail);
  // }
  // function test2() {
  //   setUserId(2);
  //   setUserEmail("UpdateEmail");
  // }

  return (
    <>
      <SkipSignIn />
      <div>
        <form onSubmit={signIn}>
          <h1>Log In to Your Account</h1>
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
          <button type="submit">Sign In</button>
        </form>
        <Link to="/SignUp"><button>Sign Up</button></Link>
      </div>
      {/* <button onClick={test}>test</button>
      <button onClick={test2}>test2</button> */}
    </>
  )
}