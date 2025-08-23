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
import { VideoAddComponent } from '../video-add/video-add.component';
import { VideoListComponent } from '../video-list/video-list.component';
import { AboutUsComponent } from 'src/app/about-us/about-us.component';
import { ContactUsComponent } from 'src/app/contact-us/contact-us.component';
import { VideoSafe } from 'src/_Pipes/VideoSafe.pipe';
import { NgxEditorModule } from 'ngx-editor';


const bannerRoute = [
  { path: "", component: VideoListComponent, canActivate: [AuthComponentGuard], data: { expectedRole: ['1'] } },
  { path: "banner-add", component: VideoAddComponent, canActivate: [AuthComponentGuard], data: { expectedRole: ['1'] } },
  { path: "video-add", component: VideoAddComponent, canActivate: [AuthComponentGuard], data: { expectedRole: ['1'] } },
]

@NgModule({
  declarations: [
    VideoListComponent,
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
export class VideoModule {
    constructor() {
    }
}
