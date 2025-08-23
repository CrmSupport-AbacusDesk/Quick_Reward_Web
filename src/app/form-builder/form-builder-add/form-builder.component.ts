import { Component, OnInit } from '@angular/core';
import { DatabaseService } from 'src/_services/DatabaseService';
import * as moment from 'moment';
import { ToastrManager } from 'ng6-toastr-notifications';
import { Router } from '@angular/router';
import { CryptoService } from 'src/_services/CryptoService';
import { Location } from '@angular/common';


@Component({
  selector: 'app-form-builder',
  templateUrl: './form-builder.component.html'
})
export class FormBuilderComponent implements OnInit {
  data:any={};
  state_data:any={};
  states: any = [];
  savingFlag:boolean = false;
  date;
  encryptedData: any;
  decryptedData:any;
  listarray:any =[];
  org:any =[];
  
  constructor(public service:DatabaseService, public location: Location,  public cryptoService:CryptoService,  public rout: Router,public toast:ToastrManager,) 
  {
    this.date = new Date();
    this.getOrg('');
  }
  
  
  ngOnInit() 
  {
    
  }
  
  


  getOrg(searcValue) {
    this.encryptedData = this.service.payLoad ? { 'search': searcValue }: this.cryptoService.encryptData({ 'search': searcValue });
    this.service.post_rqst(this.encryptedData, "Master/formBuilderOrgList").subscribe((result => {
      this.decryptedData = this.service.payLoad ? result : this.cryptoService.decryptData(JSON.stringify(result));
      if (this.decryptedData['statusCode'] == 200) {
        this.org = this.decryptedData['org']
      }
      else{
        this.toast.errorToastr(this.decryptedData['statusMsg'])
      }
    }));
  }


  
  
  getStateList() {
    this.service.post_rqst(0, "Master/getAllState").subscribe((result => {
      this.decryptedData = this.service.payLoad ? result : this.cryptoService.decryptData(JSON.stringify(result));
      if (this.decryptedData['statusCode'] == 200) {
        this.states = this.decryptedData['all_state'];
      }
      else{
        this.toast.errorToastr(this.decryptedData['statusMsg'])
      }
    }));
  }
  
  
  
  
  addtolist() {
    const { dropdown_option } = this.data;
    const index = this.listarray.indexOf(dropdown_option);
    if (index !== -1) {
      this.listarray.splice(index, 1);
    }
    this.listarray.push(dropdown_option);
    this.data.dropdown_option = '';
  }

  delete(i){
    this.listarray.splice(i, 1);
  }

  back(): void {
    this.location.back()
  }
  
  
  
  
  submit()
  {
    
    if(this.listarray.length > 0 && this.data.field_type == 'Dropdown'){
      this.data.dropdown_option = this.listarray.join(',');
    }
    this.savingFlag = true;
    this.encryptedData = this.service.payLoad ? {'data':this.data}: this.cryptoService.encryptData({'data':this.data});
    this.service.post_rqst(this.encryptedData,'Master/formBuilderOrgAdd').subscribe((result)=>
      {
      this.decryptedData = this.service.payLoad ? result : this.cryptoService.decryptData(JSON.stringify(result));
      
      if(this.decryptedData['statusCode'] == 200){
        this.toast.successToastr(this.decryptedData['statusMsg']);
        this.savingFlag = false;
        this.rout.navigate(['/form-list']);
      }
      else{
        this.toast.errorToastr(this.decryptedData['statusMsg']);
        this.savingFlag = false;
      }
    })
  }
  
  
}


