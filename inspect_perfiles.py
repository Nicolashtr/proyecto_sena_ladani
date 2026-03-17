import mysql.connector

def inspect_perfiles():
    try:
        conn = mysql.connector.connect(
            host="localhost",
            user="root",
            password="1234",
            database="proyecto_formativo"
        )
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM perfiles")
        rows = cursor.fetchall()
        print("Perfiles Data:")
        for row in rows:
            print(row)
            
        cursor.execute("DESCRIBE perfiles")
        columns = cursor.fetchall()
        print("\nPerfiles Schema:")
        for col in columns:
            print(f"{col[0]}: {col[1]}")
            
        conn.close()
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    inspect_perfiles()
