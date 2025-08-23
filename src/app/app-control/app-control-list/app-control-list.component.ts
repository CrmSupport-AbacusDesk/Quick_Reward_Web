import { Component, OnInit, Renderer2, ElementRef, ViewChild } from '@angular/core';
import { slideToTop } from '../../router-animation/router-animation.component';
import { ActivatedRoute, Router } from '@angular/router';
import { DatabaseService } from 'src/_services/DatabaseService';
import { ToastrManager } from 'ng6-toastr-notifications';
import { MatDialog } from '@angular/material';
import { sessionStorage } from 'src/app/localstorage.service';
import { DialogComponent } from 'src/app/dialog.component';
import * as moment from 'moment';
import { Chart } from 'chart.js';
import { Location } from '@angular/common'
import { AppControlModalComponent } from '../app-control-modal/app-control-modal.component';
import { CryptoService } from 'src/_services/CryptoService';

@Component({
  selector: 'app-app-control-list',
  templateUrl: './app-control-list.component.html',
  styleUrls: ['./app-control-list.component.scss']
})
export class AppControlListComponent implements OnInit {
  login_data: any = {};
  tabType: any;
  loader: boolean = false;
  filter: any = {};
  today_date: any = new Date();
  alertList: any = [];
  datanotfound: boolean = false;
  value: any;
  fabBtnValue: any;
  logoutList: any = [];
  encryptedData: any;
  decryptedData:any;

  constructor(
    public route: ActivatedRoute,
    public rout: Router,
    public toast: ToastrManager,
    public service: DatabaseService,
    public alert: DialogComponent,
    public dialog: MatDialog,
    public session: sessionStorage,
    public cryptoService:CryptoService,
    public renderer: Renderer2,
    public location: Location,) {

    this.login_data = this.session.getSession();
    this.login_data = this.login_data.data;
    this.route.params.subscribe(params => {
      this.tabType = params['tab'];
    });
    if (this.tabType == 'System Alerts') {
      this.getAlertList();
    }
    else if (this.tabType == 'Auto Logout') {
      this.getLogoutList();
    }
  }

  ngOnInit() {
  }

  openDialog(action, typeId, typeName) {
    const dialogRef = this.dialog.open(AppControlModalComponent, {
      width: '800px',
      panelClass: 'cs-modal',

      data: {
        'tabType': this.tabType,
        'action': action,
        'typeId': typeId,
        'typeName': typeName
      }

    });
  }


  deleteAlert(id) {
    this.alert.confirm("You want to delete alert !").then((result) => {
      if (result) {
        this.encryptedData = this.service.payLoad ?{ 'data': { 'id': id, 'action': 'del' } }: this.cryptoService.encryptData({ 'data': { 'id': id, 'action': 'del' } });
        this.service.post_rqst(this.encryptedData, 'appControl/SystemAlert/updateAlertData').subscribe(result => {
        this.decryptedData = this.service.payLoad ? result : this.cryptoService.decryptData(JSON.stringify(result));
          if (this.decryptedData['statusCode'] == 200) {
            this.toast.successToastr(this.decryptedData['statusMessage'])
            this.getAlertList()
          }
          else {
            this.toast.errorToastr(this.decryptedData['statusMessage']);
          }
        })
      }
    })
  }

  deleteLogout(id) {
    this.alert.confirm("You want to delete !").then((result) => {
      if (result) {
          this.encryptedData = this.service.payLoad ? { 'data': { 'id': id, 'action': 'del' } }: this.cryptoService.encryptData({ 'data': { 'id': id, 'action': 'del' } });
          this.service.post_rqst(this.encryptedData, 'appControl/AutoLogout/updateLogoutData').subscribe(result => {
          this.decryptedData = this.service.payLoad ? result : this.cryptoService.decryptData(JSON.stringify(result));
          if (this.decryptedData['statusCode'] == 200) {
            this.toast.successToastr(this.decryptedData['statusMessage'])
            this.getLogoutList();
          }
          else {
            this.toast.errorToastr(this.decryptedData['statusMessage']);
          }
        })
      }
    })
  }

  changeAlertStatus(id, event) {
    this.alert.confirm("You want to change status !").then((result) => {
      if (result) {
        if (event.checked == false) {
          this.value = "0";
        }
        else {
          this.value = "1";
        }
        this.encryptedData = this.service.payLoad ? { 'data': { 'id': id, 'action': 'status', 'status': this.value } }: this.cryptoService.encryptData({ 'data': { 'id': id, 'action': 'status', 'status': this.value } });
        this.service.post_rqst(this.encryptedData, 'appControl/SystemAlert/updateAlertData').subscribe(result => {
        this.decryptedData = this.service.payLoad ? result : this.cryptoService.decryptData(JSON.stringify(result));
          if (this.decryptedData['statusCode'] == 200) {
            this.toast.successToastr(this.decryptedData['statusMessage'])
            this.getAlertList()
          }
          else {
            this.toast.errorToastr(this.decryptedData['statusMessage']);
            this.loader = false;
          }
        })
      }
    })
  }


  getAlertList() {
    this.loader = true;
    this.encryptedData = this.service.payLoad ? { 'filter': this.filter }: this.cryptoService.encryptData({ 'filter': this.filter });
    this.service.post_rqst(this.encryptedData, 'appControl/SystemAlert/getSystemAlertList').subscribe(result => {
    this.decryptedData = this.service.payLoad ? result : this.cryptoService.decryptData(JSON.stringify(result));

      if (this.decryptedData['statusCode'] == 200) {
        this.alertList = this.decryptedData['result'];
        if (this.alertList.length == 0) {
          this.datanotfound = true;
        }
        this.loader = false;
      }
      else {
        this.toast.errorToastr(this.decryptedData['statusMsg']);
        this.loader = false;
      }
    })
  }

  getLogoutList() {
    this.loader = true;
    this.encryptedData = this.service.payLoad ? { 'filter': this.filter }: this.cryptoService.encryptData({ 'filter': this.filter });
    this.service.post_rqst(this.encryptedData, 'appControl/AutoLogout/getLogoutRowsList').subscribe(result => {
    this.decryptedData = this.service.payLoad ? result : this.cryptoService.decryptData(JSON.stringify(result));
     
      if (this.decryptedData['statusCode'] == 200) {
        this.logoutList = this.decryptedData['result'];
        if (this.logoutList.length == 0) {
          this.datanotfound = true;
        }
        this.loader = false;
      }
      else {
        this.toast.errorToastr(this.decryptedData['statusMsg']);
        this.loader = false;
      }
    })
  }

  refresh() {
    this.filter = {};
    if (this.tabType == 'System Alerts') {
      this.getAlertList();
    }
    else if (this.tabType == 'Auto Logout') {
      this.getLogoutList();
    }
  }

  public onDate(event): void {
    this.filter.dateCreated = moment(event.value).format('YYYY-MM-DD');
    if (this.tabType == 'System Alerts') {
      this.getAlertList();
    }
    else if (this.tabType == 'Auto Logout') {
      this.getLogoutList();
    }

  }

}
