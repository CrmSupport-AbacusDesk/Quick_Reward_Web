import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatIconModule, MatDialogModule } from '@angular/material';
import { RouterModule } from '@angular/router';
import { AutocompleteLibModule } from 'angular-ng-autocomplete';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import { AuthComponentGuard } from 'src/app/auth-component.guard';
import { MaterialModule } from 'src/app/material';
import { PdfCatalogueAddComponent } from 'src/app/pdf-catalogue-add/pdf-catalogue-add.component';
import { PdfCatalougeComponent } from '../pdf-catalouge/pdf-catalouge.component';
import { AppUtilityModule } from 'src/app/app-utility.module';
const catalogueRoutes = [
  {
    path: "", children: [
      { path: "", component: PdfCatalougeComponent, canActivate: [AuthComponentGuard], data: { expectedRole: ['1'] } },
      { path: 'pdf-catalogue-add', component: PdfCatalogueAddComponent, canActivate: [AuthComponentGuard], data: { expectedRole: ['1'] } },
    ]
  },
]

@NgModule({
  declarations: [
    PdfCatalougeComponent,
    PdfCatalogueAddComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(catalogueRoutes),
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
export class PdfCatalogueModule {
    constructor() {
    }
}