import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PayoutWalletComponent } from '../payout-wallet/payout-wallet.component';
import { AuthComponentGuard } from 'src/app/auth-component.guard';
import { RouterModule } from '@angular/router';
import { MaterialModule } from 'src/app/material';
import { MatIconModule } from '@angular/material';
import { AppUtilityModule } from 'src/app/app-utility.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

const payOutRoutes = [
  {
    path: "", children: [
      { path: "", component: PayoutWalletComponent, canActivate: [AuthComponentGuard], data: { expectedRole: ['1'] } },

    ]
  }
]
@NgModule({
  declarations: [PayoutWalletComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(payOutRoutes),
    MaterialModule,
    MatIconModule,
    AppUtilityModule,
    FormsModule,
    ReactiveFormsModule,
  ]
})
export class PayoutWalletModuleModule { }
