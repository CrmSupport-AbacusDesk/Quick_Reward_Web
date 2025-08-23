import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialog } from '@angular/material';
import { DatabaseService } from 'src/_services/DatabaseService';
import { Router } from '@angular/router';
import { DialogComponent } from 'src/app/dialog.component';
import { ToastrManager } from 'ng6-toastr-notifications';
import { sessionStorage } from 'src/app/localstorage.service';
import { CryptoService } from 'src/_services/CryptoService';

@Component({
  selector: 'app-contractor-meet-status-modal',
  templateUrl: './contractor-meet-status-modal.component.html'
})
export class ContractorMeetStatusModalComponent implements OnInit {
  savingFlag: boolean = false;
  statusdata: any = {};
  data1: any;
  login_data: any = {};
  selectedStatus: any = {};
  from: any = '';
  ApprovalAmt:any
  encryptedData: any;
  decryptedData:any;
  multiEventParticipent:any=[];
  loader: boolean = false;

  constructor(@Inject(MAT_DIALOG_DATA) public data, public cryptoService:CryptoService,  public router: Router,public session: sessionStorage, public service: DatabaseService, public dialog: MatDialog, public rout: Router, public alert: DialogComponent, public toast: ToastrManager, public dialogRef: MatDialogRef<ContractorMeetStatusModalComponent>) {
    this.data1 = data;
    if(this.data1.approvalAmt){
    this.ApprovalAmt = Number(this.data1.approvalAmt);
    }
    this.login_data = this.session.getSession();
    this.login_data = this.login_data.value;
    this.login_data = this.login_data.data;
    this.from = data.from;
    console.log(this.from);
    if( this.from == 'participentUser'){
      this.getEnrollEventsUser();
    }

  }

  ngOnInit() {
  }
  updateDetails() {
    this.savingFlag = true;
    if(this.data1.approvalType == 'senior'){
      this.statusdata.senior_status = this.data.status;
      this.statusdata.senior_approved_amount = this.data.approved_amount;
    }else{
      this.statusdata.status = this.data.status;
      this.statusdata.approved_amount = this.data.approved_amount;
    }

    this.statusdata.status_changed_by = this.login_data.id;
    this.statusdata.id = this.data1.id;
    this.encryptedData = this.service.payLoad ? this.statusdata: this.cryptoService.encryptData(this.statusdata);
    this.service.post_rqst(this.encryptedData, "Event/statusChange").subscribe((result => {
      this.dialog.closeAll();
      this.savingFlag = false;
    }))
  }

  updatePerBudget() {
    this.savingFlag = true;
    this.statusdata.status_changed_by = this.login_data.id;
    this.statusdata.id = this.data1.id;
    this.statusdata.per_plumber_budget = this.data.per_plumber_budget;
    this.encryptedData = this.service.payLoad ? this.statusdata: this.cryptoService.encryptData(this.statusdata);
    this.service.post_rqst(this.encryptedData, "Event/perPlumberBudgets").subscribe((result => {
    this.decryptedData = this.service.payLoad ? result : this.cryptoService.decryptData(JSON.stringify(result));
      if (this.decryptedData['statusCode'] == 200) {
        this.dialogRef.close(true);
        this.savingFlag = false;
        this.toast.successToastr(this.decryptedData['statusMsg']);
      } else {
        this.toast.errorToastr(this.decryptedData['statusMsg']);

      }

    }))
  }


  getEnrollEventsUser() {
    this.service.post_rqst({'participent_mobile':this.data1.mobile_number,'event_id':this.data1.event_row_id}, "Event/participentsDetail").subscribe((result => {
        if (result['statusCode'] == 200) {
            this.multiEventParticipent = result['result'];
            this.loader = false;
        } else {
            this.toast.errorToastr(result['statusMsg']);
            this.loader = false;
        }
    }
));
}

goto(){
  this.dialogRef.close(this.data1.event_row_id);
}

}
