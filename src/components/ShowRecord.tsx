import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import CheckAuth from './CheckAuth';
import axios from 'axios';
import format from 'date-fns/format'

export default function ShowRecord(): JSX.Element {
  interface Record {
    accountId: number;
    transactionType: string;
    title: string;
    dateTime: Date;
    category: string;
    inputType: string;
    amount: number;
  }

  const [allRecords, setAllRecords] = useState<Record[]>([]);
  const [processedRecords, setProcessedRecords] = useState<Record[]>([]);
  const [totalIncome, setTotalIncome] = useState<number>(0);
  const [totalExpense, setTotalExpense] = useState<number>(0);
  const [netChange, setNetChange] = useState<number>(0);

  const location = useLocation();

  // FILTER STATE VARIABLE
  const [filterCategory, setFilterCategory] = useState<string>('All');  
  const categoryIncome: string[] = ['Salary', 'Gift', 'Allowance', 'Investment', 'Others'];
  const categoryExpense: string[] = ['Food & Drink', 'Housing', 'Shopping', 'Transportation', 'Activites', 'Communication', 'Financial', 'Others'];
  const [filterTransactionType, setFilterTransactionType] = useState<string>('All');  

  // GETTING ALL RECORDS
  async function getAllRecords(): Promise<void> {
    const accountId = location.state.selectedAccount;
    // console.log(accountId);

    // Guard clause, this will prevent fetching if account id is not selected
    if (!accountId) return;

    const url: string = `http://localhost:8080/all-records/${accountId}`;
    // const url: string = `https://personal-finance-app-server.onrender.com/all-records/${accountId}`;
    const retrievedData = await axios.get(url);
    // console.log(retrievedData.data);
    setAllRecords(retrievedData.data);
  }
  
  useEffect(() => {
    getAllRecords();
  }, []);

  // PROCESSING RECORDS BASED ON FILTERS AND SORT
  function processRecords(): void {
    const filteredRecords = allRecords
      .filter(record => {
        if (filterCategory !== "All") return record.category === filterCategory;
        return true;
      })
      .filter(record => {
        if (filterTransactionType !== "All") return record.transactionType === filterTransactionType;
        return true;
      })
    ;
    setProcessedRecords(filteredRecords);
  }

  useEffect(() => {
    processRecords();
  }, [allRecords, filterCategory, filterTransactionType])

  // CALCULATING TOTAL
  function calculateTotal(): void {
    // Calculate income
    const incomeData = processedRecords?.filter(record => record.transactionType === 'Income').map(record => Number(record.amount));
    const calculatedTotalIncome = incomeData?.reduce((acc, curr) => acc + curr, 0);
    setTotalIncome(calculatedTotalIncome);

    // Calculate expense
    const expenseData = allRecords?.filter(record => record.transactionType === 'Expense').map(record => Number(record.amount));
    const calculatedTotalExpense = expenseData?.reduce((acc, curr) => acc + curr, 0);
    setTotalExpense(calculatedTotalExpense);

    // Calculate net change
    const netChangeCalc = calculatedTotalIncome + calculatedTotalExpense;
    setNetChange(netChangeCalc); 


    // console.log(allRecords);
    // console.log(incomeData, calculatedTotalIncome);
    // console.log(expenseData, calculatedTotalExpense);
  }

  useEffect(() => {
    calculateTotal();
  }, [allRecords]);



  return (
    <>
      <CheckAuth />
      <Link to="/Home"><button>Go back to home</button></Link>
      <button onClick={calculateTotal}>Test</button>
      <select onChange={(e) => setFilterCategory(e.target.value)}>
        <option disabled> -- select an option -- </option>
        <option>All</option>
        <optgroup label="Income">
          {categoryIncome.map((category) => <option key={category} value={category}>{category}</option>)}
        </optgroup>
        <optgroup label="Expense">
          {categoryExpense.map((category) => <option key={category} value={category}>{category}</option>)}
        </optgroup>
      </select>
      <select onChange={(e) => setFilterTransactionType(e.target.value)}>
        <option disabled> -- select an option -- </option>
        <option>All</option>
        <option>Income</option>
        <option>Expense</option>
      </select>
      {processedRecords?.map((account, index) => {
        const dateTimeShown = format(new Date(account.dateTime), "EEE',' dd MMM yy");
        return (
          <div key={index}>
            <p>--------------</p>
            <p>{account.title}</p>
            <p>{account.category}</p>
            <p>{dateTimeShown}</p>
            <p>{account.amount}</p>
            <p>{account.transactionType}</p>
            <p>--------------</p>
          </div>
        )
      })}
      <p>{totalIncome}</p>
      <p>{totalExpense}</p>
      <p>{netChange}</p>
    </>
  );
};