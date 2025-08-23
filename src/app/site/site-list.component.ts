import { Component, OnInit } from '@angular/core';
import { DialogComponent } from '../dialog.component';
import { MatBottomSheet, MatDialog } from '@angular/material';
import * as moment from 'moment';
import { Router } from '@angular/router';
import { ToastrManager } from 'ng6-toastr-notifications';
import { sessionStorage } from 'src/app/localstorage.service';
import { DatabaseService } from 'src/_services/DatabaseService'; import { ActivatedRoute } from '@angular/router';
import { BottomSheetComponent } from '../bottom-sheet/bottom-sheet.component';
import { ChangeEnquiryStatusComponent } from '../lead/change-enquiry-status/change-enquiry-status.component';
import { CryptoService } from 'src/_services/CryptoService';
import { ProgressService } from '../progress.service';


@Component({
  selector: 'app-site',
  templateUrl: './site-list.component.html'
})

export class SiteListComponent implements OnInit {
  active_tab: any = 'Open';
  fabBtnValue: any = 'add';
  site_List: any = [];
  datanotfound: boolean = true;
  excelLoader: boolean = false;
  type_id: any = 1;
  loader: any = false;
  data: any = [];
  value: any = {};
  data_not_found = false;
  search_val: any = {}
  type: any;
  today_date: any;
  count_list: any = {};
  login_data: any = {};
  login_data5: any = {};
  add: any = {};
  filter: any = {}
  enquiryList: any = []
  sr_no: any = 0;
  pageCount: any;
  total_page: any;
  pagenumber: any = 1;
  start: any = 0;
  count: any;
  page_limit: any;
  influencerType: any
  date_from: any = {};
  date_to: any = {};
  downurl: any = ""
  report_manager: any = [];
  pageType: any;
  gotoPageNumber:any=1;
  DashboardData: any;
  encryptedData: any;
  decryptedData: any;
  downloader: any = false;
  download_percent: any;
  totalDownloadCount: any;
  remainingDownloadCount: any;
  totalCount: any;
  remainingCount: any;


  constructor(public service: DatabaseService, public cryptoService: CryptoService, private bottomSheet: MatBottomSheet, public toast: ToastrManager, public dialog: DialogComponent, public alrt: MatDialog, public router: Router, public route: ActivatedRoute, public session: sessionStorage, private progressService: ProgressService) {
    this.downurl = service.downloadUrl;
    this.page_limit = this.service.pageLimit
    this.login_data = this.session.getSession();
    this.login_data = this.login_data.value;
    this.login_data5 = this.login_data.data;
    this.route.params.subscribe(params => {
      this.today_date = new Date().toISOString().slice(0, 10);
      this.type_id = params.id;
      this.type = params.type;
      this.DashboardData = this.route.queryParams['_value'];
    });

    this.getReportManager('');
  }

  ngOnInit() {
    this.filter = this.service.getData()
    if (this.filter.status) {
      this.active_tab = this.filter.status
    }
    this.leadList(this.active_tab);
    // this.influencer_type();

  }
  pervious() {
    if (this.start > 0) {
        this.start -= this.page_limit;
        this.pagenumber = Math.ceil(this.start / this.page_limit) + 1; // Update current page number
        this.gotoPageNumber = this.pagenumber; // Update input box
        this.leadList(this.active_tab);
    }
}

nextPage() {
    if (this.pagenumber < this.total_page) {
        this.start += this.page_limit;
        this.pagenumber = Math.ceil(this.start / this.page_limit) + 1; // Update current page number
        this.gotoPageNumber = this.pagenumber; // Update input box
        this.leadList(this.active_tab);
    }
}
goToPage() {
  if (this.gotoPageNumber < 1 || this.gotoPageNumber > this.total_page) {
      this.toast.errorToastr("Invalid page number");
      return;
  }
  this.pagenumber = this.gotoPageNumber;
  this.start = (this.pagenumber - 1) * this.page_limit;
  this.leadList(this.active_tab);
}
  date_format(type): void {
    if (type == 'date_created') {
      this.filter.date_created = moment(this.filter.date_created).format('YYYY-MM-DD');
    }
    else if (type == 'estimate_delivery_date') {
      this.filter.estimate_delivery_date = moment(this.filter.estimate_delivery_date).format('YYYY-MM-DD');
    }
    this.leadList(this.active_tab);
  }

  getReportManager(search, type: any = '') {
    this.encryptedData = this.service.payLoad ? { 'search': search } : this.cryptoService.encryptData({ 'search': search });
    this.service.post_rqst(this.encryptedData, "Checkin/getSalesUserForReporting").subscribe((result => {
      this.decryptedData = this.service.payLoad ? result : this.cryptoService.decryptData(JSON.stringify(result));
      if (this.decryptedData['statusCode'] == 200) {
        this.report_manager = this.decryptedData['all_sales_user'];
      }
      else {
        this.toast.errorToastr(this.decryptedData['statusMsg'])
      }
    }));
  }

