import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { MaterialModule } from 'src/app/material';
import { AutocompleteLibModule } from 'angular-ng-autocomplete';
import { MatDialogModule, MatIconModule } from '@angular/material';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import { AppUtilityModule } from 'src/app/app-utility.module';
import { AuthComponentGuard } from 'src/app/auth-component.guard';
import { ServiceInvoiceListComponent } from '../service-invoice-list/service-invoice-list.component';
import { ServiceInvoiceDetailComponent } from '../service-invoice-detail/service-invoice-detail.component';
import { ServiceInvoiceAddComponent } from '../service-invoice-add/service-invoice-add.component';
// import { ServicePaymentAddComponent } from '../service-payment-add/service-payment-add.component';


const invoiceRoutes = [
  { path: "", children:[
    { path: "", component: ServiceInvoiceListComponent,canActivate:[AuthComponentGuard], data:{ expectedRole: ['1']}},
    // { path: 'add-invoice', component: ServiceInvoiceAddComponent,canActivate:[AuthComponentGuard], data:{ expectedRole: ['1']}},
    { path: "invoice-detail/:id", children:[
      {path:"", component:ServiceInvoiceDetailComponent,canActivate:[AuthComponentGuard], data:{ expectedRole: ['1']}},
    ] }
  ]},

]

@NgModule({
  declarations: [ServiceInvoiceListComponent,ServiceInvoiceDetailComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(invoiceRoutes),
    FormsModule,
    ReactiveFormsModule,
    NgMultiSelectDropDownModule,
    MaterialModule,
    AutocompleteLibModule,
    MatIconModule,
    MatDialogModule,
    NgxMatSelectSearchModule,
    AppUtilityModule
  ]
})
export class ServiceInvoiceModuleModule { }
