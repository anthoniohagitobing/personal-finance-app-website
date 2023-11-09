import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import CheckAuth from './CheckAuth';
import axios from 'axios';
import format from 'date-fns/format';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import SignOut from './SignOut';

export default function ShowRecord(): JSX.Element {
  interface Record {
    accountId: number;
    transactionType: string;
    title: string;
    dateTime: string;
    category: string;
    inputType: string;
    amount: number;
  }

  const [allRecords, setAllRecords] = useState<Record[]>([]);
  const [accountInformation, setAccountInformation] = useState();
  const [processedRecords, setProcessedRecords] = useState<Record[]>([]);
  const [totalIncome, setTotalIncome] = useState<number>(0);
  const [totalExpense, setTotalExpense] = useState<number>(0);
  const [netChange, setNetChange] = useState<number>(0);

  const location = useLocation();

  // FILTER & ORDER STATE VARIABLE
  const [filterCategory, setFilterCategory] = useState<string>('All');  
  const categoryIncome: string[] = ['Salary', 'Gift', 'Allowance', 'Investment', 'Others'];
  const categoryExpense: string[] = ['Food & Drink', 'Housing', 'Shopping', 'Transportation', 'Activites', 'Communication', 'Financial', 'Others'];
  const [filterTransactionType, setFilterTransactionType] = useState<string>('All');  
  const [filterLowestAmount, setFilterLowestAmount] = useState<string>('');
  const [filterHighestAmount, setFilterHighestAmount] = useState<string>('');
  const defaultOldestDate: Date = new Date();
  defaultOldestDate.setMonth(defaultOldestDate.getMonth() - 1);
  defaultOldestDate.setHours(0,0,0,0);
  const defaultNewestDate: Date = new Date();
  defaultNewestDate.setHours(23,59,59,59);
  const [filterOldestDate, setFilterOldestDate] = useState<Date | null>(defaultOldestDate);
  const [filterNewestDate, setFilterNewestDate] = useState<Date | null>(defaultNewestDate);
  const [orderDate, setOrderDate] = useState<string>('desc');

  // GETTING ACCOUNT INFORMATION
  async function getAccountInformation(): Promise<void> {
    const accountId = location.state.selectedAccount;
    // console.log(accountId);

    // Guard clause, this will prevent fetching if account id is not selected
    if (!accountId) return;

    // RETRIEVE ACCOUNT DETAILS

    // RETRIEVE ALL RECORDS
    const url: string = `http://localhost:8080/all-records/${accountId}`;
    // const url: string = `https://personal-finance-app-server.onrender.com/all-records/${accountId}`;
    const retrievedData = await axios.get(url);
    // console.log(retrievedData.data);
    setAllRecords(retrievedData.data);
  }
  
  useEffect(() => {
    getAccountInformation();
  }, []);

  // PROCESSING RECORDS BASED ON FILTERS AND SORT
  function changeOrderDate() {
    if (orderDate === 'asc') setOrderDate('desc');
    if (orderDate === 'desc') setOrderDate('asc');
  }

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
      .filter(record => {
        if (filterLowestAmount) return Math.abs(record.amount) >= Number(filterLowestAmount);
        return true;
      })
      .filter(record => {
        if (filterHighestAmount) return Math.abs(record.amount) <= Number(filterHighestAmount);
        return true;
      })
      .filter(record => {
        if (filterOldestDate) return  new Date(record.dateTime) >= filterOldestDate;
        return true;
      })
      .filter(record => {
        return filterNewestDate && new Date(record.dateTime) <= filterNewestDate;
      })
    ;
    
    let orderedRecords = filteredRecords;
    if (orderDate === 'asc') orderedRecords = filteredRecords.sort((a, b) => Date.parse(a.dateTime) - Date.parse(b.dateTime));
    if (orderDate === 'desc') orderedRecords = filteredRecords.sort((a, b) => Date.parse(b.dateTime) - Date.parse(a.dateTime));
    setProcessedRecords(orderedRecords);
  }

  useEffect(() => {
    processRecords();
  }, [allRecords, filterCategory, filterTransactionType, filterLowestAmount, filterHighestAmount, filterOldestDate, filterNewestDate, orderDate])

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
    <div className='show-records'>
      <CheckAuth />
      <div className='show-records__nav-bar'>
        <Link to='/Home' className='show-records__nav-bar__title'>Home</Link>
        <div className='show-records__nav-bar__button'>
          <Link to="/Home"><button className='create-account__nav-bar__button__home'>Go back to home</button></Link>
          <SignOut />
        </div>
      </div>
      <div className='show-records__card'>
        <h1 className='show-records__card__title'>Account History</h1>
        <div className='show-records__card__summary'>
          <div className='show-records__card__summary__block'>
            <label className='show-records__card__summary__block__label'>Total Income:</label>
            <p className='show-records__card__summary__block__data positive'>{totalIncome.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</p>
          </div>
          <div className='show-records__card__summary__block'>
            <label className='show-records__card__summary__block__label'>Total Expense:</label>
            <p className='show-records__card__summary__block__data negative'>{totalExpense.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</p>
          </div>
          <div className='show-records__card__summary__block'>
          <label className='show-records__card__summary__block__label'>Net Change:</label>
            <p className={netChange >= 0 ? 'show-records__card__summary__block__data positive' : 'show-records__card__summary__block__data negative'}>{netChange.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</p>
          </div>
        </div>
        <div className='show-records__card__filter'>
          <h3 className='show-records__card__filter__title'>Filter:</h3>
          <div className='show-records__card__filter__column'>
            <div className='show-records__card__filter__column__block'>
              <label className='show-records__card__filter__column__block__label'>Category:</label>
              <label className='show-records__card__filter__column__block__label'>Transaction Type:</label>
            </div>
            <div className='show-records__card__filter__column__block'>
              <select onChange={(e) => setFilterTransactionType(e.target.value)} className='show-records__card__filter__column__block__select'>
                <option disabled> -- select an option -- </option>
                <option>All</option>
                <option>Income</option>
                <option>Expense</option>
              </select>
              <select onChange={(e) => setFilterCategory(e.target.value)} className='show-records__card__filter__column__block__select'>
                <option disabled> -- select an option -- </option>
                <option>All</option>
                <optgroup label="Income">
                  {categoryIncome.map((category) => <option key={category} value={category}>{category}</option>)}
                </optgroup>
                <optgroup label="Expense">
                  {categoryExpense.map((category) => <option key={category} value={category}>{category}</option>)}
                </optgroup>
              </select>
            </div>
          </div>
          <div className='show-records__card__filter__column'>
            <div className='show-records__card__filter__column__block'>
              <label className='show-records__card__filter__column__block__label'>Date:</label>
              <label className='show-records__card__filter__column__block__label'>Amount:</label>
            </div>
            <div className='show-records__card__filter__column__block'>
              <DatePicker 
                selected={filterOldestDate}
                onChange={dateTime => setFilterOldestDate(dateTime)}
                className='show-records__card__filter__column__block__date'
              />
              <input
                type='number'
                placeholder='Enter lowest amount'
                value={filterLowestAmount}
                onChange={(e) => setFilterLowestAmount(e.target.value)}
                className='show-records__card__filter__column__block__input'
              ></input>
            </div>
            <div className='show-records__card__filter__column__block'>
              <p>-</p>  
              <p>-</p>  
            </div>
            <div className='show-records__card__filter__column__block'>
              <DatePicker 
                selected={filterNewestDate}
                onChange={dateTime => setFilterNewestDate(dateTime)}
                className='show-records__card__filter__column__block__date'
              />
              <input
                  type='number'
                  placeholder='Enter highest amount'
                  value={filterHighestAmount}
                  onChange={(e) => setFilterHighestAmount(e.target.value)}
                  className='show-records__card__filter__column__block__input'
                ></input>
            </div>
            <div className='show-records__card__filter__column__block'>
              <button onClick={changeOrderDate} className='show-records__card__filter__column__block__button'>{orderDate}</button>
            </div>
          </div>
        </div>
        <div className='show-records__card__history'>
          <div className='show-records__card__history__heading'>
            <div>Title</div>
            <div>Category</div>
            <div>Date</div>
            <div>Amount</div>
            {/* <div>Type</div> */}
          </div>
          {processedRecords?.map((account, index) => {
            const dateTimeShown = format(new Date(account.dateTime), "EEE',' dd MMM yy");
            return (
              <div key={index} className='show-records__card__history__row'>
                <div>{account.title}</div>
                <div>{account.category}</div>
                <div>{dateTimeShown}</div>
                <div>{account.amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</div>
                {/* <div>{account.transactionType}</div> */}
              </div>
            )
          })}
        </div>
        </div>
      </div>
  );
};