import cv2
import os


def procesar_imagenes(input_dir, output_dir):

    # Cargar el clasificador pre-entrenado de detección de rostros
    face_cascade = cv2.CascadeClassifier(
        cv2.data.haarcascades + 'haarcascade_frontalface_default.xml')

    if face_cascade.empty():
        print("El archivo XML del clasificador no se cargó correctamente.")
    else:
        print("El archivo XML del clasificador se cargó correctamente.")

    # Recorrer las carpetas de correos
    for correo_dir in os.listdir(input_dir):
        correo_path = os.path.join(input_dir, correo_dir)

        # Verificar si el elemento es una carpeta
        if os.path.isdir(correo_path):
            # Crear la carpeta correspondiente en el directorio de salida
            output_correo_dir = os.path.join(output_dir, correo_dir)
            os.makedirs(output_correo_dir, exist_ok=True)

            # Recorrer las imágenes dentro de la carpeta de correo
            for filename in os.listdir(correo_path):
                image_path = os.path.join(correo_path, filename)

                # Leer la imagen
                frame = cv2.imread(image_path)

                # Convertir la imagen a escala de grises
                gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)

                # Detectar los rostros en la imagen
                faces = face_cascade.detectMultiScale(
                    gray, scaleFactor=1.1, minNeighbors=5, minSize=(150, 150))

                for (x, y, w, h) in faces:
                    cv2.rectangle(frame, (x, y), (x + w, y + h),
                                  (0, 255, 0), 2)

                face = gray[y:y+h, x:x+w]

                # Verificar si se encontraron rostros en la imagen
                if len(faces) > 0:
                    # Tomar el primer rostro detectado
                    (x, y, w, h) = faces[0]

                    # Recortar la región del rostro
                    face = gray[y:y+h, x:x+w] 

                    # Redimensionar la región del rostro a un tamaño fijo
                    face = cv2.resize(face, (300, 300))

                    # Generar el nombre de archivo de la imagen procesada
                    processed_image_name = f'processed_{filename}'
                    processed_image_path = os.path.join(
                        output_correo_dir, processed_image_name)

                    # Guardar la imagen procesada en disco
                    cv2.imwrite(processed_image_path, face)

    return 'Imagenes procesadas con exito'


input_dir = './images'

output_dir = './imgProcesadas'

salidaimagenes = procesar_imagenes(input_dir, output_dir)

print(salidaimagenes)
