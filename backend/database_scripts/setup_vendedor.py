import mysql.connector
db_config = {'host':'localhost','user':'root','password':'1234','database':'proyecto_formativo'}
conn = mysql.connector.connect(**db_config)
cursor = conn.cursor()

def run_query(query, msg):
    try:
        cursor.execute(query)
        print(f"Success: {msg}")
    except mysql.connector.Error as err:
        print(f"Update {msg}: {err}")

# 1. Add estilista column to citas
run_query("ALTER TABLE citas ADD COLUMN IF NOT EXISTS estilista VARCHAR(100)", "Added estilista to citas")

# 2. Create facturas table
create_facturas = """
CREATE TABLE IF NOT EXISTS facturas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre_cliente VARCHAR(200),
    cedula_cliente VARCHAR(50),
    valor INT,
    metodo_pago VARCHAR(50),
    tipo_servicio VARCHAR(200),
    fecha_pago TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)
"""
run_query(create_facturas, "Created facturas table")

conn.commit()
conn.close()
