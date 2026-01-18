import mysql.connector

db_config = {
    'host': 'localhost',
    'user': 'root',
    'password': '1234',
    'database': 'proyecto_formativo'
}

try:
    conn = mysql.connector.connect(**db_config)
    cursor = conn.cursor(dictionary=True)
    cursor.execute("DESCRIBE usuarios")
    print("COLS:" + str([row['Field'] for row in cursor.fetchall()]))
    cursor.execute("SELECT documento, password FROM usuarios")
    print("USERS:" + str(cursor.fetchall()))
    conn.close()
except Exception as e:
    print("ERR:" + str(e))
