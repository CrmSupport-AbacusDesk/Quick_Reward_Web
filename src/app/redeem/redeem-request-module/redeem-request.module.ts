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
import { RedeemRequestDetailComponent } from '../redeem-request-detail/redeem-request-detail.component';
import { RedeemRequestListComponent } from '../redeem-request-list/redeem-request-list.component';
import { RedeemStatusModalComponent } from 'src/app/redeem-status-modal/redeem-status-modal.component';
import { InfluencerDetailComponent } from 'src/app/Influencer/influencer-detail/influencer-detail.component';
const redeemRequestRoutes = [
  {
    path: "", children: [
      { path: "", component: RedeemRequestListComponent, canActivate: [AuthComponentGuard], data: { expectedRole: ['1'] } },
      { path: "redeem-detail/:id", component: RedeemRequestDetailComponent, canActivate: [AuthComponentGuard], data: { expectedRole: ['1'] } },
      { path: 'influencer-detail/:id/:type_id', component: InfluencerDetailComponent, canActivate: [AuthComponentGuard], data: { expectedRole: ['1'] } },

    ]
  }
]
@NgModule({
  declarations: [RedeemRequestListComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(redeemRequestRoutes),
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
export class RedeemRequestModule {
  constructor() {
  }
}
