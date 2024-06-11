import React, { useEffect, useState } from "react";
import axios from "axios";
import "./GetUser.css";

function AllUsers() {
  const [users, setusers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/GetUser");
        //console.log('Fetched products:', response.data);
        setusers(response.data);
      } catch (error) {
        console.error("Błąd pobierania użytkowników:", error);
      }
    };

    fetchUsers();
  }, []);

  return (
    <div className="pago">
      <h2>Lista użytkowników</h2>
      <div className="userss">
        {users.map((user) => (
          <div key={user._id} className="userino">
            {user.username ? (
              <>
                Nazwa użytkownika: <span className="qwe">{user.username} </span>
                - rola:{" "}
                <span className={user.role === "admin" ? "admin" : "user"}>
                  {user.role}
                </span>
              </>
            ) : (
              "Brak użytkownika"
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default AllUsers;
