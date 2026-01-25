from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.routes import users, inventory, citas, facturas, clientes

def create_app() -> FastAPI:
    app = FastAPI(title="La Dani API", version="2.0.0")

    app.add_middleware(
        CORSMiddleware,
        allow_origins=["*"],
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    # Incluir Rutas
    app.include_router(users.router, tags=["Users"])
    app.include_router(inventory.router, tags=["Inventory"])
    app.include_router(citas.router, tags=["Citas"])
    app.include_router(facturas.router, tags=["Facturas"])
    app.include_router(clientes.router, tags=["Clientes"])

    @app.get("/")
    async def root():
        return {"message": "Backend La Dani with Clean Architecture is running"}

    return app

app = create_app()
