import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Swal from 'sweetalert2';
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
        hora: '',
        descripcion: '',
        imagen_referencia: ''
    });
    const [loading, setLoading] = useState(false);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setFormData({
                    ...formData,
                    imagen_referencia: reader.result
                });
            };
            reader.readAsDataURL(file);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;



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
                Swal.fire({
                    title: '¡Éxito!',
                    text: '¡Cita reservada con éxito!',
                    icon: 'success',
                    confirmButtonColor: '#ed4b91'
                });
                setFormData({ nombre: '', telefono: '', servicio: '', fecha: '', hora: '', descripcion: '', imagen_referencia: '' });
            } else {
                Swal.fire({
                    title: 'Error',
                    text: 'Error al reservar la cita. Por favor intenta de nuevo.',
                    icon: 'error',
                    confirmButtonColor: '#ed4b91'
                });
            }
        } catch (error) {
            Swal.fire({
                title: 'Error de Conexión',
                text: 'No se pudo conectar con el servidor.',
                icon: 'error',
                confirmButtonColor: '#ed4b91'
            });
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
                    <select
                        name="hora"
                        value={formData.hora}
                        onChange={handleChange}
                        required
                    >
                        <option value="" disabled>Selecciona una hora</option>
                        <option value="09:00">09:00 AM</option>
                        <option value="09:30">09:30 AM</option>
                        <option value="10:00">10:00 AM</option>
                        <option value="10:30">10:30 AM</option>
                        <option value="11:00">11:00 AM</option>
                        <option value="11:30">11:30 AM</option>
                        <option value="12:00">12:00 PM</option>
                        <option value="12:30">12:30 PM</option>
                        <option value="13:00">01:00 PM</option>
                        <option value="13:30">01:30 PM</option>
                        <option value="14:00">02:00 PM</option>
                        <option value="14:30">02:30 PM</option>
                        <option value="15:00">03:00 PM</option>
                        <option value="15:30">03:30 PM</option>
                        <option value="16:00">04:00 PM</option>
                        <option value="16:30">04:30 PM</option>
                        <option value="17:00">05:00 PM</option>
                        <option value="17:30">05:30 PM</option>
                        <option value="18:00">06:00 PM</option>
                        <option value="18:30">06:30 PM</option>
                        <option value="19:00">07:00 PM</option>
                    </select>

                    <textarea
                        name="descripcion"
                        placeholder="Descripción de lo que deseas (Ej: Quiero unas uñas acrílicas con diseño...)"
                        value={formData.descripcion}
                        onChange={handleChange}
                        style={{ width: '100%', padding: '12px', borderRadius: '15px', border: 'none', marginBottom: '10px', minHeight: '80px', fontFamily: 'inherit', boxSizing: 'border-box' }}
                    />
                    <div style={{ marginBottom: '15px', textAlign: 'left', width: '100%', background: 'white', padding: '10px', borderRadius: '15px', boxSizing: 'border-box' }}>
                        <label style={{ fontSize: '14px', color: '#888', marginBottom: '5px', display: 'block' }}>Imagen de referencia (Opcional):</label>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageChange}
                            style={{ width: '100%', border: 'none', background: 'transparent', padding: '0' }}
                        />
                    </div>

                    <button type="submit" className="btn-submit-agenda" disabled={loading}>
                        {loading ? 'Reservando...' : 'Reservar cita'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Agenda;
