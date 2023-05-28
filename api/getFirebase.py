import firebase_admin
from firebase_admin import credentials
from firebase_admin import auth

# Cargar las credenciales del servidor de Firebase
cred = credentials.Certificate(
    "banpapaya-app-firebase-adminsdk-9g0ud-9bcafa0782.json")

# Inicializar la aplicación con las credenciales
firebase_admin.initialize_app(cred)


def getValidOpenCV(email):
    """
    Esta función verifica si un usuario con un correo electrónico dado existe en Firebase.
    Args:
        email: Una cadena que representa el correo electrónico del usuario.

    Returns:
        True si el usuario existe, genera una excepción si ocurre un error.
    """
    try:
        # Obtener los detalles del usuario desde Firebase
        user = auth.get_user_by_email(email)

        # Verificar si el ID de usuario es válido
        if len(user.uid) > 0:
            salida = user.uid
        else:
            salida = 'Uid no encontrado'

        return True
    except Exception as e:
        # Manejar cualquier excepción que pueda ocurrir
        print(f"Ha ocurrido una excepción: {e}")
