from flask import request
from flask_restful import Resource
from app.models.purchase_order import PurchaseOrderHeader, db
from app.schemas.purchase_order_schema import PurchaseOrderSchema
from datetime import datetime, timezone
import traceback

purchase_order_schema = PurchaseOrderSchema()
purchase_orders_schema = PurchaseOrderSchema(many=True)

class PurchaseOrderResource(Resource):
    
    def get(self):
        orders = PurchaseOrderHeader.query.all()
        result = [order.to_dict() for order in orders]
        return result, 200
    
    
    def post(self):
        data = request.get_json()

        required_fields = ['RevisionNumber', 'Status', 'EmployeeID', 'VendorID', 'ShipMethodID', 'SubTotal', 'TaxAmt', 'Freight']
        for field in required_fields:
            if field not in data:
                return {"message": f"Falta el campo obligatorio: {field}"}, 400

        ship_date = None
        if 'ShipDate' in data and data['ShipDate']:
            try:
                ship_date = datetime.fromisoformat(data['ShipDate'])
            except ValueError:
                return {"message": "Formato inválido para ShipDate. Debe ser ISO 8601."}, 400
            
            if ship_date < datetime.now(timezone.utc):
                return {"message": "ShipDate no puede ser menor que la fecha actual."}, 400
        try:
            purchase_order = PurchaseOrderHeader(
                RevisionNumber = data['RevisionNumber'],
                Status = data['Status'],
                EmployeeID = data['EmployeeID'],
                VendorID = data['VendorID'],
                ShipMethodID = data['ShipMethodID'],
                OrderDate = datetime.utcnow(),  
                ShipDate = ship_date, 
                SubTotal = data['SubTotal'],
                TaxAmt = data['TaxAmt'],
                Freight = data['Freight'],
                ModifiedDate = datetime.utcnow()
            )

            db.session.add(purchase_order)
            db.session.commit()

            return purchase_order.to_dict(), 201

        except Exception as e:
            db.session.rollback()
            traceback.print_exc()  

            return {"message": f"Error al crear la orden de compra: {str(e)}"}, 500

class PurchaseOrderDetailResource(Resource):
    def get(self, id):
        purchase_order = PurchaseOrderHeader.query.get(id)
        if not purchase_order:
            return {"message": f"Orden de compra con ID {id} no encontrada"}, 404
        return purchase_order.to_dict(), 200


    def put(self, id):
        data = request.get_json()
        purchase_order = PurchaseOrderHeader.query.get(id)
        if not purchase_order:
            return {"message": f"Orden de compra con ID {id} no encontrada"}, 404

        updatable_fields = ['RevisionNumber', 'Status', 'EmployeeID', 'VendorID', 'ShipMethodID', 'ShipDate', 'SubTotal', 'TaxAmt', 'Freight']

        for field in updatable_fields:
            if field in data:
                if field == 'ShipDate':
                    if not data[field]:
                        return {"message": "ShipDate no puede estar vacío."}, 400
                    try:
                        ship_date = datetime.fromisoformat(data[field])
                    except ValueError:
                        return {"message": "Formato inválido para ShipDate. Debe ser ISO 8601."}, 400

                    if ship_date < datetime.now(timezone.utc):
                        return {"message": "ShipDate no puede ser menor que la fecha actual."}, 400

                    setattr(purchase_order, field, ship_date)
                else:
                    setattr(purchase_order, field, data[field])

        purchase_order.ModifiedDate = datetime.utcnow()

        try:
            db.session.commit()
            return purchase_order.to_dict(), 200
        except Exception as e:
            db.session.rollback()
            return {"message": f"Error al actualizar la orden de compra: {str(e)}"}, 500


    def delete(self, id):
        purchase_order = PurchaseOrderHeader.query.get(id)
        if not purchase_order:
            return {"message": f"Orden de compra con ID {id} no encontrada"}, 404
        
        try:
            db.session.delete(purchase_order)
            db.session.commit()
            return {"message": f"Orden de compra con ID {id} eliminada correctamente"}, 200
        except Exception as e:
            db.session.rollback()
            return {"message": f"Error al eliminar la orden de compra: {str(e)}"}, 500