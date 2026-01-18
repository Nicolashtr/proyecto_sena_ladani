import mysql.connector
db_config = {'host':'localhost','user':'root','password':'1234','database':'proyecto_formativo'}
conn = mysql.connector.connect(**db_config)
cursor = conn.cursor()
try:
    cursor.execute("ALTER TABLE citas ADD COLUMN IF NOT EXISTS estado VARCHAR(20) DEFAULT 'Pendiente'")
    cursor.execute("ALTER TABLE citas ADD COLUMN IF NOT EXISTS costo INT DEFAULT 0")
    conn.commit()
    print("Table citas updated successfully")
except Exception as e:
    print(f"Error: {e}")
conn.close()
