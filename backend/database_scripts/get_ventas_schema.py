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
        with open('ventas_schema.txt', 'w') as f:
            for col in columns:
                f.write(f"Col: {col[0]} | Type: {col[1]}\n")
        
        conn.close()
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    check_ventas()
