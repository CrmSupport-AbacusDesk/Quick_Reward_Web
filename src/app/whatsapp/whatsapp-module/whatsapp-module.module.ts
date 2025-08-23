import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WhatsappComponentComponent } from '../whatsapp-component/whatsapp-component.component';
import { AuthComponentGuard } from 'src/app/auth-component.guard';
import { RouterModule } from '@angular/router';
import { MaterialModule } from 'src/app/material';
import { MatIconModule } from '@angular/material';
import { AppUtilityModule } from 'src/app/app-utility.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

const whatsappRoutes = [
  {
    path: "", children: [
      { path: "", component: WhatsappComponentComponent, canActivate: [AuthComponentGuard], data: { expectedRole: ['1'] } },

    ]
  }
]

@NgModule({
  declarations: [WhatsappComponentComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(whatsappRoutes),
    MaterialModule,
    MatIconModule,
    AppUtilityModule,
    FormsModule,
    ReactiveFormsModule,
  ]
})
export class WhatsappModuleModule { }
