import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { PurchaseOrderListComponent } from './components/purchase-order-list/purchase-order-list.component';
import { PurchaseOrderFormComponent } from './components/purchase-order-form/purchase-order-form.component';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { ListOrdersComponent } from './components/list-orders/list-orders.component';
import { FormsModule } from '@angular/forms';
import { PurchaseOrderViewComponent } from './components/purchase-order-view/purchase-order-view.component';



@NgModule({
  declarations: [
    AppComponent,
    PurchaseOrderListComponent,
    PurchaseOrderFormComponent,
    ListOrdersComponent,
    PurchaseOrderViewComponent
  ],
  imports: [
    ReactiveFormsModule,
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
