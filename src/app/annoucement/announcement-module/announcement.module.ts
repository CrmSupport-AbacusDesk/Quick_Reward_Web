import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatIconModule, MatDialogModule } from '@angular/material';
import { RouterModule } from '@angular/router';
import { AutocompleteLibModule } from 'angular-ng-autocomplete';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import { AppUtilityModule } from 'src/app/app-utility.module';
import { MaterialModule } from 'src/app/material';
import { AuthComponentGuard } from 'src/app/auth-component.guard';
import { AddAnnoucementComponent } from '../add-annoucement/add-annoucement.component';
import { AnnoucementDetailComponent } from '../annoucement-detail/annoucement-detail.component';
import { AnnoucementListComponent } from '../annoucement-list/annoucement-list.component';
const announcementRoutes = [
  { path: "", children:[
    { path: "", component: AnnoucementListComponent,canActivate:[AuthComponentGuard], data:{ expectedRole: ['1']}},
    { path: "add-announcement", component: AddAnnoucementComponent,canActivate:[AuthComponentGuard], data:{ expectedRole: ['1']}},
    { path: "detail-announcement/:id", component: AnnoucementDetailComponent,canActivate:[AuthComponentGuard], data:{ expectedRole: ['1']}},
  ]},
]
@NgModule({
  declarations: [
    AnnoucementListComponent,
    AddAnnoucementComponent,
    AnnoucementDetailComponent,
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(announcementRoutes),
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
export class AnnouncementModule { }
