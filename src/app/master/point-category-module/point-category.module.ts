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
import { PointCategoryAddComponent } from '../point-category-add/point-category-add.component';
import { PointCategoryListComponent } from '../point-category-list/point-category-list.component';
const pointCategoryRoutes = [
  {
    path: "", children: [
      { path: "", component: PointCategoryListComponent, canActivate: [AuthComponentGuard], data: { expectedRole: ['1'] } },
      { path: "point-add", component: PointCategoryAddComponent, canActivate: [AuthComponentGuard], data: { expectedRole: ['1'] } },
      { path: "point-add/:id", component: PointCategoryAddComponent, canActivate: [AuthComponentGuard], data: { expectedRole: ['1'] } },
    ]
  }
]
@NgModule({
  declarations: [PointCategoryListComponent, PointCategoryAddComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(pointCategoryRoutes),
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
export class PointCategoryModule {
    constructor() {
    }
}
