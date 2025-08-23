import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { MatBottomSheet, MatDialog } from '@angular/material';
import { ImageModuleComponent } from 'src/app/image-module/image-module.component';
import { ActivatedRoute, Router } from '@angular/router';
import { DatabaseService } from 'src/_services/DatabaseService';
import { ChartType, ChartDataSets, ChartOptions, Chart } from 'chart.js';
import * as moment from 'moment';
import { sessionStorage } from 'src/app/localstorage.service';
import { ToastrManager } from 'ng6-toastr-notifications';
import { AdvanceAddGiftComponent } from '../advance-add-gift/advance-add-gift.component';
import { Location } from '@angular/common'
import { RedeemStatusModalComponent } from 'src/app/redeem-status-modal/redeem-status-modal.component';
import { DialogComponent } from 'src/app/dialog.component';
import { UpdateKycComponent } from '../update-kyc/update-kyc.component';
import { CryptoService } from 'src/_services/CryptoService';
import { ProgressService } from 'src/app/progress.service';
import { BottomSheetComponent } from 'src/app/bottom-sheet/bottom-sheet.component';
import { StatusModalComponent } from 'src/app/order/status-modal/status-modal.component';



@Component({
  selector: 'app-influencer-detail',
  templateUrl: './influencer-detail.component.html'
})
export class InfluencerDetailComponent implements OnInit {
  @ViewChild('pieCanvas') private pieCanvas: ElementRef;
  pieChart: Chart;

  tabType: any = 'Profile';
  filter: any = {}
  Influencer_Detail: any = {};
  wallet_Detail: any = {}
  influencer_Logs_Detail: any = [];
  id: any = ''
  wallet_history_type: any = 'ledger'
  pageCount: any;
  pagenumber: any = '';
  start: any = 0;
  total_page: any;
  page_limit: any;
  sr_no: any;
  skLoading: boolean = false;
  checkinLoader: boolean = false;
  loader: boolean = false;
  type_id: any;
  login_data: any = {};
  login_data5: any = {};
  url: any;
  user_assign_name: any = '';
  savingFlag: boolean = false;
  today_date: Date;
  downloader: any = false;
  download_percent: any;
  totalDownloadCount: any;
  remainingDownloadCount: any;
  totalCount: any;
  remainingCount: any;
  downurl: any;
  network: any = {}
  approvalLevel: any = [];
  datanotfound: boolean = false;
  purchase_data: any = [];
  tabCount: any = {};
  active_tab: any = 'Pending';
  encrypt_id: any;
  assign_sales_user: any = [];
  profileUrl: any;
  activeAcc: any = {}


  constructor(public dialogs: MatDialog, public cryptoService: CryptoService, public toast: ToastrManager, public dialog: MatDialog, public ActivatedRoute: ActivatedRoute, public service: DatabaseService, public route: Router, public session: sessionStorage, public location: Location, public alert: DialogComponent, private progressService: ProgressService, private bottomSheet: MatBottomSheet) {
    this.page_limit = service.pageLimit;
    this.today_date = new Date();
    this.downurl = service.downloadUrl;
    this.url = this.service.uploadUrl + 'influencer_doc/';
    this.profileUrl = this.service.uploadUrl + 'influencer_doc/';
    this.login_data = this.session.getSession();
    this.login_data = this.login_data.value;
    this.login_data5 = this.login_data.data;
    this.ActivatedRoute.params.subscribe(params => {
      let id = params.id.replace(/_/g, '/');
      this.encrypt_id = params.id;
      this.id = this.cryptoService.decryptId(id);
      this.service.currentUserID = this.cryptoService.decryptId(id)
      this.network = params.network;
      this.type_id = params.type_id;
      if (id) {
        this.InfluencerDetail();
      }
    });
  }

  ngOnInit() {

  }

  ngAfterViewInit() {
  }
  InfluencerDetail() {
    this.skLoading = true;
    this.filter.status = this.tabType
    this.service.post_rqst({ 'id': this.id, 'filter': this.filter }, 'Influencer/influencerCustomerDetail').subscribe((result) => {
      if (result['statusCode'] == 200) {
        this.Influencer_Detail = result['result'];
        this.wallet_Detail = this.Influencer_Detail['influencer_data'];
        this.influencer_Logs_Detail = this.Influencer_Detail['logs'];
        this.approvalLevel = this.Influencer_Detail['approval_level_manage'];
        this.skLoading = false;
      }
      else {
        this.toast.errorToastr(result['statusMsg']);
      }
    })
  }



  checkinData: any = [];

  clearFilter() {
    if (this.start < 0) {
      this.start = 0;
    }
  }


