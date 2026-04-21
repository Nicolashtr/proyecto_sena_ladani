import mysql.connector
import pprint

with open('debug_db_out.txt', 'w') as f:
    conn = mysql.connector.connect(host='localhost', user='root', password='1234', database='proyecto_formativo')
    cursor = conn.cursor()
    cursor.execute('DESCRIBE facturas')
    f.write('FACTURAS:\n' + pprint.pformat(cursor.fetchall()) + '\n\n')
    cursor.execute('DESCRIBE ventas')
    f.write('VENTAS:\n' + pprint.pformat(cursor.fetchall()) + '\n\n')
    cursor.execute('DESCRIBE clientes')
    f.write('CLIENTES:\n' + pprint.pformat(cursor.fetchall()) + '\n\n')
    cursor.execute('DESCRIBE procedimientos')
    f.write('PROCEDIMIENTOS:\n' + pprint.pformat(cursor.fetchall()) + '\n')
