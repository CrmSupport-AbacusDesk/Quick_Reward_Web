import { Component, OnInit } from '@angular/core';
import * as moment from 'moment';
import { MatBottomSheet, MatDialog } from '@angular/material';
import { CryptoService } from 'src/_services/CryptoService';
import { DatabaseService } from 'src/_services/DatabaseService';
import { ToastrManager } from 'ng6-toastr-notifications';
import { ProgressService } from 'src/app/progress.service';
import { sessionStorage } from 'src/app/localstorage.service';
import { BottomSheetComponent } from 'src/app/bottom-sheet/bottom-sheet.component';
import { StatusModalComponent } from 'src/app/order/status-modal/status-modal.component';

@Component({
  selector: 'app-expense-report-multi-user-wise',
  templateUrl: './expense-report-multi-user-wise.component.html',
  styleUrls: ['./expense-report-multi-user-wise.component.scss']
})
export class ExpenseReportMultiUserWiseComponent implements OnInit {
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
  encryptedData: any;
  decryptedData: any;

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

  fetchReport(action: any = {}) {
    this.loader = true;

    if (this.pagenumber > this.total_page) {
      this.pagenumber = this.total_page;
      this.start = this.pageCount - this.page_limit;
    } if (this.start < 0) {
      this.start = 0
    }
    this.encryptedData = this.service.payLoad ? { "filter": action } : this.cryptoService.encryptData({ "filter": action });
    this.service.post_rqst(this.encryptedData, 'Reports/userExpenseReport').subscribe((result) => {
      this.decryptedData = this.service.payLoad ? result : this.cryptoService.decryptData(JSON.stringify(result));

      if (this.decryptedData['statusCode'] == 200) {
        this.reportData = this.decryptedData['result'];
        this.pageCount = this.decryptedData['count'];

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
        this.toast.errorToastr(this.decryptedData['statusMsg']);
      }
    }, err => {
      this.loader = false;

    })
  }

  public onDate(event) {
    this.filter.date_to = moment(event.target.value).format('YYYY-MM-DD');
    this.filter.date_from = moment(event.target.value).format('YYYY-MM-DD');

    this.fetchReport();

  }

  openBottomSheet(): void {
    this.filter.filterPage = 'expenseReportForMultiUser';
    this.bottomSheet.open(BottomSheetComponent, {
      data: this.filter
    });
    this.bottomSheet._openedBottomSheetRef.afterDismissed().subscribe((data) => {
      if (data != undefined) {
        this.filter = data
        this.fetchReport(data);
      }
    })
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
      this.encryptedData = this.service.payLoad ? { 'filter': this.filter } : 
      this.cryptoService.encryptData({ 'filter': this.filter });
      this.service.post_rqst(this.encryptedData, "DownloadMaster/userExpenseReport").subscribe((result) => {
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


  openDialog(username,data): void {
    const dialogRef = this.dialog.open(StatusModalComponent, {
      width: '400px',
      panelClass: 'padding0',
      disableClose: true,
      data: {
        'delivery_from': 'Remark',
        'data': data,
        'username':username
      }
    });
    dialogRef.afterClosed().subscribe(result => {
    });
    
  }
  
}

