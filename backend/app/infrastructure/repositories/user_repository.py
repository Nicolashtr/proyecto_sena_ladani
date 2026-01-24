from app.infrastructure.database import get_db_connection
from mysql.connector import Error

class UserRepository:
    def get_all(self):
        conn = get_db_connection()
        if not conn: return None
        try:
            cursor = conn.cursor(dictionary=True)
            cursor.execute("SELECT id_usuario, nombre, apellido, usuario, correo, numero_celular, perfil_usuario FROM usuarios")
            return cursor.fetchall()
        finally:
            conn.close()

    def create(self, user_data):
        conn = get_db_connection()
        if not conn: return None
        try:
            cursor = conn.cursor()
            query = """INSERT INTO usuarios (id_usuario, nombre, apellido, usuario, contrasena, correo, numero_celular, perfil_usuario) 
                       VALUES (%s, %s, %s, %s, %s, %s, %s, %s)"""
            cursor.execute(query, (user_data.id_usuario, user_data.nombre, user_data.apellido, user_data.usuario, user_data.contrasena, user_data.correo, user_data.numero_celular, user_data.perfil_usuario))
            conn.commit()
            return True
        finally:
            conn.close()

    def update(self, id_usuario, user_data):
        conn = get_db_connection()
        if not conn: return None
        try:
            cursor = conn.cursor()
            if user_data.contrasena and user_data.contrasena.strip() != "":
                query = """UPDATE usuarios SET nombre=%s, apellido=%s, usuario=%s, contrasena=%s, correo=%s, numero_celular=%s, perfil_usuario=%s 
                           WHERE id_usuario=%s"""
                params = (user_data.nombre, user_data.apellido, user_data.usuario, user_data.contrasena, user_data.correo, user_data.numero_celular, user_data.perfil_usuario, id_usuario)
            else:
                query = """UPDATE usuarios SET nombre=%s, apellido=%s, usuario=%s, correo=%s, numero_celular=%s, perfil_usuario=%s 
                           WHERE id_usuario=%s"""
                params = (user_data.nombre, user_data.apellido, user_data.usuario, user_data.correo, user_data.numero_celular, user_data.perfil_usuario, id_usuario)
            cursor.execute(query, params)
            conn.commit()
            return True
        finally:
            conn.close()

    def delete(self, id_usuario):
        conn = get_db_connection()
        if not conn: return None
        try:
            cursor = conn.cursor()
            cursor.execute("DELETE FROM usuarios WHERE id_usuario=%s", (id_usuario,))
            conn.commit()
            return True
        finally:
            conn.close()

    def login(self, username, password):
        conn = get_db_connection()
        if not conn: return None
        try:
            cursor = conn.cursor(dictionary=True)
            query = "SELECT * FROM usuarios WHERE (usuario = %s OR id_usuario = %s) AND contrasena = %s"
            cursor.execute(query, (username, username, password))
            return cursor.fetchone()
        finally:
            conn.close()
