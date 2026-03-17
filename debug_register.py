import urllib.request
import json
import urllib.error

url = "http://localhost:8000/usuarios"
payload = {
    "id_usuario": "99887766",
    "nombre": "Test",
    "apellido": "User",
    "usuario": "testuser_debug_2",
    "contrasena": "123456",
    "correo": "test@debug.com",
    "numero_celular": "3001234567",
    "perfil_usuario": "Vendedor"
}

data = json.dumps(payload).encode('utf-8')
req = urllib.request.Request(url, data=data, method='POST')
req.add_header('Content-Type', 'application/json')

print(f"Sending POST to {url}...")
try:
    with urllib.request.urlopen(req) as response:
        print(f"Status: {response.getcode()}")
        print(f"Response: {response.read().decode('utf-8')}")
except urllib.error.HTTPError as e:
    print(f"Status: {e.code}")
    print(f"Error: {e.read().decode('utf-8')}")
except Exception as e:
    print(f"Exception: {e}")
