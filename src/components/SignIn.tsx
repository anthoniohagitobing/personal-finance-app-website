import { useState } from 'react';
import { Link, useNavigate, NavigateFunction } from 'react-router-dom';
import { auth } from '../firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';
import SkipSignIn from './SkipSignIn';


export default function SignIn(): JSX.Element {
  const [email, setEmail] = useState<string>('email1@gmail.com');
  const [password, setPassword] = useState<string>('password1');

  const navigate: NavigateFunction = useNavigate();

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
    
    if (response) navigate("/home");
    else alert('Invalid username or password');
  }

  return (
    <div className="sign-in">
      <SkipSignIn />
      <div className='sign-in__container'>
        <h1 className='sign-in__title'>Sign In to Your Account</ h1>
        <form onSubmit={signIn} className='sign-in__form'>
          <div className='sign-in__form__box'>
            <label className='sign-in__form__box__label'>Email</label>
            <input 
              type="email" 
              placeholder='Type your email'
              value={email}
              onChange={(e) => setEmail(e.target.value) }
              className='sign-in__form__box__input'
              required
            ></input>
          </div>
          <div className='sign-in__form__box'>
            <label className='sign-in__form__box__label'>Password</label>
            <input 
              type="pasword" 
              placeholder='Type your password'
              value={password}
              onChange={(e) => setPassword(e.target.value) }
              className='sign-in__form__box__input'
              required
            ></input>
          </div>
          <button type="submit" className='sign-in__form__sign-in-button'>Sign In</button>
        </form>
        <div className='sign-in__sign-up'>
          <p className='sign-in__sign-up__text'>Don't have an account?</p>
          <Link to="/SignUp"><p className='sign-in__sign-up__link'>Sign Up</p></Link>
        </div>
      </div>
    </div>
  )
}