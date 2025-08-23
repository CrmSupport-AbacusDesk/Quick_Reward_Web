import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthComponentGuard } from 'src/app/auth-component.guard';
import { SpareListComponent } from '../spare-list/spare-list.component';
import { AddSpareComponent } from '../add-spare/add-spare.component';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { MaterialModule } from 'src/app/material';
import { AutocompleteLibModule } from 'angular-ng-autocomplete';
import { MatDialogModule, MatIconModule } from '@angular/material';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import { AppUtilityModule } from 'src/app/app-utility.module';
import { AssignQtyComponent } from '../assign-qty/assign-qty.component';

const spareRoutes = [
  { path: "", children:[
    { path: "", component: SpareListComponent,canActivate:[AuthComponentGuard], data:{ expectedRole: ['1']}},
  ]},

]

@NgModule({
  declarations: [SpareListComponent,],
  imports: [
    CommonModule,
    RouterModule.forChild(spareRoutes),
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
export class SapreModuleModule { }
