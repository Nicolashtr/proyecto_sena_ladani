import mysql.connector

def get_schemas():
    config = {
        'host': 'localhost',
        'user': 'root',
        'password': '1234',
        'database': 'proyecto_formativo'
    }
    try:
        conn = mysql.connector.connect(**config)
        cursor = conn.cursor()
        
        tables = ['ventas', 'clientes', 'facturas']
        for table in tables:
            print(f"\nTABLE: {table}")
            cursor.execute(f"DESCRIBE {table}")
            for col in cursor.fetchall():
                print(f"  Field: {col[0]} | Type: {col[1]}")
        
        conn.close()
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    get_schemas()
