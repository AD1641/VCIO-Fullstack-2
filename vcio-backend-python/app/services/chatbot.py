import random

responses = [
    "Let me check that for you.",
    "Here’s what I found in the system.",
    "You might want to review the latest compliance summary.",
    "Security reports show an update pending.",
    "That's a good question - looking into it now.",
]

def generate_bot_response():
    return random.choice(responses)