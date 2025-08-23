import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrManager } from 'ng6-toastr-notifications';
import { CryptoService } from 'src/_services/CryptoService';
import { DatabaseService } from 'src/_services/DatabaseService';

@Component({
  selector: 'app-influencer-user-add',
  templateUrl: './influencer-user-add.component.html'
})

export class InfluencerUserAddComponent implements OnInit {
  data:any ={};
  savingFlag:boolean = false;
  userData: any;
  userId: any;
  userName:any;
  exist_id:any;
  encryptedData: any;
  decryptedData:any;

  constructor(public service:DatabaseService, public cryptoService:CryptoService, public rout: Router, public toast:ToastrManager, private router: Router, private route: ActivatedRoute) {
    this.userData = JSON.parse(localStorage.getItem('st_user'));
    this.userId = this.userData['data']['id'];
    this.userName = this.userData['data']['name'];
  }
  
  ngOnInit() {
    this.route.params.subscribe(params => {
      this.exist_id = params['id'];
      if(this.exist_id){
        this.getDetail();
      }
    });
  }
  
  getDetail(){
    this.encryptedData = this.service.payLoad ? {'id':this.exist_id}: this.cryptoService.encryptData({'id':this.exist_id});
    this.service.post_rqst(this.encryptedData,'Master/influencerMasterDetail').subscribe((result)=>
    {
      this.decryptedData = this.service.payLoad ? result : this.cryptoService.decryptData(JSON.stringify(result));
      if(this.decryptedData['statusCode'] == 200){
        this.data = this.decryptedData['result'];

        if( this.data.scanning_rights == 'Yes'){
          this.data.point_transfer_right = '';
        }
      }
      else{
        this.toast.errorToastr(this.decryptedData['statusMsg'])
      }
    })
    
  }
  
  MobileNumber(event: any) {
    const pattern = /[0-9\+\-\ ]/;
    let inputChar = String.fromCharCode(event.charCode);
    if (event.keyCode != 8 && !pattern.test(inputChar)) { event.preventDefault(); }
  }
  
  
  submitDetail(){
    this.savingFlag = true;
    this.data.created_by_id   = this.userId;
    this.data.created_by_name   = this.userName;
    if(this.exist_id){
      this.data.exist_id = this.exist_id;
    }
    this.encryptedData = this.service.payLoad ? this.data: this.cryptoService.encryptData(this.data);
    this.service.post_rqst(this.encryptedData,'Master/influencerMasterSave').subscribe((result)=>
    {
      this.decryptedData = this.service.payLoad ? result : this.cryptoService.decryptData(JSON.stringify(result));
      if(this.decryptedData['statusCode'] == 200){
        this.toast.successToastr(this.decryptedData['statusMsg']);
        this.savingFlag = false;
        this.rout.navigate(['/influencer-user-list']);
      }
      else{
        this.toast.errorToastr(this.decryptedData['statusMsg']);
        this.savingFlag = false;
      }
    })
  }
}
