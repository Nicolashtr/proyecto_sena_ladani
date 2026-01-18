import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Agenda.css';
import './Login.css';

const Agenda = () => {
    // Obtener la fecha de hoy en formato YYYY-MM-DD
    const today = new Date().toISOString().split('T')[0];

    const [formData, setFormData] = useState({
        nombre: '',
        telefono: '',
        servicio: '',
        fecha: today, // Fecha por defecto: hoy
        hora: ''
    });
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;

        // Validación de rango de hora (9 AM a 7 PM)
        if (name === 'hora') {
            const hour = parseInt(value.split(':')[0]);
            if (hour < 9 || hour >= 19) {
                alert('Lo sentimos, solo atendemos de 9:00 AM a 7:00 PM.');
                return;
            }
        }

        setFormData({
            ...formData,
            [name]: value
        });
    };


    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const response = await fetch('http://localhost:8000/agenda', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            if (response.ok) {
                alert('¡Cita reservada con éxito!');
                setFormData({ nombre: '', telefono: '', servicio: '', fecha: '', hora: '' });
            } else {
                alert('Error al reservar la cita. Por favor intenta de nuevo.');
            }
        } catch (error) {
            alert('No se pudo conectar con el servidor.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="agenda-container">
            <div className="top-nav">
                <Link to="/login" className="btn-small-login">Iniciar sesión</Link>
            </div>

            <div className="agenda-content">
                <div className="logo-section" style={{ marginBottom: '10px' }}>
                    <div className="logo-circle">
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                            <span style={{ fontSize: '20px' }}>👑</span>
                            <span className="logo-text">LD</span>
                        </div>
                    </div>
                </div>

                <h1 className="agenda-title">Agenda tu cita</h1>

                <form className="agenda-form" onSubmit={handleSubmit}>
                    <input
                        type="text"
                        name="nombre"
                        placeholder="Nombre completo"
                        value={formData.nombre}
                        onChange={handleChange}
                        required
                    />
                    <input
                        type="tel"
                        name="telefono"
                        placeholder="Teléfono"
                        value={formData.telefono}
                        onChange={handleChange}
                        required
                    />
                    <select
                        name="servicio"
                        value={formData.servicio}
                        onChange={handleChange}
                        required
                    >
                        <option value="" disabled>Servicio</option>
                        <option value="unas">Uñas</option>
                        <option value="cabello">Cabello</option>
                        <option value="maquillaje">Maquillaje</option>
                        <option value="pestanas">Pestañas</option>
                    </select>
                    <input
                        type="date"
                        name="fecha"
                        placeholder="Fecha"
                        min={today}
                        value={formData.fecha}
                        onChange={handleChange}
                        required
                    />
                    <input
                        type="time"
                        name="hora"
                        placeholder="Hora"
                        min="09:00"
                        max="19:00"
                        value={formData.hora}
                        onChange={handleChange}
                        required
                    />

                    <button type="submit" className="btn-submit-agenda" disabled={loading}>
                        {loading ? 'Reservando...' : 'Reservar cita'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Agenda;
