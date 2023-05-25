from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from getFirebase import routes, getValidOpenCV

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get('/')
def index():
    salida = {'tittle': 'Prueba API Home',
              'by': 'Edwar Mayorga',
              'code': 'SOF320231001',
              'university': 'Fundación Escuela Tecnológica de Neiva: FET',
              'age': 2023, }
    return salida


@app.get(routes['fbOpenCV']+'{email}')
def getOpenCV(email):
    salida = getValidOpenCV(email)
    return salida
