import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { ToastrManager } from 'ng6-toastr-notifications';
import { DialogComponent } from 'src/app/dialog.component';
import { sessionStorage } from 'src/app/localstorage.service';
import { DatabaseService } from 'src/_services/DatabaseService';

@Component({
  selector: 'app-leave-master-add',
  templateUrl: './leave-master-add.component.html',
  styleUrls: ['./leave-master-add.component.scss']
})
export class LeaveMasterAddComponent implements OnInit {
  info: any = {};
  savingFlag: boolean = false;
  assign_login_data: any = {};
  logined_user_data: any = {};
  type: any;
  constructor(@Inject(MAT_DIALOG_DATA) public modelData, public dialog: MatDialog, public session: sessionStorage, public serve: DatabaseService, public toast: ToastrManager, public alert: DialogComponent, public dialogRef: MatDialogRef<LeaveMasterAddComponent>) {
    this.assign_login_data = this.session.getSession();
    this.logined_user_data = this.assign_login_data.value.data;
    this.type = modelData.type;

    if (this.type == 'edit') {
      this.info.title = this.modelData.data.title;
      this.info.count = this.modelData.data.count;
      this.info.id = this.modelData.data.id;
    }

  }

  ngOnInit() {
  }

  submitDetail(type) {
    this.savingFlag = true;
    this.info.created_by_name = this.logined_user_data.name;
    this.info.created_by_id = this.logined_user_data.id;
    let header
    if (type == 'add') {
      header = this.serve.post_rqst({ 'data': this.info }, "Master/leaveMasterAdd")
    }
    if (type == 'edit') {
      header = this.serve.post_rqst({ 'data': this.info }, "Master/leaveMasterEdit")
    }

    header.subscribe((response) => {
      if (response['statusCode'] == 200) {
        this.toast.successToastr(response['statusMsg']);
        // this.rout.navigate(['/user-add']);
        this.dialogRef.close(true);
        this.savingFlag = false;
      }
      else {
        this.toast.errorToastr(response['statusMsg']);
        this.savingFlag = false;
      }
    }, err => {
      this.savingFlag = false;
    });
  }

}
