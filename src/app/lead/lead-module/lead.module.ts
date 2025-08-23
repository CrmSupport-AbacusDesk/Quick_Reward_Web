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
import { LeadListComponent } from '../lead-list/lead-list.component';
import { AddLeadComponent } from '../add-lead/add-lead.component';
import { LeadDetailComponent } from '../lead-detail/lead-detail.component';
import { EditleadComponent } from 'src/app/editlead/editlead.component';
import { LeadAddFollowupModelComponent } from '../lead-add-followup-model/lead-add-followup-model.component';
import { ChangeEnquiryStatusComponent } from '../change-enquiry-status/change-enquiry-status.component';
const leadRoutes = [
  {
    path: "", children: [
      { path: "", component: LeadListComponent, canActivate: [AuthComponentGuard], data: { expectedRole: ['1'] } },
      { path: "add-lead/:id", component: AddLeadComponent, canActivate: [AuthComponentGuard], data: { expectedRole: ['1'] } },
      { path: "add-lead", component: AddLeadComponent, canActivate: [AuthComponentGuard], data: { expectedRole: ['1'] } },
      { path: "lead-detail/:id", component: LeadDetailComponent, canActivate: [AuthComponentGuard], data: { expectedRole: ['1'] } },


      {
        path: "lead-detail/:id", children: [
          { path: "", component: LeadDetailComponent, canActivate: [AuthComponentGuard], data: { expectedRole: ['1', '2'] } },
          { path: "edit-lead/:id", component: AddLeadComponent, canActivate: [AuthComponentGuard], data: { expectedRole: ['1'] } },
        ]
      },
    ]
  },
]
@NgModule({
  declarations: [
    LeadListComponent,
    // AddLeadComponent,
    EditleadComponent,
    LeadAddFollowupModelComponent,
    ChangeEnquiryStatusComponent,
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(leadRoutes),
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
  entryComponents: [
    EditleadComponent,
    LeadAddFollowupModelComponent,
    ChangeEnquiryStatusComponent,
  ]
})
export class LeadModule {
    constructor() {
    }
}
