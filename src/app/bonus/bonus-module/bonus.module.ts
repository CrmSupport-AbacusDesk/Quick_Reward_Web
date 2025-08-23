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
import { BonusAddComponent } from '../bonus-add/bonus-add.component';
import { BonusDetailsComponent } from '../bonus-details/bonus-details.component';
import { BonusListComponent } from '../bonus-list/bonus-list.component';
import { BonusUpdateComponent } from '../bonus-update/bonus-update.component';
const bonusRoutes = [
  {
    path: "", children: [
      { path: '', component: BonusListComponent, canActivate: [AuthComponentGuard], data: { expectedRole: ['1'] } },
      { path: "bonus-add", component: BonusAddComponent, canActivate: [AuthComponentGuard], data: { expectedRole: ['1'] } },
      { path: "bonus-edit/:id", component: BonusAddComponent, canActivate: [AuthComponentGuard], data: { expectedRole: ['1'] } },
      { path: "bonus-detail/:id", component: BonusDetailsComponent, canActivate: [AuthComponentGuard], data: { expectedRole: ['1'] } },
    ]
  },
]
@NgModule({
  declarations: [BonusListComponent, BonusAddComponent, BonusDetailsComponent, BonusUpdateComponent,],
  imports: [
    CommonModule,
    RouterModule.forChild(bonusRoutes),
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
    BonusUpdateComponent
  ]
})
export class BonusModule {
    constructor() {
    }
}
