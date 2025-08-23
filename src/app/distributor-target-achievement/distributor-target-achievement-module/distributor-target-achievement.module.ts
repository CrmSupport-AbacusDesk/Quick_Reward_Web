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
// import { DistributorTargetAchievementComponent } from '../../distributor-target-achievement.component';
import { DistributorTargetAchievementComponent } from '../distributor-target-achievement.component';

const targetRoutes = [
  { path: "", component: DistributorTargetAchievementComponent, canActivate: [AuthComponentGuard], data: { expectedRole: ['1'] } },
]

@NgModule({
  declarations: [
    DistributorTargetAchievementComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(targetRoutes),
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
export class DistributorTargetAchievementModule { }
