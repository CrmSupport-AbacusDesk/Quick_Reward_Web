import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthComponentGuard } from 'src/app/auth-component.guard';
import { InfluencerListComponent } from '../influencer-list/influencer-list.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatIconModule, MatDialogModule } from '@angular/material';
import { RouterModule } from '@angular/router';
import { AutocompleteLibModule } from 'angular-ng-autocomplete';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import { AddInfluencerComponent } from 'src/app/add-influencer/add-influencer.component';
import { AppUtilityModule } from 'src/app/app-utility.module';
import { MaterialModule } from 'src/app/material';
import { InfluencerDetailComponent } from '../influencer-detail/influencer-detail.component';
import { AdvanceAddGiftComponent } from '../advance-add-gift/advance-add-gift.component';

import { RedeemRequestDetailComponent } from 'src/app/redeem/redeem-request-detail/redeem-request-detail.component';
const influencerRouters = [
  {
    path: "", children: [
      { path: "", component: InfluencerListComponent, canActivate: [AuthComponentGuard], data: { expectedRole: ['1'] } },
      {
        path: "influencer-detail/:id/:type_id", children: [
          { path: '', component: InfluencerDetailComponent, canActivate: [AuthComponentGuard], data: { expectedRole: ['1'] } },
          { path: "add-influencer", component: AddInfluencerComponent, canActivate: [AuthComponentGuard], data: { expectedRole: ['1'] } },
          { path: "redeem-detail/:id", component: RedeemRequestDetailComponent, canActivate: [AuthComponentGuard], data: { expectedRole: ['1'] } },

        ]
      },
      { path: "add-influencer", component: AddInfluencerComponent, canActivate: [AuthComponentGuard], data: { expectedRole: ['1'] } },
    ]
  },

]
@NgModule({
  declarations: [  AdvanceAddGiftComponent,],
  imports: [
    CommonModule,
    RouterModule.forChild(influencerRouters),
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
  entryComponents: [AdvanceAddGiftComponent]
})
export class InfluencerModule {
  constructor() {
  }
}
