import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function VerifyOTP() {
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');


  const navigate = useNavigate();
  const correo = sessionStorage.getItem('resetEmail');

  const handleVerify = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('http://localhost:3001/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ correo, otp }),
      });

      const data = await res.json();
  
      if (!res.ok) {
        setError(data.error); // ✅ Muestra mensaje del backend
        return;
      }

      navigate('/reset-password');

    } catch (err) {
      console.error(err);
    }
  };

  return (
    <form onSubmit={handleVerify}>
      <h2>Verifica tu código</h2>
      <input
        type="text"
        placeholder="Ingresa el código OTP"
        value={otp}
        onChange={(e) => setOtp(e.target.value)}
        required
      />
      {error && <p style={{ color: 'red' }}>{error}</p>}

      <button type="submit">Verificar</button>

    </form>
  );
}

export default VerifyOTP;

