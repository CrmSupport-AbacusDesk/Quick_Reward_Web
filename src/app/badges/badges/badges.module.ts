import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppUtilityModule } from 'src/app/app-utility.module';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import { MatDialogModule, MatIconModule } from '@angular/material';
import { MaterialModule } from 'src/app/material';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { BadgesListComponent } from '../badges-list/badges-list.component';
import { AuthComponentGuard } from 'src/app/auth-component.guard';
import { BadgesAddComponent } from '../badges-add/badges-add.component';


const badgesRoutes = [
  {
    path: "", children: [
      { path: '', component: BadgesListComponent, canActivate: [AuthComponentGuard], data: { expectedRole: ['1'] } },
      { path: "badges-add", component: BadgesAddComponent, canActivate: [AuthComponentGuard], data: { expectedRole: ['1'] } },
      { path: "badges-edit/:id", component: BadgesAddComponent, canActivate: [AuthComponentGuard], data: { expectedRole: ['1'] } },
    ]
  },
]

@NgModule({
  declarations: [BadgesListComponent,BadgesAddComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(badgesRoutes),
    FormsModule,
    ReactiveFormsModule,
    MaterialModule,
    MatIconModule,
    MatDialogModule,
    NgxMatSelectSearchModule,
    AppUtilityModule
  ]
})
export class BadgesModule { }
