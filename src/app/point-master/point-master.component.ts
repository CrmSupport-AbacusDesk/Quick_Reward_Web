import { Component, OnInit } from '@angular/core';
import { DatabaseService } from 'src/_services/DatabaseService';
import { ToastrManager } from 'ng6-toastr-notifications';
import { Router } from '@angular/router';
import { sessionStorage } from 'src/app/localstorage.service';
import { CryptoService } from 'src/_services/CryptoService';

@Component({
  selector: 'app-point-master',
  templateUrl: './point-master.component.html'
})
export class PointMasterComponent implements OnInit {
  data:any ={};
  savingFlag: boolean = false;
  userData: any;
  userId: any;
  userName: any;
  assign_login_data:any={};
  logined_user_data:any={};
  encryptedData: any;
  decryptedData:any;


  constructor(public service:DatabaseService, public cryptoService:CryptoService, public rout: Router, public toast:ToastrManager,public session: sessionStorage) {
    this.userData = JSON.parse(localStorage.getItem('st_user'));
    this.userId=this.userData['data']['id'];
    this.userName=this.userData['data']['name'];
    this.assign_login_data = this.session.getSession();
    this.logined_user_data = this.assign_login_data.value.data;
    this.pointCategory_data();
  }


  ngOnInit() {
  }



  pointCategory_data(){
    this.service.post_rqst({},'Master/pointMasterDetail').subscribe((result)=>
    {
      this.decryptedData = this.service.payLoad ? result : this.cryptoService.decryptData(JSON.stringify(result));

      if(this.decryptedData['statusCode'] == 200){
        this.data.welcome_point =  this.decryptedData['point_master_detail']['welcome_point'];
        this.data.id = this.decryptedData['point_master_detail']['id'];
        this.data.anniversary_point =  this.decryptedData['point_master_detail']['anniversary_point'];
        this.data.birthday_point =  this.decryptedData['point_master_detail']['birthday_point'];
        this.data.registration_refferal =  this.decryptedData['point_master_detail']['registration_refferal'];
        this.data.registration_refferal_own =  this.decryptedData['point_master_detail']['registration_refferal_own'];
        this.data.transaction_incentive =  this.decryptedData['point_master_detail']['transaction_incentive'];
      }
      else{
        this.toast.errorToastr(this.decryptedData['statusMsg']);
      }
    })
  }

  MobileNumber(event: any) {
    const pattern = /[0-9\+\-\ ]/;
    let inputChar = String.fromCharCode(event.charCode);
    if (event.keyCode != 8 && !pattern.test(inputChar)) { event.preventDefault(); }
  }

  submitDetail(){
    this.data.created_by_name=this.userName;
    this.data.created_by_id=this.userId;
    this.savingFlag = true;
    this.encryptedData = this.service.payLoad ? this.data: this.cryptoService.encryptData(this.data);

    this.service.post_rqst(this.encryptedData,'Master/pointMasterAdd').subscribe((result)=>
    {
      this.decryptedData = this.service.payLoad ? result : this.cryptoService.decryptData(JSON.stringify(result));
      if(this.decryptedData['statusCode'] == 200){
        this.toast.successToastr(this.decryptedData['statusMsg']);
        this.savingFlag = false;
      }
      else{
        this.toast.errorToastr(this.decryptedData['statusMsg']);
        this.savingFlag = false;
      }
    })

  }}
