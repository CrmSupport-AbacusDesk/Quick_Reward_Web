import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Router } from '@angular/router';
import { ToastrManager } from 'ng6-toastr-notifications';
import { sessionStorage } from 'src/app/localstorage.service';
import { DatabaseService } from 'src/_services/DatabaseService';
import { CryptoService } from 'src/_services/CryptoService';

@Component({
  selector: 'app-designation',
  templateUrl: './designation.component.html'
})
export class DesignationComponent implements OnInit {

  savingFlag: boolean = false;
  data: any = {};
  assign_login_data: any = {};
  logined_user_data: any = {};
  users: any = [];
  allAssignChannelPartner: any = [];
  allAssignChannelPartner2: any = [];
  tempSearch: any = '';
  showChannelPartner: boolean = false;


    constructor(public cryptoService:CryptoService,  public toast: ToastrManager, @Inject(MAT_DIALOG_DATA) public modelData, public rout: Router, public session: sessionStorage, public service: DatabaseService, public dialogRef: MatDialogRef<DesignationComponent>) {
    this.assign_login_data = this.session.getSession();
    this.logined_user_data = this.assign_login_data.value.data;

    if (modelData.type == 'transferData') {
      this.getReportManager('');
      this.data.user_id = modelData.user_detail.id;
      this.data.name = modelData.user_detail.name + ' ' + modelData.user_detail.employee_id;
      this.data.employee_id = modelData.user_detail.employee_id;
    }
    if (modelData.type == 'transfercustomerData') {
      this.network_type = modelData.network_type;
      this.getPartyData('');
    }
    if (modelData.type == 'updatePassword') {
      this.data.user_id = modelData.user_detail.id;
      this.data.password = modelData.user_detail.password;
      this.data.username = modelData.user_detail.username;
    }
    if (modelData.type == 'edit_designation') {
      this.data.id = modelData.data.id;
      this.data.user_type = modelData.data.user_type;
      this.data.designation = modelData.data.role_name;
    }

  }

  ngOnInit() {
  }



  getReportManager(searcValue) {
    this.service.post_rqst({ 'search': searcValue }, "Master/getSalesUserForReporting").subscribe((result => {
      if (result['statusCode'] == 200) {
        this.users = result['all_sales_user'];
      }
      else {
        this.toast.errorToastr(result['statusMsg'])
      }
    }));
  }

  drList:any=[];
  drListB:any=[];
  network_type:any;
  getPartyData(searcValue) {
    if(this.network_type == 'Primary'){
      this.data.dr_type = 1;
    }else{
      this.data.dr_type = 3;
    }
    this.service.post_rqst({ 'dr_type': this.data.dr_type, 'master_search': searcValue }, "Order/followupCustomer").subscribe((result => {
      if (result['statusCode'] == 200) {
        this.drList = result['result'];
      }
      else {
        this.toast.errorToastr(result['statusMsg'])
      }
    }));
  }

  getPartyDataB(searcValue) {
    if(this.network_type == 'Primary'){
      this.data.dr_type = 1;
    }else{
      this.data.dr_type = 3;
    }
    this.service.post_rqst({ 'dr_type': this.data.dr_type, 'master_search': searcValue }, "Order/followupCustomer").subscribe((result => {
      if (result['statusCode'] == 200) {
        this.drListB = result['result'];
      }
      else {
        this.toast.errorToastr(result['statusMsg'])
      }
    }));
  }

  getAssignedChannelPartner() {
    let index = this.data.transfer_module.findIndex(r => r == 'Customer');
    if (index != -1) {
      this.showChannelPartner = true;
    } else {
      this.showChannelPartner = false;

    }
    this.service.post_rqst({ 'user_id': this.data.user_id }, "Master/getDistributorData").subscribe((result => {
      if (result['statusCode'] == 200) {
        this.allAssignChannelPartner = result['result'];
        this.allAssignChannelPartner2 = result['result'];
      }
      else {
        this.toast.errorToastr(result['statusMsg'])
      }
    }));
  }

  searchChannelPartner(channelPartner) {
    channelPartner = channelPartner.toLowerCase();
    this.tempSearch = '';
    this.allAssignChannelPartner = [];
    for (let x = 0; x < this.allAssignChannelPartner2.length; x++) {
      this.tempSearch = this.allAssignChannelPartner2[x].company_name.toLowerCase();

      if (this.tempSearch.includes(channelPartner)) {
        this.allAssignChannelPartner.push(this.allAssignChannelPartner2[x])
      }
    }
  }

  selectAll2(action) {
    if (action == 'allChannelPartners') {
      setTimeout(() => {
        if (this.data.allChannelPartners == true) {
          const productData = [];
          for (let i = 0; i < this.allAssignChannelPartner.length; i++) {
            productData.push(this.allAssignChannelPartner[i].id)
          }
          this.data.channel_partner_id = productData;
        } else {
          this.data.channel_partner_id = [];
        }
      }, 500);
    }
  }


  submitDetail(type) {
    this.savingFlag = true;
    this.data.created_by_name = this.logined_user_data.name;
    this.data.created_by_id = this.logined_user_data.id;
    let header
    if (type == 'designation') {
      if (this.modelData.user_type == 'ORG') {
        this.data.user_type = this.modelData.user_type;
        header = this.service.post_rqst({ 'data': this.data }, "Master/addOrgDesignation")
      }
      else {
        header = this.service.post_rqst({ 'data': this.data }, "Master/addDesignation")
      }
    }
    if (type == 'edit_designation') {
      if (this.modelData.user_type == 'ORG') {
        this.data.user_type = this.modelData.user_type;
        header = this.service.post_rqst({ 'data': this.data }, "Master/editOrgDesignation")
      }
      else {
        header = this.service.post_rqst({ 'data': this.data }, "Master/editDesignation")
      }
    }
    if (type == 'transfer-data') {
      header = this.service.post_rqst({ 'data': this.data }, "Master/userDataTransfer")
    }
    if (type == 'merge-data') {
      if(this.data.party_a == this.data.party_b){
        this.toast.errorToastr('Choose a different party to merge the data.');
        this.savingFlag = false;
        return;
      }else{
      header = this.service.post_rqst({ 'data': this.data }, "Master/partyMerge")
      }
    }
    if (type == 'update-password') {
      header = this.service.post_rqst({ 'data': this.data }, "Master/updateUserPassword")
    }
    if (type == 'add-color') {
      header = this.service.post_rqst({ 'data': this.data }, "Master/addColor")
    }
    header.subscribe((result) => {
      if (result['statusCode'] == 200) {
        this.toast.successToastr(result['statusMsg']);
        // this.rout.navigate(['/user-add']);
        this.dialogRef.close(true);
        this.savingFlag = false;
      }
      else {
        this.toast.errorToastr(result['statusMsg']);
        this.savingFlag = false;
      }
    }, err => {
      this.savingFlag = false;
    });
  }

}
