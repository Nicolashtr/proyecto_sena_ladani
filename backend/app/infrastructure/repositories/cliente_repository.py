from app.infrastructure.database import get_db_connection

class ClienteRepository:
    def get_all(self):
        conn = get_db_connection()
        if not conn: return None
        try:
            cursor = conn.cursor(dictionary=True)
            cursor.execute("SELECT * FROM clientes")
            return cursor.fetchall()
        finally:
            conn.close()

    def create(self, request):
        conn = get_db_connection()
        if not conn: return None
        try:
            cursor = conn.cursor()
            query = "INSERT INTO clientes (id_cliente, nombre_cliente, apellido, numero_celular, direccion, correo) VALUES (%s, %s, %s, %s, %s, %s)"
            cursor.execute(query, (request.id_cliente, request.nombre_cliente, request.apellido, request.numero_celular, request.direccion, request.correo))
            conn.commit()
            return True
        finally:
            conn.close()

    def update(self, id_cliente, request):
        conn = get_db_connection()
        if not conn: return None
        try:
            cursor = conn.cursor()
            query = "UPDATE clientes SET nombre_cliente=%s, apellido=%s, numero_celular=%s, direccion=%s, correo=%s WHERE id_cliente=%s"
            cursor.execute(query, (request.nombre_cliente, request.apellido, request.numero_celular, request.direccion, request.correo, id_cliente))
            conn.commit()
            return True
        finally:
            conn.close()

    def delete(self, id_cliente):
        conn = get_db_connection()
        if not conn: return None
        try:
            cursor = conn.cursor()
            cursor.execute("DELETE FROM clientes WHERE id_cliente=%s", (id_cliente,))
            conn.commit()
            return True
        finally:
            conn.close()
