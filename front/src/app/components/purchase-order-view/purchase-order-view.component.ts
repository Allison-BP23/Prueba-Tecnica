import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PostsService, PurchaseOrder } from '../../services/posts.service';

@Component({
  selector: 'app-purchase-order-view',
  templateUrl: './purchase-order-view.component.html',
  styleUrls: ['./purchase-order-view.component.scss'],
})
export class PurchaseOrderViewComponent implements OnInit {
  orderIdInput: string = '';
  message: string = '';
  order: PurchaseOrder | null = null;
  loading = false;

  constructor(
    private postsService: PostsService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Captura el parámetro 'id' si existe
    this.route.paramMap.subscribe(params => {
      const idParam = params.get('id');
      if (idParam) {
        this.orderIdInput = idParam;
        this.searchOrder(+idParam);  // Busca la orden automáticamente
      }
    });
  }

  searchOrder(id?: number): void {
    // Si se recibe un id por parámetro, úsalo. Si no, usa el input.
    const orderId = id ?? Number(this.orderIdInput);

    if (!orderId || isNaN(orderId) || orderId <= 0) {
      this.message = 'Por favor ingrese un ID válido.';
      this.order = null;
      return;
    }

    this.message = '';
    this.loading = true;

    this.postsService.getPurchaseOrder(orderId).subscribe({
      next: (data) => {
        this.order = {
          ...data,
          ShipDate: data.ShipDate
            ? new Date(data.ShipDate).toISOString().slice(0, 16)
            : null,
        };
        this.message = '';
        this.loading = false;
      },
      error: (err) => {
        this.message = `Orden de compra con ID ${orderId} no encontrada.`;
        this.order = null;
        this.loading = false;
      },
    });
  }
}
