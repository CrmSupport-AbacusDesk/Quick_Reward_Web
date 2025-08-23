import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthComponentGuard } from 'src/app/auth-component.guard';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { MaterialModule } from 'src/app/material';
import { AutocompleteLibModule } from 'angular-ng-autocomplete';
import { MatDialogModule, MatIconModule } from '@angular/material';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import { AppUtilityModule } from 'src/app/app-utility.module';
import { ClaimDispatchDetailComponent } from '../claim-dispatch-detail/claim-dispatch-detail.component';
import { ClaimDispatchListComponent } from '../claim-dispatch-list/claim-dispatch-list.component';

const dispatchRoutes = [
  { path: "", children:[
    { path: "", component: ClaimDispatchListComponent,canActivate:[AuthComponentGuard], data:{ expectedRole: ['1']}},
    { path: "complaint-detail", component: ClaimDispatchDetailComponent,canActivate:[AuthComponentGuard], data:{ expectedRole: ['1']}},
    // { path: 'add-complaint', component: InspectionAddComponent,canActivate:[AuthComponentGuard], data:{ expectedRole: ['1']}},
    // { path: "complaint-detail/:id", children:[
    //   {path:"", component:InspectionDetailComponent,canActivate:[AuthComponentGuard], data:{ expectedRole: ['1']}},
    // ] }
  ]},
]

@NgModule({
  declarations: [ClaimDispatchDetailComponent,ClaimDispatchListComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(dispatchRoutes),
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
export class DispatchModuleModule { }
