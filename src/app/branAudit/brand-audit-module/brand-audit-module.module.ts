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
import { BrandAuditListComponent } from '../brand-audit-list/brand-audit-list.component';
import { SupportStatusComponent } from 'src/app/support/support-status/support-status.component';


const brandAuditRoutes = [
  { path: "", component: BrandAuditListComponent, canActivate: [AuthComponentGuard], data: { expectedRole: ['1'] } },

]
@NgModule({
  declarations: [BrandAuditListComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(brandAuditRoutes),
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
    SupportStatusComponent

  ]
})
export class BrandAuditModuleModule {
  constructor() {
  }
}
