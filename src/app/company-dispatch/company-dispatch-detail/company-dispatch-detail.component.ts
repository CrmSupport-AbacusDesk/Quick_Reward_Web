import { Component, OnInit, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DatabaseService } from 'src/_services/DatabaseService';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { sessionStorage } from 'src/app/localstorage.service';
import { DialogComponent } from 'src/app/dialog.component';
import { ToastrManager } from 'ng6-toastr-notifications';
import { AddGrandMasterBoxComponent } from '../add-grand-master-box/add-grand-master-box.component';
import { ViewMasterBoxDispatchDetailComponent } from '../view-master-box-dispatch-detail/view-master-box-dispatch-detail.component';
import { GatepassAddComponent } from '../gatepass-add/gatepass-add.component';
import { CryptoService } from 'src/_services/CryptoService';

@Component({
  selector: 'app-company-dispatch-detail',
  templateUrl: './company-dispatch-detail.component.html'
})
export class CompanyDispatchDetailComponent implements OnInit {
  @ViewChild('focusInput') inputEl: ElementRef;


  elementType: any = ''
  orderType: any = 'order';
  id: any;
  data: any = {};
  couponNumber: any = {};
  savingFlag: boolean = false;
  userData: any;
  invoice_detail: any = {}
  payload: any = {}
  dispatchItem: any = [];
  payment_list: any = [];
  masterboxData: any = [];
  masterdispatchboxitemdetail: any = [];
  dispatch_coupon: any = [];
  dispatch_detail: any = {};
  skLoading: boolean = false;
  filter: any = {};
  assign_login_data: any = {};
  logined_user_data: any = {};
  printdata: any = [];
  organisation_name: any;
  cartennumber: any;
  gatePassAssign: any = [];
  assign_login_data2: any = {};
  encryptedData: any;
  decryptedData:any;


  constructor(public route: ActivatedRoute, public cryptoService:CryptoService, public service: DatabaseService, public rout: Router,
    public dialog: MatDialog, public session: sessionStorage, public dialogs: DialogComponent, public toast: ToastrManager) {

    this.userData = JSON.parse(localStorage.getItem('st_user'));
    this.data.created_by_id = this.userData['data']['id'];
    this.data.created_by_name = this.userData['data']['name'];
    this.assign_login_data = this.session.getSession();
    this.logined_user_data = this.assign_login_data.value.data;
    this.assign_login_data2 = this.assign_login_data.data;
    this.route.params.subscribe(params => {
      this.id = params.id;
    });
  }

  ngOnInit() {
    this.billDatadetail();
    this.getmasterboxnew('');
  }

  ngAfterViewInit() {
  }

  setcouponnoFocused() {
    this.inputEl.nativeElement.focus();

  }
  billDatadetail() {
    this.skLoading = true;
    this.invoice_detail = '';
    this.encryptedData = this.service.payLoad ?{ 'bill_id': this.id }: this.cryptoService.encryptData({ 'bill_id': this.id });
    this.service.post_rqst(this.encryptedData, "Dispatch/tallyInvoiceCreditBillingDetail")
      .subscribe((result => {
        this.decryptedData = this.service.payLoad ? result : this.cryptoService.decryptData(JSON.stringify(result));
        if (result['statusCode'] == 200) {
          this.invoice_detail = result['order'];
          this.payload = result['order'];
          this.gatePassAssign.push(this.invoice_detail);
          this.dispatch_detail = result['dispatch_data'];
          this.dispacthItemDetail();
          this.getdispatchMasterboxdetail();
          this.getmasterbox('', this.invoice_detail.order_no);
          this.payment_list = result['payment_list'];
          this.dispatch_coupon = result['all_dispatch'];
          this.getdispatchDetail();
          this.skLoading = false;
          this.service.count_list();
          this.couponNumber.coupon_number = '';
        } else {
          this.skLoading = false;
          this.service.count_list();
          this.toast.errorToastr(result['statusMsg'])
          this.couponNumber.coupon_number = '';
        }
      }))
  }

  openDialog(type, number): void {
    const dialogRef = this.dialog.open(GatepassAddComponent, {
      width: '1024px',
      panelClass: 'cs-modal',
      disableClose: true,

      data: {
        'model_type': type,
        'gatePassAssign': this.gatePassAssign,
        'invoice_number': number,
      }

    });
    dialogRef.afterClosed().subscribe(result => {
      if (result != false) {

      }
    });
  }


