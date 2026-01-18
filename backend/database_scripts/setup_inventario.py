import mysql.connector
db_config = {'host':'localhost','user':'root','password':'1234','database':'proyecto_formativo'}
conn = mysql.connector.connect(**db_config)
cursor = conn.cursor()
try:
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS inventario (
        id INT AUTO_INCREMENT PRIMARY KEY,
        nombre_producto VARCHAR(100) NOT NULL,
        descripcion TEXT,
        cantidad INT NOT NULL,
        precio DECIMAL(10, 2) NOT NULL,
        fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
    """)
    print("Tabla 'inventario' creada o ya existía.")
except Exception as e:
    print(f"Error creando tabla inventario: {e}")
conn.close()
