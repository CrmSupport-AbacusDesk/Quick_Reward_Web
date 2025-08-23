import { Component, OnInit } from '@angular/core';
import { MatBottomSheet, MatDialog } from '@angular/material';
import { ToastrManager } from 'ng6-toastr-notifications';
import { BottomSheetComponent } from 'src/app/bottom-sheet/bottom-sheet.component';
import { sessionStorage } from 'src/app/localstorage.service';
import { DatabaseService } from 'src/_services/DatabaseService';
import * as moment from 'moment';
import { ProductWiseSecondaryReportModalComponent } from 'src/app/reports/prouct-wise-secondary-report/product-wise-secondary-report-modal/product-wise-secondary-report-modal.component';
import { CryptoService } from 'src/_services/CryptoService';
import { ProgressService } from 'src/app/progress.service';

@Component({
  selector: 'app-category-wise-scan-report',
  templateUrl: './category-wise-scan-report.component.html',
  styleUrls: ['./category-wise-scan-report.component.scss']
})
export class CategoryWiseScanReportComponent implements OnInit {
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
  length:number =0;
  fabBtnValue: any = 'add';
  encryptedData:any;
  decryptedData:any;
  excelLoader: boolean = false;
  download_percent: any;
  downloader: any = false;
  downurl: any = '';
  totalCount: any;
  remainingCount: any;

  constructor(private bottomSheet: MatBottomSheet,public cryptoService:CryptoService, public service: DatabaseService, public toast: ToastrManager, public session: sessionStorage, public dialog: MatDialog,public progressService: ProgressService) {
    this.login_data = this.session.getSession();
    this.login_data = this.login_data.value.data;
    this.downurl = service.downloadUrl;

  }

  ngOnInit() {
    this.length =0;
    this.getSecondaryProductWiseReport('',this.length);
  }

  refresh(){
    this.start = 0;
    this.getSecondaryProductWiseReport('',this.length)
  }

  pervious() {
    this.start = this.start - this.page_limit;
    this.getSecondaryProductWiseReport('',this.length);
  }

  nextPage() {
    this.start = this.start + this.page_limit;
    this.getSecondaryProductWiseReport('',this.length);
  }



  getSecondaryProductWiseReport(action: any,length) {
    this.loader = true;

    if (this.pagenumber > this.total_page) {
      this.pagenumber = this.total_page;
      this.start = this.pageCount - this.page_limit;
    } if (this.start < 0) {
      this.start = 0
    }
    this.encryptedData = this.service.payLoad ? { 'start': this.start, 'pagelimit': this.page_limit,'filter': this.filter }: this.cryptoService.encryptData({ 'start': this.start, 'pagelimit': this.page_limit,'filter': this.filter });
    this.service.post_rqst(this.encryptedData, 'LoyaltyReport/category_wise_scan_report').subscribe((result) => {
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
    console.log(event);
    this.filter.date_to = moment(event.target.value).format('YYYY-MM-DD');
    this.filter.date_from = moment(event.target.value).format('YYYY-MM-DD');

    this.getSecondaryProductWiseReport('',this.length);

  }

  openBottomSheet(): void {
    this.bottomSheet.open(BottomSheetComponent, {
      data: {
        'filterPage': 'product_wise_secondary',
      }
    });
    this.bottomSheet._openedBottomSheetRef.afterDismissed().subscribe((data) => {
      this.filter.date_from = data.date_from;
      this.filter.date_to = data.date_to;
      // this.search.userId = data.user_id;
    this.length =0;
      this.getSecondaryProductWiseReport(this.filter.date_to,this.filter.date_from);
    })
  }

  getproductWiseSecondaryReportExcel() {
    this.encryptedData = this.service.payLoad ? { 'search': this.search }: this.cryptoService.encryptData({ 'search': this.search });
    this.loader = true;
    this.service.post_rqst(this.encryptedData, "LoyaltyReport/excel_category_wise_report").subscribe((result) => {
      this.decryptedData = this.service.payLoad ? result : this.cryptoService.decryptData(JSON.stringify(result));
      if (this.decryptedData['msg'] == true) {
        this.loader = false;
        window.open(this.service.downloadUrl + this.decryptedData['filename'])
        this.getSecondaryProductWiseReport('',this.length);
      }
    });
  }

  openProductWiseSecondarySubCategoryReport(drId, category, startDate, endDate, salesUserId): void {
    const dialogRef = this.dialog.open(ProductWiseSecondaryReportModalComponent, {
      width: '800px',
      panelClass: 'cs-modal',
      data: {
        'from': 'product-wise-sub-category',
        drId: drId,
        category: category,
        startDate: startDate,
        endDate: endDate,
        salesUserId: salesUserId
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result != false) {

      }

    });
  }

  lastBtnValue(value) {
    this.fabBtnValue = value;
  }




  downloadInChunks() {
    let payload = { 'start': this.start, 'pagelimit': this.page_limit }

    this.encryptedData = this.service.payLoad ? payload : this.cryptoService.encryptData(payload);
    this.service.post_rqst(this.encryptedData, "LoyaltyReport/createQueueRequest").subscribe((result) => {
      this.decryptedData = this.service.payLoad ? result : this.cryptoService.decryptData(JSON.stringify(result));
      if (this.decryptedData['statusCode'] == 200) {
        console.log(result)
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
      this.service.post_rqst(this.encryptedData, "LoyaltyReport/excel_category_wise_report").subscribe((result) => {
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
