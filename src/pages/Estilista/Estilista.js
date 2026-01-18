import React, { useState, useEffect } from 'react';
import './Estilista.css';

const Estilista = () => {
    const [activeTab, setActiveTab] = useState('pending'); // 'pending' or 'completed'
    const [userData, setUserData] = useState({ nombre: 'Estilista' });
    const [services, setServices] = useState([]);
    const [selectedService, setSelectedService] = useState(null);
    const [loading, setLoading] = useState(true);

    const todayDateStr = new Date().toISOString().split('T')[0]; // YYYY-MM-DD

    const todayDisplay = new Date().toLocaleDateString('es-ES', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
    });

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            setUserData(JSON.parse(storedUser));
        }
        fetchCitas();
    }, []);

    const fetchCitas = async () => {
        setLoading(true);
        try {
            const response = await fetch('http://localhost:8000/citas');
            if (response.ok) {
                const data = await response.json();
                // Opcional: Filtrar solo las de hoy si se prefiere
                // const filtered = data.filter(c => c.fecha === todayDateStr);
                setServices(data);

                // Si no hay seleccionado, elegir el primero de los pendientes
                if (!selectedService) {
                    const pending = data.filter(s => s.estado === 'Pendiente');
                    if (pending.length > 0) setSelectedService(pending[0]);
                }
            }
        } catch (error) {
            console.error('Error fetching citas:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleFinish = async () => {
        if (!selectedService) return;
        try {
            const response = await fetch(`http://localhost:8000/citas/${selectedService.id}/finalizar`, {
                method: 'PUT'
            });
            if (response.ok) {
                alert('Servicio finalizado con éxito');
                fetchCitas();
                setSelectedService(null);
            }
        } catch (error) {
            alert('Error al finalizar el servicio');
        }
    };

    const pendingServices = services.filter(s => s.estado === 'Pendiente');
    const completedServices = services.filter(s => s.estado === 'Finalizado');

    const displayedServices = activeTab === 'pending' ? pendingServices : completedServices;

    const totalRevenue = displayedServices.reduce((acc, curr) => acc + (curr.costo || 0), 0);

    return (
        <div className="estilista-container">
            <header className="estilista-header">
                <div className="header-left">
                    <h2>¡Hola, {userData.nombre}!</h2>
                    <p>Estilista</p>
                </div>
                <div className="header-right">
                    <span className="date-text">{todayDisplay}</span>
                    <div className="user-avatar-circle">👤</div>
                </div>
            </header>

            <main className="estilista-main">
                <aside className="services-sidebar">
                    <h3>Servicios</h3>
                    <p className="sidebar-subtitle">
                        {activeTab === 'pending' ? 'Pendientes por realizar' : 'Servicios ya realizados'}
                    </p>

                    {loading ? (
                        <p style={{ color: 'white', textAlign: 'center' }}>Cargando...</p>
                    ) : (
                        displayedServices.map(ser => (
                            <div
                                key={ser.id}
                                className={`service-card ${selectedService?.id === ser.id ? 'active-card-detail' : ''}`}
                                onClick={() => setSelectedService(ser)}
                                style={selectedService?.id === ser.id ? { border: '2px solid white', backgroundColor: '#fce4ec' } : {}}
                            >
                                <h4>Servicio: {ser.servicio}</h4>
                                <p>Costo: ${ser.costo.toLocaleString()}</p>
                                <p>Fecha y hora: {ser.fecha} - {ser.hora}</p>
                            </div>
                        ))
                    )}

                    <div className="total-cost-box">
                        Costo total de los servicios {activeTab === 'pending' ? 'por realizar' : 'realizados'}:<br />
                        ${totalRevenue.toLocaleString()}
                    </div>
                </aside>

                <section className="service-detail-view">
                    {selectedService ? (
                        <>
                            <h1 className="detail-title">{selectedService.estado === 'Pendiente' ? 'Servicio en curso' : 'Servicio Completado'}</h1>

                            <div className="detail-info-group">
                                <div className="icon-box">✂️</div>
                                <div>
                                    <div className="info-label">Procedimiento</div>
                                    <div className="info-value">{selectedService.servicio}</div>
                                </div>
                            </div>

                            <div className="detail-info-group">
                                <div className="icon-box">🕒</div>
                                <div>
                                    <div className="info-label">Hora programada</div>
                                    <div className="info-value">{selectedService.hora}</div>
                                </div>
                            </div>

                            <div className="detail-info-group">
                                <div className="icon-box">👤</div>
                                <div>
                                    <div className="info-label">Nombre del cliente</div>
                                    <div className="info-value">{selectedService.nombre}</div>
                                </div>
                            </div>

                            <div className="detail-info-group">
                                <div className="icon-box">💰</div>
                                <div>
                                    <div className="info-label">Valor del servicio</div>
                                    <div className="info-value">${selectedService.costo.toLocaleString()}</div>
                                </div>
                            </div>

                            {selectedService.estado === 'Pendiente' && (
                                <button className="btn-finish" onClick={handleFinish}>finalizar servicio</button>
                            )}
                        </>
                    ) : (
                        <p>{loading ? 'Buscando servicios...' : 'No hay servicios seleccionados'}</p>
                    )}
                </section>
            </main>

            <footer className="estilista-footer">
                <button
                    className={`footer-btn ${activeTab === 'pending' ? 'active' : ''}`}
                    onClick={() => setActiveTab('pending')}
                >
                    <span>🕒</span> Servicios por realizar
                </button>
                <button
                    className={`footer-btn ${activeTab === 'completed' ? 'active' : ''}`}
                    onClick={() => setActiveTab('completed')}
                >
                    <span>✂️</span> Servicios realizados
                </button>
            </footer>

            <div className="logout-btn-est" onClick={() => window.location.href = '/'}>
                🚪
            </div>
        </div>
    );
};

export default Estilista;