  manualAdd(type, id, coupon_code): void {
    const dialogRef = this.dialog.open(GatepassAddComponent, {
      width: '1024px',
      panelClass: 'cs-modal',
      disableClose: true,

      data: {
        'model_type': type,
        'master_coupon_id': id,
        'master_coupon_code': coupon_code,
        'dispacth_detail_id': this.id,
        'noScanItem': this.noScanItem,
        'dr_data': this.invoice_detail
      }

    });
    dialogRef.afterClosed().subscribe(result => {
      if (result == true) {
        this.billDatadetail();
      }
    });
  }



  couponList: any = [];
  temArray: any = [];
  dispatchQTY: any = 0;
  dispatchInvoice: any = 0;
  dispatch_status: any = 'Pending';
  temCoupon: any = [];
  checkCoupon(number, couponGrandMasterId) {
    if (number.length == 16) {
      if (number == undefined) {
        this.toast.errorToastr("Enter coupon code number");
        return;
      }
      if (number == '') {
        this.toast.errorToastr("Enter coupon code number");
        return;
      }

      if (this.temCoupon != '') {
        let temData = number;
        let index = this.temCoupon.findIndex(row => row.coupon_no == temData);
        if (index != -1) {
          if (this.temCoupon[index].coupon_no === temData) {
            this.couponNumber.coupon_number = '';
            this.toast.errorToastr('Coupon code already exists');
            this.clearValue();
            return
          }
          else {
            this.couponNumber.coupon_number = '';
            this.clearValue();
          }
        }
        else {
          this.couponNumber.coupon_number = '';
          this.clearValue();
          this.temCoupon.push({ 'coupon_no': number, 'status': 'Pending', 'product_detail': '' });
          this.dispatchItems(number, couponGrandMasterId);

        }
      }
      else {
        this.couponNumber.coupon_number = '';
        this.clearValue();
        this.temCoupon.push({ 'coupon_no': number, 'status': 'Pending' });
        this.dispatchItems(number, couponGrandMasterId);
      }

    }
  }
  noScanItem: any = [];
  getdispatchDetail() {
    this.dispatchItem = [];
    this.noScanItem = [];
    this.encryptedData = this.service.payLoad ? { 'invoice_id': this.id, 'dr_id': this.payload.dr_id, 'invoice_no': this.payload.order_no }: this.cryptoService.encryptData({ 'invoice_id': this.id, 'dr_id': this.payload.dr_id, 'invoice_no': this.payload.order_no });
    this.service.post_rqst(this.encryptedData, 'Dispatch/checkCouponCodeCheck').subscribe((result) => {
      this.decryptedData = this.service.payLoad ? result : this.cryptoService.decryptData(JSON.stringify(result));

      if (this.decryptedData['statusCode'] == 200) {
        this.dispatchQTY = this.decryptedData['sale_dispatch_qty'];
        this.dispatchInvoice = this.decryptedData['invoice_qty'];

        if (this.dispatchQTY == this.dispatchInvoice) {
          this.dispatch_status = 'Dispatched';
        };
        for (let i = 0; i < this.decryptedData['dispatch']['dispatch_item'].length; i++) {
          this.dispatchItem.push({ 'product_scan': this.decryptedData['dispatch']['dispatch_item'][i]['product_scan'], 'item_code': this.decryptedData['dispatch']['dispatch_item'][i]['item_code'], 'sale_qty': this.decryptedData['dispatch']['dispatch_item'][i]['sale_qty'], 'remaining_qty': this.decryptedData['dispatch']['dispatch_item'][i]['sale_qty'], 'item_name': this.decryptedData['dispatch']['dispatch_item'][i]['item_name'], 'sale_dispatch_qty': this.decryptedData['dispatch']['dispatch_item'][i]['sale_dispatch_qty'], 'id': this.decryptedData['dispatch']['dispatch_item'][i]['id'], 'dispatch_qty': 0, })
          if (this.decryptedData['dispatch']['dispatch_item'][i]['product_scan'].toLowerCase() == 'no' && (this.decryptedData['dispatch']['dispatch_item'][i]['sale_qty'] != this.decryptedData['dispatch']['dispatch_item'][i]['sale_dispatch_qty'])) {
            // parseInt(this.decryptedData['dispatch']['dispatch_item'][i]['sale_qty']) - parseInt(this.decryptedData['dispatch']['dispatch_item'][i]['sale_dispatch_qty'])
            this.noScanItem.push({ 'item_id': this.decryptedData['dispatch']['dispatch_item'][i]['item_id'], 'product_scan': this.decryptedData['dispatch']['dispatch_item'][i]['product_scan'], 'item_code': this.decryptedData['dispatch']['dispatch_item'][i]['item_code'], 'item_name': this.decryptedData['dispatch']['dispatch_item'][i]['item_name'], 'id': this.decryptedData['dispatch']['dispatch_item'][i]['id'], 'sale_qty': this.decryptedData['dispatch']['dispatch_item'][i]['sale_qty'], 'sale_dispatch_qty': 0, 'order_remaining': this.decryptedData['dispatch']['dispatch_item'][i]['sale_dispatch_qty'] })
          }
        }
        if (this.dispatchItem.length == 0) {
          this.rout.navigate(['company-dispatch']);
        }
        this.couponNumber.coupon_number = '';
      }
      else {
        this.couponNumber.coupon_number = '';
        this.toast.errorToastr(this.decryptedData['statusMsg']);
      }
    });
  }




