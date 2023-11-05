import { createContext, Dispatch, SetStateAction } from 'react';

interface MyContext {
  userId: number;
  userEmail: string;
  setUserId: Dispatch<SetStateAction<number>>;
  setUserEmail: Dispatch<SetStateAction<string>>;
}

const defaultState = {
  userId: 1,
  userEmail: "testEmail",
  setUserId: () => {},
  setUserEmail: () => {},
}

export const MyContext = createContext<MyContext>(defaultState);

