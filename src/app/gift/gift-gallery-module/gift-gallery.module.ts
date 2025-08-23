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
import { GiftAddComponent } from '../gift-add/gift-add.component';
import { GiftGalleryListComponent } from '../gift-gallery-list/gift-gallery-list.component';
import { NgxEditorModule } from 'ngx-editor';
const giftGalleryRoutes = [
  {
    path: "", children: [
      { path: '', component: GiftGalleryListComponent, canActivate: [AuthComponentGuard], data: { expectedRole: ['1'] } },
      { path: "gift-add", component: GiftAddComponent, canActivate: [AuthComponentGuard], data: { expectedRole: ['1'] } },
      { path: "gift-edit/:id/:type", component: GiftAddComponent, canActivate: [AuthComponentGuard], data: { expectedRole: ['1'] } },

    ]
  },

]
@NgModule({
  declarations: [GiftGalleryListComponent, GiftAddComponent,],
  imports: [
    CommonModule,
    RouterModule.forChild(giftGalleryRoutes),
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
  ]
})
export class GiftGalleryModule {
    constructor() {
    }
}
