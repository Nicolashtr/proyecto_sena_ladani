import React, { useState, useEffect } from 'react';
import './administrador.css';
import Inventory from './Inventory';
import RegisterEmployee from './RegisterEmployee';

const Dashboard = () => {
    const [activeModule, setActiveModule] = useState('profile'); // 'profile', 'inventory', 'liquidate'
    const [employees, setEmployees] = useState([]);
    const [ventasReport, setVentasReport] = useState([]);
    const [allCitas, setAllCitas] = useState([]);
    const [selectedEmployee, setSelectedEmployee] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [modalEmployee, setModalEmployee] = useState(null);

    const todayDate = new Date().toLocaleDateString('es-ES', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
    });

    useEffect(() => {
        fetchEmployees();
        fetchVentas();
        fetchCitas();
    }, []);

    const fetchEmployees = async () => {
        try {
            const response = await fetch('http://localhost:8000/usuarios');
            const data = await response.json();
            setEmployees(data);
            if (data.length > 0 && !selectedEmployee) {
                setSelectedEmployee(data[0]);
            }
        } catch (error) {
            console.error('Error fetching employees:', error);
        }
    };

    const fetchVentas = async () => {
        try {
            const response = await fetch('http://localhost:8000/ventas');
            if (response.ok) {
                const data = await response.json();
                setVentasReport(data);
            }
        } catch (error) { console.error(error); }
    };

    const fetchCitas = async () => {
        try {
            const response = await fetch('http://localhost:8000/citas');
            if (response.ok) {
                const data = await response.json();
                setAllCitas(data);
            }
        } catch (error) { console.error(error); }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('¿Estás seguro de que deseas eliminar permanentemente a este empleado?')) return;
        try {
            const response = await fetch(`http://localhost:8000/usuarios/${id}`, {
                method: 'DELETE'
            });
            if (response.ok) {
                alert('Empleado eliminado');
                setSelectedEmployee(null);
                fetchEmployees();
            }
        } catch (error) {
            alert('Error al eliminar');
        }
    };

    const handleOpenRegister = () => {
        setModalEmployee(null);
        setShowModal(true);
    };

    const handleOpenEdit = (emp) => {
        setModalEmployee(emp);
        setShowModal(true);
    };

    const handleOnRegistered = () => {
        setShowModal(false);
        fetchEmployees();
    };

    // Commission Percentages
    const STYLIST_COMMISSION = 0.03; // 3%
    const SELLER_COMMISSION = 0.03;  // 3%

    // Calculate Liquidation Data
    const liquidationByStylist = employees.filter(e => e.perfil_usuario === 'Estilista').map(est => {
        const filtered = allCitas
            .filter(c => c.estilista === (est.nombre + ' ' + est.apellido) || c.estilista === est.nombre)
            .filter(c => c.estado === 'Finalizado');
        const total = filtered.reduce((acc, curr) => acc + (curr.costo || 0), 0);
        return {
            nombre: `${est.nombre} ${est.apellido}`,
            total,
            cantidad: filtered.length,
            comision: total * STYLIST_COMMISSION
        };
    });

    const liquidationBySeller = employees.filter(e => e.perfil_usuario === 'Vendedor').map(ven => {
        const filtered = ventasReport
            .filter(v => v.vendedor === ven.nombre || v.vendedor === (ven.nombre + ' ' + ven.apellido));
        const total = filtered.reduce((acc, curr) => acc + (curr.valor_procedimiento || 0), 0);
        return {
            nombre: `${ven.nombre} ${ven.apellido}`,
            total,
            cantidad: filtered.length,
            comision: total * SELLER_COMMISSION
        };
    });

    return (
        <div className="dashboard-container">
            {showModal && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <RegisterEmployee
                            employeeData={modalEmployee}
                            onCancel={() => setShowModal(false)}
                            onEmployeeRegistered={handleOnRegistered}
                        />
                    </div>
                </div>
            )}

            <header className="dashboard-header">
                <div className="header-left">
                    <h2>¡Hola, Administrador!</h2>
                    <p>
                        {activeModule === 'profile' ? 'Panel de Control - Personal' :
                            activeModule === 'inventory' ? 'Panel de Control - Inventario' :
                                'Panel de Control - Liquidación'}
                    </p>
                </div>
                <div className="header-right">
                    <span className="date-text">{todayDate}</span>
                    <div className="user-avatar-circle">
                        👤
                    </div>
                </div>
            </header>

            <main className="dashboard-main">
                {activeModule === 'inventory' ? (
                    <Inventory />
                ) : activeModule === 'liquidate' ? (
                    <section className="profile-content" style={{ width: '100%', maxWidth: '900px', margin: '0 auto' }}>
                        <h2 className="section-title" style={{ color: '#ed4b91', textAlign: 'center', marginBottom: '30px', width: '100%' }}>Resumen de Liquidación</h2>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px', width: '100%' }}>
                            <div className="liquidation-card" style={{ background: '#fff', padding: '20px', borderRadius: '20px', boxShadow: '0 4px 15px rgba(0,0,0,0.05)', border: '1px solid #fce4ec' }}>
                                <h3 style={{ color: '#ed4b91', borderBottom: '2px solid #fce4ec', paddingBottom: '10px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                                    <span>✂️</span> Estilistas (Servicios)
                                </h3>
                                {liquidationByStylist.map((item, i) => (
                                    <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '15px 0', borderBottom: '1px solid #f9f9f9' }}>
                                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                                            <span style={{ fontWeight: '500' }}>{item.nombre}</span>
                                            <span style={{ fontSize: '12px', color: '#888' }}>{item.cantidad} procedimientos</span>
                                        </div>
                                        <div style={{ textAlign: 'right', alignSelf: 'center' }}>
                                            <div style={{ fontWeight: 'bold', color: '#ed4b91' }}>Total: ${item.total.toLocaleString()}</div>
                                            <div style={{ fontSize: '12px', color: '#2ecc71' }}>Comisión (3%): ${item.comision.toLocaleString()}</div>
                                        </div>
                                    </div>
                                ))}
                                {liquidationByStylist.length === 0 && <p style={{ textAlign: 'center', color: '#999', marginTop: '20px' }}>No hay estilistas registrados</p>}
                            </div>

                            <div className="liquidation-card" style={{ background: '#fff', padding: '20px', borderRadius: '20px', boxShadow: '0 4px 15px rgba(0,0,0,0.05)', border: '1px solid #fce4ec' }}>
                                <h3 style={{ color: '#ed4b91', borderBottom: '2px solid #fce4ec', paddingBottom: '10px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                                    <span>🧾</span> Vendedores (Ventas)
                                </h3>
                                {liquidationBySeller.map((item, i) => (
                                    <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '15px 0', borderBottom: '1px solid #f9f9f9' }}>
                                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                                            <span style={{ fontWeight: '500' }}>{item.nombre}</span>
                                            <span style={{ fontSize: '12px', color: '#888' }}>{item.cantidad} facturas</span>
                                        </div>
                                        <div style={{ textAlign: 'right', alignSelf: 'center' }}>
                                            <div style={{ fontWeight: 'bold', color: '#ed4b91' }}>Total: ${item.total.toLocaleString()}</div>
                                            <div style={{ fontSize: '12px', color: '#2ecc71' }}>Comisión (3%): ${item.comision.toLocaleString()}</div>
                                        </div>
                                    </div>
                                ))}
                                {liquidationBySeller.length === 0 && <p style={{ textAlign: 'center', color: '#999', marginTop: '20px' }}>No hay vendedores registrados</p>}
                            </div>
                        </div>

                        <div style={{ marginTop: '30px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                            <div style={{ padding: '20px', background: 'white', borderRadius: '15px', textAlign: 'center', border: '1px solid #fce4ec' }}>
                                <h3 style={{ margin: 0, fontSize: '14px', color: '#888' }}>Total Comisiones (A pagar)</h3>
                                <h2 style={{ margin: '5px 0 0 0', color: '#2ecc71' }}>
                                    ${(liquidationByStylist.reduce((a, b) => a + b.comision, 0) + liquidationBySeller.reduce((a, b) => a + b.comision, 0)).toLocaleString()}
                                </h2>
                            </div>
                            <div style={{ padding: '20px', background: 'white', borderRadius: '15px', textAlign: 'center', border: '1px solid #fce4ec' }}>
                                <h3 style={{ margin: 0, fontSize: '14px', color: '#888' }}>Utilidad Neta Negocio</h3>
                                <h2 style={{ margin: '5px 0 0 0', color: '#ed4b91' }}>
                                    ${(
                                        (liquidationByStylist.reduce((a, b) => a + b.total, 0) + liquidationBySeller.reduce((a, b) => a + b.total, 0)) -
                                        (liquidationByStylist.reduce((a, b) => a + b.comision, 0) + liquidationBySeller.reduce((a, b) => a + b.comision, 0))
                                    ).toLocaleString()}
                                </h2>
                            </div>
                        </div>

                        <div style={{ marginTop: '20px', textAlign: 'center', padding: '15px', background: '#ed4b91', color: 'white', borderRadius: '20px', boxShadow: '0 5px 15px rgba(237, 75, 145, 0.2)', width: '100%' }}>
                            <h2 style={{ margin: 0, opacity: 0.9, fontSize: '14px' }}>Total Bruto Generado</h2>
                            <h1 style={{ margin: '5px 0 0 0', fontSize: '28px', fontWeight: 'bold' }}>${(liquidationByStylist.reduce((a, b) => a + b.total, 0) + liquidationBySeller.reduce((a, b) => a + b.total, 0)).toLocaleString()}</h1>
                        </div>
                    </section>
                ) : (
                    <>
                        <aside className="employees-sidebar">
                            <h3>Empleados registrados</h3>
                            <div style={{ overflowY: 'auto', flex: 1 }}>
                                {employees.map(emp => (
                                    <div
                                        key={emp.id_usuario}
                                        className={`employee-card ${selectedEmployee?.id_usuario === emp.id_usuario ? 'active-card' : ''}`}
                                        onClick={() => setSelectedEmployee(emp)}
                                    >
                                        <div className="employee-icon">👤</div>
                                        <div className="employee-info">
                                            <h4>{emp.nombre} {emp.apellido}</h4>
                                            <p>{emp.perfil_usuario}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </aside>

                        <section className="profile-content">
                            {selectedEmployee ? (
                                <>
                                    <div className="profile-header-icon">👤</div>
                                    <h2 className="profile-name-title">{selectedEmployee.nombre} {selectedEmployee.apellido}</h2>

                                    <div className="profile-fields">
                                        <div className="field-group">
                                            <span className="field-label">Cédula de ciudadanía</span>
                                            <span className="field-value">{selectedEmployee.id_usuario}</span>
                                            <span className="edit-btn" onClick={() => handleOpenEdit(selectedEmployee)}>✎</span>
                                        </div>
                                        <div className="field-group">
                                            <span className="field-label">Nombre de Usuario</span>
                                            <span className="field-value">{selectedEmployee.usuario}</span>
                                            <span className="edit-btn" onClick={() => handleOpenEdit(selectedEmployee)}>✎</span>
                                        </div>
                                        <div className="field-group">
                                            <span className="field-label">Rol asignado</span>
                                            <span className="field-value">{selectedEmployee.perfil_usuario}</span>
                                            <span className="edit-btn" onClick={() => handleOpenEdit(selectedEmployee)}>✎</span>
                                        </div>
                                        <div className="field-group">
                                            <span className="field-label">Correo electrónico</span>
                                            <span className="field-value">{selectedEmployee.correo}</span>
                                            <span className="edit-btn" onClick={() => handleOpenEdit(selectedEmployee)}>✎</span>
                                        </div>
                                        <div className="field-group">
                                            <span className="field-label">Teléfono / Celular</span>
                                            <span className="field-value">{selectedEmployee.numero_celular}</span>
                                            <span className="edit-btn" onClick={() => handleOpenEdit(selectedEmployee)}>✎</span>
                                        </div>
                                    </div>

                                    <button
                                        className="deactivate-btn"
                                        onClick={() => handleDelete(selectedEmployee.id_usuario)}
                                    >
                                        Eliminar Empleado
                                    </button>
                                </>
                            ) : (
                                <p style={{ textAlign: 'center', marginTop: '50px', color: '#999' }}>Selecciona un empleado para ver su perfil</p>
                            )}
                        </section>
                    </>
                )}
            </main>

            <footer className="dashboard-footer">
                <button
                    onClick={() => {
                        setActiveModule('profile');
                        if (employees.length > 0) setSelectedEmployee(employees[0]);
                    }}
                    className={`footer-item ${activeModule === 'profile' ? 'active-tab' : ''}`}
                    style={{ background: 'none', border: 'none', cursor: 'pointer' }}
                >
                    <span className="footer-icon">🏠</span>
                    <span>Inicio</span>
                </button>
                <button
                    onClick={handleOpenRegister}
                    className="footer-item"
                    style={{ background: 'none', border: 'none', cursor: 'pointer' }}
                >
                    <span className="footer-icon">👤+</span>
                    <span>Registrar empleado</span>
                </button>
                <button
                    onClick={() => {
                        setActiveModule('liquidate');
                        fetchVentas();
                        fetchCitas();
                    }}
                    className={`footer-item ${activeModule === 'liquidate' ? 'active-tab' : ''}`}
                    style={{ background: 'none', border: 'none', cursor: 'pointer' }}
                >
                    <span className="footer-icon">💵</span>
                    <span>Liquidación</span>
                </button>
                <button
                    onClick={() => setActiveModule('inventory')}
                    className={`footer-item ${activeModule === 'inventory' ? 'active-tab' : ''}`}
                    style={{ background: 'none', border: 'none', cursor: 'pointer' }}
                >
                    <span className="footer-icon">📋</span>
                    <span>Inventario</span>
                </button>
                <button
                    onClick={() => window.location.href = '/'}
                    className="footer-item"
                    style={{ background: 'none', border: 'none', cursor: 'pointer' }}
                >
                    <span className="footer-icon">🚪</span>
                    <span>Salir</span>
                </button>
            </footer>
        </div>
    );
};

export default Dashboard;
