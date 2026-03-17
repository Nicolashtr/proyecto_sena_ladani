import mysql.connector

def fix_unique_constraint():
    try:
        conn = mysql.connector.connect(
            host="localhost",
            user="root",
            password="1234",
            database="proyecto_formativo"
        )
        cursor = conn.cursor()
        print("Attempting to drop UNIQUE index on perfil_usuario in usuarios table...")
        try:
            cursor.execute("ALTER TABLE usuarios DROP INDEX perfil_usuario")
            print("Successfully dropped index 'perfil_usuario'")
        except Exception as e:
            # If default index name is different, try to find it or just print error
            print(f"Error dropping index: {e}")
            # Try to see if it's a named constraint
            
        conn.commit()
        conn.close()
    except Exception as e:
        print(f"Connection error: {e}")

if __name__ == "__main__":
    fix_unique_constraint()
