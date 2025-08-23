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
import { InfluencerUserAddComponent } from '../influencer-user-add/influencer-user-add.component';
import { InfluencerUserListComponent } from '../influencer-user-list/influencer-user-list.component';
const influencerUserRoutes = [
  {path:"", children:[
    { path: "", component: InfluencerUserListComponent,canActivate:[AuthComponentGuard], data:{ expectedRole: ['1']}},
    { path: "influencer-user-add", component: InfluencerUserAddComponent,canActivate:[AuthComponentGuard], data:{ expectedRole: ['1']}},
    { path: "influencer-user-add/:network/:id/:type", component: InfluencerUserAddComponent,canActivate:[AuthComponentGuard], data:{ expectedRole: ['1']}},
  ]}
]
@NgModule({
  declarations: [InfluencerUserListComponent, InfluencerUserAddComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(influencerUserRoutes),
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
export class InfluencerUserModule { }
