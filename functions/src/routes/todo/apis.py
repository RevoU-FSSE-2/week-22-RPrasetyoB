from flask import Blueprint, jsonify, request
from infrastructure.db import db
from routes.todo.models import Todo
from routes.auth.utils import get_token, logged_user
from sqlalchemy.exc import SQLAlchemyError


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
        user_role, username, userid = user_info['userRole'], user_info['username'], user_info['userId']
        print('test', user_role, username, userid)

        if user_role == "admin":
            todos = Todo.query.filter_by(is_deleted=False).all()
        elif user_role == "user":
            todos = Todo.query.filter_by(maker=username, is_deleted=False).all()
        else:
            return jsonify({
                'success': False,
                'message': 'Please login first'
            }), 403

        todo_list = [{
            'id': todo.id,
            'todo': todo.todo,
            'status': todo.status,
            'due_date' : todo.due_date,
            'priority': todo.priority,
            'maker': todo.maker
        } for todo in todos]

        return jsonify({
            'success': True,
            'message': 'Successfully fetched all todo',
            'result': {'data': todo_list},
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

        if priority not in ['high', 'medium', 'low']:
            return jsonify({
                'success': False,
                'message': 'Only high, medium, low allowed in priority'
            }), 400
        
        new_todo = Todo(todo=todo, priority=priority, maker=username)
        db.session.add(new_todo)
        db.session.commit()

        return jsonify({
            'success': True,
            'message': 'Add new todo success',
            'data': {
                'id': new_todo.id,
                'todo': new_todo.todo,
                'due_date' : new_todo.due_date,
                'priority': new_todo.priority,
                'maker': new_todo.maker
            }
        })

    except Exception as error:
        print(error)
        return jsonify({
            'message': str(error)
        }), 500



@todo_blueprint.route('/<int:todoid>', methods=['DELETE'])
def delete_todo(todoid):
    try:
        token = get_token()
        if not token:
            return jsonify({
                'success': False,
                'message': 'Unauthorized, please login'
            }), 401

        user_info = logged_user(token)
        username = user_info['username']

        todo_to_delete = Todo.query.filter_by(id=todoid, is_deleted=False).first()

        if not todo_to_delete:
            return jsonify({
                'success': False,
                'message': 'Todo not found or already deleted'
            }), 404

        if todo_to_delete.maker != username:
            return jsonify({
                'success': False,
                'message': 'You do not have permission to delete this todo'
            }), 403

        # Mark todo as deleted
        todo_to_delete.is_deleted = True
        db.session.commit()

        return jsonify({
            'success': True,
            'message': 'Todo deleted successfully'
        })

    except SQLAlchemyError as error:
        print(error)
        db.session.rollback()
        return jsonify({
            'success': False,
            'message': 'Failed to delete todo'
        }), 500
    

@todo_blueprint.route('/<int:todoid>', methods=['PUT'])
def update_todo(todoid):
    try:
        token = get_token()
        if not token:
            return jsonify({
                'success': False,
                'message': 'Unauthorized, please login'
            }), 401

        user_info = logged_user(token)
        username = user_info['username']

        todo_update = Todo.query.filter_by(id=todoid, is_deleted=False).first()

        if not todo_update:
            return jsonify({
                'success': False,
                'message': 'Todo not found or already deleted'
            }), 404

        if todo_update.maker != username:
            return jsonify({
                'success': False,
                'message': 'You do not have permission to update this todo'
            }), 403

        required_fields = ['todo', 'status', 'priority', 'due_date'] 


        if not any(field in request.json for field in required_fields):
            return jsonify({
                'success': False,
                'message': f"At least one of {', '.join(required_fields)} is required for updating the todo"
            }), 400
        
        todo_update.todo = request.json.get('todo', todo_update.todo)
        todo_update.status = request.json.get('status', todo_update.status)
        todo_update.priority = request.json.get('priority', todo_update.priority)
        todo_update.due_date = request.json.get('due_date', todo_update.due_date)

        db.session.commit()

        return jsonify({
            'success': True,
            'message': 'Todo updated successfully',
            'updatedData': {
                'todo': todo_update.todo,
                'status': todo_update.status,
                'due_date': todo_update.due_date.strftime('%d/%m/%Y')
            }
        })

    except SQLAlchemyError as error:
        print(error)
        db.session.rollback()
        return jsonify({
            'success': False,
            'message': 'Failed to update todo'
        }), 500