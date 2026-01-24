import React from 'react';

export const EmployeesSidebar = ({ employees, selectedId, onSelect }) => (
    <aside className="employees-sidebar">
        <h3>Empleados registrados</h3>
        <div style={{ overflowY: 'auto', flex: 1 }}>
            {employees.map(emp => (
                <div
                    key={emp.id_usuario}
                    className={`employee-card ${selectedId === emp.id_usuario ? 'active-card' : ''}`}
                    onClick={() => onSelect(emp)}
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
);

export const ProfileView = ({ employee, onEdit, onDelete }) => {
    if (!employee) return <p style={{ textAlign: 'center', marginTop: '50px', color: '#999' }}>Selecciona un empleado para ver su perfil</p>;

    return (
        <section className="profile-content">
            <div className="profile-header-icon">👤</div>
            <h2 className="profile-name-title">{employee.nombre} {employee.apellido}</h2>

            <div className="profile-fields">
                <div className="field-group"><span className="field-label">Cédula</span><span className="field-value">{employee.id_usuario}</span><span className="edit-btn" onClick={() => onEdit(employee)}>✎</span></div>
                <div className="field-group"><span className="field-label">Usuario</span><span className="field-value">{employee.usuario}</span><span className="edit-btn" onClick={() => onEdit(employee)}>✎</span></div>
                <div className="field-group"><span className="field-label">Rol</span><span className="field-value">{employee.perfil_usuario}</span><span className="edit-btn" onClick={() => onEdit(employee)}>✎</span></div>
                <div className="field-group"><span className="field-label">Correo</span><span className="field-value">{employee.correo}</span><span className="edit-btn" onClick={() => onEdit(employee)}>✎</span></div>
                <div className="field-group"><span className="field-label">Celular</span><span className="field-value">{employee.numero_celular}</span><span className="edit-btn" onClick={() => onEdit(employee)}>✎</span></div>
            </div>

            <button className="deactivate-btn" onClick={() => onDelete(employee.id_usuario)}>Eliminar Empleado</button>
        </section>
    );
};
