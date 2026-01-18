import React, { useState, useEffect } from 'react';
import './Inventory.css';

const Inventory = () => {
    const [items, setItems] = useState([]);
    const [formData, setFormData] = useState({
        nombre_producto: '',
        descripcion: '',
        cantidad: '',
        precio: ''
    });
    const [editingId, setEditingId] = useState(null);
    const [loading, setLoading] = useState(false);

    const API_URL = 'http://localhost:8000/inventario';

    useEffect(() => {
        fetchItems();
    }, []);

    const fetchItems = async () => {
        try {
            const response = await fetch(API_URL);
            const data = await response.json();
            setItems(data);
        } catch (error) {
            console.error('Error fetching inventory:', error);
        }
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const method = editingId ? 'PUT' : 'POST';
            const url = editingId ? `${API_URL}/${editingId}` : API_URL;

            const response = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            if (response.ok) {
                alert(editingId ? 'Producto actualizado' : 'Producto agregado');
                setFormData({ nombre_producto: '', descripcion: '', cantidad: '', precio: '' });
                setEditingId(null);
                fetchItems();
            }
        } catch (error) {
            alert('Error al guardar el producto');
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = (item) => {
        setEditingId(item.id);
        setFormData({
            nombre_producto: item.nombre_producto,
            descripcion: item.descripcion,
            cantidad: item.cantidad,
            precio: item.precio
        });
    };

    const handleDelete = async (id) => {
        if (!window.confirm('¿Estás seguro de eliminar este producto?')) return;
        try {
            const response = await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
            if (response.ok) {
                fetchItems();
            }
        } catch (error) {
            alert('Error al eliminar');
        }
    };

    const generateReport = () => {
        const header = "ID,Nombre,Cantidad,Precio,Fecha\n";
        const csvContent = items.map(i => `${i.id},${i.nombre_producto},${i.cantidad},${i.precio},${i.fecha_registro}`).join("\n");
        const blob = new Blob([header + csvContent], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `reporte_inventario_${new Date().toLocaleDateString()}.csv`;
        a.click();
    };

    return (
        <div className="inventory-module">
            <div className="inventory-header">
                <h2>Gestión de Inventario</h2>
                <button onClick={generateReport} className="btn-report">Generar Reporte (CSV)</button>
            </div>

            <form className="inventory-form" onSubmit={handleSubmit}>
                <input
                    name="nombre_producto"
                    placeholder="Nombre del producto"
                    value={formData.nombre_producto}
                    onChange={handleChange}
                    required
                />
                <input
                    name="cantidad"
                    type="number"
                    placeholder="Cantidad"
                    value={formData.cantidad}
                    onChange={handleChange}
                    required
                />
                <input
                    name="precio"
                    type="number"
                    step="0.01"
                    placeholder="Precio"
                    value={formData.precio}
                    onChange={handleChange}
                    required
                />
                <textarea
                    name="descripcion"
                    placeholder="Descripción"
                    value={formData.descripcion}
                    onChange={handleChange}
                />
                <button type="submit" className="btn-add-item" disabled={loading}>
                    {editingId ? 'Guardar Cambios' : 'Ingresar Producto'}
                </button>
                {editingId && <button onClick={() => { setEditingId(null); setFormData({ nombre_producto: '', descripcion: '', cantidad: '', precio: '' }) }} className="btn-mini btn-delete">Cancelar</button>}
            </form>

            <div className="inventory-table-container">
                <table className="inventory-table">
                    <thead>
                        <tr>
                            <th>Producto</th>
                            <th>Descripción</th>
                            <th>Cant.</th>
                            <th>Precio</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {items.map(item => (
                            <tr key={item.id}>
                                <td>{item.nombre_producto}</td>
                                <td>{item.descripcion}</td>
                                <td>{item.cantidad}</td>
                                <td>${item.precio}</td>
                                <td className="actions-cell">
                                    <button onClick={() => handleEdit(item)} className="btn-mini btn-edit">Editar</button>
                                    <button onClick={() => handleDelete(item.id)} className="btn-mini btn-delete">Eliminar</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Inventory;
