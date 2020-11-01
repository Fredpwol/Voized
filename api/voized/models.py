import random
from voized import db, bcrypt, app
from flask_login import UserMixin
from itsdangerous import TimedJSONWebSignatureSerializer as Serializer, BadSignature, SignatureExpired

friends = db.Table("contacts", db.Column("user", db.Integer, db.ForeignKey(
    "users.id")), db.Column("friend", db.Integer, db.ForeignKey("users.id")))
groups = db.Table("groups", db.Column("user_id", db.Integer, db.ForeignKey(
    "users.id")), db.Column("room_id", db.Integer, db.ForeignKey("rooms.id")))

class User(db.Model):
    __tablename__ = "users"

    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(30), nullable=False, unique=True)
    email = db.Column(db.String(255), nullable=False, unique=True)
    password = db.Column(db.String(255), nullable=False)
    bg_color = db.Column(db.String(50), nullable=True, default="orange")
    profile_pic = db.Column(db.String(255), nullable=True)
    contacts = db.relationship("User", secondary=friends, primaryjoin=(
        friends.c.friend == id), secondaryjoin=(friends.c.user == id), lazy="dynamic")
    rooms = db.relationship("Room", secondary=groups, backref=db.backref("members", lazy="dynamic"), lazy="dynamic") 

    def __init__(self, username, password, email):
        self.username = username
        self.password = bcrypt.generate_password_hash(password).decode('utf-8')
        self.email = email
        self.bg_color = self.get_random_color()

    def validate_password(self, password):
        return bcrypt.check_password_hash(self.password, password)

    def generate_web_token(self, exp=259200):
        serializer = Serializer(app.config["SECRET_KEY"], expires_in=exp)
        return serializer.dumps({"id": self.id}).decode("utf-8")

    def get_random_color(self):
        colors = ["blue", "red", "green", "orange", "cyan", "gold",
                  "geekblue", "purple", "lime", "magenta", "volcano", "yellow", "grey"]
        return random.choice(colors)

    def add_contact(self, user):
        if not self.is_contact(user):
            self.contacts.append(user)
        
    def remove_contact(self, user):
        if self.is_contact(user):
            self.contacts.remove(user)

    def is_contact(self, user):
        return self.contacts.filter( friends.c.friend == user.id).count() > 0

    @staticmethod
    def verify_web_token(token):
        serializer = Serializer(app.config['SECRET_KEY'])
        try:
            data = serializer.loads(token)
        except SignatureExpired:
            return None
        except BadSignature:
            return None
        user = User.query.filter_by(id=data["id"]).first()
        return user

    def __repr__(self):
        return f"User({username})"



class Room(db.Model):
    __tablename__ = "rooms"
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(50), nullable=False)
    group_image = db.Column(db.String(255), nullable=True)
    no_users = db.Column(db.Integer, default=0, nullable=False)


    def __repr__(self):
        return f"Room({self.name})"
