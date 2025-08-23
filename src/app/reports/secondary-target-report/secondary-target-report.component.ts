import { Component, OnInit } from '@angular/core';
import { BottomSheetComponent } from 'src/app/bottom-sheet/bottom-sheet.component';
import { MatBottomSheet, MatDialog } from '@angular/material';
import { DatabaseService } from 'src/_services/DatabaseService';
import { ToastrManager } from 'ng6-toastr-notifications';
import * as moment from 'moment';
import { sessionStorage } from 'src/app/localstorage.service';
import { CryptoService } from 'src/_services/CryptoService';
import { ProgressService } from 'src/app/progress.service';

@Component({
  selector: 'app-secondary-target-report',
  templateUrl: './secondary-target-report.component.html',
  styleUrls: ['./secondary-target-report.component.scss']
})
export class SecondaryTargetReportComponent implements OnInit {
  skelation: any = new Array(10);
  assign_login_data2: any;
  downurl: any;
  data: any;
  search: any;
  secondaryTargetReport: any = [];
  loader: boolean = false;
  get12MonthArray: any = [];
  assign_login_data: any = {};
  logined_user_data: any = {};
  pageCount: any;
  total_page: any;
  pagenumber: any = 0;
  start: any = 0;
  pagelimit: any = 50;
  encryptedData:any;
  decryptedData:any;

  page_limit: any = 50;
  excelLoader: boolean = false;
  download_percent: any;
  downloader: any = false;
  filter :any = {}
  totalCount: any;
  remainingCount: any;
  fabBtnValue: any = 'add';


  constructor(public progressService: ProgressService, private bottomSheet: MatBottomSheet, public cryptoService:CryptoService, public service: DatabaseService, public toast: ToastrManager, public session: sessionStorage) {
    this.assign_login_data = this.session.getSession();
    this.logined_user_data = this.assign_login_data.value.data;
    this.downurl = service.downloadUrl;

    let monthsRequired = 11
    for (let i = 0; i <= monthsRequired; i++) {
      this.get12MonthArray.push(moment().add(i, 'months').format('MMMM YYYY'))
    }
    this.getSecondaryTargetReport();
  }

  ngOnInit() {
  }


  refresh() {
    this.getSecondaryTargetReport()
  }

  pervious() {
    this.start = this.start - this.pagelimit;
    this.getSecondaryTargetReport();
  }

  nextPage() {
    this.start = this.start + this.pagelimit;
    this.getSecondaryTargetReport();
  }


  getSecondaryTargetReport() {
    this.loader = true;
    this.encryptedData = this.service.payLoad ? { 'search': this.search, 'start': this.start, 'pagelimit': this.pagelimit }: this.cryptoService.encryptData({ 'search': this.search, 'start': this.start, 'pagelimit': this.pagelimit });
    this.service.post_rqst(this.encryptedData, 'Reports/secondarTargetList').subscribe((result) => {
      this.decryptedData = this.service.payLoad ? result : this.cryptoService.decryptData(JSON.stringify(result));
      if (this.decryptedData['statusCode'] == 200) {
        this.loader = false;
        this.secondaryTargetReport = this.decryptedData['result'];
        this.pageCount = this.decryptedData['count'];
        this.pagenumber = Math.ceil(this.start / this.pagelimit) + 1;
        this.total_page = Math.ceil(this.pageCount / this.pagelimit);
      }
      else {
        this.loader = false;
        this.toast.errorToastr(this.decryptedData['statusMsg']);
      }
    }, err => {
      this.loader = false;
      this.toast.errorToastr(err);
    })
  }


  downloadExcel() {
    this.loader = true;
    this.encryptedData = this.service.payLoad ? { 'search': this.search, 'start': this.start, 'pagelimit': this.pagelimit }: this.cryptoService.encryptData({ 'search': this.search, 'start': this.start, 'pagelimit': this.pagelimit });
    this.service.post_rqst(this.encryptedData, "Excel/secondaryTargetReport").subscribe(((result: any) => {
      this.decryptedData = this.service.payLoad ? result : this.cryptoService.decryptData(JSON.stringify(result));
      if ( this.decryptedData['msg'] == true) {
        this.loader = false;
        window.open(this.service.downloadUrl +  this.decryptedData['filename']);
      } else {
        this.loader = false;
      }
    }));
  }

  downloadInChunks() {
    let payload = { 'start': this.start, 'pagelimit': this.page_limit }
    this.encryptedData = this.service.payLoad ? payload : 
    this.cryptoService.encryptData(payload);
    this.service.post_rqst(this.encryptedData, "DownloadMaster/createQueueRequest").subscribe((result) => {
      this.decryptedData = this.service.payLoad ? result : this.cryptoService.decryptData(JSON.stringify(result));
      if (this.decryptedData['statusCode'] == 200) {
        if (this.decryptedData['code'] == 0) {
          this.toast.errorToastr(this.decryptedData['statusMsg']);
          return;
        }

        if (this.decryptedData['code'] == 1) {
          this.downloadExcel2();
        }
      }
    }, err => {
      this.excelLoader = false;

    });
  }

  downloadExcel2() {
    let can
    this.progressService.getCancelReq().subscribe(cancelReq => {
      can = cancelReq
    })

    if (can == false) {
      this.downloader = true;
      if (this.download_percent == null) {
        this.download_percent = 0;
      }
      this.encryptedData = this.service.payLoad ? { 'filter': this.filter } : this.cryptoService.encryptData({ 'filter': this.filter });
      this.service.post_rqst(this.encryptedData, "DownloadMaster/downloadSecondaryTargetReport").subscribe((result) => {
        this.decryptedData = this.service.payLoad ? result : this.cryptoService.decryptData(JSON.stringify(result));
        if (this.decryptedData['code'] === 1) {
          this.downloader = false;
          this.download_percent = null;
          window.open(this.downurl + this.decryptedData['filename']);
          this.progressService.setTotalCount(0);
          this.progressService.setRemainingCount(0);
          this.progressService.setDownloadProgress(0);
          this.progressService.setDownloaderActive(false);
        } else if (this.decryptedData['code'] === 0) {
          this.download_percent = Math.ceil(((this.decryptedData['totalCount'] - this.decryptedData['leftCount']) / this.decryptedData['totalCount']) * 100);

          if (this.download_percent > 100) {
            this.download_percent = 100;
          }
          this.totalCount = this.decryptedData['totalCount'];
          this.remainingCount = this.decryptedData['leftCount'];
          this.progressService.setTotalCount(this.totalCount);
          this.progressService.setRemainingCount(this.remainingCount);
          this.progressService.setDownloadProgress(this.download_percent);
          this.progressService.setDownloaderActive(this.downloader);
          this.downloadExcel2();
        }

      }, err => {
        this.excelLoader = false;

      });
    }
  }


}
