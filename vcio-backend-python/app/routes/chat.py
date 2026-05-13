from flask import Blueprint, jsonify, request
from datetime import datetime

from app.extensions import db
from app.models import Session, Message
from app.services.chatbot import generate_bot_response

chat_bp = Blueprint("chat", __name__)

@chat_bp.route("/chat", methods=["POST"])
def send_message():

    data = request.json

    session_id = data.get("sessionId")
    content = data.get("content")

    if not content:
        return jsonify({"error": "content required"}), 400

    if not session_id:
        session = Session()
        db.session.add(session)
        db.session.commit()

        session_id = session.id

    user_message = Message(
        session_id=session_id,
        role="user",
        content=content,
        created_at=datetime.now()
    )

    db.session.add(user_message)

    bot_content = generate_bot_response()

    bot_message = Message(
        session_id=session_id,
        role="bot",
        content=bot_content,
        created_at=datetime.now()
    )

    db.session.add(bot_message)

    db.session.commit()

    return jsonify([
        {
            "id": user_message.id,
            "sessionId": user_message.session_id,
            "role": user_message.role,
            "content": user_message.content,
            "createdAt": user_message.created_at.isoformat()
        },
        {
            "id": bot_message.id,
            "sessionId": bot_message.session_id,
            "role": bot_message.role,
            "content": bot_message.content,
            "createdAt": bot_message.created_at.isoformat()
        }
    ])

@chat_bp.route("/chat/<session_id>", methods=["GET"])
def get_messages(session_id):

    messages = Message.query.filter_by(
        session_id=session_id
    ).order_by(Message.created_at.asc()).all()

    result = []

    for m in messages:
        result.append({
            "id": m.id,
            "sessionId": m.session_id,
            "role": m.role,
            "content": m.content,
            "createdAt": m.created_at.isoformat()
        })

    return jsonify(result)