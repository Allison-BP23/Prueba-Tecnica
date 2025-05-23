import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PurchaseOrderListComponent } from './components/purchase-order-list/purchase-order-list.component';
import { PurchaseOrderFormComponent } from './components/purchase-order-form/purchase-order-form.component';

const routes: Routes = [
  { path: '', redirectTo: 'purchase-orders', pathMatch: 'full' },
  { path: 'purchase-orders', component: PurchaseOrderListComponent },
  { path: 'purchase-orders/new', component: PurchaseOrderFormComponent },
  { path: 'purchase-orders/edit/:id', component: PurchaseOrderFormComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
