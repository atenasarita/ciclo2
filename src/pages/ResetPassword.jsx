import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function ResetPassword() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');

  const navigate = useNavigate();
  const email = sessionStorage.getItem('resetEmail');

  const handleReset = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setError('Las contraseñas no coinciden.');
      setPassword('');
      setConfirmPassword('');   
      return;
    }

    try {
      const res = await fetch('http://localhost:3001/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error); // ✅ Muestra mensaje del backend
        return;
      }

      alert('Contraseña actualizada correctamente');
      sessionStorage.removeItem('resetEmail');
      navigate('/login');

    } catch (err) {
      console.err('Error recibido:', err.message);
    }
  };

  return (
    <form onSubmit={handleReset}>
      <h2>Restablecer contraseña</h2>
      <input
        type="password"
        placeholder="Nueva contraseña"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />
      <input
        type="password"
        placeholder="Confirmar contraseña"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
        required
      />

{error && <p style={{ color: 'red' }}>{error}</p>}


      <button type="submit">Actualizar contraseña</button>
    </form>
  );
}

export default ResetPassword;
