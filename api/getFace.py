import cv2
import os

# Función que procesa las imágenes, detectando y recortando rostros


def procesar_imagenes(input_dir, output_dir):

    # Carga el clasificador pre-entrenado de detección de rostros
    face_cascade = cv2.CascadeClassifier(
        cv2.data.haarcascades + 'haarcascade_frontalface_default.xml')

    # Verifica si el archivo XML del clasificador ha sido cargado correctamente
    if face_cascade.empty():
        print("El archivo XML del clasificador no se cargó correctamente.")
    else:
        print("El archivo XML del clasificador se cargó correctamente.")

    # Recorre el directorio de entrada
    for correo_dir in os.listdir(input_dir):
        correo_path = os.path.join(input_dir, correo_dir)

        # Si el elemento es un directorio, procede a procesar las imágenes dentro de él
        if os.path.isdir(correo_path):
            # Crea el directorio correspondiente en la carpeta de salida
            output_correo_dir = os.path.join(output_dir, correo_dir)
            os.makedirs(output_correo_dir, exist_ok=True)

            # Recorre todas las imágenes en el directorio actual
            for filename in os.listdir(correo_path):
                image_path = os.path.join(correo_path, filename)

                # Lee la imagen del archivo
                frame = cv2.imread(image_path)

                # Convierte la imagen a escala de grises
                gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)

                # Detecta los rostros en la imagen
                faces = face_cascade.detectMultiScale(
                    gray, scaleFactor=1.1, minNeighbors=5, minSize=(150, 150))

                # Recorre todos los rostros detectados y dibuja un rectángulo alrededor de cada rostro
                for (x, y, w, h) in faces:
                    cv2.rectangle(frame, (x, y), (x + w, y + h),
                                  (0, 255, 0), 2)

                # Verifica si se encontraron rostros en la imagen
                if len(faces) > 0:
                    # Tomar el primer rostro detectado
                    (x, y, w, h) = faces[0]

                    # Recorta la región del rostro en la imagen
                    face = gray[y:y+h, x:x+w]

                    # Redimensiona el rostro a un tamaño fijo
                    face = cv2.resize(face, (300, 300))

                    # Genera el nombre de la imagen procesada
                    processed_image_name = f'processed_{filename}'
                    processed_image_path = os.path.join(
                        output_correo_dir, processed_image_name)

                    # Guarda la imagen procesada en el directorio de salida
                    cv2.imwrite(processed_image_path, face)

    # Retorna una confirmación de que todas las imágenes fueron procesadas
    return 'Imagenes procesadas con exito'


# Llamar a la función para procesar las imagenes de usuario registrados
register_input_dir = './images'
register_output_dir = './imgProcesadas'
salidaimagenes = procesar_imagenes(register_input_dir, register_output_dir)
print(salidaimagenes)
