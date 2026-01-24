from fastapi import APIRouter, HTTPException
from app.domain.models import FacturaRequest
from app.infrastructure.repositories.factura_repository import FacturaRepository

router = APIRouter()
repo = FacturaRepository()

@router.post("/facturas")
async def create_factura(request: FacturaRequest):
    try:
        id_ven = 1007569734 # Default Vendedor
        id_per = 2 # Default Vendedor Perfil
        if repo.create(request, id_ven, id_per):
            return {"status": "success", "message": "Factura y Venta registradas correctamente"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    raise HTTPException(status_code=500, detail="Database connection error")

@router.get("/facturas")
async def get_facturas():
    data = repo.get_all()
    if data is None: raise HTTPException(status_code=500, detail="Error")
    return data

@router.get("/ventas")
async def get_ventas():
    data = repo.get_ventas()
    if data is None: raise HTTPException(status_code=500, detail="Error")
    return data
