import { Component, OnInit } from '@angular/core';
import { ToastrManager } from 'ng6-toastr-notifications';
import { DatabaseService } from 'src/_services/DatabaseService';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import { CryptoService } from 'src/_services/CryptoService';

@Component({
  selector: 'app-gift-add-page',
  templateUrl: './gift-add-page.component.html',
  styleUrls: ['./gift-add-page.component.scss']
})
export class GiftAddPageComponent implements OnInit {
  savingFlag: boolean = false;
  data: any = {};
  giftData: any = {}
  selected_image: any = [];
  upload_url: any;
  errorMsg: boolean;
  image_id: any;
  // image = new FormData();
  gift_id: any;
  image: any;
  giftbase64: boolean = false;
  nav_data: any
  type: any;
  upload_image: boolean = false;
  encryptedData: any;
  decryptedData:any;

  constructor(public service: DatabaseService, public cryptoService:CryptoService, public rout: Router, public toast: ToastrManager, public location: Location, public navparams: ActivatedRoute, private route: ActivatedRoute,) {
    this.upload_url = this.service.uploadUrl +  'schemeRewards/'
    this.nav_data = this.navparams['params']['_value']
    this.gift_id = this.nav_data.id
    this.route.params.subscribe((params) => {
      this.gift_id = params.id;

      if (this.gift_id) {
        this.rewardDetail();
        this.type = 'Edit'
      }
    }
    );
    console.log(this.type)

  }

  ngOnInit() {

  }
  rewardDetail() {

    this.encryptedData = this.service.payLoad ? { 'id': this.gift_id }: this.cryptoService.encryptData({ 'id': this.gift_id });
    this.service.post_rqst(this.encryptedData, 'Scheme/giftDetail').subscribe((result) => {
    this.decryptedData = this.service.payLoad ? result : this.cryptoService.decryptData(JSON.stringify(result));
      if (this.decryptedData ['statusCode'] == 200) {
        this.data = this.decryptedData ['result'];
        console.log('if')
      }
      else {
        this.toast.errorToastr(this.decryptedData ['statusMsg']);
      }
    })


  }
  reward_image_upload(data: any) {
    for (let i = 0; i < data.target.files.length; i++) {

      let files = data.target.files[i];
      if (files) {
        // this.gift_id = '';
        this.giftbase64 = true;

        let reader = new FileReader();
        reader.onload = (e: any) => {
          this.data.image = e.target.result
        }
        this.upload_image = true
        reader.readAsDataURL(files);
      }
      else {
        this.giftbase64 = true;
      }
      this.image.append("" + i, data.target.files[i], data.target.files[i].name);
    }
  }
  deleteProductImage() {
    this.data.image = '';
  }


  submit() {
    let header: any;
    if (this.gift_id) {
      this.giftData.point = this.data.points
      this.giftData.title = this.data.title
      this.giftData.gift_id = this.gift_id
      this.giftData.rewardImage = this.data.image
      this.encryptedData = this.service.payLoad ? this.giftData: this.cryptoService.encryptData(this.giftData);
      header = this.service.post_rqst(this.encryptedData, 'Scheme/updateGift')
    } else {
      console.log(this.gift_id)
      this.giftData.point = this.data.points
      this.giftData.title = this.data.title
      this.giftData.rewardImage = this.data.image;
      this.encryptedData = this.service.payLoad ? this.giftData: this.cryptoService.encryptData(this.giftData);
      header = this.service.post_rqst(this.encryptedData, 'Scheme/addGift')
    }
    header.subscribe((result) => {
    this.decryptedData = this.service.payLoad ? result : this.cryptoService.decryptData(JSON.stringify(result));
      if (this.decryptedData['statusCode'] == 200) {
        this.toast.successToastr(this.decryptedData['statusMsg']);
        this.savingFlag = false;
        this.rout.navigate(['/scheme/dealerscheme']);

      }
      else {
        this.toast.errorToastr(this.decryptedData['statusMsg']);
        this.savingFlag = false;
      }
    })
  }
  back(): void {
    this.location.back()
  }



}
