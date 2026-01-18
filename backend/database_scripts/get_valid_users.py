import mysql.connector
db_config = {'host':'localhost','user':'root','password':'1234','database':'proyecto_formativo'}
conn = mysql.connector.connect(**db_config)
cursor = conn.cursor(dictionary=True)
cursor.execute("SELECT usuario, contraseña, id_usuario FROM usuarios LIMIT 5")
for row in cursor.fetchall():
    print(f"User: {row['usuario']} | Pass: {row['contraseña']} | ID: {row['id_usuario']}")
conn.close()
