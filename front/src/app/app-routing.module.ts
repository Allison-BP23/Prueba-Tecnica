import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PurchaseOrderListComponent } from './components/purchase-order-list/purchase-order-list.component';
import { PurchaseOrderFormComponent } from './components/purchase-order-form/purchase-order-form.component';
import { ListOrdersComponent } from './components/list-orders/list-orders.component';

const routes: Routes = [
  { path: 'ordenes', component: ListOrdersComponent },
  { path: '', redirectTo: 'ordenes', pathMatch: 'full' }, 
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
