import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PostsService, PurchaseOrder } from '../../services/posts.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';


@Component({
  selector: 'app-purchase-order-form',
  templateUrl: './purchase-order-form.component.html',
  styleUrls: ['./purchase-order-form.component.scss']
})
export class PurchaseOrderFormComponent implements OnInit {
  form: FormGroup;
  isEditMode = false;
  orderId?: number;
  loading = false;
  constructor(    private fb: FormBuilder,
    private postsService: PostsService,
    private route: ActivatedRoute,
    private router: Router) {     this.form = this.fb.group({
      RevisionNumber: ['', Validators.required],
      Status: ['', Validators.required],
      EmployeeID: ['', Validators.required],
      VendorID: ['', Validators.required],
      ShipMethodID: ['', Validators.required],
      ShipDate: [''],
      SubTotal: ['', Validators.required],
      TaxAmt: ['', Validators.required],
      Freight: ['', Validators.required]
    });}

  ngOnInit(): void {
        this.orderId = Number(this.route.snapshot.paramMap.get('id'));
    if (this.orderId) {
      this.isEditMode = true;
      this.loadOrder();
    }
  }
loadOrder() {
    this.loading = true;
    this.postsService.getPurchaseOrder(this.orderId!).subscribe({
      next: (order) => {
        this.form.patchValue({
          RevisionNumber: order.RevisionNumber,
          Status: order.Status,
          EmployeeID: order.EmployeeID,
          VendorID: order.VendorID,
          ShipMethodID: order.ShipMethodID,
          ShipDate: order.ShipDate ? order.ShipDate.split('T')[0] : '',
          SubTotal: order.SubTotal,
          TaxAmt: order.TaxAmt,
          Freight: order.Freight
        });
        this.loading = false;
      },
      error: () => {
        alert('Error cargando la orden');
        this.loading = false;
      }
    });
  }

  submit() {
    if (this.form.invalid) {
      alert('Por favor completa los campos obligatorios');
      return;
    }

    const order: PurchaseOrder = this.form.value;

    if (this.isEditMode && this.orderId) {
      this.postsService.updatePurchaseOrder(this.orderId, order).subscribe({
        next: () => this.router.navigate(['/purchase-orders']),
        error: () => alert('Error actualizando la orden')
      });
    } else {
      this.postsService.createPurchaseOrder(order).subscribe({
        next: () => this.router.navigate(['/purchase-orders']),
        error: () => alert('Error creando la orden')
      });
    }
  }
}
