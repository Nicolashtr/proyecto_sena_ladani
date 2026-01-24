from fastapi import APIRouter, HTTPException
from app.domain.models import UserCreate, LoginRequest
from app.infrastructure.repositories.user_repository import UserRepository

router = APIRouter()
repo = UserRepository()

@router.get("/usuarios")
async def get_usuarios():
    users = repo.get_all()
    if users is None: raise HTTPException(status_code=500, detail="Database connection error")
    return users

@router.post("/usuarios")
async def register_user(user: UserCreate):
    if repo.create(user):
        return {"status": "success", "message": "Empleado registrado correctamente"}
    raise HTTPException(status_code=500, detail="Error al registrar")

@router.put("/usuarios/{id_usuario}")
async def update_user(id_usuario: str, user: UserCreate):
    if repo.update(id_usuario, user):
        return {"status": "success", "message": "Empleado actualizado correctamente"}
    raise HTTPException(status_code=500, detail="Error al actualizar")

@router.delete("/usuarios/{id_usuario}")
async def delete_user(id_usuario: str):
    if repo.delete(id_usuario):
        return {"status": "success", "message": "Empleado eliminado correctamente"}
    raise HTTPException(status_code=500, detail="Error al eliminar")

@router.post("/login")
async def login(request: LoginRequest):
    user = repo.login(request.usuario, request.password)
    if user:
        return {
            "status": "success",
            "message": "Login successful",
            "user": {
                "documento": user.get('id_usuario', user.get('usuario')), 
                "nombre": user.get('nombre', 'Usuario'),
                "perfil": user.get('perfil_usuario')
            }
        }
    raise HTTPException(status_code=401, detail="Usuario o contrasena incorrectos")
