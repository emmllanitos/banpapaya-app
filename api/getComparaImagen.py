import cv2
import joblib


def predict_person(image_path):
    """
    Esta función se utiliza para predecir la persona en una imagen proporcionada utilizando un modelo previamente entrenado.
    """

    # Cargando el modelo previamente entrenado desde el archivo
    clf = joblib.load('./model/modelo_entrenado.pkl')

    # Cargando el codificador de etiquetas usado para codificar las etiquetas de las clases durante el entrenamiento
    label_encoder = joblib.load('./model/label_encoder.pkl')

    # Cargando la imagen desde la ruta proporcionada
    image = cv2.imread(image_path, cv2.IMREAD_GRAYSCALE)

    result = "No se pudo cargar la imagen correctamente."
    # Verificando que la imagen se haya cargado correctamente
    if image is not None:
        # Redimensionando la imagen para que coincida con el tamaño que el modelo espera
        image = cv2.resize(image, (300, 300))

        # Aplanando la imagen en un formato 1D para que se pueda alimentar al modelo
        image = image.reshape(1, -1)

        # Usando el modelo para predecir la etiqueta de la clase de la imagen
        predicted_label = clf.predict(image)

        # Decodificando la etiqueta de la clase predicha para obtener el nombre de la persona
        predicted_person = label_encoder.inverse_transform(predicted_label)

        # Estableciendo el resultado a retornar
        result = predicted_person[0]

    # Retornando el resultado
    return result
