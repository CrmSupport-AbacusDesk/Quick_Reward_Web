import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SiteListComponent } from '../site-list.component';
import { RouterModule, Routes } from '@angular/router';
import { AuthComponentGuard } from 'src/app/auth-component.guard';
import { SiteAddComponent } from '../site-add/site-add.component';
import { MatDialogModule, MatIconModule } from '@angular/material';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from 'src/app/material';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import { AppUtilityModule } from 'src/app/app-utility.module';
import { AutocompleteLibModule } from 'angular-ng-autocomplete';
import { SiteDetailComponent } from '../site-detail/site-detail.component';
import { SiteAddFollowupComponent } from '../site-add-followup/site-add-followup.component';
import { OrderDetailComponent } from 'src/app/order/order-detail/order-detail.component';
import { AddItemComponent } from 'src/app/add-item/add-item.component';


const siteRoutes: Routes = [
  { path: "", component: SiteListComponent, canActivate: [AuthComponentGuard], data: { expectedRole: ['1'] } },
  { path: "add-site", component: SiteAddComponent, canActivate: [AuthComponentGuard], data: { expectedRole: ['1'] } },
  // { path: "site-detail/:id", component: SiteDetailComponent, canActivate: [AuthComponentGuard], data: { expectedRole: ['1'] } },
  {
    path: "site-detail/:id", children: [
      { path: "", component: SiteDetailComponent, canActivate: [AuthComponentGuard], data: { expectedRole: ['1'] } },
      { path: "add-site", component: SiteAddComponent, canActivate: [AuthComponentGuard], data: { expectedRole: ['1'] } },
      { path: 'order-detail/:id', component: OrderDetailComponent, canActivate: [AuthComponentGuard], data: { expectedRole: ['1', '2'] } },
      { path: "add-item/:type/:id", component: AddItemComponent, canActivate: [AuthComponentGuard], data: { expectedRole: ['1'] } },

      // { path: "site-order-add/:id/:type", component: SiteOrderAddComponen, canActivate: [AuthComponentGuard], data: { expectedRole: ['1'] } },
    ]
  },

]
@NgModule({
  declarations: [
    SiteListComponent,
    SiteAddFollowupComponent

  ],
  imports: [
    CommonModule,
    RouterModule.forChild(siteRoutes),
    FormsModule,
    MatIconModule,
    MatDialogModule,
    MaterialModule,
    NgMultiSelectDropDownModule,
    NgxMatSelectSearchModule,
    AppUtilityModule,
    ReactiveFormsModule,
    AutocompleteLibModule,
  ],
  entryComponents: [
    // EditleadComponent,
    // LeadAddFollowupModelComponent,
    //  ChangeEnquiryStatusComponent,
    SiteAddFollowupComponent,
  ]
})
export class SiteModule { }
