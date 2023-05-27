import cv2
import numpy as np
import joblib


def predict_person(image_path):
    # Cargar el modelo entrenado
    clf = joblib.load('./model/modelo_entrenado.pkl')

    # Cargar el codificador de etiquetas
    label_encoder = joblib.load('./model/label_encoder.pkl')

    # Cargar la imagen a comparar
    image = cv2.imread(image_path, cv2.IMREAD_GRAYSCALE)

    result = "No se pudo cargar la imagen correctamente."
    # Verificar que la imagen se haya cargado correctamente
    if image is not None:
        # Redimensionar la imagen si es necesario
        image = cv2.resize(image, (1000, 600))

        # Aplanar la imagen en un formato 1D
        image = image.reshape(1, -1)

        # Realizar la predicción con el modelo
        predicted_label = clf.predict(image)

        # Decodificar la etiqueta de la clase predicha
        predicted_person = label_encoder.inverse_transform(predicted_label)

        # Mostrar el resultado de la predicción
        result = predicted_person[0]

    return result
