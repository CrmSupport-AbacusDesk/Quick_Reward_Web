import { Component, OnInit, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { DatabaseService } from 'src/_services/DatabaseService';
import { ToastrManager } from 'ng6-toastr-notifications';
import { Router, ActivatedRoute } from '@angular/router';
import { sessionStorage } from 'src/app/localstorage.service';
import { MatDialog } from '@angular/material';
import { Location } from '@angular/common';
import { CryptoService } from 'src/_services/CryptoService';



@Component({
  selector: 'app-replacement',
  templateUrl: './replacement.component.html',
})


export class ReplacementComponent implements OnInit {
  @ViewChild('focusInput') inputEl: ElementRef;
  couponNumber: any = {};
  userData: any;
  qrCode: any = [];
  getData: any = [];
  encryptedData: any;
  decryptedData:any;


  constructor(public location: Location, public cryptoService:CryptoService, public service: DatabaseService, public dialog: MatDialog, public route: ActivatedRoute, public session: sessionStorage, public rout: Router, public toast: ToastrManager) {
    this.userData = JSON.parse(localStorage.getItem('st_user'));
  }

  ngOnInit() {
  }


  ngAfterViewInit() {
    setTimeout(() => this.inputEl.nativeElement.focus());
  }



  holdValue: any = []
  box1: number;
  box2: number;
  box3: number;
  coupon_type: any;
  returnBoxType: any;


  checkCoupon(number) {
    if (number.length == 16 || number.length == 12) {
      if (number == undefined) {
        this.toast.errorToastr("Enter coupon code number");
        return;
      }
      if (number == '') {
        this.toast.errorToastr("Enter coupon code number");
        return;
      }
      if (this.box1 == 1) {
        this.returnBoxType = this.box1;
      }
      if (this.box2 == 2) {
        this.returnBoxType = this.box2;
      }
      if (this.box3 == 3) {
        this.returnBoxType = this.box3;
      }
      if (this.coupon_type == 'Master Box') {
        this.coupon_type = 'Master Box';
      }
      if (this.coupon_type == 'Item Box') {
        this.coupon_type = 'Item Box';
      }
      this.encryptedData = this.service.payLoad ? { 'coupon_code': number, 'coupon_type': this.coupon_type, 'box_type': this.returnBoxType }: this.cryptoService.encryptData({ 'coupon_code': number, 'coupon_type': this.coupon_type, 'box_type': this.returnBoxType });
      this.service.post_rqst(this.encryptedData, 'CouponCode/mrpReplacement').subscribe((result) => {
        this.decryptedData = this.service.payLoad ? result : this.cryptoService.decryptData(JSON.stringify(result));
        
        if (this.decryptedData['statusCode'] == 200) {
          this.couponNumber.coupon_number = '';
          this.getData = this.decryptedData['coupon_history'];
          this.holdValue = this.decryptedData['coupon_master_list'];
          let temData
          let temArray
          temData = this.getData;
          temArray = this.holdValue;

          if (this.qrCode != '') {
            let index = this.qrCode.findIndex(row => row.coupon_code == number);
            if (index != -1) {
              this.toast.errorToastr('Coupon code already exists');
              return
            }
          }

          this.qrCode.push({ 'coupon_code': temArray[0]['coupon_code'], 'coupon_type': temArray[0]['coupon_type'], 'product_mrp': temArray[0]['product_mrp'], 'product_qty': temArray[0]['product_qty'], 'itembox': temArray[0]['itembox'], 'product_detail': temData.product_detail, 'sku_code': temData.sku_code, 'remarks': temData.remarks, 'hardner_code': temData.hardner_code, 'hardner_qty': temData.hardner_qty, 'date_created': temData.date_created, 'box_type': temData.box_type, 'batch_no': temData.batch_no, 'product_source': temData.product_source });
          for (let i = 0; i < this.qrCode.length; i++) {
            if (this.qrCode[i]['coupon_type'] == 'Master Box') {
              this.coupon_type = 'Master Box';
            }
            if (this.qrCode[i]['coupon_type'] == 'Item Box') {
              this.coupon_type = 'Item Box';
            }

            if (this.qrCode[i]['box_type'] == 1) {
              this.box1 = 1
            }
            if (this.qrCode[i]['box_type'] == 2) {
              this.box2 = 2
            }
            if (this.qrCode[i]['box_type'] == 3) {
              this.box3 = 3
            }
          }

        }
        else {
          this.couponNumber.coupon_number = '';
          this.toast.errorToastr(this.decryptedData['statusMsg']);
        }
      }
        , error => {
        })
    }
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
        margin: 0.00in 0.00in  0.00in 0.00in;  
      }
      
      .qr_img{
        position: relative;
        text-align: center;
        font-size: 0.5rem
      }
      .qr_img span {
        position: absolute;
        left: 0;
        z-index: 1;
      }
      .qr_img ngx-qrcode, .aclass{
        width: 94.488188976px !important;
        height: 94.488188976px !important;
        text-align: center;
        position: relative;
      }
      

      
      span.fix-text {
        position: absolute;
        left: -20px;
        top: 30px;
        transform: rotate(-90deg);
        font-weight: bold;
        font-size: 14px;
        width: 60px;
        height: 20px;
        display: flex;
        justify-content: center;
      }
      
      span.fix-text-code{
        position: absolute;
        top: 33px;
        left: -20px;
        transform: rotate(-90deg);
        font-weight: bold;
        font-size: 8px;
        height: 15px;
        width: 60px;
        display: flex;
        align-items: center;
        justify-content: center;
      }
      
      span.fix-text-right {
        position: absolute;
        left: 58px;
        top: 30px;
        transform: rotate(-90deg);
        font-weight: bold;
        font-size: 10px;
        width: 60px;
        height: 20px;
        display: flex;
        justify-content: center;
      }
      
      span.fix-code {
        position: absolute;
        bottom: 8px;
        font-size: 9px;
        width: 100%;
        font-weight: 600;
      }
      .qr_img img{
        width: 82px !important;
        height: 82px !important;
      }
      
      
      
      .qr-codes {
        position: relative;
      }
      .qr-codes span{
        position: absolute;
        font-size: 10px;
        bottom: -2px;
        text-align: center;
        width: 100%;
        left:50%;
        transform:translateX(-50%);
      }
      .qr_rep img {
    width: 60px;
    height: 60px;
    
    
}
    .qr_rep {
    text-align: center;
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



  back() {
    this.location.back()
  }

}