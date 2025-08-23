
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
  selector: 'app-edit-user',
  templateUrl: './edit-user.component.html'
})

export class EditUserComponent implements OnInit {
  states: any = [];
  report_manager: any = [];
  data: any = {};
  district_list: any = [];
  user_type:any;
  sales_type: any = [];
  loader: boolean = false;
  module_name: any = [];
  exist: boolean = false;
  assign_module_data: any = [];
  userData: any;
  userId: any;
  userName: any;
  savingFlag: boolean = false;
  assign_login_data: any = {};
  logined_user_data: any = {};
  maxDate: any;
  branch: any = [];
  organisationData: any = [];
  warehouse: any = [];
  paperSize:any =[];
  working_district_list:any=[];

  constructor(public service: DatabaseService,
    public cryptoService:CryptoService,
    public dialog1: MatDialog,
    private route: ActivatedRoute,
    public toast: ToastrManager, public location: Location, public session: sessionStorage, public rout: Router, public dialog: DialogComponent) {
    this.maxDate = new Date();
    this.assign_login_data = this.session.getSession();
    this.logined_user_data = this.assign_login_data.value.data;
    this.getStateList('');
    this.getWorkingStateList('');
    if (this.logined_user_data.id == '1') {
      this.data.user_type = 'ORG';
    }
    else {
      if(this.logined_user_data.organisation_data.sfa == '1'){
        this.data.user_type = 'Sales User';
      }

      else if(this.logined_user_data.organisation_data.sfa == '1' || this.logined_user_data.organisation_data.loyalty == '1' || this.logined_user_data.organisation_data.dispatch == '1'){
        this.data.user_type = 'System User';
      }
      else{
        this.data.user_type = 'Sales User';
      }
    }

  }


  ngOnInit() {
    this.route.params.subscribe(params => {
      let id = params.id.replace(/_/g, '/');
      this.userId =   this.cryptoService.decryptId(id);
      if (id) {
        this.loader = true;
        this.userDetail();
        this.getReportManager('');
      }
    });
  }

  statesList:any=[];
  getStateList(search) {

    this.service.post_rqst({'search':search}, "Master/getAllState").subscribe((result => {
      
      if (result['statusCode'] == 200) {
        this.statesList = result['all_state'];
        this.statesList.map((row) => { row.state_name = row.state_name.toUpperCase(); })
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
        this.states.map((row) => { row.state_name = row.state_name.toUpperCase(); })
      }
      else {
        this.toast.errorToastr(result['statusMsg'])
      }
    }));
  }

  userDetail() {
    this.service.post_rqst({ 'id': this.userId }, "Master/salesUserDetail").subscribe((result) => {
      this.loader = false;
      
      if (result['statusCode'] == 200) {
        this.data =  result.sales_detail;
        if (this.data.date_of_joining == '0000-00-00') {
          this.data.date_of_joining = '';
        }
        if(this.data.loyalty == 1){
          this.data.assign_template = this.data.assign_template.map(String);
          this.getPaperSize();
        }
        this.getStateList('');
        this.getWorkingStateList('');
        this.get_sales_user_type(this.data.user_type, '');
  
        this.data.state = this.data.state_name;
        if (this.data.state_name != '') {
          this.getDistrict(1,'');
        }

      
       
       
        this.data.district = this.data.district_name
        this.data.rsm_id = this.data.rsm_id.toString();
        this.data.role_id = this.data.designation_id.toString();
        this.data.brand = this.data.brand.map(String);
        this.data.assign_system_user = this.data.assign_system_user_id.map(String);
        this.data.working_state = this.data.working_state_name;
        if (this.data.working_district_name.length > 0) {
          this.data.working_district = this.data.working_district_name
        }
        if (this.data.working_state.length) {
          this.getDistrict(2,'')
        }
        this.data.working_state.map((row, i) => { this.data.working_state[i] = row.toUpperCase(); })
  
        if (this.data.user_type == 'System User') {
          this.assign_module_data = this.data.assign_module;
        }
  
        // if (this.data.role_id == '53' || this.data.role_id == '54' || this.data.role_id == '58' || this.data.role_id == '59') {
        //   this.getCompanyData();
        //   this.data.assign_company = this.data.assign_company.toString();
        // }
  
        if (this.data.warehouse_id != '') {
          this.data.warehouse_id = this.data.warehouse_id.toString()
        }
        if (this.data.dispatch_type != '') {
          this.getWarehouse();
        }
  
        if (this.data.assign_system_user != '') {
          this.getReportManager('');
        }
        if (this.data.date_of_joining == '0000-00-00') {
          this.data.date_of_joining = '';
        }
        if (this.data.state_name != '') {
          this.getDistrict(1,'');
        }
        this.get_sales_user_type(this.data.user_type, '');
      }
      else{
        this.toast.errorToastr(result['statusMsg']);
      }
      
    })
  }


