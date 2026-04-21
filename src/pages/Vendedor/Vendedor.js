import React, { useState, useEffect } from 'react';
import { useVendedorData } from '../../hooks/useVendedorData';
import { FacturaModal } from '../../components/shared/FacturaModal';
import './Vendedor.css';

const Vendedor = () => {
    const { citas, facturas, clientes, saveCliente, deleteCliente, confirmCita, generateFactura } = useVendedorData();

    // UI Local State
    const [activeModule, setActiveModule] = useState('agenda');
    const [userData, setUserData] = useState({ nombre: 'Vendedor' });
    const [selectedCita, setSelectedCita] = useState(null);
    const [showFacturaModal, setShowFacturaModal] = useState(false);
    const [showClienteModal, setShowClienteModal] = useState(false);
    const [selectedCliente, setSelectedCliente] = useState(null);

    // Form States
    const [clienteData, setClienteData] = useState({
        id_cliente: '', nombre_cliente: '', apellido: '', numero_celular: '', direccion: '', correo: ''
    });
    const [editData, setEditData] = useState({
        servicio: '', fecha: '', hora: '', estilista: '', costo: ''
    });

    const todayDisplay = new Date().toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' });

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) setUserData(JSON.parse(storedUser));
    }, []);

    const handleSaveCliente = async (e) => {
        e.preventDefault();
        try {
            await saveCliente(clienteData, !!selectedCliente);
            alert(selectedCliente ? 'Cliente actualizado' : 'Cliente registrado');
            setShowClienteModal(false);
        } catch (error) {
            alert('Error: ' + error.message);
        }
    };

    const handleDeleteClienteLocal = async (id) => {
        if (window.confirm('¿Eliminar cliente?')) {
            try { await deleteCliente(id); } catch (error) { alert(error.message); }
        }
    };

    const handleOpenEditCliente = (cli) => {
        setSelectedCliente(cli);
        setClienteData(cli);
        setShowClienteModal(true);
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
    };

    const handleUpdateCita = async (e) => {
        e.preventDefault();
        try {
            await confirmCita(selectedCita.id, editData);
            alert('Cita confirmada');
            setSelectedCita(null);
        } catch (error) { alert('Error al actualizar'); }
    };

    const onFacturaSave = async (data) => {
        try {
            await generateFactura(data);
            alert('Factura generada');
        } catch (error) { alert(error.message); }
    };

    return (
        <div className="vendedor-container">
            <FacturaModal
                show={showFacturaModal}
                onClose={() => setShowFacturaModal(false)}
                onSave={onFacturaSave}
                vendedorName={userData.nombre}
            />

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
                    <button className={`sidebar-btn ${activeModule === 'agenda' ? 'active' : ''}`} onClick={() => { setActiveModule('agenda'); setSelectedCita(null); }}>
                        <span className="sidebar-btn-icon">📅</span><span>Agendar servicio</span>
                    </button>
                    <button className="sidebar-btn" onClick={() => setShowFacturaModal(true)}>
                        <span className="sidebar-btn-icon">🧾</span><span>Realizar factura</span>
                    </button>
                    <button className={`sidebar-btn ${activeModule === 'clientes' ? 'active' : ''}`} onClick={() => { setActiveModule('clientes'); setSelectedCita(null); }}>
                        <span className="sidebar-btn-icon">👥</span><span>Gestión de Clientes</span>
                    </button>
                    <button className={`sidebar-btn ${activeModule === 'reprogramar' ? 'active' : ''}`} onClick={() => { setActiveModule('reprogramar'); setSelectedCita(null); }}>
                        <span className="sidebar-btn-icon">🕒</span><span>Reprogramar cita</span>
                    </button>
                    <button className={`sidebar-btn ${activeModule === 'reporte' ? 'active' : ''}`} onClick={() => { setActiveModule('reporte'); setSelectedCita(null); }}>
                        <span className="sidebar-btn-icon">💰</span><span>Reporte de Ventas</span>
                    </button>
                </aside>

                <section className="vendedor-content">
                    {/* CLIENTES UI */}
                    {activeModule === 'clientes' && (
                        <>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                                <h2 className="section-title" style={{ margin: 0 }}>Gestión de Clientes</h2>
                                <button className="btn-action" style={{ width: 'auto', padding: '10px 20px' }} onClick={() => { setSelectedCliente(null); setClienteData({ id_cliente: '', nombre_cliente: '', apellido: '', numero_celular: '', direccion: '', correo: '' }); setShowClienteModal(true); }}>
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
                                            <button className="btn-mini btn-edit" onClick={() => handleOpenEditCliente(cli)}>Editar</button>
                                            <button className="btn-mini btn-delete" onClick={() => handleDeleteClienteLocal(cli.id_cliente)}>Eliminar</button>
                                        </div>
                                    </div>
                                ))}
                                {clientes.length === 0 && <p style={{ textAlign: 'center' }}>No hay clientes registrados</p>}
                            </div>
                        </>
                    )}

                    {/* CITAS UI */}
                    {(activeModule === 'agenda' || activeModule === 'reprogramar') && (
                        <>
                            <h2 className="section-title">
                                {activeModule === 'agenda' ? 'Cola de espera (Nuevas Citas)' : 'Citas Confirmadas por Reprogramar'}
                            </h2>
                            {!selectedCita ? (
                                <div className="queue-list">
                                    {citas.filter(c => activeModule === 'agenda' ? (c.estado === 'Pendiente' || !c.estado) : (c.estado === 'Confirmada')).map(cita => (
                                        <div key={cita.id} className="queue-item" onClick={() => handleSelectCita(cita)}>
                                            <div className="queue-info">
                                                <h4>{cita.nombre}</h4>
                                                <p><strong>Servicio:</strong> {cita.servicio}</p>
                                                <p><strong>Fecha/Hora:</strong> {cita.fecha} - {cita.hora}</p>
                                            </div>
                                            <div className="sidebar-btn-icon">➡️</div>
                                        </div>
                                    ))}
                                    {citas.length === 0 && <p style={{ textAlign: 'center' }}>No hay citas en esta sección</p>}
                                </div>
                            ) : (
                                <div className="vendedor-form-container">
                                    <button onClick={() => setSelectedCita(null)} style={{ background: 'none', border: 'none', color: '#ed4b91', cursor: 'pointer', marginBottom: '15px', fontWeight: 'bold' }}>⬅️ Volver</button>
                                    <form className="vendedor-form" onSubmit={handleUpdateCita}>
                                        <div className="form-field"><label>Servicio</label><input value={editData.servicio} onChange={e => setEditData({ ...editData, servicio: e.target.value })} /></div>
                                        <div className="form-field"><label>Fecha</label><input type="date" value={editData.fecha} onChange={e => setEditData({ ...editData, fecha: e.target.value })} /></div>
                                        <div className="form-field"><label>Hora</label><input type="time" value={editData.hora} onChange={e => setEditData({ ...editData, hora: e.target.value })} /></div>
                                        <div className="form-field"><label>Estilista</label><input value={editData.estilista} onChange={e => setEditData({ ...editData, estilista: e.target.value })} /></div>
                                        <div className="form-field"><label>Costo</label><input type="number" value={editData.costo} onChange={e => setEditData({ ...editData, costo: e.target.value })} /></div>
                                        <button type="submit" className="btn-action">Guardar Cambio</button>
                                    </form>
                                </div>
                            )}
                        </>
                    )}

                    {/* REPORTE UI */}
                    {activeModule === 'reporte' && (
                        <>
                            <h2 className="section-title">Reporte de Ventas</h2>
                            <div className="total-cost-box" style={{ marginBottom: '20px', padding: '20px', fontSize: '18px' }}>
                                Total Facturado: ${facturas.reduce((acc, f) => acc + (f.valor || 0), 0).toLocaleString()}
                            </div>
                            <div className="queue-list" style={{ maxWidth: '800px' }}>
                                <table style={{ width: '100%', borderCollapse: 'collapse', background: '#fce4ec', borderRadius: '15px', overflow: 'hidden' }}>
                                    <thead>
                                        <tr style={{ background: '#ed4b91', color: 'white' }}><th>Cliente</th><th>Servicio</th><th>Valor</th><th>Método</th></tr>
                                    </thead>
                                    <tbody>
                                        {facturas.map(f => (
                                            <tr key={f.id} style={{ borderBottom: '1px solid #ffc1e3' }}>
                                                <td style={{ padding: '12px', textAlign: 'center' }}>{f.nombre_cliente}</td>
                                                <td style={{ padding: '12px', textAlign: 'center' }}>{f.tipo_servicio}</td>
                                                <td style={{ padding: '12px', textAlign: 'center' }}>${f.valor.toLocaleString()}</td>
                                                <td style={{ padding: '12px', textAlign: 'center' }}>{f.metodo_pago}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </>
                    )}
                </section>
            </main>
            <div className="logout-btn-ven" onClick={() => { localStorage.removeItem('user'); window.location.href = '/'; }}>🚪</div>
        </div>
    );
};

export default Vendedor;
