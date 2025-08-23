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
import { AllowancesComponent } from '../allowances.component';
import { AuthComponentGuard } from 'src/app/auth-component.guard';

const allowancesRoutes = [
  { path: "", component: AllowancesComponent,canActivate:[AuthComponentGuard], data:{ expectedRole: ['1']}},
]

@NgModule({
  declarations: [
    AllowancesComponent,
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(allowancesRoutes),
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
export class AllowancesModule {constructor(){
} }
