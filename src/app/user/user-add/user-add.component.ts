import { Component, OnInit } from '@angular/core';
import { slideToTop } from '../../router-animation/router-animation.component';
import { DatabaseService } from 'src/_services/DatabaseService';
import { ActivatedRoute, Router } from '@angular/router';
import { DialogComponent } from 'src/app/dialog.component';
import { sessionStorage } from 'src/app/localstorage.service';
import * as moment from 'moment';
import { Location } from '@angular/common';
import { ToastrManager } from 'ng6-toastr-notifications';
import { MatDialog } from '@angular/material';
import { DesignationComponent } from '../designation/designation.component';
import { CryptoService } from 'src/_services/CryptoService';


@Component({
  selector: 'app-user-add',
  templateUrl: './user-add.component.html',
  animations: [slideToTop()]
  
})
export class UserAddComponent implements OnInit {
  states: any = [];
  report_manager: any = [];
  data: any = {};
  district_list: any = [];
  user_type;
  sales_type: any = [];
  loader: boolean = false;
  module_name: any = [];
  exist: boolean = false;
  assign_module_data: any = [];
  warehouse: any = [];
  userData: any;
  userId: any;
  userName: any;
  savingFlag: boolean = false;
  assign_login_data: any = {};
  logined_user_data: any = {};
  maxDate: any;
  organisationData: any = [];
  homePageList:any=[]
  sfaHomeList:any=[]
  dmsHomeList:any=[]
  loyaltyHomeList:any=[];
  approvalLevel:any =[]
  statesList:any=[];
  
  constructor(public service: DatabaseService,
    public cryptoService:CryptoService,
    public dialog1: MatDialog,
    private route: ActivatedRoute,
    public toast: ToastrManager, public location: Location, public session: sessionStorage, public rout: Router, public dialog: DialogComponent) {
      this.maxDate = new Date();
      this.assign_login_data = this.session.getSession();
      this.logined_user_data = this.assign_login_data.value.data;
      if (this.logined_user_data.id == '1') {
        this.data.user_type = 'ORG';
      }
      else {
        if(this.logined_user_data.organisation_data.sfa == '1'){
          this.data.user_type = 'Sales User';
        }
        
        else if(this.logined_user_data.organisation_data.sfa == '1' || this.logined_user_data.organisation_data.dms == '1' || this.logined_user_data.organisation_data.loyalty == '1' || this.logined_user_data.organisation_data.dispatch == '1'){
          this.data.user_type = 'System User';
        }
        else{
          this.data.user_type = 'Sales User';
        }
        this.getReportManager('');
      }
      this.getStateList('');
      this.getWorkingStateList('');
      this.get_sales_user_type(this.data.user_type, '');
      this.fetchHomePageList()
      this.data.order_type = '0'
    }
    
    
    ngOnInit() {
      this.route.params.subscribe(params => {
        this.userId = params['id'];
        if (this.userId) {
          this.loader = true;
        }
      });
    }
    
    
    
    MobileNumber(event: any) {
      const pattern = /[0-9\+\-\ ]/;
      let inputChar = String.fromCharCode(event.charCode);
      if (event.keyCode != 8 && !pattern.test(inputChar)) { event.preventDefault(); }
      
    }
    
    isValidName(event: any){
      const pattern = /^[A-Za-z]+$/;
      let inputChar = String.fromCharCode(event.charCode);
      if (event.keyCode != 8 && event.keyCode != 32 && !pattern.test(inputChar)) { event.preventDefault(); }
    }
    
    paytmMobileNumber(event: any) {
      const pattern = /[0-9\+\-\ ]/;
      let inputChar = String.fromCharCode(event.charCode);
      if (event.keyCode != 8 && !pattern.test(inputChar)) { event.preventDefault(); }
    }
    check_number() {
      if (this.data.mobileno.length == 10) {
        this.service.post_rqst({ "mobile": this.data.mobileno }, "Master/userMobileNoCheck").subscribe((result => {
          
          if (result['statusCode'] == 200) {
            if (result['statusMsg'] != 'Not Exist') {
              this.exist = true;
              this.toast.errorToastr(result['statusMsg'])
            }
            else {
              this.exist = false;
            }
          }
          else {
            this.exist = false;
            this.toast.errorToastr(result['statusMsg'])
          }
        }))
      }
    }
    
    
    
