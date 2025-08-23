import { Component, OnInit } from '@angular/core';
import { slideToTop } from '../../router-animation/router-animation.component';
// import { MyserviceService } from 'src/app/myservice.service';
import { DatabaseService } from 'src/_services/DatabaseService';
import { DialogComponent } from 'src/app/dialog.component';
import { ToastrManager } from 'ng6-toastr-notifications';
import { sessionStorage } from 'src/app/localstorage.service';
import { CryptoService } from 'src/_services/CryptoService';
import * as moment from 'moment';
import { MatDialog } from '@angular/material';
import { StatusModalComponent } from 'src/app/order/status-modal/status-modal.component';
import { ProgressService } from 'src/app/progress.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-purchase-list',
  templateUrl: './purchase-list.component.html'
})
export class PurchaseListComponent implements OnInit {
  purchase_data: any = [];
  filter: any = {};
  loader: boolean = false;
  skLoading: boolean = false;
  data: any = {};
  network: any = '';
  type: any = '';
  download_percent: any;
  datanotfound: boolean = false;
  pageCount: any;
  total_page: any;
  page_limit: any;
  pagenumber: any = 1;
  assign_user_data: any;
  logined_user_data: any = {};
  start: any = 0;
  downurl: any = '';
  sr_no: number;
  downloader: any = false;
  active_tab: any = 'Pending';
  tabCount:any ={};
  today_date: Date;
  downFilter: any;
  totalCount: any;
  remainingCount: any;
  
  
  constructor(public service: DatabaseService,public route: Router, public cryptoService:CryptoService, public dialogs: MatDialog, public toast: ToastrManager, public dialog: DialogComponent, public session: sessionStorage,private progressService: ProgressService) {
    this.page_limit = this.service.pageLimit;
    this.downurl = service.downloadUrl;
    this.assign_user_data = this.session.getSession();
    this.logined_user_data = this.assign_user_data.value.data;
    this.today_date = new Date();
    this.getList();
  }
  
  
  ngOnInit() {
  }
  
  pervious() {
    this.start = this.start - this.page_limit;
    this.getList();
  }
  
  nextPage() {
    this.start = this.start + this.page_limit;
    this.getList();
  }
  
  
  refresh() {
    this.start =0;
    this.filter = '';
    this.getList();
  }
  
  date_format(): void {
    if(this.filter.date_created){
      this.filter.date_created = moment(this.filter.date_created).format('YYYY-MM-DD');
    }
    if(this.filter.invoice_date){
      this.filter.invoice_date = moment(this.filter.invoice_date).format('YYYY-MM-DD');
    }
    this.getList();
  }
  downloadInChunks() {
    this.service.post_rqst({ 'type': this.type, 'filter': this.filter, 'start': this.start,'status': this.active_tab, 'pagelimit': this.page_limit }, "DownloadMaster/createQueueRequest").subscribe((result) => {
      if (result['statusCode'] == 200) {
        if (result['code'] == 0) {
          this.toast.errorToastr(result['statusMsg']);
          return;
        }

        if (result['code'] == 1) {
          this.downloadExcel();
        }
      }
    }, err => {
      this.loader = false;

    });
  }
  Addnew() {
    let network = this.network
    let type = this.type
    this.route.navigate(['/purchase/'], { queryParams: { type, network } });
  }
  downloadExcel() {
    let can
    this.progressService.getCancelReq().subscribe(cancelReq => {
      can = cancelReq
    })
    if (can == false) {
      this.downloader = true;
      if (this.download_percent == null) {
        this.download_percent = 0;
      }
      this.service.post_rqst({ 'type': this.type, 'filter': this.filter, 'start': this.start, 'pagelimit': this.page_limit,'status': this.active_tab }, "DownloadMaster/purchaseListDownload").subscribe((result) => {
        if (result['code'] === 1) {
        
          this.downloader = false;
          this.download_percent = null;
          window.open(this.downurl + result['filename']);
          this.progressService.setTotalCount(0);
          this.progressService.setRemainingCount(0);
          this.progressService.setDownloadProgress(0);
          this.progressService.setDownloaderActive(false);
          this.getList();
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
          this.downloadExcel();
        }
      }, err => {
        this.loader = false;
      });
    }
  }

  getList() {
    this.skLoading = true;
    if (this.pagenumber > this.total_page) {
      this.pagenumber = this.total_page;
      this.start = this.pageCount - this.page_limit;
    }
    
    if (this.start < 0) {
      this.start = 0;
    }
    this.service.post_rqst({ 'filter': this.filter, 'status': this.active_tab, 'start': this.start, 'pagelimit': this.page_limit }, 'Purchase/purchaseList').subscribe((result) => {
      if (result['statusCode'] == 200) {
        this.skLoading = false;
        this.purchase_data = result['purchase'];
        this.purchase_data.forEach(item => item['encrypt_id'] = this.cryptoService.encryptId(item['id']));

        this.tabCount = result['tab_count'];
        this.pageCount = result['count'];

        
        if (this.purchase_data.length == 0) {
          this.datanotfound = true;
        } else {
          this.datanotfound = false;
        }
        
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
      }
      else {
        this.toast.errorToastr(result['statusMsg'])
      }
    }
  )
}

openDialog(row): void {
  const dialogRef = this.dialogs.open(StatusModalComponent, {
    width: '500px',
    panelClass: 'cs-modal',
    disableClose: true,
    data: {
      delivery_from: 'purchase',
      modalData:row
    }

  });

  dialogRef.afterClosed().subscribe(result => {
   
  });
}


}
