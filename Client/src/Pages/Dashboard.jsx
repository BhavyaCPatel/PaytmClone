import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';

const Dashboard = () => {
  const [balance, setBalance] = useState(null);
  const [user, setUser] = useState(null);
  const [users, setUsers] = useState([]);
  const [visible, setVisible] = useState(false);
  const [blur, setBlur] = useState(false);
  const [amount, setAmount] = useState('');
  const [selectedUserId, setSelectedUserId] = useState(null);
  const token = localStorage.getItem('authToken');

  const fetchUserData = async () => {
    try {
      const responseu = await axios.get("http://localhost:4000/user/profile", {
        headers: {
          'Authorization': `${token}`
        }
      });
      setUser(responseu.data);
  
      const responseb = await axios.get("http://localhost:4000/accounts/balance", {
        headers: {
          'Authorization': `${token}`
        }
      });
      setBalance(responseb.data.balance);
  
      const response = await axios.get("http://localhost:4000/user/bulk");
      const allUsers = response.data.user;
  
      const filteredUsers = allUsers.filter(u => u._id !== responseu.data._id);
      setUsers(filteredUsers);
  
    } catch (error) {
      console.error(error);
    }
  };
  
  useEffect(() => {
    fetchUserData();
  }, [token]);

  const submit = async () => {
    try {
      const response = await axios.post("http://localhost:4000/accounts/transfer", 
      {
        amount: amount,
        to: selectedUserId
      },
      {
        headers: {
          'Authorization': `${token}`
        }
      });
      console.log(response);
      fetchUserData();
    } catch (error) {
      console.error(error);
    }
  }

  const handleDialogOpen = (userId) => {
    setSelectedUserId(userId);
    setVisible(true);
    setBlur(true);
  };

  const handleDialogClose = () => {
    setVisible(false);
    setBlur(false);
    setAmount('');
  };

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <div className={`flex justify-between ${blur ? 'blur-sm' : ''}`}>
        <h1 className='text-4xl font-bold m-3'>Payments app</h1>
        <div className='m-3 text-3xl'>
          Hello, {user.firstName}
        </div>
      </div>
      <hr />
      <div className={`m-5 ${blur ? 'blur-sm' : ''}`}>
        <h1 className='text-2xl font-semibold'>Your Balance: ₹{balance !== null ? balance : 'Loading...'}</h1>
      </div>
      <div className={`mx-5 my-9 ${blur ? 'blur-sm' : ''}`}>
        <h1 className='text-3xl font-bold'>Users</h1>

        {
          users.length > 0 ? users.map((user) => (
            <div key={user._id} className={`mx-3 my-10 flex justify-between ${blur ? 'blur-sm' : ''}`}>
              <div className='text-2xl font-semibold'>{user.firstName} {user.lastName}</div>
              <div className='text-2xl font-semibold'>
                <Button label="Send" onClick={() => handleDialogOpen(user._id)} className="w-full text-white bg-black hover:bg-gray-800 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2" />
                <Dialog
                  visible={visible}
                  modal
                  onHide={handleDialogClose}
                >
                  <div className="px-8 py-5 gap-4 flex flex-col bg-gray-300 rounded-md">
                    <h1 className="text-2xl font-bold m-5 mb-2 text-center">Send Money</h1>
                    <input type="number" placeholder="Enter amount" className="border border-gray-300 rounded-lg p-2 m-5" value={amount} onChange={(e) => setAmount(e.target.value)} />
                    <div className="flex align-items-center gap-2">
                      <Button label="Send" onClick={() => { submit(); handleDialogClose(); }} text className="w-full text-white bg-black hover:bg-gray-800 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5"></Button>
                      <Button label="Cancel" onClick={handleDialogClose} text className="w-full text-white bg-black hover:bg-gray-800 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5"></Button>
                    </div>
                  </div>
                </Dialog>
              </div>
            </div>
          )) : <div>Loading users...</div>
        }
      </div>
    </>
  );
};

export default Dashboard;
