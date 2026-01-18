import mysql.connector
db_config = {'host':'localhost','user':'root','password':'1234','database':'proyecto_formativo'}
conn = mysql.connector.connect(**db_config)
cursor = conn.cursor()

def add_col(table, col_name, definition):
    try:
        cursor.execute(f"ALTER TABLE {table} ADD COLUMN {col_name} {definition}")
        print(f"Added {col_name} to {table}")
    except mysql.connector.Error as err:
        if err.errno == 1060:
            print(f"Column {col_name} in {table} already exists")
        else:
            print(f"Error {col_name}: {err}")

add_col("facturas", "vendedor", "VARCHAR(100)")
conn.commit()
conn.close()
