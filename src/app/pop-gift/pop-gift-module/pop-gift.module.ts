import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatIconModule, MatDialogModule } from '@angular/material';
import { RouterModule } from '@angular/router';
import { AutocompleteLibModule } from 'angular-ng-autocomplete';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import { AppUtilityModule } from 'src/app/app-utility.module';
import { AuthComponentGuard } from 'src/app/auth-component.guard';
import { MaterialModule } from 'src/app/material';
import { PopGiftListComponent } from '../pop-gift-list/pop-gift-list.component';
import { PopGiftAddComponent } from '../pop-gift-add/pop-gift-add.component';
import { PopGiftDetailComponent } from '../pop-gift-detail/pop-gift-detail.component';
import { PopGiftIssueModalComponent } from '../pop-gift-issue-modal/pop-gift-issue-modal.component';
import { AddGiftComponent } from 'src/app/pop_and_gift/add-gift/add-gift.component';
const supportRoutes = [
  {
    path: "", children: [
      { path: "", component: PopGiftListComponent, canActivate: [AuthComponentGuard], data: { expectedRole: ['1'] } },
      { path: "pop-gift-add/:id", component: PopGiftAddComponent, canActivate: [AuthComponentGuard], data: { expectedRole: ['1'] } },
      { path: "pop-gift-detail/:id", component: PopGiftDetailComponent, canActivate: [AuthComponentGuard], data: { expectedRole: ['1'] } },
    ]
  },
]
@NgModule({
  declarations: [PopGiftListComponent, PopGiftAddComponent, PopGiftDetailComponent,
    PopGiftIssueModalComponent,
    AddGiftComponent,
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(supportRoutes),
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
  entryComponents: [PopGiftIssueModalComponent]
})
export class PopGiftModule {
    constructor() {
    }
}
