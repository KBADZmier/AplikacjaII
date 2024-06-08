//można tu coś ciekawego dodać
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function Admin() {
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('token');
        const role = localStorage.getItem('role');
        if (!token || role !== 'admin') {
            navigate('/'); 
        }
    }, [navigate]);

    return (
        <div>
            <h1>Panel sterowania</h1>
            <p></p> 
        </div>
    );
}

export default Admin;
