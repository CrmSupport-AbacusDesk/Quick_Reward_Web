import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SpinWinListComponent } from 'src/app/spin-win-list/spin-win-list.component';
import { AuthComponentGuard } from 'src/app/auth-component.guard';
import { SpinWinAddComponent } from 'src/app/spin-win-add/spin-win-add.component';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from 'src/app/material';
import { MatDialogModule, MatIconModule } from '@angular/material';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import { AppUtilityModule } from 'src/app/app-utility.module';


const spinWinRoutes = [
  {
    path: "", children: [
      { path: '', component: SpinWinListComponent, canActivate: [AuthComponentGuard], data: { expectedRole: ['1'] } },
      { path: "spin-add", component: SpinWinAddComponent, canActivate: [AuthComponentGuard], data: { expectedRole: ['1'] } },
    ]
  },
]

@NgModule({
  declarations: [SpinWinAddComponent,SpinWinListComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(spinWinRoutes),
    FormsModule,
    ReactiveFormsModule,
    MaterialModule,
    MatIconModule,
    MatDialogModule,
    NgxMatSelectSearchModule,
    AppUtilityModule
  ]
})
export class SpinWinModule { }