  openBottomSheet(): void {
    this.bottomSheet.open(BottomSheetComponent, {
      data: {
        'filterPage': 'site_List',
      }
    });
    this.bottomSheet._openedBottomSheetRef.afterDismissed().subscribe((modelData) => {
      this.filter.date_from = modelData.date_from;
      this.filter.date_to = modelData.date_to;
      this.leadList(this.filter.status)
    })
  }

  changeStatus(user_id, name, enqid) {
    const dialogRef = this.alrt.open(ChangeEnquiryStatusComponent, {
      width: '600px',
      panelClass: 'cs-modal',
      data: {
        'id': user_id,
        'ownerName': name,
        'siteId': enqid,
        'from': 'site_list'
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result != false) {
        this.leadList(this.active_tab);
      }
    });
  }

  leadList(status) {
    this.loader = true;
    if (this.search_val.modified_date) {
      this.search_val.modified_date = moment(this.search_val.modified_date).format('YYYY-MM-DD');

    }
    if (this.pagenumber > this.total_page) {
      this.pagenumber = this.total_page;
      this.start = this.pageCount - this.page_limit;
    }
    if (this.start < 0) {
      this.start = 0;
    }

    this.filter.status = status;
    this.encryptedData = this.service.payLoad ? { 'filter': this.filter, 'start': this.start, 'pagelimit': this.page_limit } : this.cryptoService.encryptData({ 'filter': this.filter, 'start': this.start, 'pagelimit': this.page_limit });
    this.service.post_rqst(this.encryptedData, "Enquiry/getSiteList")
      .subscribe((result => {
        this.decryptedData = this.service.payLoad ? result : this.cryptoService.decryptData(JSON.stringify(result));

        if (this.decryptedData['statusCode'] == 200) {
          this.count = this.decryptedData['count'];
          this.site_List = this.decryptedData['enquiry_list'];
          this.site_List.forEach(item => item['encrypt_id'] = this.cryptoService.encryptId(item['id']));
          if (this.site_List.length == 0) {
            this.datanotfound = true;
          } else {
            this.datanotfound = false;
          }
          this.pagenumber = Math.ceil(this.start / this.page_limit) + 1;
          if (status == 'Open') {
            this.pageCount = this.count.Open;
            this.total_page = Math.ceil(parseInt(this.pageCount) / this.page_limit);
          }
          else if (status == 'Lost') {
            this.pageCount = this.count.Lost;
            this.total_page = Math.ceil(parseInt(this.pageCount) / this.page_limit);
          }

          else if (status == 'Win') {
            this.pageCount = this.count.Win;
            this.total_page = Math.ceil(parseInt(this.pageCount) / this.page_limit);
          }

          if (this.pagenumber > this.total_page) {
            this.pagenumber = this.total_page;
            this.start = this.pageCount - this.page_limit;
          }
          else {
            this.pagenumber = Math.ceil(this.start / this.page_limit) + 1;
          }
          this.service.count_list();
          setTimeout(() => {
            this.loader = false;
          }, 700);
          if (this.site_List.length == 0) {
            this.data_not_found = true;
          } else {
            this.data_not_found = false;
          }
          this.sr_no = this.pagenumber - 1;
          this.sr_no = this.sr_no * this.page_limit;
          this.loader = false;
        }
        else {
          this.toast.errorToastr(this.decryptedData['statusMsg']);
          this.loader = false;
        }
      }))
  }





  refresh() {
    this.filter = {};
    this.service.currentUserID = ''
    this.service.setData(this.filter);
    this.leadList(this.active_tab);
    this.gotoPageNumber=1
    this.start=0;
  }



  related_tabs(tab) {
    this.active_tab = tab;
  }


  excel_data: any = [];
  downloadExcel() {
    this.excelLoader = true;
    this.encryptedData = this.service.payLoad ? { 'filter': this.filter, 'start': this.start, 'pagelimit': this.page_limit } : this.cryptoService.encryptData({ 'filter': this.filter, 'start': this.start, 'pagelimit': this.page_limit });

    this.service.post_rqst(this.encryptedData, "Excel/siteExcel").subscribe((result) => {
      this.decryptedData = this.service.payLoad ? result : this.cryptoService.decryptData(JSON.stringify(result));
      if (this.decryptedData['msg'] == true) {
        window.open(this.downurl + this.decryptedData['filename']);
        this.excelLoader = false;
        this.leadList(this.active_tab);

      } else {

      }

    }, err => {
      this.excelLoader = false;

    });
  }

  lastBtnValue(value) {
    this.fabBtnValue = value;
  }
  downloadInChunks() {
    this.encryptedData = this.service.payLoad ? { 'filter': this.filter, 'start': this.start, 'pagelimit': this.page_limit } : this.cryptoService.encryptData({ 'filter': this.filter, 'start': this.start, 'pagelimit': this.page_limit });
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
      this.loader = false;
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
      this.encryptedData = this.service.payLoad ? { 'filter': this.filter, 'start': this.start, 'pagelimit': this.page_limit } : this.cryptoService.encryptData({ 'filter': this.filter, 'start': this.start, 'pagelimit': this.page_limit });
      this.service.post_rqst(this.encryptedData, "DownloadMaster/downloadSiteData").subscribe((result) => {
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
        this.loader = false;

      });
    }
  }

}
