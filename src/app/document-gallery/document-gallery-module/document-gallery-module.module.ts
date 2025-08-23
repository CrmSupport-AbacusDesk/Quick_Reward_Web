import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthComponentGuard } from 'src/app/auth-component.guard';
import { DocumentGalleryComponent } from '../document-gallery/document-gallery.component';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { MaterialModule } from 'src/app/material';
import { MatDialogModule } from '@angular/material';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import { AppUtilityModule } from 'src/app/app-utility.module';

const docRoutes = [
  {
    path: "", children: [
      { path: "", component: DocumentGalleryComponent, canActivate: [AuthComponentGuard], data: { expectedRole: ['1'] } },

    ]
  }
]
@NgModule({
  declarations: [DocumentGalleryComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(docRoutes),
    FormsModule,
    ReactiveFormsModule,
    NgMultiSelectDropDownModule,
    MaterialModule,
    MatDialogModule,
    NgxMatSelectSearchModule,
    // AppUtilityModule,
  ],
  entryComponents: [
  ]
})
export class DocumentGalleryModuleModule { }
