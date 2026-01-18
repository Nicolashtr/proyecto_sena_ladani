import React, { useState, useEffect } from 'react';
import './Vendedor.css';

const Vendedor = () => {
    const [activeModule, setActiveModule] = useState('agenda'); // 'agenda', 'factura', 'reprogramar', 'reporte', 'clientes'
    const [userData, setUserData] = useState({ nombre: 'Vendedor' });
    const [citas, setCitas] = useState([]);
    const [facturas, setFacturas] = useState([]);
    const [clientes, setClientes] = useState([]);
    const [selectedCita, setSelectedCita] = useState(null);
    const [showFacturaModal, setShowFacturaModal] = useState(false);
    const [showClienteModal, setShowClienteModal] = useState(false);
    const [selectedCliente, setSelectedCliente] = useState(null);

    const [facturaData, setFacturaData] = useState({
        nombre_cliente: '',
        cedula_cliente: '',
        valor: '',
        metodo_pago: 'Efectivo',
        tipo_servicio: ''
    });

    const [clienteData, setClienteData] = useState({
        id_cliente: '',
        nombre_cliente: '',
        apellido: '',
        numero_celular: '',
        direccion: '',
        correo: ''
    });

    const [editData, setEditData] = useState({
        servicio: '',
        fecha: '',
        hora: '',
        estilista: '',
        costo: ''
    });

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
        fetchFacturas();
        fetchClientes();
    }, []);

    const fetchClientes = async () => {
        try {
            const response = await fetch('http://localhost:8000/clientes');
            if (response.ok) {
                const data = await response.json();
                setClientes(data);
            }
        } catch (error) { console.error(error); }
    };

    const handleSaveCliente = async (e) => {
        e.preventDefault();
        const method = selectedCliente ? 'PUT' : 'POST';
        const url = selectedCliente
            ? `http://localhost:8000/clientes/${clienteData.id_cliente}`
            : 'http://localhost:8000/clientes';

        try {
            // Ensure id_cliente is a number for the backend
            const submissionData = {
                ...clienteData,
                id_cliente: parseInt(clienteData.id_cliente)
            };

            const response = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(submissionData)
            });

            if (response.ok) {
                alert(selectedCliente ? 'Cliente actualizado' : 'Cliente registrado');
                setShowClienteModal(false);
                fetchClientes();
            } else {
                const errData = await response.json();
                console.error('Server error:', errData);
                alert('Error del servidor: ' + (errData.detail || 'No se pudo guardar'));
            }
        } catch (error) {
            console.error('Fetch error:', error);
            alert('Error de conexión con el servidor');
        }
    };

    const handleDeleteCliente = async (id) => {
        if (!window.confirm('¿Eliminar este cliente?')) return;
        try {
            await fetch(`http://localhost:8000/clientes/${id}`, { method: 'DELETE' });
            fetchClientes();
        } catch (error) { alert('Error al eliminar'); }
    };

    const handleEditCliente = (cli) => {
        setSelectedCliente(cli);
        setClienteData(cli);
        setShowClienteModal(true);
    };

    const fetchFacturas = async () => {
        try {
            const response = await fetch('http://localhost:8000/facturas');
            if (response.ok) {
                const data = await response.json();
                setFacturas(data);
            }
        } catch (error) {
            console.error('Error fetching facturas:', error);
        }
    };

    const fetchCitas = async () => {
        try {
            const response = await fetch('http://localhost:8000/citas');
            if (response.ok) {
                const data = await response.json();
                setCitas(data);
            }
        } catch (error) {
            console.error('Error fetching citas:', error);
        }
    };

    const handleSelectCita = (cita) => {
        setSelectedCita(cita);
        setEditData({
            servicio: cita.servicio || '',
            fecha: cita.fecha || '',
            hora: cita.hora || '',
            estilista: cita.estilista || '',
            costo: cita.costo || ''
        });
        setFacturaData({
            ...facturaData,
            nombre_cliente: cita.nombre,
            tipo_servicio: cita.servicio,
            valor: cita.costo
        });
    };

    const handleUpdateCita = async (e) => {
        e.preventDefault();
        try {
            const updateBody = { ...editData, estado: 'Confirmada' };
            const response = await fetch(`http://localhost:8000/citas/${selectedCita.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updateBody)
            });
            if (response.ok) {
                alert('Cita confirmada y actualizada');
                setSelectedCita(null);
                fetchCitas();
            }
        } catch (error) {
            alert('Error al actualizar');
        }
    };

    const handleWhatsApp = () => {
        if (!selectedCita) return;
        const msg = `Hola ${selectedCita.nombre}, te confirmamos tu cita para ${selectedCita.servicio} el día ${editData.fecha} a las ${editData.hora}. ¡Te esperamos!`;
        const url = `https://wa.me/${selectedCita.telefono}?text=${encodeURIComponent(msg)}`;
        window.open(url, '_blank');
    };

    const handleFacturar = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('http://localhost:8000/facturas', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...facturaData,
                    vendedor: userData.nombre
                })
            });
            if (response.ok) {
                alert('Factura generada correctamente');
                setShowFacturaModal(false);
                fetchFacturas();
                setFacturaData({
                    nombre_cliente: '', cedula_cliente: '', valor: '', metodo_pago: 'Efectivo', tipo_servicio: ''
                });
            }
        } catch (error) {
            alert('Error al generar factura');
        }
    };

    return (
        <div className="vendedor-container">
            {showFacturaModal && (
                <div className="modal-overlay">
                    <div className="modal-content" style={{ maxWidth: '500px' }}>
                        <h2 className="section-title">Generar Factura</h2>
                        <form className="vendedor-form" onSubmit={handleFacturar}>
                            <div className="form-field">
                                <label>Nombre del Cliente</label>
                                <input value={facturaData.nombre_cliente} onChange={e => setFacturaData({ ...facturaData, nombre_cliente: e.target.value })} required />
                            </div>
                            <div className="form-field">
                                <label>Cédula</label>
                                <input value={facturaData.cedula_cliente} onChange={e => setFacturaData({ ...facturaData, cedula_cliente: e.target.value })} required />
                            </div>
                            <div className="form-field">
                                <label>Tipo de Servicio</label>
                                <input
                                    list="servicios-pre"
                                    value={facturaData.tipo_servicio}
                                    onChange={e => setFacturaData({ ...facturaData, tipo_servicio: e.target.value })}
                                    required
                                    placeholder="Escribe o selecciona..."
                                />
                                <datalist id="servicios-pre">
                                    <option value="Corte de Cabello" />
                                    <option value="Tintura Global" />
                                    <option value="Manicura Permanente" />
                                    <option value="Pedicura Spa" />
                                    <option value="Peinado Gala" />
                                </datalist>
                            </div>
                            <div className="form-field">
                                <label>Valor ($)</label>
                                <input type="number" value={facturaData.valor} onChange={e => setFacturaData({ ...facturaData, valor: e.target.value })} required />
                            </div>
                            <div className="form-field">
                                <label>Método de Pago</label>
                                <select value={facturaData.metodo_pago} onChange={e => setFacturaData({ ...facturaData, metodo_pago: e.target.value })}>
                                    <option>Efectivo</option>
                                    <option>Transferencia</option>
                                    <option>Tarjeta</option>
                                </select>
                            </div>
                            <div style={{ display: 'flex', gap: '10px' }}>
                                <button type="submit" className="btn-action" style={{ flex: 1 }}>Facturar</button>
                                <button type="button" className="btn-action" style={{ background: '#999', flex: 1 }} onClick={() => setShowFacturaModal(false)}>Cancelar</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {showClienteModal && (
                <div className="modal-overlay">
                    <div className="modal-content" style={{ maxWidth: '600px' }}>
                        <h2 className="section-title">{selectedCliente ? 'Editar Cliente' : 'Nuevo Cliente'}</h2>
                        <form className="vendedor-form" onSubmit={handleSaveCliente}>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                                <div className="form-field">
                                    <label>Cédula (ID)</label>
                                    <input type="number" value={clienteData.id_cliente} onChange={e => setClienteData({ ...clienteData, id_cliente: e.target.value })} disabled={!!selectedCliente} required />
                                </div>
                                <div className="form-field">
                                    <label>Nombre</label>
                                    <input value={clienteData.nombre_cliente} onChange={e => setClienteData({ ...clienteData, nombre_cliente: e.target.value })} required />
                                </div>
                                <div className="form-field">
                                    <label>Apellido</label>
                                    <input value={clienteData.apellido} onChange={e => setClienteData({ ...clienteData, apellido: e.target.value })} required />
                                </div>
                                <div className="form-field">
                                    <label>Celular</label>
                                    <input value={clienteData.numero_celular} onChange={e => setClienteData({ ...clienteData, numero_celular: e.target.value })} required />
                                </div>
                                <div className="form-field" style={{ gridColumn: 'span 2' }}>
                                    <label>Dirección</label>
                                    <input value={clienteData.direccion} onChange={e => setClienteData({ ...clienteData, direccion: e.target.value })} />
                                </div>
                                <div className="form-field" style={{ gridColumn: 'span 2' }}>
                                    <label>Correo</label>
                                    <input type="email" value={clienteData.correo} onChange={e => setClienteData({ ...clienteData, correo: e.target.value })} />
                                </div>
                            </div>
                            <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
                                <button type="submit" className="btn-action" style={{ flex: 1 }}>Guardar</button>
                                <button type="button" className="btn-action" style={{ background: '#999', flex: 1 }} onClick={() => setShowClienteModal(false)}>Cancelar</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            <header className="vendedor-header">
                <div className="header-left">
                    <h2>¡Hola, {userData.nombre}!</h2>
                    <p>Vendedor</p>
                </div>
                <div className="header-right">
                    <span className="date-text">{todayDisplay}</span>
                    <div className="user-avatar-circle">👤</div>
                </div>
            </header>

            <main className="vendedor-main">
                <aside className="vendedor-sidebar">
                    <button
                        className={`sidebar-btn ${activeModule === 'agenda' ? 'active' : ''}`}
                        onClick={() => { setActiveModule('agenda'); setSelectedCita(null); }}
                    >
                        <span className="sidebar-btn-icon">📅</span>
                        <span>Agendar servicio</span>
                    </button>
                    <button className="sidebar-btn" onClick={() => setShowFacturaModal(true)}>
                        <span className="sidebar-btn-icon">🧾</span>
                        <span>Realizar factura del servicio</span>
                    </button>
                    <button
                        className={`sidebar-btn ${activeModule === 'clientes' ? 'active' : ''}`}
                        onClick={() => { setActiveModule('clientes'); setSelectedCita(null); }}
                    >
                        <span className="sidebar-btn-icon">👥</span>
                        <span>Gestión de Clientes</span>
                    </button>
                    <button
                        className={`sidebar-btn ${activeModule === 'reprogramar' ? 'active' : ''}`}
                        onClick={() => { setActiveModule('reprogramar'); setSelectedCita(null); }}
                    >
                        <span className="sidebar-btn-icon">🕒</span>
                        <span>Reprogramar cita</span>
                    </button>
                    <button className={`sidebar-btn ${activeModule === 'reporte' ? 'active' : ''}`} onClick={() => { setActiveModule('reporte'); setSelectedCita(null); }}>
                        <span className="sidebar-btn-icon">💰</span>
                        <span>Reporte de Ventas</span>
                    </button>
                </aside>

                <section className="vendedor-content">
                    {activeModule === 'clientes' && (
                        <>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                                <h2 className="section-title" style={{ margin: 0 }}>Gestión de Clientes</h2>
                                <button
                                    className="btn-action"
                                    style={{ width: 'auto', padding: '10px 20px' }}
                                    onClick={() => { setSelectedCliente(null); setClienteData({ id_cliente: '', nombre_cliente: '', apellido: '', numero_celular: '', direccion: '', correo: '' }); setShowClienteModal(true); }}
                                >
                                    + Nuevo Cliente
                                </button>
                            </div>
                            <div className="queue-list">
                                {clientes.map(cli => (
                                    <div key={cli.id_cliente} className="queue-item" style={{ cursor: 'default' }}>
                                        <div className="queue-info">
                                            <h4>{cli.nombre_cliente} {cli.apellido}</h4>
                                            <p><strong>Cédula:</strong> {cli.id_cliente}</p>
                                            <p><strong>Celular:</strong> {cli.numero_celular}</p>
                                            <p><strong>Correo:</strong> {cli.correo}</p>
                                        </div>
                                        <div style={{ display: 'flex', gap: '10px' }}>
                                            <button className="btn-mini btn-edit" onClick={() => handleEditCliente(cli)}>Editar</button>
                                            <button className="btn-mini btn-delete" onClick={() => handleDeleteCliente(cli.id_cliente)}>Eliminar</button>
                                        </div>
                                    </div>
                                ))}
                                {clientes.length === 0 && <p style={{ textAlign: 'center' }}>No hay clientes registrados</p>}
                            </div>
                        </>
                    )}

                    {(activeModule === 'agenda' || activeModule === 'reprogramar') && (
                        <>
                            <h2 className="section-title">
                                {activeModule === 'agenda' ? 'Cola de espera (Nuevas Citas)' : 'Citas Confirmadas por Reprogramar'}
                            </h2>

                            {!selectedCita ? (
                                <div className="queue-list">
                                    {citas.filter(c =>
                                        activeModule === 'agenda'
                                            ? (c.estado === 'Pendiente' || !c.estado)
                                            : (c.estado === 'Confirmada')
                                    ).map(cita => (
                                        <div key={cita.id} className="queue-item" onClick={() => handleSelectCita(cita)}>
                                            <div className="queue-info">
                                                <h4>{cita.nombre}</h4>
                                                <p><strong>Servicio:</strong> {cita.servicio}</p>
                                                <p><strong>Fecha/Hora:</strong> {cita.fecha} - {cita.hora}</p>
                                                {activeModule === 'reprogramar' && <p><strong>Estilista:</strong> {cita.estilista}</p>}
                                            </div>
                                            <div className="sidebar-btn-icon">➡️</div>
                                        </div>
                                    ))}
                                    {citas.filter(c =>
                                        activeModule === 'agenda'
                                            ? (c.estado === 'Pendiente' || !c.estado)
                                            : (c.estado === 'Confirmada')
                                    ).length === 0 && <p style={{ textAlign: 'center' }}>No hay citas en esta sección</p>}
                                </div>
                            ) : (
                                <div className="vendedor-form-container">
                                    <button onClick={() => setSelectedCita(null)} style={{ background: 'none', border: 'none', color: '#ed4b91', cursor: 'pointer', marginBottom: '15px', fontWeight: 'bold' }}>⬅️ Volver a la selección de cita</button>
                                    <h3 style={{ color: '#ed4b91', marginBottom: '20px' }}>
                                        {activeModule === 'agenda' ? 'Confirmar Nueva Cita' : 'Reprogramar Cita de'} {selectedCita.nombre}
                                    </h3>

                                    <form className="vendedor-form" onSubmit={handleUpdateCita}>
                                        <div className="form-field">
                                            <label>Tipo de servicio</label>
                                            <input value={editData.servicio} onChange={e => setEditData({ ...editData, servicio: e.target.value })} />
                                        </div>
                                        <div className="form-field">
                                            <label>Fecha</label>
                                            <input type="date" value={editData.fecha} onChange={e => setEditData({ ...editData, fecha: e.target.value })} />
                                        </div>
                                        <div className="form-field">
                                            <label>Hora</label>
                                            <input type="time" value={editData.hora} onChange={e => setEditData({ ...editData, hora: e.target.value })} />
                                        </div>
                                        <div className="form-field">
                                            <label>Estilista asignado</label>
                                            <input placeholder="Nombre del estilista" value={editData.estilista} onChange={e => setEditData({ ...editData, estilista: e.target.value })} />
                                        </div>
                                        <div className="form-field">
                                            <label>Valor del servicio ($)</label>
                                            <input type="number" value={editData.costo} onChange={e => setEditData({ ...editData, costo: e.target.value })} />
                                        </div>

                                        <button type="submit" className="btn-action">
                                            {activeModule === 'agenda' ? 'Agendar y Confirmar Cita' : 'Guardar Reprogramación'}
                                        </button>
                                        <button type="button" className="btn-whatsapp" onClick={handleWhatsApp}>
                                            Notificar cambio por WhatsApp 📱
                                        </button>
                                    </form>
                                </div>
                            )}
                        </>
                    )}


                    {activeModule === 'reporte' && (
                        <>
                            <h2 className="section-title">Reporte de Ventas del Día</h2>
                            <div className="total-cost-box" style={{ marginBottom: '20px', padding: '20px', fontSize: '18px' }}>
                                Total Facturado: ${facturas.reduce((acc, f) => acc + (f.valor || 0), 0).toLocaleString()}
                            </div>

                            <div className="queue-list" style={{ maxWidth: '800px' }}>
                                <table style={{ width: '100%', borderCollapse: 'collapse', background: '#fce4ec', borderRadius: '15px', overflow: 'hidden' }}>
                                    <thead>
                                        <tr style={{ background: '#ed4b91', color: 'white' }}>
                                            <th style={{ padding: '12px' }}>Cliente</th>
                                            <th style={{ padding: '12px' }}>Servicio</th>
                                            <th style={{ padding: '12px' }}>Valor</th>
                                            <th style={{ padding: '12px' }}>Método</th>
                                            <th style={{ padding: '12px' }}>Fecha</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {facturas.map(f => (
                                            <tr key={f.id} style={{ borderBottom: '1px solid #ffc1e3' }}>
                                                <td style={{ padding: '12px', textAlign: 'center' }}>{f.nombre_cliente}</td>
                                                <td style={{ padding: '12px', textAlign: 'center' }}>{f.tipo_servicio}</td>
                                                <td style={{ padding: '12px', textAlign: 'center' }}>${f.valor.toLocaleString()}</td>
                                                <td style={{ padding: '12px', textAlign: 'center' }}>{f.metodo_pago}</td>
                                                <td style={{ padding: '12px', textAlign: 'center' }}>{new Date(f.fecha_pago).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</td>
                                            </tr>
                                        ))}
                                        {facturas.length === 0 && (
                                            <tr>
                                                <td colSpan="5" style={{ padding: '20px', textAlign: 'center' }}>No hay ventas registradas</td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </>
                    )}
                </section>
            </main>

            <div className="logout-btn-ven" onClick={() => window.location.href = '/'}>
                🚪
            </div>
        </div>
    );
};

export default Vendedor;
