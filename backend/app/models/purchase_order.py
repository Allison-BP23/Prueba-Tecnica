from ..db import db
from datetime import datetime
from sqlalchemy.dialects.mysql import TINYINT
from sqlalchemy.orm import validates
from sqlalchemy import event

class PurchaseOrderHeader(db.Model):
    __tablename__ = 'PurchaseOrderHeader'
    __table_args__ = {'schema': 'Purchasing'}

    PurchaseOrderID = db.Column(db.Integer, primary_key=True)
    RevisionNumber = db.Column(db.SmallInteger, nullable=False)
    Status = db.Column(TINYINT, nullable=False)
    EmployeeID = db.Column(db.Integer, nullable=False)
    VendorID = db.Column(db.Integer, nullable=False)
    ShipMethodID = db.Column(db.Integer, nullable=False)
    OrderDate = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)
    ShipDate = db.Column(db.DateTime, nullable=True)
    SubTotal = db.Column(db.Numeric(18, 2), nullable=False)
    TaxAmt = db.Column(db.Numeric(18, 2), nullable=False)
    Freight = db.Column(db.Numeric(18, 2), nullable=False)
    TotalDue = db.Column(db.Numeric(18, 2), nullable=False)
    ModifiedDate = db.Column(db.DateTime, nullable=False, default=datetime.utcnow, onupdate=datetime.utcnow)

    def calculate_total_due(self):
        self.TotalDue = self.SubTotal + self.TaxAmt + self.Freight

    @validates('ShipDate')
    def validate_ship_date(self, key, value):
        if value and value < datetime.utcnow():
            raise ValueError("ShipDate no puede ser menor a la fecha actual.")
        return value

    @validates('SubTotal', 'TaxAmt', 'Freight')
    def validate_financial_fields(self, key, value):
        if value < 0:
            raise ValueError(f"{key} no puede ser negativo.")
        return value

# Evento para recalcular TotalDue antes de insertar o actualizar
@event.listens_for(PurchaseOrderHeader, 'before_insert')
@event.listens_for(PurchaseOrderHeader, 'before_update')
def before_save(mapper, connection, target):
    target.calculate_total_due()
