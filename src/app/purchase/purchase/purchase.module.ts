
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatIconModule, MatDialogModule } from '@angular/material';
import { RouterModule } from '@angular/router';
import { AutocompleteLibModule } from 'angular-ng-autocomplete';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import { MaterialModule } from 'src/app/material';
import { AuthComponentGuard } from 'src/app/auth-component.guard';
import { AppUtilityModule } from 'src/app/app-utility.module';
import { PurchaseListComponent } from '../purchase-list/purchase-list.component';
import { PurchaseDetailComponent } from '../purchase-detail/purchase-detail.component';
import { PurchaseAddComponent } from '../purchase-add/purchase-add.component';


const purchaseRoutes = [
  {
    path: "", children: [
      { path: "", component: PurchaseListComponent, canActivate: [AuthComponentGuard], data: { expectedRole: ['1'] } },
      { path: 'purchase-add', component: PurchaseAddComponent, canActivate: [AuthComponentGuard], data: { expectedRole: ['1'] } },
      { path: 'purchasedetail/:id', component: PurchaseDetailComponent, canActivate: [AuthComponentGuard], data: { expectedRole: ['1'] } },
    ]
  }
]
@NgModule({
  declarations: [PurchaseListComponent, PurchaseDetailComponent, PurchaseAddComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(purchaseRoutes),
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

})
export class PurchaseModule { }

