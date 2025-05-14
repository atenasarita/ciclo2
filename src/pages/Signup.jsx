import React, { useRef, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../styles/signup-style.css';

export default function Signup() {
  const videoRef = useRef(null);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    surname1: '',
    surname2: '',
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState('');

  useEffect(() => {
    const video = videoRef.current;
    if (video) {
      video.currentTime = 20.9;
      const handleTimeUpdate = () => {
        if (video.currentTime >= 29.3) {
          video.currentTime = 20.9;
        }
      };
      video.addEventListener('timeupdate', handleTimeUpdate);
      return () => video.removeEventListener('timeupdate', handleTimeUpdate);
    }
  }, []);

  const handleChange = e => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  const handleSubmit = e => {
    e.preventDefault();
    const { name, surname1, surname2, username, email, password, confirmPassword } = formData;
    if (!name || !surname1 || !surname2 || !username || !email || !password || !confirmPassword) {
      setError('Please fill in all fields.');
    } else if (password !== confirmPassword) {
      setError("Passwords don't match.");
    } else {
      setError('');
      alert('Form submitted successfully!');
      navigate('/login');
    }
  };

  return (
    <div className="signup-screen">
      <video
        ref={videoRef}
        autoPlay
        muted
        loop
        playsInline
        className="signup-screen video"
      >
        <source src={process.env.PUBLIC_URL + '/assets/kiak4-unveil-video.mp4'} />
      </video>

      <div className="signup-container">
        <img
          src={process.env.PUBLIC_URL + '/assets/kia-slogan-blanco.png'}
          alt="KIA logo"
        />

      <div className="signup-wrapper">
        <div className="signup-left-section">
          <h1>Create Account</h1>
          <p>Already have an account? <Link to="/login">Log In</Link></p>
        </div>

        <div className="signup-right-section">
          <form onSubmit={handleSubmit}>
            <label>Name(s)</label>
            <input id="name" type="text" className="field" value={formData.name} onChange={handleChange} />

            <label>First Surname</label>
            <input id="surname1" type="text" className="field" value={formData.surname1} onChange={handleChange} />

            <label>Second Surname</label>
            <input id="surname2" type="text" className="field" value={formData.surname2} onChange={handleChange} />

            <label>Username</label>
            <input id="username" type="text" className="field" value={formData.username} onChange={handleChange} />

            <label>Email</label>
            <input id="email" type="email" className="field" value={formData.email} onChange={handleChange} />

            <label>Password</label>
            <input id="password" type="password" className="field" value={formData.password} onChange={handleChange} />

            <label>Confirm Password</label>
            <input id="confirmPassword" type="password" className="field" value={formData.confirmPassword} onChange={handleChange} />

            {error && <p className="signup-error-message">{error}</p>}

            <button type="submit">Sign Up</button>
          </form>
        </div>
      </div>
      </div>
    </div>
  );
}