import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material';
import { ToastrManager } from 'ng6-toastr-notifications';
import { CryptoService } from 'src/_services/CryptoService';
import { DatabaseService } from 'src/_services/DatabaseService';

@Component({
  selector: 'app-add-grand-master-box',
  templateUrl: './add-grand-master-box.component.html',
  styleUrls: ['./add-grand-master-box.component.scss']
})
export class AddGrandMasterBoxComponent implements OnInit {
  filter: any = {};
  masterboxData: any = [];
  savingFlag: boolean = false;
  encryptedData: any;
  decryptedData:any;

  constructor(@Inject(MAT_DIALOG_DATA) public data, public cryptoService:CryptoService, public toast: ToastrManager, public service: DatabaseService, public dialog: MatDialogRef<AddGrandMasterBoxComponent>,) { }

  ngOnInit() {
    if (this.data.type == 'edit') {
      this.getmasterbox('', this.data.invoice_number)
    }
  }

  SaveMasterboxes() {
    this.savingFlag = true;
    this.encryptedData = this.service.payLoad ? { 'data': this.data }: this.cryptoService.encryptData({ 'data': this.data });
    this.service.post_rqst(this.encryptedData, "Dispatch/genrateMasterGrandCoupon").subscribe((result) => {
      this.decryptedData = this.service.payLoad ? result : this.cryptoService.decryptData(JSON.stringify(result));
      if (this.decryptedData['statusCode'] == 200) {
        this.savingFlag = false;
        this.toast.successToastr(this.decryptedData['statusMsg']);
        this.dialog.close(true);
      } else {
        this.savingFlag = false;
        this.toast.errorToastr(this.decryptedData['statusMsg']);
      }
    })
  }
  getmasterbox(searcValue, bill_number) {
    this.filter.coupon_code = searcValue;
    this.encryptedData = this.service.payLoad ? { 'data': { 'filter': this.filter, 'bill_number': bill_number } }: this.cryptoService.encryptData({ 'data': { 'filter': this.filter, 'bill_number': bill_number } });
    this.service.post_rqst(this.encryptedData, 'Dispatch/fetchMasterGrandCouponDropdown').subscribe((result) => {
      this.decryptedData = this.service.payLoad ? result : this.cryptoService.decryptData(JSON.stringify(result));
      if (this.decryptedData['statusCode'] == 200) {
        this.masterboxData = this.decryptedData['master_grand_coupon'];
      }
      else {
        this.toast.errorToastr(this.decryptedData['statusMsg']);
      }
    }, error => {
    })
  }
  checkqty(qty) {
    if (qty > 100) {
      this.data.total_coupon = '';
      this.toast.errorToastr('Maximum no. of boxes should not be greater than 100');

    }
    else {
    }
  }
}
