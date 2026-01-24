from fastapi import APIRouter, HTTPException
from app.domain.models import ClienteRequest
from app.infrastructure.repositories.cliente_repository import ClienteRepository

router = APIRouter()
repo = ClienteRepository()

@router.get("/clientes")
async def get_clientes():
    data = repo.get_all()
    if data is None: raise HTTPException(status_code=500, detail="Error")
    return data

@router.post("/clientes")
async def create_cliente(request: ClienteRequest):
    if repo.create(request): return {"status": "success"}
    raise HTTPException(status_code=500, detail="Error")

@router.put("/clientes/{id_cliente}")
async def update_cliente(id_cliente: int, request: ClienteRequest):
    if repo.update(id_cliente, request): return {"status": "success"}
    raise HTTPException(status_code=500, detail="Error")

@router.delete("/clientes/{id_cliente}")
async def delete_cliente(id_cliente: int):
    if repo.delete(id_cliente): return {"status": "success"}
    raise HTTPException(status_code=500, detail="Error")
