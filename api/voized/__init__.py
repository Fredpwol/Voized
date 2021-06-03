from flask import Flask
from .config import DevelopmentConfig
from flask_sqlalchemy import SQLAlchemy
from flask_bcrypt import Bcrypt
from flask_cors import CORS
import os

app = Flask(__name__)
CORS(app)
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
app.config["SQLALCHEMY_DATABASE_URI"] = "postgresql://postgres:pandroid016@localhost:5432/voized_db"
db = SQLAlchemy(app)
bcrypt = Bcrypt(app)

from voized import routes