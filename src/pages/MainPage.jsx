import React, { useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../styles/main-style.css';

export default function MainPage() {
  const videoRef = useRef(null);

  useEffect(() => {
    const video = videoRef.current;

    if (video) {
      video.currentTime = 3.9;

      const handleTimeUpdate = () => {
        if (video.currentTime >= 10.8) {
          video.currentTime = 3.9;
        }
      };

      video.addEventListener('timeupdate', handleTimeUpdate);

      return () => {
        video.removeEventListener('timeupdate', handleTimeUpdate);
      };
    }
  }, []);

  return (
    <div className="main-screen">
      <video
        ref={videoRef}
        autoPlay
        muted
        loop
        playsInline
        className="main-screen-video"
      >
        <source src={process.env.PUBLIC_URL + '/assets/kiak4-unveil-video.mp4'} />
      </video>

      <div className="main-screen-container">
        <img
          src={process.env.PUBLIC_URL + '/assets/kia-slogan-blanco.png'}
          alt="KIA logo"
        />
        <h1 className="main-screen-home-title">Waste Management</h1>

        <Link to="/login">
          <button>Log In</button>
        </Link>
        <Link to="/signup">
          <button>Sign Up</button>
        </Link>
      </div>
    </div>
  );
}