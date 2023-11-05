import React, { useEffect, useState } from 'react';
import SignOut from './SignOut';
import CheckAuth from './CheckAuth';

export default function Home() {
  return (
    <>
      <CheckAuth />
      <p>home page</p>
      <SignOut />
    </>
  )
};