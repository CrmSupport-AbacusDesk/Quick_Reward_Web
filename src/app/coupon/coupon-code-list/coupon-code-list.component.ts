import { Component, OnInit } from '@angular/core';
import { DatabaseService } from 'src/_services/DatabaseService';
import * as moment from 'moment';
import { sessionStorage } from 'src/app/localstorage.service';
import { ToastrManager } from 'ng6-toastr-notifications';
import { DialogComponent } from 'src/app/dialog.component';
import { MatBottomSheet, MatDialog } from '@angular/material';
import { CouponDetailModalComponent } from '../coupon-detail-modal/coupon-detail-modal.component';
import { ViewMasterBoxDispatchDetailComponent } from 'src/app/company-dispatch/view-master-box-dispatch-detail/view-master-box-dispatch-detail.component';
import { GatepassAddComponent } from 'src/app/company-dispatch/gatepass-add/gatepass-add.component';
import { CryptoService } from 'src/_services/CryptoService';
import { ProgressService } from 'src/app/progress.service';
import { BottomSheetComponent } from 'src/app/bottom-sheet/bottom-sheet.component';



@Component({
  selector: 'app-coupon-code-list',
  templateUrl: './coupon-code-list.component.html'
})
export class CouponCodeListComponent implements OnInit {
  fabBtnValue: any = 'add';
  active_tab: any = 'item_box'
  filter: any = {};
  couponData: any = [];
  mastercouponData: any = [];
  scanData: any = [];
  SecondaryScanData: any = [];
  pageCount: any;
  total_page: any;
  page_limit: any = 0;
  pagenumber: any = 1;
  start: any = 0;
  sr_no: number;
  loader: boolean = false;
  noResult: boolean = false;
  assign_login_data: any = [];
  assign_login_data2: any = [];
  today_date: any;
  tabCount: any = {}
  downurl: any;
  data: any = {};
  scanLimit: any = {};
  encryptedData: any;
  decryptedData: any;
  downloader: any = false;
  download_percent: any;
  totalDownloadCount: any;
  remainingDownloadCount: any;
  totalCount: any;
  remainingCount: any;
  st_user: any;
  organisation_data:any={}
  
  
  constructor(public service: DatabaseService, private bottomSheet: MatBottomSheet, public cryptoService: CryptoService, public toast: ToastrManager, public session: sessionStorage, public alertDialog: DialogComponent, public dialog: MatDialog, private progressService: ProgressService) {
    this.today_date = new Date();
    this.assign_login_data = this.session.getSession();
    this.st_user = JSON.parse(localStorage.getItem('st_user'));
    this.organisation_data=this.st_user.organisation_data
    this.assign_login_data = this.assign_login_data.value;
    this.assign_login_data2 = this.assign_login_data.data;
    this.downurl = service.downloadUrl;
    this.page_limit = service.pageLimit;
  }
  
  ngOnInit() {
    this.couponCodeList();
    this.getScanLimitCount();
  }
  
  pervious(type) {
    this.start = this.start - this.page_limit;
    if (type == 'scan_item') {
      this.scanCouponList();
    }
    if (type == 'secondary_scan_item') {
      this.secondaryScanCouponList();
    }
    if (type == 'master_grand_box') {
      this.getGrandMaster();
    }
    else {
      this.couponCodeList();
    }
  }
  
  nextPage(type) {
    this.start = this.start + this.page_limit;
    if (type == 'scan_item') {
      this.scanCouponList();
    }
    if (type == 'secondary_scan_item') {
      this.secondaryScanCouponList();
    }
    if (type == 'master_grand_box') {
      this.getGrandMaster();
    }
    else {
      this.couponCodeList();
    }
  }
  
