// src/app/services/posts.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface PurchaseOrder {
  PurchaseOrderID?: number;
  RevisionNumber: number;
  Status: number;
  EmployeeID: number;
  VendorID: number;
  ShipMethodID: number;
  OrderDate?: string;
  ShipDate?: string | null;
  SubTotal: number;
  TaxAmt: number;
  Freight: number;
  ModifiedDate?: string;
}

@Injectable({
  providedIn: 'root'
})
export class PostsService {
  private apiUrl = 'http://127.0.0.1:5000/api/purchase-orders';

  constructor(private http: HttpClient) { }

  getPurchaseOrders(): Observable<PurchaseOrder[]> {
    return this.http.get<PurchaseOrder[]>(this.apiUrl);
  }

  getPurchaseOrder(id: number): Observable<PurchaseOrder> {
    return this.http.get<PurchaseOrder>(`${this.apiUrl}/${id}`);
  }

  createPurchaseOrder(order: PurchaseOrder): Observable<PurchaseOrder> {
    return this.http.post<PurchaseOrder>(this.apiUrl, order);
  }

  updatePurchaseOrder(id: number, order: Partial<PurchaseOrder>): Observable<PurchaseOrder> {
    return this.http.put<PurchaseOrder>(`${this.apiUrl}/${id}`, order);
  }

  deletePurchaseOrder(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}
