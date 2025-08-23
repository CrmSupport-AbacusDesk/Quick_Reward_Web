import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthComponentGuard } from 'src/app/auth-component.guard';
import { SubcategoryComponent } from '../subcategory.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatIconModule, MatDialogModule } from '@angular/material';
import { RouterModule } from '@angular/router';
import { AutocompleteLibModule } from 'angular-ng-autocomplete';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import { MaterialModule } from 'src/app/material';
import { AppUtilityModule } from 'src/app/app-utility.module';

const subCategoryRoutes = [
  { path: "", component: SubcategoryComponent,canActivate:[AuthComponentGuard], data:{ expectedRole: ['1']}},
]

@NgModule({
  declarations: [SubcategoryComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(subCategoryRoutes),
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
export class SubcategoryModule {constructor(){
}}

