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
import { TaskListComponent } from '../task-list/task-list.component';
import { TaskActionModalComponent } from '../task-action-modal/task-action-modal.component';
import { TaskAddComponent } from '../task-add/task-add.component';
import { TaskDetailComponent } from '../task-detail/task-detail.component';
const taskRoutes = [
  {
    path: "", children: [
      { path: "", component: TaskListComponent, canActivate: [AuthComponentGuard], data: { expectedRole: ['1'] } },
      { path: "task-add", component: TaskAddComponent, canActivate: [AuthComponentGuard], data: { expectedRole: ['1'] } },
      { path: "task-detail/:id", component: TaskDetailComponent, canActivate: [AuthComponentGuard], data: { expectedRole: ['1'] } },
    ]
  }
]
@NgModule({
  declarations: [TaskActionModalComponent, TaskAddComponent, TaskDetailComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(taskRoutes),
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
    TaskActionModalComponent
  ]
})
export class TaskModule { }
