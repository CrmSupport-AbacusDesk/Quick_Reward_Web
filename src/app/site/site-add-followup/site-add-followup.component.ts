import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material';
import * as moment from 'moment';
import { ToastrManager } from 'ng6-toastr-notifications';
import { CryptoService } from 'src/_services/CryptoService';
import { DatabaseService } from 'src/_services/DatabaseService';
import { DialogComponent } from 'src/app/dialog.component';

@Component({
  selector: 'app-site-add-followup',
  templateUrl: './site-add-followup.component.html'
})
export class SiteAddFollowupComponent implements OnInit {

  userCheck: any = [];
  id: any;
  company_name: any = {};
  asmList: any = [];
  followUp: any = {};
  today_date: any = {};
  followup_types: any = [];
  active: any = {};
  userData: any;
  userId: any;
  userName: any;
  report_manager: any = [];
  savingFlag: boolean = false;
  encryptedData:any;
  decryptedData:any;


  constructor(@Inject(MAT_DIALOG_DATA) public data, public cryptoService:CryptoService, public service: DatabaseService, public dialog: DialogComponent, public dialog2: MatDialog, public toast: ToastrManager) {
    this.followUp.siteType = data['type'];
    this.followUp.dr_id = data['id'];
    this.followUp.id = data['id'];
    this.followUp.owner_name = data['owner_name'];
    this.followUp.type = data['type'];
    this.followUp.user_id = data['user_id'];
    this.followUp.created_by_name = data['created_by_name'];
    this.followUp.state = data['state'];
    this.userData = JSON.parse(localStorage.getItem('st_user'));
    this.userId = this.userData['data']['id'];
    this.userName = this.userData['data']['name'];
    this.getReportManager('');
    this.today_date = new Date().toISOString().slice(0, 10);
  }

  ngOnInit() {
  }



  getReportManager(searcValue) {
    this.encryptedData = this.service.payLoad ? { 'search': searcValue }: this.cryptoService.encryptData({ 'search': searcValue });
    this.service.post_rqst(this.encryptedData, "Enquiry/getSalesUserForReporting").subscribe((result => {
      this.decryptedData = this.service.payLoad ? result : this.cryptoService.decryptData(JSON.stringify(result));
    
      if (this.decryptedData['statusCode'] == 200) {
        this.report_manager = this.decryptedData['all_sales_user'];
      }
      else {
        this.toast.errorToastr(this.decryptedData['statusMsg']);
      }
    }));
  }





  submitActivity() {
    this.userCheck = false;
    this.savingFlag = true;
    this.encryptedData = this.service.payLoad ? { 'uid': this.userId, 'uname': this.userName, 'dr_id': this.followUp.dr_id, 'dr_name': this.followUp.dr_name, 'dr_type': this.followUp.dr_type, 'remarks': this.followUp.activity_remark }: this.cryptoService.encryptData({ 'uid': this.userId, 'uname': this.userName, 'dr_id': this.followUp.dr_id, 'dr_name': this.followUp.dr_name, 'dr_type': this.followUp.dr_type, 'remarks': this.followUp.activity_remark });

    this.service.post_rqst(this.encryptedData, "Enquiry/addEnquiryActivity").subscribe((result => {
      this.decryptedData = this.service.payLoad ? result : this.cryptoService.decryptData(JSON.stringify(result));
      if (this.decryptedData['statusCode'] == 200) {
        this.toast.successToastr(this.decryptedData['statusMsg']);
        this.dialog2.closeAll();
        setTimeout(() => {
          this.savingFlag = false;
        }, 700);
      }
      else {
        this.toast.errorToastr(this.decryptedData['statusMsg']);
      }
    }))

  }


  siteAddActivity() {
    this.userCheck = false;
    this.savingFlag = true;
    this.encryptedData = this.service.payLoad ? { 'uid': this.userId, 'uname': this.userName, 'dr_id': this.followUp.id, 'owner_name': this.followUp.owner_name, 'type': this.followUp.type, 'created_by_name': this.followUp.created_by_name, 'remarks': this.followUp.activity_remark }: this.cryptoService.encryptData({ 'uid': this.userId, 'uname': this.userName, 'dr_id': this.followUp.id, 'owner_name': this.followUp.owner_name, 'type': this.followUp.type, 'created_by_name': this.followUp.created_by_name, 'remarks': this.followUp.activity_remark });
    this.service.post_rqst(this.encryptedData, "Enquiry/addSiteActivity").subscribe((result => {
      this.decryptedData = this.service.payLoad ? result : this.cryptoService.decryptData(JSON.stringify(result)); 
      if (this.decryptedData['statusCode'] == 200) {
        this.toast.successToastr(this.decryptedData['statusMsg']);
        this.dialog2.closeAll();
        setTimeout(() => {
          this.savingFlag = false;
        }, 700);
      }
      else {
        this.toast.errorToastr(this.decryptedData['statusMsg']);
      }
    }))

  }
  submitFollowUp() {
    this.followUp.next_followup_date = moment(this.followUp.followup_date).format('YYYY-MM-DD');
    this.userCheck = false;
    this.savingFlag = true;
    this.encryptedData = this.service.payLoad ? { 'uid': this.userId, 'uname': this.userName, 'dr_id': this.followUp.dr_id, 'dr_type': 5, 'dr_type_name': 'Site', 'follow_type': this.followUp.followup_type, 'user_id': this.followUp.user_id, 'followup_time': this.followUp.followup_time, 'followup_date': this.followUp.next_followup_date, 'followup_type': this.followUp.followup_type, 'remarks': this.followUp.remarks }: this.cryptoService.encryptData({ 'uid': this.userId, 'uname': this.userName, 'dr_id': this.followUp.dr_id, 'dr_type': 5, 'dr_type_name': 'Site', 'follow_type': this.followUp.followup_type, 'user_id': this.followUp.user_id, 'followup_time': this.followUp.followup_time, 'followup_date': this.followUp.next_followup_date, 'followup_type': this.followUp.followup_type, 'remarks': this.followUp.remarks });
    this.service.post_rqst(this.encryptedData, "Enquiry/addFollowup").subscribe((result => {
      this.decryptedData = this.service.payLoad ? result : this.cryptoService.decryptData(JSON.stringify(result));
      if (this.decryptedData['statusCode'] == 200) {
        this.toast.successToastr(this.decryptedData['statusMsg']);
        this.dialog2.closeAll();
        setTimeout(() => {
          this.savingFlag = false;
        }, 700);
      }
      else {
        this.toast.errorToastr(this.decryptedData['statusMsg']);

      }
    }))

  }

}
