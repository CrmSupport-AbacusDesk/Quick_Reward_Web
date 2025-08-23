
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthComponentGuard } from 'src/app/auth-component.guard';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatIconModule, MatDialogModule } from '@angular/material';
import { AutocompleteLibModule } from 'angular-ng-autocomplete';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import { AppUtilityModule } from 'src/app/app-utility.module';
import { MaterialModule } from 'src/app/material';
import { NgxQRCodeModule } from '@techiediaries/ngx-qrcode';
import { NgxBarcodeModule } from 'ngx-barcode';
import { ReplacementComponent } from './replacement.component';

const replaceRoutes = [
  { path: "", children:[
    { path: "", component: ReplacementComponent,canActivate:[AuthComponentGuard], data:{ expectedRole: ['1']}}
  ]},
]

@NgModule({
  declarations: [ReplacementComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(replaceRoutes),
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
    NgxBarcodeModule
    
  ],
  entryComponents:[]
})
export class ReplacementModule { }


