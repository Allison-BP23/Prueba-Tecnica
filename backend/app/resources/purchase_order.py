from flask import request
from flask_restful import Resource
from app.models.purchase_order import PurchaseOrderHeader, db
from app.schemas.purchase_order_schema import PurchaseOrderSchema

purchase_order_schema = PurchaseOrderSchema()
purchase_orders_schema = PurchaseOrderSchema(many=True)

class PurchaseOrderResource(Resource):
    def get(self):
        orders = PurchaseOrderHeader.query.all()
        result = [order.to_dict() for order in orders]
        return result, 200
