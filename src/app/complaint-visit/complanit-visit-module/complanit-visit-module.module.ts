import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthComponentGuard } from 'src/app/auth-component.guard';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { MaterialModule } from 'src/app/material';
import { AutocompleteLibModule } from 'angular-ng-autocomplete';
import { MatDialogModule, MatIconModule } from '@angular/material';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import { AppUtilityModule } from 'src/app/app-utility.module';
import { ComplaintVisitListComponent } from '../complaint-visit-list/complaint-visit-list.component';

const complaintVisitRoutes = [
  { path: "", children:[
    { path: "", component: ComplaintVisitListComponent,canActivate:[AuthComponentGuard], data:{ expectedRole: ['1']}},
  ]},

]

@NgModule({
  declarations: [ComplaintVisitListComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(complaintVisitRoutes),
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
export class ComplanitVisitModuleModule { }
