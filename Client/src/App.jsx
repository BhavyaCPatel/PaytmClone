import React from 'react'
import { BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import Dashboard from './Pages/Dashboard';
import SendMoney from './Pages/SendMoney';
import SignIn from './Pages/Signin';
import SignUp from './Pages/Signup';

const App = () => {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/signin" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/send" element={<SendMoney />} />
        </Routes>
      </Router>
    </>
  )
}

export default App