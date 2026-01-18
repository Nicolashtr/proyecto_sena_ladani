import mysql.connector

def fix_db():
    config = {
        'host': 'localhost',
        'user': 'root',
        'password': '1234',
        'database': 'proyecto_formativo'
    }
    try:
        conn = mysql.connector.connect(**config)
        cursor = conn.cursor()
        
        # 1. Check schemas
        cursor.execute("DESCRIBE ventas")
        ventas_cols = [r[0] for r in cursor.fetchall()]
        
        cursor.execute("DESCRIBE facturas")
        facturas_cols = [r[0] for r in cursor.fetchall()]
        
        # 2. Add columns if missing
        if 'id_vendedor' not in ventas_cols:
            cursor.execute("ALTER TABLE ventas ADD COLUMN id_vendedor INT")
        if 'id_perfil' not in ventas_cols:
            cursor.execute("ALTER TABLE ventas ADD COLUMN id_perfil INT")
            
        if 'id_vendedor' not in facturas_cols:
            cursor.execute("ALTER TABLE facturas ADD COLUMN id_vendedor INT")
        if 'id_perfil' not in facturas_cols:
            cursor.execute("ALTER TABLE facturas ADD COLUMN id_perfil INT")
            
        # 3. Ensure profiles exist
        cursor.execute("SELECT COUNT(*) FROM perfiles")
        if cursor.fetchone()[0] == 0:
            cursor.execute("INSERT INTO perfiles (id_perfil, id_usuario, nombre_perfil, funciones) VALUES (1, 1007569734, 'Administrador', 'General'), (2, 1007569734, 'Vendedor', 'Ventas'), (3, 1007569734, 'Estilista', 'Servicios')")
            
        # 4. Default existing records
        cursor.execute("UPDATE ventas SET id_vendedor = 1007569734, id_perfil = 2")
        cursor.execute("UPDATE facturas SET id_vendedor = 1007569734, id_perfil = 2")
        
        conn.commit()
        print("DATABASE FIXED")
        conn.close()
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    fix_db()
