import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PostsService, PurchaseOrder } from '../../services/posts.service';

@Component({
  selector: 'app-purchase-order-form',
  templateUrl: './purchase-order-form.component.html',
  styleUrls: ['./purchase-order-form.component.scss']
})
export class PurchaseOrderFormComponent implements OnInit {
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
  orderId: number = 0;

  constructor(
    private postsService: PostsService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    this.orderId = Number(idParam);

    if (!this.orderId || isNaN(this.orderId) || this.orderId <= 0) {
      this.router.navigate(['/posts']);
      return;
    }
    
    this.getOrder();
  }


  getOrder(): void {
    this.postsService.getPurchaseOrder(this.orderId).subscribe({
      next: (data) => {
        this.order = {
          ...data,
          ShipDate: data.ShipDate
            ? new Date(data.ShipDate).toISOString().slice(0, 16)
            : null,
        };
      },
      error: () => {
        this.message = 'No se pudo cargar la orden de compra.';
      },
    });
  }

  updateOrder(): void {
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
    if (this.order.SubTotal <= 0 || this.order.TaxAmt < 0 || this.order.Freight < 0) {
      this.message = 'SubTotal debe ser mayor a 0. Impuestos y flete no pueden ser negativos.';
      return;
    }

    this.order.SubTotal = Number(this.order.SubTotal);
    this.order.TaxAmt = Number(this.order.TaxAmt);
    this.order.Freight = Number(this.order.Freight);

    if (this.order.ShipDate) {
      this.order.ShipDate = new Date(this.order.ShipDate).toISOString();
    }

    this.postsService.updatePurchaseOrder(this.orderId, this.order).subscribe({
      next: () => {
        this.message = 'Orden actualizada correctamente.';
        setTimeout(() => {
          this.router.navigate(['/list-orders']);
        }, 1500);
      },
      error: (error) => {
        const backendMessage = error.error?.message || error.message || error.statusText || '';
        let friendlyMessage = 'Error al actualizar la orden';

        if (backendMessage.includes('FK_PurchaseOrderHeader_Vendor_VendorID')) {
          friendlyMessage = 'Proveedor inválido. Por favor seleccione un proveedor válido.';
        } else if (backendMessage.includes('FK_PurchaseOrderHeader_Employee_EmployeeID')) {
          friendlyMessage = 'Empleado inválido. Por favor seleccione un empleado válido.';
        } else if (backendMessage.includes('FK_PurchaseOrderHeader_ShipMethod_ShipMethodID')) {
          friendlyMessage = 'Método de envío inválido. Por favor seleccione un método válido.';
        } else if (backendMessage) {
          friendlyMessage = backendMessage;
        }

        this.message = 'Error al actualizar la orden: ' + friendlyMessage;
      },
    });
  }
}
