from flask import Blueprint
from flask_restful import Api
from app.resources.purchase_order import PurchaseOrderResource

purchase_order_bp = Blueprint('purchase_order', __name__)
api = Api(purchase_order_bp)

api.add_resource(PurchaseOrderResource, '/purchase-orders')
