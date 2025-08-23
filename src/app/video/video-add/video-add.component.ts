import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrManager } from 'ng6-toastr-notifications';
import { CryptoService } from 'src/_services/CryptoService';
import { DatabaseService } from 'src/_services/DatabaseService';

@Component({
  selector: 'app-video-add',
  templateUrl: './video-add.component.html'
})
export class VideoAddComponent implements OnInit {
  data:any ={};
  savingFlag:boolean = false;
  userData: any;
  userId: any;
  userName:any;
  encryptedData: any;
  decryptedData:any;
  logined_user_data:any ={}

  constructor(public service:DatabaseService, public cryptoService:CryptoService, public rout: Router, public toast:ToastrManager, private router: Router, private route: ActivatedRoute) {
    this.userData = JSON.parse(localStorage.getItem('st_user'));
    this.userId = this.userData['data']['id'];
    this.userName = this.userData['data']['name'];
    this.logined_user_data = this.userData['data'];
    this.service.orgUserType();
  }

  ngOnInit() {
  }







    
  submitDetail(){
    this.savingFlag = true;
    this.data.created_by_id   = this.userId;
    this.data.created_by_name   = this.userName;
    this.encryptedData = this.service.payLoad ? this.data: this.cryptoService.encryptData(this.data);
    this.service.post_rqst(this.encryptedData,'Master/addVideo').subscribe((result)=>
    {
      this.decryptedData = this.service.payLoad ? result : this.cryptoService.decryptData(JSON.stringify(result));
      if(this.decryptedData['statusCode'] == 200){
        this.toast.successToastr(this.decryptedData['statusMsg']);
        this.savingFlag = false;
        this.router.navigate(['/banner-list']);
      }
      else{
        this.toast.errorToastr(this.decryptedData['statusMsg']);
        this.savingFlag = false;
      }
    })
    
  }

}
