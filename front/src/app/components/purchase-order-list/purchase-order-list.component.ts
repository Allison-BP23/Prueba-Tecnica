import { Component, OnInit } from '@angular/core';
import { PostsService, PurchaseOrder } from '../../services/posts.service';

@Component({
  selector: 'app-purchase-order-list',
  templateUrl: './purchase-order-list.component.html',
  styleUrls: ['./purchase-order-list.component.scss'],
})
export class PurchaseOrderListComponent implements OnInit {
  orders: PurchaseOrder[] = [];
  loading = false;
  error: string | null = null;

  constructor(private postsService: PostsService) {}

  ngOnInit(): void {
    this.loadOrders();
  }
  loadOrders() {
    this.loading = true;
    this.postsService.getPurchaseOrders().subscribe({
      next: (data) => {
        this.orders = data;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Error cargando órdenes';
        this.loading = false;
      },
    });
  }

  deleteOrder(id?: number) {
    if (!id) return;
    if (confirm('¿Seguro que quieres eliminar esta orden?')) {
      this.postsService.deletePurchaseOrder(id).subscribe({
        next: () => this.loadOrders(),
        error: () => alert('Error eliminando la orden'),
      });
    }
  }
}
