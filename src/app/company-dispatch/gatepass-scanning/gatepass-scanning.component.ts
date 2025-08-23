import { Component, OnInit, ElementRef, ViewChild, } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrManager } from 'ng6-toastr-notifications';
import { CryptoService } from 'src/_services/CryptoService';
import { DatabaseService } from 'src/_services/DatabaseService';
import { sessionStorage } from 'src/app/localstorage.service';

@Component({
  selector: 'app-gatepass-scanning',
  templateUrl: './gatepass-scanning.component.html'
})
export class GatepassScanningComponent implements OnInit {
  @ViewChild('focusInput') inputEl: ElementRef;
  skLoading: boolean = false;
  loader: boolean = false;
  gatepassdetaildata: any = {};
  userData: any;
  data: any = {};
  id: any;
  assign_login_data: any = {};
  logined_user_data: any = {};
  couponNumber: any = {};
  mastercartendata: any = [];
  enable: boolean = false
  savingFlag: boolean = false;
  company_name: any;
  encryptedData: any;
  decryptedData:any;


  constructor(public service: DatabaseService,  public cryptoService:CryptoService, public toast: ToastrManager, public route: ActivatedRoute, public rout: Router, public session: sessionStorage) {
    this.userData = JSON.parse(localStorage.getItem('st_user'));
    this.data.created_by_id = this.userData['data']['id'];
    this.data.created_by_name = this.userData['data']['name'];
    this.assign_login_data = this.session.getSession();
    this.logined_user_data = this.assign_login_data.value.data;
    this.couponNumber.scanning_type = 'Scanning';


    this.route.params.subscribe(params => {
      this.id = params.id;
    });
  }

  ngOnInit() {
    this.gatepassdetail();
    this.gatePassPrint();
  }

  ngAfterViewInit() {
    setTimeout(() => {

      this.inputEl.nativeElement.focus();
    }, 100);

  }
  gatepassdetail() {
    this.skLoading = true;
    this.encryptedData = this.service.payLoad ? { 'id': this.id }: this.cryptoService.encryptData({ 'id': this.id });
    this.service.post_rqst(this.encryptedData, "Dispatch/gateScanList").subscribe((result => {
      this.decryptedData = this.service.payLoad ? result : this.cryptoService.decryptData(JSON.stringify(result));
      if (this.decryptedData['statusCode'] == 200) {
        this.skLoading = false;
        this.gatepassdetaildata = this.decryptedData['detail'];
        this.mastercartendata = this.decryptedData['result'];
        this.company_name = this.mastercartendata[0]['company_name'];
        this.couponNumber.coupon_number = '';
        for (let i = 0; i < this.mastercartendata.length; i++) {
          if (this.mastercartendata[i]['scanned'] == 0) {
            this.enable = false;
            return;
          }
          else {
            this.enable = true;
          }
        }
        this.service.count_list();
      } else {
        this.skLoading = false;
        this.service.count_list();
        this.toast.errorToastr(this.decryptedData['statusMsg'])
      }
    }))
  }


  printData: any = [];
  gatePassPrint() {
    this.skLoading = true;
    this.encryptedData = this.service.payLoad ? { 'id': this.id }: this.cryptoService.encryptData({ 'id': this.id });
    this.service.post_rqst(this.encryptedData, "Dispatch/gateScanListForPrint")
      .subscribe((result => {
        this.decryptedData = this.service.payLoad ? result : this.cryptoService.decryptData(JSON.stringify(result));

        if ( this.decryptedData['statusCode'] == 200) {
          this.printData =  this.decryptedData['result'];
          this.skLoading = false;
          this.service.count_list();
        } else {
          this.skLoading = false;
          this.toast.errorToastr( this.decryptedData['statusMsg'])
        }
      }))
  }




  checkCoupon(coupon) {
    if (coupon.length == 9 && this.couponNumber.scanning_type == 'Scanning') {
      this.scanApi(coupon);
    }

    if (this.couponNumber.scanning_type != 'Scanning') {
      this.scanApi(coupon);
    }
  }

  scanApi(coupon) {
    this.encryptedData = this.service.payLoad ? { 'data': { 'id': this.id, 'coupon_code': coupon } }: this.cryptoService.encryptData({ 'data': { 'id': this.id, 'coupon_code': coupon } });
    this.service.post_rqst(this.encryptedData, "Dispatch/scanGrandMaster").subscribe((result => {
    this.decryptedData = this.service.payLoad ? result : this.cryptoService.decryptData(JSON.stringify(result));

      if (this.decryptedData['statusCode'] == 200) {
        this.loader = true;
        this.mastercartendata = [];
        let enData
        enData = this.service.payLoad ? { 'id': this.id }: this.cryptoService.encryptData({ 'id': this.id });
        this.service.post_rqst(enData, "Dispatch/gateScanList").subscribe((result => {
          let deData
          deData = this.service.payLoad ? result : this.cryptoService.decryptData(JSON.stringify(result));
          if (deData['statusCode'] == 200) {
            this.loader = false;
            this.gatepassdetail();
          } else {
            this.loader = false;
            this.gatepassdetail();
            this.toast.errorToastr(deData['statusMsg'])
          }
        }))
      }
      else {
        this.toast.errorToastr(this.decryptedData['statusMsg']);
        this.couponNumber.coupon_number = '';
      }


    }));
  }

  scanningSave(id) {
    this.savingFlag = true;
    this.encryptedData = this.service.payLoad ? { 'data': { 'id': id } }: this.cryptoService.encryptData({ 'data': { 'id': id } });
    this.service.post_rqst(this.encryptedData, "Dispatch/printGatepass")
      .subscribe((result => {
      this.decryptedData = this.service.payLoad ? result : this.cryptoService.decryptData(JSON.stringify(result));

        if (this.decryptedData['statusCode'] == 200) {
          this.enable = false;
          this.savingFlag = false;
          this.rout.navigate(['company-dispatch']);
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

        } else {
          this.savingFlag = false;
          this.toast.errorToastr(this.decryptedData['statusMsg'])
        }
      }))
  }
}
