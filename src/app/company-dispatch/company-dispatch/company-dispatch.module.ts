import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthComponentGuard } from 'src/app/auth-component.guard';
import { GatepassAddComponent } from '../gatepass-add/gatepass-add.component';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatIconModule, MatDialogModule } from '@angular/material';
import { AutocompleteLibModule } from 'angular-ng-autocomplete';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import { AppUtilityModule } from 'src/app/app-utility.module';
import { MaterialModule } from 'src/app/material';
import { NgxQRCodeModule } from '@techiediaries/ngx-qrcode';
import { NgxBarcodeModule } from 'ngx-barcode';
// import { ManualDispatchListComponent } from 'src/app/manual-dispatch/manual-dispatch-list/manual-dispatch-list.component';
// import { SalesReturnListComponent } from 'src/app/sales-return/sales-return-list/sales-return-list.component';
import { CouponCodeAddComponent } from 'src/app/coupon/coupon-code-add/coupon-code-add.component';
import { CouponCodeDetailComponent } from 'src/app/coupon/coupon-code-detail/coupon-code-detail.component';
import { CompanyDispatchListComponent } from '../company-dispatch-list/company-dispatch-list.component';
import { CompanyDispatchDetailComponent } from '../company-dispatch-detail/company-dispatch-detail.component';
import { CompanySalesReturnComponent } from '../company-sales-return/company-sales-return.component';
import { AddGrandMasterBoxComponent } from '../add-grand-master-box/add-grand-master-box.component';
import { ViewMasterBoxDispatchDetailComponent } from '../view-master-box-dispatch-detail/view-master-box-dispatch-detail.component';
import { GatepassScanningComponent } from '../gatepass-scanning/gatepass-scanning.component';

const dispatchRoutes = [
  {
    path: "", children: [
      { path: "", component: CompanyDispatchListComponent, canActivate: [AuthComponentGuard], data: { expectedRole: ['1'] } },
      // { path: "manual-dispatch", component: ManualDispatchListComponent,canActivate:[AuthComponentGuard], data:{ expectedRole: ['1']}},
      { path: "company-return", component: CompanySalesReturnComponent, canActivate: [AuthComponentGuard], data: { expectedRole: ['1'] } },
      {
        path: "coupon-add", children: [
          { path: '', component: CouponCodeAddComponent, canActivate: [AuthComponentGuard], data: { expectedRole: ['1'] } },
          { path: "coupon-code-detail/:id", component: CouponCodeDetailComponent, canActivate: [AuthComponentGuard], data: { expectedRole: ['1'] } },
        ]
      },

      {
        path: "dispacth-detail/:id", children: [
          { path: '', component: CompanyDispatchDetailComponent, canActivate: [AuthComponentGuard], data: { expectedRole: ['1'] } },
        ]
      },
      {
        path: "gatepass-scanning/:id", children: [
          { path: '', component: GatepassScanningComponent, canActivate: [AuthComponentGuard], data: { expectedRole: ['1'] } },
        ]
      },
    ]
  },
]

@NgModule({
  declarations: [CompanyDispatchListComponent, CompanySalesReturnComponent, CompanyDispatchDetailComponent, GatepassScanningComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(dispatchRoutes),
    FormsModule,
    ReactiveFormsModule,
    NgMultiSelectDropDownModule,
    MaterialModule,
    AutocompleteLibModule,
    MatIconModule,
    MatDialogModule,
    NgxMatSelectSearchModule,
    AppUtilityModule,
    NgxQRCodeModule,
    NgxBarcodeModule,

  ],
  entryComponents: [GatepassAddComponent, AddGrandMasterBoxComponent, ViewMasterBoxDispatchDetailComponent]
})
export class CompanyDispatchModule { }
