from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
import os
from dotenv import load_dotenv

# Incarca variabilele de mediu din fisierul .env
load_dotenv()

# Citim DATABASE_URL din variabilele de mediu
DATABASE_URL = os.getenv("DATABASE_URL")

# Afisam URL-ul bazei de date pentru debugging
print(f"DEBUG: DATABASE_URL citit din .env: {DATABASE_URL}")

# Configurarea engine-ului SQLAlchemy
# Pentru SQLite, adaugam connect_args pentru a permite mai multe thread-uri.
# Altfel, SQLAlchemy ar putea genera erori daca mai multe request-uri incearca sa acceseze baza de date simultan.
if DATABASE_URL and DATABASE_URL.startswith("sqlite:///"):
    engine = create_engine(
        DATABASE_URL, connect_args={"check_same_thread": False}
    )
elif DATABASE_URL: # Pentru alte tipuri de baze de date (ex: PostgreSQL)
    engine = create_engine(DATABASE_URL)
else:
    # In cazul in care DATABASE_URL nu este setat, vom afisa o eroare si vom iesi.
    # Acest lucru nu ar trebui sa se intample daca .env este corect.
    raise ValueError("DATABASE_URL nu este setat in fisierul .env. Asigura-te ca este configurat corect.")


SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
