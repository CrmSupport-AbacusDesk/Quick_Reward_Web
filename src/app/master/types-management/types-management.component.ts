import { Component, OnInit } from '@angular/core';
import { slideToTop } from 'src/app/router-animation/router-animation.component';
import { Router } from '@angular/router';
import { DatabaseService } from 'src/_services/DatabaseService'
import { MatDialog, PageEvent } from '@angular/material';
import { DialogComponent } from 'src/app/dialog.component';
import { StatusModalComponent } from 'src/app/order/status-modal/status-modal.component';
import * as moment from 'moment';
import { sessionStorage } from 'src/app/localstorage.service';
import { ToastrManager } from 'ng6-toastr-notifications';
import { UploadFileModalComponent } from 'src/app/upload-file-modal/upload-file-modal.component';
import { DesignationComponent } from 'src/app/user/designation/designation.component'; 
import { DesignationModalComponent } from 'src/app/userdesignation/designation-modal/designation-modal.component';
import { CryptoService } from 'src/_services/CryptoService';

@Component({
  selector: 'app-tyeps-management',
  templateUrl: './types-management.component.html'
})
export class TypesManagementComponent implements OnInit {

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
  typeList:any=[]


  constructor(
    public cryptoService:CryptoService,
    public rout: Router,
    public service: DatabaseService,
    public dialog: MatDialog,
    public session: sessionStorage,
    public toast: ToastrManager) {
    this.assign_login_data = this.session.getSession();
    this.logined_user_data = this.assign_login_data.value.data;
   
    this.fetchData();
  }

  ngOnInit() {
  }

  fetchData() {
    this.typeList = [];
    this.loader = true;
    this.service.post_rqst({ }, "Master/masterDropdownList").subscribe((result) => {
      if (result['statusCode'] == 200) {
        this.loader = false;
        this.typeList = result['data'];
      } else {
        this.toast.errorToastr(result['statusMsg'])
      }
    }, err => {
      this.loader = false;

    });
  }

  refresh() {
    this.fetchData();
  }

  openDialog2(roData) {
    const dialogRef = this.dialog.open(DesignationModalComponent, {
      width: '700px',
      data: {
        info: roData,
        'user_type': this.userType,
        'type': 'typesManagement'
      }
    });
    dialogRef.afterClosed().subscribe(res => {
      if (res == true) {
        this.fetchData()
      }
    })

  }

}
