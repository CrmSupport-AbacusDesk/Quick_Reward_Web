import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material';
import { DatabaseService } from 'src/_services/DatabaseService';
import { sessionStorage } from 'src/app/localstorage.service';
import { ToastrManager } from 'ng6-toastr-notifications';
import { CryptoService } from 'src/_services/CryptoService';

@Component({
  selector: 'app-change-status',
  templateUrl: './change-status.component.html',
  styleUrls: ['./change-status.component.scss']
})
export class ChangeStatusComponent implements OnInit {
  userData: any;
  userId: any;
  savingFlag: boolean = false;
  userName: any;
  encryptedData: any;
  decryptedData:any;

  constructor(@Inject(MAT_DIALOG_DATA) public data, public cryptoService:CryptoService, public dialog: MatDialog, public session: sessionStorage, public service: DatabaseService, public toast: ToastrManager) {
    this.userData = JSON.parse(localStorage.getItem('st_user'));
    this.userId = this.userData['data']['id'];
    this.userName = this.userData['data']['name'];
  }

  ngOnInit() {
  }

  changeStatus() {

    this.savingFlag = true;
    this.encryptedData = this.service.payLoad ? { 'reason': this.data.reason, 'status': this.data.status, 'from': this.data.from, 'leaveApprovedCount': this.data.leave_approved_count, 'id': this.data.id, 'uid': this.userId, 'uname': this.userName }: this.cryptoService.encryptData({ 'reason': this.data.reason, 'status': this.data.status, 'from': this.data.from, 'leaveApprovedCount': this.data.leave_approved_count, 'id': this.data.id, 'uid': this.userId, 'uname': this.userName });
    this.service.post_rqst(this.encryptedData, "Leaves/statusChange").subscribe((result => {
      this.decryptedData = this.service.payLoad ? result : this.cryptoService.decryptData(JSON.stringify(result));
      if (this.decryptedData['statusCode'] == 200) {
        this.toast.successToastr(this.decryptedData['statusMsg']);
        this.dialog.closeAll();
        this.savingFlag = false;
      } else {
        this.savingFlag = false;
        this.toast.errorToastr(this.decryptedData['statusMsg']);
        this.dialog.closeAll();
      }
    }))
    this.dialog.closeAll();

  }

}
