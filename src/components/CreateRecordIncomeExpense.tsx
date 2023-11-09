import { useEffect, useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import CheckAuth from './CheckAuth';
import { MyContext } from '../MyContext';
import axios from 'axios';
import SignOut from './SignOut';

export default function CreateRecordIncomeExpense(): JSX.Element {
  interface Account {
    id: number,
    accountName: string,
    currency: string,
    accountType: string,
  }

  interface NewRecordIncomeExpense {
    accountId: number | null,
    transactionType: string,
    title: string,
    dateTime: string | null,
    category: string,
    inputType: string,
    amount: number
  }

  const [allAccounts, setAllAccounts] = useState<Account[]>([]);
  const [selectedAccount, setSelectedAccount] = useState<number | null>(null);
  const [transactionType, setTransactionType] = useState<string>('Income');
  const [title, setTitle] = useState<string>('');
  const [dateTime, setDateTime] = useState<Date | null>(new Date()); 
  const [category, setCategory] = useState<string>('');
  const [amount, setAmount] = useState<number>(0);

  const navigate = useNavigate();
  const { userId } = useContext(MyContext);

  const categoryIncome: string[] = ['Salary', 'Gift', 'Allowance', 'Investment', 'Others'];
  const categoryExpense: string[] = ['Food & Drink', 'Housing', 'Shopping', 'Transportation', 'Activites', 'Communication', 'Financial', 'Others'];



  // TEST FUNCTION
  // useEffect(() => {
  //   console.log(dateTime);
  // }, [dateTime]);

  // GET ALL ACCOUNT AND SELECT ACCOUNT
  async function getAllAccounts(): Promise<void> {
    const url: string = `http://localhost:8080/account/${userId}`;
    // const url: string = `https://personal-finance-app-server.onrender.com/user/${userId}`;
    const retrievedData = await axios.get(url);
    // console.log(retrievedData);
    setAllAccounts(retrievedData.data);
    setSelectedAccount(retrievedData.data[0].id);
  }

  function selectAccount(e: any): void {
    console.log(e.target.value);
    setSelectedAccount(Number(e.target.value));
  }

  useEffect(() => {
    if (userId) getAllAccounts();
  }, [userId]);


  // REGISTERING RECORD
  async function createRecordIncomeExpense(e: any) {
    e.preventDefault();

    const convertedDateTime: string | null = (dateTime) && dateTime.toISOString();
    const convertedAmount: number = amount * (transactionType === 'Income' ? 1 : -1);
    const newRecordIncomeExpense: NewRecordIncomeExpense = {
      accountId: selectedAccount,
      transactionType: transactionType,
      title: title,
      dateTime: convertedDateTime,
      category: category,
      inputType: 'Global',
      amount: convertedAmount,
    }
    console.log(newRecordIncomeExpense);

    const url: string = 'http://localhost:8080/record-income-expense';
    // const url: string = 'https://personal-finance-app-server.onrender.com/record-income-expense';
    await axios.post(url, newRecordIncomeExpense)
    .then(res => {
      alert(res.data);
      navigate("/Home");
    })
    .catch(error => console.log(error));
  }
  

  // HELPER USE EFFECT TO DISPLAY DIFFERENT CATEGORY
  useEffect(() => {
    if (transactionType === 'Income') setCategory('Salary');
    if (transactionType === 'Expense') setCategory('Food & Drink');
  }, [transactionType]);



  return (
    <div className='create-record-income-expense'>
      <CheckAuth />
      <div className='create-record-income-expense__nav-bar'>
        <Link to="/Home" className='create-record-income-expense__nav-bar__title'>Home</Link >
        <div className='create-record-income-expense__nav-bar__button'>
          <Link to="/Home"><button className='create-record-income-expense__nav-bar__button__home'>Go back to home</button></Link>
          <SignOut />
        </div>
      </div>
      <div className='create-record-income-expense__card'>
        <h1 className='create-record-income-expense__card__title'>Input Record</h1>
        <form onSubmit={createRecordIncomeExpense} className='create-record-income-expense__card__form'>
          <div className='create-record-income-expense__card__form__box'>
            <label className='create-record-income-expense__card__form__box__label'>Transaction Type:</label>
            <select onChange={(e) => setTransactionType(e.target.value)} className='create-record-income-expense__card__form__box__select' required>
              <option disabled> -- select an option -- </option>
              <option>Income</option>
              <option>Expense</option>
            </select>
          </div>
          <div className='create-record-income-expense__card__form__box'>
            <label className='create-record-income-expense__card__form__box__label'>Account Name:</label>
            <select onChange={selectAccount} className='create-record-income-expense__card__form__box__select' required>
              <option disabled> -- select an option -- </option>
              {allAccounts.map((account, index) => <option key={index} value={account.id}>{account.accountName}</option>)}
            </select>
          </div>
          <div className='create-record-income-expense__card__form__box'>
            <label className='create-record-income-expense__card__form__box__label'>Category:</label>
            <select onChange={(e) => setCategory(e.target.value)} className='create-record-income-expense__card__form__box__select' required>
              <option disabled> -- select an option -- </option>
              {transactionType === 'Income' && categoryIncome.map((category) => <option key={category} value={category}>{category}</option>)}
              {transactionType === 'Expense' && categoryExpense.map((category) => <option key={category} value={category}>{category}</option>)}
            </select>
          </div>
          <div className='create-record-income-expense__card__form__box'>
            <label className='create-record-income-expense__card__form__box__label'>Title:</label>
            <input
              type='text'
              placeholder='Enter title'
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className='create-record-income-expense__card__form__box__input'
              required
            ></input>
          </div>
          <div className='create-record-income-expense__card__form__box'>
            <label className='create-record-income-expense__card__form__box__label'>Amount:</label>
            <p className='create-record-income-expense__card__form__box__symbol'>{transactionType === 'Income' ? '+' : '-'}</p>
            <input
              type='number'
              placeholder='Enter amount'
              value={amount}
              onChange={(e) => setAmount(Number(e.target.value))}
              className='create-record-income-expense__card__form__box__input'
              required
            ></input>
          </div>
          <div className='create-record-income-expense__card__form__box'>
            <label className='create-record-income-expense__card__form__box__label'>Date and Time:</label>
            <DatePicker 
              selected={dateTime}
              onChange={dateTime => setDateTime(dateTime)}
              placeholderText='Select a date'
              dateFormat="MMMM d, yyyy h:mm aa"
              showTimeSelect
              timeFormat="HH:mm"
              timeIntervals={15}
              timeCaption="Time"
              showIcon
              className='create-record-income-expense__card__form__box__date'
              required
            />
          </div>
          <button type='submit' className='create-record-income-expense__card__form__button'>Register Record</button>
        </form>
      </div>
    </div>
  );
}