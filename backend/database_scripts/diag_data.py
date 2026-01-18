import mysql.connector
db_config = {'host':'localhost','user':'root','password':'1234','database':'proyecto_formativo'}
conn = mysql.connector.connect(**db_config)
cursor = conn.cursor(dictionary=True)
cursor.execute("SELECT * FROM usuarios LIMIT 1")
print(cursor.fetchone())
conn.close()
