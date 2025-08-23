import { Component, OnInit } from '@angular/core';
import { DatabaseService } from 'src/_services/DatabaseService';
import { ToastrManager } from 'ng6-toastr-notifications';
import {ActivatedRoute, Router } from '@angular/router';
import { CryptoService } from 'src/_services/CryptoService';
@Component({
  selector: 'app-point-category-add',
  templateUrl: './point-category-add.component.html'
})
export class PointCategoryAddComponent implements OnInit {
  userData: any;
  userId: any;
  userName: any;
  point_category_id:any;
  data:any ={};
  savingFlag:boolean = false;
  login_data: any = {};
  st_user: any
  InfluenceArray: any = [];
  subType:number=0
  columns:any=[{'label':'first','id':1, 'value':'10'}, {'label':'second', 'id':2, 'value':'20'}, {'label':'third', 'id':3, 'value':'30'}]

  constructor(public service:DatabaseService, public cryptoService:CryptoService, public rout: Router, public toast:ToastrManager, private route: ActivatedRoute) {
    this.userData = JSON.parse(localStorage.getItem('st_user'));
    this.userId=this.userData['data']['id'];
    this.userName=this.userData['data']['name'];
    this.st_user = JSON.parse(localStorage.getItem('st_user')) || [];
    this.subType = parseInt(this.userData['organisation_data']['scanning_sub_type_wise'])
    this.data.point_type='Item Box'
    
  }
  
  ngOnInit() {
    this.route.params.subscribe(params => {
      console.log(params['id'])
      this.point_category_id = params['id'];
      if (this.point_category_id)
      {
        this.pointCategory_data();
        this.fetchInfluencerList()
      }
    });
  }
  
  pointCategory_data(){
    this.service.post_rqst({'id':this.point_category_id},'Master/pointCategoryMasterDetail').subscribe((result)=>
    {
      if (result['statusCode'] == 200) {
        this.data =  result['point_category_detail'];
      }
      else {
        this.toast.errorToastr(result['statusMsg']);
      }
     
    })
  }
  
  MobileNumber(event: any) {
    const pattern = /[0-9\+\-\ ]/;
    let inputChar = String.fromCharCode(event.charCode);
    if (event.keyCode != 8 && !pattern.test(inputChar)) { event.preventDefault(); }
  }

  fetchInfluencerList(){
    this.st_user = JSON.parse(localStorage.getItem('st_user')) || [];
    if (this.st_user.data) {
      this.login_data = this.st_user.data;
      this.service.post_rqst({ 'user_id': this.login_data.id, 'user_type': this.login_data.type, 'cat_id':this.point_category_id }, "Influencer/influencerMasterList").subscribe(result => {
        if (result['statusCode'] == 200) {
          this.InfluenceArray = result['result'];
        }
        else {
          this.toast.errorToastr(result['statusMsg']);
        }
      });
    }
  }
  
  submitDetail(){
    console.log(this.InfluenceArray)
    this.data.created_by_name=this.userName;
    this.data.created_by_id=this.userId;
    this.data.sub_type = this.InfluenceArray;
    this.savingFlag = true;
    let header;
    if(this.point_category_id){
      
      if(this.data.point_type == 'Master Box'){
        this.data.influencer_point = '';
        this.data.scanning_point = '';
      }
      else{
        this.data.master_point = '';
      }
      
      header = this.service.post_rqst(this.data,'Master/editPointCategory')
    }
    else{
      header = this.service.post_rqst(this.data,'Master/addPointCategory')
    }
    header.subscribe((result)=>
    {
      
     

      if( result['statusCode'] == 200){
        this.toast.successToastr( result['statusMsg']);
        this.savingFlag = false;
        this.rout.navigate(['/point-list']);
      }
      else{
        this.toast.errorToastr( result['statusMsg']);
        this.savingFlag = false;
      }
    }, error => {
    })
    
  }
  
  
}
