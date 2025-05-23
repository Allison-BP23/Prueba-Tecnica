from marshmallow import Schema, fields, validates, ValidationError
from datetime import datetime

class PurchaseOrderSchema(Schema):
    PurchaseOrderID = fields.Int(dump_only=True)
    RevisionNumber = fields.Int(required=True)
    Status = fields.Int(required=True)
    EmployeeID = fields.Int(required=True)
    VendorID = fields.Int(required=True)
    ShipMethodID = fields.Int(required=True)
    OrderDate = fields.DateTime(dump_only=True)
    ShipDate = fields.DateTime(allow_none=True)
    SubTotal = fields.Decimal(required=True)
    TaxAmt = fields.Decimal(required=True)
    Freight = fields.Decimal(required=True)
    TotalDue = fields.Decimal(dump_only=True)
    ModifiedDate = fields.DateTime(dump_only=True)

    @validates("ShipDate")
    def validate_ship_date(self, value):
        if value and value < datetime.utcnow():
            raise ValidationError("ShipDate no puede ser menor a la fecha actual.")

    @validates("SubTotal")
    @validates("TaxAmt")
    @validates("Freight")
    def validate_positive_values(self, value):
        if value < 0:
            raise ValidationError("El valor no puede ser negativo.")
