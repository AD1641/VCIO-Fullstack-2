from app.extensions import db
from app.models import Message


def test_send_message_success(client):

    response = client.post("/chat", json={
        "content": "Hello"
    })

    assert response.status_code == 200

    data = response.get_json()

    assert len(data) == 2

    assert data[0]["role"] == "user"
    assert data[0]["content"] == "Hello"

    assert data[1]["role"] == "bot"


def test_send_message_requires_content(client):

    response = client.post("/chat", json={})

    assert response.status_code == 400

    data = response.get_json()

    assert data["error"] == "content required"


def test_get_messages(client):

    post_response = client.post("/chat", json={
        "content": "Test message"
    })

    messages = post_response.get_json()

    session_id = messages[0]["sessionId"]

    response = client.get(f"/chat/{session_id}")

    assert response.status_code == 200

    data = response.get_json()

    assert len(data) == 2

    assert data[0]["content"] == "Test message"