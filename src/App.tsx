// IMPORT REACT
import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';


// IMPORT COMPONENTS
import SignIn from './components/SignIn';
import SignUp from './components/SignUp';
import Home from './components/Home';
import CreateAccount from './components/CreateAccount';
import CreateRecordIncomeExpense from './components/CreateRecordIncomeExpense';
import ShowRecord from './components/ShowRecord';
import { MyContext } from './MyContext';

// IMPORT OTHERS
import './css/style.css';


function App(): JSX.Element {
  const [userId, setUserId] = useState<number>(0);
  const [userEmail, setUserEmail] = useState<string>('testEmail');
  const [userFirstName, setUserFirstName] = useState<string>('testFirstName');
  const [userLastName, setUserLastName] = useState<string>('testLastName');

  return (
    <>
      <MyContext.Provider value={{userId, userEmail, userFirstName, userLastName, setUserId, setUserEmail, setUserFirstName, setUserLastName}}>
        <Router>
          <Routes>
            <Route path='/SignIn' element= {<SignIn />} />
            <Route path='/SignUp' element= {<SignUp />} />
            <Route path='/Home' element= {<Home />} />
            <Route path='/CreateAccount' element= {<CreateAccount />} />
            <Route path='/CreateRecordIncomeExpense' element= {<CreateRecordIncomeExpense />} />
            <Route path='/ShowRecord' element={<ShowRecord />} />
            <Route path='*' element={<Navigate to='/SignIn' />} />
          </Routes>
        </Router>
      </MyContext.Provider>
    </>
  )
}

export default App
