import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import * as moment from 'moment';
import { ToastrManager } from 'ng6-toastr-notifications';
import { DialogComponent } from 'src/app/dialog.component';
import { sessionStorage } from 'src/app/localstorage.service';
import { TaskActionModalComponent } from 'src/app/task/task-action-modal/task-action-modal.component';
import { DatabaseService } from 'src/_services/DatabaseService';
import { LeaveMasterAddComponent } from '../leave-master-add/leave-master-add.component';
import { CryptoService } from 'src/_services/CryptoService';

@Component({
  selector: 'app-leave-master-list',
  templateUrl: './leave-master-list.component.html',
  styleUrls: ['./leave-master-list.component.scss']
})
export class LeaveMasterListComponent implements OnInit {
  leaveMasterList: any = [];
  filter: any = {};
  loader: boolean = false;
  fabBtnValue: any = 'add';
  noResult: boolean = false;
  assign_login_data: any = {};
  logined_user_data: any = {};
  downurl: any

  constructor(public service: DatabaseService, public cryptoService:CryptoService, public dialog1: DialogComponent, public toast: ToastrManager, public dialog: MatDialog, public alert: DialogComponent, public session: sessionStorage) {
    this.downurl = service.downloadUrl
    this.assign_login_data = this.session.getSession();
    this.logined_user_data = this.assign_login_data.value.data;
  }

  ngOnInit() {
    this.getLeaveMasterList();
  }



  getLeaveMasterList() {
    this.loader = true;
    this.service.post_rqst({ 'filter': this.filter }, 'Master/leaveMasterList').subscribe((result) => {
      

      if (result['statusCode'] == 200) {
        this.leaveMasterList = result['result'];
        this.loader = false;
        if (this.leaveMasterList.length == 0) {
          this.noResult = true;
        }
      }
      else {
        this.toast.errorToastr(result['statusMsg']);
      }
    }, err => {
      this.loader = false;

    })
  }


  refresh() {
    this.filter = {}
    this.service.setData(this.filter)
    this.service.currentUserID = ''
    this.getLeaveMasterList();
  }


  openDialog(type, data): void {
    const dialogRef = this.dialog.open(LeaveMasterAddComponent, {
      width: '400px',
      panelClass: 'padding0',
      data: {
        'type': type,
        'data': data
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result != false) {
        this.getLeaveMasterList()
      }
    });

  }


  deleteLeaveMaster(id) {
    this.dialog1.delete('Leave Master Data!').then((result) => {
      if (result) {
        this.loader = true;
        this.service.post_rqst({ "id": id }, "Master/leaveMasterDelete").subscribe(result => {
          
          if (result['statusCode'] == 200) {
            this.loader = false;
            this.toast.successToastr(result['statusMsg']);
            this.getLeaveMasterList();
          } else {
            this.loader = false;
            this.toast.errorToastr(result['statusMsg']);
          }
        }, err => {
          this.loader = false;
          this.toast.errorToastr('Something went wrong');
        })
      }
    })

  }

  updateLeaveMaster() {
    this.loader = true;
    this.dialog1.confirm("You Want To Update Leave Master ?").then((result) => {
      if (result) {
        this.service.post_rqst({ 'data': this.leaveMasterList, 'created_by_name': this.logined_user_data.name, 'created_by_id': this.logined_user_data.id }, 'Master/updateLeave').subscribe((result) => {
          if ( result['statusCode'] == 200) {
            this.loader = false;
            this.toast.successToastr( result['statusMsg']);
            this.getLeaveMasterList();
          }
          else {
            this.toast.errorToastr( result['statusMsg']);
          }
        }, err => {
          this.loader = false;
        })
      }
    })
  }

  getLeaveMasterExcel() {
    this.loader = true;
    this.service.post_rqst({}, "Excel/leaveMaster").subscribe((result) => {
      if (result['msg'] == true) {
        this.loader = false;
        window.open(this.downurl + result['filename'])
        this.getLeaveMasterList();
      }
    });
  }

}
