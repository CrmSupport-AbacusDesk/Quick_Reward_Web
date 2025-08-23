
import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialog } from '@angular/material';
import { DatabaseService } from 'src/_services/DatabaseService';
import { Router } from '@angular/router';
import * as moment from 'moment';
import { ToastrManager } from 'ng6-toastr-notifications';
import { sessionStorage } from 'src/app/localstorage.service';


@Component({
  selector: 'app-distribution-edit',
  templateUrl: './distribution-edit.component.html',
  styleUrls: ['./distribution-edit.component.scss']
})
export class DistributionEditComponent implements OnInit {
  tmpsearch: string;
  id: any
  secondary_lead_list: any = [];
  state_list: any = [];
  district_list: any = [];
  cityAreaList: any = [];
  city_list: any = [];
  pinCode_list: any = [];
  countryList: any = [];
  empData: any = [];
  // tmpEmpData: any = [];
  empData2: any = []
  showErr: boolean = false;
  showArrErr: boolean = false;
  active: any = {};
  drlist: any = [];
  tmp_drlist: any = [];
  tmpsearchdr: any = {};
  today_date: any;
  userData: any;
  userId: any;
  userName: any;



  constructor(
    @Inject(MAT_DIALOG_DATA) public data,
    public serve: DatabaseService,
    public rout: Router,
    public dialog2: MatDialog,
    public session: sessionStorage,
    public Toastr: ToastrManager) {
    this.today_date = new Date().toISOString().slice(0, 10);
    this.distributorList();
    this.getCountryList();
    this.getStateList(data.country, 1);
    this.getDistrict(data.state, 1);
    this.getCityAreaList(data.district, data.state, 1);
    this.getarea(data.district, data.state, data.city,);
    this.getPinCodeList(data.district, data.state, data.city, 1);
    this.getbeatlist(data.id);
    this.data.area = this.data.area;
    this.empData.name = this.data.name;
    this.empData.mobile = this.data.mobile;
    this.empData.whatsapp_no = this.data.whatsapp_no;
    this.empData.email = this.data.email;
    this.empData.dob = this.data.dob;
    this.empData.doa = this.data.doa;
    this.userData = JSON.parse(localStorage.getItem('st_user'));
    this.userId = this.userData['data']['id'];
    this.userName = this.userData['data']['name'];




  }

  ngOnInit() {
  }


  update() { }

  distributorList() {
    this.serve.post_rqst('', "Distributors/distributorsList").subscribe((result => {
      this.drlist = result;
      this.tmp_drlist = this.drlist;
      this.secondary_lead_list = this.drlist;
    }))
  }

  filter_dr(dr_name) {
    this.tmpsearch = '';
    this.drlist = [];
    for (var i = 0; i < this.secondary_lead_list.length; i++) {
      dr_name = dr_name.toLowerCase();
      this.tmpsearch = this.secondary_lead_list[i]['company_name'].toLowerCase();
      if (this.tmpsearch.includes(dr_name)) {
        this.drlist.push(this.secondary_lead_list[i]);
      }
    }
  }
  beat_list: any = []
  getbeatlist(id) {
    this.serve.post_rqst({ 'state': this.data.state, 'district': this.data.district }, "Travel/beat_code_list_according_to_city").subscribe((response => {
      this.beat_list = response['beat_code_list'];
    }));
  }
  update_distribution() {

    this.serve.post_rqst({ 'id': this.data.id, 'type': this.data.change_type, 'login_id': this.userId }, "Lead/update_type").subscribe((result => {
      this.dialog2.closeAll();
      this.serve.count_list();
    }))
  }
  getarea1(data1) {
    this.data.area = data1
  }
  update_address(data) {
    this.data.area = this.data.area;
    this.data.cityArea = '';
    this.data.uid = this.userId;
    this.data.uname = this.userName
    this.serve.post_rqst(data, "Distributors/distributors_address_update").subscribe((result => {
      this.dialog2.closeAll();
    }))
    this.update_distribution()
  }


  update_basic_address(data) {
    this.data.doa = moment(this.data.doa).format('YYYY-MM-DD');
    this.data.dob = moment(this.data.dob).format('YYYY-MM-DD');
    if (this.data.doa > this.data.dob) {
      this.serve.post_rqst({ data, 'uid': this.userId, 'uname': this.userName }, "Distributors/distributors_address_update").subscribe((result => {
        this.dialog2.closeAll();
      }))
    }
    else {
      this.Toastr.errorToastr("Wrong Data");
    }

  }

  toggleterritory(key, action) {
    if (action == 'open') {
      this.active[key] = true;
    }
    if (action == 'close') {
      this.active[key] = false;
    }
  }


  getCountryList() {
    this.serve.post_rqst(0, "User/country_list").subscribe((response => {
      this.countryList = response['query']['country_name'];
    }));

  }

  getStateList(country_name, src) {
    this.serve.post_rqst(0, "User/state_user_list").subscribe((response => {
      this.state_list = response['query']['state_name'];
      // this.state_list=this.state

    }));

  }
  getDistrict(state_name, src) {
    if (src == 2) {
      this.data.district = '';
      this.data.cityArea = '';
      this.data.city = '';
      this.data.pincode = '';



    }
    this.serve.post_rqst(state_name, "User/district_user_list").subscribe((response => {
      this.district_list = response['query']['district_name'];

    }));
  }

  MobileNumber(event: any) {
    const pattern = /[0-9\+\-\ ]/;
    let inputChar = String.fromCharCode(event.charCode);
    if (event.keyCode != 8 && !pattern.test(inputChar)) { event.preventDefault(); }
  }

  getCityAreaList(district, state, src) {
    if (src == 2) {
      this.data.cityArea = '';
      this.data.city = '';
      this.data.pincode = '';
    }

    let value = { "state": state, "district": district }
    this.serve.post_rqst(value, "User/city_user_list").subscribe((response => {
      this.city_list = response['query']['city'];
    }));

  }
  getarea(district, state, city) {
    let value1 = { "state": state, "district": district, 'city': city };
    this.serve.post_rqst(value1, "User/area_user_list").subscribe((response => {
      this.cityAreaList = response['query']['area'];

    }));
  }
  getPinCodeList(district, state, city, src) {

    if (src == 2) {
      this.data.pincode = '';
    }

    let value = { "state": state, "district": district, "city": city }
    this.serve.post_rqst(value, "User/pincode_user_list").subscribe((response => {
      this.pinCode_list = response['query']['pincode'];
    }));
  }

}

