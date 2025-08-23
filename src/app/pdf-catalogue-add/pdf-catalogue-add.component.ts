import { Component, OnInit } from '@angular/core';
import { DatabaseService } from 'src/_services/DatabaseService'
import { ToastrManager } from 'ng6-toastr-notifications';
import { Router,ActivatedRoute } from '@angular/router';
import * as _ from 'lodash';
import { CryptoService } from 'src/_services/CryptoService';


@Component({
  selector: 'app-pdf-catalogue-add',
  templateUrl: './pdf-catalogue-add.component.html'
})
export class PdfCatalogueAddComponent implements OnInit {
  data:any ={};
  savingFlag:boolean = false;
  userData: any;
  userId: any;
  userName: any;
  urls: any = [];
  imageError:any='';
  typecheck:any='';
  istrue:boolean=false;
  selectedFile: any = [];
  file:any = {};
  file_name:any;
  formData = new FormData();
  logined_user_data:any ={};

  constructor(public service:DatabaseService, public cryptoService:CryptoService, public route:ActivatedRoute, public router : Router, public toast:ToastrManager) {
    this.userData = JSON.parse(localStorage.getItem('st_user'));
    this.userId=this.userData['data']['id'];
    this.userName=this.userData['data']['name'];
    this.logined_user_data = this.userData['data'];
    this.service.orgUserType();
  }

  ngOnInit() {
  }

  onUploadChange1(evt: any, f: any): void {
    this.imageError = null;
    this.file = evt.target.files[0];
    this.file_name = this.file.name;
    const allowed_types = ['application/pdf'];
  
    // Check if the file type is allowed
    if (!allowed_types.includes(this.file.type)) {
      this.toast.errorToastr('Only PDF files are accepted');
      this.file_name = '';
      this.istrue = false;
      return;
    }
  
    const byte = 1000000; // 1 MB in bytes
    if (this.file.size > (byte * 20)) {
      this.toast.errorToastr('PDF file size is too large, maximum file size is 20 MB.');
      this.file_name = '';
      this.istrue = false;
      return;
    } else {
      this.istrue = true;
    }
  }
  

  delete_img(index: any) {
    this.urls.splice(index, 1)
    this.selectedFile=[];
  }



  submitDetail() {

    if(this.file_name == null || this.file_name == undefined ){
      this.toast.errorToastr('PDF file is Required');
      return;
    }
    this.data.created_by_name=this.userName;
    this.data.created_by_id=this.userId;

    this.savingFlag = true;
    this.service.post_rqst(this.data,'Master/addDocumentCatalogue').subscribe((result)=>
    {
      
     
      if(result['statusCode'] == 200){
        if (this.formData) {
          this.formData.append('category', this.file, this.file.name);
          this.formData.append('id', result['last_id']);
          this.service.FileData((this.formData), "Master/insertDocumentCatalogueDocFile").subscribe((result) => {
            this.savingFlag = false;
            let data
            data = this.service.payLoad ? result : this.cryptoService.decryptData(JSON.stringify(result));


            if (data['statusCode'] == 200) {
              this.toast.successToastr(data['statusMsg']);
              this.savingFlag = false;
              this.router.navigate(['/catalogue']);
            }
            else{
              this.toast.errorToastr(data['statusMsg']);
              this.savingFlag = false;
            }
          });
        }

      }
      else{
        this.toast.errorToastr(result['statusMsg']);
        this.savingFlag = false;
      }

    })
  }

}
