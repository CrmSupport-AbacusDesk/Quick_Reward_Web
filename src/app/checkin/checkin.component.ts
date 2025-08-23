import { Component, OnInit, Input } from '@angular/core';
import { DatabaseService } from 'src/_services/DatabaseService'
import { ActivatedRoute, Router } from '@angular/router';
import { __values } from 'tslib';
import { MatBottomSheet, MatDialog } from '@angular/material';
import { Location } from '@angular/common';
import { sessionStorage } from '../localstorage.service';
import { CheckinViewComponent } from '../checkin-view/checkin-view.component';
import { ToastrManager } from 'ng6-toastr-notifications';
import { CheckindocumentComponent } from '../checkindocument/checkindocument.component';
import { BottomSheetComponent } from '../bottom-sheet/bottom-sheet.component';
import * as moment from 'moment';
import { CryptoService } from 'src/_services/CryptoService';
import { ProgressService } from '../progress.service';


@Component({
  selector: 'app-checkin',
  templateUrl: './checkin.component.html',
  styleUrls: ['./checkin.component.scss']
})
export class CheckinComponent implements OnInit {
  start_attend_time: string;
  loader: boolean = false;
  datanotfound = false;
  data: any = {};
  checkins: any = [];
  checkins_count: any = {};
  attendanceDate: any = [];
  show_today: boolean = true;
  assign_login_data2: any = [];
  assign_login_data: any = [];
  skelton: any = {};
  today_date = new Date().toISOString().slice(0, 10);
  searchData: any;
  backButton: boolean = false;
  districtAppend: String;
  report_manager: any = [];
  pageCount: any;
  total_page: any;
  page_limit: any = 10;
  pagenumber: any = 1;
  start: any = 0;
  downurl: any = ''
  sr_no: number;
  rsm2: any = []
  hod: any = []
  downloader: any = false;
  download_percent: any;
  type: any;
  func_name: any;
  excelLoader: boolean = false;
  totalCount: any;
  remainingCount: any;
  totalCheckinTime: any = {};
  gotoPageNumber: any

  @Input() dataToReceive: any;
  padding0: any;
  hide: any;
  filterDateWise: any;


  constructor(public service: DatabaseService, public cryptoService: CryptoService, public navparams: ActivatedRoute, public location: Location, public route: Router,
    public dialog2: MatDialog, public session: sessionStorage, public toast: ToastrManager, public bottomSheet: MatBottomSheet, private progressService: ProgressService) {
    this.downurl = service.downloadUrl;
    // this.page_limit = service.pageLimit;
    this.assign_login_data = this.session.getSession();
    this.assign_login_data = this.assign_login_data.value;
    this.assign_login_data2 = this.assign_login_data.data;

    this.getReportManager('');

    this.getNetworkType();
  }

  ngOnInit() {


    if (this.dataToReceive != undefined) {
      this.padding0 = this.dataToReceive.padding0;
      this.hide = this.dataToReceive.hide;
      this.data.employee_id = this.dataToReceive.employee_id;
      this.data.sales_user_id = this.dataToReceive.user_id;
      this.filterDateWise = this.dataToReceive.filterTab;
      if (this.filterDateWise == 'dateWise') {
        this.CheckinList('todayCheckinList', 1);
      } else {
        this.CheckinList('checkinAll', 2);
      }
    }
    else {
      this.data = this.service.getData();

      this.searchData = (this.navparams['params']['_value']);
      if (this.searchData.selectedUser && this.searchData.selectedDate) {
        this.backButton = true;
        if (this.searchData.selectedDate == this.today_date) {
          this.checkins = [];
          // this.data = {};
          this.data.user_name = this.searchData.selectedUser;
          this.CheckinList('todayCheckinList', 1);
        }
        else {
          this.checkins = [];
          this.data.user_name = this.searchData.selectedUser;
          this.data.date_created = this.searchData.selectedDate;
          this.CheckinList('get_all_checkin_new', 2);
        }
      }

      if (!this.searchData.selectedUser) {
        this.CheckinList('todayCheckinList', 1);
      }
    }

  }

  pervious(type) {
    this.start = this.start - this.page_limit;
    if (type == 'todayCheckinList') {
      this.CheckinList('todayCheckinList', 1);
    }
    else {
      this.CheckinList('checkinAll', 1);
    }
  }

  nextPage(type) {
    this.start = this.start + this.page_limit;
    if (type == 'todayCheckinList') {
      this.CheckinList('todayCheckinList', 1);
    }
    else {
      this.CheckinList('checkinAll', 1);
    }
  }

