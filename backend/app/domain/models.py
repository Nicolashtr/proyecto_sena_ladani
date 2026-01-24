from pydantic import BaseModel
from typing import Optional

class LoginRequest(BaseModel):
    usuario: str
    password: str

class AgendaRequest(BaseModel):
    nombre: str
    telefono: str
    servicio: str
    fecha: str
    hora: str

class InventoryItem(BaseModel):
    nombre_producto: str
    descripcion: Optional[str] = None
    cantidad: int
    precio: float

class UserCreate(BaseModel):
    id_usuario: str
    nombre: Optional[str] = None
    apellido: Optional[str] = None
    usuario: Optional[str] = None
    contrasena: Optional[str] = None
    correo: Optional[str] = None
    numero_celular: Optional[str] = None
    perfil_usuario: Optional[str] = None

class FacturaRequest(BaseModel):
    nombre_cliente: str
    cedula_cliente: str
    valor: int
    metodo_pago: str
    tipo_servicio: str
    vendedor: Optional[str] = "Vendedor"

class UpdateCitaRequest(BaseModel):
    nombre: Optional[str] = None
    telefono: Optional[str] = None
    servicio: Optional[str] = None
    fecha: Optional[str] = None
    hora: Optional[str] = None
    estilista: Optional[str] = None
    costo: Optional[int] = None
    estado: Optional[str] = None

class ClienteRequest(BaseModel):
    id_cliente: int
    nombre_cliente: str
    apellido: Optional[str] = None
    numero_celular: Optional[str] = None
    direccion: Optional[str] = None
    correo: Optional[str] = None
