import { useEffect, useState, useContext } from 'react';
import SignOut from './SignOut';
import CheckAuth from './CheckAuth';
import { Link } from 'react-router-dom';
import { MyContext } from '../MyContext';
import axios from 'axios';

export default function Home() {
  interface Account {
    id: number,
    accountName: string,
    currency: string,
    accountType: string,
    balance: number,
  }

  const [allAccounts, setAllAccounts] = useState<Account[]>([]);
  const [selectedAccount, setSelectedAccount] = useState<number | null>(null);

  const { userId } = useContext(MyContext);

  // GET ALL ACCOUNTS
  async function getAllAccounts(): Promise<void> {
    const url: string = `http://localhost:8080/account/${userId}`;
    // const url: string = `https://personal-finance-app-server.onrender.com/user/${userId}`;
    const retrievedData = await axios.get(url);
    console.log(retrievedData);
    setAllAccounts(retrievedData.data);
  }

  useEffect(() => {
    if (userId) getAllAccounts();
  }, [userId]);

  // SELECT ACCOUNT
  function applySelectedAccount(e:any):void {
    setSelectedAccount(e.target.dataset.accountid);
    console.log(e.target.dataset.accountid);
  }

  function autoSelectFirstAccount(): void {
    setSelectedAccount(allAccounts[0].id);
  }

  useEffect(() => {
    if (allAccounts[0]) autoSelectFirstAccount();
  }, [allAccounts]);



  return (
    <>
      <CheckAuth />
      <SignOut />
      <h1>home page</h1>
      <Link to='/CreateAccount'><button>Create Account</button></Link>
      <Link to='/CreateRecordIncomeExpense'><button>Create Record: Income/Expense</button></Link>
      <Link to='/ShowRecord' state={{selectedAccount: selectedAccount}} ><button>Show Record</button></Link>
      <div>
        <h2>Account List</h2>
        {allAccounts.map((account, index) => {
          return (
           <div key={index}>
              <p data-accountid={account.id} onClick={applySelectedAccount}>{account.accountName}</p>
              <p data-accountid={account.id} onClick={applySelectedAccount}>{account.currency}</p>
              <p data-accountid={account.id} onClick={applySelectedAccount}>{account.accountType}</p>
              <p data-accountid={account.id} onClick={applySelectedAccount}>{account.balance}</p>
           </div> 
          );
        })}
      </div>
    </>
  )
};