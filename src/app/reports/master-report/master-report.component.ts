import { Component, OnInit } from '@angular/core';
import * as moment from 'moment';
import * as XLSX from 'xlsx';
import { ActivatedRoute } from '@angular/router';
import { MatDialog } from '@angular/material';
import { DatabaseService } from 'src/_services/DatabaseService';
import { ToastrManager } from 'ng6-toastr-notifications';
import { HeaderSettingModalComponent } from 'src/app/header-setting-modal/header-setting-modal.component';

declare var google: any;



@Component({
  selector: 'app-master-report',
  templateUrl: './master-report.component.html'
})


export class MasterReportComponent implements OnInit {

  data: any = {};
  states: any = [];
  reportingOne = [];
  user = [];
  list: any = [];
  headersCus: any = [];
  headersEmp: any = [];
  today: any
  reportType: any = {}
  noResult: boolean = false;
  downurl: any = ''
  savingFlag: boolean = false;
  excelFlag: boolean = false;
  map: any

  constructor(public dialog: MatDialog, public route: ActivatedRoute, public service: DatabaseService, public toast: ToastrManager,) {

    this.today = new Date();
    this.route.params.subscribe(params => {
      this.downurl = service.downloadUrl
      this.clearFilter();
      this.reportType = this.route.queryParams['_value'];
      this.userList('')
      this.getAllList('', '', '', '');
      this.excelFlag = false;
      this.savingFlag = false
    });

  }


  ngAfterViewInit() {


  }


  isPlaying: boolean = false;
  playbackIndex: number = 0;
  playbackActions: any[] = []; // Store recorded actions here


  ngOnInit() {
    this.initMap();
  }


  initMap() {
    this.map = new google.maps.Map(document.getElementById('map'), {
      center: { lat: -34.397, lng: 150.644 },
      zoom: 8
    });
  }


  recordMarkerMovement(lat: number, lng: number) {
    this.playbackActions.push({
      actionType: 'moveMarker',
      coordinates: { lat, lng },
    });
  }

  // Function to record a zoom change
  recordZoomChange(zoomLevel: number) {
    this.playbackActions.push({
      actionType: 'zoom',
      zoomLevel,
    });
  }


  startRecording() {
    this.recordMarkerMovement(-34.397, 150.644); // Record marker movement
    this.recordZoomChange(10); // Record a zoom change
    // ... record more actions as needed
  }

  startPlayback() {
    this.isPlaying = true;
    this.playNextAction();
  }

  pausePlayback() {
    this.isPlaying = false;
  }

  rewindPlayback() {
    this.isPlaying = false;
    this.playbackIndex = 0;
    this.map.setCenter({ lat: -34.397, lng: 150.644 }); // Reset the map to initial state
  }

  playNextAction() {
    if (this.isPlaying && this.playbackIndex < this.playbackActions.length) {
      // Replay the next action (e.g., move marker, zoom, etc.)
      const action = this.playbackActions[this.playbackIndex];
      // Implement logic to replay the action based on your recorded data
      // Update the map accordingly
      this.playbackIndex++;
      setTimeout(() => this.playNextAction(), 1000); // Delay between actions (adjust as needed)
    } else {
      this.isPlaying = false;
    }
  }


  settingModal(type) {
    const dialogRef = this.dialog.open(HeaderSettingModalComponent, {
      width: '768px',
      data: {
        'reportType': type,
      }
    });
    dialogRef.afterClosed().subscribe(result => {
    });

  }



  getAllList(state, rsm1, rsm2, hod) {
    this.service.post_rqst({ 'state': state, 'rsm1': rsm1, 'rsm2': rsm2, 'hod': hod }, "Reports/fetchFilterData").subscribe((result => {

      if (result['statusCode'] == 200) {
        this.states = result['result']['state'];
        this.reportingOne = result['result']['rm1'];
      }
      else {
        this.toast.errorToastr(result['statusMsg'])
      }
    }));
  }


