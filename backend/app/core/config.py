import os

class Config:
    DB_HOST = os.getenv("DB_HOST", "localhost")
    DB_USER = os.getenv("DB_USER", "root")
    DB_PASS = os.getenv("DB_PASS", "1234")
    DB_NAME = os.getenv("DB_NAME", "proyecto_formativo")

db_config = {
    'host': Config.DB_HOST,
    'user': Config.DB_USER,
    'password': Config.DB_PASS,
    'database': Config.DB_NAME
}
