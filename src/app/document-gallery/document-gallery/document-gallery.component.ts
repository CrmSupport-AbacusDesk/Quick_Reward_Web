import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrManager } from 'ng6-toastr-notifications';
import { DatabaseService } from 'src/_services/DatabaseService';
import { DialogComponent } from 'src/app/dialog.component';
import { sessionStorage } from 'src/app/localstorage.service';
import * as moment from 'moment';
import { MatDialog } from '@angular/material';
import { AttendanceDetailComponent } from 'src/app/attendance-detail/attendance-detail.component';


@Component({
  selector: 'app-document-gallery',
  templateUrl: './document-gallery.component.html'
})
export class DocumentGalleryComponent implements OnInit {

  data: any = {};
  savingFlag: boolean = false;
  skLoading: boolean = false;

  userData: any;
  states: any = [];
  reportingOne = [];
  user = [];
  userId: any;
  userName: any;
  salesUser: any = [];
  today_date: any = new Date();
  allUser: any = []

  constructor(public service: DatabaseService, public router: Router, public dialog2: MatDialog, public rout: Router, public session: sessionStorage, public dialog: DialogComponent, public ActivatedRoute: ActivatedRoute, public toast: ToastrManager) {
    this.userData = JSON.parse(localStorage.getItem('st_user'));
    this.userId = this.userData['data']['id'];
    this.userName = this.userData['data']['name'];
    this.allUser = [];
    this.getAllList('', '',);

  }

  ngOnInit() {
    this.getSalesUser('')
  }



  public date(date) {
    if (this.data.date_from) {
      this.data.date_from = moment(this.data.date_from).format('YYYY-MM-DD');
    }
    if (this.data.date_to) {
      this.data.date_to = moment(this.data.date_to).format('YYYY-MM-DD');
    }
  }



  clearFilter() {
    this.data.state = '';
    this.data.rsm1 = '';
    this.data.user_id = '';
    this.data.checkUser = '';
    this.data.date_from = '';
    this.data.date_to = '';
  }


  getSalesUser(search) {

    this.service.post_rqst({ 'state': this.data.state, 'rm1': this.data.rsm1, 'rm2': this.data.rm2, 'hod': this.data.hod_reporting, 'search': search }, "Master/fetchFilterUserData").subscribe((response => {
      if (response['statusCode'] == 200) {
        this.salesUser = response['result'];
        const userData = [];
        if (this.data.state || this.data.rsm1 || this.data.rm2 || this.data.hod_reporting) {
          for (let i = 0; i < this.salesUser.length; i++) {
            userData.push(this.salesUser[i].id);

          }
          this.data.user_id = userData.map(String);
        }
      } else {
        this.toast.errorToastr(response['statusMsg']);
      }
    }));
  }


  getAllList(state, rsm1) {
    this.service.post_rqst({ 'state': state, 'rsm1': rsm1 }, "Master/fetchFilterData").subscribe((result => {
      if (result['statusCode'] == 200) {
        this.states = result['result']['state'];
        this.reportingOne = result['result']['rm1'];
      }
      else {
        this.toast.errorToastr(result['statusMsg'])
      }
    }));
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

      }, 100);
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

      }, 100);
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
      }, 100);
    }
  }


  selectAll() {
    setTimeout(() => {
      if (this.data.checkUser == true) {
        const userData = [];
        for (let i = 0; i < this.salesUser.length; i++) {
          userData.push(this.salesUser[i].id);
        }
        this.allUser = userData;
        this.data.user_id = this.allUser.map(String);
      }
      else {
        this.data.user_id = '';
        this.allUser = []
      }
    }, 100);
  }

  filterResult: any = [];

  filter() {
    if (this.allUser.length > 0) {
      this.data.user_id = this.allUser;
    }



    if (!this.data.user_id) {
      this.toast.errorToastr('Select User')
      return
    }

    if (!this.data.module) {
      this.toast.errorToastr('Select Module')
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

    if (this.data.date_from) {
      this.data.date_from = moment(this.data.date_from).format('YYYY-MM-DD');
    }
    if (this.data.date_to) {
      this.data.date_to = moment(this.data.date_to).format('YYYY-MM-DD');
    }

    this.savingFlag = true;
    this.service.post_rqst({ 'data': this.data }, "Master/getAllImages").subscribe((result => {
      if (result['statusCode'] == 200) {
        this.filterResult = result['result']['result'];
        const dialogRef = this.dialog2.open(AttendanceDetailComponent, {
          panelClass: 'full-width-modal',
          data: {
            'from': 'attendence_images',
            'images_data': this.filterResult,
            'header': this.data
          }
        });
        this.savingFlag = false;
      } else {
        this.toast.errorToastr(result['statusMsg']);
        this.savingFlag = false;
      }
    }));
  }

}

