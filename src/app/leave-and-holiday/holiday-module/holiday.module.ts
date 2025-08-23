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
import { AddHolidayComponent } from '../add-holiday/add-holiday.component';
import { HolidayListComponent } from '../holiday-list/holiday-list.component';
const holidayRoute = [
  {
    path: "", children: [
      { path: '', component: HolidayListComponent, canActivate: [AuthComponentGuard], data: { expectedRole: ['1'] } },
      { path: "add-holiday", component: AddHolidayComponent, canActivate: [AuthComponentGuard], data: { expectedRole: ['1'] } },
    ]
  },
]

@NgModule({
  declarations: [
    HolidayListComponent,
    AddHolidayComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(holidayRoute),
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
export class HolidayModule {
    constructor() {
    }
}
