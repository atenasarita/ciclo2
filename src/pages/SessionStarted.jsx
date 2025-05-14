import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import '../styles/session-started-styles.css';
import {
  LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer,
  BarChart, Bar, Legend, PieChart, Pie, Cell
} from 'recharts';

const wasteData = [
  { name: 'Jan', waste: 24 },
  { name: 'Feb', waste: 30 },
  { name: 'Mar', waste: 20 },
  { name: 'Apr', waste: 27 },
  { name: 'May', waste: 35 },
  { name: 'Jun', waste: 40 },
];

const disposalStatusData = [
  { name: 'Disposed', value: 265 },
  { name: 'Pending', value: 47 },
];

const COLORS = ['#34d399', '#facc15'];

const translations = {
  en: {
    welcome: 'Welcome, ...!',
    description: 'Efficiently manage hazardous waste and monitor KPIs in real time.',
    logWaste: 'Log Waste',
    dashboard: 'Dashboard',
    account: 'My Account',
    logout: 'Log Out',
    shortcut1: '➕ Log New Waste',
    shortcut1desc: 'Quickly register new entries with smart forms.',
    shortcut2: '📊 KPI Dashboard',
    shortcut2desc: 'Monitor efficiency, compliance, and waste trends.',
    shortcut3: '⚙️ Account Settings',
    shortcut3desc: 'Customize your profile and system preferences.',
    overview: 'Monthly Performance Overview',
    wasteLogged: 'Total Waste Logged',
    pending: 'Pending Disposals',
    compliance: 'Compliance Score',
    time: 'Avg. Processing Time'
  },
  es: {
    welcome: 'Bienvenido, ...!',
    description: 'Gestiona eficientemente residuos peligrosos y monitorea KPIs en tiempo real.',
    logWaste: 'Registrar Residuo',
    dashboard: 'Panel',
    account: 'Mi Cuenta',
    logout: 'Cerrar Sesión',
    shortcut1: '➕ Nuevo Residuo',
    shortcut1desc: 'Registra rápidamente nuevos residuos con formularios inteligentes.',
    shortcut2: '📊 Indicadores Clave',
    shortcut2desc: 'Monitorea eficiencia, cumplimiento y tendencias de residuos.',
    shortcut3: '⚙️ Configuración de Cuenta',
    shortcut3desc: 'Personaliza tu perfil y preferencias del sistema.',
    overview: 'Resumen de Rendimiento Mensual',
    wasteLogged: 'Residuos Registrados',
    pending: 'Disposiciones Pendientes',
    compliance: 'Nivel de Cumplimiento',
    time: 'Tiempo Promedio de Proceso'
  }
};

export default function SessionStarted() {
  const videoRef = useRef(null);
  const [lang, setLang] = useState('en');
  const t = translations[lang];

  useEffect(() => {
    const video = videoRef.current;
    if (video) {
      video.currentTime = 47;
      const handleTimeUpdate = () => {
        if (video.currentTime >= 64) {
          video.currentTime = 47;
        }
      };
      video.addEventListener('timeupdate', handleTimeUpdate);
      return () => video.removeEventListener('timeupdate', handleTimeUpdate);
    }
  }, []);

  return (
    <div className="session-started-screen">
      <video
        ref={videoRef}
        autoPlay
        muted
        loop
        playsInline
        className="session-started-video"
      >
        <source src={process.env.PUBLIC_URL + '/assets/kiak4-unveil-video.mp4'} />
      </video>

      <nav className="session-started-navbar">
        <img
          src={process.env.PUBLIC_URL + '/assets/kia-slogan-blanco.png'}
          alt="KIA logo"
          className="session-started-navbar-logo"
        />
        <ul className="session-started-nav-links">
          <li><button onClick={() => setLang(lang === 'en' ? 'es' : 'en')} className="lang-toggle">{lang === 'en' ? 'ES' : 'EN'}</button></li>
          <li><Link to="/logwaste">{t.logWaste}</Link></li>
          <li><Link to="/dashboard">{t.dashboard}</Link></li>
          <li><Link to="/account">{t.account}</Link></li>
          <li><Link to="/">{t.logout}</Link></li>
        </ul>
      </nav>

      <div className="session-started-content">
        <h1>{t.welcome}</h1>
        <p>{t.description}</p>

        <div className="session-started-cards">
          <Link to="/logwaste" className="session-started-card shortcut">
            <h2>{t.shortcut1}</h2>
            <p>{t.shortcut1desc}</p>
          </Link>
          <Link to="/dashboard" className="session-started-card shortcut">
            <h2>{t.shortcut2}</h2>
            <p>{t.shortcut2desc}</p>
          </Link>
          <Link to="/account" className="session-started-card shortcut">
            <h2>{t.shortcut3}</h2>
            <p>{t.shortcut3desc}</p>
          </Link>
        </div>
      </div>

      <section className="dashboard-section">
        <h2>{t.overview}</h2>
        <div className="dashboard-grid">
          <div className="kpi-widget">
            <h3>{t.wasteLogged}</h3>
            <p>312</p>
            <div className="chart-placeholder">
              <ResponsiveContainer width="100%" height={150}>
                <LineChart data={wasteData}>
                  <Line type="monotone" dataKey="waste" stroke="#38bdf8" strokeWidth={2} />
                  <CartesianGrid stroke="#334155" strokeDasharray="3 3" />
                  <XAxis dataKey="name" stroke="#94a3b8" />
                  <YAxis stroke="#94a3b8" />
                  <Tooltip />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="kpi-widget">
            <h3>{t.pending}</h3>
            <p>47</p>
            <div className="chart-placeholder">
              <ResponsiveContainer width="100%" height={150}>
                <PieChart>
                  <Pie data={disposalStatusData} dataKey="value" nameKey="name" outerRadius={60}>
                    {disposalStatusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="kpi-widget">
            <h3>{t.compliance}</h3>
            <p>96%</p>
            <div className="chart-placeholder">
              <ResponsiveContainer width="100%" height={150}>
                <BarChart data={wasteData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" stroke="#94a3b8" />
                  <YAxis stroke="#94a3b8" />
                  <Tooltip />
                  <Bar dataKey="waste" fill="#60a5fa" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="kpi-widget">
            <h3>{t.time}</h3>
            <p>3.4 hrs</p>
            <div className="chart-placeholder">Trend Prediction (coming soon)</div>
          </div>
        </div>
      </section>
    </div>
  );
}