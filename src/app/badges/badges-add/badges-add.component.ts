import { Component, OnInit } from '@angular/core';
import { DatabaseService } from 'src/_services/DatabaseService';
import { ToastrManager } from 'ng6-toastr-notifications';
import {ActivatedRoute, Router } from '@angular/router';
import { CryptoService } from 'src/_services/CryptoService';
import * as moment from 'moment';


@Component({
  selector: 'app-badges-add',
  templateUrl: './badges-add.component.html'
})
export class BadgesAddComponent implements OnInit {
  userData: any;
  userId: any;
  userName: any;
  badges_id:any;
  data:any ={};
  savingFlag:boolean = false;
  login_data: any = {};
  st_user: any
  encryptedData: any;
  InfluenceArray: any = [];
  decryptedData:any;
  subType:number=0
  today_date: any = new Date();
  image= new FormData()
  
  constructor(public service:DatabaseService, public cryptoService:CryptoService, public rout: Router, public toast:ToastrManager, private route: ActivatedRoute) {
    this.userData = JSON.parse(localStorage.getItem('st_user'));
    this.userId=this.userData['data']['id'];
    this.userName=this.userData['data']['name'];
    this.st_user = JSON.parse(localStorage.getItem('st_user')) || [];
    this.subType = parseInt(this.userData['organisation_data']['scanning_sub_type_wise']);
    this.today_date = new Date();
    this.data.day = 'Day'
  }
  
  ngOnInit() {
    
    if(this.subType){
      this.fetchInfluencerList()
    }
    this.route.params.subscribe(params => {
      this.badges_id = params['id'];
      if (this.badges_id)
        {
        this.pointCategory_data();
        
      }
    });
  }
  
  pointCategory_data(){
    this.encryptedData = this.service.payLoad ? {'id':this.badges_id}: this.cryptoService.encryptData({'id':this.badges_id});
    this.service.post_rqst(this.encryptedData,'Master/pointCategoryMasterDetail').subscribe((result)=>
      {
      this.decryptedData = this.service.payLoad ? result : this.cryptoService.decryptData(JSON.stringify(result));
      this.data =  this.decryptedData['point_category_detail'];
    })
  }
  
  MobileNumber(event: any) {
    const pattern = /[0-9\+\-\ ]/;
    let inputChar = String.fromCharCode(event.charCode);
    if (event.keyCode != 8 && !pattern.test(inputChar)) { event.preventDefault(); }
  }
  
  fetchInfluencerList(){
    // Influencer/influencerMasterList
    // this.sessionTimer();
    this.st_user = JSON.parse(localStorage.getItem('st_user')) || [];
    if (this.st_user.data) {
      this.login_data = this.st_user.data;
      this.encryptedData = this.service.payLoad ? { 'user_id': this.login_data.id, 'user_type': this.login_data.type, 'cat_id':this.badges_id } : this.cryptoService.encryptData({ 'user_id': this.login_data.id, 'user_type': this.login_data.type });
      this.service.post_rqst(this.encryptedData, "Influencer/influencerMasterList").subscribe(result => {
        this.decryptedData = this.service.payLoad ? result : this.cryptoService.decryptData(JSON.stringify(result));
        if (this.decryptedData) {
          this.InfluenceArray = this.decryptedData['result'];
        }
        else {
        }
        
      });
    }
  }
  
  
  img:any;
  
  onUploadChange(data: any) {
    
    for (let i = 0; i < data.target.files.length; i++) {
      let files = data.target.files[i];
      const byte = 1000000; // 1 MB in bytes
      const allowed_types = ['image/png', 'image/jpg', 'image/jpeg'];
      if (!allowed_types.includes(files.type)) {
        this.toast.errorToastr('Only .png, .jpg, .jpeg files are accepted');
        return;
      }
      
      if (files.size > (byte * 2)) {
        this.toast.errorToastr('Image file size is too large, maximum file size is 2 MB.');
        return;
      }
      
      if (files) {
        let reader = new FileReader();
        reader.onload = (e: any) => {
          const img = new Image();
          img.src = e.target.result;
          
          img.onload = () => {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d')!;
            canvas.width = img.width;
            canvas.height = img.height;
            ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
            const dataURL = canvas.toDataURL(files.type);
            if (img.width !== 100 || img.height !== 100) {
              this.toast.errorToastr('Image dimensions must be 100x100 pixels.');
              return;
            } else {
              this.img = dataURL;
            }
            fetch(dataURL)
            .then(res => res.blob())
            .then(blob => {
              const cleanedFile = new File([blob], files.name, { type: files.type });
              this.image.append("" + i, cleanedFile, cleanedFile.name);
            });
          };
        };
        
        reader.readAsDataURL(files);
      }
    }
    
    
    
    
    // for (let i = 0; i < data.target.files.length; i++) {
    //   let file = data.target.files[i];
    //   const byte = 1000000; // 1 MB in bytes
    //   const allowed_types = ['image/png', 'image/jpg', 'image/jpeg'];
      
    //   if (!allowed_types.includes(file.type)) {
    //     this.toast.errorToastr('Only .png, .jpg, .jpeg files are accepted');
    //     return;
    //   }
      
    //   if (file.size > (byte * 2)) {
    //     this.toast.errorToastr('Image file size is too large, maximum file size is 2 MB.');
    //     return;
    //   }
      
    //   if (file) {
    //     let reader = new FileReader();
    //     reader.onload = (e: any) => {
    //       let img = new Image();
    //       img.src = e.target.result;
          
    //       img.onload = () => {
    //         if (img.width !== 100 || img.height !== 100) {
    //           this.toast.errorToastr('Image dimensions must be 100x100 pixels.');
    //           return;
    //         } else {
    //           this.img = e.target.result;
    //         }
    //       };
    //     };
    //     reader.readAsDataURL(file);
    //   }
    // }
  }
  
  
  
  submitDetail(){
    if (!this.img){
      this.toast.errorToastr('Image is required');
      return
    }
    
    if(this.data.date_from){
      this.data.date_from = moment(this.data.date_from).format('YYYY-MM-DD');
    }
    if(this.data.date_to){
      this.data.date_to = moment(this.data.date_to).format('YYYY-MM-DD');
    }
    this.data.created_by_name=this.userName;
    this.data.created_by_id=this.userId;
    
    this.data.template_img=this.img;
    this.savingFlag = true;
    this.encryptedData = this.service.payLoad ? this.data: this.cryptoService.encryptData(this.data);
    
    let header;
    if(this.badges_id){
      
      if(this.data.point_type == 'Master Box'){
        this.data.influencer_point = '';
        this.data.scanning_point = '';
      }
      else{
        this.data.master_point = '';
      }
      
      header = this.service.post_rqst(this.encryptedData,'Bonus/saveInfluencerBudge')
    }
    else{
      header = this.service.post_rqst(this.encryptedData,'Bonus/saveInfluencerBudge')
    }
    header.subscribe((result)=>
      {
      
      this.decryptedData = this.service.payLoad ? result : this.cryptoService.decryptData(JSON.stringify(result));
      
      if( this.decryptedData['statusCode'] == 200){
        this.toast.successToastr( this.decryptedData['statusMsg']);
        this.savingFlag = false;
        this.rout.navigate(['/badges-list']);
      }
      else{
        this.toast.errorToastr( this.decryptedData['statusMsg']);
        this.savingFlag = false;
      }
    }, error => {
    })
    
  }
  
  
}
