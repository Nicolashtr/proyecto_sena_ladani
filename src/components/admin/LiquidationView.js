import React from 'react';

export const LiquidationView = ({ stats }) => {
    return (
        <section className="profile-content" style={{ width: '100%', maxWidth: '900px', margin: '0 auto' }}>
            <h2 className="section-title" style={{ color: '#ed4b91', textAlign: 'center', marginBottom: '30px', width: '100%' }}>Resumen de Liquidación</h2>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px', width: '100%' }}>
                {/* Estilistas */}
                <div className="liquidation-card" style={{ background: '#fff', padding: '20px', borderRadius: '20px', boxShadow: '0 4px 15px rgba(0,0,0,0.05)', border: '1px solid #fce4ec' }}>
                    <h3 style={{ color: '#ed4b91', borderBottom: '2px solid #fce4ec', paddingBottom: '10px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <span>✂️</span> Estilistas (Servicios)
                    </h3>
                    {stats.byStylist.map((item, i) => (
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
                    {stats.byStylist.length === 0 && <p style={{ textAlign: 'center', color: '#999', marginTop: '20px' }}>No hay estilistas registrados</p>}
                </div>

                {/* Vendedores */}
                <div className="liquidation-card" style={{ background: '#fff', padding: '20px', borderRadius: '20px', boxShadow: '0 4px 15px rgba(0,0,0,0.05)', border: '1px solid #fce4ec' }}>
                    <h3 style={{ color: '#ed4b91', borderBottom: '2px solid #fce4ec', paddingBottom: '10px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <span>🧾</span> Vendedores (Ventas)
                    </h3>
                    {stats.bySeller.map((item, i) => (
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
                    {stats.bySeller.length === 0 && <p style={{ textAlign: 'center', color: '#999', marginTop: '20px' }}>No hay vendedores registrados</p>}
                </div>
            </div>

            <div style={{ marginTop: '30px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                <div style={{ padding: '20px', background: 'white', borderRadius: '15px', textAlign: 'center', border: '1px solid #fce4ec' }}>
                    <h3 style={{ margin: 0, fontSize: '14px', color: '#888' }}>Total Comisiones (A pagar)</h3>
                    <h2 style={{ margin: '5px 0 0 0', color: '#2ecc71' }}>${stats.totalComision.toLocaleString()}</h2>
                </div>
                <div style={{ padding: '20px', background: 'white', borderRadius: '15px', textAlign: 'center', border: '1px solid #fce4ec' }}>
                    <h3 style={{ margin: 0, fontSize: '14px', color: '#888' }}>Utilidad Neta Negocio</h3>
                    <h2 style={{ margin: '5px 0 0 0', color: '#ed4b91' }}>${stats.utilidad.toLocaleString()}</h2>
                </div>
            </div>

            <div style={{ marginTop: '20px', textAlign: 'center', padding: '15px', background: '#ed4b91', color: 'white', borderRadius: '20px', boxShadow: '0 5px 15px rgba(237, 75, 145, 0.2)', width: '100%' }}>
                <h2 style={{ margin: 0, opacity: 0.9, fontSize: '14px' }}>Total Bruto Generado</h2>
                <h1 style={{ margin: '5px 0 0 0', fontSize: '28px', fontWeight: 'bold' }}>${stats.totalBruto.toLocaleString()}</h1>
            </div>
        </section>
    );
};