  getPaperSize() {
    this.service.post_rqst('', "CouponCode/templateList").subscribe((result => {
      
      if(result['statusCode'] == 200){
        this.paperSize = result['result'];
      }
      else{
        this.toast.errorToastr(result['statusMsg']);
      }
    }));
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

  getCompanyData() {
    this.service.post_rqst({}, "Order/organizationName").subscribe((result => {
      if (result['statusCode'] == 200) {
        this.organisationData = result['result'];
      } else {
        this.toast.errorToastr(result['statusMsg']);
      }

    }));
  }

  selectAllOption(type, list) {
    console.log(type);
    setTimeout(() => {
      if(type == 'state'){
        if (this.data.allWorkingState == true) {
          const allSelectedState = [];
          for (let i = 0; i < this.states.length; i++) {
            allSelectedState.push(this.states[i].state_name)
          }
          this.data.working_state = allSelectedState;
          console.log(this.data.working_state);
        } else {
          this.data.working_state=[];
        }
      }
      if(type == 'allWorkingDistrict'){
        if (this.data[type] == true) {
          const allSelectedOptions = [];
          for (let i = 0; i < this.district_list.length; i++) {
            allSelectedOptions.push(this.district_list[i].district_name)
          }
          this.data.working_district = allSelectedOptions;
        } else {
          this.data.working_district=[];
        }
      }
    }, 100);
}

selectAllOptionDistrict(action){

    if (action == 'WorkingDistrict') {
            setTimeout(() => {
                if (this.data.allDistrict == true) {
                    const AllDistricts = [];
                    for (let i = 0; i < this.working_district_list.length; i++) {
                        AllDistricts.push(this.working_district_list[i].district_name)
                    }
                    this.data.working_district = AllDistricts;
                    
                    console.table(this.data.working_district)
                } else {
                    this.data.working_district = [];
                }
            }, 500);
        }
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


  check_number() {
    if (this.data.contact_01.length == 10) {
      this.service.post_rqst({ "mobile": this.data.contact_01 }, "Master/userMobileNoCheck").subscribe((result => {
        

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

  getDistrict(val,search) {
    let st_name;
    if (val == 1) {
      st_name = this.data.state;
    }

    
    if(val==2){
      st_name = this.data.working_state;
    }
    this.service.post_rqst({ 'state_name': st_name,'search':search}, "Master/getAllDistrict").subscribe((result => {
      if (result['statusCode'] == 200) {
        if(val == 1){
          this.district_list = result['all_district'];
          }else{
            this.working_district_list = result['all_district'];
            console.log('working district',this.working_district_list)
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

  getReportManager(searcValue) {
    this.service.post_rqst({ 'search': searcValue, 'id': this.userId }, "Master/getSalesUserForReporting").subscribe((result => {
      if (result['statusCode'] == 200) {
        this.report_manager = result['all_sales_user'];
      }
      else {
        this.toast.errorToastr(result['statusMsg'])
      }
    }));
  }


  submitDetail() {

    if(this.data.user_type!='Service Engineer'){
    if (this.data.role_id) {
      let index = this.sales_type.findIndex(d => d.id == this.data.role_id);
      if (index != -1) {
        this.data.role_name = this.sales_type[index].role_name
      }
    }
    if (this.data.date_of_joining) {
      this.data.date_of_joining = moment(this.data.date_of_joining).format('YYYY-MM-DD');
      this.data.date_of_joining = this.data.date_of_joining;
    }
    if (this.data.user_type == 'System User') {
      this.data.assignModule = this.assign_module_data;
    }
    this.data.uid = this.userId;
    this.data.user_id = this.userId;
    this.data.uname = this.userName;
    this.data.created_by_name = this.logined_user_data.name;
    this.data.created_by_id = this.logined_user_data.id;
    this.savingFlag = true;
    this.service.post_rqst({ 'data': this.data }, "Master/updateUser").subscribe((result => {
      

      if (result['statusCode'] == "200") {
        this.toast.successToastr(result['statusMsg']);
        this.rout.navigate(['/sale-user-list']);
        this.savingFlag = false;
      }
      else {
        this.toast.errorToastr(result['statusMsg']);
        this.savingFlag = false;
      }
    }));
  }
  else{
    //  this.data.uid = this.userId;
    this.data.user_id = this.userId;
    this.data.uname = this.userName;
    this.data.created_by_name = this.logined_user_data.name;
    this.data.created_by_id = this.logined_user_data.id;
    this.savingFlag = true;
    this.service.post_rqst({ 'data': this.data } , "Master/updateUser").subscribe((result => {
      if ( result ['statusCode'] == "200") {
        this.toast.successToastr( result ['statusMsg']);
        this.rout.navigate(['/sale-user-list']);
        this.savingFlag = false;
      }
      else {
        this.toast.errorToastr( result ['statusMsg']);
        this.savingFlag = false;
      }
    }));
  }
  }

  // get_module_data() {
  //   this.service.post_rqst(0, "Master/moduleMasterList").subscribe((response => {
  //     this.assign_module_data = response['result'];
  //   }));

  // }

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
