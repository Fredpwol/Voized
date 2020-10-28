from flask import Flask
from .config import DevelopmentConfig
from flask_sqlalchemy import SQLAlchemy
import os

app = Flask(__name__)
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
app.config["SQLALCHEMY_DATABASE_URI"] = "postgresql://postgres:pandroid016@localhost:5432/voized_db"
db = SQLAlchemy(app)
