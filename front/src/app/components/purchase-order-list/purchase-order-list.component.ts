import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PostsService, PurchaseOrder } from '../../services/posts.service';

@Component({
  selector: 'app-purchase-order-list',
  templateUrl: './purchase-order-list.component.html',
  styleUrls: ['./purchase-order-list.component.scss'],
})
export class PurchaseOrderListComponent implements OnInit {
  order: PurchaseOrder = {
    RevisionNumber: 1,
    Status: 1,
    EmployeeID: 0,
    VendorID: 0,
    ShipMethodID: 0,
    SubTotal: 0,
    TaxAmt: 0,
    Freight: 0,
    ShipDate: null,
  };

  message = '';

  constructor(private postsService: PostsService, private router: Router) {}

  ngOnInit(): void {}

  createOrder() {
    if (!this.order.EmployeeID || this.order.EmployeeID <= 0) {
      this.message = 'Debe seleccionar un empleado válido.';
      return;
    }
    if (!this.order.VendorID || this.order.VendorID <= 0) {
      this.message = 'Debe seleccionar un proveedor válido.';
      return;
    }
    if (!this.order.ShipMethodID || this.order.ShipMethodID <= 0) {
      this.message = 'Debe seleccionar un método de envío válido.';
      return;
    }
    if (this.order.ShipDate) {
      this.order.ShipDate = new Date(this.order.ShipDate).toISOString();
    }

    this.postsService.createPurchaseOrder(this.order).subscribe({
      next: (data) => {
        this.message = `Orden creada con ID: ${data.PurchaseOrderID}`;
        setTimeout(() => {
          this.router.navigate(['/list-orders']);
        }, 1500);
      },
      error: (error) => {
        const backendMessage = error.error?.message || error.message || error.statusText || '';

        let friendlyMessage = 'Error al crear la orden';

        if (backendMessage.includes('FK_PurchaseOrderHeader_Vendor_VendorID')) {
          friendlyMessage = 'Proveedor inválido. Por favor seleccione un proveedor válido.';
        } else if (backendMessage.includes('FK_PurchaseOrderHeader_Employee_EmployeeID')) {
          friendlyMessage = 'Empleado inválido. Por favor seleccione un empleado válido.';
        } else if (backendMessage.includes('FK_PurchaseOrderHeader_ShipMethod_ShipMethodID')) {
          friendlyMessage = 'Método de envío inválido. Por favor seleccione un método válido.';
        } else if (backendMessage) {
          friendlyMessage = backendMessage;
        }

        this.message = 'Error al crear la orden: ' + friendlyMessage;
      },
    });
  }



}