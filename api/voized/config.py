import os
basedir = os.path.abspath(os.path.dirname(__file__))

class Config(object):
    SECRET_KEY = "dbe2b621dc8186e489b1ed495fb86a35335c7ed95f308258a477707929958d6f"
    # SQLALCHEMY_DATABASE_URI = os.environ["DATABASE_URL"]
    CSRF_ENABLED = True
    DEBUG = False
    TESTING =False


class DevelopmentConfig(Config):
    DEBUG = True
    DEVELOPMENT = True


class StagingConfig(Config):
    DEBUG = True
    DEVELOPMENT = True


class TestingConfig(Config):
    TESTING = True


class ProductionConfig(Config):
    DEBUG = False