from app.services.chatbot import (
    generate_bot_response,
    responses
)


def test_generate_bot_response():

    response = generate_bot_response()

    assert response in responses