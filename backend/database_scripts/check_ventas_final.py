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
        
        cursor.execute("DESCRIBE ventas")
        columns = cursor.fetchall()
        print("COLUMNS_START")
        for col in columns:
            print(f"Col: {col[0]} | Type: {col[1]}")
        print("COLUMNS_END")
        
        conn.close()
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    check_ventas()
