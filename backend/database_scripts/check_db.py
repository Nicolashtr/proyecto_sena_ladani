import mysql.connector

db_config = {
    'host': 'localhost',
    'user': 'root',
    'password': '1234',
    'database': 'proyecto_formativo'
}

try:
    conn = mysql.connector.connect(**db_config)
    print("Conexión exitosa a la base de datos.")
    cursor = conn.cursor()
    cursor.execute("SHOW TABLES LIKE 'usuarios'")
    result = cursor.fetchone()
    if result:
        print("La tabla 'usuarios' existe.")
        cursor.execute("DESCRIBE usuarios")
        columns = cursor.fetchall()
        print("Columnas de la tabla:")
        for col in columns:
            print(f"- {col[0]} ({col[1]})")
        
        cursor.execute("SELECT * FROM usuarios")
        rows = cursor.fetchall()
        print(f"Número de usuarios registrados: {len(rows)}")
    else:
        print("ERROR: La tabla 'usuarios' NO existe.")
    conn.close()
except Exception as e:
    print(f"ERROR DE CONEXIÓN: {e}")
