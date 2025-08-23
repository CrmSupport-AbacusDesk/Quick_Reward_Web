import { Component, OnInit, Inject } from '@angular/core';
import { DatabaseService } from 'src/_services/DatabaseService';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material';
import {  sessionStorage} from 'src/app/localstorage.service';
import { ToastrManager } from 'ng6-toastr-notifications';
import { CryptoService } from 'src/_services/CryptoService';


@Component({
  selector: 'app-coupon-detail-modal',
  templateUrl: './coupon-detail-modal.component.html',
  styleUrls: ['./coupon-detail-modal.component.scss']
})
export class CouponDetailModalComponent implements OnInit {
  couponList:any =[];
  userData
  savingFlag:boolean=false;
  InfluenceArray: any = [];
  subType:any = {}
  
  constructor(@Inject(MAT_DIALOG_DATA)public data,public cryptoService:CryptoService,public dialog:MatDialog,public service:DatabaseService, public session: sessionStorage,public toast:ToastrManager, public dialogRef: MatDialogRef<CouponDetailModalComponent>) { 
    this.userData = JSON.parse(localStorage.getItem('st_user'));
    this.subType = parseInt(this.userData['organisation_data']['scanning_sub_type_wise']);
    if(this.data.id){
      this.getCouponList();
    }
  }
  
  ngOnInit() {
  }
  
  getCouponList() 
  {
    this.service.post_rqst({'id':this.data.id},"CouponCode/checkCouponCodeDetailForSubCoupon").subscribe((result=>
      {
        if (result['statusCode'] == 200){
          this.couponList=result['result'];
        }
        else{
          this.toast.errorToastr(result['statusMsg']);
        }
      }
    ));
    
  }
  
  submit() {
    this.savingFlag = true;
    this.data.create_by_id=this.userData.data.id;
    this.data.created_by_name=this.userData.data.name;
    this.data.InfluencerArray  = this.service.InfluenceArray

    this.service.post_rqst( { 'data': this.data  }, "CouponCode/updateScanLimit").subscribe((result) => {
      if (result['statusCode'] == "200") {
        this.toast.successToastr(result['statusMsg']);
        this.dialogRef.close(true);
        this.savingFlag = false;
      }
      else {
        this.toast.errorToastr(result['statusMsg']);
        this.savingFlag = false;
        
      }
    },err=>{
      this.savingFlag = false;
    });
  }
  
}
