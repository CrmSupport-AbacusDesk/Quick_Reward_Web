import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogModule, MatFormFieldModule, MatInputModule } from '@angular/material';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppUtilityModule } from 'src/app/app-utility.module';
import { MaterialModule } from 'src/app/material';
import { NgxEditorModule } from 'ngx-editor';
import { AuthComponentGuard } from 'src/app/auth-component.guard';
import { FormBuilderListComponent } from '../form-builder-list/form-builder-list.component';
import { FormBuilderComponent } from '../form-builder-add/form-builder.component';
import { FormBuilderDetailComponent } from '../form-builder-detail/form-builder-detail.component';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';


const faqRoute = [
  { path: "", children:[
    { path: "", component: FormBuilderListComponent,canActivate:[AuthComponentGuard], data:{ expectedRole: ['1']}},
    { path: 'add-new', component: FormBuilderComponent,canActivate:[AuthComponentGuard], data:{ expectedRole: ['1']}},
    {path:'faq-add/:id', component: FormBuilderDetailComponent,canActivate:[AuthComponentGuard], data:{ expectedRole: ['1']}}

  ]},
  
]

@NgModule({
  declarations: [
    FormBuilderListComponent,
    FormBuilderComponent,
    FormBuilderDetailComponent
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
    NgxEditorModule,
    NgxMatSelectSearchModule
  ]
})
export class FormBuilderModule { }
