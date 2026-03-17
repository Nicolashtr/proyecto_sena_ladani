import urllib.request
import urllib.error
import json

BASE_URL = "http://localhost:8000"

def test_endpoint(method, endpoint, data=None):
    url = f"{BASE_URL}{endpoint}"
    print(f"Testing {method} {url}...")
    
    req = urllib.request.Request(url, method=method)
    req.add_header('Content-Type', 'application/json')
    
    if data:
        json_data = json.dumps(data).encode('utf-8')
        req.data = json_data

    try:
        with urllib.request.urlopen(req) as response:
            status_code = response.getcode()
            body = response.read().decode('utf-8')
            try:
                parsed = json.loads(body)
                print(f"Status Code: {status_code}")
                print(f"Response: {json.dumps(parsed, indent=2)[:500]}...")
            except:
                print(f"Status Code: {status_code}")
                print(f"Response Text: {body[:200]}")
    except urllib.error.HTTPError as e:
        print(f"Status Code: {e.code}")
        print(f"Error Response: {e.read().decode('utf-8')}")
    except Exception as e:
        print(f"Error: {e}")
    
    print("-" * 30)

print("Starting API Tests for 'La Dani'...\n")

# 1. Root
test_endpoint("GET", "/")

# 2. Users
test_endpoint("GET", "/usuarios")

# 3. Inventory
test_endpoint("GET", "/inventario")

# 4. Citas
test_endpoint("GET", "/citas")

# 5. Clientes
test_endpoint("GET", "/clientes")

# 6. Login (Fail Test)
test_endpoint("POST", "/login", {"usuario": "admin", "password": "wrongpassword"})

# 7. Login (Try Test)
test_endpoint("POST", "/login", {"usuario": "1007569734", "password": "123"})
