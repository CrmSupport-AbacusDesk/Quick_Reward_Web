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
import { CouponCodeAddComponent } from '../coupon-code-add/coupon-code-add.component';
import { CouponCodeDetailComponent } from '../coupon-code-detail/coupon-code-detail.component';

import { CouponCodeListComponent } from '../coupon-code-list/coupon-code-list.component';
import { CouponDetailModalComponent } from '../coupon-detail-modal/coupon-detail-modal.component';
import { NgxQRCodeModule } from '@techiediaries/ngx-qrcode';
import { NgxBarcodeModule } from 'ngx-barcode';
// import { ManualDispatchListComponent } from 'src/app/manual-dispatch/manual-dispatch-list/manual-dispatch-list.component';
// import { SalesReturnListComponent } from 'src/app/sales-return/sales-return-list/sales-return-list.component';
const couponRoutes = [
  {
    path: "", children: [
      { path: "", component: CouponCodeListComponent, canActivate: [AuthComponentGuard], data: { expectedRole: ['1'] } },
      {
        path: "coupon-add", children: [
          { path: '', component: CouponCodeAddComponent, canActivate: [AuthComponentGuard], data: { expectedRole: ['1'] } },
          { path: "coupon-code-detail/:id", component: CouponCodeDetailComponent, canActivate: [AuthComponentGuard], data: { expectedRole: ['1'] } },
        ]
      },
      // { path: "manual-dispatch", component: ManualDispatchListComponent,canActivate:[AuthComponentGuard], data:{ expectedRole: ['1']}},
      // { path: "sales-return", component: SalesReturnListComponent,canActivate:[AuthComponentGuard], data:{ expectedRole: ['1']}},
    ]
  },
]
@NgModule({
  declarations: [CouponCodeListComponent, CouponDetailModalComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(couponRoutes),
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
  entryComponents: [CouponDetailModalComponent]
})
export class CouponModule {
  constructor() {
  }
}
