from flask import Blueprint, jsonify, request
from app.todo.models import Todo
from app.auth.utils import get_token, logged_user

todo_blueprint = Blueprint('todo', __name__)

@todo_blueprint.route('', methods=['GET'])
def get_all_todo():
    try:
        token = get_token()
        if not token:
            return jsonify({
                'success': False,
                'message': 'Unauthorized, please login'
            }), 401

        user_info = logged_user(token)
        user_role, username, user_id = user_info['userRole'], user_info['username'], user_info['userId']
        print('test', user_role, username, user_id)

        if user_role == "admin":
            todos = Todo.query.all()
        elif user_role == "guest":
            todos = Todo.query.filter_by(maker=username).all()
        else:
            return jsonify({
                'success': False,
                'message': 'Please login first'
            }), 403

        todo_list = [{
            'id': todo.id,
            'todo': todo.todo,
            'priority': todo.priority,
            'maker': todo.maker
        } for todo in todos]

        return jsonify({
            'success': True,
            'message': 'Successfully fetched all todo',
            'result': todo_list,
            'user': username,
            'role': user_role
        })

    except Exception as error:
        print(error)
        return jsonify({
            'success': False,
            'message': 'Failed to get todos'
        }), 500

@todo_blueprint.route('', methods=['POST'])
def create_todo():
    try:
        token = get_token()
        if not token:
            return jsonify({
                'success': False,
                'message': 'Unauthorized, please login'
            }), 401

        user_info = logged_user(token)
        username = user_info['username']

        data = request.get_json()
        todo = data.get('todo')
        priority = data.get('priority')

        new_todo = Todo(todo=todo, priority=priority, maker=username)
        new_todo.save()

        return jsonify({
            'success': True,
            'message': 'Add new todo success',
            'data': {
                'id': new_todo.id,
                'todo': new_todo.todo,
                'priority': new_todo.priority,
                'maker': new_todo.maker
            }
        })

    except Exception as error:
        print(error)
        return jsonify({
            'message': str(error)
        }), 500
