import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthComponentGuard } from 'src/app/auth-component.guard';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatIconModule, MatDialogModule } from '@angular/material';
import { RouterModule } from '@angular/router';
import { AutocompleteLibModule } from 'angular-ng-autocomplete';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import { MaterialModule } from 'src/app/material';
import { AppUtilityModule } from 'src/app/app-utility.module';
import { UserdesignationComponent } from '../userdesignation.component';
import { DesignationComponent } from 'src/app/user/designation/designation.component';

const userdesignationRoutes = [
  { path: "", component: UserdesignationComponent,canActivate:[AuthComponentGuard], data:{ expectedRole: ['1']}},
]

@NgModule({
  declarations: [
    UserdesignationComponent,
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(userdesignationRoutes),
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
  entryComponents:[]
})

export class UserdesignationModule {constructor(){
}}

