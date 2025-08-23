import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LeaveMasterListComponent } from '../../leave-master-list/leave-master-list.component';
import { AuthComponentGuard } from 'src/app/auth-component.guard';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { MaterialModule } from 'src/app/material';
import { AutocompleteLibModule } from 'angular-ng-autocomplete';
import { MatDialogModule, MatIconModule } from '@angular/material';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import { AppUtilityModule } from 'src/app/app-utility.module';
import { LeaveMasterAddComponent } from '../../leave-master-add/leave-master-add.component';

const LeaveMasterRoutes = [
  {path:"", children:[
    { path: "", component: LeaveMasterListComponent,canActivate:[AuthComponentGuard], data:{ expectedRole: ['1']}},
  // { path: "leave-Master-add", component: LeaveMasterAddComponent,canActivate:[AuthComponentGuard], data:{ expectedRole: ['1']}},
  // { path: "point-add/:id", component: PointCategoryAddComponent,canActivate:[AuthComponentGuard], data:{ expectedRole: ['1']}},
  ]}
] 

@NgModule({
  declarations: [LeaveMasterListComponent,LeaveMasterAddComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(LeaveMasterRoutes),
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
  entryComponents:[
    LeaveMasterAddComponent
  ]
})
export class LeaveMasterModule { }
