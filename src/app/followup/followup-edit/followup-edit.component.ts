import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material';
import * as moment from 'moment';
import { DialogComponent } from 'src/app/dialog.component';
import { DatabaseService } from 'src/_services/DatabaseService';
import { sessionStorage } from 'src/app/localstorage.service';


@Component({
  selector: 'app-followup-edit',
  templateUrl: './followup-edit.component.html',
  styleUrls: ['./followup-edit.component.scss']
})
export class FollowupEditComponent implements OnInit {

  followup_detail: any = {};
  today_date: any = new Date();
  followup_type: any = [];
  userData: any;
  userId: any;
  userName: any;

  constructor(@Inject(MAT_DIALOG_DATA) public data, public dialog: MatDialog, public serve: DatabaseService, public session: sessionStorage, public dialogComponent: DialogComponent) {
    if (this.data['from'] == 'followup detail page') {
      this.followup_detail = this.data['followup_detail'];
      // this.get_followup_types();
      this.userData = JSON.parse(localStorage.getItem('st_user'));
      this.userId = this.userData['data']['id'];
      this.userName = this.userData['data']['name'];
    }

  }

  ngOnInit() {
  }

  date_format() {
    this.followup_detail.next_follow_date = moment(this.followup_detail.next_follow_date).format('YYYY-MM-DD');
  }

  update_followup() {
    this.serve.post_rqst({ 'followup_detail': this.followup_detail, 'uid': this.userId, 'uname': this.userName }, "Followup/update_followup").subscribe((result => {
      if (result['statusCode'] == '200') {
        this.dialogComponent.success("Follow Up Detail", "Update Successfully");
        this.dialog.closeAll();
      }
      else {
        this.dialogComponent.error("Something Went Wrong Please Try Again !");
      }
    }))

  }

  get_followup_types() {
    this.serve.post_rqst({}, "Distributors/followup_type_master_list").subscribe((result) => {
      this.followup_type = result['followup_type_master_list']
    })

  }

}
