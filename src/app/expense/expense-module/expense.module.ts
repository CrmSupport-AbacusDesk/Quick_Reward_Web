import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatIconModule, MatDialogModule } from '@angular/material';
import { RouterModule } from '@angular/router';
import { AutocompleteLibModule } from 'angular-ng-autocomplete';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import { MaterialModule } from 'src/app/material';
import { AuthComponentGuard } from 'src/app/auth-component.guard';
import { DetailExpenseComponent } from '../detail-expense/detail-expense.component';
import { ListExpenseComponent } from '../list-expense/list-expense.component';
import { AppUtilityModule } from 'src/app/app-utility.module';
import { ExpenseModalComponent } from '../expense-modal/expense-modal.component';
import { ExpesneEditComponent } from '../expesne-edit/expesne-edit.component';
import { MatTimepickerModule } from 'mat-timepicker';
const expenseRoutes = [
  {
    path: "", children: [
      { path: "", component: ListExpenseComponent, canActivate: [AuthComponentGuard], data: { expectedRole: ['1'] } },
      { path: "expense-detail/:id", component: DetailExpenseComponent, canActivate: [AuthComponentGuard], data: { expectedRole: ['1'] } },
    ]
  },
]
@NgModule({
  declarations: [

    DetailExpenseComponent,
    // ListExpenseComponent,
    ExpenseModalComponent,
    ExpesneEditComponent,
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(expenseRoutes),
    FormsModule,
    ReactiveFormsModule,
    NgMultiSelectDropDownModule,
    MaterialModule,
    AutocompleteLibModule,
    MatIconModule,
    MatDialogModule,
    NgxMatSelectSearchModule,
    AppUtilityModule,
    MatTimepickerModule,
  ],
  entryComponents: [ExpenseModalComponent, ExpesneEditComponent,]
})
export class ExpenseModule { }
