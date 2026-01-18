def fix_main():
    path = r'c:\Users\nicol_bocy2k\Desktop\SENA PROYECTO\proyecto museo sena\ladani\backend\main.py'
    with open(path, 'r', encoding='utf-8', errors='ignore') as f:
        content = f.read()
    
    # Replace non-ascii chars
    content = content.replace('contraseña', 'contrasena')
    
    with open(path, 'w', encoding='utf-8') as f:
        f.write(content)
    print("SUCCESS")

if __name__ == "__main__":
    fix_main()
