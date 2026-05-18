import pytest

from flask import Flask

from app.extensions import db
from app.routes.chat import chat_bp
from app.routes.licences import licences_bp


@pytest.fixture
def app():

    app = Flask(__name__)

    app.config.update({
        "TESTING": True,
        "SQLALCHEMY_DATABASE_URI": "sqlite:///:memory:",
        "SQLALCHEMY_TRACK_MODIFICATIONS": False
    })

    db.init_app(app)

    app.register_blueprint(chat_bp)
    app.register_blueprint(licences_bp)

    with app.app_context():
        db.create_all()

        yield app

        db.session.remove()
        db.drop_all()


@pytest.fixture
def client(app):
    return app.test_client()