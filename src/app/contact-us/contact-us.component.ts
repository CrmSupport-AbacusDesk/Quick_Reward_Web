import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrManager } from 'ng6-toastr-notifications';
import { CryptoService } from 'src/_services/CryptoService';
import { DatabaseService } from 'src/_services/DatabaseService';
import { sessionStorage } from 'src/app/localstorage.service';

@Component({
  selector: 'app-contact-us',
  templateUrl: './contact-us.component.html'
})
export class ContactUsComponent implements OnInit {
  data:any ={};
  savingFlag:boolean=false;
  userData: any;
  userId: any;
  userName:any;
  assign_login_data:any;
  logined_user_data:any;
  contact_id:any;
  encryptedData:any;
  decryptedData:any;
  
  
  constructor( public service: DatabaseService, public cryptoService:CryptoService, public rout: Router, public toast:ToastrManager, public session: sessionStorage) {
    this.userData = JSON.parse(localStorage.getItem('st_user'));
    this.userId = this.userData['data']['id'];
    this.userName = this.userData['data']['name'];
    this.assign_login_data = this.session.getSession();
    this.logined_user_data = this.assign_login_data.value.data;
  }
  
  ngOnInit() {
    this.contactDetail();
  }
  
  MobileNumber(event: any) {
    const pattern = /[0-9\+\-\ ]/;
    let inputChar = String.fromCharCode(event.charCode);
    if (event.keyCode != 8 && !pattern.test(inputChar)) { event.preventDefault(); }
  }
  
  contactDetail(){
    // this.savingFlag = true;
    this.data.created_by_id   = this.userId;
    this.data.created_by_name   = this.userName;
    this.service.post_rqst({},'Master/contactDetail').subscribe((result)=>
    {
      this.decryptedData = this.service.payLoad ? result : this.cryptoService.decryptData(JSON.stringify(result));
      if(this.decryptedData['statusCode'] == 200){
        this.data.contact_number = this.decryptedData['contact_detail']['contact_number'];
        this.data.id = this.decryptedData['contact_detail']['id'];
        this.data.contact_number_2 = this.decryptedData['contact_detail']['contact_number_2'];
        this.data.email = this.decryptedData['contact_detail']['email'];
        this.data.url = this.decryptedData['contact_detail']['url'];
        this.data.address = this.decryptedData['contact_detail']['address'];
        this.data.iframe_url = this.decryptedData['contact_detail']['iframe_url'];
        this.data.instagram_url = this.decryptedData['contact_detail']['instagram_url'];
        this.data.facebook_url = this.decryptedData['contact_detail']['facebook_url'];
        this.data.linkedin_url = this.decryptedData['contact_detail']['linkedin_url'];
        this.data.twitter_url = this.decryptedData['contact_detail']['twitter_url'];
      }
      else{
        this.toast.errorToastr(this.decryptedData['statusMsg']);
      }
    })
    
  }
  
  submitDetail(){
    this.savingFlag = true;
    this.data.created_by_id   = this.userId;
    this.data.created_by_name   = this.userName;
    this.encryptedData = this.service.payLoad ? this.data: this.cryptoService.encryptData(this.data);
    this.service.post_rqst(this.encryptedData,'Master/addContact').subscribe((result)=>
    {
      this.decryptedData = this.service.payLoad ? result : this.cryptoService.decryptData(JSON.stringify(result));
      if(this.decryptedData['statusCode'] == 200){
        this.toast.successToastr(this.decryptedData['statusMsg']);
        this.contact_id = this.decryptedData['last_id'];
        this.savingFlag = false;
      }
      else{
        this.toast.errorToastr(this.decryptedData['statusMsg']);
        this.savingFlag = false;
      }
    })
    
  }
  
  
}
