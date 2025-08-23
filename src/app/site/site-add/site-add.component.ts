// import { Component, OnInit } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { slideToTop } from '../../router-animation/router-animation.component';
import { DatabaseService } from 'src/_services/DatabaseService';
import { _localeFactory } from '@angular/core/src/application_module';
import { ActivatedRoute, Router } from '@angular/router';
import { DialogComponent } from 'src/app/dialog.component';
import * as moment from 'moment';
import { sessionStorage } from 'src/app/localstorage.service';
import { Location } from '@angular/common';
import { ToastrManager } from 'ng6-toastr-notifications';
import { CryptoService } from 'src/_services/CryptoService';



@Component({
  selector: 'app-site-add',
  templateUrl: './site-add.component.html'
})
export class SiteAddComponent implements OnInit {

  fromdata: any = {};
  data: any = {};
  savingFlag: boolean = false;
  status = '';
  today_date: any;
  userData: any;
  userId: any;
  userName: any;
  networkType: any = [];
  city_area_list: any = [];
  loader: boolean;
  states: any = [];
  district_list: any = [];
  addTolistDisabled: boolean = true;
  distributorList: any = [];
  dealerList: any = [];
  siteId:any;
  skLoading:any=false;

  constructor( public cryptoService:CryptoService, public service: DatabaseService, public router: Router, public location: Location, public rout: Router, public session: sessionStorage, public dialog: DialogComponent, public ActivatedRoute: ActivatedRoute, public toast: ToastrManager) {
    this.today_date = new Date();
    this.userData = JSON.parse(localStorage.getItem('st_user'));
    this.userId = this.userData['data']['id'];
    this.userName = this.userData['data']['name'];
    this.today_date = new Date().toISOString().slice(0, 10);
    this.getStateList('');
  }

  ngOnInit() {
    this.ActivatedRoute.params.subscribe(params => {
      let id = params.id.replace(/_/g, '/');
      this.siteId = this.cryptoService.decryptId(id);
      
      if(this.siteId){
        this.leadDetail();
      }
      if (this.ActivatedRoute.queryParams['_value']['page_mode'] == 'edit') {
        this.data.id = this.ActivatedRoute.queryParams['_value']['id'];
        // this.leadDetail();
      }
      else {
        this.getStateList('');
        this.getsource_list();
        this.getDistributor('');
      }

    });

  }



  processPincode(type, pincode) {
    const pincodeValue = pincode;
    if (pincodeValue.length > 5) {

      this.service.post_rqst( { 'pincode': pincodeValue }, "Enquiry/getPostalInfo").subscribe((result => {
        if (result['statusCode'] == 200) {
          if (type == 'Owner') {
            this.data.state = result['result'].state_name
            this.data.district = result['result'].district_name
            this.data.city = result['result'].city
          }
          if (type == 'Influencer') {
            this.data.influencer_state = result['result'].state_name
            this.data.influencer_district = result['result'].district_name
            this.data.influencer_city = result['result'].city
          }
          this.getDistrict(1, type,'')
        }
        else {
          this.toast.errorToastr(result['statusMsg'])
        }
      }))
    }




  }






  findName(type, type_id) {
   
    if (type == 'sales_user') {
      let Index = this.salesUser.findIndex(row => row.id == type_id)
      if (Index != -1) {
        this.data.assigned_sales_user_name = this.salesUser[Index]['name']
      }
    }
    if (type == 'distributor') {
      let Index = this.distributorList.findIndex(row => row.id == type_id)
      if (Index != -1) {
        this.data.assigned_to_distributor_name = this.distributorList[Index]['company_name']
        this.data.assigned_to_distributor_mobile = this.distributorList[Index]['mobile']
      }
    }
    if (type == 'dealer') {
      let Index = this.dealerList.findIndex(row => row.id == type_id)
      if (Index != -1) {
        this.data.assigned_to_dealer_name = this.dealerList[Index]['company_name']
        this.data.assigned_to_dealer_mobile = this.dealerList[Index]['mobile']

      }
    }
  }



  updateStatusBasedOnDate() {
    const selectedDate = new Date(this.data.estimate_delivery_date);
    const currentDate = new Date();
    const differenceInDays = Math.floor(
      (selectedDate.getTime() - currentDate.getTime()) / (1000 * 60 * 60 * 24)
    );
    if (differenceInDays <= 20) {
      this.data.priority = 'Hot';
    } else if (differenceInDays <= 40) {
      this.data.priority = 'Warm';
    } else {
      this.data.priority = 'Cold';
    }
  }

  getStateList(search) {
    this.service.post_rqst({'search':search}, "CustomerNetwork/getAllState").subscribe((result => {
      if (result['statusCode'] == 200) {
        this.states = result['all_state'];
      } else {
        this.toast.errorToastr(result['statusMsg']);
      }
    }));
  }



  salesUser: any = [];
  getSalesUser(searcValue,id) {
    if(id && this.siteId){
      this.data.assigned_to_distributor_id = id;
    }
    this.service.post_rqst({ 'search': searcValue, 'dr_id': this.data.assigned_to_distributor_id }, "Enquiry/get_sales_user_List_distributor_wise").subscribe((result => {
      if (result['statusCode'] == 200) {
        this.salesUser = result['all_sales_user'];
        let index;
        index = this.salesUser.findIndex(row => row.id  == this.data.user_id)
        if(index !=-1){
          this.data.assigned_sales_user_id =  this.salesUser[index]['id']
          this.data.assigned_sales_user_name = this.salesUser[index]['name']
        }
      } else {
        this.toast.errorToastr(result['statusMsg']);
      }

    }));
  }

