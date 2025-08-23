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
import { AttendenceComponent } from '../attendence.component';
import { AttendanceDetailComponent } from 'src/app/attendance-detail/attendance-detail.component';
import { AgmCoreModule } from '@agm/core';
import { AgmDirectionModule } from 'agm-direction';
import { TrackerComponent } from '../tracker/tracker.component';
import { ZingchartAngularModule } from 'zingchart-angular';
import { SaleUserDetailComponent } from 'src/app/user/sale-user-detail/sale-user-detail.component';
import { EditUserComponent } from 'src/app/user/edit-user/edit-user.component';
import { DistributionDetailComponent } from 'src/app/distribution/distribution-detail/distribution-detail.component';
import { OrderDetailComponent } from 'src/app/order/order-detail/order-detail.component';
import { SecondaryOrderDetailComponent } from 'src/app/order/secondary-order-detail/secondary-order-detail.component';
import { AddDistributionComponent } from 'src/app/distribution/add-distribution/add-distribution.component';
import { DistPrimaryOrderAddComponent } from 'src/app/distribution/dist-primary-order-add/dist-primary-order-add.component';
import { DistPrimaryOrderAddQtyComponent } from 'src/app/distribution/dist-primary-order-add-qty/dist-primary-order-add-qty.component';
import { SecondaryOrderAddComponent } from 'src/app/order/secondary-order-add/secondary-order-add.component';
import { BillingDetailComponent } from 'src/app/billing-detail/billing-detail.component';
import { SecondaryBillUploadDetailComponent } from 'src/app/Secondary-Bill-Upload/secondary-bill-upload-detail/secondary-bill-upload-detail.component';
import { InfluencerDetailComponent } from 'src/app/Influencer/influencer-detail/influencer-detail.component';
import { AddInfluencerComponent } from 'src/app/add-influencer/add-influencer.component';
import { RedeemRequestDetailComponent } from 'src/app/redeem/redeem-request-detail/redeem-request-detail.component';
import { LeadDetailComponent } from 'src/app/lead/lead-detail/lead-detail.component';
import { AddLeadComponent } from 'src/app/lead/add-lead/add-lead.component';

const attendenceRoutes = [
  { path: "", component: AttendenceComponent, canActivate: [AuthComponentGuard], data: { expectedRole: ['1'] } },

  {
    path: "sale-user-detail/:id", children: [
      { path: '', component: SaleUserDetailComponent, canActivate: [AuthComponentGuard], data: { expectedRole: ['1'] } },
      { path: "user-edit/:id", component: EditUserComponent, canActivate: [AuthComponentGuard], data: { expectedRole: ['1'] } },
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
      {
        path: "influencer-detail/:id/:type_id", children: [
          { path: '', component: InfluencerDetailComponent, canActivate: [AuthComponentGuard], data: { expectedRole: ['1'] } },
          { path: "add-influencer", component: AddInfluencerComponent, canActivate: [AuthComponentGuard], data: { expectedRole: ['1'] } },
          { path: "redeem-detail/:id", component: RedeemRequestDetailComponent, canActivate: [AuthComponentGuard], data: { expectedRole: ['1'] } },

        ]
      },
      {
        path: "lead-detail/:id", children: [
          { path: "", component: LeadDetailComponent, canActivate: [AuthComponentGuard], data: { expectedRole: ['1', '2'] } },
          { path: "edit-lead/:id", component: AddLeadComponent, canActivate: [AuthComponentGuard], data: { expectedRole: ['1'] } },
        ]
      },
    ]
  },
  // { path: "tracker", component: TrackerComponent, canActivate: [AuthComponentGuard], data: { expectedRole: ['1'] } },

]
@NgModule({
  declarations: [
    //  AttendanceDetailComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(attendenceRoutes),
    FormsModule,
    ReactiveFormsModule,
    NgMultiSelectDropDownModule,
    MaterialModule,
    AutocompleteLibModule,
    MatIconModule,
    MatDialogModule,
    NgxMatSelectSearchModule,
    AppUtilityModule,
    AgmCoreModule,
    AgmDirectionModule,
    ZingchartAngularModule,
  ],
  entryComponents: [
    AttendanceDetailComponent,
  ]
})
export class AttendenceModule {
  constructor() {
  }
}
