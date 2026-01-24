from app.infrastructure.database import get_db_connection

class CitaRepository:
    def get_all(self):
        conn = get_db_connection()
        if not conn: return None
        try:
            cursor = conn.cursor(dictionary=True)
            cursor.execute("SELECT * FROM citas")
            citas = cursor.fetchall()
            for c in citas:
                if c['fecha']: c['fecha'] = str(c['fecha'])
                if c['hora']: c['hora'] = str(c['hora'])
            return citas
        finally:
            conn.close()

    def finalize(self, cita_id):
        conn = get_db_connection()
        if not conn: return None
        try:
            cursor = conn.cursor()
            cursor.execute("UPDATE citas SET estado = 'Finalizado' WHERE id = %s", (cita_id,))
            conn.commit()
            return True
        finally:
            conn.close()

    def create(self, data, costo):
        conn = get_db_connection()
        if not conn: return None
        try:
            cursor = conn.cursor()
            query = """INSERT INTO citas (nombre, telefono, servicio, fecha, hora, estado, costo) 
                       VALUES (%s, %s, %s, %s, %s, 'Pendiente', %s)"""
            cursor.execute(query, (data.nombre, data.telefono, data.servicio, data.fecha, data.hora, costo))
            conn.commit()
            return True
        finally:
            conn.close()

    def update(self, cita_id, fields, params):
        conn = get_db_connection()
        if not conn: return None
        try:
            cursor = conn.cursor()
            query = f"UPDATE citas SET {', '.join(fields)} WHERE id = %s"
            cursor.execute(query, tuple(params + [cita_id]))
            conn.commit()
            return True
        finally:
            conn.close()
