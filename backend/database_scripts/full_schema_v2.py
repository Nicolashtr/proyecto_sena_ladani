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
        
        with open('schema_final.txt', 'w', encoding='utf-8') as f:
            tables = ['ventas', 'clientes', 'facturas']
            for table in tables:
                f.write(f"\nTABLE: {table}\n")
                cursor.execute(f"DESCRIBE {table}")
                for col in cursor.fetchall():
                    f.write(f"  Field: {col[0]} | Type: {col[1]}\n")
        
        conn.close()
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    get_schemas()
