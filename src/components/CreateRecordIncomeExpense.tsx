import React, { useEffect, useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import CheckAuth from './CheckAuth';
import { MyContext } from '../MyContext';
import axios from 'axios';

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
    dateTime: string,
    category: string,
    inputType: string,
    amount: number
  }

  const [allAccount, setAllAccount] = useState<Account[]>([]);
  const [selectedAccount, setSelectedAccount] = useState<number | null>(null);
  const [transactionType, setTransactionType] = useState<string>('Income');
  const [title, setTitle] = useState<string>('');
  const [dateTime, setDateTime] = useState<Date>(new Date()); 
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
  async function getAllAccount(): Promise<void> {
    const url: string = `http://localhost:8080/account/${userId}`;
    // const url: string = `https://personal-finance-app-server.onrender.com/user/${userId}`;
    const retrievedData = await axios.get(url);
    // console.log(retrievedData);
    setAllAccount(retrievedData.data);
    setSelectedAccount(retrievedData.data[0].id);
  }

  function selectAccount(e: any): void {
    console.log(e.target.value);
    setSelectedAccount(e.target.value);
  }

  useEffect(() => {
    if (userId) getAllAccount();
  }, [userId]);


  // REGISTERING RECORD
  async function createRecordIncomeExpense(e: any) {
    e.preventDefault();

    const convertedDateTime: string = dateTime.toISOString();
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
    // console.log(newRecordIncomeExpense);

    const url: string = 'http://localhost:8080/record-income-expense';
    // const url: string = 'https://personal-finance-app-server.onrender.com/record-income-expense';
    await axios.post(url, newRecordIncomeExpense)
    .then(res => {
      alert(res.data);
      // navigate("/Home");
    })
    .catch(error => console.log(error));
  }
  

  // HELPER USE EFFECT TO DISPLAY DIFFERENT CATEGORY
  useEffect(() => {
    if (transactionType === 'Income') setCategory('Salary');
    if (transactionType === 'Expense') setCategory('Food & Drink');
  }, [transactionType]);



  return (
    <>
      <CheckAuth />
      <Link to="/Home"><button>Go back to home</button></Link>
      <form onSubmit={createRecordIncomeExpense}>
        <h1>Input Record</h1>
        <select onChange={(e) => setTransactionType(e.target.value)} required>
          <option disabled> -- select an option -- </option>
          <option>Income</option>
          <option>Expense</option>
        </select>
        <select onChange={selectAccount} required>
          <option disabled> -- select an option -- </option>
          {allAccount.map((account, index) => <option key={index} value={account.id}>{account.accountName}</option>)}
        </select>
        <select onChange={(e) => setCategory(e.target.value)} required>
          <option disabled> -- select an option -- </option>
          {transactionType === 'Income' && categoryIncome.map((category) => <option key={category} value={category}>{category}</option>)}
          {transactionType === 'Expense' && categoryExpense.map((category) => <option key={category} value={category}>{category}</option>)}
        </select>
        <input
          type='text'
          placeholder='Enter title'
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        ></input>
        <p>{transactionType === 'Income' ? '+' : '-'}</p>
        <input
          type='number'
          placeholder='Enter amount'
          value={amount}
          onChange={(e) => setAmount(Number(e.target.value))}
          required
        ></input>
        <DatePicker 
          selected={dateTime}
          onChange={dateTime => setDateTime(dateTime)}
          placeholderText='Select a date'
          dateFormat="MMMM d, yyyy h:mm aa"
          showTimeSelect
          timeFormat="HH:mm"
          timeIntervals={15}
          timeCaption="Time"
          required
        />
        <button type='submit'>Register Record</button>
      </form>
    </>

  );
}