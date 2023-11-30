from flask import Blueprint, request, jsonify
from flask_bcrypt import Bcrypt
import jwt
from datetime import datetime, timedelta
from common.jwt import SECRET_KEY
from marshmallow import Schema, fields, ValidationError, validate, validates_schema
from infrastructure.db import db
from common.constants import UserRoleEnum
from routes.user.models import User 

auth_blueprint = Blueprint('auth', __name__)
bcrypt = Bcrypt()

class UserRegistrationSchema(Schema):
    username = fields.String(required=True, validate=lambda x: not User.query.filter_by(username=x).first(), error="Username already exists.")
    password = fields.String(required=True, validate=validate.Length(min=6, error="Password must be at least 6 characters long."))
    role = fields.String(default=UserRoleEnum.USER.value)

    @validates_schema
    def validate_role(self, data, **kwargs):
        role = data.get('role', UserRoleEnum.USER.value)
        if role not in [role.value for role in UserRoleEnum]:
            raise ValidationError("Only 'admin' or 'user' allowed for role")
        

@auth_blueprint.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    schema = UserRegistrationSchema()
    try:
        data = schema.load(data)
    except ValidationError as err:
        if 'username' in err.messages:
            return {"success": False, "error": "username already taken"}, 400
        else:
            return {"success": False, "error": err.messages}, 400
        
    role = data.get('role', 'user')

    hashed_password = bcrypt.generate_password_hash(data['password']).decode('utf-8')
    new_user = User(username=data['username'], password=hashed_password, role=role)
    db.session.add(new_user)
    db.session.commit()

    return {
        'success': True,
        'id': new_user.id,
        'username': new_user.username,
        'role': new_user.role
    }

@auth_blueprint.route('/login', methods=['POST'])
def login():
    data = request.get_json()

    username = data["username"]
    password = data["password"]

    user = User.query.filter_by(username=username).first()
    if not user:
        return {"error": "Username or password invalid"}, 400
    
    valid_password = bcrypt.check_password_hash(user.password, password)
    if not valid_password:
        return {"error": "Username or password invalid"}, 400
    
    payload = {
        'userid': user.id,
        'username': user.username,
        'role': user.role,
        'exp': datetime.utcnow() + timedelta(minutes=15)
    }
    token = jwt.encode(payload, SECRET_KEY, algorithm="HS256")
    
    return {
        'id': user.id,
        'username': user.username,
        'token': token
    }
