import os
from voized import app, db
from voized.models import User, Room
from voized.config import basedir
from voized.utils import save_image, remove_user_image
from flask import request, jsonify,make_response, g, url_for
from flask_httpauth import HTTPBasicAuth
from sqlalchemy import literal

auth = HTTPBasicAuth()


@auth.verify_password
def verify_password(username_or_token, password):
    if not (username_or_token or password):
        return False
    user = User.verify_web_token(username_or_token)
    print(user)
    print("username",username_or_token)
    if not user:
        user = User.query.filter_by(username=username_or_token).first()
        if (not user) or (not user.validate_password(password)):
            return False
    g.user = user
    return True

@app.route('/user/login', methods = ["POST"])
def login_user():
    if request.method == "POST":
        print(request.json)
    username = request.json.get('username').lower().strip(" ")
    password = request.json.get('password')
    if username is None or password is None:
        return jsonify({"status": "error", "message":"Input a valid username or password!"}), 400
    user = User.query.filter_by(username=username).first() or User.query.filter_by(email = username).first()
    if (not user) or (not user.validate_password(password)):
        return jsonify({"status": "error", "message":"Invaid username or password!"}), 400
    token = user.generate_web_token(9999999999)
    return jsonify(user=user.serialize, status='success',  token=token), 200


@app.route("/user/register", methods = ["POST"])
def register_user():
    try:
        username = request.json.get('username').lower().strip(" ")
        password = request.json.get('password')
        email = request.json.get("email").lower().strip(" ")
        if username is None or password is None:
            return {"status": "error", "message":"Input a valid username or password!"}, 400
        if  User.query.filter_by(username = username).first():
            return {"status": "error", "message": "Username already taken."}, 409
        if User.query.filter_by(email = email).first():
            return {"status": "error", "message": "Email already taken."}, 400

        user = User(username=username, password=password, email=email)
        db.session.add(user)
        db.session.commit()
        token = user.generate_web_token(9999999999)
        return jsonify(user=user.serialize, status='success',  token=token), 201
    except Exception as e:
        return jsonify({"status": "error", "message": "An unknwon error occured!"})

    
@app.route("/user/<int:id>", methods=["GET"])
@auth.login_required
def get_user(id):
    user = User.query.get(id)
    if user:
        return jsonify(status="success", user=user.serialize), 200
    else:
        return jsonify(status="error", message="Error Invalid id"), 400

    
@app.route("/user/<int:id>/contacts", methods=["GET"])
@auth.login_required
def get_user_contacts(id):
    user = User.query.get(id)
    if user:
        return jsonify(status="success", contacts=[contact.serialize for contact in user.contacts]), 200
    else:
        return jsonify(status="error", message="Error Invalid id"), 400

@app.route("/user/contacts/new", methods=["GET"])
@auth.login_required
def get_contacts():
    try:
        id = request.args.get("id")
        contact = User.query.get(id)
        g.user.add_contact(contact)
        return jsonify(status="success", contacts=[contact.serialize for contact in g.user.contacts]), 201
    except Exception:
        return jsonify({"status": "error", "message":"Error Invalid id"}), 400


@app.route("/user/search")
@auth.login_required
def search_user():
    try:
        query = request.args['q']
        users = User.query.filter(User.username.ilike("%" + query + "%"))
        return jsonify(status="success", users=[ user.serialize for user in users]), 200
    except KeyError:
        return jsonify({"status": "error", "message": "Please input a valid url argument."}), 405

@app.route("/user/rooms")
@auth.login_required 
def get_user_rooms():
    return jsonify([ room.serialize for room in g.user.rooms])

@app.route("/room/new")
@auth.login_required
def create_room():
    try:
        name = request.args.get("name")
        description = request.args.get("brief")
        category = request.args.get("category")
        room = Room(name, category, description)
        db.session.add(room)
        db.session.commit()
        return jsonify(status="success", room=room.serialize), 201
    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 400

@app.route("/room/<int:id>", methods=["GET"])
@auth.login_required
def get_room(id):
    room = Room.query.get(id)
    if room:
        return jsonify(status="success", room=room.serialize), 200
    else:
        return jsonify(status="error", message="Invaid id"), 400
    

@app.route("/room/category/<category>", methods=["GET"])
@auth.login_required
def get_category_rooms(category):
    rooms = Room.query.filter_by(category=category)
    return jsonify(status="success", rooms=[ room.serialize for room in rooms])

@app.route("/room/search")
@auth.login_required
def search_room():
    try:
        query = request.args['q']
        rooms = Room.query.filter(Room.username.ilike("%" + query + "%"))
        return jsonify(status="success", rooms=[ room.serialize for room in rooms]), 200
    except KeyError:
        return jsonify({"status": "error", "message": "Please input a valid url argument."}), 405

    
@app.route("/user/<int:user_id>/profile-pic/upload", methods=["POST"])
@auth.login_required
def upload_image(user_id):
    image = request.files["file"]
    user = User.query.get(user_id)
    if user:
        remove_user_image(user)
        profile_pic = save_image(image)
        user.profile_pic = profile_pic
        db.session.commit()
        image_path = url_for("static", filename="profile_pic/"+profile_pic, _external=True)
        return jsonify(status="success", path=image_path), 201
    else:
        return jsonify(status="error", message="Error Invalid id"), 400