    getWarehouse() {
      this.service.post_rqst({}, "Dispatch/fetchWarehouse").subscribe((result => {
        if (result['statusCode'] == 200) {
          this.warehouse = result['result'];
        }
        else {
          this.toast.errorToastr(result['statusMsg']);
        }
      }));
    }
    
    fetchHomePageList() {
      this.service.post_rqst({}, "Master/homePageList").subscribe((result => {
        if (result['statusCode'] == 200) {
          this.homePageList = result['page'];
          this.sfaHomeList = this.homePageList.filter((type)=>type.type=='sfa')
          this.dmsHomeList = this.homePageList.filter((type)=>type.type=='dms')
          this.loyaltyHomeList = this.homePageList.filter((type)=>type.type=='loyalty');
          
          if(this.sfaHomeList.length == 1){
            this.data.home_page_sfa =  this.sfaHomeList[0]['page_name']
          }
          if(this.dmsHomeList.length == 1){
            this.data.home_page_dms =  this.dmsHomeList[0]['page_name']
          }
          if(this.loyaltyHomeList.length == 1){
            this.data.home_page_loyalty =  this.loyaltyHomeList[0]['page_name']
          }
          
          
        }
        else {
          this.toast.errorToastr(result['statusMsg']);
        }
      }));
    }
    
    checkType(type){
      return type.type=='sfa'
    }
    
    getCompanyData() {
      this.service.post_rqst({}, "Order/organizationName").subscribe((result => {
        if (result['statusCode'] == 200) {
          this.organisationData = result['result'];
        } else {
          this.toast.errorToastr(result['statusMsg']);
        }
        
      }));
    }
    
    
    getStateList(search) {
      this.service.post_rqst({'search':search}, "Master/getAllState").subscribe((result => {
        
        if (result['statusCode'] == 200) {
          this.statesList = result['all_state'];
        }
        else {
          this.toast.errorToastr(result['statusMsg'])
        }
      }));
    }

    getWorkingStateList(search) {
      this.service.post_rqst({'search':search}, "Master/getAllState").subscribe((result => {
        
        if (result['statusCode'] == 200) {
          this.states = result['all_state'];
        }
        else {
          this.toast.errorToastr(result['statusMsg'])
        }
      }));
    }
    
    working_district_list:any=[];
    getDistrict(val,search) {
      let st_name;
      if (val == 1) {
        st_name = this.data.state;
      }
      if (val == 2) {
        st_name = this.data.working_state;
      }
      this.service.post_rqst({ 'state_name': st_name,'search':search }, "Master/getAllDistrict").subscribe((result => {
        if (result['statusCode'] == 200) {
          if(val == 1){
          this.district_list = result['all_district'];
          }else{
            this.working_district_list = result['all_district'];
          }
        }
        else {
          this.toast.errorToastr(result['statusMsg'])
        }
      }));
      
    }
    
    
    
    get_sales_user_type(type, event) {
      let Usertype
      if (type != '') {
        Usertype = type;
      }
      else {
        Usertype = event.value
      }
      this.service.post_rqst({ 'user_type': Usertype }, "Master/getDesignation").subscribe((result => {
        if(result['statusCode'] == 200){
          this.sales_type = result ['all_designation'];
        }
        else{
          this.toast.errorToastr(result['statusMsg']);
        }
        
      }));
    }
    
    selectAllOption(type) {
      console.log(type);
      if (type == 'state') {
        setTimeout(() => {
          if (this.data.allWorkingState == true) {
            const allSelectedState = [];
            for (let i = 0; i < this.states.length; i++) {
              allSelectedState.push(this.states[i].state_name)
            }
            this.data.working_state = allSelectedState;
            this.getDistrict(2,'');
          } else {
            this.data.working_state=[];
          }
        }, 100);
      }
      if(type == 'district')
        {
          console.log(type);
        setTimeout(() => {
          if (this.data.allWorkingDistrict == true) {
            const allSelectedDistrict = [];
            for (let i = 0; i < this.working_district_list.length; i++) {
              allSelectedDistrict.push(this.working_district_list[i].district_name)
              console.log(allSelectedDistrict);
            }
            console.log(allSelectedDistrict);
            this.data.working_district = allSelectedDistrict;
          } else {
            this.data.working_district=[];
          }
        }, 100);
      }
    }
    
