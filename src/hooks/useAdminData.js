import { useState, useEffect, useCallback, useMemo } from 'react';
import * as service from '../services/adminService';

export const useAdminData = () => {
    const [employees, setEmployees] = useState([]);
    const [ventasReport, setVentasReport] = useState([]);
    const [allCitas, setAllCitas] = useState([]);
    const [selectedEmployee, setSelectedEmployee] = useState(null);

    const loadEmployees = useCallback(async () => {
        try {
            const data = await service.fetchEmployees();
            setEmployees(data);
            if (data.length > 0 && !selectedEmployee) {
                // Only select default if none selected or if previously selected is gone?
                // For simplicity, we can let the UI handle default selection or do it here.
                // Keeping it consistent with original:
                // setSelectedEmployee(data[0]); -> This might override user selection on refresh.
                // Better to handle in UI or if selectedEmployee is null.
            }
        } catch (error) { console.error(error); }
    }, [selectedEmployee]);

    const loadVentas = useCallback(async () => {
        try {
            const data = await service.fetchVentas();
            setVentasReport(data);
        } catch (error) { console.error(error); }
    }, []);

    const loadCitas = useCallback(async () => {
        try {
            const data = await service.fetchCitas();
            setAllCitas(data);
        } catch (error) { console.error(error); }
    }, []);

    useEffect(() => {
        loadEmployees();
        loadVentas();
        loadCitas();
    }, [loadEmployees, loadVentas, loadCitas]);

    const removeEmployee = async (id) => {
        if (!window.confirm('¿Estás seguro de que deseas eliminar permanentemente a este empleado?')) return;
        try {
            await service.deleteEmployee(id);
            alert('Empleado eliminado');
            setSelectedEmployee(null);
            loadEmployees();
        } catch (error) {
            alert(error.message);
        }
    };

    const registerOrUpdateEmployee = async (data, isEdit) => {
        try {
            if (isEdit) await service.updateEmployee(data.id_usuario, data);
            else await service.createEmployee(data);

            alert(isEdit ? 'Empleado actualizado exitosamente' : 'Empleado registrado exitosamente');
            loadEmployees();
            return true;
        } catch (error) {
            alert('Error: ' + error.message);
            return false;
        }
    };

    // Liquidation Logic
    const liquidationStats = useMemo(() => {
        const STYLIST_COMMISSION = 0.03;
        const SELLER_COMMISSION = 0.03;

        const byStylist = employees.filter(e => e.perfil_usuario === 'Estilista').map(est => {
            const filtered = allCitas
                .filter(c => (c.estilista === (est.nombre + ' ' + est.apellido) || c.estilista === est.nombre) && c.estado === 'Finalizado');
            const total = filtered.reduce((acc, curr) => acc + (curr.costo || 0), 0);
            return {
                nombre: `${est.nombre} ${est.apellido}`,
                total,
                cantidad: filtered.length,
                comision: total * STYLIST_COMMISSION
            };
        });

        const bySeller = employees.filter(e => e.perfil_usuario === 'Vendedor').map(ven => {
            const filtered = ventasReport
                .filter(v => v.vendedor === ven.nombre || v.vendedor === (ven.nombre + ' ' + ven.apellido));
            const total = filtered.reduce((acc, curr) => acc + (curr.valor_procedimiento || 0), 0);
            return {
                nombre: `${ven.nombre} ${ven.apellido}`,
                total,
                cantidad: filtered.length,
                comision: total * SELLER_COMMISSION
            };
        });

        const totalComision = byStylist.reduce((a, b) => a + b.comision, 0) + bySeller.reduce((a, b) => a + b.comision, 0);
        const totalBruto = byStylist.reduce((a, b) => a + b.total, 0) + bySeller.reduce((a, b) => a + b.total, 0);
        const utilidad = totalBruto - totalComision;

        return { byStylist, bySeller, totalComision, totalBruto, utilidad };
    }, [employees, allCitas, ventasReport]);

    return {
        employees,
        liquidationStats,
        selectedEmployee,
        setSelectedEmployee,
        removeEmployee,
        registerOrUpdateEmployee,
        refreshLiquidation: () => { loadVentas(); loadCitas(); }
    };
};
