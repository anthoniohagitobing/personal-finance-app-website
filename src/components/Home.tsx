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
    // const url: string = `http://localhost:8080/accounts/${userId}`;
    const url: string = `https://personal-finance-app-server.onrender.com/accounts/${userId}`;
    const retrievedData = await axios.get(url);
    // console.log(retrievedData);
    setAllAccounts(retrievedData.data);
  }

  useEffect(() => {
    if (userId) getAllAccounts();
  }, [userId]);

  // SELECT ACCOUNT
  function applySelectedAccount(e:any):void {
    const tempSelectedAccount = Number(e.target.dataset.accountid);
    if (tempSelectedAccount) {
      setSelectedAccount(tempSelectedAccount);
      // console.log(tempSelectedAccount);
    }
  }

  function autoSelectFirstAccount(): void {
    setSelectedAccount(allAccounts[0].id);
  }

  useEffect(() => {
    if (allAccounts[0]) autoSelectFirstAccount();
  }, [allAccounts]);



  return (
    <div className='home'>
      <CheckAuth />
      <div className='home__nav-bar'>
        <Link to='/Home' className='home__nav-bar__title'>Bookkeeper</Link>
        <div className='home__nav-bar__button'>
          <SignOut />
        </div>
      </div>
      <div className='home__account'>
        <div className='home__account__header'>
          <h2 className='home__account__header__title'>Account List</h2>
          <Link to='/CreateAccount'><button className='home__account__header__button-1'>Create Account +</button></Link>
          <Link to='/CreateRecordIncomeExpense'><button className='home__account__header__button-2'>Create Record: Income/Expense +</button></Link>
          <Link to='/ShowRecord' state={{selectedAccount: selectedAccount}} ><button className='home__account__header__button-3'>Show Record</button></Link>
        </div>
        <div className='home__account__container'>
          {allAccounts.map((account, index) => {
            const cardClass = account.id === selectedAccount ? 'home__account__container__card home__account__container__card__selected' : 'home__account__container__card';
            return (
            <div key={index} className={cardClass} onClick={applySelectedAccount}>
                <div className='home__account__container__card__row'>
                  <p className='home__account__container__card__row__account-name' data-accountid={account.id}>{account.accountName}</p>
                </div>
                <div className='home__account__container__card__row'>
                  <p className='home__account__container__card__row__account-type' data-accountid={account.id}>{account.accountType}</p>
                  <div className='home__account__container__card__row__value'>
                    <p className='home__account__container__card__row__value__currency' data-accountid={account.id}>{account.currency}</p>
                    <p className='home__account__container__card__row__value__amount' data-accountid={account.id}>{account.balance.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</p>
                  </div>
                </div>
            </div> 
            );
          })}
        </div>
      </div>
    </div>
  )
};