import random
from voized import db, bcrypt, app
from flask_login import UserMixin
from itsdangerous import TimedJSONWebSignatureSerializer as Serializer, BadSignature, SignatureExpired

class User(db.Model):
    __tablename__ = "users"
    
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(30), nullable=False, unique=True)
    email = db.Column(db.String(255), nullable=False, unique=True)
    password = db.Column(db.String(255), nullable=False)
    bg_color = db.Column(db.String(50), nullable=True, default="orange")
    profile_pic = db.Column(db.String(255), nullable=True)

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
        colors = ["blue", "red", "green", "orange", "cyan", "gold", "geekblue", "purple", "lime", "magenta", "volcano", "yellow", "grey"]
        return random.choice(colors)

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