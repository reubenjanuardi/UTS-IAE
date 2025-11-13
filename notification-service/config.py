import os
from dotenv import load_dotenv

load_dotenv()

# Get the directory where this config file is located
BASE_DIR = os.path.abspath(os.path.dirname(__file__))

class Config:
    SECRET_KEY = os.getenv('SECRET_KEY', 'dev-secret-key')
    # Use absolute path for SQLite database
    SQLALCHEMY_DATABASE_URI = 'sqlite:///' + os.path.join(BASE_DIR, 'notifications.db').replace('\\', '/')
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    PORT = int(os.getenv('PORT', 3004))
    SERVICE_NAME = os.getenv('SERVICE_NAME', 'notification-service')
