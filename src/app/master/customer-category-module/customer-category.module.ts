import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatIconModule, MatDialogModule } from '@angular/material';
import { RouterModule } from '@angular/router';
import { AutocompleteLibModule } from 'angular-ng-autocomplete';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import { AppUtilityModule } from 'src/app/app-utility.module';
import { AuthComponentGuard } from 'src/app/auth-component.guard';
import { MaterialModule } from 'src/app/material';
import { CustomerCategoryListComponent } from '../customer-category-list/customer-category-list.component';
import { CustomerCategoryComponent } from '../customer-category/customer-category.component';


const customerCategoryRoutes = [
  { path: "", children:[
    {path:"", component: CustomerCategoryListComponent,canActivate:[AuthComponentGuard], data:{ expectedRole: ['1']}},
    { path: "add-customer-category", component: CustomerCategoryComponent,canActivate:[AuthComponentGuard], data:{ expectedRole: ['1']}},
    { path: "add-customer-category/:id", component: CustomerCategoryComponent,canActivate:[AuthComponentGuard], data:{ expectedRole: ['1']}},
  ]},
]

@NgModule({
  declarations: [
    CustomerCategoryListComponent,
    CustomerCategoryComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(customerCategoryRoutes),
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
export class CustomerCategoryModule { }
