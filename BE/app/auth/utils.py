import jwt
from flask import request

def get_token():
    auth_header = request.headers.get('Authorization')

    if not auth_header:
        return None

    token = auth_header.split(' ')[1]
    
    try:
        decoded_token = jwt.decode(token, 'your_jwt_secret_key', algorithms=['HS256'])
        return decoded_token
    except jwt.ExpiredSignatureError:
        print('Token has expired')
        return None
    except jwt.InvalidTokenError:
        print('Invalid token')
        return None

def logged_user(decoded_token):
    return {
        'userRole': decoded_token.get('role'),
        'username': decoded_token.get('username'),
        'userId': decoded_token.get('id')
    }