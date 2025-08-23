import { Component, OnInit } from '@angular/core';
import { DatabaseService } from 'src/_services/DatabaseService';
import { MatDialog } from '@angular/material';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { DialogComponent } from 'src/app/dialog.component';
import { ToastrManager } from 'ng6-toastr-notifications';
import { DialogService } from 'src/app/dialog.service';
import { sessionStorage } from 'src/app/localstorage.service';
import { Location } from '@angular/common';
import { CryptoService } from 'src/_services/CryptoService';


@Component({
  selector: 'app-coupon-code-detail',
  templateUrl: './coupon-code-detail.component.html'
})
export class CouponCodeDetailComponent implements OnInit {

  coupon_id;
  getData: any = {};
  qrCode: any = [];
  elementType: any = ''
  skLoading: boolean = false;
  today_date: Date;
  encryptedData: any;
  decryptedData: any;
  assign_login_data: any = [];
  assign_login_data2: any = [];
  url: any;
  constructor(public location: Location, public cryptoService: CryptoService, public session: sessionStorage, private router: Router, public alert: DialogComponent, public service: DatabaseService, public editdialog: DialogService, public dialog: MatDialog, public route: ActivatedRoute, public toast: ToastrManager, public dialog1: DialogComponent) {
    this.today_date = new Date();
    this.url = this.service.uploadUrl + 'logo/';
    this.assign_login_data = this.session.getSession();
    this.assign_login_data = this.assign_login_data.value;
    this.assign_login_data2 = this.assign_login_data.data;
  }

  ngOnInit() {
    this.route.params.subscribe(params => {
      let id = params.id.replace(/_/g, '/');
      this.coupon_id = this.cryptoService.decryptId(id)
      if (id) {
        this.getCouponDetail();
      }
    });
  }

  back(): void {
    this.location.back()
  }

  getCouponDetail() {
    this.skLoading = true;
    this.encryptedData = this.service.payLoad ? { 'offer_coupon_history_id': this.coupon_id } : this.cryptoService.encryptData({ 'offer_coupon_history_id': this.coupon_id });
    this.service.post_rqst(this.encryptedData, "CouponCode/couponSummaryDetail").subscribe((result => {
      this.decryptedData = this.service.payLoad ? result : this.cryptoService.decryptData(JSON.stringify(result));
      console.log(this.decryptedData);

      if (this.decryptedData['statusCode'] == 200) {
        this.getData = this.decryptedData.coupon_history;
        this.qrCode = this.decryptedData.coupon_master_list;
        console.log(this.qrCode);

        this.skLoading = false;
      }
      else {
        this.toast.errorToastr(this.decryptedData['statusMsg']);
      }

    }
    ));
  }


  transform(value: string, limit: number = 100, completeWords: boolean = false, ellipsis: string = '...'): string {
    if (!value) return '';

    if (completeWords) {
      limit = value.substr(0, limit).lastIndexOf(' ');
    }

    return value.length > limit ? value.substr(0, limit) + ellipsis : value;
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
      #qr_code_container > div {
        page-break-inside: avoid;
        break-inside: avoid;
        display: block;
      }
      
      @page {
       margin: 0.5in;
      }
      
      .qr_img {
        position: relative;
        text-align: center;
        font-size: 0.5rem;
      }
      
      .qr_img span {
        position: absolute;
        left: 0;
        z-index: 1;
      }
      
      .qr_img ngx-qrcode, .aclass {
        width: 84.488188976px !important;
        height: 84.488188976px !important;
        text-align: center;
        position: relative;
      }
      .qr_moda_hardware img {
          width: 60px;
          height: 60px;
        }
             
      .qr_logo_gattani img{
      width:150px;
      height:80px;
      }

      .qr_section_gattani {
      .qrcode{
       margin-top:16px;
           }
      }
      
      .qr_section_gattani img{
      width:120px;
      height:120px;
      }

      .qr_logo_gattani_50_50 img{
      width:75px;
      height:60px;
      }

      .qr_section_gattani_50_50 img{
      width:70px;
      height:70px;
      }
      
       .harson_qr_img ngx-qrcode{
          width: 55px;
          margin: 0 auto;
          height: 55px;
          position: relative;
          text-align: center;
        }
    .harson_qr_img ngx-qrcode, .aclass{
        width: 55px !important;
        height: 55px !important;
        text-align: center;
        text-align: center;
        margin:-5px auto 0 auto;
      }
    .harson_qr_img img {
        width: 100% !important;
        height: 100% !important;
    }
      
