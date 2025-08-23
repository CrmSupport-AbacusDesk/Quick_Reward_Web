import { Component, OnInit, ViewChild } from '@angular/core';
import { DatabaseService } from 'src/_services/DatabaseService'
import { ToastrManager } from 'ng6-toastr-notifications';
import { Router,ActivatedRoute } from '@angular/router';
import { CryptoService } from 'src/_services/CryptoService';
import { sessionStorage } from 'src/app/localstorage.service';
import { uploadImgService } from 'src/_services/uploadImg';

@Component({
  selector: 'app-banner-add',
  templateUrl: './banner-add.component.html'
})
export class BannerAddComponent implements OnInit {
  
  @ViewChild('fileInput') fileInput: any;
  data:any={};
  selected_image :any;
  image_id:any;
  image = new FormData();
  savingFlag: boolean=false;
  errorMsg: boolean=false;
  userData: any;
  userId: any;
  userName:any;
  encryptedData: any;
  decryptedData:any;
  logined_user_data: any = {};

  
  constructor(public service:DatabaseService,  public uploadDoc:uploadImgService, public cryptoService:CryptoService, public session: sessionStorage,public route:ActivatedRoute, public router : Router, public toast:ToastrManager) {
    this.userData = JSON.parse(localStorage.getItem('st_user'));
    this.userId = this.userData['data']['id'];
    this.userName = this.userData['data']['name'];
    let assign_login_data :any;
    assign_login_data = this.session.getSession();
    this.logined_user_data = assign_login_data.value.data;
    this.service.orgUserType();
  }
  
  ngOnInit() {
  }
  
  
  
  
  onUploadChange(data: any) {
    this.errorMsg = false;
    this.image_id = '';
    for (let i = 0; i < data.target.files.length; i++) {
      const file = data.target.files[i];
      const reader = new FileReader();
      reader.onload = (e: any) => {
        const img = new Image();
        img.onload = () => {
          if (img.width === 1600 && img.height === 900) {
            this.uploadDoc.processImageFile(file)
              .then(({ dataURL, cleanedFile }) => {
                if (file) {
                  this.selected_image = dataURL;
                  this.image.append("" + i, cleanedFile, cleanedFile.name);
                }
              }) 
              .catch(err => {
                this.toast.errorToastr(err);
              });
          } else {
            this.toast.errorToastr('Image must be 1600x900 pixels.');
          }
        };
        img.onerror = () => {
          this.toast.errorToastr('Invalid image file.');
        };
        img.src = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  

  }

  submitDetail(){
    if(!this.selected_image){
      this.toast.errorToastr('Banner images required');
      return;
    }
    this.savingFlag = true;
    this.data.created_by_id   = this.userId;
    this.data.created_by_name   = this.userName;
    this.data.banner   = this.selected_image;
    this.encryptedData = this.service.payLoad ? this.data: this.cryptoService.encryptData(this.data);
    this.service.post_rqst(this.encryptedData,'Master/addBanner').subscribe((result)=>
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