  pervious(type) {
    this.start = this.start - this.page_limit;
    if (type == 'advanceGIft') {
      this.getGift();
    }
    else {

      if (this.wallet_history_type == 'ledger') {
        this.getLedger();
      }
      if (this.wallet_history_type == 'scan_history') {
        this.scan_history_data();
      }
      if (this.wallet_history_type == 'redeem_history') {
        this.redeem_history_data();
      }
      if (this.wallet_history_type == 'purchase_history') {
        this.getList();
      }
    }
  }
  nextPage(type) {


    this.start = this.start + this.page_limit;
    if (type == 'advanceGIft') {
      this.getGift();
    }
    else {

      if (this.wallet_history_type == 'ledger') {
        this.getLedger();
      }
      if (this.wallet_history_type == 'scan_history') {
        this.scan_history_data();
      }

      if (this.wallet_history_type == 'redeem_history') {
        this.redeem_history_data();
      }
      if (this.wallet_history_type == 'purchase_history') {
        this.getList();
      }
      // else {
      //   this.redeem_history_data();
      // }
    }
  }

  ledgerData: any = [];

  date_format(type): void {
    if (this.wallet_history_type == 'ledger') {
      if (this.filter.date_created) {
        this.filter.date_created = moment(this.filter.date_created).format('YYYY-MM-DD');
        this.getLedger();
      }
    } else {
      if (this.filter.date_created) {
        this.filter.date_created = moment(this.filter.date_created).format('YYYY-MM-DD');
        this.getList();
      }
      if (this.filter.invoice_date) {
        this.filter.invoice_date = moment(this.filter.invoice_date).format('YYYY-MM-DD');
        this.getList();
      }
    }

  }

