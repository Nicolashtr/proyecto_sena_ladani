import { useState, useEffect, useCallback } from 'react';
import * as service from '../services/inventoryService';

export const useInventory = () => {
    const [items, setItems] = useState([]);

    const loadInventory = useCallback(async () => {
        try {
            const data = await service.fetchInventory();
            setItems(data);
        } catch (error) { console.error(error); }
    }, []);

    useEffect(() => {
        loadInventory();
    }, [loadInventory]);

    const add = async (item) => {
        try {
            await service.addProduct(item);
            alert('Producto agregado');
            loadInventory();
            return true;
        } catch (error) {
            alert('Error al agregar');
            return false;
        }
    };

    const update = async (id, item) => {
        try {
            await service.updateProduct(id, item);
            alert('Producto actualizado');
            loadInventory();
            return true;
        } catch (error) {
            alert('Error al actualizar');
            return false;
        }
    };

    const remove = async (id) => {
        if (!window.confirm('¿Eliminar producto?')) return;
        try {
            await service.deleteProduct(id);
            loadInventory();
        } catch (error) {
            alert('Error al eliminar');
        }
    };

    return { items, add, update, remove };
};
