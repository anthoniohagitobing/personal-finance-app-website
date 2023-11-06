import React, { useEffect, useState, useContext, MouseEventHandler } from 'react';
import SignOut from './SignOut';
import CheckAuth from './CheckAuth';
import { Link, useNavigate } from 'react-router-dom';
import { MyContext } from '../MyContext';
import axios, { AxiosResponse } from 'axios';

export default function Home() {
  interface Account {
    id: number,
    accountName: string,
    currency: string,
    accountType: string,
  }

  const[allAccount, setAllAccount] = useState<Account[]>([]);
  const [selectedAccount, setSelectedAccount] = useState<number | null>(null);

  const { userId } = useContext(MyContext);

  async function getAllAccount(): Promise<void> {
    const url: string = `http://localhost:8080/account/${userId}`;
    // const url: string = `https://personal-finance-app-server.onrender.com/user/${userId}`;
    const retrievedData: AxiosResponse<any, any> = await axios.get(url);
    console.log(retrievedData);
    setAllAccount(retrievedData.data);
  }

  function applySelectedAccount(e:any):void {
    console.log(e.target.dataset.accountid);
    setSelectedAccount(e.target.dataset.accountid);
  }

  useEffect(() => {
    getAllAccount();
  }, []);

  return (
    <>
      <CheckAuth />
      <SignOut />
      <h1>home page</h1>
      <Link to="/CreateAccount"><button>Create Account</button></Link>
      <div>
        <h2>Account List</h2>
        {allAccount.map((account, index) => {
          return (
           <div key={index} data-accountid={account.id} onClick={applySelectedAccount}>
              <p data-accountid={account.id} onClick={applySelectedAccount}>{account.accountName}</p>
              <p data-accountid={account.id} onClick={applySelectedAccount}>{account.currency}</p>
              <p data-accountid={account.id} onClick={applySelectedAccount}>{account.accountType}</p>
           </div> 
          );
        })}
      </div>
    </>
  )
};