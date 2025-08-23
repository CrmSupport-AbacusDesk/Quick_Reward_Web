import { Component, OnInit } from '@angular/core';

import { DatabaseService } from 'src/_services/DatabaseService';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrManager } from 'ng6-toastr-notifications';
import * as moment from 'moment';
import { CryptoService } from 'src/_services/CryptoService';
import { sessionStorage } from 'src/app/localstorage.service';
import { uploadImgService } from 'src/_services/uploadImg';

@Component({
  selector: 'app-gift-add',
  templateUrl: './gift-add.component.html'
})
export class GiftAddComponent implements OnInit {
  
  userData: any;
  userId: any;
  userName: any;
  data: any = {};
  errorMsg: boolean;
  loader: any = false;
  selected_image: any;
  image_id: any;
  image = new FormData();
  savingFlag: boolean = false;
  today_date: Date;
  bonus_schemeList: any = []
  upload_url: any;
  nav_data: any
  gift_id: any;
  gift_type: any;
  influencerUser:any=[];
  filter:any={};
  encryptedData: any;
  decryptedData:any;
  logined_user_data:any;
  subType:any=1
  point_earning_type: number;
  
  
  constructor(public service: DatabaseService, public uploadDoc:uploadImgService, public cryptoService:CryptoService,  public session: sessionStorage,public navparams: ActivatedRoute, public router: Router, private route: ActivatedRoute, public toast: ToastrManager) {
    this.data.user_type = 'Influencer';
    
    let assign_login_data
    assign_login_data = this.session.getSession();
    this.logined_user_data = assign_login_data.value.data;
    
    this.nav_data = this.navparams['params']['_value']
    this.data.gift_type = 'Gift'
    this.gift_id = this.nav_data.id;
    this.gift_type = this.nav_data.type;
    this.upload_url = this.service.uploadUrl + 'gift_gallery/'
    this.userData = JSON.parse(localStorage.getItem('st_user'));
    this.userId = this.userData['data']['id'];
    this.userName = this.userData['data']['name'];
    this.today_date = new Date();
    if (this.gift_id) {
      this.get_giftDetail(this.gift_id)
    }
    this.getInfluencer();
    
    // else if(!this.gift_id){
    //   this.get_bonus_schemeList()
    // }
    this.userData.organisation_data.payout_per_transaction_limit;
    this.subType = parseInt(this.userData['organisation_data']['scanning_sub_type_wise']);
    this.point_earning_type = parseInt(this.userData['organisation_data']['point_earning_type']);
  }
  
  ngOnInit() {
    
  }
  get_giftDetail(gift_id) {
    this.encryptedData = this.service.payLoad ? { gift_id }: this.cryptoService.encryptData({ gift_id });
    this.service.post_rqst(this.encryptedData, 'GiftGallery/gift_detail').subscribe((result) => {
      this.decryptedData = this.service.payLoad ? result : this.cryptoService.decryptData(JSON.stringify(result));
      if (this.decryptedData['statusCode'] == 200) {
        this.data = this.decryptedData['result']
        this.data.bonus_scheme = this.data.bonus_scheme.toString()
        if (this.gift_id && this.data.gift_img != "") {
          this.selected_image = this.upload_url + this.data.gift_img
        }
      }
      else {
        this.toast.errorToastr(this.decryptedData['statusMsg']);
        this.savingFlag = false;
      }
      
    }, error => {
      this.toast.errorToastr(error);
    })
  }
  
  transparseInt(value: string, radix: number = 10): number {
    if (!value) {
      return NaN;
    }
    
    // Parse the input string to an integer using the specified radix (base)
    return parseInt(value, radix);
  }
  
  
  onUploadChange(data: any) {
    this.errorMsg = false;
    this.image_id = '';
    for (let i = 0; i < data.target.files.length; i++) {
      const file = data.target.files[i];
      this.uploadDoc.processImageFile(file)
      .then(({ dataURL, cleanedFile }) => {
          if(file){
              this.selected_image = dataURL;
              this.image.append("" + i, cleanedFile, cleanedFile.name);
          }
      })
      .catch(err => {
          this.toast.errorToastr(err);
      });
  }
  
  }
  
  
  resetValue() {
    this.data.range_end = '';
  }
  // get_bonus_schemeList(gift_id:any='') {
  //   this.service.post_rqst({'gift_id':gift_id}, 'GiftGallery/bonusSchemeList').subscribe((resp) => {
  //     if (resp['statusCode'] == 200) {
  //       this.bonus_schemeList = resp['result']
  //     }
  //     else {
  //       this.toast.errorToastr(resp['statusMsg']);
  //     }
  