  getReportManager(search, type: any = '') {
    this.service.post_rqst({ 'search': search }, "Checkin/getSalesUserForReporting").subscribe((result => {
      if (result['statusCode'] == 200) {
        if (type == 'hod') {
          this.hod = result['all_sales_user'];
        }
        else if (type == 'rsm1') {
          this.report_manager = result['all_sales_user'];
        }
        else if (type == 'rsm2') {
          this.rsm2 = result['all_sales_user'];
        } else {
          this.hod = result['all_sales_user'];
          this.report_manager = result['all_sales_user'];
          this.rsm2 = result['all_sales_user'];
        }
      }
      else {
        this.toast.errorToastr(result['statusMsg'])
      }
    }));
  }
  refresh(func_name, type,) {
    this.start = 0;
    this.data = {};
    this.CheckinList(func_name, type)
  }

  networkType: any = [];
  getNetworkType() {
    this.service.post_rqst({ 'type': 'checkin' }, "Checkin/allNetworkModule").subscribe((result => {
      if (result['statusCode'] == 200) {
        this.networkType = result['modules'];
      }
      else {
        this.toast.errorToastr(result['statusMsg'])
      }
    }))
  }


  CheckinList(func_name, type) {

    this.loader = true;
    if (this.pagenumber > this.total_page) {
      this.pagenumber = this.total_page;
      this.start = this.pageCount - this.page_limit;
    }
    if (this.start < 0) {
      this.start = 0;
    }
    this.service.post_rqst({ 'user_id': this.assign_login_data2.id, 'start': this.start, 'pagelimit': this.page_limit, 'search': this.data, 'user_type': this.assign_login_data2.type }, "Checkin/" + func_name)
      .subscribe(((result: any) => {
        if (result['statusCode'] == 200) {
          this.loader = false;
          if (func_name == 'checkinAll') {
            this.checkins_count = result['result'];
            this.checkins = (result['result']['checkin_data']);
            this.pageCount = result['count'];
            this.attendanceDate = result['result']['header_date'];
            this.show_today = false;
          }
          else {
            this.show_today = true;
            this.checkins = (result['result']);
            this.checkins.forEach(item => item['encrypt_id'] = this.cryptoService.encryptId(item['id']));
            this.totalCheckinTime = result['total_time'];
            this.pageCount = result['count'];
          }
          for (let i = 0; i < this.checkins.length; i++) {
            this.checkins[i].order_grand_total = parseFloat(this.checkins[i].order_grand_total)
            this.checkins[i].order_grand_total = this.checkins[i].order_grand_total.toFixed(2)
            if (this.checkins[i].order_grand_total == "NaN") {
              this.checkins[i].order_grand_total = 0;
            }
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
          this.gotoPageNumber = this.pagenumber;
          if (this.checkins.length == 0) {
            this.datanotfound = true;
          } else {
            this.datanotfound = false;
          }
          setTimeout(() => {
            this.loader = false;

          }, 100);
        } else {
          this.loader = false;
          this.toast.errorToastr(result['statusMsg'])
        }
      }))
  }

  opendoc(list) {

    const dialogRef = this.dialog2.open(CheckindocumentComponent, {
      width: '768px',
      data: {
        list
      }
    });
    dialogRef.afterClosed().subscribe(result => {

    });

  }
  change_tab(fn_name, type) {
    this.checkins = [];
    this.data = {};
    this.CheckinList(fn_name, type);
  }

  // exportAsXLSX(func_name, type) {
  //   this.loader = true
  //   this.encryptedData = this.service.payLoad ? { 'user_id': this.assign_login_data2.id, 'search': this.data, 'user_type': this.assign_login_data2.type }: this.cryptoService.encryptData({ 'user_id': this.assign_login_data2.id, 'search': this.data, 'user_type': this.assign_login_data2.type });
  //   this.service.post_rqst(this.encryptedData, "Excel/" + func_name)
  //     .subscribe(((result: any) => {

  //       if (result['msg'] == true) {
  //         this.loader = false;
  //         window.open(this.downurl + result['filename'])
  //         this.CheckinList(func_name, type);
  //       } else {
  //         this.loader = false;
  //       }
  //     }), err => {
  //       this.loader = false;
  //     });

  // }


  checkinDetail(user_id, date) {
    const dialogRef = this.dialog2.open(CheckinViewComponent, {
      panelClass: 'full-width-modal',
      data: {
        'user_id': user_id,
        'date': date,
      }
    });

    dialogRef.afterClosed().subscribe(result => {
    });

  }

  openBottomSheet(type): void {
    this.bottomSheet.open(BottomSheetComponent, {
      data: {
        'filterPage': type,
      }
    });
    this.bottomSheet._openedBottomSheetRef.afterDismissed().subscribe((data) => {
      this.data.date_from = data.date_from;
      this.data.date_to = data.date_to;
      if (type == 'today_checkin_list') {
        this.data.user_id = data.user_id;
        this.CheckinList(this.show_today ? 'todayCheckinList' : 'checkinAll', this.show_today ? '1' : '2');
      } else {
        this.exportAsXLSX2();
      }
      // this.CheckinList('todayCheckinList', 1);
    })
  }


  copyAddress(address) {
    // copy text
    window.navigator['clipboard'].writeText(address);
    this.toast.successToastr("Copied 😊");
  }

  exportAsXLSX2() {
    this.loader = true;
    this.service.post_rqst({ 'search': this.data, }, 'Excel/genrateCsvCheckIn')
      .subscribe(((result: any) => {
        if (result['msg'] == true) {
          this.loader = false;
          window.open(this.downurl + result['filename']);
          this.CheckinList(this.show_today ? 'todayCheckinList' : 'checkinAll', this.show_today ? '1' : '2');
        } else {
          this.loader = false;
        }
      }), err => {
        this.loader = false;
      });

  }
  date_format(): void {
    this.data.date_created = moment(this.data.date_created).format('YYYY-MM-DD');
    this.CheckinList(this.show_today ? 'todayCheckinList' : 'checkinAll', this.show_today ? '1' : '2');
  }


  // chunk data download start
  downloadInChunks(func_name, type) {
    this.func_name = func_name
    this.type = type
    this.service.post_rqst({ 'user_id': this.assign_login_data2.id, 'start': this.start, 'pagelimit': this.page_limit, 'search': this.data, 'user_type': this.assign_login_data2.type }, "DownloadMaster/createQueueRequest").subscribe((result) => {
      if (result['statusCode'] == 200) {
        if (result['code'] == 0) {
          this.toast.errorToastr(result['statusMsg']);
          return;
        }

        if (result['code'] == 1) {
          this.downloadExcel2(this.func_name, this.type);
        }
      }
    }, err => {
      this.loader = false;
    });
  }

  downloadExcel2(func_name, type) {
    let can
    this.progressService.getCancelReq().subscribe(cancelReq => {
      can = cancelReq
    })
    if (can == false) {
      this.downloader = true;
      if (this.download_percent == null) {
        this.download_percent = 0;
      }

      this.service.post_rqst({ 'user_id': this.assign_login_data2.id, 'start': this.start, 'pagelimit': this.page_limit, 'search': this.data, 'user_type': this.assign_login_data2.type }, func_name == 'todayCheckinList' ? "DownloadMaster/activityReport" : "DownloadMaster/checkinAllData").subscribe((result) => {
        if (result['code'] === 1) {
          this.downloader = false;
          this.download_percent = null;
          window.open(this.downurl + result['filename']);
          this.progressService.setTotalCount(0);
          this.progressService.setRemainingCount(0);
          this.progressService.setDownloadProgress(0);
          this.progressService.setDownloaderActive(false);
          this.CheckinList(this.func_name, this.type);
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
          this.downloadExcel2(this.func_name, this.type);
        }
      }, err => {
        this.excelLoader = false;

      });
    }
  }


  goToPage(dr_id, dr_type) {
    let id = this.cryptoService.encryptId(dr_id)
    if (dr_type == 4) {
      this.route.navigate(['checkin/distribution-detail/', id, 'Profile', 'lead-detail', id]);
    }
    else if (dr_type == 5) {
      this.route.navigate(['checkin/distribution-detail/', id, 'Profile', 'site-detail', id]);
    }
    else if (dr_type == 1 || dr_type == 3) {
      this.route.navigate(['checkin/distribution-detail/', id, 'Profile'], { queryParams: { 'id': id, 'type': dr_type } });
    }
    else {
      this.route.navigate(['checkin/influencer-detail/', id, dr_type], { queryParams: { 'id': id, 'type': dr_type } });
    }
  }


  pageChange() {
    if (this.gotoPageNumber < 1 || this.gotoPageNumber > this.total_page) {
      this.toast.errorToastr("Invalid page number");
      return;
    }
    this.pagenumber = this.gotoPageNumber;
    this.start = (this.pagenumber - 1) * this.page_limit;
    this.CheckinList(this.show_today ? 'todayCheckinList' : 'checkinAll', this.show_today ? '1' : '2');
  }

}
