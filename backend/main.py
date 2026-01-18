from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import mysql.connector
from mysql.connector import Error
from typing import Optional

app = FastAPI()

# Enable CORS for React development
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Database Configuration
db_config = {
    'host': 'localhost',
    'user': 'root',
    'password': '1234',
    'database': 'proyecto_formativo'
}

def get_db_connection():
    try:
        connection = mysql.connector.connect(**db_config)
        return connection
    except Error as e:
        print(f"Error connecting to MySQL: {e}")
        return None

# Models
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

@app.get("/")
async def root():
    return {"message": "Backend La Dani with MySQL is running"}

@app.get("/usuarios")
async def get_usuarios():
    conn = get_db_connection()
    if not conn:
        raise HTTPException(status_code=500, detail="Database connection error")
    try:
        cursor = conn.cursor(dictionary=True)
        cursor.execute("SELECT id_usuario, nombre, apellido, usuario, correo, numero_celular, perfil_usuario FROM usuarios")
        users = cursor.fetchall()
        return users
    except Error as e:
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        if conn.is_connected():
            cursor.close()
            conn.close()

@app.post("/usuarios")
async def register_user(user: UserCreate):
    conn = get_db_connection()
    if not conn:
        raise HTTPException(status_code=500, detail="Database connection error")
    try:
        cursor = conn.cursor()
        query = """INSERT INTO usuarios (id_usuario, nombre, apellido, usuario, contrasena, correo, numero_celular, perfil_usuario) 
                   VALUES (%s, %s, %s, %s, %s, %s, %s, %s)"""
        cursor.execute(query, (user.id_usuario, user.nombre, user.apellido, user.usuario, user.contrasena, user.correo, user.numero_celular, user.perfil_usuario))
        conn.commit()
        return {"status": "success", "message": "Empleado registrado correctamente"}
    except Error as e:
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        if conn.is_connected():
            cursor.close()
            conn.close()

@app.put("/usuarios/{id_usuario}")
async def update_user(id_usuario: str, user: UserCreate):
    conn = get_db_connection()
    if not conn:
        raise HTTPException(status_code=500, detail="Database connection error")
    try:
        cursor = conn.cursor()
        if user.contrasena and user.contrasena.strip() != "":
            query = """UPDATE usuarios SET nombre=%s, apellido=%s, usuario=%s, contrasena=%s, correo=%s, numero_celular=%s, perfil_usuario=%s 
                       WHERE id_usuario=%s"""
            params = (user.nombre, user.apellido, user.usuario, user.contrasena, user.correo, user.numero_celular, user.perfil_usuario, id_usuario)
        else:
            query = """UPDATE usuarios SET nombre=%s, apellido=%s, usuario=%s, correo=%s, numero_celular=%s, perfil_usuario=%s 
                       WHERE id_usuario=%s"""
            params = (user.nombre, user.apellido, user.usuario, user.correo, user.numero_celular, user.perfil_usuario, id_usuario)
            
        cursor.execute(query, params)
        conn.commit()
        return {"status": "success", "message": "Empleado actualizado correctamente"}
    except Error as e:
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        if conn.is_connected():
            cursor.close()
            conn.close()

@app.delete("/usuarios/{id_usuario}")
async def delete_user(id_usuario: str):
    conn = get_db_connection()
    if not conn:
        raise HTTPException(status_code=500, detail="Database connection error")
    try:
        cursor = conn.cursor()
        cursor.execute("DELETE FROM usuarios WHERE id_usuario=%s", (id_usuario,))
        conn.commit()
        return {"status": "success", "message": "Empleado eliminado correctamente"}
    except Error as e:
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        if conn.is_connected():
            cursor.close()
            conn.close()

@app.post("/login")
async def login(request: LoginRequest):
    conn = get_db_connection()
    if not conn:
        raise HTTPException(status_code=500, detail="Database connection error")
    
    try:
        cursor = conn.cursor(dictionary=True)
        # Ajustamos a los nombres reales de tus columnas: usuario y contrasena
        query = "SELECT * FROM usuarios WHERE (usuario = %s OR id_usuario = %s) AND contrasena = %s"
        cursor.execute(query, (request.usuario, request.usuario, request.password))
        user = cursor.fetchone()
        
        if user:
            # Capturamos el nombre real de la base de datos
            return {
                "status": "success",
                "message": "Login successful",
                "user": {
                    "documento": user.get('id_usuario', user.get('usuario')), 
                    "nombre": user.get('nombre', 'Usuario'),
                    "perfil": user.get('perfil_usuario')
                }
            }
        else:
            raise HTTPException(status_code=401, detail="Usuario o contrasena incorrectos")
    except mysql.connector.Error as err:
        print(f"ERROR MYSQL: {err}")
        raise HTTPException(status_code=500, detail=f"Error de Base de Datos: {err.msg}")
    except Exception as e:
        print(f"ERROR GENERAL: {e}")
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        if conn.is_connected():
            cursor.close()
            conn.close()


