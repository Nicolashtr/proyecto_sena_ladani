const API_URL = 'http://localhost:8000';

export const fetchEmployees = async () => {
    const response = await fetch(`${API_URL}/usuarios`);
    if (!response.ok) throw new Error('Error fetching employees');
    return response.json();
};

export const createEmployee = async (employeeData) => {
    // Map frontend 'contraseña' to backend 'contrasena' if present
    const payload = { ...employeeData };
    if (payload.contraseña !== undefined) {
        payload.contrasena = payload.contraseña;
        delete payload.contraseña;
    }

    // Ensure IDs are strings
    if (payload.id_usuario) payload.id_usuario = String(payload.id_usuario);
    if (payload.perfil_usuario) payload.perfil_usuario = String(payload.perfil_usuario);

    const response = await fetch(`${API_URL}/usuarios`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
    });
    if (!response.ok) {
        const err = await response.json();
        throw new Error(err.detail || 'Error creating employee');
    }
    return response.json();
};

export const updateEmployee = async (id, employeeData) => {
    const payload = { ...employeeData };
    if (payload.contraseña !== undefined) {
        payload.contrasena = payload.contraseña;
        delete payload.contraseña;
    }
    if (payload.id_usuario) payload.id_usuario = String(payload.id_usuario);

    const response = await fetch(`${API_URL}/usuarios/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
    });
    if (!response.ok) {
        const err = await response.json();
        throw new Error(err.detail || 'Error updating employee');
    }
    return response.json();
};

export const deleteEmployee = async (id) => {
    const response = await fetch(`${API_URL}/usuarios/${id}`, { method: 'DELETE' });
    if (!response.ok) throw new Error('Error deleting employee');
    return response.json();
};

export const fetchVentas = async () => {
    const response = await fetch(`${API_URL}/ventas`);
    if (!response.ok) throw new Error('Error fetching ventas');
    return response.json();
};

export const fetchCitas = async () => {
    const response = await fetch(`${API_URL}/citas`);
    if (!response.ok) throw new Error('Error fetching citas');
    return response.json();
};
