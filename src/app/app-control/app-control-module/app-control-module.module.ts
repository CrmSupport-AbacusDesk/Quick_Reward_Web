import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatIconModule, MatDialogModule } from '@angular/material';
import { RouterModule } from '@angular/router';
import { AutocompleteLibModule } from 'angular-ng-autocomplete';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import { AppUtilityModule } from 'src/app/app-utility.module';
import { AuthComponentGuard } from 'src/app/auth-component.guard';
import { MaterialModule } from 'src/app/material';
import { AgmCoreModule } from '@agm/core';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { AppControlComponent } from '../app-control/app-control.component';
import { AppControlListComponent } from '../app-control-list/app-control-list.component';
import { AppControlModalComponent } from '../app-control-modal/app-control-modal.component';
import { environment } from 'src/environments/environment';
const appControlRoutes = [ 
  { path: "", children:[
    { path: "", component: AppControlListComponent,canActivate:[AuthComponentGuard], data:{ expectedRole: ['1']} },
    { path: "add-alert/:tabType", component: AppControlComponent,canActivate:[AuthComponentGuard], data:{ expectedRole: ['1']} },
  
  ]}
]  
@NgModule({
  declarations: [
    AppControlComponent,
    AppControlListComponent,
    AppControlModalComponent,
  ],
  imports: [
    AgmCoreModule.forRoot({
      apiKey: environment.googleMapsApiKey
      
  }),
    CommonModule,
    RouterModule.forChild(appControlRoutes),
    FormsModule,
    ReactiveFormsModule,
    NgMultiSelectDropDownModule,
    MaterialModule,
    AutocompleteLibModule,
    MatIconModule,
    MatDialogModule,
    NgxMatSelectSearchModule,
    InfiniteScrollModule,
    AppUtilityModule
  ],
  entryComponents: [
    AppControlModalComponent,
  ]
})
export class AppControlModuleModule { }
