import { Component, OnInit } from '@angular/core';
import { DatabaseService } from 'src/_services/DatabaseService';
import { DialogComponent } from 'src/app/dialog.component';
import { MatBottomSheet, MatDialog } from '@angular/material';
import { RedeemStatusModalComponent } from 'src/app/redeem-status-modal/redeem-status-modal.component';
import { ActivatedRoute, Router } from '@angular/router';
import { sessionStorage } from 'src/app/localstorage.service';
import { ToastrManager } from 'ng6-toastr-notifications';
import * as moment from 'moment';
import { CryptoService } from 'src/_services/CryptoService';
import { ProgressService } from 'src/app/progress.service';
import { ChunksUploaderComponent } from 'src/app/uploader-new/chunks-uploader/chunks-uploader.component';
import { BottomSheetComponent } from 'src/app/bottom-sheet/bottom-sheet.component';

@Component({
  selector: 'app-redeem-request-list',
  templateUrl: './redeem-request-list.component.html'
})
export class RedeemRequestListComponent implements OnInit {
  
  fabBtnValue: any = 'add';
  active_tab: any = 'Pending';
  sub_active_tab:any ='0';
  filter: any = {};
  redeemRequestList_data: any = []
  today_date: Date;
  pageCount: any;
  total_page: any;
  page_limit: any = 50;
  pagenumber: any = 1;
  start: any = 0;
  sr_no: number;
  loader: boolean = false;
  datanotfound: boolean = false;
  redeemType: any = '';
  redeem_count: any = {}
  sub_count: any = {}
  data: any = {}
  assign_login_data: any = [];
  assign_login_data2: any = [];
  downurl: any = '';
  savingFlag: boolean = false;
  states: boolean = false;
  encryptedData: any;
  decryptedData: any;
  downloader: any = false;
  download_percent: any;
  totalDownloadCount: any;
  remainingDownloadCount: any;
  totalCount: any;
  remainingCount: any;
  
  
  constructor(public service: DatabaseService, public cryptoService: CryptoService,public dialogs: MatDialog, public rout: ActivatedRoute, public alert: DialogComponent, public toast: ToastrManager, public dialog: MatDialog, public route: Router, public session: sessionStorage, public progressService: ProgressService, private bottomSheet: MatBottomSheet) {
    this.downurl = service.downloadUrl;
    this.assign_login_data = this.session.getSession();
    this.assign_login_data = this.assign_login_data.value;
    this.assign_login_data2 = this.assign_login_data.data;
    console.log( this.assign_login_data2);
    
    this.today_date = new Date();
  }
  
  ngOnInit() {
    this.filter = this.service.getData()
    
    this.rout.params.subscribe(param => {
      this.redeemType = param.redeemType;
      this.redeemRequestList();
      this.getStateList();
    })
    
    if (this.filter.status) {
      this.active_tab = this.filter.status
    }
    
  }
  
  pervious() {
    this.start = this.start - this.page_limit;
    this.redeemRequestList();
  }
  
  nextPage() {
    this.start = this.start + this.page_limit;
    this.redeemRequestList();
  }
  
