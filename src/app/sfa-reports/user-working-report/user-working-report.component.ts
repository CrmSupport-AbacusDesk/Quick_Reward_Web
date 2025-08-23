import { Component, OnInit } from '@angular/core';
import { MatBottomSheet, MatDialog } from '@angular/material';
import { ToastrManager } from 'ng6-toastr-notifications';
import { BottomSheetComponent } from 'src/app/bottom-sheet/bottom-sheet.component';
import { sessionStorage } from 'src/app/localstorage.service';
import { DatabaseService } from 'src/_services/DatabaseService';
import * as moment from 'moment';
import { CryptoService } from 'src/_services/CryptoService';
import { ProgressService } from 'src/app/progress.service';

@Component({
  selector: 'app-user-working-report',
  templateUrl: './user-working-report.component.html',
  styleUrls: ['./user-working-report.component.scss']
})
export class UserWorkingReportComponent implements OnInit {

  loader: boolean = false;
  reportData: any = [];
  search: any = {};
  login_data: any = [];
  page_limit: any = 50;
  start: any = 0;
  pagenumber: any = '';
  total_page: any;
  pageCount: any;
  sr_no: any;
  filter: any = {};
  filtering: any = false;
  length: number = 0;
  fabBtnValue: any = 'add';
  // excel variables
  assign_login_data2: any = [];
  type_id: any;
  dr_list_temp: any = [];

  downValue: any;
  downType: any;
  downTypeId: any;
  downFilter: any;
  type: any;
  value: any = {};
  column: any = ''
  sorting_type: any = ''
  excelLoader: boolean = false;
  download_percent: any;
  downloader: any = false;
  downurl: any = '';
  totalCount: any;
  remainingCount: any;


  constructor(public progressService: ProgressService, private bottomSheet: MatBottomSheet, public cryptoService: CryptoService, public service: DatabaseService, public toast: ToastrManager, public session: sessionStorage, public dialog: MatDialog,) {
    this.login_data = this.session.getSession();
    this.login_data = this.login_data.value.data;
    this.downurl = service.downloadUrl;
  }

  ngOnInit() { }

  refresh() {
    this.start = 0;
    this.reportData = []
    this.filter = {}
  }

  pervious() {
    this.start = this.start - this.page_limit;
    this.fetchReport();
  }

  nextPage() {
    this.start = this.start + this.page_limit;
    this.fetchReport();
  }

  fetchReport() {
    this.loader = true;

    if (this.pagenumber > this.total_page) {
      this.pagenumber = this.total_page;
      this.start = this.pageCount - this.page_limit;
    } if (this.start < 0) {
      this.start = 0
    }
   
    this.service.post_rqst({ "filter": this.filter,'start': this.start, 'pagelimit': this.page_limit}, 'Reports/userDailyReport').subscribe((result) => {
      
      if (result['statusCode'] == 200) {
        this.reportData = result['result'];
        this.pageCount = result['count'];

        if (this.pagenumber > this.total_page) {
          this.pagenumber = this.total_page;
          this.start = this.pageCount - this.page_limit;
        }
        else {
          this.pagenumber = Math.ceil(this.start / this.page_limit) + 1;
        }
        this.total_page = Math.ceil(this.pageCount / this.page_limit);
        this.sr_no = this.pagenumber - 1;
        this.sr_no = this.sr_no * this.page_limit;
        this.loader = false;

      }
      else {
        this.toast.errorToastr(result['statusMsg']);
      }
    }, err => {
      this.loader = false;

    })
  }

  public onDate(event) {
    // this.filter.date_to = moment(event.target.value).format('YYYY-MM-DD');
    this.filter.date_from = moment(event.target.value).format('YYYY-MM-DD');

    this.fetchReport();

  }

  openBottomSheet(): void {
    this.filter.filterPage = 'userworkingReport'
    this.bottomSheet.open(BottomSheetComponent, {
      data: this.filter
    });
    this.bottomSheet._openedBottomSheetRef.afterDismissed().subscribe((data) => {
      if (data != undefined) {
        this.filter.filterPage = data.filterPage
        this.filter.date_from = data.date_from
        this.filter.user_id = data.user_id
        this.fetchReport();
      }
    })
  }

  downloadInChunks() {
    let payload = { 'start': this.start, 'pagelimit': this.page_limit }
    this.service.post_rqst(payload, "DownloadMaster/createQueueRequest").subscribe((result) => {
      if (result['statusCode'] == 200) {
        if (result['code'] == 0) {
          this.toast.errorToastr(result['statusMsg']);
          return;
        }

        if (result['code'] == 1) {
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
      this.service.post_rqst({ 'filter': this.filter }, "DownloadMaster/downloadUserDailyReport").subscribe((result) => {
        if (result['code'] === 1) {
          this.downloader = false;
          this.download_percent = null;
          window.open(this.downurl + result['filename']);
          this.progressService.setTotalCount(0);
          this.progressService.setRemainingCount(0);
          this.progressService.setDownloadProgress(0);
          this.progressService.setDownloaderActive(false);
        } else if (result['code'] === 0) {
          this.download_percent = Math.ceil(((result['totalCount'] - result['leftCount']) / result['totalCount']) * 100);

          if (this.download_percent > 100) {
            this.download_percent = 100;
          }
          this.totalCount = result['totalCount'];
          this.remainingCount = result['leftCount'];
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
