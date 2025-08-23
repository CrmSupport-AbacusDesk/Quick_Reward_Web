import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BillingComponent } from '../billing.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatIconModule, MatDialogModule } from '@angular/material';
import { RouterModule } from '@angular/router';
import { AutocompleteLibModule } from 'angular-ng-autocomplete';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import { AppUtilityModule } from 'src/app/app-utility.module';
import { AuthComponentGuard } from 'src/app/auth-component.guard';
import { BillingDetailComponent } from 'src/app/billing-detail/billing-detail.component';
import { MaterialModule } from 'src/app/material';

const attendenceRoutes = [
  { path: "", children:[
    {path:'',component: BillingComponent,canActivate:[AuthComponentGuard], data:{expectedRole:['1']}},
    {path:'billing-details/:id',component: BillingDetailComponent,canActivate:[AuthComponentGuard], data:{expectedRole:['1']}},
  ]},
  
]

@NgModule({
  declarations: [BillingComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(attendenceRoutes),
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
export class BillingModule { }
