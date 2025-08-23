import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material';
import { ToastrManager } from 'ng6-toastr-notifications';
import { DatabaseService } from 'src/_services/DatabaseService';
import { AddGrandMasterBoxComponent } from '../add-grand-master-box/add-grand-master-box.component';
import { DialogComponent } from 'src/app/dialog.component';
import { CryptoService } from 'src/_services/CryptoService';

@Component({
  selector: 'app-view-master-box-dispatch-detail',
  templateUrl: './view-master-box-dispatch-detail.component.html'
})
export class ViewMasterBoxDispatchDetailComponent implements OnInit {
  loader: boolean = false;
  smallBoxlisting: any = [];
  noScanListing: any = [];
  viewType: any;
  deleteItem: boolean = false;
  encryptedData: any;
  decryptedData:any;

  constructor(@Inject(MAT_DIALOG_DATA) public data, public cryptoService:CryptoService, public toast: ToastrManager, public service: DatabaseService, public dialog1: DialogComponent, public dialogRef: MatDialogRef<ViewMasterBoxDispatchDetailComponent>, public dialog: MatDialog,) {
  }

  ngOnInit() {
    this.viewType = this.data.type
    this.getMasterboxdata()

  }
  getMasterboxdata() {
    this.loader = true;
    this.encryptedData = this.service.payLoad ? { 'data': { 'id': this.data.main_data.id, 'type': this.viewType } }: this.cryptoService.encryptData({ 'data': { 'id': this.data.main_data.id, 'type': this.viewType } });
    this.service.post_rqst(this.encryptedData, "Dispatch/fetchMasterGrandCouponDetail").subscribe((result) => {
      this.decryptedData = this.service.payLoad ? result : this.cryptoService.decryptData(JSON.stringify(result));
      if (this.decryptedData['statusCode'] == 200) {
        this.loader = false
        this.smallBoxlisting = this.decryptedData['master_grand_coupon'];
        this.noScanListing = this.decryptedData['no_scan_master_grand_coupon'];

      } else {
        this.toast.errorToastr(this.decryptedData['statusMsg']);
      }
    })
  }
  changeMasterbox(data, type) {
    const dialogRef = this.dialog.open(AddGrandMasterBoxComponent, {
      width: '500px',
      data: {
        data,
        type
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      this.getMasterboxdata()

    });
  }

  closeDialog() {
    this.dialog.closeAll()
  }

  removeItem(id, order_id, master_box_id) {
    this.dialog1.confirm('Do you want to remove it from ' + this.data.main_data.coupon_code).then((res) => {
      if (res) {
        this.encryptedData = this.service.payLoad ? { 'product_id': id, 'order_id': order_id, 'master_box_id': master_box_id }: this.cryptoService.encryptData({ 'product_id': id, 'order_id': order_id, 'master_box_id': master_box_id });
        this.service.post_rqst(this.encryptedData, "Dispatch/deleteNoScanDispatch").subscribe((result => {
          this.decryptedData = this.service.payLoad ? result : this.cryptoService.decryptData(JSON.stringify(result));
          if (this.decryptedData['statusCode'] == 200) {
            this.toast.successToastr(this.decryptedData['statusMsg']);
            this.deleteItem = true;
            this.getMasterboxdata();
          } else {
            this.toast.errorToastr(this.decryptedData['statusMsg']);
          }
        }));
      }
    });
  }

  closeRefresh() {
    this.dialogRef.close(true);
  }

}
