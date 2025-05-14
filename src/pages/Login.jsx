import React, { useRef, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../styles/login-style.css';

export default function Login() {
  const videoRef = useRef(null);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });

  const [error, setError] = useState('');

  useEffect(() => {
    const video = videoRef.current;
    if (video) {
      video.currentTime = 13.1;
      const handleTimeUpdate = () => {
        if (video.currentTime >= 20.5) {
          video.currentTime = 13.1;
        }
      };
      video.addEventListener('timeupdate', handleTimeUpdate);
      return () => {
        video.removeEventListener('timeupdate', handleTimeUpdate);
      };
    }
  }, []);

  const handleChange = e => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async(e) => {
    e.preventDefault();
    const { username, password } = formData;
    console.log("Email enviado al backend:", username);
  
    const response = await fetch("http://localhost:3001/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, password }), 
    });
  
    const data = await response.json(); 
  
    
    console.log("Respuesta del backend:", data.message);
    if (response.ok) {
      alert(data.message); 
      navigate('/sessionstarted');
    } else {
      setError(data.message); 
    }

  };

  return (
    <div className="login-screen">
      <video
        ref={videoRef}
        autoPlay
        muted
        loop
        playsInline
        className="login-screen video"
      >
        <source src={process.env.PUBLIC_URL + '/assets/kiak4-unveil-video.mp4'} />
      </video>

      <div className="login-container">
        <img
          src={process.env.PUBLIC_URL + '/assets/kia-slogan-blanco.png'}
          alt="KIA logo"
        />

      <div className="login-wrapper">
        <div className="login-left-section">
          <h1>Welcome Back!</h1>
          <p>Don’t have an account yet? <Link to="/signup">Sign Up</Link></p>
        </div>

        <div className="login-right-section">
          <form onSubmit={handleSubmit}>
            <label>Username</label>
            <input type="text" className="field" name="username" value={formData.username} onChange={handleChange} />

            <label>Password</label>
            <input type="password" className="field" name="password" value={formData.password} onChange={handleChange} />

            {error && <p className="login-error-message">{error}</p>}

            <button type="submit">Log In</button>
          </form>
        </div>
      </div>
      </div>
    </div>
  );
}
