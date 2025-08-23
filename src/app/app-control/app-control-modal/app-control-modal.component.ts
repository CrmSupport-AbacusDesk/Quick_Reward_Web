import { Component, OnInit, Inject } from '@angular/core';
import { Location } from '@angular/common';
import { DatabaseService } from 'src/_services/DatabaseService';
import { ToastrManager } from 'ng6-toastr-notifications';
import { ActivatedRoute, Router } from '@angular/router';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material';
import { CryptoService } from 'src/_services/CryptoService';

@Component({
  selector: 'app-app-control-modal',
  templateUrl: './app-control-modal.component.html',
  styleUrls: ['./app-control-modal.component.scss']
})
export class AppControlModalComponent implements OnInit {

  tabType: any;
  action: any;
  typeId: any;
  loader: boolean = false;
  userList: any = [];
  datanotfound: boolean = false;
  reqdata: any;
  filter: any = {};
  typeName: any ;
  encryptedData: any;
  decryptedData:any;


  constructor(@Inject(MAT_DIALOG_DATA) public data, public cryptoService:CryptoService, public service: DatabaseService,public location: Location, public dialogs: MatDialog,public navparams: ActivatedRoute, public router: Router, private route: ActivatedRoute,public toast: ToastrManager) { 
    this.tabType = this.data.tabType;
    this.action = this.data.action;
    this.typeId = this.data.typeId;
    this.typeName = this.data.typeName;
    this.getUsersList();
  }

  ngOnInit() {
  }

  getUsersList(){
    this.loader = true ;
    this.reqdata = {'typeId' : this.typeId, 'action': this.action};
    this.encryptedData = this.service.payLoad ? {'data': this.reqdata, 'filter': this.filter}: this.cryptoService.encryptData({'data': this.reqdata, 'filter': this.filter});
    this.service.post_rqst(this.encryptedData, 'appControl/Common/viewUsers').subscribe(result => {
    this.decryptedData = this.service.payLoad ? result : this.cryptoService.decryptData(JSON.stringify(result));
      if (this.decryptedData['statusCode'] == 200) {
        this.userList = this.decryptedData['result'];
        if(this.userList.length == 0){
          this.datanotfound = true;
        }
        this.loader = false;
      }
      else{
        this.toast.errorToastr(this.decryptedData['statusMsg']);
        this.loader = false ;
      }  
    })
  }

}