  dispatchedCoupon: any = {};


  dispatchItems(number, couponGrandMasterId) {
    this.dispatchItem = [];
    this.noScanItem = [];
    this.encryptedData = this.service.payLoad ? { 'coupon_code': number, 'dr_id': this.payload.dr_id, 'dispatch_status': this.dispatch_status, 'bill_dispatch_type': this.payload.bill_dispatch_type, 'dr_code': this.payload.dr_code, 'created_by_name': this.data.created_by_name, 'created_by_id': this.data.created_by_id, 'company_name': this.payload.company_name, 'invoice_id': this.id, 'invoice_no': this.payload.order_no, 'couponGrandMasterId': couponGrandMasterId }: this.cryptoService.encryptData({ 'coupon_code': number, 'dr_id': this.payload.dr_id, 'dispatch_status': this.dispatch_status, 'bill_dispatch_type': this.payload.bill_dispatch_type, 'dr_code': this.payload.dr_code, 'created_by_name': this.data.created_by_name, 'created_by_id': this.data.created_by_id, 'company_name': this.payload.company_name, 'invoice_id': this.id, 'invoice_no': this.payload.order_no, 'couponGrandMasterId': couponGrandMasterId });
    this.service.post_rqst(this.encryptedData, 'Dispatch/checkCouponCodeCheck').subscribe((result) => {
    this.decryptedData = this.service.payLoad ? result : this.cryptoService.decryptData(JSON.stringify(result));
      if (this.decryptedData['statusCode'] == 200) {
        this.dispatchedCoupon = this.decryptedData['coupon_code'];
        this.dispatchQTY = this.decryptedData['sale_dispatch_qty'];
        this.dispatchInvoice = this.decryptedData['invoice_qty'];
        this.dispatchItem = this.decryptedData['dispatch'];

        if (this.dispatchItem.length > 0) {
          for (let i = 0; i < this.dispatchItem.length; i++) {
            if (this.dispatchItem[i]['product_scan'].toLowerCase() == 'no') {
              this.noScanItem.push({ 'item_code': this.dispatchItem[i]['item_code'], 'item_name': this.dispatchItem[i]['item_name'], 'id': this.dispatchItem[i]['id'], 'sale_qty': this.dispatchItem[i]['sale_qty'], 'order_remaining': this.dispatchItem[i]['sale_dispatch_qty'], 'sale_dispatch_qty': parseInt(this.dispatchItem[i]['sale_qty']) - parseInt(this.dispatchItem[i]['sale_dispatch_qty']) })
            }
          }

        }

        if (this.dispatchedCoupon) {
          for (let i = 0; i < this.temCoupon.length; i++) {
            if (this.temCoupon[i]['coupon_no'] == this.dispatchedCoupon) {
              if (this.decryptedData['statusMsg'] != 'Success') {
                this.toast.errorToastr(this.decryptedData['statusMsg']);
              }

              this.temCoupon[i]['status'] = this.decryptedData['statusMsg'];
              this.temCoupon[i]['product_detail'] = this.decryptedData['product_detail'];
              this.billDatadetail()
            }
          }
        }

      }
      else {
        if (this.decryptedData['coupon_code']) {
          this.dispatchedCoupon = this.decryptedData['coupon_code'];
          for (let i = 0; i < this.temCoupon.length; i++) {
            if (this.temCoupon[i]['coupon_no'] == this.dispatchedCoupon) {
              if (this.decryptedData['statusMsg'] != 'Success') {
                this.toast.errorToastr(this.decryptedData['statusMsg']);
              }
              this.temCoupon[i]['status'] = this.decryptedData['statusMsg'];
              this.temCoupon[i]['product_detail'] = this.decryptedData['product_detail'];
            }
          }
          this.couponNumber.coupon_number = '';
          this.billDatadetail()
        }
        else {
          if (this.decryptedData['statusMsg'] == 'Coupon not exist.') {
            for (let i = 0; i < this.temCoupon.length; i++) {
              if (this.temCoupon[i]['coupon_no'] == number) {
                this.temCoupon[i]['status'] = this.decryptedData['statusMsg'];
                this.temCoupon[i]['product_detail'] = this.decryptedData['product_detail'];
              }
            }
            this.couponNumber.coupon_number = '';
          }
          this.toast.errorToastr(this.decryptedData['statusMsg']);
        }
      }
      this.couponNumber.coupon_number = '';
    })
  }


