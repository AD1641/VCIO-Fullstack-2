import os
from dotenv import load_dotenv
from flask import Flask
from flask_cors import CORS

from app.config import Config
from app.extensions import db, migrate

load_dotenv()

def create_app():
    app = Flask(__name__)

    app.config.from_object(Config)

    #CORS(app, origins=["http://localhost:5173"])
    CORS(app, origins=[app.config["FRONTEND_URL"]])

    db.init_app(app)
    migrate.init_app(app, db)

    from app.routes.chat import chat_bp
    from app.routes.licences import licences_bp

    app.register_blueprint(chat_bp)
    app.register_blueprint(licences_bp)

    return app