    getReportManager(searcValue) {
      setTimeout(() => {
        this.service.post_rqst({ 'search': searcValue }, "Master/getSalesUserForReporting").subscribe((result => {
          
          if (result['statusCode'] == 200) {
            this.report_manager = result['all_sales_user'];
          }
          else {
            this.toast.errorToastr(result['statusMsg'])
          }
        }));
      }, 500);
    }
    
    
    submitDetail() {
      this.loader = true;
      if (this.data.date_of_birth) {
        this.data.date_of_birth = moment(this.data.date_of_birth).format('YYYY-MM-DD');
        this.data.date_of_birth = this.data.date_of_birth;
      }
      if (this.data.date_of_wedding) {
        this.data.date_of_wedding = moment(this.data.date_of_wedding).format('YYYY-MM-DD');
        this.data.date_of_wedding = this.data.date_of_wedding;
      }
      if (this.data.date_of_joining) {
        this.data.date_of_joining = moment(this.data.date_of_joining).format('YYYY-MM-DD');
        this.data.date_of_joining = this.data.date_of_joining;
      }
      if (this.data.user_type == 'System User') {
        this.data.assignModule = this.assign_module_data;
      }
      if (this.data.user_type != 'Service Engineer') {
        
        if (this.data.user_role) {
          let index = this.sales_type.findIndex(d => d.id == this.data.user_role);
          if (index != -1) {
            this.data.role_name = this.sales_type[index].role_name
          }
        }
        
      }
      
      
      
      
      
      
      this.data.uid = this.userId;
      this.data.uname = this.userName;
      this.data.created_by_name = this.logined_user_data.name;
      this.data.created_by_id = this.logined_user_data.id;
      this.savingFlag = true;
      this.service.post_rqst({ 'data': this.data }, "Master/addUser").subscribe((result => {
        
        
        if (result['statusCode'] == "200") {
          this.toast.successToastr(result['statusMsg']);
          this.rout.navigate(['/sale-user-list']);
          this.savingFlag = false;
          this.service.count_list();
          
        }
        else {
          this.toast.errorToastr(result['statusMsg']);
          this.savingFlag = false;
        }
      }));
    }
    
    get_module_data() {
      this.service.post_rqst(0, "Master/moduleMasterList").subscribe((result => {
        if(result['statusCode'] == 200){
          this.assign_module_data = result['result'];
        }
        else{
          this.toast.errorToastr(result['statusMsg']);
        }
        
        
      }));
      
    }
    
    
    checkIndex(id){
      let index = this.sales_type.findIndex(row => row.id == id);
      if (index != -1) {
        this.data.influencer_approval = this.sales_type[index].influencer_approval;
        
        if(this.data.influencer_approval == 1){
          this.getLevel();
        }
      }
    }
    
    
    
    getLevel() {
      this.service.post_rqst('', "master/approval_level_manage").subscribe((result => {
        
        if(result['statusCode'] == 200){
          this.approvalLevel = result['data']
        }
        else{
          this.toast.errorToastr(result['statusMsg']);
        }
      }));
    }
    
    
    paperSize:any =[];
    
    getPaperSize(event) {
      if(event.checked){
        this.service.post_rqst('', "CouponCode/templateList").subscribe((result => {
          if(result['statusCode'] == 200){
            this.paperSize = result['result'];
          }
          else{
            this.toast.errorToastr(result['statusMsg']);
          }
          // this.sales_type = result ['all_designation'];
        }));
      }
    }
    
    assign_module(module_name, event, index) {
      if (event.checked) {
        this.assign_module_data[index][module_name] = 'true';
      }
      else {
        this.assign_module_data[index][module_name] = 'false';
      }
    }
    
    
    back(): void {
      this.location.back()
    }
    
    openDialog(): void {
      const dialogRef = this.dialog1.open(DesignationComponent, {
        width: '500px',
        panelClass: 'cs-modal',
        disableClose: true,
        data: {
          'type': 'designation'
        }
        
      });
      
      dialogRef.afterClosed().subscribe(result => {
        
        if (result == true) {
          this.get_sales_user_type(this.data.user_type, '')
        }
        
      });
    }
  }
  