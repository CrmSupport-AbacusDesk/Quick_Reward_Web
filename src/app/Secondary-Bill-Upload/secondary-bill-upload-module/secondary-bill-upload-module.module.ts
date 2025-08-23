import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SecondaryBillUploadListComponent } from '../secondary-bill-upload-list/secondary-bill-upload-list.component';
import { AuthComponentGuard } from 'src/app/auth-component.guard';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { MaterialModule } from 'src/app/material';
import { AutocompleteLibModule } from 'angular-ng-autocomplete';
import { MatDialogModule, MatIconModule } from '@angular/material';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import { AppUtilityModule } from 'src/app/app-utility.module';
import { NgxQRCodeModule } from '@techiediaries/ngx-qrcode';
import { NgxBarcodeModule } from 'ngx-barcode';
import { SecondaryBillUploadDetailComponent } from '../secondary-bill-upload-detail/secondary-bill-upload-detail.component';
import { SecondaryBillUploadAddComponent } from '../secondary-bill-upload-add/secondary-bill-upload-add.component';


const SecondaryBillUploadRoutes = [
  {
    path: "", children: [
      { path: "", component: SecondaryBillUploadListComponent, canActivate: [AuthComponentGuard], data: { expectedRole: ['1'] } },
      { path: "secondary-bill-upload-list", component: SecondaryBillUploadListComponent, canActivate: [AuthComponentGuard], data: { expectedRole: ['1'] } },
      { path: "secondary-bill-upload-detail/:id", component: SecondaryBillUploadDetailComponent, canActivate: [AuthComponentGuard], data: { expectedRole: ['1'] } },
      {path: "add-bill", component: SecondaryBillUploadAddComponent, canActivate: [AuthComponentGuard], data: { expectedRole: ['1'] }},
  
    ]
  },
]

@NgModule({
  declarations: [
    // SecondaryBillUploadListComponent,
    // SecondaryBillUploadDetailComponent,
    SecondaryBillUploadAddComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(SecondaryBillUploadRoutes),
    FormsModule,
    ReactiveFormsModule,
    NgMultiSelectDropDownModule,
    MaterialModule,
    AutocompleteLibModule,
    MatIconModule,
    MatDialogModule,
    NgxMatSelectSearchModule,
    AppUtilityModule,
    NgxQRCodeModule,
    NgxBarcodeModule,
  ]
})
export class SecondaryBillUploadModuleModule { }
