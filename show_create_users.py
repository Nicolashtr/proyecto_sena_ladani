import mysql.connector

def show_create_table():
    try:
        conn = mysql.connector.connect(
            host="localhost",
            user="root",
            password="1234",
            database="proyecto_formativo"
        )
        cursor = conn.cursor()
        cursor.execute("SHOW CREATE TABLE usuarios")
        result = cursor.fetchone()
        with open("create_table_users.txt", "w") as f:
            f.write(result[1])
        conn.close()
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    show_create_table()
