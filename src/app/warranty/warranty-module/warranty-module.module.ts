import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WarrantyListComponent } from '../warranty-list/warranty-list.component';
import { WarrantyAddComponent } from '../warranty-add/warranty-add.component';
import { WarrantyDetailComponent } from '../warranty-detail/warranty-detail.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { MaterialModule } from 'src/app/material';
import { AutocompleteLibModule } from 'angular-ng-autocomplete';
import { MatDialogModule, MatIconModule } from '@angular/material';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import { AppUtilityModule } from 'src/app/app-utility.module';
import { RouterModule } from '@angular/router';
import { AuthComponentGuard } from 'src/app/auth-component.guard';

const warrantyRoutes = [
  { path: "", children:[
    { path: "", component: WarrantyListComponent,canActivate:[AuthComponentGuard], data:{ expectedRole: ['1']}},
    { path: 'add-warranty', component: WarrantyAddComponent,canActivate:[AuthComponentGuard], data:{ expectedRole: ['1']}},
    { path: "warranty-detail/:id", children:[
      {path:"", component:WarrantyDetailComponent,canActivate:[AuthComponentGuard], data:{ expectedRole: ['1']}},
      {path:'add-warranty/:id', component: WarrantyAddComponent,canActivate:[AuthComponentGuard], data:{ expectedRole: ['1']}}
    ] }
  ]},

]

@NgModule({
  declarations: [WarrantyListComponent,WarrantyAddComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(warrantyRoutes),
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
export class WarrantyModuleModule { }
