from fastapi import FastAPI, UploadFile, File, Form, HTTPException
import os
from fastapi.middleware.cors import CORSMiddleware
from getFirebase import getValidOpenCV
from getFace import procesar_imagenes
from getEntrenar import train_model
from getComparaImagen import predict_person
from typing import List
import subprocess


app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


routes = {'fbAuth': '/api/firebase/auth/',
          'fbDb': '/api/firebase/db/',
          'fbStorage': '/api/firebase/storage/',
          'fbFirestone': '/api/firebase/firestone/',
          'fbOpenCV': '/api/openCV/',
          'fbArchivo': '/api/archivo/',
          'fbArchivoLogin': '/api/filelogin/'}

input_dir = './images'

output_dir = './imgProcesadas'


@app.get('/')
def index():
    # Página de inicio
    salida = {
        'title': 'Prueba API Home',
        'by': 'Edwar Mayorga',
        'code': 'SOF320231001',
        'university': 'Fundación Escuela Tecnológica de Neiva: FET',
        'age': 2023
    }

    return salida


@app.get(routes['fbOpenCV']+'{email}')
def getOpenCV(email):
    # Obtener datos de OpenCV válidos
    salida = getValidOpenCV(email)
    return salida


@app.post(routes['fbArchivo'])
async def archivo(email: str = Form(...), files: List[UploadFile] = File(...)):
    try:
        # Define the directory path
        directory_path = f"images/{email}"

        # Check if directory exists, if not, create it
        if not os.path.exists(directory_path):
            os.makedirs(directory_path)

        for file in files:
            # Save the image file
            file_path = os.path.join(directory_path, file.filename)
            with open(file_path, "wb") as myfile:
                content = await file.read()
                myfile.write(content)

        salidaimagenes = procesar_imagenes(input_dir, output_dir)

        print(salidaimagenes)

        resultado = train_model()

        print(resultado)

        return {"status": "success", "message": "Archivos cargados correctamente"}

    except Exception as e:
        # HTTP exception handling
        raise HTTPException(status_code=500, detail=str(e))


@app.post(routes['fbArchivoLogin'])
async def archivologin(email: str = Form(...), file: UploadFile = File(...)):
    try:
        # Define the directory path
        file_path = f"imageslogin/{file.filename}"
        route_path = "imageslogin/"

        # Check if directory exists, if not, create it
        if not os.path.exists(route_path):
            os.makedirs(route_path)

        with open(file_path, "wb") as myfile:
            content = await file.read()
            myfile.write(content)

        image_path = f"imageslogin/{file.filename}"

        resultadoComparacion = predict_person(image_path)

        print("La imagen es reconocida como: " + str(resultadoComparacion))
        print('email entrante: '+str(email))

        if resultadoComparacion == email:
            return {"status": "success"}
        else:
            return {"status": "error"}

    except Exception as e:
        # HTTP exception handling
        raise HTTPException(status_code=500, detail=str(e))
