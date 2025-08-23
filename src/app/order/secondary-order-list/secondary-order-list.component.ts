import { Component, Input, OnInit } from '@angular/core';
import { DatabaseService } from 'src/_services/DatabaseService';
import { Router, ActivatedRoute } from '@angular/router';
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
  selector: 'app-secondary-order-list',
  templateUrl: './secondary-order-list.component.html',
  styleUrls: ['./secondary-order-list.component.scss']
})
export class SecondaryOrderListComponent implements OnInit {

  active_tab: any = 'Pending';
  tabStatus: any = 'all';
  orderlist: any = [];
  tmp_orderlist: any = [];
  count: any ={};
  fabBtnValue: any = 'add';
  total_page: any;
  loader: any;
  tmp_list: any = [];
  data: any = [];
  value: any = {};
  search_val: any = {}
  datanotfound: any = false;
  login_data: any = [];
  login_dr_id: any;
  skelton: any = {};
  secorder_list: any;
  today_date: Date;
  searchData: any;
  backButton: boolean = false;
  sr_no: any = 0;
  pageCount: any;
  page_limit: any = 100;
  pagenumber: any = 1;
  start: any = 0;
  date: any;
  currentMonth_no: any;
  currentYear: any;
  currentMonth: any;
  monthNames: string[];
  totalData: any = {};
  OrderMonth: any;
  OrderYear: any;
  downurl: any = '';
  routesValue: any = {};
  @Input() dataToReceive: any;
  padding0: any;
  hide: any;
  site_detail: any;
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
  minDate: any;


  constructor(public service: DatabaseService, public cryptoService:CryptoService, public location: Location, public navparams: ActivatedRoute, private bottomSheet: MatBottomSheet,
    public route: Router, public dialog: DialogComponent, public session: sessionStorage, public toast: ToastrManager,private progressService: ProgressService) {
    this.downurl = service.downloadUrl;
    this.today_date = new Date();
    this.login_data = this.session.getSession();
    this.login_data = this.login_data.value.data;
    console.log(this.login_data);
    
    this.skelton = new Array(10);
    this.page_limit = service.pageLimit
    this.searchData = (this.navparams['params']['_value']);
    this.date = new Date();
    this.monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec'];
    this.currentMonth = this.monthNames[this.date.getMonth()];
    this.currentYear = this.date.getFullYear();
    this.currentMonth_no = this.date.getMonth() + 1;
    this.minDate = moment().subtract(180, 'days').format('YYYY-MM-DD');
  }

  // ngOnInit() {
  //   this.search_val = this.service.getData()
  //   if (this.search_val.order_status) {
  //     this.active_tab = this.search_val.order_status
  //     this.currentMonth_no = this.search_val.month
  //     this.currentYear = this.search_val.year
  //   }
  //   if (this.searchData.selectedUser && this.searchData.selectedDate && this.searchData.from == 'attendence') {
  //     this.backButton = true;
  //     this.search_val.created_by = this.searchData.selectedUser;
  //     this.search_val.date_created = this.searchData.selectedDate;
  //   }

  //   else if (this.searchData.selectedUser && this.searchData.selectedDate && this.searchData.company_name && this.searchData.from == 'checkin') {
  //     this.backButton = true;
  //     this.search_val.created_by = this.searchData.selectedUser;
  //     this.search_val.date_created = this.searchData.selectedDate;
  //     this.search_val.company_name = this.searchData.company_name;
  //     this.orderList('', this.currentMonth_no, this.currentYear);

  //   }
  //   else {
  //     if (this.login_data.access_level != '1') {
  //       this.login_dr_id = this.login_data.id;
  //     }

  //   }
  //   this.orderList('', this.currentMonth_no, this.currentYear);

