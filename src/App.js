import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import MainPage           from './pages/MainPage';
import Login          from './pages/Login';
import SignUp         from './pages/Signup';
import Dashboard      from './pages/Dashboard';
import SessionStarted from './pages/SessionStarted';
import Admin          from './pages/Admin';
import Account        from './pages/Account';
import LogWaste        from './pages/LogWaste';
import HistoryView        from './pages/HistoryView';
import '../src/App.css';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/"           element={<MainPage />} />
        <Route path="/login"      element={<Login />} />
        <Route path="/signup"     element={<SignUp />} />
        <Route path="/dashboard"  element={<Dashboard />} />
        <Route path="/sessionstarted" element={<SessionStarted />} />
        <Route path="/admin"      element={<Admin />} />
        <Route path="/account"    element={<Account />} />
        <Route path="/logwaste"    element={<LogWaste />} />
        <Route path="/historyview"    element={<HistoryView />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;