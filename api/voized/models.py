import random
import time
from voized import db, bcrypt, app
from flask_login import UserMixin
from flask import url_for
from itsdangerous import TimedJSONWebSignatureSerializer as Serializer, BadSignature, SignatureExpired

friends = db.Table("contacts", db.Column("user", db.Integer, db.ForeignKey(
    "users.id")), db.Column("friend", db.Integer, db.ForeignKey("users.id")))
groups = db.Table("groups", db.Column("user_id", db.Integer, db.ForeignKey(
    "users.id")), db.Column("room_id", db.Integer, db.ForeignKey("rooms.id")))
group_calls = db.Table("group_calls", db.Column("room_id", db.Integer, db.ForeignKey(
    "rooms.id")), db.Column("user_id", db.Integer, db.ForeignKey("users.id")))

class User(db.Model):
    __tablename__ = "users"

    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(30), nullable=False, unique=True, index=True)
    email = db.Column(db.String(255), nullable=False, unique=True, index=True)
    password = db.Column(db.String(255), nullable=False)
    bg_color = db.Column(db.String(50), nullable=True, default="orange")
    profile_pic = db.Column(db.String(255), nullable=True)
    contacts = db.relationship("User", secondary=friends, primaryjoin=(
        friends.c.friend == id), secondaryjoin=(friends.c.user == id), lazy="dynamic")
    rooms = db.relationship("Room", secondary=groups, backref=db.backref(
        "members", lazy="dynamic"), lazy="dynamic")
    call_sent = db.relationship("Calls", lazy="dynamic", foreign_keys="Calls.caller" )
    call_recived = db.relationship("Calls", lazy="dynamic", foreign_keys="Calls.reciever" )
    voice_mails_recieved = db.relationship("VoiceMails", lazy="dynamic", foreign_keys="VoiceMails.reciever" )
    voice_mails_sent = db.relationship("VoiceMails", lazy="dynamic", foreign_keys="VoiceMails.caller" )

    def __init__(self, username, password, email):
        self.username = username
        self.password = bcrypt.generate_password_hash(password).decode('utf-8')
        self.email = email
        self.bg_color = self.get_random_color()

    @property
    def serialize(self):
        return {
            "_id": self.id,
            "username": self.username,
            "email": self.email,
            "bg_color": self.bg_color,
            "profile_pic": url_for("static", filename="profile_pic/"+self.profile_pic, _external=True) if self.profile_pic else "",
        }

    # @staticmethod
    def get_calls(self):
        calls = Calls.query.filter_by(caller=self.id).union(Calls.query.filter_by(reciever=self.id)).order_by(Calls.at.desc())
        serialized_calls = [ call.serialize for call in calls ]
        return serialized_calls

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
            db.session.commit()

    def remove_contact(self, user):
        if self.is_contact(user):
            self.contacts.remove(user)
            db.session.commit()

    def is_contact(self, user):
        return self.contacts.filter(friends.c.friend == user.id).count() > 0

    def in_room(self, room):
        return self.rooms.filter(groups.c.room_id == room.id).count() > 0

    def join_room(self, room):
        if not self.in_room(room):
            self.roooms.append(room)
            db.session.commit()

    def leave_room(self, room):
        if self.in_room(room):
            self.roooms.append(room)
            db.session.commit()

    @staticmethod
    def verify_web_token(token):
        serializer = Serializer(app.config['SECRET_KEY'])
        try:
            data = serializer.loads(token)
        except SignatureExpired:
            return None
        except BadSignature:
            return None
        user = User.query.get(data['id'])
        return user

    def __repr__(self):
        return f"User({self.username})"

class Room(db.Model):
    __tablename__ = "rooms"
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(50), nullable=False)
    group_image = db.Column(db.String(255), nullable=True)
    category = db.Column(db.String(64), default="general", nullable=False)
    description = db.Column(db.String, nullable=True)
    created_at = db.Column(db.Integer, nullable=False)
    calls = db.relationship("GroupCalls", backref="group", lazy="dynamic")
    messages = str()
    in_call = bool()

    def __init__(self, name, category="general", description=None, group_image=None,):
        self.name = name
        self.category = category
        self.description = description
        self.group_image = group_image
        self.created_at = time.time()

    @property
    def no_users(self):
        return self.members.count()

    @property
    def serialize(self):
        return {
            "id": self.id,
            "name": self.name,
            "groupImage": self.group_image,
            "noUsers": self.no_users,
            "category": self.category,
            "description": self.description,
            "createdAt": self.created_at
        }

    def __repr__(self):
        return f"Room({self.name})"


class CallMixins:
    id = db.Column(db.Integer, primary_key=True)
    at = db.Column(db.Float, nullable=False)
    duration = db.Column(db.Float, nullable=True)
    ended = db.Column(db.Float, nullable=True)
    status = db.Column(db.String, default="missed", nullable=False)


    def get_attributes(self):
        res = []
        attrs = [attr for attr in dir(self) if not (attr.startswith("__") and attr.endswith("__"))]
        for args in attrs:
            if type(getattr(self, args)) in [int, float, str] or getattr(self, args) == None:
                res.append(args)
        return res


class Calls(db.Model, CallMixins):
    __tablename__ = "calls"
    caller = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False)
    reciever = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False)

    @property
    def serialize(self):
        return {
            "id": self.id,
            "at": self.at,
            "duration": self.duration,
            "ended": self.ended,
            "status": self.status,
            "caller": User.query.get(self.caller).serialize,
            "receiver": User.query.get(self.reciever).serialize
        }

class GroupCalls(db.Model, CallMixins):
    __tablename__ = "room_calls"

    id = db.Column(db.Integer, primary_key=True)
    room = db.Column(db.Integer, db.ForeignKey("rooms.id"), nullable=False)
    to = db.relationship("User", secondary=group_calls, backref=db.backref(
        "room_calls", lazy="dynamic"), primaryjoin=(group_calls.c.user_id == id), 
        secondaryjoin=(group_calls.c.room_id == id), lazy="dynamic")
    
    def add_user(self, user):
        if not in_call(user):
            self.to.append(user)
            db.session.commit()
    
    def remove_user(self, user):
        if in_call(user):
            self.to.remove(user)
            db.session.commit()

    def in_call(self, user):
        return self.to.filter( group_calls.c.user_id == user.id ).count() > 0


class VoiceMails(db.Model, CallMixins):
    __tablename__ = "voice_mails"

    caller = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False)
    reciever = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False)
    mail = db.Column(db.String(255), nullable=True)
