const API_URL = 'http://localhost:8000';

export const fetchInventory = async () => {
    const response = await fetch(`${API_URL}/inventario`);
    if (!response.ok) throw new Error('Error fetching inventory');
    return response.json();
};

export const addProduct = async (product) => {
    const response = await fetch(`${API_URL}/inventario`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(product)
    });
    if (!response.ok) throw new Error('Error adding product');
    return response.json();
};

export const updateProduct = async (id, product) => {
    const response = await fetch(`${API_URL}/inventario/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(product)
    });
    if (!response.ok) throw new Error('Error updating product');
    return response.json();
};

export const deleteProduct = async (id) => {
    const response = await fetch(`${API_URL}/inventario/${id}`, { method: 'DELETE' });
    if (!response.ok) throw new Error('Error deleting product');
    return response.json();
};
