import { Component, OnInit, Input } from '@angular/core';
import { ToastrManager } from 'ng6-toastr-notifications';
import { DialogComponent } from 'src/app/dialog.component';
import { DatabaseService } from 'src/_services/DatabaseService';
import * as moment from 'moment';
import { MatDialog } from '@angular/material';
import { SupportStatusComponent } from '../support-status/support-status.component';

import { sessionStorage } from 'src/app/localstorage.service';

import { ImageModuleComponent } from 'src/app/image-module/image-module.component';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { CryptoService } from 'src/_services/CryptoService';



@Component({
  selector: 'app-support-list',
  templateUrl: './support-list.component.html'
})

export class SupportListComponent implements OnInit {

  fabBtnValue: any = 'add';
  active_tab: any = 'Pending'
  filter: any = {};
  count: any = {};
  tabCount: any;
  loader: boolean = false;
  pageCount: any;
  total_page: any;
  page_limit: any;
  pagenumber: any = 1;
  start: any = 0;
  supportList_data: any = [];
  sr_no: number;
  userData: any;
  userId: any;
  userName: any;
  noResult: boolean = false;
  downurl: any = '';
  url: any = '';
  today_date: Date;
  assign_login_data: any = [];
  assign_login_data2: any = [];
  tickets: any = [];
  routesValue: any;
  @Input() dataToReceive: any;
  padding0: any;
  hide: any;
  dr_detail: any;
  encryptedData: any;
  decryptedData:any;

  constructor(public service: DatabaseService, public cryptoService:CryptoService, public location: Location, public navparams: ActivatedRoute, public toast: ToastrManager, public dialog: MatDialog, public alert: DialogComponent, public session: sessionStorage) {
    this.page_limit = service.pageLimit;
    this.url = this.service.uploadUrl + 'support/';
    this.downurl = service.downloadUrl;
    this.assign_login_data = this.session.getSession();
    this.assign_login_data = this.assign_login_data.value;
    this.assign_login_data2 = this.assign_login_data.data;



    this.userData = JSON.parse(localStorage.getItem('st_user'));
    this.userId = this.userData['data']['id'];
    this.userName = this.userData['data']['name'];
    this.today_date = new Date();
  }

  ngOnInit() {
    if (this.dataToReceive != undefined) {
      this.padding0 = this.dataToReceive.padding0;
      this.hide = this.dataToReceive.hide;
      this.dr_detail = this.dataToReceive;
      let routes = { 'routes': this.dataToReceive.routes }
      this.routesValue = routes;
      this.supportList();
      this.getTicketType();
    }
    else {

      this.navparams.params.subscribe(params => {
        this.routesValue = this.navparams.queryParams['_value'];
        this.service.currentUserID = this.routesValue.checkinId;

        if (this.routesValue.id) {
          console.log(this.dataToReceive, 'if');
          this.filter.id = this.routesValue.id.toString();
          this.supportList();
        }
        else {
          console.log(this.dataToReceive, 'esle');

          this.supportList();
          this.getTicketType();
        }
      });
    }
  }

  pervious() {
    this.start = this.start - this.page_limit;
    this.supportList();
  }

  nextPage() {
    this.start = this.start + this.page_limit;
    this.supportList();
  }

  supportList() {
    this.loader = true;
    if (this.pagenumber > this.total_page) {
      this.pagenumber = this.total_page;
    }
    if (this.start < 0) {
      this.start = 0;
    }

    if (this.filter.date_created) {

      this.filter.date_created = moment(this.filter.date_created).format('YYYY-MM-DD');
    }

    // if (this.assign_login_data2.support_access != '') {
    //   this.filter.type_name = this.assign_login_data2.support_access;
    // }
    this.encryptedData = this.service.payLoad ? { 'filter': this.filter, 'start': this.start, 'dr_id': this.dr_detail ? this.dr_detail.id : '', 'pagelimit': this.page_limit, 'status': this.active_tab }: this.cryptoService.encryptData({ 'filter': this.filter, 'start': this.start, 'dr_id': this.dr_detail ? this.dr_detail.id : '', 'pagelimit': this.page_limit, 'status': this.active_tab });
    this.service.post_rqst(this.encryptedData, 'Support/getSupportList').subscribe((result) => {
    
    this.decryptedData = this.service.payLoad ? result : this.cryptoService.decryptData(JSON.stringify(result));
      if (this.decryptedData['statusCode'] == 200) {
        this.supportList_data = this.decryptedData['data'];
        this.tabCount = this.decryptedData['tabCount'];
        this.pageCount = this.decryptedData['count'];
        this.loader = false;
        if (this.pagenumber > this.total_page) {
          this.pagenumber = this.total_page;
          if (this.pageCount != 0) {

            this.start = this.pageCount - this.page_limit;
          }
          else {
            this.start = 0
          }
        }

        else {
          this.pagenumber = Math.ceil(this.start / this.page_limit) + 1;
        }
        this.total_page = Math.ceil(this.pageCount / this.page_limit);
        this.sr_no = this.pagenumber - 1;
        this.sr_no = this.sr_no * this.page_limit;
        if (this.supportList_data.length == 0) {
          this.noResult = true;
        } else {
          this.noResult = false;
        }
      }
      else {
        this.toast.errorToastr(this.decryptedData['statusMsg']);
      }
    })
  }


  refresh() {
    this.filter = {}
    this.supportList();

  }


  openDialog(id, type): void {
    const dialogRef = this.dialog.open(SupportStatusComponent, {
      width: type == 'status' ? '400px' : '768px',
      panelClass: 'padding0',
      data: {
        'id': this.routesValue.routes == 'dr_Detail' ? this.dr_detail.id : id,
        'network_type': this.routesValue.routes == 'dr_Detail' ? { 'network_type': this.dr_detail.dr_type, 'pagetype': 'de_detail' } : type,
        'type': type
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result == true) {
        this.supportList()
      }
    });

  }
  sortData() {
    this.supportList_data.reverse();
  }


  exportAsXLSX() {
    this.loader = true;
    this.encryptedData = this.service.payLoad ? { 'filter': this.filter, 'start': this.start, 'pagelimit': this.page_limit, 'status': this.active_tab }: this.cryptoService.encryptData({ 'filter': this.filter, 'start': this.start, 'pagelimit': this.page_limit, 'status': this.active_tab });
    this.service.post_rqst(this.encryptedData, 'Support/getSupportList').subscribe((result) => {
      this.decryptedData = this.service.payLoad ? result : this.cryptoService.decryptData(JSON.stringify(result));
      if (this.decryptedData['msg'] == true) {
        this.loader = false;
        window.open(this.downurl + this.decryptedData['filename'])
        this.supportList();
      } else {
        this.loader = false;
      }
    });
  }

  goToImage(image) {
    const dialogRef = this.dialog.open(ImageModuleComponent, {
      panelClass: 'Image-modal',
      data: {
        'image': image,
        'type': 'base64'
      }
    });
    dialogRef.afterClosed().subscribe(result => {
    });
  }



  getTicketType() {
    this.service.post_rqst({}, "Support/getSupportcategory").subscribe((result) => {
    this.decryptedData = this.service.payLoad ? result : this.cryptoService.decryptData(JSON.stringify(result));
      if (this.decryptedData['statusCode'] == 200) {
        this.tickets = this.decryptedData['data'];
      } else {
        this.toast.errorToastr(this.decryptedData['statusMsg'])
      }
    }, err => {
    })
  }

  back(): void {
    this.location.back()
  }

}
