import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import * as moment from 'moment';
import { ToastrManager } from 'ng6-toastr-notifications';
import { DialogComponent } from 'src/app/dialog.component';
import { sessionStorage } from 'src/app/localstorage.service';
import { DatabaseService } from 'src/_services/DatabaseService';
import { CryptoService } from 'src/_services/CryptoService';

@Component({
  selector: 'app-task-add',
  templateUrl: './task-add.component.html'
})

export class TaskAddComponent implements OnInit {
  savingFlag: boolean = false;
  data: any = {};
  urls = new Array<string>();
  selectedFile = [];
  formData = new FormData();
  userData: any;
  userId: any;
  userName: any;
  assign_login_data: any = [];
  users: any = [];
  encryptedData: any;
  decryptedData:any;
  

  constructor(public service: DatabaseService, public cryptoService:CryptoService, public rout: Router, public toast: ToastrManager, public session: sessionStorage, public dialog: DialogComponent) {
    this.assign_login_data = this.session.getSession();
    this.userData = JSON.parse(localStorage.getItem('st_user'));
    this.userId = this.userData['data']['id'];
    this.userName = this.userData['data']['name'];
    this.data.created_by_type = this.userData['data']['user_type'];

    this.getUsers('')
  }

  ngOnInit() {
  }

  insertImage(data) {
    let files = data.target.files;
    if (files) {
      for (let file of files) {
        let reader = new FileReader();
        reader.onload = (e: any) => {
          this.urls.push(e.target.result);
        }
        reader.readAsDataURL(file);
      }
    }

    for (var i = 0; i < data.target.files.length; i++) {
      this.selectedFile.push(data.target.files[i]);
    }
  }
  fileChange(event: any) {
    for (var i = 0; i < event.target.files.length; i++) {
      let files = event.target.files[i];
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
    
      this.selectedFile.push(event.target.files[i]);
      let reader = new FileReader();
      reader.onload = (e: any) => {
        let img = new Image();
        img.onload = () => {
          let canvas = document.createElement('canvas');
          let ctx = canvas.getContext('2d');
          canvas.width = img.width;
          canvas.height = img.height;
          ctx.drawImage(img, 0, 0);
          let dataURL = canvas.toDataURL(files.type);
          this.urls.push(dataURL);
          for (let index = 0; index < this.selectedFile.length; index++) {
            for (let urlIndex = 0; urlIndex < this.urls.length; urlIndex++) {
              if (index == urlIndex) {
                this.selectedFile[index]['path'] = this.urls[urlIndex];
              }
            }
          }
        };
        img.src = e.target.result;
      };
      reader.readAsDataURL(event.target.files[i]);
    }
    
  }
  remove_image(i: any) {
    this.urls.splice(i, 1);
    this.selectedFile.splice(i, 1);
  }


  getUsers(searcValue) {
    this.encryptedData = this.service.payLoad ? { 'search': searcValue }: this.cryptoService.encryptData({ 'search': searcValue });
    this.service.post_rqst(this.encryptedData , "Task/getUserList").subscribe((result => {
    this.decryptedData = this.service.payLoad ? result : this.cryptoService.decryptData(JSON.stringify(result));
      if (this.decryptedData['statusCode'] == 200) {
        this.users = this.decryptedData['data']
      }
      else {
        this.toast.errorToastr(this.decryptedData['statusMsg']);
      }
    }));
  }

  delete_img(index: any) {
    this.urls.splice(index, 1)
  }

  getInfo(id) {
    let index = this.users.findIndex(row => row.id == id)
    if (index != -1) {
      this.data.name = this.users[index].name;
      this.data.user_type = this.users[index].user_type;
    }
  }


  submitDetail() {
    this.data.created_by_id = this.userId;
    this.data.created_by_name = this.userName;
    this.data.attachment = this.selectedFile;
    this.savingFlag = true;
    this.encryptedData = this.service.payLoad ? { 'data': this.data }: this.cryptoService.encryptData({ 'data': this.data });
    this.service.post_rqst(this.encryptedData, "Task/addTask").subscribe((result => {
    this.decryptedData = this.service.payLoad ? result : this.cryptoService.decryptData(JSON.stringify(result));
      if (this.decryptedData['statusCode'] == 200) {
        this.toast.successToastr(this.decryptedData['statusMsg']);
        this.rout.navigate(['/task-list']);
        this.savingFlag = false;
      }
      else {
        this.toast.errorToastr(this.decryptedData['statusMsg']);
        this.savingFlag = false;
      }
    }));
  }

  public publicDate(date): void {
    this.data.promise_date = moment(date).format('YYYY-MM-DD');
  }



}
