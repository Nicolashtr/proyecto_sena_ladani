import mysql.connector
db_config = {'host':'localhost','user':'root','password':'1234','database':'proyecto_formativo'}
conn = mysql.connector.connect(**db_config)
cursor = conn.cursor()
cursor.execute("DESCRIBE usuarios")
for col in cursor.fetchall():
    print(col)
conn.close()
