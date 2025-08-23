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
import { GenerateqrcodeAdminComponent } from '../generateqrcode-admin/generateqrcode-admin.component';



const qrcodeadminroutes = [
  {
    path: "", children: [
      { path: "", component: GenerateqrcodeAdminComponent, canActivate: [AuthComponentGuard], data: { expectedRole: ['1'] } },
      // {
      //   path: "product-detail/:id", children: [
      //     { path: "", component: ProductDetailComponent, canActivate: [AuthComponentGuard], data: { expectedRole: ['1'] } },
      //     { path: 'add-product/:id', component: AddProductComponent, canActivate: [AuthComponentGuard], data: { expectedRole: ['1'] } },

      //   ]
      // }
    ]
  },
]
@NgModule({
  declarations: [
    GenerateqrcodeAdminComponent,
 
  ],
  imports: [
    CommonModule,
    CommonModule,
    RouterModule.forChild(qrcodeadminroutes),
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
    GenerateqrcodeAdminComponent,

  ]
})
export class GenerateqrcodeModuleModule {
    constructor() {
    }
}
