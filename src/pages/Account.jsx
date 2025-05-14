import { useState } from 'react';
import { Link } from 'react-router-dom';
import '../styles/account-styles.css';

export default function Account() {
  const [editable, setEditable] = useState(false);
  const [form, setForm] = useState({
    name: 'Jane',
    lastname: 'Doe',
    username: 'N00727400',
    password: '********'
  });

  const handleChange = (e) => {
    const { id, value } = e.target;
    setForm((prev) => ({ ...prev, [id]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setEditable(false);
  };

  return (
    <div className='account-page'>
      <Link to="/sessionstarted">
        <img
          className='go-back-btn'
          src={process.env.PUBLIC_URL + '/assets/go-back.png'}
          alt="Volver"
        />
      </Link>

      <div className="account-container">
        <h1>Mi Perfil</h1>
        <form className={`account-form ${editable ? 'editable' : ''}`} onSubmit={handleSubmit}>
          {['name', 'lastname', 'username', 'password'].map((field) => (
            <div className="form-field" key={field}>
              <label htmlFor={field}>{field.charAt(0).toUpperCase() + field.slice(1)}</label>
              <input
                type={field === 'password' ? 'password' : 'text'}
                id={field}
                value={form[field]}
                onChange={handleChange}
                disabled={!editable}
              />
            </div>
          ))}

          {editable && <button type="submit" className="btn save-btn">Guardar Cambios</button>}
        </form>

        {!editable && (
          <button className="btn edit-btn" onClick={() => setEditable(true)}>
            Editar Información
          </button>
        )}

        <Link to="/">
          <button id="logout-btn">Cerrar Sesión</button>
        </Link>
      </div>
    </div>
  );
}