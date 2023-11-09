import { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import CheckAuth from './CheckAuth';
import { MyContext } from '../MyContext';
import axios from 'axios';
import SignOut from './SignOut';

export default function CreateAccount(): JSX.Element {
  interface NewAccountData {
    userId: number,
    accountName: string,
    currency: string,
    accountType: string,
    note?: string | undefined,
  }
  
  const [accountName, setAccountName] = useState<string>('');
  const [currency, setCurrency] = useState<string>('USD');
  const [accountType, setAccountType] = useState<string>('General'); 
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
    // console.log(newAccountData);

    // const url: string = 'http://localhost:8080/account';
    const url: string = 'https://personal-finance-app-server.onrender.com/account';
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
    <div className='create-account'>
      <CheckAuth />
      <div className='create-account__nav-bar'>
        <Link to="/Home" className='create-account__nav-bar__title'>Bookkeeper</Link >
        <div className='create-account__nav-bar__button'>
          <Link to="/Home"><button className='create-account__nav-bar__button__home'>Go back to home</button></Link>
          <SignOut />
        </div>
      </div>
      <div className='create-account__card'>
        <h1 className='create-account__card__title'>Create Account</h1>
        <form onSubmit={createAccount} className='create-account__card__form'>
          <div className='create-account__card__form__box'>
            <label className='create-account__card__form__box__label'>Account Name:</label>
            <input
              type='text'
              placeholder='Enter your account name'
              value={accountName}
              onChange={(e) => setAccountName(e.target.value)}
              required
              className='create-account__card__form__box__input'
            ></input>
          </div>
          <div className='create-account__card__form__box'>
            <label className='create-account__card__form__box__label'>Currency:</label>
            <select onChange={(e) => setCurrency(e.target.value)} className='create-account__card__form__box__select' required>
              <option disabled> -- select an option -- </option>
              {currencyOption.map((currency) => <option key={currency} value={currency}>{currency}</option>)}
            </select>
          </div>
          <div className='create-account__card__form__box'>
            <label className='create-account__card__form__box__label'>Account Type:</label>
            <select onChange={(e) => setAccountType(e.target.value)} className='create-account__card__form__box__select' required>
              <option disabled> -- select an option -- </option>
              {accountTypeOption.map((type) => <option key={type} value={type}>{type}</option>)}
            </select>
          </div>
          <div className='create-account__card__form__box'>
            <label className='create-account__card__form__box__label'>Note:</label>
            <input
              type='text'
              placeholder='Enter your note'
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className='create-account__card__form__box__input'
            ></input>
          </div>
          <button type='submit' className='create-account__card__form__button'>Create Account</button>
        </form>
      </div>
    </div>
  )
}