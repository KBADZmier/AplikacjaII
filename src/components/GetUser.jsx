import React, { useEffect, useState } from 'react';
import axios from 'axios';

function AllUsers() {
  const [users, setusers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/GetUser');
        //console.log('Fetched products:', response.data);
        setusers(response.data);
      } catch (error) {
        console.error('Błąd pobierania użytkowników:', error);
      }
    };

    fetchUsers();
  }, []);


  return (
    <div>
    <h2>Lista użytkowników</h2>
    <div>
      {users.map(user => (
        <div key={user._id}>
          {user.username ? `Nazwa użytkownika: ${user.username} - rola: ${user.role}` : 'Brak użytkownika'}
        </div>
      ))}
    </div>
  </div>
  
  );
}

export default AllUsers;
