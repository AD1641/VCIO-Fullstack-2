from flask import Blueprint, jsonify

from app.models import Licence

licences_bp = Blueprint("licences", __name__)

@licences_bp.route("/licences", methods=["GET"])
def get_licences():

    licences = Licence.query.order_by(
        Licence.expiry_date.asc()
    ).all()

    result = []

    for l in licences:
        result.append({
            "id": l.id,
            "name": l.name,
            "provider": l.provider,
            "cost": l.cost,
            "expiryDate": l.expiry_date.strftime("%Y-%m-%d"),
            "status": l.status
        })

    return jsonify(result)