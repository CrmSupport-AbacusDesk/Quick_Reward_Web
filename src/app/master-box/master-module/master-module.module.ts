import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthComponentGuard } from 'src/app/auth-component.guard';
import { GenerateMasterBoxComponent } from '../generate-master-box/generate-master-box.component';
import { RouterModule } from '@angular/router';
import { MaterialModule } from 'src/app/material';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import { MatSelectModule } from '@angular/material';
import { FormsModule } from '@angular/forms';

import { AppUtilityModule } from 'src/app/app-utility.module';
import { NgxQRCodeModule } from '@techiediaries/ngx-qrcode';


const masterboxRoutes = [
  { path: "", children:[
    { path: "", component: GenerateMasterBoxComponent,canActivate:[AuthComponentGuard], data:{ expectedRole: ['1']}}
  ]},
  
]

@NgModule({
  declarations: [
    GenerateMasterBoxComponent,
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(masterboxRoutes),
    MaterialModule,
    NgxMatSelectSearchModule,
    MatSelectModule,
    FormsModule,
    AppUtilityModule,
    NgxQRCodeModule
  ]
})
export class MasterModuleModule { }
