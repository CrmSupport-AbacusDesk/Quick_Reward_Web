import { Component, OnInit, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { ActivatedRoute, Router } from '@angular/router';
import { data } from 'jquery';
import { ToastrManager } from 'ng6-toastr-notifications';
import { DatabaseService } from 'src/_services/DatabaseService';
import { ViewMasterBoxDispatchDetailComponent } from 'src/app/company-dispatch/view-master-box-dispatch-detail/view-master-box-dispatch-detail.component';
import { DialogComponent } from 'src/app/dialog.component';

@Component({
  selector: 'app-generate-master-box',
  templateUrl: './generate-master-box.component.html'
})
export class GenerateMasterBoxComponent implements OnInit {
  @ViewChild('focusInput') inputEl: ElementRef;


  id: any;
  couponNumber: any = {};
  filter: any = {};
  data: any = {};
  product_data: any = []
  masterboxData: any = [];
  invoice_detail: any = {}
  masterdispatchboxitemdetail: any = [];
  skLoading: boolean = false;
  gatePassAssign: any = [];
  billing_list: any = [];
  dispatch_detail: any = {};
  payment_list: any = [];
  dispatch_coupon: any = [];
  dispatchItem: any = [];
  dispatch_status: any = 'Pending';
  temCoupon: any = [];
  printdata: any = [];
  masterQTY: any = 0;
  organisation_name: any;
  cartennumber: any;
  loader: boolean = false;
  viewType: any;
  btnFlag: boolean = false;





  constructor(
    public route: ActivatedRoute,
    public rout: Router,
    public service: DatabaseService,
    public toast: ToastrManager,
    public dialog: MatDialog,
    public dialogs: DialogComponent,
    public serve: DatabaseService
  ) { }

  ngOnInit() {
    this.viewType = this.data.type
    this.getmasterbox('')
    this.getdispatchMasterboxdetail();
  }


  getdispatchMasterboxdetail() {
    this.service.post_rqst({ 'data': data }, 'Dispatch/fetchCarton').subscribe((result) => {
      if (result['statusCode'] == 200) {
        this.masterdispatchboxitemdetail = result['master_grand_coupon']
      }
      else {
        this.toast.errorToastr(result['statusMsg']);
        // this.couponNumber =  {};
      }
    });
  }

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
          this.dispatchItems(number, couponGrandMasterId);
        }
      }
      else {
        this.couponNumber.coupon_number = '';
        this.clearValue();
        this.dispatchItems(number, couponGrandMasterId);
      }

    }
  }




  dispatchItems(number, couponGrandMasterId) {
    this.dispatchItem = [];
    this.service.post_rqst({ 'coupon_code': number, 'product_id': this.data.product_id, 'bill_dispatch_type': this.invoice_detail.bill_dispatch_type, 'dr_code': this.invoice_detail.dr_code, 'created_by_name': this.data.created_by_name, 'created_by_id': this.data.created_by_id, 'company_name': this.invoice_detail.company_name, 'invoice_id': this.id, 'invoice_no': this.invoice_detail.order_no, 'couponGrandMasterId': couponGrandMasterId }, 'Dispatch/checkCartonCheck').subscribe((result) => {
      if (result['statusCode'] == 200 && result['statusMsg'] == 'Success') {
        this.temCoupon.push(result['coupon_details'])
        this.toast.successToastr(result['statusMsg']);
      }
      else {
        if (result['statusMsg'] == 'Coupon not exist.') {
          for (let i = 0; i < this.temCoupon.length; i++) {
            if (this.temCoupon[i]['coupon_no'] == number) {
              this.temCoupon[i]['status'] = result['statusMsg'];
              this.temCoupon[i]['product_detail'] = result['product_detail'];
            }
          }
          this.couponNumber.coupon_number = '';
        }
        this.toast.errorToastr(result['statusMsg']);
      }
      this.couponNumber.coupon_number = '';
      this.getmasterbox('')
      this.getdispatchMasterboxdetail()
    });
  }



  clearValue() {
    this.couponNumber.coupon_number = '';
  }


  addGrandmasterboxes() {
    let data = { 'total_coupon': 1 };
    this.btnFlag = true;
    this.service.post_rqst({ 'data': data }, "Dispatch/genrateCartonCoupon").subscribe((result) => {
      if (result['statusCode'] == 200) {
        this.toast.successToastr(result['statusMsg']);
        this.getmasterbox('')
        this.getdispatchMasterboxdetail();
        this.btnFlag = false;
      } else {
        this.btnFlag = false;
        this.toast.errorToastr(result['statusMsg']);
      }
    })
  }
  getmasterbox(searcValue) {
    this.filter.coupon_code = searcValue;
    this.service.post_rqst({}, 'Dispatch/fetchCartonDropdown').subscribe((resp) => {
      if (resp['statusCode'] == 200) {
        this.masterboxData = resp['master_grand_coupon'];
      }
      else {
        this.toast.errorToastr(resp['statusMsg']);
      }
    }, error => {
    })
  }
  deletemasterboxes(data, number) {
    this.dialogs.confirm("Delete Master Box?").then((result) => {
      if (result) {
        this.service.post_rqst({ 'data': data }, 'Dispatch/deleteCartonBox').subscribe((resp) => {
          if (resp['statusCode'] == 200) {
            this.toast.successToastr(resp['statusMsg']);
            this.getmasterbox('');
            this.getdispatchMasterboxdetail();
          }
          else {
            this.toast.errorToastr(resp['statusMsg']);
            return;
          }
        }, error => {
        })
      }
    })
  }

  reOpenMasterBox(data, number) {
    this.dialogs.confirm("Do You Want To Re Open Master Box?").then((result) => {
      if (result) {
        this.service.post_rqst({ 'data': data }, 'Dispatch/reOpenCarton').subscribe((resp) => {
          if (resp['statusCode'] == 200) {
            this.toast.successToastr('Re Open Successfully..');
            this.getdispatchMasterboxdetail();
          }
          else {
            this.toast.errorToastr(resp['statusMsg']);
            return;
          }
        }, error => {
        })
      }
    })
  }
  viewmasterboxdetail(maindata, type) {
    let data = { 'main_data': maindata, 'type': type }
    const dialogRef = this.dialog.open(ViewMasterBoxDispatchDetailComponent, {
      width: '1000px',
      data

    });
    dialogRef.afterClosed().subscribe(result => {
      if (result == true) {
      }

    });
  }

  printData(data, invoice): void {
    this.service.post_rqst({ 'data': { 'id': data.id, 'bill_number': invoice, 'invoice_id': this.id, 'print': 'yes' } }, 'Dispatch/fetchCartonForPrint').subscribe((resp) => {
      if (resp['statusCode'] == 200) {
        this.printdata = resp['master_grand_coupon'];
        if (this.printdata.length > 0) {
          this.masterQTY = 0;
          for (let i = 0; i < this.printdata.length; i++) {
            this.masterQTY += this.printdata[i]['totalItems']
          }
        }
        this.organisation_name = resp['organisation_name'];
        this.cartennumber = resp['coupon_code'];

      }
      else {
        this.toast.errorToastr(resp['statusMsg']);
        return;
      }
    }, error => {
    })
    setTimeout(() => {
      if (this.printdata) {

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
    }, 500);
  }

}
