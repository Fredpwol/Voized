import os
import secrets
from PIL import Image
from voized.config import basedir
from voized import db


PROFILE_PIC_PATH = os.path.join(basedir, "static", "profile_pic")
size = 300

def save_image(image):
    profile_image = Image.open(image)
    name = secrets.token_hex()
    ext = image.filename.split(".")[-1]
    full_name = name + '.' + ext
    profile_image.thumbnail((size, size))
    profile_image.save(os.path.join(PROFILE_PIC_PATH, full_name))
    return full_name
    
def remove_user_image(user):
    name = user.profile_pic
    if name:
        try:
            os.remove(os.path.join(PROFILE_PIC_PATH, name))
            user.profile_pic = None
            db.session.commit()
        except Exception:
            pass