import { signOut } from 'firebase/auth';
import { auth } from "../firebase";
import { useNavigate } from 'react-router-dom';

export default function SignOut() {
  const navigate = useNavigate();
  
  function userSignOut() {
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
    <button onClick={userSignOut}>Sign Out</button>
  )
}