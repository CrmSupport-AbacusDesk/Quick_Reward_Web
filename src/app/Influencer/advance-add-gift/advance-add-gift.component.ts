import { Component, OnInit, Inject } from '@angular/core';
import { DatabaseService } from 'src/_services/DatabaseService';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material';
import { sessionStorage } from 'src/app/localstorage.service';
import { ToastrManager } from 'ng6-toastr-notifications';
import { CryptoService } from 'src/_services/CryptoService';
import { DialogComponent } from 'src/app/dialog.component';


@Component({
  selector: 'app-advance-add-gift',
  templateUrl: './advance-add-gift.component.html'
})
export class AdvanceAddGiftComponent implements OnInit {
  data: any = {};
  savingFlag: boolean = false;
  userData: any;
  filter:any ={};
  giftList:any =[];
  pointRange:number =0;
  rangeEnd:number = 0;
  rangeStart:number = 0;
  
  constructor(@Inject(MAT_DIALOG_DATA) public modelData, public dialog1: DialogComponent, public cryptoService:CryptoService, public dialog: MatDialog, public service: DatabaseService, public session: sessionStorage, public toast: ToastrManager, public dialogRef: MatDialogRef<AdvanceAddGiftComponent>) {
    this.userData = JSON.parse(localStorage.getItem('st_user'));
    this.data.created_by = this.userData['data']['id'];
    this.data.created_by_name = this.userData['data']['name'];
    this.data.influencer_name = modelData.name;
    this.data.influencer_id = modelData.id;
    
    if(modelData.type == 'redeem_request'){
      this.data = modelData.detail;
      this.data.user_token = '';
      this.data.shipping_address = this.data.address + ' ,' + this.data.city + ' ,' + this.data.district + ' ,' + this.data.state + ' ,' + this.data.pincode;
    }
  }
  
  ngOnInit() {
  }
  
  
  
  
  
  submitDetail(type) {
    this.data.influencer_name = this.modelData.name;
    this.data.influencer_id = this.modelData.id;
    this.savingFlag = true;
    let header
    if (type == 'gift_add') {
      header = this.service.post_rqst({ 'data': this.data }, "GiftGallery/manualAddGiftGallery")
    }
    if (type == 'point_transfer') {
      header = this.service.post_rqst({ 'data': this.data }, "GiftGallery/manualPointTransfer")
    }
    header.subscribe((result => {
      if (result['statusCode'] == 200) {
        this.dialog.closeAll();
        this.savingFlag = false;
        this.toast.successToastr(result['statusMsg']);
      }
      else {
        this.savingFlag = false;
        this.toast.errorToastr(result['statusMsg'])
      }
      
    }))
    
  }
  
  
  
  transform(value: any): number {
    const converted = Number(value);
    return isNaN(converted) ? 0 : converted;
  }
  
  findValue(id){
    let index = this.giftList.findIndex(row => row.id == id)
    if (index != -1) {
      this.data.cash_point = this.giftList[index]['range_start'];
      this.pointRange = Number(this.giftList[index]['point_range_value'])
      this.rangeStart = Number(this.giftList[index]['range_start']);
      this.rangeEnd = Number(this.giftList[index]['range_end']);
      this.data.gift_name =  this.giftList[index]['title'];
      if(this.data.redeem_type == 'Gift'){
        this.data.point =  this.giftList[index]['gift_point'];
      }
      this.data.cash_value = Number(this.giftList[index]['range_start']) * Number(this.giftList[index]['point_range_value']);
    }
  }
  
  getValue(value) {
    if (parseFloat(value) > Number(this.data.wallet_point)) {
      this.toast.errorToastr('Insufficient Balance');
      return
    }
    else {
      this.data.cash_value = value * this.pointRange;
    }
  }
  
  
  giftGalleryList(searcValue) {
    this.filter.gift_type = this.data.redeem_type
    this.filter.title = searcValue
    this.filter.status = 1,
    this.filter.user_type = 'influencer',
    this.filter.influencer_type = this.data.influencer_type,
    this.filter.status = 1,



    this.service.post_rqst({ 'filter': this.filter, 'start':0,'pagelimit':100}, "GiftGallery/giftGalleryList")
    .subscribe((result => {
      if (result['statusCode'] == 200){
        this.giftList = result['gift_master_list'];
      }
      else{
        this.toast.errorToastr(result['statusMsg']);
      }
    }))
    this.service.count_list();
  }
  
  
  sendRequest() {
    if (this.data.redeem_type == 'Cash') {
      if (this.data.cash_point == undefined) {
        this.toast.errorToastr('Please enter redeem points value');
        return
      }
      else if (parseFloat(this.data.cash_point) < this.rangeStart) {
        this.toast.errorToastr('You cannot send redeem request less than ' + this.rangeStart + ' points.');
        return;
      }
      
      else if (parseFloat(this.data.cash_point) > this.rangeEnd) {
        this.toast.errorToastr('You cannot send redeem request more than ' + this.rangeEnd + ' points.');
        return;
      }
      else if (parseFloat(this.data.cash_point) > parseFloat(this.data.wallet_point)) {
        this.toast.errorToastr('Insufficient point in influencer wallet');
        return
      }
      else{
        this.data.point = parseFloat(this.data.cash_point);
        this.data.payment_mode ='Bank';
        this.send();
      }
    }
    else{
      this.send();
    }
  }
  
  send(){
    console.log(this.data.point, 'data.point');
    
    if (this.data.redeem_type == 'Gift' && !this.data.shipping_address) {
      this.toast.errorToastr('Shipping address required');
      return;
    }
    if (this.data.redeem_type == 'Gift' && (this.data.document_no=='' || this.data.document_type =='' || this.data.document_image=='')) {
      this.toast.errorToastr('Document details not updated yet. Update influencer document details and retry');
      return;
    }
    
    if (this.data.redeem_type == 'Cash' && (this.data.account_holder_name == '' || this.data.bank_name == ''|| this.data.account_no == '' || this.data.ifsc_code == '')) {
      this.toast.errorToastr('Bank details not updated yet. Update influencer bank details and retry');
      return;
    }
    else{
      this.dialog1.confirm('You want send redeem request?').then((result) => {
        if (result) {
          this.data.influencer_name = this.modelData.name;
          this.data.influencer_id = this.modelData.id;
          this.data.user_type = 'influencer';
          this.savingFlag = true;
          this.service.post_rqst({'data': this.data }, "Influencer/addRedeemRequest").subscribe((result => {
            if (result['statusCode'] == 200) {
              this.savingFlag = false;
              this.dialog.closeAll();
              this.toast.successToastr(result['statusMsg']);
            }
            else {
              this.savingFlag = false;
              this.toast.errorToastr(result['statusMsg'])
            }
            
          }));
        }
      });
    }
    
    
    
  }
  
}