    .moda-qr, .moda-qr ngx-qrcode, .moda-qr ngx-qrcode .moda-qr-img, .moda-qr ngx-qrcode .moda-qr-img img{width:100%}
   
      
    .grafdoer_qr_img ngx-qrcode{
          width: 55px;
          margin: 0 auto;
          height: 55px;
          position: relative;
          text-align: center;
        }
    .grafdoer_qr_img ngx-qrcode, .aclass{
        width: 135px !important;
        height: 135px !important;
        text-align: center;
        text-align: center;
        margin:-5px auto 0 auto;
      }
    .grafdoer_qr_img img {
        width: 100% !important;
        height: 100% !important;
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
      
      span.fix-text-code {
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
        font-size: 8px;
        width: 60px;
        height: 20px;
        display: flex;
        justify-content: center;
      }
      
      span.fix-code {
        position: absolute;
        bottom: 8px;
        font-size: 9.5px;
        width: 100%;
      }
      
      .qr_img img {
        width: 82px !important;
        height: 82px !important;
      }
      
      .qr-codes {
        position: relative;
      }
      
      .qr-codes span {
        position: absolute;
        font-size: 10px;
        bottom: -2px;
        text-align: center;
        width: 100%;
        left: 50%;
        transform: translateX(-50%);
      }
      .sm_qr_durian img {
        width: 130px !important;
        height: 130px !important;
        
     }

      .sm_qr img {
        width: 80px !important;
        height: 68.9px !important;
        float: right !important;
        margin-top:6px !important;
      }

       .sm_qr_shivsagar img {
       weight: 100px !important;
       height: 100px !important;
      }

      
       .sm_sm_qr img {
        width: 63px !important;
        height: 63px !important;
        float: right !important;
        margin-top:4px !important;
      }

      .sm_sm_qr2 img {
        width: 80px !important;
        height: 80px !important;
        float: right !important;
        margin-top:4px !important;
      }
      
       .center_sm_qr img {
        width: 85px !important;
        height: 85px !important;
      }
      
      .single_center_sm_qr img {
        width: 100px !important;
        height: 100px !important;
      }
      
      span.single_fix_code {
            position: absolute;
            top: 55px;
            left: -45px;
            transform: rotate(-90deg);
            font-weight: bold;
            font-size: 8px;
            height: 15px;
            width: 120px;
            display: flex;
            align-items: center;
            justify-content: center;
      }
       span.single_fix_lable {
            position: absolute;
            top: 55px;
            right: -38px;
            transform: rotate(-90deg);
            font-weight: bold;
            font-size: 8px;
            height: 15px;
            width: 120px;
            display: flex;
            align-items: center;
            justify-content: center;
      }
      
      .new_sm_qr img {
        width: 85px !important;
        height: 85px !important;
        float: right !important;
      }
      
      .qr_img_eskay_bond ngx-qrcode, .eskay{
        width: 65px !important;
        height: 70px !important;
      }
      
      .eskay img{
        width: 65px !important;
      }
    
      .qr_img_eskay_bond .qr_section
      {
          display: flex;
          justify-content: center;
          width: 100%;
          align-items: center;
      }
    
    .qr_img_eskay_bond .qr_section .qr_logo
    {
        display: flex;
        justify-content: center;
        width: 100%;
    }
    
    .qr_img_eskay_bond .qr_section .qr_logo img
    {
        height: 25px;
    }
        
    .qr_img_crossbond .qr_section .crossbond img
    {
        width: 80px !important;
        height: 80px !important;
    }
            
            
     .a-four ngx-qrcode, .a-four-qr, .a-four-qr img {
        width: 80px !important;
        height: 80px !important;
        margin: 0 auto;
        text-align: center;
      }
      
       .a-four ngx-qrcode, .a-four-qr-rama, .a-four-qr-rama img {
        width: 90px !important;
        height: 90px !important;
        margin: 0 auto;
        text-align: center;
    }

     .a-four ngx-qrcode, .a-four-qr-nortus, .a-four-qr-nortus img {
        width: 90px !important;
        height: 90px !important;
        margin: 0 auto;
        text-align: center;
        margin-left: 14px;
    }
      
      .qr_img_mwud
      {
          display: flex;
          align-items: center;
          margin-top: 10px;
      }
      
      .qr_img_mwud .qr_section
      {
          width: 100%;
      }
      
      .qr_img_mwud .qr_section ngx-qrcode,
      .qr_img_mwud .qr_section ngx-qrcode .eskay img{
          width: 55px !important;
          height: 55px !important;
      }
      
        
      .qr_img_mwud .qr_logo img
      {
        width: 100px;
        height: 65px;
        margin-right: 10px;
      }
      
      .qr_img_mwud .qr_logo p strong
      {
          font-size: 8px;
      }
      
      
      .qr_img_gaumaya .qr_section
    {
        width: 100%;
        display: flex;
        align-items: center;
    }
    
     .qr_logo_shivsagar img{
        width: 80px;
        height: 60px;
        float: left; 
        margin-left: 5px; 
    }

    .qr_img_gaumaya50X50 .qr_section
    {
        width: 100%;
        display: flex;
        align-items: center;
    }

    .sm_qr_shivsagar img {
    width: 100px;
    height: 100px;
    }

     .qr_img_rungta_bond .qr_section
    {
        display: flex;
        justify-content: center;
        width: 100%;
        align-items: center;
    }
    
    .qr_img_rungta_bond .qr_section ngx-qrcode,
    .qr_img_rungta_bond .qr_section ngx-qrcode .eskay img{
        width: 45px !important;
        height: 45px !important;
    }
    
    .qr_img_cnc .qr_section ngx-qrcode,
    .qr_img_cnc .qr_section ngx-qrcode .eskay img{
        width: 44px !important;
        height: 44px !important;
    }
    
    .qr_img_gaumaya_new .qr_section ngx-qrcode,
    .qr_img_gaumaya_new .qr_section ngx-qrcode .eskay img{
        width: 45px !important;
        height: 45px !important;
    }

    .qr_img_gaumaya .qr_section ngx-qrcode,
    .qr_img_gaumaya .qr_section ngx-qrcode .eskay img{
        width: 55px !important;
        height: 55px !important;
    }

     .qr_img_gaumaya50X50 .qr_section ngx-qrcode,
    .qr_img_gaumaya50X50 .qr_section ngx-qrcode .eskay img{
        width: 90px !important;
        height: 100px !important;
    }
    

    
    .qr_shiv_sagar {
    display: flex;
    }
    .qr_logo_shivsagar img {
    margin-top: 25px;
    }

    .qr_img_gaumaya .qr_logo img
    {
        height: 40px;
        width: 100px;
    }

    .qr_img_gaumaya_new .qr_logo
    {
        margin-left: 15px;
    }

    .qr_img_gaumaya_new .qr_logo img
    {
        height: 40px;
        width: 100px;
    }
      

    .qr_img_ramson
      {
        
           display: flex;
           justify-content: center; /* Centers horizontally */
           align-items: center; /* Centers vertically */
      }
      
      .qr_img_ramson .qr_section
      {
          width: 100%;
      }
      
      .qr_img_ramson .qr_section ngx-qrcode,
      .qr_img_ramson .qr_section ngx-qrcode .eskay img{
          width: 55px !important;
          height: 55px !important;
      }
      
        
      .qr_img_ramson .qr_logo img
      {
        width: 100px;
        height: 65px;
        margin-right: 10px;
      }
      
      .qr_img_ramson .qr_logo p strong
         {
          font-size: 8px;
          }


    .qr_img_bafit
    {
        text-align: center;
        padding: 0px 7px;
    }
    
    .qr_img_bafit .qr_section
    {
        
        width: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
    }
    
    .qr_img_bafit .qr_section ngx-qrcode,
    .qr_img_bafit .qr_section ngx-qrcode .eskay img{
        width: 90px !important;
        height: 90px !important;
    }

    .qr_img_section .qr_section
    {
        width: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        
    }

     .qr_img_section .qr_section_richa
    {
        width: 100%;
        align-items: center;
        justify-content: center;
        
    }

        .qr_img_section .qr_section_arkayvox
    {
        width: 100%;
        align-items: center;
        justify-content: center;
        
    }

         .qr_img_section .qr_section_arkayvox2
    {
        width: 100%;
        
    }
    
    .qr_img_section .qr_section ngx-qrcode,
    .qr_img_section .qr_section ngx-qrcode .aclass img{
        width: 60px !important;
        height: 60px !important;
        display: flex;
        justify-content: center;
    }


    .richa_aclass img {
      width: 80px !important;
      height: 70px !important;
      display: flex !important;
      justify-content: center !important;
      margin-right: 8px;
    }
        

    .richa_aclass {
    display: flex;
    justify-content: center;
    }

     .aarkayvox_aclass img {
      width: 60px !important;
      height: 60px !important;
      display: flex !important;
      justify-content: center !important;
      margin-right: 8px;
    }
        

    .aarkayvox_aclass {
    display: flex;
    justify-content: center;
    }
    
    .qr_img_section .qr_content
    {
        font-size: 7px;
        font-weight: 800;
        display: block;
        margin-top: -7px;
        line-height: 15px;
    }

    .qr_rep1 img{
    height: 150px;
    width: 150px;
    margin-left: 5px;
}
         
     .corsa, .corsa ngx-qrcode {
          width: 45px !important;
          height: 45px !important;
       }
      
       .corsa img  {
          width: 45px !important;
          height: 45px !important;
       }

       .qr_spin {
    text-align: center;
    }

    ngx-qrcode.jly_qr img {
    width: 80px;
  height: 80px;
}
      
.indp-lgo img {
   width: 100px;
    height: 100px;
}

.dura_qr img {
    width: 105px;
    height: 105px;
}
.qr_ramson img {
    width: 50px;
    height: 50px;
}

.qr_duragrace img {
    width: 70px;
    height: 70px;
    margin-top: -5px;
}



      body {
        font-family: 'arial';
      }
    }
  </style>
        </head>
        <body onload="window.print();window.close()">${printContents}</body>
        </html>`
    );

    popupWin.document.close();
  }


}
