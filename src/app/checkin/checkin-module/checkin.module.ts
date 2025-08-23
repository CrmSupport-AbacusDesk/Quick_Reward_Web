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
import { CheckinComponent } from '../checkin.component';
import { DistributionDetailComponent } from 'src/app/distribution/distribution-detail/distribution-detail.component';
import { OrderDetailComponent } from 'src/app/order/order-detail/order-detail.component';
import { SecondaryOrderDetailComponent } from 'src/app/order/secondary-order-detail/secondary-order-detail.component';
import { AddDistributionComponent } from 'src/app/distribution/add-distribution/add-distribution.component';
import { LeadDetailComponent } from 'src/app/lead/lead-detail/lead-detail.component';
import { SiteDetailComponent } from 'src/app/site/site-detail/site-detail.component';
import { InfluencerDetailComponent } from 'src/app/Influencer/influencer-detail/influencer-detail.component';
import { AddInfluencerComponent } from 'src/app/add-influencer/add-influencer.component';
import { RedeemRequestDetailComponent } from 'src/app/redeem/redeem-request-detail/redeem-request-detail.component';
import { AddLeadComponent } from 'src/app/lead/add-lead/add-lead.component';

const checkinRoutes = [
  { path: "", component: CheckinComponent, canActivate: [AuthComponentGuard], data: { expectedRole: ['1'] } },
  {
    path: "distribution-detail/:id/:tabtype", children: [
      {
        path: "lead-detail/:id", children: [
          { path: "", component: LeadDetailComponent, canActivate: [AuthComponentGuard], data: { expectedRole: ['1', '2'] } },
          { path: "edit-lead/:id", component: AddLeadComponent, canActivate: [AuthComponentGuard], data: { expectedRole: ['1'] } },
        ]
      },
      { path: 'site-detail/:id', component: SiteDetailComponent, canActivate: [AuthComponentGuard], data: { expectedRole: ['1', '2'] } },
      { path: "", component: DistributionDetailComponent, canActivate: [AuthComponentGuard], data: { expectedRole: ['1', '2'] } },
      { path: 'order-detail/:id', component: OrderDetailComponent, canActivate: [AuthComponentGuard], data: { expectedRole: ['1', '2'] } },
      { path: 'secondary-order-detail/:id', component: SecondaryOrderDetailComponent, canActivate: [AuthComponentGuard], data: { expectedRole: ['1', '2'] } },
      { path: "edit-distribution/:type/:id/:pageType", component: AddDistributionComponent, canActivate: [AuthComponentGuard], data: { expectedRole: ['1'] } },
      { path: "edit-lead/:id", component: AddLeadComponent, canActivate: [AuthComponentGuard], data: { expectedRole: ['1'] } },
    ],
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
@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule.forChild(checkinRoutes),
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
  entryComponents: [
  ]
})
export class CheckinModule {
  constructor() {
  }
}
