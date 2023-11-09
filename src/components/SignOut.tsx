import { signOut } from 'firebase/auth';
import { auth } from "../firebase";
import { useNavigate, NavigateFunction } from 'react-router-dom';

export default function SignOut() {
  const navigate: NavigateFunction = useNavigate();
  
  function userSignOut(): void {
    signOut(auth)
      .then(() => {
        alert('sign out successful');
        navigate("/SignIn");
      })
      .catch((err) => {
        console.log(err);
      })
  }

  return (
    <button onClick={userSignOut} className='sign-out__button'>Sign Out</button>
  )
}