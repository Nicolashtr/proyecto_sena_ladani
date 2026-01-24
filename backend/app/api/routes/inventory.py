from fastapi import APIRouter, HTTPException
from app.domain.models import InventoryItem
from app.infrastructure.repositories.inventory_repository import InventoryRepository

router = APIRouter()
repo = InventoryRepository()

@router.get("/inventario")
async def get_inventario():
    items = repo.get_all()
    if items is None: raise HTTPException(status_code=500, detail="Database connection error")
    return items

@router.post("/inventario")
async def add_inventory(item: InventoryItem):
    if repo.create(item):
        return {"status": "success", "message": "Producto agregado"}
    raise HTTPException(status_code=500, detail="Error al agregar")

@router.put("/inventario/{id}")
async def update_inventory(id: int, item: InventoryItem):
    if repo.update(id, item):
        return {"status": "success", "message": "Producto actualizado"}
    raise HTTPException(status_code=500, detail="Error al actualizar")

@router.delete("/inventario/{id}")
async def delete_inventory(id: int):
    if repo.delete(id):
        return {"status": "success", "message": "Producto eliminado"}
    raise HTTPException(status_code=500, detail="Error al eliminar")
