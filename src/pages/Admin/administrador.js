import React, { useState } from 'react';
import './administrador.css';
import { useAdminData } from '../../hooks/useAdminData';
import Inventory from './Inventory';
import RegisterEmployee from './RegisterEmployee'; // ¿Local por ahora o mover a componentes? Está en pages/Admin así que la importación local está bien
import { LiquidationView } from '../../components/admin/LiquidationView';
import { EmployeesSidebar, ProfileView } from '../../components/admin/ProfileComponents';

const Dashboard = () => {
    const {
        employees, liquidationStats, selectedEmployee, setSelectedEmployee,
        removeEmployee, registerOrUpdateEmployee, refreshLiquidation
    } = useAdminData();

    const [activeModule, setActiveModule] = useState('profile');
    const [showModal, setShowModal] = useState(false);
    const [modalEmployee, setModalEmployee] = useState(null);

    const todayDate = new Date().toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' });

    const handleOpenRegister = () => { setModalEmployee(null); setShowModal(true); };
    const handleOpenEdit = (emp) => { setModalEmployee(emp); setShowModal(true); };

    const handleRegisterSubmit = async (data, isEdit) => {
        const success = await registerOrUpdateEmployee(data, isEdit);
        if (success) setShowModal(false);
        return success;
    };

    const handleTabChange = (tab) => {
        setActiveModule(tab);
        if (tab === 'liquidate') refreshLiquidation();
        if (tab === 'profile' && employees.length > 0 && !selectedEmployee) setSelectedEmployee(employees[0]);
    };

    return (
        <div className="dashboard-container">
            {showModal && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <RegisterEmployee
                            employeeData={modalEmployee}
                            onCancel={() => setShowModal(false)}
                            onSubmit={handleRegisterSubmit}
                        />
                    </div>
                </div>
            )}

            <header className="dashboard-header">
                <div className="header-left">
                    <h2>¡Hola, Administrador!</h2>
                    <p>{activeModule === 'profile' ? 'Gestión de Personal' : activeModule === 'inventory' ? 'Inventario' : 'Liquidación'}</p>
                </div>
                <div className="header-right">
                    <span className="date-text">{todayDate}</span>
                    <div className="user-avatar-circle">👤</div>
                </div>
            </header>

            <main className="dashboard-main">
                {activeModule === 'inventory' ? (
                    <Inventory />
                ) : activeModule === 'liquidate' ? (
                    <LiquidationView stats={liquidationStats} />
                ) : (
                    <>
                        <EmployeesSidebar
                            employees={employees}
                            selectedId={selectedEmployee?.id_usuario}
                            onSelect={setSelectedEmployee}
                        />
                        <ProfileView
                            employee={selectedEmployee}
                            onEdit={handleOpenEdit}
                            onDelete={removeEmployee}
                        />
                    </>
                )}
            </main>

            <footer className="dashboard-footer">
                <FooterBtn icon="🏠" label="Inicio" active={activeModule === 'profile'} onClick={() => handleTabChange('profile')} />
                <FooterBtn icon="👤+" label="Registrar" onClick={handleOpenRegister} />
                <FooterBtn icon="💵" label="Liquidación" active={activeModule === 'liquidate'} onClick={() => handleTabChange('liquidate')} />
                <FooterBtn icon="📋" label="Inventario" active={activeModule === 'inventory'} onClick={() => handleTabChange('inventory')} />
                <FooterBtn icon="🚪" label="Salir" onClick={() => window.location.href = '/'} />
            </footer>
        </div>
    );
};

const FooterBtn = ({ icon, label, active, onClick }) => (
    <button onClick={onClick} className={`footer-item ${active ? 'active-tab' : ''}`} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
        <span className="footer-icon">{icon}</span><span>{label}</span>
    </button>
);

export default Dashboard;
