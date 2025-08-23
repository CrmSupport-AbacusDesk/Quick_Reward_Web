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
import { BannerListComponent } from '../banner-list/banner-list.component';
import { BannerAddComponent } from '../banner-add/banner-add.component';
import { VideoListComponent } from 'src/app/video/video-list/video-list.component';
import { AboutUsComponent } from 'src/app/about-us/about-us.component';
import { ContactUsComponent } from 'src/app/contact-us/contact-us.component';
import { VideoSafe } from 'src/_Pipes/VideoSafe.pipe';
import { NgxEditorModule } from 'ngx-editor';
import { VideoAddComponent } from 'src/app/video/video-add/video-add.component';
import { FaqAddComponent } from 'src/app/faq/faq-add/faq-add.component';
import { FaqListComponent } from 'src/app/faq/faq-list/faq-list.component';

const bannerRoute = [
  { path: "", component: BannerListComponent, canActivate: [AuthComponentGuard], data: { expectedRole: ['1'] } },
  { path: "banner-add", component: BannerAddComponent, canActivate: [AuthComponentGuard], data: { expectedRole: ['1'] } },
  { path: "video-add", component: VideoAddComponent, canActivate: [AuthComponentGuard], data: { expectedRole: ['1'] } },
  { path: "faq-list", component: FaqListComponent,canActivate:[AuthComponentGuard], data:{ expectedRole: ['1']}},
  { path: 'faq-add', component: FaqAddComponent,canActivate:[AuthComponentGuard], data:{ expectedRole: ['1']}},
    {path:'faq-add/:id', component: FaqAddComponent,canActivate:[AuthComponentGuard], data:{ expectedRole: ['1']}}
]

@NgModule({
  declarations: [
    BannerListComponent,
    BannerAddComponent,
    VideoListComponent,
    AboutUsComponent,
    ContactUsComponent,
    VideoSafe,
    VideoAddComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(bannerRoute),
    FormsModule,
    ReactiveFormsModule,
    NgMultiSelectDropDownModule,
    MaterialModule,
    AutocompleteLibModule,
    MatIconModule,
    MatDialogModule,
    NgxMatSelectSearchModule,
    AppUtilityModule,
    NgxEditorModule,

  ]
})
export class BannerModule {
    constructor() {
    }
}