  // }
  ngOnInit() {


    if (this.dataToReceive != undefined) {
      console.log(this.dataToReceive, 'this.dataToReceive');
      this.padding0 = this.dataToReceive.padding0;
      this.hide = this.dataToReceive.hide;
      this.site_detail = this.dataToReceive;
      let routes = { 'orderType': this.dataToReceive.routes }
      this.routesValue = routes;
      this.orderList('', this.currentMonth_no, this.currentYear);
    }
    else {

      console.log('test');


      this.searchData = (this.navparams['params']['_value']);
      this.navparams.params.subscribe(params => {
        this.routesValue = this.navparams.queryParams['_value'];
        this.orderList('', this.currentMonth_no, this.currentYear);
      });

      this.search_val = this.service.getData()
      if (this.search_val.order_status) {
        this.active_tab = this.search_val.order_status
        this.currentMonth_no = this.search_val.month
        this.currentYear = this.search_val.year
      }
      if (this.searchData.selectedUser && this.searchData.selectedDate && this.searchData.from == 'attendence') {
        this.backButton = true;
        this.search_val.created_by = this.searchData.selectedUser;
        this.search_val.date_created = this.searchData.selectedDate;
      }

      else if (this.searchData.selectedUser && this.searchData.selectedDate && this.searchData.company_name && this.searchData.from == 'checkin') {
        this.backButton = true;
        this.search_val.created_by = this.searchData.selectedUser;
        this.search_val.date_created = this.searchData.selectedDate;
        this.search_val.company_name = this.searchData.company_name;
        this.orderList('', this.currentMonth_no, this.currentYear);

      }
      else {
        if (this.login_data.access_level != '1') {
          this.login_dr_id = this.login_data.id;
        }

      }


    }


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
    this.loader = 1;
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
    this.search_val.year = this.OrderYear
    this.search_val.month = this.OrderMonth;
    this.encryptedData = this.service.payLoad ? { 'start': this.start, 'pagelimit': this.page_limit, 'search': this.search_val, 'login_user': this.login_dr_id, 'month': month, 'year': year }: this.cryptoService.encryptData({ 'start': this.start, 'pagelimit': this.page_limit, 'search': this.search_val, 'login_user': this.login_dr_id, 'month': month, 'year': year });
    this.service.post_rqst(this.encryptedData, "Order/secondaryOrderList")
      .subscribe((result => {
     this.decryptedData = this.service.payLoad ? result : this.cryptoService.decryptData(JSON.stringify(result));
        if (this.decryptedData['statusCode'] == 200) {
          this.tmp_orderlist = this.decryptedData['result'];
          this.tmp_orderlist.forEach(item => item['encrypt_id'] = this.cryptoService.encryptId(item['id'].toString()));
          this.calenderInfo = this.decryptedData['calenderInfo'];
          this.totalData = this.decryptedData['total'];
          this.count = this.decryptedData['count'];
          this.filter_order_data(this.tabStatus);
          for (let index = 0; index < this.calenderInfo.length; index++) {
            const date = new Date();
            date.setMonth(this.calenderInfo[index].month - 1);
            let MonthName = ''
            MonthName = date.toLocaleString('en-US', { month: 'short' })
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
            this.pageCount = this.count.Draft;
            this.total_page = Math.ceil(this.pageCount / this.page_limit);
          }
          else if (this.active_tab == 'Partially') {
            this.pageCount = this.count.Partial_Dispact;
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



          setTimeout(() => {
            this.loader = '';

          }, 700);
          if (this.tmp_orderlist.length == 0) {
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

  filter_order_data(status) {
    this.tabStatus = status;
    if (status == 'Partial Dispatch') {
      this.orderlist = this.tmp_orderlist;
      this.secorder_list = this.orderlist.filter(row => row.order_status == 'Partial Dispatch');
      this.orderlist = this.secorder_list;
    }
    if (status == 'Dispatch') {
      this.orderlist = this.tmp_orderlist;
      this.secorder_list = this.orderlist.filter(row => row.order_status == 'Dispatch');
      this.orderlist = this.secorder_list;
    }
    else if (this.active_tab == 'Pending') {
      this.orderlist = this.tmp_orderlist;
      this.secorder_list = this.orderlist.filter(row => row.order_status == 'Pending');
      this.orderlist = this.secorder_list;

    }

    else if (status == 'all') {
      this.orderlist = this.tmp_orderlist;
    }

    else if (status == 'Modified') {

      this.orderlist = this.tmp_orderlist;
      this.secorder_list = this.orderlist.filter(row => row.flag == '1');
      this.orderlist = this.secorder_list;


    }
  }

  refresh(blank, month, year) {
    this.search_val = {}
    this.service.setData(this.search_val)
    this.service.currentUserID = ''
    this.orderList(blank, month, year);
  }


  lastBtnValue(value) {
    this.fabBtnValue = value;
  }
  exp_loader: any = false;

  public onDate(event, month, year): void {
    this.search_val.date_created = moment(event.value).format('YYYY-MM-DD');
    this.orderList('', month, year);
  }

  back(): void {

    this.location.back()
  }


  goTODetail(id, status) {
    this.route.navigate(['/secondary-order-detail/' + id], { queryParams: { id, status } });
  }


  exportAsXLSX(month, year) {
    this.loader = true;
    this.encryptedData = this.service.payLoad ? { 'start': this.start, 'pagelimit': this.page_limit, 'search': this.search_val, 'login_user': this.login_dr_id, 'month': month, 'year': year }: this.cryptoService.encryptData({ 'start': this.start, 'pagelimit': this.page_limit, 'search': this.search_val, 'login_user': this.login_dr_id, 'month': month, 'year': year });

    this.service.post_rqst(this.encryptedData, "Excel/secondary_order_list")
      .subscribe((result => {
        this.decryptedData = this.service.payLoad ? result : this.cryptoService.decryptData(JSON.stringify(result));
        if (this.decryptedData['msg'] == true) {
          this.loader = false;
          window.open(this.downurl + this.decryptedData['filename'])
          this.orderList('', this.OrderMonth, this.OrderYear);
        } else {
          this.loader = false;
        }
      }));
  }

  openBottomSheet(): void {
    this.bottomSheet.open(BottomSheetComponent, {
      data: {
        'filterPage': 'secondaryOrderList',
      }
    });
    this.bottomSheet._openedBottomSheetRef.afterDismissed().subscribe((data) => {
      console.log(data);
      this.search_val.date_from = data.date_from;
      this.search_val.date_to = data.date_to;
      this.search_val.userId = data.user_id;
      this.orderList('', this.OrderMonth, this.OrderYear);
    })
  }

  sortData() {
    this.tmp_orderlist.reverse();
  }

  delete(id) {
    this.dialog.delete("Orders ?").then((result) => {
      if (result) {
        this.encryptedData = this.service.payLoad ? { "id": [id] }: this.cryptoService.encryptData({ "id": [id] });
        this.service.post_rqst(this.encryptedData, "Order/deleteSecondaryOrder").subscribe((result => {
          this.decryptedData = this.service.payLoad ? result : this.cryptoService.decryptData(JSON.stringify(result));
          if (this.decryptedData['statusCode'] == 200) {
            this.toast.successToastr(this.decryptedData['statusMsg']);
            this.orderList('', this.currentMonth_no, this.currentYear)

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
      this.loader = false;
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
      this.service.post_rqst(this.encryptedData, "DownloadMaster/downloadSecondaryOrderData").subscribe((result) => {
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
        this.loader = false;

      });
    }
  }

}