  couponCodeList() {
    this.loader = true;
    if (this.pagenumber > this.total_page) {
      this.pagenumber = this.total_page;
      this.start = this.pageCount - this.page_limit;
    }
    if (this.start < 0) {
      this.start = 0;
    }
    
    if (this.filter.date_created) {
      this.filter.date_created = moment(this.filter.date_created).format('YYYY-MM-DD');
    }
    if (this.filter.dispatch_date) {
      this.filter.dispatch_date = moment(this.filter.dispatch_date).format('YYYY-MM-DD');
    }
    
    this.filter.active_tab = this.active_tab;
    this.encryptedData = this.service.payLoad ? { 'filter': this.filter, 'start': this.start, 'pagelimit': 500 } : this.cryptoService.encryptData({ 'filter': this.filter, 'start': this.start, 'pagelimit': 500 });
    this.service.post_rqst(this.encryptedData, '/CouponCode/couponCodeList').subscribe((result) => {
      this.decryptedData = this.service.payLoad ? result : this.cryptoService.decryptData(JSON.stringify(result));
      if (this.decryptedData['statusCode'] == 200) {
        this.couponData = this.decryptedData['scanned_coupon_code_list']
        this.pageCount = this.decryptedData['count'];
        
        this.loader = false;
        
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
        
        setTimeout(() => {
          if (this.couponData.length == 0) {
            this.noResult = true;
          }
        }, 500);
      }
      else {
        this.toast.errorToastr(this.decryptedData['statusMsg']);
      }
      
    })
  }
  
  
  
  scanCouponList() {
    this.loader = true;
    if (this.pagenumber > this.total_page) {
      this.pagenumber = this.total_page;
      this.start = this.pageCount - this.page_limit;
    }
    if (this.start < 0) {
      this.start = 0;
    }
    
    if (this.filter.date_created) {
      this.filter.date_created = moment(this.filter.date_created).format('YYYY-MM-DD');
    }
    if (this.filter.dispatch_date) {
      this.filter.dispatch_date = moment(this.filter.dispatch_date).format('YYYY-MM-DD');
    }
    if (this.filter.scanned_on) {
      this.filter.scanned_on = moment(this.filter.scanned_on).format('YYYY-MM-DD');
    }
    
    this.filter.active_tab = this.active_tab;
    this.encryptedData = this.service.payLoad ? { 'filter': this.filter, 'start': this.start, 'pagelimit': 500 } : this.cryptoService.encryptData({ 'filter': this.filter, 'start': this.start, 'pagelimit': 500 });
    this.service.post_rqst(this.encryptedData, 'CouponCode/scannedCouponCodeList').subscribe((result) => {
      this.decryptedData = this.service.payLoad ? result : this.cryptoService.decryptData(JSON.stringify(result));
      if (this.decryptedData['statusCode'] == 200) {
        this.scanData = this.decryptedData['scanned_coupon_code_list']
        this.pageCount = this.decryptedData['count'];
        
        this.loader = false;
        
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
        
        setTimeout(() => {
          if (this.scanData.length == 0) {
            this.noResult = true;
          }
        }, 500);
      }
      else {
        this.toast.errorToastr(this.decryptedData['statusMsg']);
      }
      
    })
  }
  
  secondaryScanCouponList() {
    this.loader = true;
    if (this.pagenumber > this.total_page) {
      this.pagenumber = this.total_page;
      this.start = this.pageCount - this.page_limit;
    }
    if (this.start < 0) {
      this.start = 0;
    }
    
    if (this.filter.date_created) {
      this.filter.date_created = moment(this.filter.date_created).format('YYYY-MM-DD');
    }
    if (this.filter.generated_date) {
      this.filter.generated_date = moment(this.filter.generated_date).format('YYYY-MM-DD');
    }
    if (this.filter.dispatch_date) {
      this.filter.dispatch_date = moment(this.filter.dispatch_date).format('YYYY-MM-DD');
    }
    if (this.filter.scanned_on) {
      this.filter.scanned_on = moment(this.filter.scanned_on).format('YYYY-MM-DD');
    }
    
    this.filter.active_tab = this.active_tab;
    this.encryptedData = this.service.payLoad ? { 'filter': this.filter, 'start': this.start, 'pagelimit': 500 } : this.cryptoService.encryptData({ 'filter': this.filter, 'start': this.start, 'pagelimit': 500 });
    this.service.post_rqst(this.encryptedData, 'CouponCode/scannedSecondaryCouponCodeList').subscribe((result) => {
      this.decryptedData = this.service.payLoad ? result : this.cryptoService.decryptData(JSON.stringify(result));
      if (this.decryptedData['statusCode'] == 200) {
        this.SecondaryScanData = this.decryptedData['scanned_coupon_code_list']
        this.pageCount = this.decryptedData['count'];
        
        this.loader = false;
        
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
        
        setTimeout(() => {
          if (this.scanData.length == 0) {
            this.noResult = true;
          }
        }, 500);
      }
      else {
        this.toast.errorToastr(this.decryptedData['statusMsg']);
      }
      
    })
  }
  
  
  
