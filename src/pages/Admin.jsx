import { Link } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import ApprovalCard from '../components/ApprovalCard';
import '../styles/admin-styles.css';

export default function Admin() {
  const [noAprobados, setNoAprobados] = useState([]);

  const fetchNoAprobados = async () => {
    const noAprobadosRes = await fetch('http://localhost:3001/no_aprobados');
    const noAprobadosData = await noAprobadosRes.json();
    setNoAprobados(noAprobadosData);
  };

  useEffect(() => {
    fetchNoAprobados();
  }, []);

  
  
  const handleApprove = async (user) => {
    try {
      await fetch(`http://localhost:3001/approve_empleado/${user}`,{
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: user })
      });
      
      fetchNoAprobados(); // actualiza la lista
    } catch (err) {
      console.error('Error aprobando usuario:', err);
    }
  };
  
  const handleReject = async (user) => {
    try {
      await fetch(`http://localhost:3001/reject_empleado/${user}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: user })
      });

      console.log(user);
      fetchNoAprobados(); // actualiza la lista
    } catch (err) {
      console.error('Error rechazando usuario:', err);
    }
  };

  return (
    <div className='admin-page'>

      <Link to="/sessionstarted">
            <img
              className='go-back-btn'
              src={process.env.PUBLIC_URL + '/assets/go-back.png'}
              alt="Return btn"
            />
      </Link>

      <div className="admin-container">
        <div className="header-container">
          <h1>Pending Sign Ups Requests</h1>
        </div>
        <div className="approval-list">
          {noAprobados.map(u => (
            <ApprovalCard key={u.username} user={u}
              onApprove={handleApprove} onReject={handleReject} />
          ))}
        </div>
      </div>
    </div>
  );
}
