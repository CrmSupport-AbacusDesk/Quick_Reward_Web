
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthComponentGuard } from 'src/app/auth-component.guard';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatIconModule, MatDialogModule } from '@angular/material';
import { RouterModule } from '@angular/router';
import { AutocompleteLibModule } from 'angular-ng-autocomplete';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import { MaterialModule } from 'src/app/material';
import { AppUtilityModule } from 'src/app/app-utility.module';
import { SchemeListComponent } from '../scheme-list/scheme-list.component';
import { SchemeAddComponent } from '../scheme-add/scheme-add.component';
import { SchemeDetailComponent } from '../scheme-detail/scheme-detail.component';
import { SchemeSubDetailComponent } from '../scheme-sub-detail/scheme-sub-detail.component';
import { NgxEditorModule } from 'ngx-editor';
import { GiftAddPageComponent } from '../gift-add-page/gift-add-page.component';
import { SchemeSubAddComponent } from '../scheme-sub-add/scheme-sub-add.component';
import { SchemeSubListComponent } from '../scheme-sub-list/scheme-sub-list.component';
import { SubSchemeDetailComponent } from '../sub-scheme-detail/sub-scheme-detail.component';
import { SubSchemeSubDetailComponent } from '../sub-scheme-sub-detail/sub-scheme-sub-detail.component';
import { SchemeResultComponent } from '../scheme-result/scheme-result.component';

const schemeRoutes = [
  { path: "", component: SchemeListComponent, canActivate: [AuthComponentGuard], data: { expectedRole: ['1'] } },
  { path: "scheme-add", component: SchemeAddComponent, canActivate: [AuthComponentGuard], data: { expectedRole: ['1'] } },
  { path: 'edit/:id', component: SchemeAddComponent, canActivate: [AuthComponentGuard], data: { expectedRole: ['1'] } },
  {
    path: 'scheme-detail/:id', children: [
      { path: '', component: SchemeDetailComponent, canActivate: [AuthComponentGuard], data: { expectedRole: ['1'] } },
      { path: 'result/:id', component: SchemeResultComponent, canActivate: [AuthComponentGuard], data: { expectedRole: ['1'] } },
      { path: 'edit/:id/:edit_type', component: SchemeAddComponent, canActivate: [AuthComponentGuard], data: { expectedRole: ['1'] } },
      { path: 'scheme-sub-detail/:schemeDetailsId/:slabId/:slab_type', component: SchemeSubDetailComponent, canActivate: [AuthComponentGuard], data: { expectedRole: ['1'] } },
      { path: 'scheme-sub-details/:schemeDetailsId/:slab_type', component: SchemeSubDetailComponent, canActivate: [AuthComponentGuard], data: { expectedRole: ['1'] } },
    ]
  },
  { path: "gift-add-page", component: GiftAddPageComponent, canActivate: [AuthComponentGuard], data: { expectedRole: ['1'] } },
  {
    path:'gift-add-page/:id',children:[
  { path: "", component: GiftAddPageComponent, canActivate: [AuthComponentGuard], data: { expectedRole: ['1'] } },]
  }
]

@NgModule({
  declarations: [SchemeListComponent, SchemeAddComponent,SchemeResultComponent,SchemeDetailComponent, SchemeSubDetailComponent,GiftAddPageComponent,SchemeSubAddComponent,SchemeSubListComponent,SubSchemeDetailComponent,SubSchemeSubDetailComponent ],
  imports: [
    CommonModule,
    RouterModule.forChild(schemeRoutes),
    FormsModule,
    ReactiveFormsModule,
    NgMultiSelectDropDownModule,
    MaterialModule,
    AutocompleteLibModule,
    MatIconModule,
    MatDialogModule,
    NgxMatSelectSearchModule,
    AppUtilityModule,
    NgxEditorModule
  ],
  entryComponents: [
  ]
})
export class SchemeModule {
  constructor() {
  }
}


