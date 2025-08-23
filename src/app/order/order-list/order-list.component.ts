import { Component, OnInit } from '@angular/core';
import { slideToTop } from '../../router-animation/router-animation.component';
import { DatabaseService } from 'src/_services/DatabaseService';
import { ActivatedRoute, Router } from '@angular/router';
import { DialogComponent } from 'src/app/dialog.component';
import { sessionStorage } from 'src/app/localstorage.service';
import * as moment from 'moment';
import { Location } from '@angular/common'
import { ToastrManager } from 'ng6-toastr-notifications';
import { BottomSheetComponent } from 'src/app/bottom-sheet/bottom-sheet.component';
import { MatBottomSheet } from '@angular/material';
import { CryptoService } from 'src/_services/CryptoService';
import { ProgressService } from 'src/app/progress.service';
@Component({
  selector: 'app-order-list',
  templateUrl: './order-list.component.html',
  animations: [slideToTop()]

})
export class OrderListComponent implements OnInit {
  view_tab: any = 'all';
  value: any = {};
  tabStatus: any = 'all';
  fabBtnValue: any = 'add';
  active_tab: any = 'Pending';
  orderlist: any = [];
  excelLoader: boolean = false;
  count: any ={};
  total_page: any;
  loader: any;
  tmp_list: any = [];
  tmp_orderlist: any = [];
  data: any = [];
  search_val: any = {};
  datanotfound: any = false;
  login_data: any = [];
  login_dr_id: any;
  skelton: any = {};
  today_date: Date;
  searchData: any;
  backButton: boolean = false;
  count_list: any = [];
  sr_no: any = 0;
  pageCount: any;
  page_limit: any = 100;
  pagenumber: any = '';
  start: any = 0;
  type: any;
  type_id: any;
  currentMonth: any;
  monthNames: string[];
  currentMonth_no: any;
  totalData: any = {};
  currentYear: any;
  date: any;
  minDate: any;
  OrderMonth: any;
  OrderYear: any;
  downurl: any = '';
  encryptedData: any;
  decryptedData:any;
  downloader: any = false;
  download_percent: any;
  downValue: any;
  downType: any;
  downTypeId: any;
  downFilter: any;
  totalDownloadCount: any;
  remainingDownloadCount: any;
  totalCount: any;
  remainingCount: any;
  month:any='';
  year:any='';

  constructor(public service: DatabaseService,
    public location: Location,
    public navparams: ActivatedRoute,
    public route: Router,
    public dialog: DialogComponent,
    public session: sessionStorage,
    public cryptoService:CryptoService, 
    public toast: ToastrManager,
    public bottomSheet: MatBottomSheet,
    private progressService: ProgressService
  ) {
    this.downurl = service.downloadUrl;
    this.page_limit = service.pageLimit
    this.today_date = new Date();
    this.login_data = this.session.getSession();
    this.login_data = this.login_data.value.data;
    this.skelton = new Array(10);
    this.date = new Date();
    this.monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec'];
    this.currentMonth = this.monthNames[this.date.getMonth()];
    this.currentYear = this.date.getFullYear();
    this.currentMonth_no = this.date.getMonth() + 1;
    this.minDate = moment().subtract(180, 'days').format('YYYY-MM-DD');
    console.log(this.minDate);
    
    if (this.login_data.access_level != '1') {
      this.login_dr_id = this.login_data.id;
    }
  }

  ngOnInit() {
    this.search_val = this.service.getData()
    if (this.search_val.order_status) {
      this.active_tab = this.search_val.order_status
      this.currentMonth_no = this.search_val.month
      this.currentYear = this.search_val.year
    }
    this.searchData = (this.navparams['params']['_value']);
    this.navparams.params.subscribe(params => {
      this.type_id = params.id;
      this.type = params.type;
      this.orderList('', this.currentMonth_no, this.currentYear);
    });
  }
  public onDate(event): void {
    this.search_val.date_created = moment(event.value).format('YYYY-MM-DD');
    this.orderList('', this.OrderMonth, this.OrderYear);
  }




