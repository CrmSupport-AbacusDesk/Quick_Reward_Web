import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatIconModule, MatDialogModule, MAT_PROGRESS_SPINNER_DEFAULT_OPTIONS } from '@angular/material';
import { RouterModule } from '@angular/router';
import { AutocompleteLibModule } from 'angular-ng-autocomplete';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import { AppUtilityModule } from 'src/app/app-utility.module';
import { MaterialModule } from 'src/app/material';
import { AuthComponentGuard } from 'src/app/auth-component.guard';
import { ContractorMeetListComponent } from '../contractor-meet-list/contractor-meet-list.component';
import { ContractorMeetDetailComponent } from '../contractor-meet-detail/contractor-meet-detail.component';
import { ContractorMeetStatusModalComponent } from '../contractor-meet-status-modal/contractor-meet-status-modal.component';
const eventRoutes = [
  {
    path: "", children: [
      { path: "", component: ContractorMeetListComponent, canActivate: [AuthComponentGuard], data: { expectedRole: ['1'] } },
      { path: "contractor-detail/:id", component: ContractorMeetDetailComponent, canActivate: [AuthComponentGuard], data: { expectedRole: ['1'] } },
    ]
  },

]
@NgModule({
  declarations: [
    ContractorMeetDetailComponent,
    ContractorMeetStatusModalComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(eventRoutes),
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
  entryComponents: [ContractorMeetStatusModalComponent]
})
export class ContractorMeetModule {
  constructor() {
  }
}