@app.get("/inventario")
async def get_inventario():
    conn = get_db_connection()
    if not conn:
        raise HTTPException(status_code=500, detail="Database connection error")
    try:
        cursor = conn.cursor(dictionary=True)
        cursor.execute("SELECT * FROM inventario")
        items = cursor.fetchall()
        return items
    except Error as e:
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        if conn.is_connected():
            cursor.close()
            conn.close()

@app.post("/inventario")
async def add_inventory(item: InventoryItem):
    conn = get_db_connection()
    if not conn:
        raise HTTPException(status_code=500, detail="Database connection error")
    try:
        cursor = conn.cursor()
        query = "INSERT INTO inventario (nombre_producto, descripcion, cantidad, precio) VALUES (%s, %s, %s, %s)"
        cursor.execute(query, (item.nombre_producto, item.descripcion, item.cantidad, item.precio))
        conn.commit()
        return {"status": "success", "message": "Producto agregado"}
    except Error as e:
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        if conn.is_connected():
            cursor.close()
            conn.close()

@app.put("/inventario/{id}")
async def update_inventory(id: int, item: InventoryItem):
    conn = get_db_connection()
    if not conn:
        raise HTTPException(status_code=500, detail="Database connection error")
    try:
        cursor = conn.cursor()
        query = "UPDATE inventario SET nombre_producto=%s, descripcion=%s, cantidad=%s, precio=%s WHERE id=%s"
        cursor.execute(query, (item.nombre_producto, item.descripcion, item.cantidad, item.precio, id))
        conn.commit()
        return {"status": "success", "message": "Producto actualizado"}
    except Error as e:
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        if conn.is_connected():
            cursor.close()
            conn.close()

@app.delete("/inventario/{id}")
async def delete_inventory(id: int):
    conn = get_db_connection()
    if not conn:
        raise HTTPException(status_code=500, detail="Database connection error")
    try:
        cursor = conn.cursor()
        cursor.execute("DELETE FROM inventario WHERE id=%s", (id,))
        conn.commit()
        return {"status": "success", "message": "Producto eliminado"}
    except Error as e:
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        if conn.is_connected():
            cursor.close()
            conn.close()

@app.get("/citas")
async def get_citas():
    conn = get_db_connection()
    if not conn:
        raise HTTPException(status_code=500, detail="Database connection error")
    try:
        cursor = conn.cursor(dictionary=True)
        cursor.execute("SELECT * FROM citas")
        citas = cursor.fetchall()
        # Ensure DATE and TIME objects are strings for JSON
        for c in citas:
            if c['fecha']: c['fecha'] = str(c['fecha'])
            if c['hora']: c['hora'] = str(c['hora'])
        return citas
    except Error as e:
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        if conn.is_connected():
            cursor.close()
            conn.close()

@app.put("/citas/{cita_id}/finalizar")
async def finalizar_cita(cita_id: int):
    conn = get_db_connection()
    if not conn:
        raise HTTPException(status_code=500, detail="Database connection error")
    try:
        cursor = conn.cursor()
        cursor.execute("UPDATE citas SET estado = 'Finalizado' WHERE id = %s", (cita_id,))
        conn.commit()
        return {"status": "success", "message": "Cita finalizada"}
    except Error as e:
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        if conn.is_connected():
            cursor.close()
            conn.close()

