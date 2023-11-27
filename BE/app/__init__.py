from flask import Flask
from app.infrastructure.db import db, db_init
from app.auth.apis import auth_blueprint
from app.user.apis import user_blueprint
from app.todo.apis import todo_blueprint

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql://postgres:Revouprojectweek22@db.xhndjeumvhdjnqvwkuqj.supabase.co:5432/postgres'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False


db.init_app(app)

app.register_blueprint(auth_blueprint, url_prefix='/auth')
app.register_blueprint(user_blueprint, url_prefix='/users')
app.register_blueprint(todo_blueprint, url_prefix='/todo')

# with app.app_context():
#     db_init()