  inputValue(value) {
    if (value > this.total_page) {
      this.start = this.total_page;
    }
    else if (value == '' || value <= 0) {
      this.start = 0;
    }
    else {
      this.start = (this.pagenumber * this.page_limit) - this.page_limit;
    }

    this.orderList('', this.currentMonth_no, this.currentYear)
  }

  pervious(blank, month, year) {
    this.start = this.start - this.page_limit;
    this.orderList(blank, month, year);
  }

  nextPage(blank, month, year) {
    this.start = this.start + this.page_limit;
    this.orderList(blank, month, year);
  }
  calenderInfo: any = []
  orderList(action: any = '', month, year) {
    if (action == "refresh") {
      this.search_val = {};
      this.orderlist = [];
      this.start = 0;
    }
    if (this.pagenumber > this.total_page) {
      this.pagenumber = this.total_page;
      this.start = this.pageCount - this.page_limit;
    }
    if (this.start < 0) {
      this.start = 0;
    }
    this.OrderMonth = month;
    this.OrderYear = year;
    this.search_val.order_status = this.active_tab
    this.search_val.month = this.OrderMonth
    this.search_val.year = this.OrderYear
    this.loader = 1;
    this.encryptedData = this.service.payLoad ? { 'start': this.start, 'pagelimit': this.page_limit, 'search': this.search_val, 'login_user': this.login_dr_id, 'month': month, 'year': year }: this.cryptoService.encryptData({ 'start': this.start, 'pagelimit': this.page_limit, 'search': this.search_val, 'login_user': this.login_dr_id, 'month': month, 'year': year });
    this.service.post_rqst(this.encryptedData, "Order/primaryOrderList")
      .subscribe((result => {
        this.decryptedData = this.service.payLoad ? result : this.cryptoService.decryptData(JSON.stringify(result));
        if (this.decryptedData['statusCode'] == 200) {
          this.count = this.decryptedData['count'];
          this.tmp_orderlist = this.decryptedData['result'];
          this.tmp_orderlist.forEach(item => item['encrypt_id'] = this.cryptoService.encryptId(item['id']));
          this.calenderInfo = this.decryptedData['calenderInfo'];
          this.totalData = this.decryptedData['total'];
          setTimeout(() => {
            this.loader = '';
          }, 700);
          this.filter_order_data(this.tabStatus);
          for (let index = 0; index < this.calenderInfo.length; index++) {
            const date = new Date();
            date.setMonth(this.calenderInfo[index].month - 1);
            let MonthName = ''
            MonthName = date.toLocaleString('en-US', { month: 'short' });
            this.calenderInfo[index].month_name = MonthName
          }


          if (this.active_tab == 'All') {
            this.pageCount = this.count.all;
            this.total_page = Math.ceil(this.pageCount / this.page_limit);

          }

          else if (this.active_tab == 'Pending') {
            this.pageCount = this.count.Pending;
            this.total_page = Math.ceil(this.pageCount / this.page_limit);

          }
          else if (this.active_tab == 'Approved') {
            this.pageCount = this.count.Approved;
            this.total_page = Math.ceil(this.pageCount / this.page_limit);

          }
          else if (this.active_tab == 'Reject') {
            this.pageCount = this.count.Reject;
            this.total_page = Math.ceil(this.pageCount / this.page_limit);

          }
          else if (this.active_tab == 'Hold') {
            this.pageCount = this.count.Hold;
            this.total_page = Math.ceil(this.pageCount / this.page_limit);
          }
          else if (this.active_tab == 'dispatchPlanning') {
            this.pageCount = this.count.dispatchPlanning;
            this.total_page = Math.ceil(this.pageCount / this.page_limit);
          }
          else if (this.active_tab == 'partialDispatched') {
            this.pageCount = this.count.partialDispatched;
            this.total_page = Math.ceil(this.pageCount / this.page_limit);
          }
          else if (this.active_tab == 'Dispatched') {
            this.pageCount = this.count.Dispatched;
            this.total_page = Math.ceil(this.pageCount / this.page_limit);
          }
          else if (this.active_tab == 'orderPartial') {
            this.pageCount = this.count.orderPartial;
            this.total_page = Math.ceil(this.pageCount / this.page_limit);
          }
          else if (this.active_tab == 'completeDispatched') {
            this.pageCount = this.count.completeDispatched;
            this.total_page = Math.ceil(this.pageCount / this.page_limit);
          }
          else {
            this.pageCount = this.count.Dispact;
            this.total_page = Math.ceil(this.pageCount / this.page_limit);
          }
          if (this.pagenumber > this.total_page) {
            this.pagenumber = this.total_page;
            this.start = this.pageCount - this.page_limit;
          }
          else {
            this.pagenumber = Math.ceil(this.start / this.page_limit) + 1;
          }
          this.sr_no = this.pagenumber - 1;
          this.sr_no = this.sr_no * this.page_limit;

          if (this.orderlist.length == 0) {
            this.datanotfound = true;
          } else {
            this.datanotfound = false;
          }
        } else {
          setTimeout(() => {
            this.loader = '';
          }, 700);
          this.toast.errorToastr(this.decryptedData['statusMsg'])
        }
      }))
    this.service.count_list();

  }
  refresh(blank, month, year) {
    this.search_val = {}
    this.service.setData(this.search_val)
    this.service.currentUserID = ''
    this.orderList(blank, month, year);
  }
  detailOrder(id) {
    this.service.orderFilterPrimary = this.search_val;
    this.route.navigate(['/order-detail/' + id]);
  }

