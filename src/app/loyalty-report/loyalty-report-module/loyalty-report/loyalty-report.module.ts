import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthComponentGuard } from 'src/app/auth-component.guard';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { MaterialModule } from 'src/app/material';
import { AutocompleteLibModule } from 'angular-ng-autocomplete';
import { MatIconModule, MatDialogModule } from '@angular/material';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import { AppUtilityModule } from 'src/app/app-utility.module';

import { LoyaltyReportInfluencerBonusPointComponent } from '../../loyalty-report-influencer-bonus-point/loyalty-report-influencer-bonus-point.component';
import { LoyaltyReportInfluencerRewardPointComponent } from '../../loyalty-report-influencer-reward-point/loyalty-report-influencer-reward-point.component';
import { LoyaltyReportInfluencerScanPointComponent } from '../../loyalty-report-influencer-scan-point/loyalty-report-influencer-scan-point.component';
import { LoyaltyReportInfluencerCategorywiseScanPointComponent } from '../../loyalty-report-influencer-categorywise-scan-point/loyalty-report-influencer-categorywise-scan-point.component';
import { LoyaltyReportStateWiseLoginAgeingComponent } from '../../loyalty-report-state-wise-login-ageing/loyalty-report-state-wise-login-ageing.component';
import { LoyaltyReportMonthWiseScanComponent } from '../../loyalty-report-month-wise-scan/loyalty-report-month-wise-scan.component';
import { LoyaltyReportScanPointReqListComponent } from '../../loyalty-report-scan-point-req-list/loyalty-report-scan-point-req-list.component';
import { LoyaltyReportSevenDaysNotScannedComponent } from '../../loyalty-report-seven-days-not-scanned/loyalty-report-seven-days-not-scanned.component';
import { LoyaltyReportStateKycStatusComponent } from '../../loyalty-report-state-kyc-status/loyalty-report-state-kyc-status.component';
import { LoyaltyReportInfluencerMonthwiseScanComponent } from '../../loyalty-report-influencer-monthwise-scan/loyalty-report-influencer-monthwise-scan.component';
import { LoyaltyReportPointSummaryComponent } from '../../loyalty-report-point-summary/loyalty-report-point-summary.component';
import { LoyaltyReportNotScannedSevenDayComponent } from '../../loyalty-report-not-scanned-seven-day/loyalty-report-not-scanned-seven-day.component';
import { LoyaltyReportCouponHistoryComponent } from '../../loyalty-report-coupon-history/loyalty-report-coupon-history.component';
import { LoyaltyReportScanAgeingComponent } from '../../loyalty-report-scan-ageing/loyalty-report-scan-ageing.component';
import { LoyaltyReportInfluencerRedemptionComponent } from '../../loyalty-report-influencer-redemption/loyalty-report-influencer-redemption.component';
import { LoyaltyScanRatioReportComponent } from '../../loyalty-scan-ratio-report/loyalty-scan-ratio-report.component';
import { LoyaltyProductwiseScanRatioComponent } from '../../loyalty-productwise-scan-ratio/loyalty-productwise-scan-ratio.component';
import { LoyaltyStatewiseRegistrationRatioComponent } from '../../loyalty-statewise-registration-ratio/loyalty-statewise-registration-ratio.component';
import { CategoryWiseScanReportComponent } from '../../category-wise-scan-report/category-wise-scan-report.component';






