
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
import { SecondarySchemeListComponent } from '../secondary-scheme-list/secondary-scheme-list.component';
import { SecondarySchemeAddComponent } from '../secondary-scheme-add/secondary-scheme-add.component';
import { SecondarySchemeDetailComponent } from '../secondary-scheme-detail/secondary-scheme-detail.component';
import { SecondarySchemeSubDetailComponent } from '../secondary-scheme-sub-detail/secondary-scheme-sub-detail.component';
import { NgxEditorModule } from 'ngx-editor';
import { SecondaryGiftAddPageComponent } from '../secondary-gift-add-page/secondary-gift-add-page.component';
// import { SchemeSubAddComponent } from '../scheme-sub-add/scheme-sub-add.component';
// import { SchemeSubListComponent } from '../scheme-sub-list/scheme-sub-list.component';
// import { SubSchemeDetailComponent } from '../sub-scheme-detail/sub-scheme-detail.component';
// import { SubSchemeSubDetailComponent } from '../sub-scheme-sub-detail/sub-scheme-sub-detail.component';

const schemeRoutes = [
  { path: "", component: SecondarySchemeListComponent, canActivate: [AuthComponentGuard], data: { expectedRole: ['1'] } },
  { path: "scheme-add", component: SecondarySchemeAddComponent, canActivate: [AuthComponentGuard], data: { expectedRole: ['1'] } },
  {
    path: 'scheme-detail/:id', children: [
      { path: '', component: SecondarySchemeDetailComponent, canActivate: [AuthComponentGuard], data: { expectedRole: ['1'] } },
      { path: 'scheme-add/:id', component: SecondarySchemeAddComponent, canActivate: [AuthComponentGuard], data: { expectedRole: ['1'] } },
      // { path: 'scheme-sub-add/:id', component: SchemeSubAddComponent, canActivate: [AuthComponentGuard], data: { expectedRole: ['1'] } },
      // { path: 'scheme-sub-list/:id', children: [
      //   {path: '', component: SchemeSubListComponent, canActivate: [AuthComponentGuard], data: { expectedRole: ['1'] } },
      //   {path: 'sub-scheme-detail/:subSchemeId', component: SubSchemeDetailComponent, canActivate: [AuthComponentGuard], data: { expectedRole: ['1'] }},
      //   {path: 'sub-scheme-detail/:subSchemeId/sub-scheme-sub-detail/:slabId/:slab_type', component: SubSchemeSubDetailComponent, canActivate: [AuthComponentGuard], data: { expectedRole: ['1'] } },
      //   ]
      // },  
      { path: 'scheme-sub-detail/:schemeDetailsId/:slabId/:slab_type', component: SecondarySchemeSubDetailComponent, canActivate: [AuthComponentGuard], data: { expectedRole: ['1'] } },
      { path: 'scheme-sub-details/:schemeDetailsId/:slab_type', component: SecondarySchemeSubDetailComponent, canActivate: [AuthComponentGuard], data: { expectedRole: ['1'] } },
    ]
  },
  { path: "gift-add-page", component: SecondaryGiftAddPageComponent, canActivate: [AuthComponentGuard], data: { expectedRole: ['1'] } },
  {
    path:'gift-add-page/:id',children:[
  { path: "", component: SecondaryGiftAddPageComponent, canActivate: [AuthComponentGuard], data: { expectedRole: ['1'] } },

    ]
  }
]

@NgModule({
  declarations: [SecondarySchemeListComponent, SecondarySchemeAddComponent,SecondarySchemeDetailComponent, SecondarySchemeSubDetailComponent,SecondaryGiftAddPageComponent ],
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
export class SecondarySchemeModule {
  constructor() {
  }
}