  refresh() {
    if (this.start < 0) {
      this.start = 0;
    }
    this.filter = {};
    if (this.wallet_history_type == 'ledger') {
      this.getLedger();
    }
    if (this.wallet_history_type == 'scan_history') {
      this.scan_history_data();
    }

    if (this.wallet_history_type == 'redeem_history') {
      this.redeem_history_data();
    }
    if (this.wallet_history_type == 'purchase_history') {
      this.getList();
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
    this.filter.created_by = this.id;
    this.service.post_rqst({ 'filter': this.filter, 'status': this.active_tab, 'start': this.start, 'pagelimit': this.page_limit }, 'Purchase/purchaseList').subscribe((result) => {
      if (result['statusCode'] == 200) {
        this.skLoading = false;
        this.purchase_data = result['purchase'];
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


  getLedger() {
    this.filter.status = this.tabType;
    this.loader = true;
    if (this.pagenumber > this.total_page) {
      this.pagenumber = this.total_page;
      this.start = this.pageCount - this.page_limit;
    }
    if (this.start < 0) {
      this.start = 0;
    }
    this.service.post_rqst({ 'id': this.id, 'type': 'influencer', 'filter': this.filter, 'start': this.start, 'pagelimit': this.page_limit }, 'Influencer/influencerLedger').subscribe((result) => {
      if (result['statusCode'] == 200) {
        this.ledgerData = result['influencer_ledger'];
        this.loader = false;
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
        setTimeout(() => {
        }, 700)
      }
      else {
        this.toast.errorToastr(result['statusMsg']);
      }
    })
  }




  giftData: any = [];
  getGift() {
    this.checkinLoader = true;
    if (this.pagenumber > this.total_page) {
      this.pagenumber = this.total_page;
      this.start = this.pageCount - this.page_limit;
    }

    if (this.start < 0) {
      this.start = 0;
    }
    let payLoad = { "filter": this.filter, "id": this.id, 'start': this.start, 'pagelimit': this.page_limit }
    this.service.post_rqst(payLoad, "GiftGallery/manualGiftGalleryList").subscribe((result) => {
      if (result['statusCode'] == 200) {
        this.giftData = result['gift_master_manual_list'];
        this.checkinLoader = false;
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
        this.checkinLoader = false;
      }
      else {
        this.toast.errorToastr(result['statusMsg']);
      }
    });
  }


  redeemHistory: any = [];
  noResult: boolean = false;

  redeem_history_data() {
    if (this.pagenumber > this.total_page) {
      this.pagenumber = this.total_page;
      this.start = this.pageCount - this.page_limit;
    }
    if (this.start < 0) {
      this.start = 0;
    }
    this.loader = true;

    if (this.filter.date_created) {
      this.filter.date_created = moment(this.filter.date_created).format('YYYY-MM-DD');
    }
    this.filter.id = this.Influencer_Detail.id;
    this.service.post_rqst({ 'filter': this.filter, 'start': this.start, 'pagelimit': this.page_limit }, 'Influencer/redeemHistory').subscribe((result) => {

      if (result['statusCode'] == 200) {
        this.redeemHistory = result['result']
        this.pageCount = result['count'];
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
          if (this.redeemHistory.length == 0) {
            this.noResult = true;
          }
        }, 500);
      }
      else {
        this.toast.errorToastr(result['statusMsg']);
      }

    })
  }

  couponData: any = [];

  scan_history_data() {
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
    this.loader = true;
    this.filter.id = this.Influencer_Detail.id;
    this.service.post_rqst({ 'filter': this.filter, 'start': this.start, 'pagelimit': this.page_limit }, 'Influencer/scanHistory').subscribe((result) => {
      if (result['statusCode'] == 200) {
        this.couponData = result['result']
        this.pageCount = result['count'];
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
        this.toast.errorToastr(result['statusMsg']);
      }

    })
  }

  goToImage(image) {
    const dialogRef = this.dialogs.open(ImageModuleComponent, {
      width: '900px',
      panelClass: 'Image-modal',
      data: {
        'image': image,
        'type': 'base64'
      }
    });
    dialogRef.afterClosed().subscribe(result => {
    });

  }







  pie_chart() {
    this.pieChart = new Chart(this.pieCanvas.nativeElement, {
      type: "doughnut",
      data: {
        labels: ['Scan', 'Referral Incentive', 'Redeem'],
        datasets: [{
          label: '#',
          data: [this.wallet_Detail.scan_sum, this.wallet_Detail.referral_sum, this.wallet_Detail.redeem_sum],
          backgroundColor: [
            'rgba(131, 183, 53, 0.9)',
            'rgba(73, 212, 224, 0.9)',
            'rgba(255, 0, 0, 0.9)',
          ]
        }]
      }
    });
  }



  openDialog(type): void {
    const dialogRef = this.dialog.open(AdvanceAddGiftComponent, {
      width: '600px',
      panelClass: 'cs-modal',
      disableClose: true,
      data: {
        'id': this.Influencer_Detail.id,
        'name': this.Influencer_Detail.name,
        'type': type,
        'detail': this.Influencer_Detail
      }

    });

    dialogRef.afterClosed().subscribe(result => {
      if (result == true || result == undefined) {
        if (type == 'advance_gift') {
          this.getGift();
        }
        else {
          if (type == 'redeem_request') {
            this.InfluencerDetail();
          }
          this.getLedger();
        }
      }
    });
  }

  changeStatusDialog(id, status, type, referred_by, Name, influencer_type, welcome_bonus_flag, level): void {
    const dialogRef = this.dialog.open(RedeemStatusModalComponent, {
      width: '400px', data: {
        influence_status: status,
        id: id,
        delivery_from: type,
        referred_by_id: referred_by,
        name: Name,
        influencer_type: influencer_type,
        welcome_bonus_flag: welcome_bonus_flag,
        level: level
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result != false) {
        this.InfluencerDetail();
      }
    });
  }

  back(): void {
    this.location.back()
  }

  reset_status() {
    this.alert.confirm('Reset KYC status').then((res) => {
      if (res) {
        this.service.post_rqst({ 'id': this.id }, "Influencer/resetKyc").subscribe((result => {

          if (result['statusCode'] == 200) {
            this.InfluencerDetail();
            this.toast.successToastr('Status Changed Successfully');
          }
          else {
            this.toast.errorToastr(result['statusMsg']);
          }

        }))
      }
    })
  }

  update(id): void {

    // if (!this.Influencer_Detail.document_type || !this.Influencer_Detail.document_no || this.Influencer_Detail.document_image == '' || this.Influencer_Detail.document_image_back == '') {
    //   this.toast.errorToastr('Update document details first');
    //   return
    // }
    if (this.Influencer_Detail.user_redeemption_prefrence == 'Bank' && (this.login_data.organisation_data.redeemption_prefrence == 0 || this.login_data.organisation_data.redeemption_prefrence == 2)) {
      if (!this.Influencer_Detail.bank_name || !this.Influencer_Detail.account_no || !this.Influencer_Detail.ifsc_code || !this.Influencer_Detail.account_holder_name || this.Influencer_Detail.bank_img == '') {
        console.log('In Bank');
        this.toast.errorToastr('Update bank detail first');
        return
      }
    }
    console.log(this.login_data.organisation_data.redeemption_prefrence);
    if (this.Influencer_Detail.user_redeemption_prefrence == 'UPI' && (this.login_data.organisation_data.redeemption_prefrence == 1 || this.login_data.organisation_data.redeemption_prefrence == 2)) {
      if (!this.Influencer_Detail.upi_id) {
        console.log('In UPI');
        this.toast.errorToastr('Update UPI detail first');
        return
      }
    }


    const dialogRef = this.dialog.open(UpdateKycComponent, {
      width: '500px',
      panelClass: 'cs-modal',
      data: {
        'kyc_id': id,
        'kyc_type': 'influcencer'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result == true) {
        this.InfluencerDetail();
      }
    });
  }
  tab_type: any;
  downloadInChunks(tab_type) {
    console.log(tab_type);
    this.progressService.setCancelReq(false);
    this.tab_type = tab_type
    this.service.post_rqst({ 'filter': this.filter, 'start': this.start, 'pagelimit': this.page_limit }, "DownloadMaster/createQueueRequest").subscribe((result) => {
      if (result['statusCode'] == 200) {
        if (result['code'] == 0) {
          this.toast.errorToastr(result['statusMsg']);
          return;
        }

        if (result['code'] == 1) {
          this.downloadExcel2(tab_type);
          // console.log(tab_type);

        }
      }
    }, err => {
      this.loader = false;
    });
  }

  downloadExcel2(tab_type) {
    console.log(tab_type);
    let can
    this.progressService.getCancelReq().subscribe(cancelReq => {
      can = cancelReq
    })
    if (can == false) {
      console.log(can);
      this.downloader = true;
      if (this.download_percent == null) {
        this.download_percent = 0;
      }
      if (tab_type == 'ledger') {
        this.filter.id = this.id;
        this.service.post_rqst({ 'id': this.id, 'type': 'influencer', 'filter': this.filter, 'start': this.start, 'pagelimit': this.page_limit }, "DownloadMaster/downloadLedgerData").subscribe((result) => {
          if (result['code'] === 1) {
            this.downloader = false;
            this.download_percent = null;
            window.open(this.downurl + result['filename']);
            this.progressService.setTotalCount(0);
            this.progressService.setRemainingCount(0);
            this.progressService.setDownloadProgress(0);
            this.progressService.setDownloaderActive(false);
            this.getLedger();
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
            this.downloadExcel2(tab_type);
          }
        }, err => {
          this.loader = false;

        });
      }
      else if (tab_type == 'redeem_history') {
        this.filter.id = this.id;
        this.filter.status = 'All';
        this.service.post_rqst({ 'filter': this.filter, 'start': this.start, 'pagelimit': this.page_limit }, "DownloadMaster/downloadRedeemData").subscribe((result) => {
          if (result['code'] === 1) {
            this.downloader = false;
            this.download_percent = null;
            window.open(this.downurl + result['filename']);
            this.progressService.setTotalCount(0);
            this.progressService.setRemainingCount(0);
            this.progressService.setDownloadProgress(0);
            this.progressService.setDownloaderActive(false);
            this.redeem_history_data();
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
            this.downloadExcel2(tab_type);
          }
        }, err => {
          this.loader = false;

        });
      }
      else if (tab_type == 'scan_history') {
        this.filter.id = this.id;
        this.service.post_rqst({ 'filter': this.filter, 'start': this.start, 'pagelimit': this.page_limit }, "DownloadMaster/downloadCouponCodeScanData").subscribe((result) => {
          if (result['code'] === 1) {
            this.downloader = false;
            this.download_percent = null;
            window.open(this.downurl + result['filename']);
            this.progressService.setTotalCount(0);
            this.progressService.setRemainingCount(0);
            this.progressService.setDownloadProgress(0);
            this.progressService.setDownloaderActive(false);
            this.scan_history_data();
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
            this.downloadExcel2(tab_type);
          }
        }, err => {
          this.loader = false;

        });
      }

    }
  }

  openBottomSheet(filterType): void {
    this.bottomSheet.open(BottomSheetComponent, {
      data: {
        'filterPage': 'distribution_list',
      }
    });
    this.bottomSheet._openedBottomSheetRef.afterDismissed().subscribe((data) => {
      this.filter.date_from = data.date_from;
      this.filter.date_to = data.date_to;
      // this.search.userId = data.user_id;
      if (filterType == 'ledger_filter') {
        this.getLedger();
      }
      else if (filterType == 'scan_history_filter') {
        this.scan_history_data();
      }
    })
  }


  openDialog2(row): void {
    const dialogRef = this.dialogs.open(StatusModalComponent, {
      width: '500px',
      panelClass: 'cs-modal',
      disableClose: true,
      data: {
        delivery_from: 'purchase',
        modalData: row
      }

    });

    dialogRef.afterClosed().subscribe(result => {

    });
  }

  

}
