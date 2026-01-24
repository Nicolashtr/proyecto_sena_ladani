import { useState, useEffect, useCallback } from 'react';
import * as service from '../services/vendedorService';

export const useVendedorData = () => {
    const [citas, setCitas] = useState([]);
    const [facturas, setFacturas] = useState([]);
    const [clientes, setClientes] = useState([]);

    const loadCitas = useCallback(async () => {
        try {
            const data = await service.fetchCitas();
            setCitas(data);
        } catch (error) { console.error(error); }
    }, []);

    const loadFacturas = useCallback(async () => {
        try {
            const data = await service.fetchFacturas();
            setFacturas(data);
        } catch (error) { console.error(error); }
    }, []);

    const loadClientes = useCallback(async () => {
        try {
            const data = await service.fetchClientes();
            setClientes(data);
        } catch (error) { console.error(error); }
    }, []);

    const saveCliente = async (clienteData, isEdit) => {
        const submissionData = {
            ...clienteData,
            id_cliente: parseInt(clienteData.id_cliente)
        };
        await service.saveCliente(submissionData, isEdit);
        loadClientes();
    };

    const deleteCliente = async (id) => {
        await service.deleteCliente(id);
        loadClientes();
    };

    const confirmCita = async (id, data) => {
        await service.updateCita(id, { ...data, estado: 'Confirmada' });
        loadCitas();
    };

    const generateFactura = async (data) => {
        await service.createFactura(data);
        loadFacturas();
    };

    useEffect(() => {
        loadCitas();
        loadFacturas();
        loadClientes();
    }, [loadCitas, loadFacturas, loadClientes]);

    return {
        citas,
        facturas,
        clientes,
        saveCliente,
        deleteCliente,
        confirmCita,
        generateFactura,
        refreshCitas: loadCitas
    };
};
