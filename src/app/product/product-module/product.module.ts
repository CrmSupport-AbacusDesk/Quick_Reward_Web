import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatIconModule, MatDialogModule } from '@angular/material';
import { RouterModule } from '@angular/router';
import { AutocompleteLibModule } from 'angular-ng-autocomplete';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import { AppUtilityModule } from 'src/app/app-utility.module';
import { AuthComponentGuard } from 'src/app/auth-component.guard';
import { MaterialModule } from 'src/app/material';
import { ProductUploadComponent } from 'src/app/product-upload/product-upload.component';
import { AddProductComponent } from '../add-product/add-product.component';
import { ChangeSchemeStatusModelComponent } from '../change-scheme-status-model/change-scheme-status-model.component';
import { ProductDetailComponent } from '../product-detail/product-detail.component';
import { ProductListComponent } from '../product-list/product-list.component';
import { ProductQrCodeModelComponent } from '../product-qr-code-model/product-qr-code-model.component';

const productroutes = [
  {
    path: "", children: [
      { path: "", component: ProductListComponent, canActivate: [AuthComponentGuard], data: { expectedRole: ['1'] } },
      { path: 'add-product', component: AddProductComponent, canActivate: [AuthComponentGuard], data: { expectedRole: ['1'] } },
      {
        path: "product-detail/:id", children: [
          { path: "", component: ProductDetailComponent, canActivate: [AuthComponentGuard], data: { expectedRole: ['1'] } },
          { path: 'add-product/:id', component: AddProductComponent, canActivate: [AuthComponentGuard], data: { expectedRole: ['1'] } },

        ]
      }
    ]
  },
]
@NgModule({
  declarations: [
    ProductListComponent,
    AddProductComponent,
    ProductDetailComponent,
    ProductQrCodeModelComponent,
    ChangeSchemeStatusModelComponent,
    ProductUploadComponent
  ],
  imports: [
    CommonModule,
    CommonModule,
    RouterModule.forChild(productroutes),
    FormsModule,
    ReactiveFormsModule,
    NgMultiSelectDropDownModule,
    MaterialModule,
    AutocompleteLibModule,
    MatIconModule,
    MatDialogModule,
    NgxMatSelectSearchModule,
    AppUtilityModule
  ],
  entryComponents: [
    ProductUploadComponent,
    ProductQrCodeModelComponent,
    ChangeSchemeStatusModelComponent,
  ]
})
export class ProductModule {
    constructor() {
    }
}