  tmpsearch: any = {};
  tmpsearch1: any = {};
  filter_order_data(status) {
    this.tabStatus = status;
    this.view_tab = status;
    if (status != 'all') {
      this.orderlist = [];
      for (var i = 0; i < this.tmp_orderlist.length; i++) {

        this.tmpsearch = this.tmp_orderlist[i]['order_status'];
        if (this.tmpsearch.includes(status)) {


          this.orderlist.push(this.tmp_orderlist[i]);
        }
      }

    } else if (status == 'all') {
      this.orderlist = this.tmp_orderlist;
    }
  }


  back(): void {
    this.location.back()
  }

  lastBtnValue(value) {
    this.fabBtnValue = value;
  }


  goTODetail(id, status) {
    this.route.navigate(['/order-detail/' + id], { queryParams: { id, status } });
  }
  exportAsXLSX(month, year) {
    this.loader = true;
    this.encryptedData = this.service.payLoad ? { 'start': this.start, 'pagelimit': this.page_limit, 'search': this.search_val, 'login_user': this.login_dr_id, 'month': month, 'year': year }: this.cryptoService.encryptData({ 'start': this.start, 'pagelimit': this.page_limit, 'search': this.search_val, 'login_user': this.login_dr_id, 'month': month, 'year': year });
    if (this.active_tab == 'dispatchPlanning') {
    this.service.post_rqst(this.encryptedData, "Excel/downladOrderCsv").subscribe((result) => {
    this.decryptedData = this.service.payLoad ? result : this.cryptoService.decryptData(JSON.stringify(result));
        if (this.decryptedData['msg'] == true) {
          this.loader = false;
          window.open(this.downurl + this.decryptedData['filename'])
          this.orderList('', this.OrderMonth, this.OrderYear);
        } else {
          this.loader = false;
        }
      }, err => {
        this.loader = false;

      });
    }
    else {
      this.service.post_rqst(this.encryptedData, "Excel/primary_order_list")
        .subscribe((result) => {
    this.decryptedData = this.service.payLoad ? result : this.cryptoService.decryptData(JSON.stringify(result));

          if ( this.decryptedData['msg'] == true) {
            this.loader = false;
            window.open(this.downurl +  this.decryptedData['filename'])
            this.orderList('', this.OrderMonth, this.OrderYear);
          } else {
            this.loader = false;
          }
        }, err => {
          this.loader = false;

        });
    }
  }

