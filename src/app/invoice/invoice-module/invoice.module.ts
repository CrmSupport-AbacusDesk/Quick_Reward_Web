import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatIconModule, MatDialogModule } from '@angular/material';
import { RouterModule } from '@angular/router';
import { AutocompleteLibModule } from 'angular-ng-autocomplete';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import { AppUtilityModule } from 'src/app/app-utility.module';
import { AuthComponentGuard } from 'src/app/auth-component.guard';
import { MaterialModule } from 'src/app/material';
import { InvoiceComponent } from '../invoice.component';
import { InvoiceListModalComponent } from 'src/app/invoice-list-modal/invoice-list-modal.component';
const invoiceRoutes = [
  {path:'',component: InvoiceComponent,canActivate:[AuthComponentGuard], data:{expectedRole:['1']}},
]
@NgModule({
  declarations: [InvoiceComponent, ],
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
  ],
  entryComponents:[
    
  ]
})
export class InvoiceModule { constructor(){
  console.log('this is invoice module')
}}
