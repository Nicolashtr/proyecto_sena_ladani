import mysql.connector

def check_tables():
    config = {
        'host': 'localhost',
        'user': 'root',
        'password': '1234',
        'database': 'proyecto_formativo'
    }
    try:
        conn = mysql.connector.connect(**config)
        cursor = conn.cursor()
        
        cursor.execute("SHOW TABLES")
        all_tables = [t[0] for t in cursor.fetchall()]
        print(f"All tables: {all_tables}")

        for table in ['ventas', 'facturas']:
            print(f"\n--- Structure of {table} ---")
            if table in all_tables:
                cursor.execute(f"DESCRIBE {table}")
                for row in cursor.fetchall():
                    print(row)
            else:
                print(f"Table {table} does not exist.")
        
        conn.close()
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    check_tables()
