
from datetime import datetime

from app.extensions import db
from app.models import Licence


def test_get_licences(client):

    licence = Licence(
        id="1",
        name="Microsoft 365",
        provider="Microsoft",
        cost="25",
        expiry_date=datetime(2026, 1, 1),
        status="active"
    )

    db.session.add(licence)
    db.session.commit()

    response = client.get("/licences")

    assert response.status_code == 200

    data = response.get_json()

    assert len(data) == 1

    assert data[0]["name"] == "Microsoft 365"
    assert data[0]["provider"] == "Microsoft"