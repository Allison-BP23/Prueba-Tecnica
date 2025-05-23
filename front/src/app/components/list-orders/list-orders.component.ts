import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PostsService, PurchaseOrder } from '../../services/posts.service';

@Component({
  selector: 'app-list-orders',
  templateUrl: './list-orders.component.html',
  styleUrls: ['./list-orders.component.scss']
})

export class ListOrdersComponent implements OnInit {
  orders: PurchaseOrder[] = [];

  constructor(
    private postsService: PostsService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.postsService.getPurchaseOrders().subscribe({
      next: (data) => {
        this.orders = data;
      },
      error: (error) => {
        console.error(error);
      }
    });
  }

  viewOrder(id: number) {
    this.router.navigate(['/view-order', id]);
  }
}