@app.post("/agenda")
async def create_agenda(request: AgendaRequest):
    conn = get_db_connection()
    if not conn:
        raise HTTPException(status_code=500, detail="Database connection error")
    
    # Precios sugeridos básicos
    precios = {
        "Corte": 25000,
        "Tintura": 80000,
        "Manicura": 20000,
        "Pedicura": 25000,
        "Peinado": 35000
    }
    # Buscar si el servicio contiene alguna de las palabras clave
    costo_final = 0
    for s, p in precios.items():
        if s.lower() in request.servicio.lower():
            costo_final = p
            break
    if costo_final == 0: costo_final = 30000 # Default if unknown

    try:
        cursor = conn.cursor()
        query = """INSERT INTO citas (nombre, telefono, servicio, fecha, hora, estado, costo) 
                   VALUES (%s, %s, %s, %s, %s, 'Pendiente', %s)"""
        values = (request.nombre, request.telefono, request.servicio, request.fecha, request.hora, costo_final)
        cursor.execute(query, values)
        conn.commit()
        
        return {
            "status": "success",
            "message": "Cita agendada correctamente"
        }
    except Error as e:
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        if conn.is_connected():
            cursor.close()
            conn.close()

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

@app.put("/citas/{cita_id}")
async def update_cita(cita_id: int, request: UpdateCitaRequest):
    conn = get_db_connection()
    if not conn:
        raise HTTPException(status_code=500, detail="Database connection error")
    try:
        cursor = conn.cursor()
        fields = []
        params = []
        for key, value in request.dict(exclude_unset=True).items():
            fields.append(f"{key} = %s")
            params.append(value)
        
        if not fields:
            return {"message": "No fields to update"}
            
        params.append(cita_id)
        query = f"UPDATE citas SET {', '.join(fields)} WHERE id = %s"
        cursor.execute(query, tuple(params))
        conn.commit()
        return {"status": "success", "message": "Cita actualizada"}
    except Error as e:
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        if conn.is_connected():
            cursor.close()
            conn.close()

@app.post("/facturas")
async def create_factura(request: FacturaRequest):
    conn = get_db_connection()
    if not conn:
        raise HTTPException(status_code=500, detail="Database connection error")
    try:
        cursor = conn.cursor()
        
        # 1. Insert into facturas
        query_factura = """INSERT INTO facturas (nombre_cliente, cedula_cliente, valor, metodo_pago, tipo_servicio, vendedor, id_vendedor, id_perfil) 
                           VALUES (%s, %s, %s, %s, %s, %s, %s, %s)"""
        # We try to get ID from request or use a default associated with the name
        id_ven = 1007569734 # Default Vendedor
        id_per = 2 # Default Vendedor Perfil
        
        values_factura = (request.nombre_cliente, request.cedula_cliente, request.valor, request.metodo_pago, request.tipo_servicio, request.vendedor, id_ven, id_per)
        cursor.execute(query_factura, values_factura)
        
        # 2. Relate with 'ventas' table
        id_cliente = None
        try:
            id_cand = int(request.cedula_cliente)
            cursor.execute("SELECT id_cliente FROM clientes WHERE id_cliente = %s", (id_cand,))
            c_res = cursor.fetchone()
            if c_res:
                id_cliente = c_res[0]
            else:
                cursor.execute("INSERT INTO clientes (id_cliente, nombre_cliente) VALUES (%s, %s)", (id_cand, request.nombre_cliente))
                id_cliente = id_cand
        except ValueError:
            cursor.execute("SELECT id_cliente FROM clientes WHERE nombre_cliente = %s", (request.nombre_cliente,))
            c_res = cursor.fetchone()
            if c_res:
                id_cliente = c_res[0]
            else:
                cursor.execute("INSERT INTO clientes (nombre_cliente) VALUES (%s)", (request.nombre_cliente,))
                id_cliente = cursor.lastrowid

        # Find or create procedimiento
        id_procedimiento = 1
        cursor.execute("SELECT id_procedimiento FROM procedimientos WHERE id_procedimiento = %s", (1,))
        if not cursor.fetchone():
            cursor.execute("INSERT INTO procedimientos (id_procedimiento, valor_procedimiento) VALUES (1, '0')")
            
        cursor.execute("SELECT id_procedimiento FROM procedimientos WHERE id_procedimiento > 0 LIMIT 1")
        p_res = cursor.fetchone()
        if p_res:
            id_procedimiento = p_res[0]

        # Insert into 'ventas'
        from datetime import date
        today_date = date.today().strftime('%Y-%m-%d')
        
        query_venta = """INSERT INTO ventas (id_cliente, id_procedimiento, fecha_procedimiento, forma_pago, valor_procedimiento, vendedor, id_vendedor, id_perfil) 
                         VALUES (%s, %s, %s, %s, %s, %s, %s, %s)"""
        values_venta = (id_cliente, id_procedimiento, today_date, request.metodo_pago, str(request.valor), request.vendedor, id_ven, id_per)
        cursor.execute(query_venta, values_venta)

        conn.commit()
        return {"status": "success", "message": "Factura y Venta registradas correctamente"}
    except Error as e:
        if conn: conn.rollback()
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        if conn.is_connected():
            cursor.close()
            conn.close()