  lastBtnValue(value) {
    this.fabBtnValue = value;
  }
  
  refresh(type) {
    this.filter = {};
    if (this.start < 0) {
      this.start = 0;
    }
    
    
    if (type == 'scan_item') {
      this.scanCouponList();
    }
    if (type == 'secondary_scan_item') {
      this.secondaryScanCouponList();
    }
    else if (type == 'master_grand_box') {
      this.getGrandMaster();
    }
    else {
      // this.couponCodeList();
      this.getScanLimitCount();
    }
  }
  
  
  
  reopenCoupon(couponCode) {
    let alertText
    alertText = "You want to reopen this" + ' ' + couponCode + ' ' + 'code'
    this.alertDialog.confirm(alertText).then((result) => {
      if (result) {
        this.data.created_by_name = this.assign_login_data2.name;
        this.data.created_by_id = this.assign_login_data2.id;
        this.data.coupon_code = couponCode;
        this.encryptedData = this.service.payLoad ? { 'data': this.data } : this.cryptoService.encryptData({ 'data': this.data });
        this.service.post_rqst(this.encryptedData, "couponCode/CouponReopen").subscribe((result => {
          this.decryptedData = this.service.payLoad ? result : this.cryptoService.decryptData(JSON.stringify(result));
          if (this.decryptedData['statusCode'] == "200") {
            this.toast.successToastr(this.decryptedData['statusMsg']);
            this.scanCouponList();
            this.secondaryScanCouponList();
          }
          else {
            this.toast.errorToastr(this.decryptedData['statusMsg']);
          }
        }));
      }
    });
  }
  
  
  exportAsXLSX(status) {
    this.loader = true;
    this.encryptedData = this.service.payLoad ? { 'filter': this.filter, 'start': this.start, 'pagelimit': this.page_limit } : this.cryptoService.encryptData({ 'filter': this.filter, 'start': this.start, 'pagelimit': this.page_limit });
    this.service.post_rqst(this.encryptedData, '/Excel/coupon_code_all_list').subscribe((result => {
      this.decryptedData = this.service.payLoad ? result : this.cryptoService.decryptData(JSON.stringify(result));
      if (this.decryptedData['msg'] == true) {
        this.loader = false;
        window.open(this.downurl + this.decryptedData['filename'])
        this.couponCodeList();
      } else {
        this.loader = false;
      }
    }));
  }
  
  openScanLimitModal() {
    const dialogRef = this.dialog.open(CouponDetailModalComponent, {
      width: '500px',
      panelClass: 'cs-modal',
      disableClose: true,
      data: {
        'from': 'scan_limit_modal',
        'scan_limit': this.scanLimit.limit,
        'limit_type': this.scanLimit.limit_type

      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result == true) {
        this.getScanLimitCount()
      }
    });
  }
  
  getScanLimitCount() {
    this.service.post_rqst({}, '/CouponCode/scanLimit').subscribe((result) => {
      this.decryptedData = this.service.payLoad ? result : this.cryptoService.decryptData(JSON.stringify(result));
      if (this.decryptedData['statusCode'] == 200) {
        this.scanLimit = this.decryptedData['result'];
      }
      else {
        this.toast.errorToastr(this.decryptedData['statusMsg']);
      }
    }, err => {
      this.loader = false;
      
    })
  }
  
