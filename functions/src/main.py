import os
from flask import Flask
from flask_cors import CORS
from firebase_functions import https_fn
from routes.user.apis import user_blueprint
from routes.auth.apis import auth_blueprint
from routes.todo.apis import todo_blueprint
from infrastructure.db import db, db_init
from common.jwt import SECRET_KEY
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)
@app.route("/", methods=["GET"])

def health_check():
    return "Welcome to RPB API", 200

CORS(app, resources={r"/*": {"origins": ["http://localhost:5173","https://week22-revou-milestone4.web.app"]}})
app.config['SECRET_KEY'] = SECRET_KEY


@app.after_request
def add_secure_headers(response):
    response.headers['Content-Security-Policy'] = "default-src 'self'; style-src 'self' 'unsafe-inline'; script-src 'self' 'unsafe-inline' https://cdnjs.cloudflare.com; frame-ancestors 'self'"
    response.headers['X-Frame-Options'] = 'SAMEORIGIN'
    response.headers['Strict-Transport-Security'] = 'max-age=31536000; includeSubDomains'
    response.headers['Referrer-Policy'] = 'strict-origin'
    response.headers['X-Content-Type-Options'] = 'nosniff'
    response.headers['Permissions-Policy'] = "geolocation 'self'; microphone 'none'; camera 'none'"
    return response

app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql://postgres:Revouprojectweek22@db.xhndjeumvhdjnqvwkuqj.supabase.co:5432/postgres'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db.init_app(app)

app.register_blueprint(auth_blueprint, url_prefix='/auth')
app.register_blueprint(user_blueprint, url_prefix='/users')
app.register_blueprint(todo_blueprint, url_prefix='/todo')


@https_fn.on_request(max_instances=1)
def week22_rpb(req: https_fn.Request) -> https_fn.Response:
    with app.request_context(req.environ):
        return app.full_dispatch_request()

if __name__ == "__main__":
    app.run(debug=True,host='0.0.0.0',port=int(os.environ.get('PORT', 80)))
    
# with app.app_context():
#     db_init()
