import cv2
import numpy as np
import os

def procesar_imagenes(input_dir, output_dir, imagen):
    # Cargar el clasificador pre-entrenado de detección de rostros
    face_cascade = cv2.CascadeClassifier(
        cv2.data.haarcascades + 'haarcascade_frontalface_default.xml')

    image = cv2.imread(imagen)
    gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)

    faces = face_cascade.detectMultiScale(gray,
                                          scaleFactor=1.1,
                                          minNeighbors=5,
                                          minSize=(100, 100))

    for (x, y, w, h) in faces:
        cv2.rectangle(image, (x, y), (x + w, y + h), (0, 255, 0), 2)

        # Guardar la cara recortada como una imagen
        face = image[y:y+h, x:x+w]
        cv2.imwrite(os.path.join(output_dir, 'face.jpg'), face)

    cv2.imshow('image', face)
    cv2.waitKey(0)
    cv2.destroyAllWindows()

    return 'Imagen procesada con éxito'


input_dir = './images'
output_dir = './imgProcesadas'
imagen = './imageslogin/login_emmllanitos.jpeg'

salidaimagenes = procesar_imagenes(input_dir, output_dir, imagen)
print(salidaimagenes)
