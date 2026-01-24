const API_URL = 'http://localhost:8000';

export const fetchClientes = async () => {
    const response = await fetch(`${API_URL}/clientes`);
    if (!response.ok) throw new Error('Error fetching clientes');
    return response.json();
};

export const saveCliente = async (cliente, isEdit) => {
    const url = isEdit ? `${API_URL}/clientes/${cliente.id_cliente}` : `${API_URL}/clientes`;
    const method = isEdit ? 'PUT' : 'POST';
    const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(cliente)
    });
    if (!response.ok) {
        const err = await response.json();
        throw new Error(err.detail || 'Error saving cliente');
    }
    return response.json();
};

export const deleteCliente = async (id) => {
    const response = await fetch(`${API_URL}/clientes/${id}`, { method: 'DELETE' });
    if (!response.ok) throw new Error('Error deleting cliente');
    return response.json();
};

export const fetchFacturas = async () => {
    const response = await fetch(`${API_URL}/facturas`);
    if (!response.ok) throw new Error('Error fetching facturas');
    return response.json();
};

export const createFactura = async (facturaData) => {
    const response = await fetch(`${API_URL}/facturas`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(facturaData)
    });
    if (!response.ok) throw new Error('Error creating factura');
    return response.json();
};

export const fetchCitas = async () => {
    const response = await fetch(`${API_URL}/citas`);
    if (!response.ok) throw new Error('Error fetching citas');
    return response.json();
};

export const updateCita = async (id, data) => {
    const response = await fetch(`${API_URL}/citas/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    });
    if (!response.ok) throw new Error('Error updating cita');
    return response.json();
};