  //   }, error => {
  //     this.toast.errorToastr(error);
  //   })
  // }
  
  submitDetail() {
    this.data.date_from ? (this.data.date_from = moment(this.data.date_from).format('YYYY-MM-DD')) : null;
    this.data.date_to ? (this.data.date_to = moment(this.data.date_to).format('YYYY-MM-DD')) : null;
    
    
    
    
    
    
    
    if (this.data.gift_type == 'Cash') {
      if(this.transparseInt(this.data.range_start) > this.transparseInt(this.userData.organisation_data.payout_per_transaction_limit)){
        this.toast.errorToastr("Maximum " +  this.userData.organisation_data.payout_per_transaction_limit + " points allow")
        return;
      }
      
      if(this.transparseInt(this.data.range_end) > this.transparseInt(this.userData.organisation_data.payout_per_transaction_limit)){
        this.toast.errorToastr("Maximum " +  this.userData.organisation_data.payout_per_transaction_limit + " points allow")
        return;
      }
      
      if (parseInt(this.data.range_end) < parseInt(this.data.range_start)) {
        this.toast.errorToastr('The range end value should be greater than the range start value');
        return;
      }
    }
    if(this.data.gift_type == 'Gift'){
      
      if(this.transparseInt(this.data.gift_point) > this.transparseInt(this.userData.organisation_data.payout_per_transaction_limit)){
        this.toast.errorToastr("Maximum " +  this.userData.organisation_data.payout_per_transaction_limit + " points allow")
        return;
      }
      
      
      if(this.selected_image==undefined){
        this.toast.errorToastr('Please Upload Image');
        return;
      }
    }
    
    this.data.created_by_name = this.userName;
    this.data.created_by_id = this.userId;
    this.savingFlag = true;
    
    this.data.gift_img = this.selected_image;
    let header: any;
    if (this.gift_id) {
      this.data.id = this.gift_id
      this.encryptedData = this.service.payLoad ? this.data: this.cryptoService.encryptData(this.data);
      header = this.service.post_rqst(this.encryptedData, 'GiftGallery/updateGiftGallery')
    } else {
      this.encryptedData = this.service.payLoad ? this.data: this.cryptoService.encryptData(this.data);
      
      header = this.service.post_rqst(this.encryptedData, 'GiftGallery/addGiftGallery')
    }
    header.subscribe((result) => {
      this.decryptedData = this.service.payLoad ? result : this.cryptoService.decryptData(JSON.stringify(result));
      if (this.decryptedData['statusCode'] == 200) {
        this.toast.successToastr(this.decryptedData['statusMsg']);
        this.savingFlag = false;
        this.router.navigate(['/gift-list']);
        this.service.count_list();
        
      }
      else {
        this.toast.errorToastr(this.decryptedData['statusMsg']);
        this.savingFlag = false;
      }
      
    }, error => {
      this.toast.errorToastr(error);
    })
    
  }
  
  getInfluencer()
  {
    this.filter.scanning_rights = 'Yes';
    this.encryptedData = this.service.payLoad ? {'filter':this.filter}: this.cryptoService.encryptData({'filter':this.filter});
    this.service.post_rqst(this.encryptedData,'Bonus/influencerMasterList').subscribe((result)=>
      {
      this.decryptedData = this.service.payLoad ? result : this.cryptoService.decryptData(JSON.stringify(result));
      if (this.decryptedData['statusCode'] == 200){
        this.influencerUser=this.decryptedData['result'];
      }
      else{
        this.toast.errorToastr(this.decryptedData['statusMsg']);
      }
    })
  }
  
  
}


