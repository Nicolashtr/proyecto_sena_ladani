import sys
import os

# Add current directory to path
sys.path.append(os.getcwd())

from app.infrastructure.database import get_db_connection

def inspect_table():
    conn = get_db_connection()
    if not conn:
        print("Failed to connect")
        return
    try:
        cursor = conn.cursor()
        cursor.execute("DESCRIBE usuarios")
        columns = cursor.fetchall()
        print(f"{'Field':<20} {'Type':<20} {'Null':<10} {'Key':<10}")
        print("-" * 60)
        for col in columns:
            print(f"{col[0]:<20} {str(col[1]):<20} {col[2]:<10} {col[3]:<10}")
    except Exception as e:
        print(f"Error: {e}")
    finally:
        conn.close()

if __name__ == "__main__":
    inspect_table()
