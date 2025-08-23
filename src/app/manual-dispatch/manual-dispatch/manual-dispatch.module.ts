import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthComponentGuard } from 'src/app/auth-component.guard';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatIconModule, MatDialogModule } from '@angular/material';
import { AutocompleteLibModule } from 'angular-ng-autocomplete';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import { AppUtilityModule } from 'src/app/app-utility.module';
import { MaterialModule } from 'src/app/material';
import { ManualDispatchListComponent } from '../manual-dispatch-list/manual-dispatch-list.component';

const dispatchRoutes = [
  { path: "", children:[
    { path: "", component: ManualDispatchListComponent,canActivate:[AuthComponentGuard], data:{ expectedRole: ['1']}}
  ]},
]

@NgModule({
  declarations: [ManualDispatchListComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(dispatchRoutes),
    FormsModule,
    ReactiveFormsModule,
    NgMultiSelectDropDownModule,
    MaterialModule,
    AutocompleteLibModule,
    MatIconModule,
    MatDialogModule,
    NgxMatSelectSearchModule,
    AppUtilityModule,
  ],
  entryComponents:[]
})
export class ManualDispatchModule { }
