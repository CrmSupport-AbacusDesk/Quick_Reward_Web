import { Component, Inject, OnInit } from '@angular/core';
import { DatabaseService } from 'src/_services/DatabaseService';
import { DialogComponent } from 'src/app/dialog.component';
import { ToastrManager } from 'ng6-toastr-notifications';
import { MatDialog, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';

@Component({
  selector: 'app-add-complaint-remark',
  templateUrl: './add-complaint-remark.component.html',
  styleUrls: ['./add-complaint-remark.component.scss']
})
export class AddComplaintRemarkComponent implements OnInit {
  id;
  savingFlag:boolean = false;

  form_data:any={};

  constructor(@Inject(MAT_DIALOG_DATA) public data,public dialogRef: MatDialogRef<AddComplaintRemarkComponent>,public service: DatabaseService,public toast: ToastrManager,public alert:DialogComponent,public dialog:MatDialog) { }

  ngOnInit() {
  }

  submit() {
    // this.userCheck = false;
    this.savingFlag = true;
    this.service.post_rqst({'complaint_id':this.data.id,'msg':this.form_data.msg}, "ServiceTask/addComplaintRemark").subscribe((result => {
      if(result['statusCode'] == 200){
        this.toast.successToastr(result['statusMsg']);
        this.dialogRef.close(true);
        setTimeout(() => {
          this.savingFlag = false;
        }, 700);
      }
      else {
        this.toast.errorToastr(result['statusMsg']);
      }
    }))
    
  }

}
