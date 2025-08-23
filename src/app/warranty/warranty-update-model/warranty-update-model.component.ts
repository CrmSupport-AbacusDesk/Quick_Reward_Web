import { Component, OnInit, Inject } from '@angular/core';
import { DatabaseService } from 'src/_services/DatabaseService';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material';
import { sessionStorage } from 'src/app/localstorage.service';
import { ToastrManager } from 'ng6-toastr-notifications';
import * as moment from 'moment';


@Component({
  selector: 'app-warranty-update-model',
  templateUrl: './warranty-update-model.component.html',
  styleUrls: ['./warranty-update-model.component.scss']
})
export class WarrantyUpdateModelComponent implements OnInit {

  formData: any = {}
  savingFlag: boolean = false;
  currentDate: Date;
  warranty_period: any;
  date_of_purchase: any;

  constructor(@Inject(MAT_DIALOG_DATA) public data, public dialog: MatDialog, public serve: DatabaseService, public session: sessionStorage, public toast: ToastrManager, public dialogRef: MatDialogRef<WarrantyUpdateModelComponent>) {
    this.warranty_period = data.period
    this.date_of_purchase = data.date_of_purchase
    const warrantyStartDate = new Date(this.date_of_purchase);
    const warrantyEnd = new Date(warrantyStartDate.getFullYear(), warrantyStartDate.getMonth() + parseInt(this.warranty_period), warrantyStartDate.getDate());
    this.formData.warranty_end_date = warrantyEnd;
  }

  ngOnInit() {
    this.currentDate = new Date();
  }


  update() {
    if (this.formData.date_of_purchase) {
      this.formData.date_of_purchase = moment(this.formData.date_of_purchase).format('YYYY-MM-DD');
      this.formData.date_of_purchase = this.formData.date_of_purchase;
    }
    if (this.formData.warranty_end_date) {
      this.formData.warranty_end_date = moment(this.formData.warranty_end_date).format('YYYY-MM-DD');
      this.formData.warranty_end_date = this.formData.warranty_end_date;
    }
    this.formData.id = this.data.id
    this.savingFlag = true;
    this.serve.post_rqst({ 'data': this.formData }, "ServiceTask/change_warranty_status").subscribe((result => {
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
