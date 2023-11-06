import React, { useEffect, useState, useContext } from 'react';
import CheckAuth from './CheckAuth';
import { MyContext } from '../MyContext';
import axios from 'axios';

interface NewAccountData {
  userId: number,
  accountName: string,
  currency: string,
  accountType: string,
  note: string,
}

export default function CreateAccount(): JSX.Element {
  const [accountName, setAccountName] = useState<string>('');
  const [currency, setCurrency] = useState<string>('');
  const [accountType, setAccountType] = useState<string>(''); 
  const [note, setNote] = useState<string>('');

  const { userId } = useContext(MyContext);

  const accountTypeOption: string[] = ['General', 'Cash', 'Bank Account', 'Credit Card', 'Electronic Money'];
  const currencyOption: string[] = ['USD', 'JYP', 'IDR', 'SGD', 'EUR', 'GBP', 'AUD', 'NZD', 'HKD', 'CHF', 'CAD', 'CNH'];

  async function createAccount(): Promise<void> {
    const newAccountData: NewAccountData = {
      userId: userId,
      accountName: accountName,
      currency: currency,
      accountType: accountType,
      note: note,
    };
    const url: string = 'http://localhost:8080/account';
    // const url: string = 'https://personal-finance-app-server.onrender.com/account';
    await axios.post(url, newAccountData)
      .then(res => alert(res.data))
      .catch(error => console.log(error));
  }


  // TEST FUNCTION
  // useEffect(() => {
  //   console.log(accountType);
  // }, [accountType]);

  return (
    <div>
      <CheckAuth />
      <form onSubmit={createAccount}>
        <h1>Create Account</h1>
        <input
          type='text'
          placeholder='Enter your account name'
          value={accountName}
          onChange={(e) => setAccountName(e.target.value)}
          required
        ></input>
        <select onChange={(e) => setCurrency(e.target.value)}>
          <option>Select Currency</option>
          {currencyOption.map((currency) => <option key={currency} value={currency}>{currency}</option>)}
        </select>
        <select onChange={(e) => setAccountType(e.target.value)}>
          <option>Select Account</option>
          {accountTypeOption.map((type) => <option key={type} value={type}>{type}</option>)}
        </select>
        <input
          type='text'
          placeholder='Enter your note'
          value={note}
          onChange={(e) => setNote(e.target.value)}
          required
        ></input>
        <button type='submit'>Create Account</button>
      </form>
    </div>
  )
}