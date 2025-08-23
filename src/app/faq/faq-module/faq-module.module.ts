import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthComponentGuard } from 'src/app/auth-component.guard';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatDialogModule, MatFormFieldModule } from '@angular/material';
import { AppUtilityModule } from 'src/app/app-utility.module';
import { MaterialModule } from 'src/app/material';
import { FaqAddComponent } from '../faq-add/faq-add.component';
import { FaqListComponent } from '../faq-list/faq-list.component';
import { NgxEditorModule } from 'ngx-editor';


const faqRoute = [
  { path: "", children:[
    { path: "", component: FaqListComponent,canActivate:[AuthComponentGuard], data:{ expectedRole: ['1']}},
    { path: 'faq-add', component: FaqAddComponent,canActivate:[AuthComponentGuard], data:{ expectedRole: ['1']}},
    {path:'faq-add/:id', component: FaqAddComponent,canActivate:[AuthComponentGuard], data:{ expectedRole: ['1']}}

  ]},
  
]

@NgModule({
  declarations: [
    // FaqListComponent,
    // FaqAddComponent
  ],
  imports: [
    CommonModule,
    MatFormFieldModule,
    MatInputModule,
    CommonModule,
    RouterModule.forChild(faqRoute),
    FormsModule,
    AppUtilityModule,
    ReactiveFormsModule,
    CommonModule,
    MatDialogModule,
    MaterialModule,
    NgxEditorModule
  ]
})
export class FaqModuleModule { }