  clearValue() {
    this.couponNumber.coupon_number = '';
  }


  getdispatchMasterboxdetail() {
    this.encryptedData = this.service.payLoad ? { 'data': { 'invoice_id': this.id, 'bill_number': this.invoice_detail.order_no } }: this.cryptoService.encryptData({ 'data': { 'invoice_id': this.id, 'bill_number': this.invoice_detail.order_no } });
    this.service.post_rqst(this.encryptedData, 'Dispatch/fetchMasterGrandCoupon').subscribe((result) => {
    this.decryptedData = this.service.payLoad ? result : this.cryptoService.decryptData(JSON.stringify(result));
      if (this.decryptedData['statusCode'] == 200) {
        this.masterdispatchboxitemdetail = this.decryptedData['master_grand_coupon'];
      }
      else {
        this.toast.errorToastr(this.decryptedData['statusMsg']);
        // this.couponNumber =  {};
      }
    });
  }
  dispacthItemDetail() {
    this.encryptedData = this.service.payLoad ? { 'invoice_id': this.id, 'invoice_no': this.invoice_detail.order_no }: this.cryptoService.encryptData({ 'invoice_id': this.id, 'invoice_no': this.invoice_detail.order_no });
    this.service.post_rqst( this.encryptedData, 'Dispatch/dispatchedCouponList').subscribe((result) => {
    this.decryptedData = this.service.payLoad ? result : this.cryptoService.decryptData(JSON.stringify(result));
      if (this.decryptedData['statusCode'] == 200) {
        this.couponList = this.decryptedData['result'];
      }
      else {
        this.toast.errorToastr(this.decryptedData['statusMsg']);
      }
    })
  }

