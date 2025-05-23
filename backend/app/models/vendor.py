from ..db import db
from sqlalchemy.orm import relationship

class Vendor(db.Model):
    __tablename__ = 'Vendor'
    __table_args__ = {'schema': 'Purchasing'}

    BusinessEntityID = db.Column(db.Integer, primary_key=True, nullable=False)
    AccountNumber = db.Column(db.String(15), nullable=False, unique=True)
    Name = db.Column(db.String(50), nullable=False)
    CreditRating = db.Column(db.Integer, nullable=False)
    PreferredVendorStatus = db.Column(db.Boolean, nullable=False, default=True)
    ActiveFlag = db.Column(db.Boolean, nullable=False, default=True)
    PurchasingWebServiceURL = db.Column(db.String(1024), nullable=True)
    ModifiedDate = db.Column(db.DateTime, nullable=False)

    purchase_orders = relationship(
        "PurchaseOrderHeader",
        backref="vendor",
        primaryjoin="Vendor.BusinessEntityID == foreign(PurchaseOrderHeader.VendorID)",
        lazy="select"
    )

    def __repr__(self):
        return f"<Vendor(Name='{self.Name}', AccountNumber='{self.AccountNumber}')>"
