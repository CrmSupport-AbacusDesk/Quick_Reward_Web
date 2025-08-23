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
import { SurveyListComponent } from '../survey-list/survey-list.component';
import { SurveyAddComponent } from '../survey-add/survey-add.component';
import { SurveyDetailComponent } from '../survey-detail/survey-detail.component';
import { EditSurveyComponent } from 'src/app/edit-survey/edit-survey.component';
import { SurveyInformationModalComponent } from '../survey-information-modal/survey-information-modal.component';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { SurveyResultComponent } from '../survey-result/survey-result.component';

const surveyRoutes = [
  { path: "", children:[
    { path: "", component: SurveyListComponent,canActivate:[AuthComponentGuard], data:{ expectedRole: ['1']}},
    { path: "survey-detail/:id", component: SurveyDetailComponent,canActivate:[AuthComponentGuard], data:{ expectedRole: ['1']}},
    { path: "survey-add", component: SurveyAddComponent,canActivate:[AuthComponentGuard], data:{ expectedRole: ['1']}},
    { path: "edit-survey", component: EditSurveyComponent,canActivate:[AuthComponentGuard], data:{ expectedRole: ['1']}},
    { path: "survey-detail/:id/survey-result", component: SurveyResultComponent,canActivate:[AuthComponentGuard], data:{ expectedRole: ['1']}},
  ]},

]
@NgModule({
  declarations: [SurveyListComponent, SurveyDetailComponent, SurveyAddComponent, SurveyInformationModalComponent,EditSurveyComponent,SurveyResultComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(surveyRoutes),
    FormsModule,
    ReactiveFormsModule, 
    NgMultiSelectDropDownModule,
    MaterialModule,
    AutocompleteLibModule,
    MatIconModule,
    MatDialogModule,
    NgxMatSelectSearchModule,
    AppUtilityModule,
    InfiniteScrollModule
  ],
  entryComponents:[SurveyInformationModalComponent]
})
export class SurveyModule { }
