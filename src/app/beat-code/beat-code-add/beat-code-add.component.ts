import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrManager } from 'ng6-toastr-notifications';
import { DatabaseService } from 'src/_services/DatabaseService';
import { Location } from '@angular/common'


@Component({
  selector: 'app-beat-code-add',
  templateUrl: './beat-code-add.component.html'
})
export class BeatCodeAddComponent implements OnInit {
  states: any = [];
  district_list: any = [];
  data:any ={};
  savingFlag:boolean= false;
  pincode_list:any =[];


  constructor(public service:DatabaseService,  public location: Location,public toast:ToastrManager, public rout: Router,) { }

  ngOnInit() {
    this.getStateList();
  }





  getStateList() {
    this.service.post_rqst('0', "Master/getAllState").subscribe((result => {
      if (result['statusCode'] == 200) {
        this.states = result['all_state'];
      }
      else{
        this.toast.errorToastr(result['statusMsg'])
      }
    }));
  }
  
  getDistrict(val) {
    let st_name;
    if(val == 1)
      {
      st_name = this.data.state;
    }
    this.service.post_rqst({'state_name':st_name}, "Master/getAllDistrict").subscribe((result => {
      if (result['statusCode'] == 200) {
        this.district_list = result['all_district'];
      }
      else{
        this.toast.errorToastr(result['statusMsg'])
      }
    }));
    
  }

  getPincode(search,val) {
    let st_name;
    let dist_name;

    if(val == 1)
      {
      st_name = this.data.state;
      dist_name = this.data.district;
    }
    this.service.post_rqst({'state_name':st_name, 'district_name':this.data.district, 'search':search}, "Master/all_pincode_list").subscribe((result => {
      if (result['statusCode'] == 200) {
        this.pincode_list = result['all_pincode'];
      }
      else{
        this.toast.errorToastr(result['statusMsg'])
      }
    }));
    
  }


    
  submit()
  {
    this.savingFlag = true;
    this.service.post_rqst({'data':this.data},'Master/addTerritory').subscribe((result)=>
      {
      if(result['statusCode'] == 200){
        this.toast.successToastr(result['statusMsg']);
        this.rout.navigate(['/beat-code']);
        this.savingFlag = false;
      }
      else{
        this.toast.errorToastr(result['statusMsg']);
        this.savingFlag = false;
      }
    })
  }


  back(): void {
    this.location.back()
  }

}
