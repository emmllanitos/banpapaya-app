import firebase_admin
from firebase_admin import credentials
from firebase_admin import auth

cred = credentials.Certificate(
    "banpapaya-app-firebase-adminsdk-9g0ud-9bcafa0782.json")
firebase_admin.initialize_app(cred)

routes = {'fbAuth': '/api/firebase/auth/',
          'fbDb': '/api/firebase/db/',
          'fbStorage': '/api/firebase/storage/',
          'fbFirestone': '/api/firebase/firestone/',
          'fbTensorFlow': '/api/tensorflow/'}


def getValidTensorFlow(email):
    try:
        user = auth.get_user_by_email(email)

        if len(user.uid) > 0:
            salida = user.uid
        else:
            salida = 'Uid no encontrado'

        return True
    except Exception as e:
        print(f"Ha ocurrido una excepción: {e}")
