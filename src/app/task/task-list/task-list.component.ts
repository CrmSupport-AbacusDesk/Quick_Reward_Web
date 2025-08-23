import { Component, OnInit, Input } from '@angular/core';
import { MatDialog } from '@angular/material';
import { ToastrManager } from 'ng6-toastr-notifications';
import { DialogComponent } from 'src/app/dialog.component';
import { DatabaseService } from 'src/_services/DatabaseService';
import * as moment from 'moment';
import { TaskActionModalComponent } from '../task-action-modal/task-action-modal.component';
import { sessionStorage } from 'src/app/localstorage.service';
import { CryptoService } from 'src/_services/CryptoService';

@Component({
  selector: 'app-task-list',
  templateUrl: './task-list.component.html'
})

export class TaskListComponent implements OnInit {

  fabBtnValue: any = 'add';
  active_tab: any = 'my_task';
  sub_active_tab: any = 'promise_done';
  filter: any = {};
  count: any = {};
  tabCount: any;
  loader: boolean = false;
  pageCount: any;
  total_page: any;
  page_limit: any;
  pagenumber: any = 1;
  start: any = 0;
  taskList_data: any = [];
  sr_no: number;
  userData: any;
  userId: any;
  userName: any;
  noResult: boolean = false;
  downurl: any = '';
  assign_login_data: any = [];
  assign_login_data2: any = [];


  @Input() dataToReceive: any;
  padding0: any;
  hide: any;
  constructor(public service: DatabaseService,  public cryptoService:CryptoService, public toast: ToastrManager, public dialog: MatDialog, public alert: DialogComponent, public session: sessionStorage) {
    this.page_limit = service.pageLimit;
    this.downurl = service.downloadUrl;
    this.assign_login_data = this.session.getSession();
    this.assign_login_data = this.assign_login_data.value;
    this.assign_login_data2 = this.assign_login_data.data;
    this.userData = JSON.parse(localStorage.getItem('st_user'));
    this.userId = this.userData['data']['id'];
    this.userName = this.userData['data']['name'];


  }

  ngOnInit() {
    if (this.dataToReceive != undefined) {
      this.padding0 = this.dataToReceive.padding0;
      this.hide = this.dataToReceive.hide;
      this.userId = this.dataToReceive.user_id;
      this.getTaskList(this.sub_active_tab);
    }
    else {
      this.filter = this.service.getData()
      if (this.filter.status) {
        this.sub_active_tab = this.filter.status
      }
      this.getTaskList(this.sub_active_tab);
    }
  }

  pervious() {
    this.start = this.start - this.page_limit;
    this.getTaskList(this.sub_active_tab);
  }

  nextPage() {
    this.start = this.start + this.page_limit;
    this.getTaskList(this.sub_active_tab);
  }

  getTaskList(Active) {
    this.loader = true;
    if (this.pagenumber > this.total_page) {
      this.pagenumber = this.total_page;
    }
    if (this.start < 0) {
      this.start = 0;
    }

    if (this.filter.date_created) {

      this.filter.date_created = moment(this.filter.date_created).format('YYYY-MM-DD');
    }
    if (this.filter.close_date) {

      this.filter.close_date = moment(this.filter.close_date).format('YYYY-MM-DD');
    }
    if (this.filter.promise_date) {

      this.filter.promise_date = moment(this.filter.promise_date).format('YYYY-MM-DD');
    }
    this.filter.status = this.sub_active_tab
    this.service.post_rqst({ 'filter': this.filter, 'created_by_id': this.userId, 'start': this.start, 'pagelimit': this.page_limit, 'task_type': this.sub_active_tab, 'task_status': this.active_tab }, 'Task/getTaskList').subscribe((result) => {
      if (result['statusCode'] == 200) {
        this.taskList_data = result['data'];
        this.taskList_data.forEach(item => item['encrypt_id'] = this.cryptoService.encryptId(item['id']));
        this.tabCount = result['tabCount'];
        this.pageCount = result['count'];
        this.loader = false;
        if (this.pagenumber > this.total_page) {
          this.pagenumber = this.total_page;
          if (this.pageCount != 0) {
            this.start = this.pageCount - this.page_limit;
          }
          else {
            this.start = 0
          }
        }

        else {
          this.pagenumber = Math.ceil(this.start / this.page_limit) + 1;
        }
        this.total_page = Math.ceil(this.pageCount / this.page_limit);
        this.sr_no = this.pagenumber - 1;
        this.sr_no = this.sr_no * this.page_limit;
        if (this.taskList_data.length == 0) {
          this.noResult = true;
        }
      }
      else {
        this.toast.errorToastr(result['statusMsg']);
      }
    })
  }


  refresh() {

    this.filter = {}
    if (this.dataToReceive != undefined) {
      this.userId = this.dataToReceive.user_id;
    }
    this.service.setData(this.filter)
    this.service.currentUserID = ''
    this.getTaskList(this.sub_active_tab);

  }


  openDialog(id, type): void {
    this.service.currentUserID = id
    const dialogRef = this.dialog.open(TaskActionModalComponent, {
      width: '400px',
      panelClass: 'padding0',
      data: {
        'id': id,
        'type': type,
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result != false) {
        this.getTaskList(this.sub_active_tab)
      }
    });

  }





  exportAsXLSX() {
    this.loader = true;
    this.service.post_rqst({ 'filter': this.filter, 'start': this.start, 'pagelimit': this.page_limit, 'status': this.active_tab }, 'Support/getSupportList').subscribe((result) => {
      if (result['msg'] == true) {
        this.loader = false;
        window.open(this.downurl + result['filename'])
        this.getTaskList(this.sub_active_tab);
      } else {
        this.loader = false;
      }
    });
  }

}
