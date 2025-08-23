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
import { IndividualAttendanceReportComponent } from './individual-attendance-report/individual-attendance-report.component';
import { AttendanceSummaryReportComponent } from './attendance-summary-report/attendance-summary-report.component';
import { CheckinSummaryReportComponent } from './checkin-summary-report/checkin-summary-report.component';
import { CheckinDetailReportComponent } from './checkin-detail-report/checkin-detail-report.component';
import { VisitRatioReportComponent } from './visit-ratio-report/visit-ratio-report.component';
import { UserWorkingReportComponent } from './user-working-report/user-working-report.component';
import { TargetVsAchievementReportComponent } from './target-vs-achievement-report/target-vs-achievement-report.component';
import { ProductSalesReportComponent } from './product-sales-report/product-sales-report.component';
import { PopGiftReportComponent } from './pop-gift-report/pop-gift-report.component';
import { EventAnalysisReportComponent } from './event-analysis-report/event-analysis-report.component';
import { EnquiryReportComponent } from './enquiry-report/enquiry-report.component';
import { CheckinReportMultiUserWiseComponent } from '../checkin-report-multi-user-wise/checkin-report-multi-user-wise.component';
import { ExpenseReportMultiUserWiseComponent } from './expense-report-multi-user-wise/expense-report-multi-user-wise.component';






const ReportsRoutes = [
  {
    path: "", children: [
     
      { path: "individual-attendance", component: IndividualAttendanceReportComponent, canActivate: [AuthComponentGuard], data: { expectedRole: ['1'] } },
      { path: "attendance-summary", component: AttendanceSummaryReportComponent, canActivate: [AuthComponentGuard], data: { expectedRole: ['1'] } },
      { path: "checkin-detail", component: CheckinDetailReportComponent, canActivate: [AuthComponentGuard], data: { expectedRole: ['1'] } },
      { path: "checkin-summary", component: CheckinSummaryReportComponent, canActivate: [AuthComponentGuard], data: { expectedRole: ['1'] } },
      { path: "visit-ratio", component: VisitRatioReportComponent, canActivate: [AuthComponentGuard], data: { expectedRole: ['1'] } },
      { path: "user-working", component: UserWorkingReportComponent, canActivate: [AuthComponentGuard], data: { expectedRole: ['1'] } },
      { path: "target-vs-achievement", component: TargetVsAchievementReportComponent, canActivate: [AuthComponentGuard], data: { expectedRole: ['1'] } },
      { path: "product-sales", component: ProductSalesReportComponent, canActivate: [AuthComponentGuard], data: { expectedRole: ['1'] } },
      { path: "pop-gift", component: PopGiftReportComponent, canActivate: [AuthComponentGuard], data: { expectedRole: ['1'] } },
      { path: "event-analysis", component: EventAnalysisReportComponent, canActivate: [AuthComponentGuard], data: { expectedRole: ['1'] } },
      { path: "enquiry-report", component: EnquiryReportComponent, canActivate: [AuthComponentGuard], data: { expectedRole: ['1'] } },
      { path: "checkin-report-multi-user-wise", component: CheckinReportMultiUserWiseComponent, canActivate: [AuthComponentGuard], data: { expectedRole: ['1'] } },
      { path: "expense-report-multi-user-wise", component: ExpenseReportMultiUserWiseComponent, canActivate: [AuthComponentGuard], data: { expectedRole: ['1'] } },
     
     

    ]
  }
]



@NgModule({
  declarations: [
    IndividualAttendanceReportComponent, 
    AttendanceSummaryReportComponent, 
    CheckinSummaryReportComponent, 
    CheckinDetailReportComponent,
    VisitRatioReportComponent,
    UserWorkingReportComponent,
    TargetVsAchievementReportComponent,
    ProductSalesReportComponent,
    PopGiftReportComponent,
    EventAnalysisReportComponent,
    EnquiryReportComponent,
    CheckinReportMultiUserWiseComponent,
    ExpenseReportMultiUserWiseComponent
  ],
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
export class SfaReportModule { }
