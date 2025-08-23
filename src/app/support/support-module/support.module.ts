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
import { SupportListComponent } from '../support-list/support-list.component';
import { SupportStatusComponent } from '../support-status/support-status.component';
const supportRoutes = [
  { path: "", component: SupportListComponent, canActivate: [AuthComponentGuard], data: { expectedRole: ['1'] } },

]
@NgModule({
  declarations: [

  ],
  imports: [
    CommonModule,
    RouterModule.forChild(supportRoutes),
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
    SupportStatusComponent,
  ]
})
export class SupportModule {
  constructor() {
  }
}
