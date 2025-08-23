import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialog } from '@angular/material';
import { DatabaseService } from 'src/_services/DatabaseService';
import { Router } from '@angular/router';
import { ToastrManager } from 'ng6-toastr-notifications';

@Component({
  selector: 'app-product-qr-code-model',
  templateUrl: './product-qr-code-model.component.html',
  styleUrls: ['./product-qr-code-model.component.scss']
})
export class ProductQrCodeModelComponent implements OnInit {
  form: any = {};
  product_id: any;
  product_name: any;
  product_code: any;

  constructor(@Inject(MAT_DIALOG_DATA) public data, public serve: DatabaseService, public rout: Router, public dialog2: MatDialog, public toast: ToastrManager) {
    this.product_id = data.product_id;
    this.product_name = data.product_name;
    this.product_code = data.product_code;
  }

  ngOnInit() {
  }

  submit_qrCode() {
    this.form.product_id = this.product_id;
    this.serve.post_rqst(this.form, "Product/submit_qrCode").subscribe(result => {
      this.dialog2.closeAll();
      this.toast.successToastr("QR Code Generated Successfully");
    });
  }
}
