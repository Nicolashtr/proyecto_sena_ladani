import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css';

const Login = () => {
    const navigate = useNavigate();
    const [usuario, setUsuario] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);


    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        // TIP: Para APK/Móvil real, cambia 'localhost' por la IP de tu PC (ej: '192.168.1.10')
        const API_URL = 'http://localhost:8000';

        try {
            const response = await fetch(`${API_URL}/login`, {
                method: 'POST',

                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ usuario, password }),
            });

            const data = await response.json();

            if (response.ok) {
                console.log('User data:', data.user);
                // Save user data for other pages
                localStorage.setItem('user', JSON.stringify(data.user));

                // Redirigir según el rol
                const role = data.user.perfil;
                if (role === 'Administrador') {
                    navigate('/dashboard');
                } else if (role === 'Estilista') {
                    navigate('/estilista');
                } else if (role === 'Vendedor') {
                    navigate('/vendedor');
                } else {
                    navigate('/dashboard');
                }
            } else {
                setError(data.detail || 'Error al iniciar sesión');
            }
        } catch (err) {
            setError('No se pudo conectar con el servidor');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-container">
            <div className="login-card">
                <div className="logo-section">
                    <div className="logo-circle">
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                            <span style={{ fontSize: '20px' }}>👑</span>
                            <span className="logo-text">LD</span>
                        </div>
                    </div>
                </div>

                <h1 className="login-title">Inicia sesión</h1>

                {error && <div className="login-error">{error}</div>}

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Usuario</label>
                        <input
                            type="text"
                            placeholder="Escribe tu número de documento"
                            value={usuario}
                            onChange={(e) => setUsuario(e.target.value)}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>Contraseña</label>
                        <input
                            type="password"
                            placeholder="Escribe tu contraseña"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>

                    <span style={{cursor: "pointer"}} className="forgot-password">¿Olvidaste tu contraseña?</span>                    <div className="button-group">
                        <button type="submit" className="btn btn-continue" disabled={loading}>
                            {loading ? 'Cargando...' : 'Continuar'}
                        </button>
                        <button
                            type="button"
                            className="btn btn-back"
                            onClick={() => navigate('/')}
                        >
                            Volver
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Login;
