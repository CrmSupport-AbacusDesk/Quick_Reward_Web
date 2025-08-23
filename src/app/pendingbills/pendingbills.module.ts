import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {PendingBillListComponent} from './pending-bill-list/pending-bill-list.component';
import { RouterModule } from '@angular/router';
import { AuthComponentGuard } from 'src/app/auth-component.guard';
import { MaterialModule } from 'src/app/material';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatIconModule, MatDialogModule } from '@angular/material';
import { AutocompleteLibModule } from 'angular-ng-autocomplete';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import { AppUtilityModule } from 'src/app/app-utility.module';

const PendingbillsRoutes = [
  {path:'',component: PendingBillListComponent,canActivate:[AuthComponentGuard], data:{expectedRole:['1']}},
] 
@NgModule({
  declarations: [PendingBillListComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(PendingbillsRoutes),
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
export class PendingbillsModule { }
