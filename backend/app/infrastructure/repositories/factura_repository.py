from app.infrastructure.database import get_db_connection
from datetime import date

class FacturaRepository:
    def create(self, request, id_ven, id_per):
        conn = get_db_connection()
        if not conn: return None
        try:
            cursor = conn.cursor()
            
            # 1. Factura
            query_factura = """INSERT INTO facturas (nombre_cliente, cedula_cliente, valor, metodo_pago, tipo_servicio, vendedor, id_vendedor, id_perfil) 
                               VALUES (%s, %s, %s, %s, %s, %s, %s, %s)"""
            cursor.execute(query_factura, (request.nombre_cliente, request.cedula_cliente, request.valor, request.metodo_pago, request.tipo_servicio, request.vendedor, id_ven, id_per))
            
            # 2. Cliente Logic
            id_cliente = None
            try:
                id_cand = int(request.cedula_cliente)
                cursor.execute("SELECT id_cliente FROM clientes WHERE id_cliente = %s", (id_cand,))
                c_res = cursor.fetchone()
                if c_res: id_cliente = c_res[0]
                else:
                    cursor.execute("INSERT INTO clientes (id_cliente, nombre_cliente, apellido, numero_celular) VALUES (%s, %s, '', '0')", (id_cand, request.nombre_cliente))
                    id_cliente = id_cand
            except ValueError:
                cursor.execute("SELECT id_cliente FROM clientes WHERE nombre_cliente = %s", (request.nombre_cliente,))
                c_res = cursor.fetchone()
                if c_res: id_cliente = c_res[0]
                else:
                    cursor.execute("INSERT INTO clientes (nombre_cliente, apellido, numero_celular) VALUES (%s, '', '0')", (request.nombre_cliente,))
                    id_cliente = cursor.lastrowid

            # 3. Procedimiento Logic
            cursor.execute("SELECT id_procedimiento FROM procedimientos WHERE id_procedimiento = %s", (1,))
            if not cursor.fetchone():
                try:
                    cursor.execute("INSERT INTO procedimientos (id_procedimiento, nombre_procedimiento, valor_procedimiento) VALUES (1, 'NA', '0')")
                except:
                    pass
            cursor.execute("SELECT id_procedimiento FROM procedimientos WHERE id_procedimiento > 0 LIMIT 1")
            res_proc = cursor.fetchone()
            id_procedimiento = res_proc[0] if res_proc else 1

            # 4. Venta
            today_date = date.today().strftime('%Y-%m-%d')
            query_venta = """INSERT INTO ventas (id_cliente, id_procedimiento, numero_celular, fecha_procedimiento, forma_pago, valor_procedimiento, vendedor, id_vendedor, id_perfil) 
                             VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s)"""
            cursor.execute(query_venta, (id_cliente, id_procedimiento, '0', today_date, request.metodo_pago, str(request.valor), request.vendedor, id_ven, id_per))

            conn.commit()
            return True
        except Exception as e:
            conn.rollback()
            raise e
        finally:
            conn.close()

    def get_all(self):
        conn = get_db_connection()
        if not conn: return None
        try:
            cursor = conn.cursor(dictionary=True)
            cursor.execute("SELECT * FROM facturas ORDER BY fecha_pago DESC")
            facturas = cursor.fetchall()
            for f in facturas:
                if f['fecha_pago']: f['fecha_pago'] = str(f['fecha_pago'])
            return facturas
        finally:
            conn.close()

    def get_ventas(self):
        conn = get_db_connection()
        if not conn: return None
        try:
            cursor = conn.cursor(dictionary=True)
            query = """SELECT v.*, c.nombre_cliente, c.apellido 
                       FROM ventas v 
                       LEFT JOIN clientes c ON v.id_cliente = c.id_cliente 
                       ORDER BY v.fecha_procedimiento DESC"""
            cursor.execute(query)
            ventas = cursor.fetchall()
            for v in ventas:
                if v['fecha_procedimiento']: v['fecha_procedimiento'] = str(v['fecha_procedimiento'])
                try: v['valor_procedimiento'] = float(v['valor_procedimiento'] or 0)
                except: v['valor_procedimiento'] = 0
            return ventas
        finally:
            conn.close()
