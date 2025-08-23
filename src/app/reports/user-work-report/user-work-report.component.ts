import { Component, OnInit } from '@angular/core';
import { BottomSheetComponent } from 'src/app/bottom-sheet/bottom-sheet.component';
import { MatBottomSheet, MatDialog } from '@angular/material';
import { DatabaseService } from 'src/_services/DatabaseService';
import { ToastrManager } from 'ng6-toastr-notifications';
import * as moment from 'moment';
import { sessionStorage } from 'src/app/localstorage.service';
import { DatePipe } from '@angular/common';
import { CryptoService } from 'src/_services/CryptoService';
import { ProgressService } from 'src/app/progress.service';

@Component({
  selector: 'app-user-work-report',
  templateUrl: './user-work-report.component.html',
  styleUrls: ['./user-work-report.component.scss']
})
export class UserWorkReportComponent implements OnInit {
  skelation: any = new Array(10);
  assign_login_data2: any;
  data: any;
  userWorkReport: any = [];
  loader: boolean = false;
  get12MonthArray: any = [];
  datanotfound: boolean = false;
  filter: any = {}
  today_date: any = new Date()
  assign_login_data: any = {};
  logined_user_data: any = {};
  activeTab: any = 'daily'
  attendanceStart = "13:38:24";
  encryptedData:any;
  decryptedData:any;

  start: any = 0;
  page_limit: any = 50;
  downurl: any;
  excelLoader: boolean = false;
  download_percent: any;
  downloader: any = false;
  totalCount: any;
  remainingCount: any;
  fabBtnValue: any = 'add';

  constructor(public progressService: ProgressService, private bottomSheet: MatBottomSheet, public cryptoService:CryptoService, private datePipe: DatePipe, public service: DatabaseService, public toast: ToastrManager, public session: sessionStorage) {
    this.assign_login_data = this.session.getSession();
    this.logined_user_data = this.assign_login_data.value.data;
    this.downurl = service.downloadUrl;

    let monthsRequired = 11
    for (let i = 0; i <= monthsRequired; i++) {
      this.get12MonthArray.push(moment().add(i, 'months').format('MMMM YYYY'))
    }
    this.getPrimartTargetReport(this.activeTab);
  }

  ngOnInit() {
  }

  convertTo12HourFormat(timeString: string): string {
    const date = new Date(`2000-01-01T${timeString}`);
    return this.datePipe.transform(date, 'hh:mm a');
  }


  refresh() {
    this.filter = {}
    this.filter.date_from = '';
    this.filter.date_to = ''
    this.getPrimartTargetReport(this.activeTab);
  }

  openBottomSheet(): void {
    this.bottomSheet.open(BottomSheetComponent, {
      data: {
        'filterPage': 'userWorkReport',
      }
    });
    this.bottomSheet._openedBottomSheetRef.afterDismissed().subscribe((data) => {
      if(data.date_from && data.date_to){
        this.filter.date_to = data.date_to;
        this.filter.date_from = data.date_from;
        this.getPrimartTargetReport(this.activeTab)
      }
    })
  }

  getCurrentMonth(activeTab) {
    let date = new Date();
    this.filter.date_from = new Date(date.getFullYear(), date.getMonth(), 1).toISOString().slice(0, 10);
    this.filter.date_to = moment(date).format('YYYY-MM-DD');
    this.getPrimartTargetReport(activeTab);
  }

  getPrimartTargetReport(activeTab) {
    this.loader = true;
    this.encryptedData = this.service.payLoad ? { 'reportType': activeTab, 'filter': this.filter }: this.cryptoService.encryptData({ 'reportType': activeTab, 'filter': this.filter });
    this.service.post_rqst(this.encryptedData, 'Reports/userWorkReport').subscribe((result) => {
      this.decryptedData = this.service.payLoad ? result : this.cryptoService.decryptData(JSON.stringify(result));
      
      if (this.decryptedData['statusCode'] == 200) {
        this.loader = false;
        this.userWorkReport = this.decryptedData['result'];
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
    this.encryptedData = this.service.payLoad ? { 'reportType': this.activeTab, 'filter': this.filter }: this.cryptoService.encryptData({ 'reportType': this.activeTab, 'filter': this.filter });
    this.service.post_rqst(this.encryptedData, "Excel/userWorkReport")
      .subscribe(((result: any) => {
      this.decryptedData = this.service.payLoad ? result : this.cryptoService.decryptData(JSON.stringify(result));
        if (this.decryptedData['msg'] == true) {
          this.loader = false;
          window.open(this.service.downloadUrl + this.decryptedData['filename']);
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
      this.encryptedData = this.service.payLoad ? { 'reportType': this.activeTab, 'filter': this.filter } : this.cryptoService.encryptData({ 'reportType': this.activeTab, 'filter': this.filter });
      this.service.post_rqst(this.encryptedData, "DownloadMaster/downloadUserWorkReport").subscribe((result) => {
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


