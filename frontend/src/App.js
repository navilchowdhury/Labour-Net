import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Jobs from './pages/Jobs';
import Profile from './pages/Profile';
import WorkerSearch from './pages/WorkerSearch';
import WorkerApplicationsView from './components/WorkerApplicationsView';
import EmployerJobsView from './components/EmployerJobsView';
import ShiftScheduling from './components/ShiftScheduling';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/jobs" element={<Jobs />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/worker-search" element={<WorkerSearch />} />
          <Route path="/applications" element={<WorkerApplicationsView />} />
          <Route path="/my-jobs" element={<EmployerJobsView />} />
          <Route path="/schedule" element={<ShiftScheduling />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
