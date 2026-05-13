import uuid
from datetime import datetime

from app.extensions import db


class Session(db.Model):
    __tablename__ = "sessions"

    id = db.Column(
        db.String,
        primary_key=True,
        default=lambda: str(uuid.uuid4())
    )

    created_at = db.Column(
        db.DateTime,
        default=datetime.now()
    )

    messages = db.relationship(
        "Message",
        backref="session",
        lazy=True,
        cascade="all, delete-orphan"
    )


class Message(db.Model):
    __tablename__ = "messages"

    id = db.Column(
        db.String,
        primary_key=True,
        default=lambda: str(uuid.uuid4())
    )

    session_id = db.Column(
        db.String,
        db.ForeignKey("sessions.id"),
        nullable=False
    )

    role = db.Column(db.String, nullable=False)

    content = db.Column(db.Text, nullable=False)

    created_at = db.Column(
        db.DateTime,
        default=datetime.now()
    )


class Licence(db.Model):
    __tablename__ = "licences"

    id = db.Column(
        db.String,
        primary_key=True
    )

    name = db.Column(db.String, nullable=False)

    provider = db.Column(db.String, nullable=False)

    cost = db.Column(db.String, nullable=False)

    expiry_date = db.Column(db.DateTime)

    status = db.Column(db.String)