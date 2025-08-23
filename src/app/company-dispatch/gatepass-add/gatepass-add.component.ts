import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { DatabaseService } from 'src/_services/DatabaseService';
import { sessionStorage } from 'src/app/localstorage.service';
import { ToastrManager } from 'ng6-toastr-notifications';
import { DialogComponent } from 'src/app/dialog.component';
import { CryptoService } from 'src/_services/CryptoService';


@Component({
  selector: 'app-gatepass-add',
  templateUrl: './gatepass-add.component.html'
})
export class GatepassAddComponent implements OnInit {
  skLoading: boolean = false;
  savingFlag: boolean = false;
  gatePassAssign: any = [];
  data: any = {};
  assign_login_data: any = {};
  logined_user_data: any = {};
  modalData: any = {};
  itemData: any = [];
  dispatchItems: any = [];
  noScanItem: any = [];
  encryptedData: any;
  decryptedData:any;


  constructor(public service: DatabaseService, public cryptoService:CryptoService, public toast: ToastrManager, @Inject(MAT_DIALOG_DATA) public modal_data, public session: sessionStorage, public dialog: MatDialog, public dialogRef: MatDialogRef<GatepassAddComponent>, public dialog1: DialogComponent) {
    this.modalData = modal_data;
    this.assign_login_data = this.session.getSession();
    this.logined_user_data = this.assign_login_data.value.data;
    if (this.modalData.model_type == 'add') {
      this.gatePassAssign = modal_data.gatePassAssign;
    }
    if (this.modalData.model_type == 'sales_return') {
      this.getSaleReturn()
    }
    if (this.modalData.gatepass_id) {
      this.getDetails();
    }
    if (this.modalData.model_type == 'manual_entry') {
      this.noScanItem = this.modalData.noScanItem;
    }
  }
  ngOnInit() {
  }








  submitDetail() {
    let alertText

    if (this.data.id) {
      alertText = "You want to update gatepass?"
    }
    else {
      alertText = "You want to generate gatepass?"
    }

    this.dialog1.confirm(alertText).then((res) => {
      if (res) {
        if (this.logined_user_data.id == '1') {
          this.data.branch_code = this.data.branch_code
        }
        else {
          this.data.branch_code = this.logined_user_data.branch_code;
        }
        this.data.created_by_name = this.logined_user_data.name;
        this.data.created_by_id = this.logined_user_data.id;
        this.savingFlag = true;
        this.dialogRef.disableClose = true;
        let header
          this.encryptedData = this.service.payLoad ? { 'data': this.data }: this.cryptoService.encryptData({ 'data': this.data });

        if (this.data.id) {
          header = this.service.post_rqst(this.encryptedData, "Dispatch/updateGatePass")
        }
        else {
          this.data.invoice_data = this.gatePassAssign;
          header = this.service.post_rqst(this.encryptedData, "Dispatch/generateGatePass")
        }

        header.subscribe((result => {
            this.decryptedData = this.service.payLoad ? result : this.cryptoService.decryptData(JSON.stringify(result));

          if (this.decryptedData['statusCode'] == "200") {
            this.toast.successToastr(this.decryptedData['statusMsg']);
            this.dialogRef.close();
            this.savingFlag = false;

          }
          else {
            this.toast.errorToastr(this.decryptedData['statusMsg']);
            this.savingFlag = false;
          }
        }));
      }
    });
  }

  getSaleReturn() {
    this.skLoading = true;
    this.encryptedData = this.service.payLoad ? { 'invoice_number': this.modal_data.invoice_number }: this.cryptoService.encryptData({ 'invoice_number': this.modal_data.invoice_number },);
    this.service.post_rqst(this.encryptedData, "Dispatch/getSalesReturnDetails").subscribe((result => {
    this.decryptedData = this.service.payLoad ? result : this.cryptoService.decryptData(JSON.stringify(result));
      if (this.decryptedData['statusCode'] == 200) {
        this.itemData = this.decryptedData['result'];
        this.skLoading = false;
      } else {
        this.toast.errorToastr(this.decryptedData['statusMsg']);
        this.skLoading = false;
      }
    }))
  }



