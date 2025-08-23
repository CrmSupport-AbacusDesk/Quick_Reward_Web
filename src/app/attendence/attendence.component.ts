import { Component, OnInit, Input } from '@angular/core';
import { DatabaseService } from 'src/_services/DatabaseService'
import * as moment from 'moment';
import { Router } from '@angular/router';
import { DialogComponent } from '../dialog.component';
import { MatDialog, MatBottomSheet } from '@angular/material';
import { ImageModuleComponent } from '../image-module/image-module.component';
import { ToastrManager } from 'ng6-toastr-notifications';
import { sessionStorage } from '../localstorage.service';
import { AttendancemodalComponent } from '../attendancemodal/attendancemodal.component';
import { AttendanceDetailComponent } from '../attendance-detail/attendance-detail.component';
import { BottomSheetComponent } from '../bottom-sheet/bottom-sheet.component';
import { CryptoService } from 'src/_services/CryptoService';
import { ProgressService } from '../progress.service';
@Component({
  selector: 'app-attendence',
  templateUrl: './attendence.component.html',
  styleUrls: ['./attendence.component.scss']
})
export class AttendenceComponent implements OnInit {

  tabType: any = 'Today';
  tabType1: any = 'Present';
  data: any = {};
  msg: any
  start_attend_time: string;
  loader: boolean = false;
  datanotfound: boolean = false;
  value: any = {};
  att_temp: any = [];
  pagelimit: any=10;
  data_not_found = false;
  today_date: Date;
  today_day: any;
  show: boolean = false;
  newToday_date: string;
  logIN_user: any;
  uid: any;
  uname: any;
  pagenumber: any;
  total_page: any;
  count: any;
  start: any = 0;
  page_limit: any = 10;
  assign_login_data2: any = {};
  assign_login_data: any = [];
  today_and_all_tab: any = 1;
  attendancelist: any = [];
  attendanceDate: any = [];
  show_today: boolean = true;
  count_1: any;
  count_2: any;
  count_3: any;
  absent: boolean = true;
  active_present_absent: boolean = true;
  attendence_type: any = 'Present';
  report_manager: any = [];
  totalAttendanceCount: any;
  tabCount: any = {};
  downurl: any = '';
  hod: any = []
  rsm2: any = []
  @Input() dataToReceive: any;
  padding0: any;
  hide: any;
  totalDownloadCount: any;
  remainingDownloadCount: any;
  totalCount: any;
  remainingCount: any;
  downloader: any = false;
  download_percent: any;

  constructor(public rout: Router, public cryptoService: CryptoService, public service: DatabaseService, private bottomSheet: MatBottomSheet, public dialog: DialogComponent, public toast: ToastrManager, public dialogs: MatDialog, public dialog2: MatDialog, public session: sessionStorage, private progressService: ProgressService) {
    this.downurl = service.downloadUrl;
    // this.pagelimit = service.pageLimit
    // this.pagelimit = service.pageLimit
    this.assign_login_data = this.session.getSession();
    this.assign_login_data = this.assign_login_data.value;

    this.assign_login_data2 = this.assign_login_data.data;
    this.assign_login_data = this.assign_login_data.assignModule;

    this.getReportManager('');
    this.today_date = new Date();

    this.today_day = this.today_date.getDay();
    if (this.today_day == 5) {
      this.today_day = 'Friday'
    }


    switch (this.today_day) {
      case 0: {
        this.today_day = 'Sunday';
        break;
      }
      case 1: {
        this.today_day = 'Monday';

        break;
      }
      case 2: {
        this.today_day = 'Tuesday';

        break;
      }
      case 3: {
        this.today_day = 'Wednesday';

        break;
      }
      case 4: {
        this.today_day = 'Thursday';

        break;
      }
      case 5: {
        this.today_day = 'Friday';

        break;
      }
      case 6: {
        this.today_day = 'Saturday';

        break;
      }
      default: {
        break;
      }
    }
    this.newToday_date = moment(this.today_date).format('YYYY-MM-DD')
    this.logIN_user = JSON.parse(localStorage.getItem('st_user'));
    this.uid = this.logIN_user['data']['id'];
    this.uname = this.logIN_user['data']['name'];

  }

