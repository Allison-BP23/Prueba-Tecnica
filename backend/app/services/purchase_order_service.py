
from ..db import db
from ..models.purchase_order import PurchaseOrderHeader
from datetime import datetime

def create_purchase_order(data):
    data["OrderDate"] = datetime.utcnow()
    data["TotalDue"] = float(data["SubTotal"]) + float(data["TaxAmt"]) + float(data["Freight"])
    data["ModifiedDate"] = datetime.utcnow()
    purchase_order = PurchaseOrderHeader(**data)
    db.session.add(purchase_order)
    db.session.commit()
    return purchase_order

