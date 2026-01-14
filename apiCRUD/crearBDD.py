import sqlite3

# Conectar a la base de datos
conexion = sqlite3.connect("gimnasio.db")
cursor = conexion.cursor()

# Obtener todos los registros
cursor.execute("SELECT * FROM usuarios")
registros = cursor.fetchall()

# Mostrar resultados
for registro in registros:
    print(registro)

# Cerrar conexión
conexion.close()