  userList(search) {

    this.service.post_rqst({ 'state': this.data.state, 'rm1': this.data.rsm1, 'rm2': this.data.rm2, 'hod': this.data.hod_reporting, 'search': search }, "Reports/fetchFilterUserData").subscribe((result => {
      if (result['statusCode'] == 200) {
        this.user = result['result'];
        const userData = [];
        if (this.data.state || this.data.rsm1 || this.data.rm2 || this.data.hod_reporting) {
          for (let i = 0; i < this.user.length; i++) {
            userData.push(this.user[i].id);
          }

          this.data.assigned_sales_user_name = userData.map(String);
        }
      }
      else {
        this.toast.errorToastr(result['statusMsg'])
      }
    }));
  }

  clearFilter() {
    this.data.state = '';
    this.data.rsm1 = '';
    this.data.rsm2 = '';
    this.data.hod_reporting = '';
    this.data.assigned_sales_user_name = '';
    this.list = [];
    this.data.checkUser = '';
    this.data.rm1 = '';
    this.data.rm2 = ''
    this.data.hod_user = '';
    this.data.employee = '';
    this.data.date_from = '';
    this.data.date_to = '';
    this.noResult = false;
  }


  allSelect(type) {
    if (type == "state") {
      setTimeout(() => {
        if (this.data.checkUser == true) {
          const array = [];
          for (let i = 0; i < this.states.length; i++) {
            array.push(this.states[i].state_name);
          }
          this.data.state = array.map(String);
        }
        else {
          this.data.state = '';
          this.data.assigned_sales_user_name = '';
        }

      }, 50);
    }
    else if (type == "rm1") {
      setTimeout(() => {
        if (this.data.rm1 == true) {
          const array = [];
          for (let i = 0; i < this.reportingOne.length; i++) {
            array.push(this.reportingOne[i].id);
          }
          this.data.rsm1 = array.map(String);
        }
        else {
          this.data.rsm1 = '';
          this.data.assigned_sales_user_name = '';

        }

      }, 50);
    }

    else {
      setTimeout(() => {
        if (this.data.employee == true) {
          const array = [];
          for (let i = 0; i < this.user.length; i++) {
            array.push(this.user[i].id);
          }
          this.data.assigned_sales_user_name = array.map(String);
        }
        else {
          this.data.assigned_sales_user_name = '';
        }
      }, 50);
    }
  }