  getGrandMaster() {
    this.loader = true;
    if (this.pagenumber > this.total_page) {
      this.pagenumber = this.total_page;
      this.start = this.pageCount - this.page_limit;
    }
    if (this.start < 0) {
      this.start = 0;
    }
    
    if (this.filter.date_created) {
      this.filter.date_created = moment(this.filter.date_created).format('YYYY-MM-DD');
    }
    if (this.filter.dispatch_date) {
      this.filter.dispatch_date = moment(this.filter.dispatch_date).format('YYYY-MM-DD');
    }
    if (this.filter.scanned_on) {
      this.filter.scanned_on = moment(this.filter.scanned_on).format('YYYY-MM-DD');
    }
    
    this.filter.active_tab = this.active_tab;
    this.encryptedData = this.service.payLoad ? { 'filter': this.filter, 'start': this.start, 'pagelimit': this.page_limit } : this.cryptoService.encryptData({ 'filter': this.filter, 'start': this.start, 'pagelimit': this.page_limit });
    this.service.post_rqst(this.encryptedData, 'Dispatch/fetchGrandMasterList').subscribe((result) => {
      this.decryptedData = this.service.payLoad ? result : this.cryptoService.decryptData(JSON.stringify(result));
      if (this.decryptedData['statusCode'] == 200) {
        this.mastercouponData = this.decryptedData['offer_coupon_grand_master']
        this.pageCount = this.decryptedData['count'];
        
        this.loader = false;
        
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
        
        setTimeout(() => {
          if (this.mastercouponData.length == 0) {
            this.noResult = true;
          }
        }, 500);
      }
      else {
        this.toast.errorToastr(this.decryptedData['statusMsg']);
      }
      
    })
  }
  
  
  viewmasterboxdetail(id, type) {
    let data = { 'main_data': { 'id': id }, 'type': type }
    const dialogRef = this.dialog.open(ViewMasterBoxDispatchDetailComponent, {
      width: '1000px',
      data
      
    });
    dialogRef.afterClosed().subscribe(result => {
    });
  }
  
  getDetails(id, type): void {
    const dialogRef = this.dialog.open(GatepassAddComponent, {
      width: '1024px',
      panelClass: 'cs-modal',
      disableClose: true,
      
      data: {
        'model_type': type,
        'gatepass_id': id,
      }
      
    });
    dialogRef.afterClosed().subscribe(result => {
      
    });
  }



   openBottomSheet(): void {
      this.bottomSheet.open(BottomSheetComponent, {
        data: {
          'filterPage': 'Scan Coupon',
        }
      });
      this.bottomSheet._openedBottomSheetRef.afterDismissed().subscribe((data) => {
        if(data && this.active_tab == 'scan_item'){
          this.filter.date_from = data.date_from;
          this.filter.date_to = data.date_to;
          this.scanCouponList();
        }
       
      })
    }
  
  downloadInChunks() {
    this.filter.active_tab = this.active_tab;
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
      this.filter.active_tab = this.active_tab;
      if (this.filter.active_tab == 'scan_item') {
        this.encryptedData = this.service.payLoad ? { 'filter': this.filter, 'start': this.start, 'pagelimit': 500 } : this.cryptoService.encryptData({ 'filter': this.filter, 'start': this.start, 'pagelimit': 500 });
        this.service.post_rqst(this.encryptedData, "DownloadMaster/downloadCouponCodeScanData").subscribe((result) => {
          this.decryptedData = this.service.payLoad ? result : this.cryptoService.decryptData(JSON.stringify(result));
          if (this.decryptedData['code'] === 1) {
            this.downloader = false;
            this.download_percent = null;
            window.open(this.downurl + this.decryptedData['filename']);
            this.progressService.setTotalCount(0);
            this.progressService.setRemainingCount(0);
            this.progressService.setDownloadProgress(0);
            this.progressService.setDownloaderActive(false);
            this.scanCouponList();
            this.secondaryScanCouponList();
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
      else if (this.filter.active_tab == 'master_box' || this.filter.active_tab == 'item_box') {
        this.encryptedData = this.service.payLoad ? { 'filter': this.filter, 'start': this.start, 'pagelimit': 500 } : this.cryptoService.encryptData({ 'filter': this.filter, 'start': this.start, 'pagelimit': 500 });
        this.service.post_rqst(this.encryptedData, "DownloadMaster/downloadCouponCodeData").subscribe((result) => {
          this.decryptedData = this.service.payLoad ? result : this.cryptoService.decryptData(JSON.stringify(result));
          if (this.decryptedData['code'] === 1) {
            this.downloader = false;
            this.download_percent = null;
            window.open(this.downurl + this.decryptedData['filename']);
            this.progressService.setTotalCount(0);
            this.progressService.setRemainingCount(0);
            this.progressService.setDownloadProgress(0);
            this.progressService.setDownloaderActive(false);
            this.couponCodeList();
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
  

  lengthCodeAlert(){
      this.toast.errorToastr('Please enter at least a four-digit code to search for the coupon.');
      return;
  }
  
}
