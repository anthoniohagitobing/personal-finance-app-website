import { useEffect } from 'react';
import { auth } from "../firebase";
import { onAuthStateChanged } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';


export default function SkipSignIn() {
  const navigate = useNavigate();

  useEffect(() => {
    const listen = onAuthStateChanged(auth, (user: any) => {
      // console.log(user);
      if (user) navigate("/Home");
      }
    );

    return () => {
      listen();
    }
      // this unmount the listen function so that it does not have to be run twice
  }, []);


  return (
    <></>
  )
}