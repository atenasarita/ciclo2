import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function ForgotPassword() {
  const [correo, setCorreo] = useState('');
  const [error, setError] = useState('');

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('http://localhost:3001/request-reset', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ correo })
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error); // ✅ Muestra mensaje del backend
        return;
      }

      sessionStorage.setItem('resetEmail', correo); // Guarda temporalmente el correo
      navigate('/verify-otp');

    } catch (err) {
      console.error(err);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Recuperar contraseña</h2>
      <input
        type="email"
        placeholder="Ingresa tu correo"
        value={correo}
        onChange={(e) => setCorreo(e.target.value)}
        required
      />
    {error && <p style={{ color: 'red' }}>{error}</p>}

      <button type="submit">Enviar código</button>
    </form>
  );
}

export default ForgotPassword;
