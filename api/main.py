from fastapi import FastAPI, UploadFile, File, Form, HTTPException
import os
from fastapi.middleware.cors import CORSMiddleware
from getFace import procesar_imagenes
from getEntrenar import train_model
from getComparaImagen import predict_person
from typing import List

# Crea la aplicación FastAPI
app = FastAPI()

# Agrega el middleware CORS para permitir solicitudes desde cualquier origen
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Define las rutas del API
routes = {'fbAuth': '/api/firebase/auth/',
          'fbDb': '/api/firebase/db/',
          'fbStorage': '/api/firebase/storage/',
          'fbFirestone': '/api/firebase/firestone/',
          'fbOpenCV': '/api/openCV/',
          'fbArchivo': '/api/archivo/',
          'fbArchivoLogin': '/api/filelogin/'}

# Define los directorios para guardar y procesar las imágenes
register_input_dir = './images'
register_output_dir = './imgProcesadas'
login_input_dir = './imageslogin'
login_output_dir = './imagesloginProcesadas'


@app.get('/')
def index():
    # Endpoint de la página de inicio que devuelve información básica
    salida = {
        'title': 'Prueba API Home',
        'by': 'Edwar Mayorga',
        'code': 'SOF320231001',
        'university': 'Fundación Escuela Tecnológica de Neiva: FET',
        'age': 2023
    }

    return salida


@app.post(routes['fbArchivo'])
async def archivo(email: str = Form(...), files: List[UploadFile] = File(...)):
    # Endpoint para subir múltiples archivos e iniciar el procesamiento y entrenamiento
    try:
        # Define la ruta del directorio
        directory_path = f"images/{email}"

        # Comprueba si existe el directorio, si no, lo crea
        if not os.path.exists(directory_path):
            os.makedirs(directory_path)

        for file in files:
            # Guarda el archivo de imagen
            file_path = os.path.join(directory_path, file.filename)
            with open(file_path, "wb") as myfile:
                content = await file.read()
                myfile.write(content)

        # Procesa las imágenes y entrena el modelo
        salidaimagenes = procesar_imagenes(
            register_input_dir, register_output_dir)
        print('Register: '+str(salidaimagenes))
        resultado = train_model()
        print(resultado)

        return {"status": "success", "message": "Archivos cargados correctamente"}

    except Exception as e:
        # Manejo de excepciones HTTP
        raise HTTPException(status_code=500, detail=str(e))


@app.post(routes['fbArchivoLogin'])
async def archivologin(email: str = Form(...), file: UploadFile = File(...)):
    # Endpoint para subir un solo archivo e iniciar la predicción
    try:

        # Define la ruta del directorio
        directory_path = f"imageslogin/{email}"

        # Comprueba si existe el directorio, si no, lo crea
        if not os.path.exists(directory_path):
            os.makedirs(directory_path)

        # Define la ruta del directorio
        file_path = f"{directory_path}/{file.filename}"
        route_path = f"{directory_path}/"

        # Comprueba si existe el directorio, si no, lo crea
        if not os.path.exists(route_path):
            os.makedirs(route_path)

        # Guarda el archivo de imagen
        with open(file_path, "wb") as myfile:
            content = await file.read()
            myfile.write(content)

        # Procesa las imágenes y realiza la predicción
        salidaimagenes = procesar_imagenes(login_input_dir, login_output_dir)
        print('Login: '+str(salidaimagenes))
        resultadoComparacion = predict_person(file_path)
        print("La imagen es reconocida como: " + str(resultadoComparacion))
        print('email entrante: '+str(email))

        # Verifica si el resultado de la predicción coincide con el email proporcionado
        if resultadoComparacion == email:
            return {"status": "success"}
        else:
            return {"status": "error"}

    except Exception as e:
        # Manejo de excepciones HTTP
        raise HTTPException(status_code=500, detail=str(e))
