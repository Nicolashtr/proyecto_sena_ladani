import React from 'react';
import { Link } from 'react-router-dom';
import './Home.css';
import './Login.css'; // Reusing some base styles like logo-circle

const Home = () => {
    return (
        <div className="home-container">
            <div className="home-content">
                <div className="logo-section">
                    <div className="logo-circle">
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                            <span style={{ fontSize: '20px' }}>👑</span>
                            <span className="logo-text">LD</span>
                        </div>
                    </div>
                    <p style={{ color: '#ed4b91', fontStyle: 'italic', marginTop: '-10px' }}>la dani</p>
                </div>

                <h1 className="home-title">la dani</h1>

                <div className="home-button-group">
                    <Link to="/agenda" className="btn-large btn-agenda">
                        Agenda tu cita
                    </Link>
                    <Link to="/login" className="btn-large btn-login-home">
                        Iniciar sesión
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default Home;
