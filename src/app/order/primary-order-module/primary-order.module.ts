import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatIconModule, MatDialogModule } from '@angular/material';
import { RouterModule } from '@angular/router';
import { AutocompleteLibModule } from 'angular-ng-autocomplete';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import { AppUtilityModule } from 'src/app/app-utility.module';
import { MaterialModule } from 'src/app/material';
import { AuthComponentGuard } from 'src/app/auth-component.guard';
import { OrderListComponent } from '../order-list/order-list.component';
import { OrderDetailComponent } from '../order-detail/order-detail.component';
import { AddOrderComponent } from '../add-order/add-order.component';
import { AddPrimaryOrderValueComponent } from 'src/app/distribution/add-primary-order-value/add-primary-order-value.component';
import { OrderDispatchComponent } from '../order-dispatch/order-dispatch.component';
import { OrderEditModalComponent } from '../order-edit-modal/order-edit-modal.component';
import { BillingDetailComponent } from 'src/app/billing-detail/billing-detail.component';
import { AddItemComponent } from 'src/app/add-item/add-item.component';
import { AddOrderQuantityComponent } from '../add-order-quantity/add-order-quantity.component';
// import { AddItemComponent } from 'src/app/add-item/add-item.component';
// import { Crypto } from 'src/_Pipes/Crypto.pipe';

const primaryOrdersRoutes = [
  { path: "", children:[
  { path: "", component:OrderListComponent,canActivate:[AuthComponentGuard], data:{ expectedRole: ['1','2']}},
  { path: "order-detail/:id", children:[
    {path:'', component:OrderDetailComponent,canActivate:[AuthComponentGuard], data:{ expectedRole: ['1','2']}},
    {path: 'billing-details/:id', component: BillingDetailComponent, canActivate:[AuthComponentGuard], data:{ expectedRole: ['1','2']}},
  // { path: "add-item/:type/:id", component: AddItemComponent,canActivate:[AuthComponentGuard], data:{ expectedRole: ['1']}},
  ]},
  { path: "add-order/:type", component: AddOrderComponent,canActivate:[AuthComponentGuard], data:{ expectedRole: ['1','2']}},
  { path: "add-order-quantity/:type", component: AddOrderQuantityComponent,canActivate:[AuthComponentGuard], data:{ expectedRole: ['1','2']}},
    
  ]},
]
@NgModule({
  declarations: [
    AddOrderComponent,
    OrderListComponent,
    AddPrimaryOrderValueComponent,
    OrderEditModalComponent,
    OrderDispatchComponent,
    AddOrderQuantityComponent
    // AddItemComponent,
    // Crypto
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(primaryOrdersRoutes),
    FormsModule,
    ReactiveFormsModule,
    NgMultiSelectDropDownModule,
    MaterialModule,
    AutocompleteLibModule,
    MatIconModule,
    MatDialogModule,
    NgxMatSelectSearchModule,
    AppUtilityModule,
  ],
  entryComponents:[
    AddPrimaryOrderValueComponent,OrderEditModalComponent,OrderDispatchComponent, AddItemComponent, BillingDetailComponent
  ]
})
export class PrimaryOrderModule { }
