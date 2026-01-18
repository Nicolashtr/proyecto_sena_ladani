import React, { useState, useEffect } from 'react';

const RegisterEmployee = ({ onEmployeeRegistered, employeeData, onCancel }) => {
    const isEditing = !!employeeData;
    const [formData, setFormData] = useState({
        id_usuario: '',
        nombre: '',
        apellido: '',
        usuario: '',
        contraseña: '',
        correo: '',
        numero_celular: '',
        perfil_usuario: '2'
    });
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (employeeData) {
            setFormData({
                ...employeeData,
                contraseña: '' // Leave password empty for security, handle in backend or require re-entry
            });
        }
    }, [employeeData]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            // Ensure all fields are strings (especially id_usuario if it came as a number)
            const submissionData = {
                ...formData,
                id_usuario: String(formData.id_usuario),
                perfil_usuario: String(formData.perfil_usuario)
            };

            const url = isEditing
                ? `http://localhost:8000/usuarios/${submissionData.id_usuario}`
                : 'http://localhost:8000/usuarios';

            const method = isEditing ? 'PUT' : 'POST';

            const response = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(submissionData)
            });

            if (response.ok) {
                alert(isEditing ? 'Empleado actualizado exitosamente' : 'Empleado registrado exitosamente');
                if (onEmployeeRegistered) onEmployeeRegistered();
            } else {
                const data = await response.json();
                console.error('Server error:', data);
                let errorMessage = 'No se pudo procesar';

                if (data.detail) {
                    if (Array.isArray(data.detail)) {
                        // Handle FastAPI validation error array
                        errorMessage = data.detail.map(err => `${err.loc.join('.')}: ${err.msg}`).join('\n');
                    } else if (typeof data.detail === 'string') {
                        errorMessage = data.detail;
                    } else {
                        errorMessage = JSON.stringify(data.detail);
                    }
                }
                alert('Error al guardar:\n' + errorMessage);
            }
        } catch (error) {
            console.error('Fetch error:', error);
            alert('Error de conexión con el servidor');
        } finally {
            setLoading(false);
        }
    };


    return (
        <div className="profile-content">
            <h2 className="profile-name-title">{isEditing ? 'Editar Empleado' : 'Registrar Nuevo Empleado'}</h2>
            <form className="inventory-form" onSubmit={handleSubmit} style={{ maxWidth: '600px', width: '100%' }}>
                <input name="id_usuario" placeholder="Cédula / ID" value={formData.id_usuario} onChange={handleChange} required disabled={isEditing} />
                <input name="nombre" placeholder="Nombre" value={formData.nombre} onChange={handleChange} required />
                <input name="apellido" placeholder="Apellido" value={formData.apellido} onChange={handleChange} required />
                <input name="usuario" placeholder="Nombre de Usuario" value={formData.usuario} onChange={handleChange} required />
                <input name="contraseña" type="password" placeholder={isEditing ? "Nueva Contraseña (opcional)" : "Contraseña"} value={formData.contraseña} onChange={handleChange} required={!isEditing} />
                <input name="correo" type="email" placeholder="Correo Electrónico" value={formData.correo} onChange={handleChange} required />
                <input name="numero_celular" placeholder="Celular" value={formData.numero_celular} onChange={handleChange} required />
                <select name="perfil_usuario" value={formData.perfil_usuario} onChange={handleChange} style={{ padding: '12px', borderRadius: '12px', border: '1px solid #ffc1e3' }} required>
                    <option value="">Seleccione un Rol</option>
                    <option value="Administrador">Administrador</option>
                    <option value="Vendedor">Vendedor</option>
                    <option value="Estilista">Estilista</option>
                </select>
                <div style={{ gridColumn: 'span 2', display: 'flex', gap: '10px', marginTop: '10px' }}>
                    <button type="submit" className="btn-add-item" disabled={loading} style={{ flex: 1 }}>
                        {loading ? 'Guardando...' : (isEditing ? 'Guardar Cambios' : 'Registrar Empleado')}
                    </button>
                    <button type="button" onClick={onCancel} className="btn-mini btn-delete" style={{ padding: '12px', borderRadius: '12px' }}>
                        Cancelar
                    </button>
                </div>
            </form>
        </div>
    );
};



export default RegisterEmployee;
