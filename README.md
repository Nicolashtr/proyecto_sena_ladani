# 💇‍♀️ Sistema de Gestión - Salón de Belleza "La Dani"

¡Bienvenido al repositorio oficial del sistema de gestión para el Salón de Belleza "La Dani"!
Este proyecto es una aplicación web moderna diseñada para optimizar los procesos administrativos, operativos y de atención al cliente del negocio.

## 🚀 Descripción del Proyecto

El sistema permite la administración integral del salón, gestionando desde el agendamiento de citas y facturación, hasta el control de inventario y liquidación de nómina de empleados. Está construido siguiendo estándares profesionales de desarrollo, garantizando escalabilidad y facilidad de mantenimiento.

---

## 🛠️ Tecnologías y Arquitectura

El proyecto ha sido refactorizado recientemente para cumplir con los principios **SOLID** y **Clean Architecture**.

### **Frontend (Cliente)**
*   **Framework:** React 18
*   **Estilos:** CSS3 (Diseño responsivo y personalizado)
*   **Patrones:**
    *   **Custom Hooks:** Para separar la lógica de negocio de la interfaz (ej. `useAdminData`, `useVendedorData`).
    *   **Services Layer:** Para centralizar la comunicación HTTP con la API.
    *   **Componentes:** Arquitectura modular y reutilizable.

### **Backend (Servidor)**
*   **Framework:** FastAPI (Python)
*   **Base de Datos:** MySQL
*   **Arquitectura:** Clean Architecture (Capas)
    *   **Domain:** Modelos y Entidades (Pydantic).
    *   **Infrastructure:** Repositorios y conexión a Base de Datos.
    *   **API:** Rutas y Controladores separados por contexto (`users`, `inventory`, `citas`, etc.).
    *   **Core:** Configuración centralizada.

---

## 📦 Módulos y Funcionalidades

El sistema cuenta con acceso basado en roles (**Administrador**, **Vendedor**, **Estilista**).

### 1. 🔐 Módulo de Autenticación
*   Login seguro validando credenciales y rol de usuario.
*   Redireccionamiento automático al dashboard correspondiente según el perfil.

### 2. 👨‍💼 Módulo Administrador
Diseñado para el dueño o gerente del salón.
*   **Gestión de Empleados:** CRUD completo (Crear, Leer, Actualizar, Eliminar) de personal.
*   **Control de Inventario:** Administración de productos (con reporte CSV).
*   **Liquidación de Comisiones:**
    *   Calcula automáticamente las comisiones (3%) para Estilistas y Vendedores.
    *   Muestra el "Total Bruto Generado" y la "Utilidad Neta" del negocio.
    *   Genera reportes visuales de rendimiento.

### 3. 📅 Módulo Vendedor
Diseñado para la recepción y caja.
*   **Agenda de Citas:** Visualización y gestión de citas (Cola de espera y Confirmadas).
*   **Facturación:** Generación de facturas de venta, integradas automáticamente con el reporte contable.
*   **Gestión de Clientes:** Base de datos de clientes con historial y datos de contacto (CRUD).
*   **Reporte de Ventas:** Visualización en tiempo real de lo facturado en el día.
*   **Integración WhatsApp:** Botón para confirmar citas directamente al chat del cliente.

### 4. ✂️ Módulo Estilista
Diseñado para el personal operativo.
*   **Mis Citas:** Visualización de la agenda asignada.
*   **Gestión de Servicio:** Marcar servicios como finalizados para el cálculo de comisiones.

---

## 📂 Estructura del Proyecto

```text
ladani/
├── backend/                # Servidor FastAPI
│   ├── app/
│   │   ├── api/            # Endpoints (Rutas)
│   │   ├── domain/         # Modelos de datos
│   │   ├── infrastructure/ # Repositorios SQL
│   │   └── core/           # Configuración
│   └── main.py             # Punto de entrada
│
├── src/                    # Cliente React
│   ├── components/         # Componentes visuales reutilizables
│   ├── hooks/              # Lógica de negocio (State Management)
│   ├── services/           # Conexión con Backend (Fetch)
│   ├── pages/              # Vistas principales por Rol
│   └── App.js              # Enrutamiento Principal
```

---

## ⚙️ Instalación y Ejecución

### Prerrequisitos
*   Node.js y NPM
*   Python 3.10+
*   MySQL Server

### 1. Base de Datos
Importa el script SQL en tu gestor de base de datos MySQL. Asegúrate de que la base de datos se llame `proyecto_formativo`.

### 2. Backend (Python)
```bash
cd backend
# Instalar dependencias
pip install fastapi uvicorn mysql-connector-python pydantic

# Ejecutar servidor
python main.py
```
*El servidor correrá en `http://localhost:8000`*

### 3. Frontend (React)
```bash
# En la raíz del proyecto (ladani)
npm install
npm start
```
*La aplicación abrirá en `http://localhost:3000`*