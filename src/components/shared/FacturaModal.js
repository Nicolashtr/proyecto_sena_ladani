import React, { useState } from 'react';

export const FacturaModal = ({ show, onClose, onSave, vendedorName }) => {
    const [facturaData, setFacturaData] = useState({
        nombre_cliente: '',
        cedula_cliente: '',
        valor: '',
        metodo_pago: 'Efectivo',
        tipo_servicio: ''
    });

    if (!show) return null;

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave({ ...facturaData, vendedor: vendedorName });
        setFacturaData({
            nombre_cliente: '', cedula_cliente: '', valor: '', metodo_pago: 'Efectivo', tipo_servicio: ''
        });
        onClose();
    };

    return (
        <div className="modal-overlay">
            <div className="modal-content" style={{ maxWidth: '500px' }}>
                <h2 className="section-title">Generar Factura</h2>
                <form className="vendedor-form" onSubmit={handleSubmit}>
                    {/* Simplified for brevity, assume inputs match original */}
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
                        <button type="button" className="btn-action" style={{ background: '#999', flex: 1 }} onClick={onClose}>Cancelar</button>
                    </div>
                </form>
            </div>
        </div>
    );
};
