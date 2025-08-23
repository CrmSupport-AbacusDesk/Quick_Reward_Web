import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material';
import { ToastrManager } from 'ng6-toastr-notifications';
import { DatabaseService } from 'src/_services/DatabaseService';
import { sessionStorage } from 'src/app/localstorage.service';

@Component({
  selector: 'app-feedback-add',
  templateUrl: './feedback-add.component.html',
  styleUrls: ['./feedback-add.component.scss']
})
export class FeedbackAddComponent implements OnInit {

  formData: any = {}
  savingFlag: boolean = false;

  constructor(@Inject(MAT_DIALOG_DATA) public data, public dialog: MatDialog, public serve: DatabaseService, public session: sessionStorage, public toast: ToastrManager, public dialogRef: MatDialogRef<FeedbackAddComponent>) {
    console.log(data);
  }

  ngOnInit() {
  }
  addRemark() {
    this.formData.complaint_id = this.data.id
    this.savingFlag = true;
    this.serve.post_rqst({ 'data': this.formData }, "ServiceTask/saveFeedback/"+this.data.id).subscribe((result => {
      if (result['statusCode'] == 200) {
        this.dialogRef.close(true);
        
        this.toast.successToastr(result['statusMsg']);
      }
      else {
        this.toast.errorToastr(result['statusMsg'])
        this.savingFlag = false;
      }
    }))
  }

}