@app.get("/facturas")
async def get_facturas():
    conn = get_db_connection()
    if not conn:
        raise HTTPException(status_code=500, detail="Database connection error")
    try:
        cursor = conn.cursor(dictionary=True)
        cursor.execute("SELECT * FROM facturas ORDER BY fecha_pago DESC")
        facturas = cursor.fetchall()
        for f in facturas:
            if f['fecha_pago']: f['fecha_pago'] = str(f['fecha_pago'])
        return facturas
    except Error as e:
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        if conn.is_connected():
            cursor.close()
            conn.close()

@app.get("/ventas")
async def get_ventas():
    conn = get_db_connection()
    if not conn:
        raise HTTPException(status_code=500, detail="Database connection error")
    try:
        cursor = conn.cursor(dictionary=True)
        # We join with clientes and procedimientos if possible
        query = """SELECT v.*, c.nombre_cliente, c.apellido 
                   FROM ventas v 
                   LEFT JOIN clientes c ON v.id_cliente = c.id_cliente 
                   ORDER BY v.fecha_procedimiento DESC"""
        cursor.execute(query)
        ventas = cursor.fetchall()
        for v in ventas:
            if v['fecha_procedimiento']: v['fecha_procedimiento'] = str(v['fecha_procedimiento'])
            # Ensure value is treated as number in frontend
            try:
                v['valor_procedimiento'] = float(v['valor_procedimiento'] or 0)
            except:
                v['valor_procedimiento'] = 0
        return ventas
    except Error as e:
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        if conn.is_connected():
            cursor.close()
            conn.close()

# CLIENTES CRUD
@app.get("/clientes")
async def get_clientes():
    conn = get_db_connection()
    if not conn: raise HTTPException(status_code=500, detail="Error de DB")
    try:
        cursor = conn.cursor(dictionary=True)
        cursor.execute("SELECT * FROM clientes")
        return cursor.fetchall()
    except Error as e: raise HTTPException(status_code=500, detail=str(e))
    finally:
        if conn.is_connected():
            cursor.close()
            conn.close()

@app.post("/clientes")
async def create_cliente(request: ClienteRequest):
    conn = get_db_connection()
    try:
        cursor = conn.cursor()
        query = "INSERT INTO clientes (id_cliente, nombre_cliente, apellido, numero_celular, direccion, correo) VALUES (%s, %s, %s, %s, %s, %s)"
        cursor.execute(query, (request.id_cliente, request.nombre_cliente, request.apellido, request.numero_celular, request.direccion, request.correo))
        conn.commit()
        return {"status": "success"}
    except Error as e: raise HTTPException(status_code=500, detail=str(e))
    finally:
        if conn.is_connected():
            cursor.close()
            conn.close()

@app.put("/clientes/{id_cliente}")
async def update_cliente(id_cliente: int, request: ClienteRequest):
    conn = get_db_connection()
    try:
        cursor = conn.cursor()
        query = "UPDATE clientes SET nombre_cliente=%s, apellido=%s, numero_celular=%s, direccion=%s, correo=%s WHERE id_cliente=%s"
        cursor.execute(query, (request.nombre_cliente, request.apellido, request.numero_celular, request.direccion, request.correo, id_cliente))
        conn.commit()
        return {"status": "success"}
    except Error as e: raise HTTPException(status_code=500, detail=str(e))
    finally:
        if conn.is_connected():
            cursor.close()
            conn.close()

@app.delete("/clientes/{id_cliente}")
async def delete_cliente(id_cliente: int):
    conn = get_db_connection()
    try:
        cursor = conn.cursor()
        cursor.execute("DELETE FROM clientes WHERE id_cliente=%s", (id_cliente,))
        conn.commit()
        return {"status": "success"}
    except Error as e: raise HTTPException(status_code=500, detail=str(e))
    finally:
        if conn.is_connected():
            cursor.close()
            conn.close()

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
