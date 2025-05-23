from flask import Blueprint, request, jsonify
from ..schemas.purchase_order_schema import PurchaseOrderSchema
from ..models.purchase_order import PurchaseOrderHeader
from ..services.purchase_order_service import create_purchase_order
from ..db import db

purchase_order_bp = Blueprint("purchase_orders", __name__, url_prefix="/purchase_orders")
schema = PurchaseOrderSchema()
schemas = PurchaseOrderSchema(many=True)

@purchase_order_bp.route("/", methods=["GET"])
def get_all():
    orders = PurchaseOrderHeader.query.all()
    return jsonify(schemas.dump(orders))

