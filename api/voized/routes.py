from voized import app
from voized.models import User
from flask import request, jsonify,make_response, g
from flask_httpauth import HTTPBasicAuth

auth = HTTPBasicAuth()


@auth.verify_password
def verify_password(username, password):
    return True

@app.route('/user/login', methods = ["POST"])
def login_user():
    if request.method == "POST":
        print(request.json)
    username = request.json.get('username')
    password = request.json.get('password')
    return { "name":"fred" }, 200

@app.route("/user/register", methods = ["POST"])
def register_user():
    try:
        username = request.json.get("username")
        password = request.json.get("password")
        email = request.json.get("email")
        if username is None or password is None:
            return {"status": "error", "message":"Input a valid username or pasoword!"}, 400
        if  User.query.filter_by(username = username).first():
            return {"status": "error", "message": "Username already taken."}, 409
        if User.query.filter_by(email = email).first():
            return {"status": "error", "message": "Email already taken."}, 400

        user = User(username=username, password=password, email=email)
        token = user.generate_web_token()
        db.session.add(user)
        db.session.commit()

        return jsonify({ "username": username, "token": token, "exp_sec":259200}), 201