  ngOnInit() {
    this.data = this.service.getData()
    if (this.data.status) {
      this.tabType1 = this.data.status
      this.tabType = this.data.tabType
    }


    if (this.dataToReceive != undefined) {
      this.padding0 = this.dataToReceive.padding0;
      this.hide = this.dataToReceive.hide;
      this.attendence_type = '';
      this.tabType1 = '';
      this.tabType = 'Month';
      this.data.employee_id = this.dataToReceive.employee_id;
      this.attendance_list('getAttendance', 2);
    }

    else {
      this.attendance_list('getAttendanceToday', 1);
    }

  }


  getReportManager(searcValue, type: any = '') {
    this.service.post_rqst({ 'search': searcValue }, "Attendance/getSalesUserForReporting").subscribe((result => {
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


  pervious(fn_name, type) {
    this.start = this.start - this.page_limit;
    this.attendance_list(fn_name, type);
  }

  nextPage(fn_name, type) {
    this.start = this.start + this.page_limit;
    this.attendance_list(fn_name, type);
  }



  change_tab(fn_name, type) {
    this.attendancelist = [];
    this.data = {}
    if (type == 1) {
      this.attendence_type = 'Present';
      this.tabType1 = 'Present';
    }
    else {
      this.attendence_type = '';
    }
    this.attendance_list(fn_name, type);

  }
  change_attendence_type_tab(fn_name, type, attendenceType) {
    this.attendence_type = attendenceType;
    this.attendancelist = [];
    this.data = {};
    this.attendance_list(fn_name, type);
  }
  sales: any = [];
  refresh(func_name, type) {
    this.data = {};
    this.start = 0;
    this.attendance_list(func_name, type);
  }


  getTabCount() {
    this.service.post_rqst({}, "Attendance/getAttendanceTodayCount").subscribe((result => {
      if (result['statusCode'] == 200) {
        this.tabCount = result['result']
      } else {
        this.toast.errorToastr(result['statusMsg'])
      }
    }));
  }


  attendance_list(func_name, type) {
    this.loader = true;
    if (this.pagenumber > this.total_page) {
      this.pagenumber = this.total_page;
      this.start = this.count_2 - this.page_limit;
    }
    if (this.start < 0) {
      this.start = 0;
    }
    if (Object.getOwnPropertyNames(this.data).length != 0) {
      this.attendancelist = [];
    }
    if (type == 1) {
      this.today_and_all_tab = 1;
    } else if (type == 2) {
      this.today_and_all_tab = 2;
    }
    if (this.data.date_created)
      this.data.date_created = moment(this.data.date_created).format('YYYY-MM-DD');
    if (this.data.date_from)
      this.data.date_from = moment(this.data.date_from).format('YYYY-MM-DD');
    if (this.data.date_to)
      this.data.date_to = moment(this.data.date_to).format('YYYY-MM-DD');


    this.data.status = this.tabType1
    this.data.tabType = this.tabType

    this.service.post_rqst({ 'user_id': this.assign_login_data2.id, 'start': this.start, 'pagelimit': this.pagelimit, 'search': this.data, 'user_type': this.assign_login_data2.type, 'attendence_type': this.attendence_type }, "Attendance/" + func_name)
      .subscribe(((result: any) => {

        if (result['statusCode'] == 200) {
          this.loader = false;
          this.attendancelist = result['result']['attendence_data'];
          if (this.tabType == 'Today') {
            this.attendancelist.forEach(item => item['encrypt_id'] = this.cryptoService.encryptId(item['user_id']));
          }
          this.totalAttendanceCount = result['result']['count'];

          this.attendanceDate = result['result']['Date'];
          if (!this.attendancelist) {
            this.datanotfound = true
            return;
          } else {
            this.datanotfound = false
          }

          for (let i = 0; i < this.attendancelist.length; i++) {
            this.attendancelist[i].date_created_day = moment(this.attendancelist[i].date_created, 'YYYY.MM.DD').format("dddd");
            this.attendancelist[i].today_primary_sales = parseFloat(this.attendancelist[i].today_primary_sales)
            this.attendancelist[i].today_primary_sales = this.attendancelist[i].today_primary_sales.toFixed(2)
          }

          for (let i = 0; i < this.attendancelist.length; i++) {
            for (let j = 0; j < this.attendancelist[i].length; j++) {
              if (this.attendancelist[i][j].stop_reading == "") {
                this.attendancelist[i][j].start_reading = parseInt(this.attendancelist[i][j].start_reading);
              }
              else {
                this.attendancelist[i][j].stop_reading = parseInt(this.attendancelist[i][j].stop_reading);
                this.attendancelist[i][j].start_reading = parseInt(this.attendancelist[i][j].start_reading);
              }
            }
          }
          this.att_temp = result;

          if (type == 1) {
            this.getTabCount();

            this.count_1 = this.attendancelist.length;
            this.count_2 = result['result']['count'];

            this.show_today = true;
            this.absent = false;
            this.total_page = Math.ceil(this.count_2 / this.page_limit);

            this.pagenumber = Math.ceil(this.start / this.page_limit) + 1;

          }
          else {
            this.count_3 = result.total_no_of_attendence;
            this.count_1 = result.count;
            this.count_2 = this.attendancelist.length;
            this.show_today = false;
            this.absent = false;
            this.count = result['count'];

            this.total_page = Math.ceil(this.totalAttendanceCount / this.page_limit);
            this.pagenumber = Math.ceil(this.start / this.page_limit) + 1;
          }
          if (this.attendence_type == 'Present') {

            this.active_present_absent = true;

          } else if (this.attendence_type == 'Absent') {

            this.active_present_absent = false;

          }
          if (this.attendancelist.length == 0) {
            this.data_not_found = true;
          }
          else {
            this.data_not_found = false;
          }
        } else {
          this.toast.errorToastr(result['statusMsg'])
          this.loader = false;
        }
      }), err => {
        this.loader = false;
      })

  }

  leave: any
  excel_data: any = [];
  attendancelist1: any = []
  leave_type: any
  description: any

  downloadExcel(func_name, type, dateFrom: any = undefined, dateTo: any = undefined, name: any = undefined) {
    this.service.post_rqst({ 'date_from': dateFrom, 'date_to': dateTo, 'name': name, 'user_id': this.assign_login_data2.id, 'search': this.data, 'user_type': this.assign_login_data2.type, 'attendence_type': this.attendence_type }, "Excel/" + func_name)
      .subscribe(((result: any) => {
        if (result['msg'] == true) {

          window.open(this.downurl + result['filename'])
          this.attendance_list(func_name, type);
        } else {
          this.toast.errorToastr(result['error_msg']);

        }
      }));
  }

  imageModel(start_meter_image, stop_meter_image) {
    const dialogRef = this.dialogs.open(ImageModuleComponent, {
      data: {
        start_meter_image,
        stop_meter_image,
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result == true) {

      }
    });

  }
  conInt(val: any) {
    return val = parseFloat(val).toFixed(2);  //function convert data into float then number
  }
  conInt2(val: any) {
    return val = parseInt(val)                // function convert dataa into int
  }
  enable_error() {
    this.toast.errorToastr("Stop reading must be greater than Start reading");
  }
  attendancemodal(p) {
    const dialogRef = this.dialog2.open(AttendancemodalComponent, {
      panelClass: 'rightmodal',
      data: {
        p
      }
    });
    dialogRef.afterClosed().subscribe(result => {


    });

  }


  attendancDetail(attendance_id, user_id, date) {
    const dialogRef = this.dialog2.open(AttendanceDetailComponent, {
      panelClass: 'full-width-modal',
      data: {
        'attendance_id': attendance_id,
        'user_id': user_id,
        'date': date,
      }
    });
    dialogRef.afterClosed().subscribe(result => {

      // if (this.tabType == 'Today') {
      //   this.attendance_list('getAttendanceToday', 1);
      // } else {
      //   this.attendance_list('getAttendance', 2);
      // }

    });
  }

  attendancAbsent(user_id, attendance_id, date, item) {
    const dialogRef = this.dialog2.open(AttendancemodalComponent, {
      width: '500px',
      panelClass: 'cs-modal',
      disableClose: true,
      data: {
        'attendance_id': attendance_id,
        'user_id': user_id,
        'date': date,
        'item': item,
        'from': 'attendence_absent'
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result == true) {
        if (this.tabType == 'Today') {
          this.attendance_list('getAttendanceToday', 1);
        } else {
          this.attendance_list('getAttendance', 2);
        }
      }
    });
  }



  resetAttendance(id, fn_name, type) {
    this.dialog.confirm("You Want To  Reset Stop Attendance !").then((res) => {
      if (res) {
        this.service.post_rqst({ 'id': id }, "Attendance/resetAttenance")
          .subscribe(result => {
            if (result['statusCode'] == 200) {
              this.toast.successToastr(result['statusMsg']);
              this.attendance_list(fn_name, type);
            }
            else {
              this.toast.errorToastr(result['statusMsg']);
            }
          })
      }
    })

  }

  markAbsent(attenData, fn_name, type) {

    this.dialog.confirm("You Want To  Mark Absent !").then((res) => {
      if (res) {
        this.service.post_rqst({ 'id': attenData.id, 'manual_absent': attenData.manual_absent }, "Attendance/markAbsent")
          .subscribe(result => {
            if (result['statusCode'] == 200) {
              this.toast.successToastr(result['statusMsg']);
              this.attendance_list(fn_name, type);
            }
            else {
              this.toast.errorToastr(result['statusMsg']);
            }
          });
      }
    })
  }

  copyAddress(address) {
    window.navigator['clipboard'].writeText(address);
    this.toast.successToastr("Copied 😊");
  }

  openBottomSheet(): void {
    // openBottomSheet(func_name,type): void {
    // console.log(func_name,type);
    this.bottomSheet.open(BottomSheetComponent, {
      data: {
        'filterPage': 'distribution_list',
      }

    });

    this.bottomSheet._openedBottomSheetRef.afterDismissed().subscribe((modalData) => {
      // this.data.date_from = modalData.date_from;
      // this.data.date_to = modalData.date_to;
      // this.attendance_list(func_name, type)
      this.progressService.setCancelReq(false);
      this.downloadInChunks('getAttendanceToday', 2, modalData.date_from, modalData.date_to, modalData.user_id)

    })
  }


  downloadInChunks(func_name, type, dateFrom: any = undefined, dateTo: any = undefined, name: any = undefined) {
    this.service.post_rqst({ 'date_from': dateFrom, 'date_to': dateTo, 'name': name, 'user_id': this.assign_login_data2.id, 'search': this.data, 'user_type': this.assign_login_data2.type, 'attendence_type': this.attendence_type }, "DownloadMaster/createQueueRequest").subscribe((result) => {
      if (result['statusCode'] == 200) {
        if (result['code'] == 0) {
          this.toast.errorToastr(result['statusMsg']);
          return;
        }

        if (result['code'] == 1) {
          // this.downloadExcel2(func_name, type, dateFrom: any = undefined, dateTo: any = undefined, name: any = undefined);
          this.downloadExcel2(func_name, type, dateFrom, dateTo, name);
        }
      }
    }, err => {
      this.loader = false;
    });
  }

  downloadExcel2(func_name, type, dateFrom: any = undefined, dateTo: any = undefined, name: any = undefined) {
    let can
    this.progressService.getCancelReq().subscribe(cancelReq => {
      can = cancelReq
    })
    if (can == false) {
      this.downloader = true;
      if (this.download_percent == null) {
        this.download_percent = 0;
      }
      this.service.post_rqst({ 'date_from': dateFrom, 'date_to': dateTo, 'name': name, 'user_id': this.assign_login_data2.id, 'search': this.data, 'user_type': this.assign_login_data2.type, 'attendence_type': this.attendence_type }, "DownloadMaster/downloadAttendenceData").subscribe((result) => {
        if (result['code'] === 1) {
          this.downloader = false;
          this.download_percent = null;
          window.open(this.downurl + result['filename']);
          this.progressService.setTotalCount(0);
          this.progressService.setRemainingCount(0);
          this.progressService.setDownloadProgress(0);
          this.progressService.setDownloaderActive(false);
          if (this.dataToReceive == undefined) {
            this.tabType == 'Today' ? this.refresh('getAttendanceToday', 1) : this.refresh('getAttendance', 2)

          }
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
          this.downloadExcel2(func_name, type, dateFrom, dateTo, name);
        }
      }, err => {
        this.loader = false;

      });
    }
  }


}


