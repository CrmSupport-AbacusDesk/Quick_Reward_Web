import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { AuthComponentGuard } from 'src/app/auth-component.guard';
import { MatDialogModule, MatIconModule } from '@angular/material';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from 'src/app/material';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import { AppUtilityModule } from 'src/app/app-utility.module';
import { AutocompleteLibModule } from 'angular-ng-autocomplete';
import { SiteOrderListComponent } from 'src/app/site-order-list/site-order-list.component';
import { SiteOrderAddComponent } from 'src/app/site-order-add/site-order-add.component';
import { OrderDetailComponent } from 'src/app/order/order-detail/order-detail.component';
import { AddItemComponent } from 'src/app/add-item/add-item.component';


const siteOrderRoutes: Routes = [
  { path: "", component: SiteOrderListComponent, canActivate: [AuthComponentGuard], data: { expectedRole: ['1'] } },
  { path: "site-order-add", component: SiteOrderAddComponent, canActivate: [AuthComponentGuard], data: { expectedRole: ['1'] } },
  { path: "site-order-detail/:id", component: SiteOrderAddComponent, canActivate: [AuthComponentGuard], data: { expectedRole: ['1'] } },
  {
    path: "order-detail/:id", children: [
      { path: '', component: OrderDetailComponent, canActivate: [AuthComponentGuard], data: { expectedRole: ['1', '2'] } },
      { path: "site-order-add/:id/:type", component: SiteOrderAddComponent, canActivate: [AuthComponentGuard], data: { expectedRole: ['1'] } },
      { path: "add-item/:type/:id", component: AddItemComponent, canActivate: [AuthComponentGuard], data: { expectedRole: ['1'] } },

    ]
  },

]
@NgModule({
  declarations: [
    SiteOrderAddComponent,

  ],
  imports: [
    CommonModule,
    RouterModule.forChild(siteOrderRoutes),
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

  ]
})
export class SiteOrderModule { }
