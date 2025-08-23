import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material';
import { CryptoService } from 'src/_services/CryptoService';
import { DatabaseService } from 'src/_services/DatabaseService';

@Component({
    selector: 'app-order-dispatch',
    templateUrl: './order-dispatch.component.html',
})
export class OrderDispatchComponent implements OnInit {
    loader: any = 1;
    order_id: any = 0;
    order_detail: any = [];
    order_item: any = [];
    logIN_user: any;
    uid: any;
    userData: any;
    userId: any;
    userName: any;
    encryptedData: any;
  decryptedData:any;

    constructor(@Inject(MAT_DIALOG_DATA) public data, public cryptoService:CryptoService,  public dialog: MatDialog, public service: DatabaseService) {
        this.order_id = data['order_id'];
        this.logIN_user = JSON.parse(localStorage.getItem('st_user'));
        this.uid = this.logIN_user['data']['id'];
    }

    ngOnInit() {
        this.orderDetail();
    }

    orderDetail() {
        this.loader = 1;
        let id = { 'order_id': this.order_id }
        this.encryptedData = this.service.payLoad ? id: this.cryptoService.encryptData(id);
        this.service.post_rqst(this.encryptedData, "Order/order_detail").subscribe((result => {
             this.decryptedData = this.service.payLoad ? result : this.cryptoService.decryptData(JSON.stringify(result));
            this.order_detail = this.decryptedData['order_detail'];
            this.order_item = this.decryptedData['order_detail']['order_item'];
            this.order_detail.order_cgst = this.order_detail.order_gst / 2;
            this.order_detail.order_cgst = parseFloat(this.order_detail.order_cgst).toFixed(2);
            setTimeout(() => {
                this.loader = '';

            }, 700);
        }))
    }



    update_order() {
        this.encryptedData = this.service.payLoad ? { 'order_id': this.order_id, "data": this.order_item, 'dr_id': this.order_detail.dr_id, 'uid': this.uid, 'loginid': this.userId, 'uname': this.userName }: this.cryptoService.encryptData({ 'order_id': this.order_id, "data": this.order_item, 'dr_id': this.order_detail.dr_id, 'uid': this.uid, 'loginid': this.userId, 'uname': this.userName });
        this.service.post_rqst(this.encryptedData, "Order/dispatch_order")
            .subscribe(result => {
                this.decryptedData = this.service.payLoad ? result : this.cryptoService.decryptData(JSON.stringify(result));
                if (this.decryptedData['dispatch_order'] == 'success') {
                    this.dialog.closeAll();
                }
            })
    }

    check_qty(indx) {
        if (this.order_item[indx]['dispatchQty'] == null) {
            this.order_item[indx]['dispatchQty'] = 0;
        }

        // if(this.order_item[indx]['dispatchQty'] == 0)
        // {
        //     this.order_item[indx]['dispatchQty'] = this.order_item[indx]['pending_qty'];
        // }

        if (parseInt(this.order_item[indx]['dispatchQty']) > parseInt(this.order_item[indx]['pending_qty'])) {
            this.order_item[indx]['dispatchQty'] = this.order_item[indx]['pending_qty'];
        }
    }
}
