import { Component, OnInit } from '@angular/core';
import { slideToTop } from '../router-animation/router-animation.component';
import { Router } from '@angular/router';
import { DatabaseService } from 'src/_services/DatabaseService'
import { MatDialog, PageEvent } from '@angular/material';
import { DialogComponent } from 'src/app/dialog.component';
import { StatusModalComponent } from '../order/status-modal/status-modal.component';
import * as moment from 'moment';
import { sessionStorage } from 'src/app/localstorage.service';
import { ToastrManager } from 'ng6-toastr-notifications';
import { UploadFileModalComponent } from 'src/app/upload-file-modal/upload-file-modal.component';
import { DesignationComponent } from '../user/designation/designation.component';
import { DesignationModalComponent } from './designation-modal/designation-modal.component';
import { CryptoService } from 'src/_services/CryptoService';

@Component({
  selector: 'app-userdesignation',
  templateUrl: './userdesignation.component.html'
})
export class UserdesignationComponent implements OnInit {

  fabBtnValue: any = 'add';
  userlist: any = [];
  fabBtnfilter: any = 'add'
  loader: boolean = false;
  today_date: Date;
  assign_login_data: any = {};
  logined_user_data: any = {};
  sr_no = 0;
  datanotfound: boolean = false;
  downurl: any = '';
  userType: any = 'Sales User';
  encryptedData: any;
  decryptedData:any;


  constructor(
    public cryptoService:CryptoService,
    public rout: Router,
    public service: DatabaseService,
    public dialog: MatDialog,
    public session: sessionStorage,
    public toast: ToastrManager) {
    this.assign_login_data = this.session.getSession();
    this.logined_user_data = this.assign_login_data.value.data;
    if (this.logined_user_data.id == '1') {
      this.userType = 'ORG';
    }
    else {
      if(this.logined_user_data.organisation_data.sfa == '1'){
        this.userType = 'Sales User';
      }
      else if(this.logined_user_data.organisation_data.sfa == '1' || this.logined_user_data.organisation_data.dms == '1' || this.logined_user_data.organisation_data.loyalty == '1' || this.logined_user_data.organisation_data.dispatch == '1'){
        this.userType = 'System User';
      }
      else{
        this.userType = 'Sales User';
      }
    }
    this.get_sales_user_type();
  }

  ngOnInit() {
  }

  get_sales_user_type() {
    this.userlist = [];
    this.loader = true;
    this.encryptedData = this.service.payLoad ? { 'user_type': this.userType }: this.cryptoService.encryptData({ 'user_type': this.userType });
    this.service.post_rqst(this.encryptedData, this.userType == 'ORG' ? "Master/getOrgDesignation" : "Master/getDesignation").subscribe((result) => {
      this.decryptedData = this.service.payLoad ? result : this.cryptoService.decryptData(JSON.stringify(result));
     
      if (this.decryptedData['statusCode'] == 200) {
        this.loader = false;
        this.userlist = this.decryptedData['all_designation'];
      } else {
        this.toast.errorToastr(this.decryptedData['statusMsg'])
      }
    }, err => {
      this.loader = false;

    });
  }



  refresh() {
    this.get_sales_user_type();
  }

  openDesignationModal() {
    const dialogRef = this.dialog.open(DesignationComponent, {
      width: '500px',
      panelClass: 'cs-modal',
      disableClose: true,
      data: {
        'type': 'designation',
        'user_type': this.userType
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result == true) {
        this.get_sales_user_type()
      }
    });
  }
  openDesignationModal2(allData) {
    const dialogRef = this.dialog.open(DesignationComponent, {
      width: '500px',
      panelClass: 'cs-modal',
      disableClose: true,
      data: {
        'type': 'edit_designation',
        'data': allData,
        'user_type': this.userType,
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result == true) {
        this.get_sales_user_type()
      }
    });
  }

  openDialog2(roData) {
    const dialogRef = this.dialog.open(DesignationModalComponent, {
      width: '1000px',
      data: {
        info: roData,
        'user_type': this.userType,
        'type':'designation'
      }
    });
    dialogRef.afterClosed().subscribe(res => {
      if (res == true) {
        this.get_sales_user_type()
      }
    })

  }

}
