import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { ToastrManager } from 'ng6-toastr-notifications';
import { DialogComponent } from 'src/app/dialog.component';
import { sessionStorage } from 'src/app/localstorage.service';
import { DatabaseService } from 'src/_services/DatabaseService';
import * as moment from 'moment';
import { CryptoService } from 'src/_services/CryptoService';


@Component({
  selector: 'app-task-action-modal',
  templateUrl: './task-action-modal.component.html'
})
export class TaskActionModalComponent implements OnInit {
  data:any ={}
  savingFlag:boolean = false;
  userData: any;
  userId: any;
  userName: any;
  minDate:any;
  encryptedData: any;
  decryptedData:any;
  
  constructor(@Inject(MAT_DIALOG_DATA) public modelData, public cryptoService:CryptoService, public dialog: MatDialog, public service: DatabaseService, public session: sessionStorage, public toast: ToastrManager,public alert : DialogComponent , public dialogRef: MatDialogRef<TaskActionModalComponent>) {
    this.userData = JSON.parse(localStorage.getItem('st_user'));
    this.minDate = new Date();
    this.userId = this.userData['data']['id'];
    this.userName = this.userData['data']['name'];
  }
  
  
  ngOnInit() {
  }
  
  
  submit() {
    this.savingFlag = true;
    this.data.id = this.modelData.id;
    this.data.created_by_id = this.userId;
    this.data.created_by_name = this.userName;
    
    
    if(this.data.promise_Date){
      this.data.promise_Date = moment(this.data.promise_Date).format('YYYY-MM-DD');
    }
    this.encryptedData = this.service.payLoad ? { 'data': this.data}: this.cryptoService.encryptData({ 'data': this.data});
    this.service.post_rqst(this.encryptedData, "Task/updatePromiseDate").subscribe((result => {
    this.decryptedData = this.service.payLoad ? result : this.cryptoService.decryptData(JSON.stringify(result));
      if (this.decryptedData['statusCode'] == 200) {
        this.dialog.closeAll();
        this.savingFlag = false;
        this.toast.successToastr(this.decryptedData['statusMsg']);
      }
      else {
        this.toast.errorToastr(this.decryptedData['statusMsg']);
        this.savingFlag = false;
      }
      
    }))
    
  }

  submitRemark() {
    this.savingFlag = true;
    this.data.id = this.modelData.id;
    this.data.created_by_id = this.userId;
    this.data.created_by_name = this.userName;
    this.encryptedData = this.service.payLoad ? { 'data': this.data}: this.cryptoService.encryptData({ 'data': this.data});
    this.service.post_rqst(this.encryptedData, "Task/closeTask").subscribe((result => {
      this.decryptedData = this.service.payLoad ? result : this.cryptoService.decryptData(JSON.stringify(result));
      if (this.decryptedData['statusCode'] == 200) {
        this.dialog.closeAll();
        this.savingFlag = false;
        this.toast.successToastr(this.decryptedData['statusMsg']);
      }
      else {
        this.toast.errorToastr(this.decryptedData['statusMsg']);
        this.savingFlag = false;
      }
      
    }))
    
  }
  
}
