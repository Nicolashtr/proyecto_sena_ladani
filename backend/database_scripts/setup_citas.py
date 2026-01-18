import mysql.connector
db_config = {'host':'localhost','user':'root','password':'1234','database':'proyecto_formativo'}
conn = mysql.connector.connect(**db_config)
cursor = conn.cursor()
try:
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS citas (
        id INT AUTO_INCREMENT PRIMARY KEY,
        nombre VARCHAR(100),
        telefono VARCHAR(20),
        servicio VARCHAR(50),
        fecha DATE,
        hora TIME
    )
    """)
    print("Tabla 'citas' creada o ya existía.")
except Exception as e:
    print(f"Error creando tabla: {e}")
conn.close()