  getReport() {
    if (this.data.date_from) {
      this.data.date_from = moment(this.data.date_from).format('YYYY-MM-DD');
    }
    if (this.data.date_to) {
      this.data.date_to = moment(this.data.date_to).format('YYYY-MM-DD');
    }

    if (!this.data.assigned_sales_user_name) {
      this.toast.errorToastr('Select Employee')
      return
    }

    if (!this.data.date_from) {
      this.toast.errorToastr('Select Date From')
      return
    }

    if (!this.data.date_to) {
      this.toast.errorToastr('Select Date To')
      return
    }

    this.list = [];

    if (this.reportType.reportType == 'PJP-Detail-Report') {
      this.savingFlag = true;
      this.service.post_rqst({ 'data': this.data }, "Reports/pjpList").subscribe((result => {
        if (result['statusCode'] == 200) {
          this.list = result['result']['pjp']
          this.headersEmp = result['result']['header_show_user'];
          this.headersCus = result['result']['header_show_company'];
          this.savingFlag = false;
          if (this.list.length == 0) {
            this.noResult = true;
          }
        }
        else {
          this.savingFlag = false;
          this.toast.errorToastr(result['statusMsg'])
        }
      }));
    }
    if (this.reportType.reportType == 'PJP-Summary-Report') {
      this.savingFlag = true;

      this.service.post_rqst({ 'data': this.data }, "Reports/pjpCount").subscribe((result => {

        if (result['statusCode'] == 200) {
          this.list = result['result']['pjp']
          this.headersEmp = result['result']['header_show_user'];
          this.headersCus = result['result']['header_show_company'];
          this.savingFlag = false;

          if (this.list.length == 0) {
            this.noResult = true;
          }
        }
        else {
          this.toast.errorToastr(result['statusMsg'])
          this.savingFlag = false;

        }
      }));
    }

    if (this.reportType.reportType == 'Attendance-Report') {
      this.savingFlag = true;

      this.service.post_rqst({ 'data': this.data }, "Reports/attendenceReport").subscribe((result => {

        if (result['statusCode'] == 200) {
          this.list = result['result']['data']
          this.headersEmp = result['result']['header_show_user'];
          this.headersCus = result['result']['header_show_company'];
          this.savingFlag = false;

          if (this.list.length == 0) {
            this.noResult = true;
          }
        }
        else {
          this.toast.errorToastr(result['statusMsg']);
          this.savingFlag = false;

        }
      }));
    }
    if (this.reportType.reportType == 'Visit-Detail-Report') {
      this.savingFlag = true;

      this.service.post_rqst({ 'data': this.data }, "Reports/visitList").subscribe((result => {

        if (result['statusCode'] == 200) {
          this.list = result['result']['visit']
          this.headersEmp = result['result']['header_show_user'];
          this.headersCus = result['result']['header_show_company'];
          this.savingFlag = false;

          if (this.list.length == 0) {
            this.noResult = true;
          }
        }
        else {
          this.toast.errorToastr(result['statusMsg']);
          this.savingFlag = false;

        }
      }));
    }
    if (this.reportType.reportType == 'Visit-Summary-Report') {
      this.savingFlag = true;

      this.service.post_rqst({ 'data': this.data }, "Reports/visitCount").subscribe((result => {
        if (result['statusCode'] == 200) {
          this.list = result['result']['visit']
          this.headersEmp = result['result']['header_show_user'];
          this.headersCus = result['result']['header_show_company'];
          this.savingFlag = false;

          if (this.list.length == 0) {
            this.noResult = true;
          }
        }
        else {
          this.toast.errorToastr(result['statusMsg']);
          this.savingFlag = false;

        }
      }));
    }
    if (this.reportType.reportType == 'Deviation-Detail-Report') {
      this.savingFlag = true;

      this.service.post_rqst({ 'data': this.data }, "Reports/deviationList").subscribe((result => {

        if (result['statusCode'] == 200) {
          this.list = result['result']['visit']
          this.headersEmp = result['result']['header_show_user'];
          this.headersCus = result['result']['header_show_company'];
          this.savingFlag = false;


          if (this.list.length == 0) {
            this.noResult = true;
          }

        }
        else {
          this.toast.errorToastr(result['statusMsg']);
          this.savingFlag = false;

        }
      }));
    }
    if (this.reportType.reportType == 'Deviation-Summary-Report') {
      this.savingFlag = true;

      this.service.post_rqst({ 'data': this.data }, "Reports/deviationCount").subscribe((result => {
        if (result['statusCode'] == 200) {
          this.list = result['result']['visit']
          this.headersEmp = result['result']['header_show_user'];
          this.headersCus = result['result']['header_show_company'];
          this.savingFlag = false;


          if (this.list.length == 0) {
            this.noResult = true;
          }
        }
        else {
          this.savingFlag = false;
          this.toast.errorToastr(result['statusMsg'])
        }
      }));
    }

    if (this.reportType.reportType == 'Expense-Report') {
      this.service.post_rqst({ 'data': this.data }, "Reports/userExpenseReport").subscribe((result => {
        if (result['msg'] == true) {
          window.open(this.downurl + result['filename']);
          this.excelFlag = false;
        } else {
          this.excelFlag = false;
        }
      }));
    }

  }



  downloadExcel() {
    let fileName
    fileName = this.reportType.reportType.replaceAll(/-/g, "_");
    this.excelFlag = true;
    this.service.post_rqst({ 'data': this.data }, "Excel/" + fileName.toLowerCase()).subscribe((result => {
      if (result['msg'] == true) {
        window.open(this.downurl + result['filename']);
        this.excelFlag = false;
      } else {
        this.excelFlag = false;
      }
    }));
  }



}