const ReportsRoutes = [
  {
    path: "", children: [

      { path: "loyalty-report-influencer-bonus-point", component: LoyaltyReportInfluencerBonusPointComponent, canActivate: [AuthComponentGuard], data: { expectedRole: ['1'] } },

      { path: "loyalty-report-influencer-reward-point", component: LoyaltyReportInfluencerRewardPointComponent, canActivate: [AuthComponentGuard], data: { expectedRole: ['1'] } },

      { path: "loyalty-report-influencer-scan-point", component: LoyaltyReportInfluencerScanPointComponent, canActivate: [AuthComponentGuard], data: { expectedRole: ['1'] } },

      { path: "loyalty-report-influencer-categorywise-scan-point", component: LoyaltyReportInfluencerCategorywiseScanPointComponent, canActivate: [AuthComponentGuard], data: { expectedRole: ['1'] } },

      { path: "loyalty-report-influencer-redemption", component: LoyaltyReportInfluencerRedemptionComponent, canActivate: [AuthComponentGuard], data: { expectedRole: ['1'] } },

      { path: "loyalty-report-state-wise-login-ageing", component: LoyaltyReportStateWiseLoginAgeingComponent, canActivate: [AuthComponentGuard], data: { expectedRole: ['1'] } },

      { path: "loyalty-report-state-kyc-status", component: LoyaltyReportStateKycStatusComponent, canActivate: [AuthComponentGuard], data: { expectedRole: ['1'] } },

      { path: "loyalty-report-point-summary", component: LoyaltyReportPointSummaryComponent, canActivate: [AuthComponentGuard], data: { expectedRole: ['1'] } },

      { path: "loyalty-report-scan-ageing", component: LoyaltyReportScanAgeingComponent, canActivate: [AuthComponentGuard], data: { expectedRole: ['1'] } },

      { path: "loyalty-report-scan-point-req-list", component: LoyaltyReportScanPointReqListComponent, canActivate: [AuthComponentGuard], data: { expectedRole: ['1'] } },

      { path: "loyalty-report-influencer-monthwise-scan", component: LoyaltyReportInfluencerMonthwiseScanComponent, canActivate: [AuthComponentGuard], data: { expectedRole: ['1'] } },

      { path: "loyalty-report-not-scanned-seven-day", component: LoyaltyReportNotScannedSevenDayComponent, canActivate: [AuthComponentGuard], data: { expectedRole: ['1'] } },

     { path: "loyalty-report-coupon-history", component: LoyaltyReportCouponHistoryComponent, canActivate: [AuthComponentGuard], data: { expectedRole: ['1'] } },

     { path: "loyalty-report-month-wise-scan", component: LoyaltyReportMonthWiseScanComponent, canActivate: [AuthComponentGuard], data: { expectedRole: ['1'] } },

     { path: "loyalty-report-seven-days-not-scanned", component: LoyaltyReportSevenDaysNotScannedComponent, canActivate: [AuthComponentGuard], data: { expectedRole: ['1'] } },
     { path: "loyalty-scan-ratio-report", component: LoyaltyScanRatioReportComponent, canActivate: [AuthComponentGuard], data: { expectedRole: ['1'] } },
     { path: "loyalty-productwise-scan-ratio", component: LoyaltyProductwiseScanRatioComponent, canActivate: [AuthComponentGuard], data: { expectedRole: ['1'] } },
     { path: "loyalty-statewise-registration-ratio", component: LoyaltyStatewiseRegistrationRatioComponent, canActivate: [AuthComponentGuard], data: { expectedRole: ['1'] } },
     { path: "category-wise-scan-point", component: CategoryWiseScanReportComponent, canActivate: [AuthComponentGuard], data: { expectedRole: ['1'] } },
    ]
  }
]



@NgModule({
  declarations: [LoyaltyReportInfluencerBonusPointComponent,LoyaltyReportInfluencerRewardPointComponent,LoyaltyReportInfluencerScanPointComponent,LoyaltyReportInfluencerCategorywiseScanPointComponent,LoyaltyReportInfluencerRedemptionComponent,
    LoyaltyReportStateWiseLoginAgeingComponent,LoyaltyReportStateKycStatusComponent,LoyaltyReportPointSummaryComponent,LoyaltyReportScanAgeingComponent,
    LoyaltyReportScanPointReqListComponent,LoyaltyReportInfluencerMonthwiseScanComponent,LoyaltyReportNotScannedSevenDayComponent,LoyaltyReportCouponHistoryComponent,CategoryWiseScanReportComponent,
    LoyaltyReportMonthWiseScanComponent,LoyaltyReportSevenDaysNotScannedComponent,LoyaltyScanRatioReportComponent,LoyaltyProductwiseScanRatioComponent,LoyaltyStatewiseRegistrationRatioComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(ReportsRoutes),
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
export class LoyaltyReportModule { }
