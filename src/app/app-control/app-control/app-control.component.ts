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
import * as CryptoJS from 'crypto-js'
import { Location } from '@angular/common'
import { CryptoService } from 'src/_services/CryptoService';


@Component({
  selector: 'app-app-control',
  templateUrl: './app-control.component.html'
})
export class AppControlComponent implements OnInit {
  login_data: any = {};
  tabType: any;
  data: any = {};
  assignData: any = [];
  userType: any = [];
  typeData: any = {};
  savingFlag: boolean = false;
  urlPages: any = [];
  normal_data: any = {};
  encryptedData: any;
  decryptedData:any;

  constructor(
    public route: ActivatedRoute,
    public cryptoService:CryptoService,
    public rout: Router,
    public toast: ToastrManager,
    public service: DatabaseService,
    public alert: DialogComponent,
    public dialog: MatDialog,
    public session: sessionStorage,
    public renderer: Renderer2,
    public location: Location,) {

    this.login_data = this.session.getSession();
    this.login_data = this.login_data.data;

    this.route.params.subscribe(params => {
      this.tabType = params['tabType'];
    });
  }

  ngOnInit() {
  }

  ngAfterViewInit() {
    if (this.tabType == 'System Alerts') {
      this.getType();
      this.getPages();
    }
    if (this.tabType == 'Auto Logout') {
      this.getType();
    }

  }
  getType() {
    this.service.post_rqst({}, "appControl/Common/getTypes").subscribe((result => {
    this.decryptedData = this.service.payLoad ? result : this.cryptoService.decryptData(JSON.stringify(result));
      if ( this.decryptedData['statusCode'] == 200) {
        this.userType =  this.decryptedData['result']
      } else {
        this.toast.errorToastr( this.decryptedData['statusMsg']);
      }
    }));
  }
  id: any;
  getUserData(id, search) {
    if (!this.data.typeId) {
      this.toast.errorToastr('Select User type first');
      return
    }

    let index = this.userType.findIndex(row => row.typeId == id)
    if (index != -1) {
      this.data.typeName = this.userType[index].typeName;

    }
    this.typeData.typeId = id;
    this.encryptedData = this.service.payLoad ? { 'data': this.typeData, 'filter': search }: this.cryptoService.encryptData({ 'data': this.typeData, 'filter': search });
    this.service.post_rqst(this.encryptedData, "appControl/Common/getTypeDataBytypeId").subscribe((result => {
    this.decryptedData = this.service.payLoad ? result : this.cryptoService.decryptData(JSON.stringify(result));
      if (this.decryptedData['statusCode'] == 200) {
        this.assignData = this.decryptedData.result;
      } else {
        this.toast.errorToastr(this.decryptedData['statusMsg']);
      }
    }));
  }

  getPages() {

    this.service.post_rqst({}, "appControl/SystemAlert/getAppPageUrls").subscribe((result => {
    this.decryptedData = this.service.payLoad ? result : this.cryptoService.decryptData(JSON.stringify(result));

      if (this.decryptedData['statusCode'] == 200) {
        this.urlPages = this.decryptedData['result']
      } else {
        this.toast.errorToastr(this.decryptedData['statusMsg']);
      }
    }));
  }

  back() {
    window.history.back();
  }

  getTypeName(typeId) {
    let idx = this.userType.findIndex(row => row.typeId == typeId);
    this.data.typeName = this.userType[idx].typeName;
  }

  submitDetail() {
    this.savingFlag = true;
    this.encryptedData = this.service.payLoad ? { 'data': this.data }: this.cryptoService.encryptData({ 'data': this.data });
    this.service.post_rqst(this.encryptedData, "appControl/SystemAlert/insertSystemAlert").subscribe((result => {
    this.decryptedData = this.service.payLoad ? result : this.cryptoService.decryptData(JSON.stringify(result));
      if (this.decryptedData['statusCode'] == 200) {
        this.toast.successToastr(this.decryptedData['statusMessage']);
        this.rout.navigate(['/app-control/' + this.tabType]);
        this.savingFlag = false
      } else {
        this.toast.errorToastr(this.decryptedData['statusMessage']);
        this.savingFlag = false;
      }
    }));
  }

  MobileNumber(event: any) {
    const pattern = /[0-9\+\-\ ]/;
    let inputChar = String.fromCharCode(event.charCode);
    if (event.keyCode != 8 && !pattern.test(inputChar)) { event.preventDefault(); }

  }

  autoLogout() {
    this.savingFlag = true
    this.encryptedData = this.service.payLoad ? { 'data': this.data }: this.cryptoService.encryptData({ 'data': this.data });
    this.service.post_rqst(this.encryptedData , "appControl/AutoLogout/insertLogoutEntry").subscribe((result => {
    this.decryptedData = this.service.payLoad ? result : this.cryptoService.decryptData(JSON.stringify(result));
      if (this.decryptedData['statusCode'] == 200) {
        this.toast.successToastr(this.decryptedData['statusMessage']);
        this.rout.navigate(['/app-control/' + this.tabType]);
        this.savingFlag = false
      } else {
        this.toast.errorToastr(this.decryptedData['statusMessage']);
        this.savingFlag = false;
      }
    }));
  }
}
