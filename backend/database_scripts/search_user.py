import mysql.connector
db_config = {'host':'localhost','user':'root','password':'1234','database':'proyecto_formativo'}
conn = mysql.connector.connect(**db_config)
cursor = conn.cursor(dictionary=True)
print("BUSCANDO 12345...")
cursor.execute("SELECT * FROM usuarios WHERE id_usuario = '12345' OR usuario = '12345'")
print(cursor.fetchall())
conn.close()
