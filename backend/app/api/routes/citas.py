from fastapi import APIRouter, HTTPException
from app.domain.models import AgendaRequest, UpdateCitaRequest
from app.infrastructure.repositories.cita_repository import CitaRepository

router = APIRouter()
repo = CitaRepository()

@router.get("/citas")
async def get_citas():
    citas = repo.get_all()
    if citas is None: raise HTTPException(status_code=500, detail="Database connection error")
    return citas

@router.put("/citas/{cita_id}/finalizar")
async def finalizar_cita(cita_id: int):
    if repo.finalize(cita_id):
        return {"status": "success", "message": "Cita finalizada"}
    raise HTTPException(status_code=500, detail="Error al finalizar")

@router.post("/agenda")
async def create_agenda(request: AgendaRequest):
    precios = {"Corte": 25000, "Tintura": 80000, "Manicura": 20000, "Pedicura": 25000, "Peinado": 35000}
    costo_final = 30000
    for s, p in precios.items():
        if s.lower() in request.servicio.lower():
            costo_final = p
            break
    
    if repo.create(request, costo_final):
        return {"status": "success", "message": "Cita agendada correctamente"}
    raise HTTPException(status_code=500, detail="Error al agendar")

@router.put("/citas/{cita_id}")
async def update_cita(cita_id: int, request: UpdateCitaRequest):
    fields = []
    params = []
    for key, value in request.dict(exclude_unset=True).items():
        fields.append(f"{key} = %s")
        params.append(value)
    
    if not fields: return {"message": "No fields to update"}
    
    if repo.update(cita_id, fields, params):
        return {"status": "success", "message": "Cita actualizada"}
    raise HTTPException(status_code=500, detail="Error al actualizar")
