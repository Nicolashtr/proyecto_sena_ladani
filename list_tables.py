import mysql.connector

def list_tables():
    try:
        conn = mysql.connector.connect(
            host="localhost",
            user="root",
            password="1234",
            database="proyecto_formativo"
        )
        cursor = conn.cursor()
        cursor.execute("SHOW TABLES")
        tables = cursor.fetchall()
        for table in tables:
            print(table[0])
        conn.close()
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    list_tables()
