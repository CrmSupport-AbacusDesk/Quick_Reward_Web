import { Component, Inject, OnInit, Renderer2 } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrManager } from 'ng6-toastr-notifications';
import { DatabaseService } from 'src/_services/DatabaseService';
import { DialogComponent } from 'src/app/dialog.component';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material';

@Component({
  selector: 'app-service-payment-add',
  templateUrl: './service-payment-add.component.html',
  styleUrls: ['./service-payment-add.component.scss']
})
export class ServicePaymentAddComponent implements OnInit {
  
  formData:any={}
  savingFlag:boolean = false;
  
  constructor(@Inject(MAT_DIALOG_DATA) public data,public service: DatabaseService,public rout: Router,public toast: ToastrManager,private route: ActivatedRoute,public dialog: DialogComponent,public dialog2: MatDialog,public dialogRef: MatDialogRef<ServicePaymentAddComponent>)  {
    this.formData.invoice_id= this.data.invoice_id;
    this.formData.invoice_final_amount= this.data.invoice_final_amount;
   }
  
  ngOnInit() {
  }
  
  addPayment() {
    this.formData = this.formData
    this.savingFlag = true;
    this.service.post_rqst({"data":this.formData }, "ServiceInvoice/savePaymentData").subscribe((result => {
      if (result['statusCode'] == 200) {
        this.dialogRef.close(true);
        this.toast.successToastr(result['statusMsg']);
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
