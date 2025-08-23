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
import { FollowupDetailComponent } from '../followup-detail/followup-detail.component';
import { FollowupListComponent } from '../followup-list/followup-list.component';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { FollowupEditComponent } from '../followup-edit/followup-edit.component';
import { DistributionDetailComponent } from 'src/app/distribution/distribution-detail/distribution-detail.component';
import { AgmCoreModule } from '@agm/core';
import { OrderDetailComponent } from 'src/app/order/order-detail/order-detail.component';
import { AddDistributionComponent } from 'src/app/distribution/add-distribution/add-distribution.component';
import { SecondaryOrderDetailComponent } from 'src/app/order/secondary-order-detail/secondary-order-detail.component';
import { LeadDetailComponent } from 'src/app/lead/lead-detail/lead-detail.component';
import { environment } from 'src/environments/environment';
import { InfluencerDetailComponent } from 'src/app/Influencer/influencer-detail/influencer-detail.component';
import { AddInfluencerComponent } from 'src/app/add-influencer/add-influencer.component';
import { RedeemRequestDetailComponent } from 'src/app/redeem/redeem-request-detail/redeem-request-detail.component';
import { SiteDetailComponent } from 'src/app/site/site-detail/site-detail.component';
import { SiteAddComponent } from 'src/app/site/site-add/site-add.component';
import { AddItemComponent } from 'src/app/add-item/add-item.component';
import { AddLeadComponent } from 'src/app/lead/add-lead/add-lead.component';
const followupRoutes = [
  {
    path: "", children: [
      { path: "", component: FollowupListComponent, canActivate: [AuthComponentGuard], data: { expectedRole: ['1'] } },
      { path: "followup-detail/:id", component: FollowupDetailComponent, canActivate: [AuthComponentGuard], data: { expectedRole: ['1', '2'] } },
      { path: 'lead-detail/:id', component: LeadDetailComponent, canActivate: [AuthComponentGuard], data: { expectedRole: ['1', '2'] } },
      {
        path: "distribution-detail/:id/:tabtype", children: [
          { path: "", component: DistributionDetailComponent, canActivate: [AuthComponentGuard], data: { expectedRole: ['1', '2'] } },
          { path: 'order-detail/:id', component: OrderDetailComponent, canActivate: [AuthComponentGuard], data: { expectedRole: ['1', '2'] } },
          { path: 'secondary-order-detail/:id', component: SecondaryOrderDetailComponent, canActivate: [AuthComponentGuard], data: { expectedRole: ['1', '2'] } },
          { path: "edit-distribution/:type/:id/:pageType", component: AddDistributionComponent, canActivate: [AuthComponentGuard], data: { expectedRole: ['1'] } },

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
  {
    path: "influencer-detail/:id/:type_id", children: [
      { path: '', component: InfluencerDetailComponent, canActivate: [AuthComponentGuard], data: { expectedRole: ['1'] } },
      { path: "add-influencer", component: AddInfluencerComponent, canActivate: [AuthComponentGuard], data: { expectedRole: ['1'] } },
      { path: "redeem-detail/:id", component: RedeemRequestDetailComponent, canActivate: [AuthComponentGuard], data: { expectedRole: ['1'] } },

    ]
  },
  {
    path: "site-detail/:id", children: [
      { path: "", component: SiteDetailComponent, canActivate: [AuthComponentGuard], data: { expectedRole: ['1'] } },
      { path: "add-site", component: SiteAddComponent, canActivate: [AuthComponentGuard], data: { expectedRole: ['1'] } },
      { path: 'order-detail/:id', component: OrderDetailComponent, canActivate: [AuthComponentGuard], data: { expectedRole: ['1', '2'] } },
      { path: "add-item/:type/:id", component: AddItemComponent, canActivate: [AuthComponentGuard], data: { expectedRole: ['1'] } },

      // { path: "site-order-add/:id/:type", component: SiteOrderAddComponen, canActivate: [AuthComponentGuard], data: { expectedRole: ['1'] } },
    ]
  },
]
@NgModule({
  declarations: [
    FollowupListComponent,
    FollowupDetailComponent,
    FollowupEditComponent,

  ],
  imports: [
    AgmCoreModule.forRoot({
      apiKey: environment.googleMapsApiKey,
    }),
    CommonModule,
    RouterModule.forChild(followupRoutes),
    FormsModule,
    ReactiveFormsModule,
    NgMultiSelectDropDownModule,
    MaterialModule,
    AutocompleteLibModule,
    MatIconModule,
    MatDialogModule,
    NgxMatSelectSearchModule,
    AppUtilityModule,
    InfiniteScrollModule,
  ],
  entryComponents: [FollowupEditComponent]
})
export class FollowupModule {
  constructor() {
  }
}
