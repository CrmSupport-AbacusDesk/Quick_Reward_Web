import { Component, OnInit, ViewChild } from '@angular/core';
import { DatabaseService } from 'src/_services/DatabaseService'
import { ToastrManager } from 'ng6-toastr-notifications';
import { Router,ActivatedRoute } from '@angular/router';
import { CryptoService } from 'src/_services/CryptoService';
import { sessionStorage } from 'src/app/localstorage.service';

@Component({
  selector: 'app-video-add',
  templateUrl: './video-add.component.html'
})
export class VideoAddComponent implements OnInit {
  
  @ViewChild('fileInput') fileInput: any;
  data:any={};
  selected_video :any;
  image_id:any;
  video = new FormData();
  savingFlag: boolean=false;
  errorMsg: boolean=false;
  userData: any;
  userId: any;
  userName:any;
  encryptedData: any;
  decryptedData:any;
  logined_user_data: any = {};

  
  constructor(public service:DatabaseService, public cryptoService:CryptoService, public session: sessionStorage,public route:ActivatedRoute, public router : Router, public toast:ToastrManager) {
    this.userData = JSON.parse(localStorage.getItem('st_user'));
    this.userId = this.userData['data']['id'];
    this.userName = this.userData['data']['name'];
    let assign_login_data :any;
    assign_login_data = this.session.getSession();
    this.logined_user_data = assign_login_data.value.data;
    
  }
  
  ngOnInit() {
  }
  
  
  goBack() {
    window.history.back();
}
  
  onUploadChange(data: any)
  {
    this.errorMsg = false;
    this.image_id ='';
    for(let i=0;i<data.target.files.length;i++)
    {
      let files = data.target.files[i];
      if (files) 
      {
        let reader = new FileReader();
        reader.onload = (e: any) => {
          this.selected_video = e.target.result
        }
        reader.readAsDataURL(files);
      }
      this.video.append(""+i,data.target.files[i],data.target.files[i].name);
    }
  }

  
  submitDetail(){
    if(!this.selected_video){
      this.toast.errorToastr('Video required');
      return;
    }
    this.savingFlag = true;
    this.data.created_by_id   = this.userId;
    this.data.created_by_name   = this.userName;
    this.data.video = this.selected_video;
    
    this.encryptedData = this.service.payLoad ? this.data: this.cryptoService.encryptData(this.data);
    this.service.post_rqst(this.encryptedData,'Master/tutorialAddVideo').subscribe((result)=>
    {
      this.decryptedData = this.service.payLoad ? result : this.cryptoService.decryptData(JSON.stringify(result));
      if(this.decryptedData['statusCode'] == 200){
        this.toast.successToastr(this.decryptedData['statusMsg']);
        this.savingFlag = false;
        this.goBack()
      }
      else{
        this.toast.errorToastr(this.decryptedData['statusMsg']); 
        this.savingFlag = false;
      }
    })
    
  }
  
  
}