  refresh() {
    this.filter = {}
    this.service.setData(this.filter)
    this.service.currentUserID = '';
    this.redeemRequestList()
  }
  redeemRequestList() {
    this.filter.status = this.active_tab;
    if(this.assign_login_data.organisation_data.payout =='1' && this.redeemType == 'Cash'){
      if(this.active_tab == 'Approved'){
        this.filter.sub_status = this.sub_active_tab;
    }else{
      this.filter.sub_status = '';
    }
  }
    if(this.redeemType == 'Gift'){
      this.filter.sub_status = '';
    }
    // this.filter.paymentMode = this.redeemType;
    this.filter.redeem_type = this.redeemType;
    this.loader = true;
    if (this.pagenumber > this.total_page) {
      this.pagenumber = this.total_page;
      this.start = this.pageCount - this.page_limit;
    }
    if (this.start < 0) {
      this.start = 0;
    }
    this.encryptedData = this.service.payLoad ? { 'filter': this.filter, 'start': this.start, 'pagelimit': this.page_limit } : this.cryptoService.encryptData({ 'filter': this.filter, 'start': this.start, 'pagelimit': this.page_limit });
    this.service.post_rqst(this.encryptedData, 'RedeemRequest/redeemGiftRequestList').subscribe((result) => {
      this.decryptedData = this.service.payLoad ? result : this.cryptoService.decryptData(JSON.stringify(result));
      
      if (this.decryptedData['statusCode'] == 200) {
        this.redeemRequestList_data = this.decryptedData['gift_master_list']
        console.log(this.redeemRequestList_data);
        
        this.redeem_count = this.decryptedData['tabCount'];
        if(this.redeemType == 'Cash'){
          this.sub_count = this.decryptedData['sub_count'];
        }
        
        this.pageCount = this.decryptedData['count']
        // if (this.filter.status == 'Pending') {
        //   this.pageCount = this.decryptedData['tabCount']['Pending'];
        // }
        // if (this.filter.status == 'Approved') {
        //   this.pageCount = this.decryptedData['tabCount']['Approved'];
        // }
        // if (this.filter.status == 'Reject') {
        //   this.pageCount = this.decryptedData['tabCount']['Reject'];
        // }
        // if (this.filter.status == 'Failed') {
        //   this.pageCount = this.decryptedData['tabCount']['Failed'];
        // }
        
        
        if (this.redeemRequestList_data.length == 0) {
          this.datanotfound = true
        } else {
          this.datanotfound = false
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
        this.loader = false;
        
        setTimeout(() => {
          this.loader = false;
        }, 700);
      }
      else {
        this.toast.errorToastr(this.decryptedData['statusMsg']);
      }
    })
  }
  
  
  public onDate(event): void {
    if (this.filter.last_status_updated_on) {
      this.filter.last_status_updated_on = moment(event.value).format('YYYY-MM-DD');
    }
    
    else if (this.filter.transfer_date) {
      this.filter.transfer_date = moment(event.value).format('YYYY-MM-DD');
    }
    else if (this.filter.shipped_date) {
      this.filter.shipped_date = moment(event.value).format('YYYY-MM-DD');
    }
    else if (this.filter.payout_transaction_refund_date) {
      this.filter.payout_transaction_refund_date = moment(event.value).format('YYYY-MM-DD');
    }
    else {
      this.filter.date_created = moment(event.value).format('YYYY-MM-DD');
    }
    
    this.redeemRequestList();
    
  }
  openDialog(id, user_id, type, redeem_type, amount): void {
    this.service.currentUserID = id
    if (amount == 'Approved') {
      this.alert.confirm('You want to Change Status?').then((result) => {
        if (result) {
          this.savingFlag = true;
          this.encryptedData = this.service.payLoad ? { 'status': amount, 'id': id, 'created_by_id': this.assign_login_data2.created_by, 'created_by_name': this.assign_login_data2.created_by_name } : this.cryptoService.encryptData({ 'status': amount, 'id': id, 'created_by_id': this.assign_login_data2.created_by, 'created_by_name': this.assign_login_data2.created_by_name });
          this.service.post_rqst(this.encryptedData, 'RedeemRequest/redeemRequestStatusChange').subscribe((result) => {
            this.decryptedData = this.service.payLoad ? result : this.cryptoService.decryptData(JSON.stringify(result));
            
            if (this.decryptedData['statusCode'] == 200) {
              this.savingFlag = false;
              this.toast.successToastr(this.decryptedData['statusMsg']);
              this.redeemRequestList();
              this.savingFlag = false;
            }
            else {
              this.toast.errorToastr(this.decryptedData['statusMsg']);
            }
          })
        }
        else {
          this.savingFlag = false
        }
      });
    }
    else {
      const dialogRef = this.dialog.open(RedeemStatusModalComponent, {
        width: '400px', data: {
          'id': id,
          'user_id': user_id,
          'delivery_from': type,
          'redeem_type': redeem_type,
          'request_type': this.redeemType,
          'cash_amount': amount,
        }
      });
      
      dialogRef.afterClosed().subscribe(result => {
        console.log(result, 'result');
        
        if (result == true) {
          this.redeemRequestList();
        }
      });
    }
  }
  gotoRedeemDetail(id,) {
    this.route.navigate(["/redeem-detail/" + id], { queryParams: { id } });
  }
  
  
  updateNumber(id, wallet, number): void {
    const dialogRef = this.dialog.open(RedeemStatusModalComponent, {
      width: '400px', data: {
        'id': id,
        'delivery_from': wallet,
        'wallet_number': number,
      }
    });
    
    dialogRef.afterClosed().subscribe(result => {
      if (result == true) {
        this.redeemRequestList();
      }
    });
  }
  
  lastBtnValue(value) {
    this.fabBtnValue = value;
  }
  
  exportAsXLSX(status) {
    this.loader = true;
    this.filter.status = status;
    this.encryptedData = this.service.payLoad ? { 'filter': this.filter, 'active_tab': this.active_tab } : this.cryptoService.encryptData({ 'filter': this.filter, 'active_tab': this.active_tab });
    this.service.post_rqst(this.encryptedData, "Excel/redeem_gift_request_list"
    ).subscribe((result => {
      this.decryptedData = this.service.payLoad ? result : this.cryptoService.decryptData(JSON.stringify(result));
      if (this.decryptedData['msg'] == true) {
        this.loader = false;
        window.open(this.downurl + this.decryptedData['filename'])
        this.redeemRequestList();
      } else {
        this.loader = false;
      }
      
    }));
    
  }
  
  
  getStateList() {
    this.encryptedData = this.service.payLoad ? 0 : this.cryptoService.encryptData(0);
    this.service.post_rqst(this.encryptedData, "Master/getAllState").subscribe((result => {
      this.decryptedData = this.service.payLoad ? result : this.cryptoService.decryptData(JSON.stringify(result));
      if (this.decryptedData['statusCode'] == 200) {
        this.states = this.decryptedData['all_state'];
      }
      else {
        this.toast.errorToastr(this.decryptedData['statusMsg'])
      }
    }));
  }
  
  opengiftDialog(id, user_id, type, redeem_type, gift_status): void {
    if (gift_status == 'Received') {
      this.alert.confirm('You want to change status ?').then((result) => {
        if (result) {
          this.encryptedData = this.service.payLoad ? { 'status': gift_status, 'id': id } : this.cryptoService.encryptData({ 'status': gift_status, 'id': id });
          this.service.post_rqst(this.encryptedData, 'RedeemRequest/redeemRequestGiftStatusChange').subscribe((result) => {
            this.decryptedData = this.service.payLoad ? result : this.cryptoService.decryptData(JSON.stringify(result));
            if (this.decryptedData['statusCode'] == 200) {
              this.toast.successToastr(this.decryptedData['statusMsg']);
              this.redeemRequestList();
            }
            else {
              this.toast.errorToastr(this.decryptedData['statusMsg']);
            }
          })
        }
      });
    }
    else {
      if(this.redeemType == 'Cash' && this.assign_login_data.organisation_data.payout =='1')
        {
        this.alert.confirm('You want to transfer amount?').then((result) => {
          if (result) {
            this.encryptedData = { 'status': gift_status, 'id': id, }
            this.service.post_rqst(this.encryptedData, 'RedeemRequest/redeemRequestGiftStatusChange').subscribe((result) => {
              this.decryptedData = this.service.payLoad ? result : this.cryptoService.decryptData(JSON.stringify(result));
              if (this.decryptedData['statusCode'] == 200) {
                this.toast.successToastr(this.decryptedData['statusMsg']);
                this.redeemRequestList();
              }
              else {
                this.redeemRequestList();
                this.toast.errorToastr(this.decryptedData['statusMsg']);
              }
            })
          }
          else {
            this.redeemRequestList();
            this.savingFlag = false
          }
        });
      }
      else{
        const dialogRef = this.dialog.open(RedeemStatusModalComponent, {
          width: '400px', data: {
            'id': id,
            'user_id': user_id,
            'delivery_from': type,
            'redeem_type': redeem_type,
            'gift_status': gift_status,
          }
        });
        
        dialogRef.afterClosed().subscribe(result => {
          if (result == true) {
            this.redeemRequestList();
          }
        });
      }
      
    }
  }
  
  editRemark(id, mode, txn_no, txndate, txnremark, redeem_type, gift_status) {
    const dialogRef = this.dialog.open(RedeemStatusModalComponent, {
      width: '400px', data: {
        'id': id,
        'delivery_from': 'editRemark',
        'redeem_type': redeem_type,
        'transfer_remark': txnremark,
        'gift_status': gift_status,
        'transfer_mode': mode,
        'transfer_date': txndate,
        'transaction_number': txn_no
        
      }
    });
    
    dialogRef.afterClosed().subscribe(result => {
      this.redeemRequestList();
    });
    
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
      this.service.post_rqst(this.encryptedData, "DownloadMaster/downloadRedeemData").subscribe((result) => {
        this.decryptedData = this.service.payLoad ? result : this.cryptoService.decryptData(JSON.stringify(result));
        if (this.decryptedData['code'] === 1) {
          this.downloader = false;
          this.download_percent = null;
          window.open(this.downurl + this.decryptedData['filename']);
          this.progressService.setTotalCount(0);
          this.progressService.setRemainingCount(0);
          this.progressService.setDownloadProgress(0);
          this.progressService.setDownloaderActive(false);
          this.redeemRequestList();
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
  
  
  
  
  downloadInChunksRedeem() {
    this.encryptedData = this.service.payLoad ? { 'filter': this.filter, 'start': this.start, 'pagelimit': this.page_limit } : this.cryptoService.encryptData({ 'filter': this.filter, 'start': this.start, 'pagelimit': this.page_limit });
    this.service.post_rqst(this.encryptedData, "DownloadMaster/createQueueRequest").subscribe((result) => {
      this.decryptedData = this.service.payLoad ? result : this.cryptoService.decryptData(JSON.stringify(result));
      if (this.decryptedData['statusCode'] == 200) {
        if (this.decryptedData['code'] == 0) {
          this.toast.errorToastr(this.decryptedData['statusMsg']);
          return;
        }
        
        if (this.decryptedData['code'] == 1) {
          this.downloadExcelRedeem2();
        }
      }
    }, err => {
      this.loader = false;
    });
  }
  
  downloadExcelRedeem2() {
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
      this.service.post_rqst(this.encryptedData, "DownloadMaster/downloadRedeemDataCash").subscribe((result) => {
        this.decryptedData = this.service.payLoad ? result : this.cryptoService.decryptData(JSON.stringify(result));
        if (this.decryptedData['code'] === 1) {
          this.downloader = false;
          this.download_percent = null;
          window.open(this.downurl + this.decryptedData['filename']);
          this.progressService.setTotalCount(0);
          this.progressService.setRemainingCount(0);
          this.progressService.setDownloadProgress(0);
          this.progressService.setDownloaderActive(false);
          this.redeemRequestList();
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
          this.downloadExcelRedeem2();
        }
      }, err => {
        this.loader = false;
        
      });
    }
  }
  
  
  upload_excel(type) {
    const dialogRef = this.dialogs.open(ChunksUploaderComponent, {
      width: '500px',
      panelClass: 'cs-modal',
      disableClose: true,
      data: {
        'For': type,
        'redeem_type':this.redeemType
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result == true) {
        this.redeemRequestList();
      }
    });
  }
  
  openBottomSheet(): void {
    console.log(this.filter);
    
    this.bottomSheet.open(BottomSheetComponent, {
      data: {
        'filterPage': 'distribution_list',
      }
    });
    this.bottomSheet._openedBottomSheetRef.afterDismissed().subscribe((data) => {
      this.filter.date_from = data.date_from;
      this.filter.date_to = data.date_to;
      this.redeemRequestList();
    })
  }
}