  gatePassDetail: any = {};
  company_name: any
  getDetails() {
    this.skLoading = true;
    this.encryptedData = this.service.payLoad ? { 'id': this.modalData.gatepass_id }: this.cryptoService.encryptData({ 'id': this.modalData.gatepass_id });

    this.service.post_rqst(this.encryptedData, "Dispatch/getGatePassDetail").subscribe((result => {
     this.decryptedData = this.service.payLoad ? result : this.cryptoService.decryptData(JSON.stringify(result));

      if (this.decryptedData['statusCode'] == 200) {
        this.gatePassDetail = this.decryptedData['result'];
        if (this.modalData.model_type == 'update') {
          this.data = this.gatePassDetail;
          this.data.delivery_boy_id = this.data.delivery_boy_id.toString();
          this.gatePassAssign = this.data.invoice;
        }
        if (this.modalData.model_type == 'detail') {
          this.data = this.gatePassDetail;
          this.gatePassAssign = this.data.invoice;
          this.company_name = this.gatePassAssign[0]['company_name'];
        }
        this.skLoading = false;
      } else {
        this.toast.errorToastr(this.decryptedData['statusMsg']);
        this.skLoading = false;

      }
    }))
  }



  checkValidation(sale_qty, order_remaining, sale_dispatch_qty, index) {
    if (order_remaining == 0) {
      if ((parseInt(sale_dispatch_qty)) > sale_qty) {
        this.toast.errorToastr('Row number ' + index + ' dispatch QTY. can not be greater than QTY.');
        return;
      }
    }
    if (order_remaining > 0) {
      if ((sale_dispatch_qty > parseInt(sale_qty) - parseInt(order_remaining))) {
        let value = parseInt(sale_qty) - parseInt(order_remaining)
        this.toast.errorToastr('Row number ' + index + ' dispatch QTY. can not be greater than remaining QTY.' + value);
        return;
      }
    }
  }


  updateDispatch() {
    this.dialog1.confirm('Do you want to dispatch').then((res) => {
      if (res) {

        for (let i = 0; i < this.noScanItem.length; i++) {
          if (parseInt(this.noScanItem[i]['order_remaining']) == 0) {
            if (parseInt(this.noScanItem[i]['sale_dispatch_qty']) > parseInt(this.noScanItem[i]['sale_qty'])) {
              let row_no = i + 1;
              this.toast.errorToastr('Row number ' + row_no + ' dispatch QTY. can not be greater than  QTY. ' + this.noScanItem[i]['sale_qty']);
              return;
            }
          }

          if (parseInt(this.noScanItem[i]['order_remaining']) > 0) {
            if (parseInt(this.noScanItem[i]['sale_dispatch_qty']) > parseInt(this.noScanItem[i]['sale_qty']) - parseInt(this.noScanItem[i]['order_remaining'])) {
              let row_no = i + 1;
              let value = parseInt(this.noScanItem[i]['sale_qty']) - parseInt(this.noScanItem[i]['order_remaining'])
              this.toast.errorToastr('Row number ' + row_no + ' dispatch QTY. can not be greater than remaining QTY.' + value);
              return;
            }
          }
        }
        this.savingFlag = true;
        this.encryptedData = this.service.payLoad ? { 'dr_code': this.modal_data.dr_data.dr_code, 'dr_id': this.modal_data.dr_data.dr_id, 'dr_name': this.modal_data.dr_data.company_name, 'master_coupon_id': this.modal_data.master_coupon_id, 'id': this.modal_data.dispacth_detail_id, 'no_scan_item': this.noScanItem }: this.cryptoService.encryptData({ 'dr_code': this.modal_data.dr_data.dr_code, 'dr_id': this.modal_data.dr_data.dr_id, 'dr_name': this.modal_data.dr_data.company_name, 'master_coupon_id': this.modal_data.master_coupon_id, 'id': this.modal_data.dispacth_detail_id, 'no_scan_item': this.noScanItem });
        this.service.post_rqst(this.encryptedData, "Dispatch/updateDispatchForNoScanning").subscribe((result => {
          this.decryptedData = this.service.payLoad ? result : this.cryptoService.decryptData(JSON.stringify(result));
          if (this.decryptedData['statusCode'] == 200) {
            this.toast.successToastr(this.decryptedData['statusMsg']);
            this.savingFlag = false;
            this.dialogRef.close(true);
          } else {
            this.toast.errorToastr(this.decryptedData['statusMsg']);
            this.savingFlag = false;
          }
        }));
      }
    });
  }



  printData(): void {
    let printContents, popupWin;
    printContents = document.getElementById('print_card').innerHTML;
    popupWin = window.open('', '_blank', 'top=0,left=0,height=100%,width=auto');
    popupWin.document.open();

    popupWin.document.write(`
      <html>
      <head>
      <title>Print tab</title>
      <style>
      @media print {
        #qr_code_container  {
          page-break-inside: always;
          margin-bottom: 0px
        }
        @page { 
          // margin: 0.07in 0.1in 0.00in;  
        }
        
        
        
        body
        {
          font-family: 'arial';
        }
        </style>
        </head>
        <body onload="window.print();window.close()">${printContents}</body>
        </html>`
    );

    popupWin.document.close();
  }




}

