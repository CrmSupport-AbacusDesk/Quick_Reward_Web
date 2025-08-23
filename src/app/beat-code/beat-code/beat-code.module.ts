
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatIconModule, MatDialogModule } from '@angular/material';
import { RouterModule } from '@angular/router';
import { AutocompleteLibModule } from 'angular-ng-autocomplete';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import { MaterialModule } from 'src/app/material';
import { AuthComponentGuard } from 'src/app/auth-component.guard';
import { BeatCodeComponent } from './beat-code.component';
import { AppUtilityModule } from 'src/app/app-utility.module';
import { BeatCodeMapAddComponent } from '../beat-code-map-add/beat-code-map-add.component';
import { BeatCodeAddComponent } from '../beat-code-add/beat-code-add.component';

const beatMasterRoutes = [
  {
    path: "", children: [
      { path: "", component: BeatCodeComponent, canActivate: [AuthComponentGuard], data: { expectedRole: ['1'] } },
      { path: 'add-beat-code', component: BeatCodeAddComponent, canActivate: [AuthComponentGuard], data: { expectedRole: ['1'] } },
      { path: 'add-map-beat-code', component: BeatCodeMapAddComponent, canActivate: [AuthComponentGuard], data: { expectedRole: ['1'] } },
    ]
  }
]
@NgModule({
  declarations: [BeatCodeComponent, BeatCodeMapAddComponent,BeatCodeAddComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(beatMasterRoutes),
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
export class BeatCodeModule { }

