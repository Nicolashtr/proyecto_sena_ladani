import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import Home from './pages/Home/Home';
import Login from './pages/Login/Login';
import Agenda from './pages/Agenda/Agenda';
import Dashboard from './pages/Admin/administrador';
import Estilista from './pages/Estilista/Estilista';
import Vendedor from './pages/Vendedor/Vendedor';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/agenda" element={<Agenda />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/estilista" element={<Estilista />} />
          <Route path="/vendedor" element={<Vendedor />} />
        </Routes>
      </div>
    </Router>
  );
}


export default App;


