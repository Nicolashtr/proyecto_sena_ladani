import mysql.connector

def check_ventas():
    config = {
        'host': 'localhost',
        'user': 'root',
        'password': '1234',
        'database': 'proyecto_formativo'
    }
    try:
        conn = mysql.connector.connect(**config)
        cursor = conn.cursor()
        
        print("\n--- Structure of ventas ---")
        cursor.execute("DESCRIBE ventas")
        for row in cursor.fetchall():
            print(row)
        
        conn.close()
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    check_ventas()