  openBottomSheet(): void {
    this.bottomSheet.open(BottomSheetComponent, {
      data: {
        'filterPage': 'site_order_list',
      }
    });
    this.bottomSheet._openedBottomSheetRef.afterDismissed().subscribe((data) => {
      if(data){
        this.search_val.date_from = data.date_from;
        this.search_val.date_to = data.date_to;
        this.search_val.userId = data.user_id;
        this.orderList('', this.OrderMonth, this.OrderYear);
      }
    })
  }
  sortData() {
    this.tmp_orderlist.reverse();
  }

  delete(action: any = '', id) {
    if (action == 'deleteAll') {

    }
    this.dialog.delete("Orders ?").then((res) => {
      if (res) {
        this.encryptedData = this.service.payLoad ? { "id": [id] }: this.cryptoService.encryptData({ "id": [id] });
        this.service.post_rqst(this.encryptedData, "Order/deletePrimaryOrder").subscribe((result => {
          this.decryptedData = this.service.payLoad ? result : this.cryptoService.decryptData(JSON.stringify(result));
          if (this.decryptedData['statusCode'] == 200) {
            this.toast.successToastr(this.decryptedData['statusMsg']);
            this.orderList('', this.currentMonth_no, this.currentYear);
          }
          else {
            this.toast.errorToastr(this.decryptedData['statusMsg']);
          }
        }));
      }
    })

  }
  
  downloadInChunks(month, year) {
    this.month = month
    this.year = year
    this.encryptedData = this.service.payLoad ? { 'start': this.start, 'pagelimit': this.page_limit, 'search': this.search_val, 'login_user': this.login_dr_id, 'month': month, 'year': year }: this.cryptoService.encryptData({ 'start': this.start, 'pagelimit': this.page_limit, 'search': this.search_val, 'login_user': this.login_dr_id, 'month': month, 'year': year });
    this.service.post_rqst(this.encryptedData, "DownloadMaster/createQueueRequest").subscribe((result) => {
      this.decryptedData = this.service.payLoad ? result : this.cryptoService.decryptData(JSON.stringify(result));
      if(this.decryptedData['statusCode'] == 200){
          if(this.decryptedData['code']== 0){
            this.toast.errorToastr(this.decryptedData['statusMsg']);
            return;
          }

          if(this.decryptedData['code']== 1 ){
            this.downloadExcel2(this.month,this.year);
          }
      }
    }, err => {
      this.excelLoader = false;
    });
  }

  downloadExcel2(month, year) {
    let can
    this.progressService.getCancelReq().subscribe(cancelReq => {
      can = cancelReq
    })
    if (can == false) {
      this.downloader = true;
      if (this.download_percent == null) {
        this.download_percent = 0;
      }
      this.encryptedData = this.service.payLoad ? { 'start': this.start, 'pagelimit': this.page_limit, 'search': this.search_val, 'login_user': this.login_dr_id, 'month': month, 'year': year }: this.cryptoService.encryptData({ 'start': this.start, 'pagelimit': this.page_limit, 'search': this.search_val, 'login_user': this.login_dr_id, 'month': month, 'year': year });
      this.service.post_rqst(this.encryptedData, "DownloadMaster/downloadPrimaryOrderData").subscribe((result) => {
        this.decryptedData = this.service.payLoad ? result : this.cryptoService.decryptData(JSON.stringify(result));
        if (this.decryptedData['code'] === 1) {
          this.downloader = false;
          this.download_percent = null;
          window.open(this.downurl + this.decryptedData['filename']);
          this.progressService.setTotalCount(0);
          this.progressService.setRemainingCount(0);
          this.progressService.setDownloadProgress(0);
          this.progressService.setDownloaderActive(false);
          this.orderList('',this.OrderMonth,this.OrderYear);
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
          this.downloadExcel2(month, year);
        }
      }, err => {
        this.excelLoader = false;

      });
    }
  }
}
