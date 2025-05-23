import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PurchaseOrderListComponent } from './components/purchase-order-list/purchase-order-list.component';
import { PurchaseOrderFormComponent } from './components/purchase-order-form/purchase-order-form.component';
import { ListOrdersComponent } from './components/list-orders/list-orders.component';
import { PurchaseOrderViewComponent } from './components/purchase-order-view/purchase-order-view.component';
const routes: Routes = [
  { path: 'orders', component: ListOrdersComponent },
  { path: '', redirectTo: 'ordenes', pathMatch: 'full' }, 
  { path: 'create_order', component: PurchaseOrderListComponent },
  { path: 'edit_order/:id', component: PurchaseOrderFormComponent },
  { path: 'view-order/:id', component: PurchaseOrderViewComponent }

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
