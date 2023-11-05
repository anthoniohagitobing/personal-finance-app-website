import React, { useEffect, useState } from 'react';
import { auth } from "../firebase";
import { onAuthStateChanged } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';


export default function CheckAuth() {
  const [authUser, setAuthUser] = useState<object | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const listen = onAuthStateChanged(auth, (user: any) => {
      console.log(user);
      if (user) {
        setAuthUser(user)
      } else {
        setAuthUser(null);
        navigate("/SignIn");
      }
    });

    return () => {
      listen();
    }
      // this unmount the listen function so that it does not have to be run twice
  }, []);


  return (
    <></>
    // <div>{authUser ? 
    //   <>
    //     <p>{`Signed in as ${authUser.email}`}</p> 
    //   </>
    //   : <p>You are not signed in</p>}
    // </div>
  )
}