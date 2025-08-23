import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ComplaintListComponent } from '../complaint-list/complaint-list.component';
import { AuthComponentGuard } from 'src/app/auth-component.guard';

// import { ComplaintAddComponent } from '../complaint-add/complaint-add.component';

import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { MaterialModule } from 'src/app/material';
import { AutocompleteLibModule } from 'angular-ng-autocomplete';
import { MatDialogModule, MatIconModule } from '@angular/material';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import { AppUtilityModule } from 'src/app/app-utility.module';
import { ComplaintDetailComponent } from '../complaint-detail/complaint-detail.component';
import { InstallationAddComponent } from 'src/app/installation/installation-add/installation-add.component';





const serviceRoutes = [
  { path: "", children:[
    { path: "", component: ComplaintListComponent,canActivate:[AuthComponentGuard], data:{ expectedRole: ['1']}},
    { path: 'add-complaint/:type', component:InstallationAddComponent,canActivate:[AuthComponentGuard], data:{ expectedRole: ['1']}},
    { path: "complaint-detail/:id", children:[
      {path:"", component:ComplaintDetailComponent,canActivate:[AuthComponentGuard], data:{ expectedRole: ['1']}},
      {path:'add-complaint/:type/:id', component:InstallationAddComponent,canActivate:[AuthComponentGuard], data:{ expectedRole: ['1']}}
    ] }
  ]},

]

@NgModule({
  declarations: [ComplaintListComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(serviceRoutes),
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
export class ServiceModuleModule { }
