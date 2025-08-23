import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProuctWiseSecondaryReportComponent } from '../../prouct-wise-secondary-report/prouct-wise-secondary-report.component';
import { AuthComponentGuard } from 'src/app/auth-component.guard';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { MaterialModule } from 'src/app/material';
import { AutocompleteLibModule } from 'angular-ng-autocomplete';
import { MatDialogModule, MatIconModule } from '@angular/material';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import { AppUtilityModule } from 'src/app/app-utility.module';
import { ProductWiseSecondaryReportModalComponent } from '../../prouct-wise-secondary-report/product-wise-secondary-report-modal/product-wise-secondary-report-modal.component';
import { PrimaryTargetReportComponent } from '../../primary-target-report/primary-target-report.component';
import { SecondaryTargetReportComponent } from '../../secondary-target-report/secondary-target-report.component';
import { CPSalesReportComponent } from '../../c-p-sales-report/c-p-sales-report.component';
import { UserWorkReportComponent } from '../../user-work-report/user-work-report.component';
import { MasterReportComponent } from '../../master-report/master-report.component';
import { HeaderSettingModalComponent } from 'src/app/header-setting-modal/header-setting-modal.component';


const ReportsRoutes = [
  {
    path: "", children: [
      { path: "product-wise-secondary-report-list", component: ProuctWiseSecondaryReportComponent, canActivate: [AuthComponentGuard], data: { expectedRole: ['1'] } },
      { path: "primary-target-report", component: PrimaryTargetReportComponent, canActivate: [AuthComponentGuard], data: { expectedRole: ['1'] } },
      { path: "secondary-target-report", component: SecondaryTargetReportComponent, canActivate: [AuthComponentGuard], data: { expectedRole: ['1'] } },
      { path: "c-p-sales-report", component: CPSalesReportComponent, canActivate: [AuthComponentGuard], data: { expectedRole: ['1'] } },
      { path: "user-work-report", component: UserWorkReportComponent, canActivate: [AuthComponentGuard], data: { expectedRole: ['1'] } },
      { path: "report/:type", component: MasterReportComponent, canActivate: [AuthComponentGuard], data: { expectedRole: ['1'] } },

    ]
  }
]
@NgModule({
  declarations: [ProuctWiseSecondaryReportComponent, MasterReportComponent, ProductWiseSecondaryReportModalComponent, PrimaryTargetReportComponent, SecondaryTargetReportComponent, CPSalesReportComponent, UserWorkReportComponent],
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
  ],
  entryComponents: [
    HeaderSettingModalComponent,
    ProductWiseSecondaryReportModalComponent
  ]
})
export class ReportsModule { }
