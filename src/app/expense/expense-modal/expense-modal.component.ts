import { Component, OnInit, Inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DatabaseService } from 'src/_services/DatabaseService';
import { MatDialog, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { DialogComponent } from 'src/app/dialog.component';
import { ToastrManager } from 'ng6-toastr-notifications';
import { sessionStorage } from 'src/app/localstorage.service';
import { CryptoService } from 'src/_services/CryptoService';


@Component({
  selector: 'app-expense-modal',
  templateUrl: './expense-modal.component.html',
  styleUrls: ['./expense-modal.component.scss']
})
export class ExpenseModalComponent implements OnInit {
  userData: any;
  userId: any;
  savingFlag: boolean = false;
  delivery_from: any = '';
  loader: any;
  SelectedexpId: any
  userName: any;
  assign_login_data: any = {};
  logined_user_data: any = {};
  encryptedData: any;
  decryptedData:any;



  constructor(@Inject(MAT_DIALOG_DATA)
  public data,
    public session: sessionStorage,
    public service: DatabaseService,
    public cryptoService:CryptoService,
    public dialog: MatDialog,
    public rout: Router,
    public alert: DialogComponent,
    public dialogRef: MatDialogRef<ExpenseModalComponent>,
    public toast: ToastrManager) {
    console.log('comes data from', this.data)

    this.delivery_from = this.data.from;
    this.SelectedexpId = this.data.Change_status;
    this.userData = JSON.parse(localStorage.getItem('st_user'));
    this.userId = this.userData['data']['id'];
    this.userName = this.userData['data']['name'];
    this.assign_login_data = this.session.getSession();
    this.logined_user_data = this.assign_login_data.value.data;
  }

  ngOnInit() {
  }

  Approval() {
    //   console.log(this.SelectedexpId)
    // console.log(this.data.acStatus)
    // console.log(this.data.reason)
    // this.dialogRef.close(true)
    this.savingFlag = true;
    this.encryptedData = this.service.payLoad ? { 'data': this.SelectedexpId, 'status': this.data.acStatus, 'reason': this.data.reason }: this.cryptoService.encryptData({ 'data': this.SelectedexpId, 'status': this.data.acStatus, 'reason': this.data.reason });
    this.service.post_rqst(this.encryptedData, "Expense/updateMultipleExpense").subscribe((result) => {
    this.decryptedData = this.service.payLoad ? result : this.cryptoService.decryptData(JSON.stringify(result));
    if (this.decryptedData ['statusCode'] == 200) {
        this.savingFlag = false;
        this.dialogRef.close(true)
        this.toast.successToastr("Successfully");
      }
      else {
        this.savingFlag = false;
        this.toast.errorToastr("No Data selected")
      }
    }, error => {
      this.loader = false;
      this.savingFlag = false;
    });
  }

  update_status() {


    if (this.data['approved_amount'] == '') {

      delete this.data.approved_amount;
    }
    else if (this.data['reason'] == '') {

      delete this.data.reason;
    }
    this.data.created_by_id = this.userId;
    this.data.created_by_name = this.userName;

    if (this.data.type == 'acStatus' && (Number(this.data['approved_amount']) > Number(this.data.totalAmt))) {
      this.toast.errorToastr('Approved amount cannot be greater than RS ' + this.data.totalAmt);
    }

    // if (this.data.type == 'seniorStatus' && (Number(this.data['seniorApprovedAmount']) > Number(this.data.totalAmt))) {
    //   this.toast.errorToastr('Approved amount cannot be greater than RS ' + this.data.totalAmt);
    // }
    else {
    this.encryptedData = this.service.payLoad ? this.data: this.cryptoService.encryptData(this.data);
      this.savingFlag = true;
      this.service.post_rqst(this.encryptedData, "Expense/updateStatus").subscribe((result) => {
      this.decryptedData = this.service.payLoad ? result : this.cryptoService.decryptData(JSON.stringify(result));
        if (this.decryptedData['statusCode'] == 200) {
          this.toast.successToastr(this.decryptedData['statusMsg']);
           this.savingFlag = false;
          this.dialogRef.close(true);
        } else {
          this.savingFlag = false;
          this.toast.errorToastr(this.decryptedData['statusMsg']);
        }
      })
    }


    // }else{
    //   this.toast.errorToastr("Entered amount can't be greater than Claim Amount !")
    // }

  }
}
