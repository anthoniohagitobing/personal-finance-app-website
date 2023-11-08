import { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import CheckAuth from './CheckAuth';
import { MyContext } from '../MyContext';
import axios from 'axios';

export default function CreateAccount(): JSX.Element {
  interface NewAccountData {
    userId: number,
    accountName: string,
    currency: string,
    accountType: string,
    note?: string | undefined,
  }
  
  const [accountName, setAccountName] = useState<string>('');
  const [currency, setCurrency] = useState<string>('General');
  const [accountType, setAccountType] = useState<string>('USD'); 
  const [note, setNote] = useState<string | undefined>('');

  const navigate = useNavigate();
  const { userId } = useContext(MyContext);

  const accountTypeOption: string[] = ['General', 'Cash', 'Bank Account', 'Credit Card', 'Electronic Money'];
  const currencyOption: string[] = ['USD', 'JYP', 'IDR', 'SGD', 'EUR', 'GBP', 'AUD', 'NZD', 'HKD', 'CHF', 'CAD', 'CNH'];

  async function createAccount(e: any): Promise<void> {
    e.preventDefault();

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
      .then(res => {
        alert(res.data);
        navigate("/Home");
      })
      .catch(error => console.log(error));
  }


  // TEST FUNCTION
  // useEffect(() => {
  //   console.log(accountType);
  // }, [accountType]);

  return (
    <div>
      <CheckAuth />
      <Link to="/Home"><button>Go back to home</button></Link>
      <form onSubmit={createAccount}>
        <h1>Create Account</h1>
        <input
          type='text'
          placeholder='Enter your account name'
          value={accountName}
          onChange={(e) => setAccountName(e.target.value)}
          required
        ></input>
        <select onChange={(e) => setCurrency(e.target.value)} required>
          <option disabled> -- select an option -- </option>
          {currencyOption.map((currency) => <option key={currency} value={currency}>{currency}</option>)}
        </select>
        <select onChange={(e) => setAccountType(e.target.value)} required>
          <option disabled> -- select an option -- </option>
          {accountTypeOption.map((type) => <option key={type} value={type}>{type}</option>)}
        </select>
        <input
          type='text'
          placeholder='Enter your note'
          value={note}
          onChange={(e) => setNote(e.target.value)}
        ></input>
        <button type='submit'>Create Account</button>
      </form>
    </div>
  )
}