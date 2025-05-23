from ..db import db
from datetime import datetime
from sqlalchemy.dialects.mysql import TINYINT
from sqlalchemy.orm import validates
from sqlalchemy import event
from sqlalchemy import event, Computed


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
    
    TotalDue = db.Column(db.Numeric(18, 2), Computed('SubTotal + TaxAmt + Freight', persisted=True), nullable=False)

    ModifiedDate = db.Column(db.DateTime, nullable=False, default=datetime.utcnow, onupdate=datetime.utcnow)

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

    def to_dict(self):
        return {
            "PurchaseOrderID": self.PurchaseOrderID,
            "RevisionNumber": self.RevisionNumber,
            "Status": self.Status,
            "EmployeeID": self.EmployeeID,
            "VendorID": self.VendorID,
            "ShipMethodID": self.ShipMethodID,
            "OrderDate": self.OrderDate.isoformat() if self.OrderDate else None,
            "ShipDate": self.ShipDate.isoformat() if self.ShipDate else None,
            "SubTotal": float(self.SubTotal),
            "TaxAmt": float(self.TaxAmt),
            "Freight": float(self.Freight),
            "TotalDue": float(self.TotalDue) if self.TotalDue is not None else None,
            "ModifiedDate": self.ModifiedDate.isoformat() if self.ModifiedDate else None
        }