  addGrandmasterboxes(bill_number, id, type) {
    let data = { 'bill_number': bill_number, 'id': id, 'total_coupon': 1 }
    this.encryptedData = this.service.payLoad ? { 'data': data }: this.cryptoService.encryptData({ 'data': data });

    this.service.post_rqst(this.encryptedData, "Dispatch/genrateMasterGrandCoupon").subscribe((result) => {
    this.decryptedData = this.service.payLoad ? result : this.cryptoService.decryptData(JSON.stringify(result));
      if (this.decryptedData['statusCode'] == 200) {
        this.toast.successToastr(this.decryptedData['statusMsg']);
        this.billDatadetail();
      } else {
        this.toast.errorToastr(this.decryptedData['statusMsg']);
      }
    })


  }
  getmasterbox(searcValue, bill_number) {
    this.filter.coupon_code = searcValue;
    this.encryptedData = this.service.payLoad ? { 'data': { 'filter': this.filter, 'invoice_id': this.id, 'bill_number': bill_number } }: this.cryptoService.encryptData({ 'data': { 'filter': this.filter, 'invoice_id': this.id, 'bill_number': bill_number } });
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


  masterBoxCoupon: any = [];
  getmasterboxnew(searcValue) {
    this.encryptedData = this.service.payLoad ? { 'search': searcValue }: this.cryptoService.encryptData({ 'search': searcValue });
    this.service.post_rqst(this.encryptedData, 'Dispatch/fetchCartonDropdown').subscribe((result) => {
        this.decryptedData = this.service.payLoad ? result : this.cryptoService.decryptData(JSON.stringify(result));
      if (this.decryptedData['statusCode'] == 200) {
        this.masterBoxCoupon = this.decryptedData['master_grand_coupon'];
      }
      else {
        this.toast.errorToastr(this.decryptedData['statusMsg']);
      }
    }, error => {
    })
  }
  viewmasterboxdetail(maindata, type) {
    let data
    if (type == 'items') {
      data = { 'main_data': maindata, 'type': type, 'action': 'true', 'status': this.invoice_detail.order_status }
    }
    else {
      data = { 'main_data': maindata, 'type': type }
    }

    const dialogRef = this.dialog.open(ViewMasterBoxDispatchDetailComponent, {
      width: '1000px',
      data

    });
    dialogRef.afterClosed().subscribe(result => {
      if (result == true) {
        this.getdispatchMasterboxdetail();
        this.getdispatchDetail();
      }
    });
  }

  masterQTY: any = 0;
  nomasterQTY: any = 0;
  totalQty: any = 0;
  noScanListing: any = []
  printData(data, invoice): void {
    this.encryptedData = this.service.payLoad ? { 'data': { 'id': data.id, 'bill_number': invoice, 'invoice_id': this.id, 'print': 'yes' } }: this.cryptoService.encryptData({ 'data': { 'id': data.id, 'bill_number': invoice, 'invoice_id': this.id, 'print': 'yes' } });
    this.service.post_rqst(this.encryptedData, 'Dispatch/fetchMasterGrandCouponForPrint').subscribe((result) => {
    this.decryptedData = this.service.payLoad ? result : this.cryptoService.decryptData(JSON.stringify(result));
      if (this.decryptedData['statusCode'] == 200) {
        this.printdata = this.decryptedData['master_grand_coupon'];
        this.noScanListing = this.decryptedData['no_scan_master_grand_coupon'];

        if (this.printdata.length > 0) {
          this.masterQTY = 0;
          for (let i = 0; i < this.printdata.length; i++) {
            this.masterQTY += this.printdata[i]['totalItems']
          }
        }


        if (this.noScanListing.length > 0) {
          this.nomasterQTY = 0;
          for (let i = 0; i < this.noScanListing.length; i++) {
            this.nomasterQTY += this.noScanListing[i]['sale_dispatch_qty']
          }
        }
        this.organisation_name = this.decryptedData['organisation_name'];
        this.cartennumber = this.decryptedData['coupon_code'];

        this.totalQty = this.masterQTY + this.nomasterQTY;

      }
      else {
        this.toast.errorToastr(this.decryptedData['statusMsg']);
        return;
      }
    }, error => {
    })
    setTimeout(() => {
      if (this.printdata || this.noScanListing) {

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
              margin: 0.00in 0.00in  0.00in 0.00in;
            }
            
            .aclass {
              width: 70px !important;
              height: 70px !important;
              text-align:right;
            }
            
            .aclass img {
              width: 100%;
              height: 100%;
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
    }, 1000);
  }




  printItemData() {
    let printContents, popupWin;
    printContents = document.getElementById('item_print_card').innerHTML;
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
            margin: 0.00in 0.00in  0.00in 0.00in;
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

  deletemasterboxes(data, number) {
    this.dialogs.confirm("Delete Master Box?").then((res) => {
      if (res) {
        this.encryptedData = this.service.payLoad ? { 'data': { 'id': data.id, 'bill_number': number } }: this.cryptoService.encryptData({ 'data': { 'id': data.id, 'bill_number': number } });
        this.service.post_rqst(this.encryptedData, 'Dispatch/deleteGrandMasterBox').subscribe((result) => {
        this.decryptedData = this.service.payLoad ? result : this.cryptoService.decryptData(JSON.stringify(result));
          if (this.decryptedData['statusCode'] == 200) {
            this.toast.successToastr('Deleted Successfully..');
            this.billDatadetail();
          }
          else {
            this.toast.errorToastr(this.decryptedData['statusMsg']);
            return;
          }
        }, error => {
        })
      }
    })
  }


  scanProduct: any = [];

  printMasterItem() {
    this.encryptedData = this.service.payLoad ? { 'id': this.invoice_detail.id }: this.cryptoService.encryptData({ 'id': this.invoice_detail.id });
    this.service.post_rqst(this.encryptedData, 'Dispatch/fetchMasterGrandCouponCompleteForPrint').subscribe((result) => {
      this.decryptedData = this.service.payLoad ? result : this.cryptoService.decryptData(JSON.stringify(result));
      if (this.decryptedData['statusCode'] == 200) {
        this.scanProduct = this.decryptedData['offer_coupon_grand_master'];

        setTimeout(() => {
          let printContents, popupWin;
          printContents = document.getElementById('item_print_card1').innerHTML;
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
                    margin: 0.5in 0.5in  0.5in 0.5in;
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
        }, 200);
      }
      else {
        this.toast.errorToastr(this.decryptedData['statusMsg']);
        return;
      }
    }, error => {
    })
  }




  checkQty(sale_dispatch_qty, sale_qty, remaining_qty, id, i) {
    if (sale_dispatch_qty == 0) {
      if ((parseInt(remaining_qty)) > sale_qty) {
        this.toast.errorToastr('Row number ' + i + ' QTY. can not be greater than' + sale_qty);
        return;
      }
      else {
        this.updateQTY(id, remaining_qty)
      }
    }
    else {
      this.updateQTY(id, remaining_qty);
    }
  }

  updateQTY(id, remaining_qty) {
    this.savingFlag = true;
    this.encryptedData = this.service.payLoad ? { 'id': id, 'cancel_qty': remaining_qty }: this.cryptoService.encryptData({ 'id': id, 'cancel_qty': remaining_qty });
    this.service.post_rqst(this.encryptedData, 'Dispatch/deleteDispatchItem').subscribe((result) => {
    this.decryptedData = this.service.payLoad ? result : this.cryptoService.decryptData(JSON.stringify(result));
      if (this.decryptedData['statusCode'] == 200) {
        this.toast.successToastr(this.decryptedData['statusMsg']);

        this.dispatchItem = [];
        this.billDatadetail();
        this.savingFlag = false;
      }
      else {
        this.toast.errorToastr(this.decryptedData['statusMsg']);
        this.savingFlag = false;
        return;
      }
    }, error => {
    })
  }

  mainmasterboxDisable: boolean = false;
  search: any = {}

  updateGrandMasterCoupon() {
    this.encryptedData = this.service.payLoad ? { 'data': { 'dr_id': this.invoice_detail.dr_id, 'dr_code': this.invoice_detail.dr_code, 'bill_dispatch_type': this.invoice_detail.bill_dispatch_type, 'filter': this.filter, 'id': this.search.couponGrandMasterId, 'created_by_name': this.data.created_by_name, 'created_by_id': this.data.created_by_id, 'company_name': this.invoice_detail.company_name, 'invoice_id': this.id, 'invoice_no': this.invoice_detail.order_no, } }: this.cryptoService.encryptData({ 'data': { 'dr_id': this.invoice_detail.dr_id, 'dr_code': this.invoice_detail.dr_code, 'bill_dispatch_type': this.invoice_detail.bill_dispatch_type, 'filter': this.filter, 'id': this.search.couponGrandMasterId, 'created_by_name': this.data.created_by_name, 'created_by_id': this.data.created_by_id, 'company_name': this.invoice_detail.company_name, 'invoice_id': this.id, 'invoice_no': this.invoice_detail.order_no, } });
    this.service.post_rqst(this.encryptedData, "Dispatch/updateCartonCoupon").subscribe((result => {
      this.decryptedData = this.service.payLoad ? result : this.cryptoService.decryptData(JSON.stringify(result));
      if (this.decryptedData['statusCode'] == 200) {
        this.mainmasterboxDisable = true;
        this.masterboxData = this.decryptedData['master_grand_coupon']
        this.toast.successToastr('Success');
        this.billDatadetail()
      }
      else {
        this.toast.errorToastr(this.decryptedData['statusMsg'])
        this.mainmasterboxDisable = false;
      }
    }
    ))
  }
}




