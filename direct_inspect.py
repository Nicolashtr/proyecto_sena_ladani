import mysql.connector

def inspect_table():
    try:
        conn = mysql.connector.connect(
            host="localhost",
            user="root",
            password="1234",
            database="proyecto_formativo"
        )
        cursor = conn.cursor()
        cursor.execute("DESCRIBE usuarios")
        columns = cursor.fetchall()
        for col in columns:
            name = col[0]
            if "perfil" in name or "rol" in name or "usuario" in name:
                print(f"{col[0]}: {col[1]}")
        conn.close()
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    inspect_table()