  customerNetwork:any =[];
  getCustomerNetworkType(type) {
    this.service.post_rqst({ 'type': type }, "CustomerNetwork/distributionNetworkSubType").subscribe((result => {
        if (result['statusCode'] == 200) {
            this.customerNetwork = result['result'];
        } else {
            this.toast.errorToastr(result['statusMsg']);
        }

    }));
}

  submitDetail() {
    this.data.uid = this.userId;
    this.data.uname = this.userName;
    if(this.personDetail.length == 0){
      this.toast.errorToastr('Please add contact person details.');
      return;
    }
    this.data.contact_details=this.personDetail;
    if (this.data.next_followup_date) {
      this.data.next_followup_date = moment(this.data.next_followup_date).format('YYYY-MM-DD');
    }
    if (this.data.estimate_delivery_date) {
      this.data.estimate_delivery_date = moment(this.data.estimate_delivery_date).format('YYYY-MM-DD');
    }
    this.savingFlag = true;
    this.service.post_rqst({ 'data': this.data }, "Enquiry/addSite").subscribe((result) => {
      if (result['statusCode'] == 200) {
        this.toast.successToastr(result['statusMsg']);
        this.rout.navigate(['/site/']);
        this.savingFlag = false;
      }

      else {
        this.dialog.error(result['statusMsg']);
      }
    })
  }

  MobileNumber(event: any) {
    const pattern = /[0-9\+\-\ ]/;
    let inputChar = String.fromCharCode(event.charCode);
    if (event.keyCode != 8 && !pattern.test(inputChar)) { event.preventDefault(); }
  }

  source_list: any = [];
  getsource_list() {
    this.service.post_rqst('', "Enquiry/enquirySourceList").subscribe((result => {
      if (result['statusCode'] == 200) {
        this.source_list = result['lead_source_list'];
      }
      else {
        this.toast.errorToastr(result['statusMsg'])
      }

    }))
  }
  getDistrict(val, type,search) {
    let st_name;
    if (val == 1 && type == 'Owner') {
      st_name = this.data.state;
    }
    if (val == 1 && type == 'Influencer') {
      st_name = this.data.influencer_state;
    }
    this.service.post_rqst({ 'state_name': st_name,'search':search }, "CustomerNetwork/getAllDistrict").subscribe((result => {
      result = this.service.payLoad ? result : this.cryptoService.decryptData(JSON.stringify(result));
      if (result['statusCode'] == 200) {
        this.district_list = result['all_district'];
      } else {
        this.toast.errorToastr(result['statusMsg']);
      }
    }));
  }
  getArea(val, type) {
    let dist_name;
    if (val == 1 && type == 'Owner') {
      dist_name = this.data.district;
    }
    if (val == 1 && type == 'Influencer') {
      dist_name = this.data.influencer_district;
    }
    let value = { "state": type == 'Owner' ? this.data.state : this.data.influencer_district, "district": dist_name }
    this.service.post_rqst(value, "CustomerNetwork/getAreaData").subscribe((result => {
      if ( result['statusCode'] == 200) {
        this.city_area_list =  result['area'];
      } else {
        this.toast.errorToastr( result['statusMsg']);
      }

    }));
  }


  back(): void {
    this.location.back()
  }



  getDistributor(searcValue) {
    this.service.post_rqst({ 'search': searcValue, 'type': 1 }, "CustomerNetwork/distributorsList").subscribe((result => {
      if (result['statusCode'] == 200) {
        this.distributorList = result['distributors'];
      } else {
        this.toast.errorToastr(result['statusMsg']);
      }
    }))
  }
  getDealer(searcValue, id) {
    if(searcValue == ''){
      this.dealerList = [];
    }
    this.data.assigned_to_dealer_id = '';
    this.service.post_rqst({ 'search': searcValue, 'dr_id': id, 'type': 3 }, "CustomerNetwork/assignDistributorsDealerList").subscribe((result => {
      if (result['statusCode'] == 200) {
        this.dealerList = result['distributors'];
      } else {
        this.toast.errorToastr(result['statusMsg']);
      }
    }))
  }

  personDetail:any=[];
  addToList(){
    if(this.data.contactType == '' || this.data.contactMobile == '' || this.data.contactName == ''){
      this.toast.errorToastr('Fill the contact person details.');
      return;
    }
    this.personDetail.push({contactType:this.data.contactType,contactName:this.data.contactName,contactMobile:this.data.contactMobile})
    console.log(this.personDetail);
    this.data.contactName = '';    
    this.data.contactMobile = '';    
    this.data.contactType = '';    
  }


  delteDataRequest(index) {
    this.personDetail.splice(index, 1);
}

leadDetail() {
  this.loader = true;

  this.service.post_rqst({ 'id': this.siteId }, "Enquiry/getSiteDetail").subscribe(result => {
    if (result['statusCode'] == 200) {
      this.data = result['enquiry_detail'];
      this.personDetail = this.data.contact_info; 
      console.log(this.data);
      if(this.data.state){
        this.getDistrict(1,'Owner','')
      }
      if(this.data.user_id){
        console.log(this.data.user_id);
        this.getSalesUser('',this.data.assigned_to_distributor_id)
      }
      setTimeout(() => {
        this.loader = false;
      }, 700);
    }
    else {
      this.toast.errorToastr(result['statusMsg']);
      this.loader = false;
    }
  })
}


}
