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
import { AddDistributionComponent } from '../add-distribution/add-distribution.component';
import { DistributionDetailComponent } from '../distribution-detail/distribution-detail.component';
import { DistributionListComponent } from '../distribution-list/distribution-list.component';
import { DistributionEditComponent } from '../distribution-edit/distribution-edit.component';
import { AgmCoreModule } from '@agm/core';
import { DistributorModelComponent } from '../distributor-model/distributor-model.component';
import { InvoiceListModalComponent } from 'src/app/invoice-list-modal/invoice-list-modal.component';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { DealerComponent } from '../dealer/dealer.component';
import { OrderDetailComponent } from 'src/app/order/order-detail/order-detail.component';
import { SecondaryOrderDetailComponent } from 'src/app/order/secondary-order-detail/secondary-order-detail.component';
import { DistPrimaryOrderAddComponent } from '../dist-primary-order-add/dist-primary-order-add.component';
import { SecondaryOrderAddComponent } from '../secondary-order-add/secondary-order-add.component';
import { ConvertToDistributorComponent } from 'src/app/otp/convert-to-distributor/convert-to-distributor.component';
import { BillingDetailComponent } from 'src/app/billing-detail/billing-detail.component';
import { AddItemComponent } from 'src/app/add-item/add-item.component';
import { DistPrimaryOrderAddQtyComponent } from '../dist-primary-order-add-qty/dist-primary-order-add-qty.component';

import { SecondaryBillUploadDetailComponent } from 'src/app/Secondary-Bill-Upload/secondary-bill-upload-detail/secondary-bill-upload-detail.component';
import { environment } from 'src/environments/environment';
// import {ProgressBarModule} from "angular-progress-bar"
const distributionRoutes = [
  {
    path: "", children: [
      { path: "", component: DistributionListComponent, canActivate: [AuthComponentGuard], data: { expectedRole: ['1'] } },
      {
        path: "distribution-detail/:id/:tabtype", children: [
          { path: "", component: DistributionDetailComponent, canActivate: [AuthComponentGuard], data: { expectedRole: ['1', '2'] } },
          { path: 'order-detail/:id', component: OrderDetailComponent, canActivate: [AuthComponentGuard], data: { expectedRole: ['1', '2'] } },
          { path: 'secondary-order-detail/:id', component: SecondaryOrderDetailComponent, canActivate: [AuthComponentGuard], data: { expectedRole: ['1', '2'] } },
          { path: "edit-distribution/:type/:id/:pageType", component: AddDistributionComponent, canActivate: [AuthComponentGuard], data: { expectedRole: ['1'] } },
          { path: "add-primary-order", component: DistPrimaryOrderAddComponent, canActivate: [AuthComponentGuard], data: { expectedRole: ['1'] } },
          { path: "add-primary-order-qty", component: DistPrimaryOrderAddQtyComponent, canActivate: [AuthComponentGuard], data: { expectedRole: ['1'] } },
          { path: "secondary-order-add", component: SecondaryOrderAddComponent, canActivate: [AuthComponentGuard], data: { expectedRole: ['1'] } },
          { path: 'billing-details/:id', component: BillingDetailComponent, canActivate: [AuthComponentGuard], data: { expectedRole: ['1'] } },
          { path: 'secondary-bill-upload-detail/:id', component: SecondaryBillUploadDetailComponent, canActivate: [AuthComponentGuard], data: { expectedRole: ['1', '2'] } },
        ]
      },
      { path: "add-distribution/:type/:id/:pageType", component: AddDistributionComponent, canActivate: [AuthComponentGuard], data: { expectedRole: ['1'] } },
      { path: "dealer", component: DealerComponent, canActivate: [AuthComponentGuard], data: { expectedRole: ['1'] } },
    ]
  },
]

@NgModule({
  declarations: [
    DealerComponent,
    ConvertToDistributorComponent,
    DistributionEditComponent,
    DistributorModelComponent,
    InvoiceListModalComponent,
    SecondaryOrderAddComponent
    // DistributionLegderModelComponent,
  ],
  imports: [
    AgmCoreModule.forRoot({
      apiKey: environment.googleMapsApiKey
      
    }),
    CommonModule,
    RouterModule.forChild(distributionRoutes),
    FormsModule,
    ReactiveFormsModule,
    NgMultiSelectDropDownModule,
    MaterialModule,
    AutocompleteLibModule,
    MatIconModule,
    MatDialogModule,
    NgxMatSelectSearchModule,
    InfiniteScrollModule,
    AppUtilityModule,
    // ProgressBarModule
  ],
  entryComponents: [
    DistributionEditComponent,
    DistributorModelComponent,
    ConvertToDistributorComponent,
    InvoiceListModalComponent,
    AddItemComponent
  ],
})
export class DistributionModule {
  constructor() {
  }
}