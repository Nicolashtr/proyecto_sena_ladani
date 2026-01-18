import mysql.connector
db_config = {'host':'localhost','user':'root','password':'1234','database':'proyecto_formativo'}
conn = mysql.connector.connect(**db_config)
cursor = conn.cursor()

def add_col(col_name, definition):
    try:
        cursor.execute(f"ALTER TABLE citas ADD COLUMN {col_name} {definition}")
        print(f"Added {col_name}")
    except mysql.connector.Error as err:
        if err.errno == 1060:
            print(f"Column {col_name} already exists")
        else:
            print(f"Error {col_name}: {err}")

add_col("estado", "VARCHAR(20) DEFAULT 'Pendiente'")
add_col("costo", "INT DEFAULT 0")
conn.commit()
conn.close()
