import os
from flask_script import  Manager
from flask_migrate import Migrate, MigrateCommand

from voized import app, db

app.config.from_object(os.environ["APP_SETTINGS"])

manager = Manager(app)
migrate = Migrate(app=app, db=db)

manager.add_command("db", MigrateCommand)

if __name__ == "__main__":
    manager.run()