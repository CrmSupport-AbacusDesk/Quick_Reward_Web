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
import { TutorialVideoListComponent } from '../tutorial-video/tutorial-video-list.component';
import { NgxEditorModule } from 'ngx-editor';


const bannerRoute = [
    { path: "", component: TutorialVideoListComponent, canActivate: [AuthComponentGuard], data: { expectedRole: ['1'] } },

]

@NgModule({
    declarations: [
        TutorialVideoListComponent,

    ],
    imports: [
        CommonModule,
        RouterModule.forChild(bannerRoute),
        FormsModule,
        ReactiveFormsModule,
        NgMultiSelectDropDownModule,
        MaterialModule,
        AutocompleteLibModule,
        MatIconModule,
        MatDialogModule,
        NgxMatSelectSearchModule,
        AppUtilityModule,
        NgxEditorModule,

    ]
})
export class TutorialVideoModule {
    constructor() {
    }
}
