import os
import cv2
import numpy as np
from sklearn.svm import SVC
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score
from sklearn.preprocessing import LabelEncoder
import joblib


def train_model():
    """
    Esta función se utiliza para entrenar un modelo de clasificación de imágenes.
    """
    # Directorio raíz de las imágenes de entrenamiento
    train_dir = './imgProcesadas'

    # Inicialización de listas para almacenar las imágenes de entrenamiento y sus respectivas etiquetas
    X_train = []
    y_train = []
    labels = []

    # Recorriendo todos los subdirectorios en el directorio raíz de las imágenes de entrenamiento
    for person_folder in os.listdir(train_dir):
        person_folder_path = os.path.join(train_dir, person_folder)

        # Verificando si el elemento actual es un directorio
        if os.path.isdir(person_folder_path):
            labels.append(person_folder)

            # Recorriendo todos los archivos de imagen en el directorio actual
            for file_name in os.listdir(person_folder_path):
                if file_name.endswith('.jpeg'):
                    image_path = os.path.join(person_folder_path, file_name)
                    image = cv2.imread(image_path, cv2.IMREAD_GRAYSCALE)

                    # Asegurándose de que la imagen se haya leído correctamente
                    if image is not None:
                        X_train.append(image)
                        y_train.append(person_folder)

    # Convertir las listas a matrices numpy para procesamiento posterior
    X_train = np.array(X_train)
    y_train = np.array(y_train)

    # Verificando si se encontraron imágenes de entrenamiento válidas
    if len(X_train) > 0:
        # Redimensionando las imágenes para garantizar que todas las imágenes tengan el mismo tamaño
        X_train = np.array([cv2.resize(image, (300, 300))
                           for image in X_train])

        # Aplanando las imágenes en formato 1D para el entrenamiento del modelo
        X_train = X_train.reshape(X_train.shape[0], -1)

        # Codificando las etiquetas de las clases
        label_encoder = LabelEncoder()
        y_train = label_encoder.fit_transform(y_train)

        # Verificar el número de clases
        unique_classes = np.unique(y_train)
        if len(unique_classes) < 2:
            # Agregar una clase ficticia para evitar el error
            X_train = np.concatenate((X_train, X_train[:1]))
            y_train = np.concatenate((y_train, np.array([1])))

        # Dividir los datos en conjuntos de entrenamiento y prueba
        X_train, X_test, y_train, y_test = train_test_split(
            X_train, y_train, test_size=0.2, random_state=42)

        # Crear el modelo SVC y entrenarlo
        clf = SVC(probability=True)
        clf.fit(X_train, y_train)

        # Realizar predicciones en el conjunto de prueba y calcular la precisión del modelo
        y_pred = clf.predict(X_test)
        accuracy = accuracy_score(y_test, y_pred)
        print("Precisión del modelo: {:.2f}%".format(accuracy * 100))

        # Guardar el modelo entrenado y el codificador de etiquetas para su uso posterior
        model_path = './model/modelo_entrenado.pkl'
        joblib.dump(clf, model_path)
        label_encoder_path = './model/label_encoder.pkl'
        joblib.dump(label_encoder, label_encoder_path)

        return "Modelo entrenado"
    else:
        print("No se encontraron imágenes válidas en el directorio de entrenamiento.")
        return None


# Llamar a la función para entrenar el modelo y mostrar el resultado
resultado = train_model()
print(resultado)
