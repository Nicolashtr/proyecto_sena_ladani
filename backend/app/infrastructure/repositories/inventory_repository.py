from app.infrastructure.database import get_db_connection

class InventoryRepository:
    def get_all(self):
        conn = get_db_connection()
        if not conn: return None
        try:
            cursor = conn.cursor(dictionary=True)
            cursor.execute("SELECT * FROM inventario")
            return cursor.fetchall()
        finally:
            conn.close()

    def create(self, item):
        conn = get_db_connection()
        if not conn: return None
        try:
            cursor = conn.cursor()
            query = "INSERT INTO inventario (nombre_producto, descripcion, cantidad, precio) VALUES (%s, %s, %s, %s)"
            cursor.execute(query, (item.nombre_producto, item.descripcion, item.cantidad, item.precio))
            conn.commit()
            return True
        finally:
            conn.close()

    def update(self, item_id, item):
        conn = get_db_connection()
        if not conn: return None
        try:
            cursor = conn.cursor()
            query = "UPDATE inventario SET nombre_producto=%s, descripcion=%s, cantidad=%s, precio=%s WHERE id=%s"
            cursor.execute(query, (item.nombre_producto, item.descripcion, item.cantidad, item.precio, item_id))
            conn.commit()
            return True
        finally:
            conn.close()

    def delete(self, item_id):
        conn = get_db_connection()
        if not conn: return None
        try:
            cursor = conn.cursor()
            cursor.execute("DELETE FROM inventario WHERE id=%s", (item_id,))
            conn.commit()
            return True
        finally:
            conn.close()
