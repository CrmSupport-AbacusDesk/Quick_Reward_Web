import { Component, OnInit } from '@angular/core';
import { ToastrManager } from 'ng6-toastr-notifications';
import { DatabaseService } from 'src/_services/DatabaseService';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';

@Component({
  selector: 'app-secondary-gift-add-page',
  templateUrl: './secondary-gift-add-page.component.html',
  styleUrls: ['./secondary-gift-add-page.component.scss']
})
export class SecondaryGiftAddPageComponent implements OnInit {
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
  upload_image: boolean = false
  constructor(public service: DatabaseService, public rout: Router, public toast: ToastrManager, public location: Location, public navparams: ActivatedRoute, private route: ActivatedRoute,) {
    this.upload_url = this.service.uploadUrl + 'schemeRewards/'
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

    this.service.post_rqst({ 'id': this.gift_id }, 'Scheme/giftDetail').subscribe((resp) => {
      if (resp['statusCode'] == 200) {
        this.data = resp['result'];
        console.log('if')
      }
      else {
        this.toast.errorToastr(resp['statusMsg']);
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
    console.log(this.giftData)
    // this.savingFlag = true;
    let header: any;
    if (this.gift_id) {
      this.giftData.point = this.data.points
      this.giftData.title = this.data.title
      this.giftData.gift_id = this.gift_id
      this.giftData.rewardImage = this.data.image
      console.log('id', this.gift_id)
      header = this.service.post_rqst(this.giftData, 'Scheme/updateGift')
    } else {
      console.log(this.gift_id)
      this.giftData.point = this.data.points
      this.giftData.title = this.data.title
      this.giftData.rewardImage = this.data.image;

      header = this.service.post_rqst(this.giftData, 'Scheme/addGift')
    }
    header.subscribe((resp) => {
      if (resp['statusCode'] == 200) {
        this.toast.successToastr(resp['statusMsg']);
        this.savingFlag = false;
        this.rout.navigate(['/scheme/dealerscheme']);

      }
      else {
        this.toast.errorToastr(resp['statusMsg']);
        this.savingFlag = false;
      }
    })
  }
  back(): void {
    this.location.back()
  }



}
