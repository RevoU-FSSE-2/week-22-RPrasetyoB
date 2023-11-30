from flask import Blueprint, jsonify
from routes.user.models import User

user_blueprint = Blueprint('user', __name__)

@user_blueprint.route('', methods=['GET'])
def get_all_users():
    try:
        users = User.query.all()

        user_list = [{
            'username': user.username,
            'role': user.role
        } for user in users]

        return jsonify({
            'success': True,
            'message': 'Successfully get all users',
            'users': user_list
        })
    except Exception as e:
        print(e)
        return jsonify({
            'success': False,
            'message': 'Failed to get all users'
        }), 400

@user_blueprint.route('/logout', methods=['POST'])
def logout():
    response = jsonify({
        'success': True,
        'message': 'Successfully logout'
    })
    response.delete_cookie('access_token', path='/')
    response.delete_cookie('refresh_token', path='/')
    
    return response