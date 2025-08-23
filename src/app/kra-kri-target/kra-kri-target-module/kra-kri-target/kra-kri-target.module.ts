import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { KraKriTargetAchievmentComponent } from '../../kra-kri-target-achievment/kra-kri-target-achievment.component';
import { AuthComponentGuard } from 'src/app/auth-component.guard';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { MaterialModule } from 'src/app/material';
import { AutocompleteLibModule } from 'angular-ng-autocomplete';
import { MatDialogModule, MatIconModule } from '@angular/material';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import { AppUtilityModule } from 'src/app/app-utility.module';

const targetRoutes = [
  { path: "", component: KraKriTargetAchievmentComponent, canActivate: [AuthComponentGuard], data: { expectedRole: ['1'] } },
]

@NgModule({
  declarations: [
    KraKriTargetAchievmentComponent,
  ],
  imports: [
    FormsModule,
    CommonModule,
    RouterModule.forChild(targetRoutes),
    ReactiveFormsModule,
    NgMultiSelectDropDownModule,
    MaterialModule,
    AutocompleteLibModule,
    MatIconModule,
    MatDialogModule,
    NgxMatSelectSearchModule,
    AppUtilityModule
  ],
})
export class KraKriTargetModule { }
 