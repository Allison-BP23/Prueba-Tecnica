import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PostsService, PurchaseOrder } from '../../services/posts.service';

@Component({
  selector: 'app-purchase-order-view',
  templateUrl: './purchase-order-view.component.html',
  styleUrls: ['./purchase-order-view.component.scss'],
})
export class PurchaseOrderViewComponent implements OnInit {
  order: PurchaseOrder | null = null;
  message = '';
  orderId: number = 0;
  constructor(
    private postsService: PostsService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.orderId = Number(this.route.snapshot.paramMap.get('id'));

    if (!this.orderId || isNaN(this.orderId) || this.orderId <= 0) {
      this.message = 'ID de orden inválido.';
      this.router.navigate(['/list-orders']);
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
            ? new Date(data.ShipDate).toLocaleString()
            : 'No disponible',
        };
        this.message = '';
      },
      error: (err) => {
        this.message =
          err.error?.message || 'No se pudo cargar la orden de compra.';
        this.order = null;
      },
    });
  }
}
