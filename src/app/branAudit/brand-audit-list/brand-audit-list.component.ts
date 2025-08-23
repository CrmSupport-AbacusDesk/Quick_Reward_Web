
import { Component, Input, OnInit } from '@angular/core';
import { ToastrManager } from 'ng6-toastr-notifications';
import { DialogComponent } from 'src/app/dialog.component';
import { DatabaseService } from 'src/_services/DatabaseService';
import * as moment from 'moment';
import { MatDialog } from '@angular/material';
import { sessionStorage } from 'src/app/localstorage.service';
import { log } from 'util';
import { ImageModuleComponent } from 'src/app/image-module/image-module.component';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { CryptoService } from 'src/_services/CryptoService';
import { SupportStatusComponent } from 'src/app/support/support-status/support-status.component';
import { RedeemStatusModalComponent } from 'src/app/redeem-status-modal/redeem-status-modal.component';

@Component({
  selector: 'app-brand-audit-list',
  templateUrl: './brand-audit-list.component.html',
})
export class BrandAuditListComponent implements OnInit {

  active_tab: any = 'Pending';
  fabBtnValue: any = 'add';
  filter: any = {};
  count: any = {};
  tabCount: any;
  loader: boolean = false;
  pageCount: any;
  total_page: any;
  page_limit: any;
  pagenumber: any = 1;
  start: any = 0;
  auditList: any = [];
  sr_no: number;
  userData: any;
  userId: any;
  userName: any;
  noResult: boolean = false;
  downurl: any = '';
  url: any = '';

  assign_login_data: any = [];
  assign_login_data2: any = [];
  tickets: any = [];
  routesValue: any;
  @Input() dataToReceive: any;
  padding0: any;
  hide: any;
  dr_id: any;
  encryptedData: any;
  decryptedData: any;
  constructor(public service: DatabaseService, public cryptoService: CryptoService, public location: Location, public toast: ToastrManager, public navparams: ActivatedRoute, public dialog: MatDialog, public alert: DialogComponent, public session: sessionStorage) {
    this.page_limit = service.pageLimit;
    this.url = this.service.uploadUrl + 'brandAudit/';
    this.downurl = service.downloadUrl;
    this.assign_login_data = this.session.getSession();
    this.assign_login_data = this.assign_login_data.value;
    this.assign_login_data2 = this.assign_login_data.data;

    this.userData = JSON.parse(localStorage.getItem('st_user'));
    this.userId = this.userData['data']['id'];
    this.userName = this.userData['data']['name'];
  }

  ngOnInit() {
    if (this.dataToReceive != undefined) {
      this.padding0 = this.dataToReceive.padding0;
      this.hide = this.dataToReceive.hide;
      this.dr_id = this.dataToReceive.id;
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
          this.filter.id = this.routesValue.id.toString();
          this.supportList();
        }
        else {
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
    this.filter.status = this.active_tab;
    this.encryptedData = this.service.payLoad ? { 'filter': this.filter, 'start': this.start, 'pagelimit': this.page_limit, 'dr_id': this.dr_id } : this.cryptoService.encryptData({ 'filter': this.filter, 'start': this.start, 'pagelimit': this.page_limit, 'dr_id': this.dr_id });
    this.service.post_rqst(this.encryptedData, 'BrandAudit/getBrandAuditList').subscribe((result) => {
      this.decryptedData = this.service.payLoad ? result : this.cryptoService.decryptData(JSON.stringify(result));
      if (this.decryptedData['statusCode'] == 200) {
        this.auditList = this.decryptedData['data'];
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
        if (this.auditList.length == 0) {
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



  sortData() {
    this.auditList.reverse();
  }


  exportAsXLSX() {
    this.loader = true;
    this.encryptedData = this.service.payLoad ? { 'filter': this.filter, 'start': this.start, 'pagelimit': this.page_limit } : this.cryptoService.encryptData({ 'filter': this.filter, 'start': this.start, 'pagelimit': this.page_limit });
    this.service.post_rqst(this.encryptedData, 'BrandAudit/getBrandAuditList').subscribe((result) => {
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


  back(): void {
    this.location.back()
  }

  openDialog(id, type): void {
    if (type != 'brandValLogs') {
      const dialogRef = this.dialog.open(SupportStatusComponent, {
        width:'400px',
        panelClass: 'padding0',
        data: {
          'id': id,
          'type': type
        }
      });
    }
    else {
      const dialogRef = this.dialog.open(RedeemStatusModalComponent, {
        width:'1200px',
        panelClass: 'padding0',
        data: {
          'id': id,
          'delivery_from': type
        }
      });
    }
  }






}

