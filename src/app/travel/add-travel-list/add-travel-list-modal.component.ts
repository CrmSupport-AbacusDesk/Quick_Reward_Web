import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { FormControl } from '@angular/forms';
import { DialogComponent } from 'src/app/dialog.component';
import { DatabaseService } from 'src/_services/DatabaseService';
import { sessionStorage } from 'src/app/localstorage.service';
import { ToastrManager } from 'ng6-toastr-notifications';
import * as moment from 'moment';
import { CryptoService } from 'src/_services/CryptoService';



const now = new Date();

@Component({
  selector: 'add-travel-list-modal',
  templateUrl: './add-travel-list-modal.component.html',

})
export class addTravelListModal implements OnInit {


  travel_type_data: any = [];
  data1: any = {};
  loader: any;
  today_date: any;
  lists: any;
  max: any;
  result: any = [];
  logIN_user: any;
  showSave: boolean = true;
  state_list: any = [];
  district_list: any = [];
  city_list: any = [];
  drlist: any = [];
  salesUserList: any = [];
  searchText;
  search: any = {};
  city_list2: any = [];
  tmpsearch: any = {};
  salesUserList2: any = [];
  state_list2: any = [];
  district_list2: any = [];
  drlist2: any = [];
  today: Date;
  selectedArea: any;
  userData: any;
  userId: any;
  userName: any;
  assign: any;
  deliveryFrom: any = '';
  savingFlag: boolean = false;
  encryptedData: any;
  decryptedData:any;

  constructor(public service: DatabaseService, public cryptoService:CryptoService, @Inject(MAT_DIALOG_DATA) public data, public Toastr: ToastrManager, public session: sessionStorage, public dialog: MatDialog, public dialog1: DialogComponent, public dialogRef: MatDialogRef<addTravelListModal>, public toast: ToastrManager,) {

    this.deliveryFrom = this.data.delivery_from;
    if (this.deliveryFrom != 'add_travel_plan') {
      this.data1.route_name = this.data.row.city
      this.data1.status_remark = this.data.row.status_remark
      this.data1.date_from = this.data.row.date_from
      this.data1.sales_user_id = this.data.row.assign_to
      this.data1.beat_code = this.data.row.beat_code
      this.data1.state = this.data.row.state
      this.data1.district = this.data.row.district
    }
    // this.getbeatcode()
    // this.data.state==[]
    // this.data.district==[]

    this.today_date = new Date().toISOString().slice(0, 10);
    this.logIN_user = JSON.parse(localStorage.getItem('st_user'));
    // this.data1.select_provision="testProvision";
    this.lists = new FormControl();
    this.today = new Date();
    this.userData = JSON.parse(localStorage.getItem('st_user'));
    this.userId = this.userData['data']['id'];
    this.userName = this.userData['data']['name'];

  }
  distributor: any = []
  district: any = []
  city: any = []
  state: any = []


  ngOnInit() {
  }


  searchDistributor(search) {
    this.tmpsearch = '';
    this.drlist = [];
    for (var i = 0; i < this.drlist2.length; i++) {
      search = search.toLowerCase();
      this.tmpsearch = this.drlist2[i]['company_name'].toLowerCase();
      if (this.tmpsearch.includes(search)) {
        this.drlist.push(this.drlist2[i]);
      }
    }
    this.search.sales_user = '';
  }


  datavar: any = [];
  id: any
  add_travel_plan() {
    this.data1.created_by = this.logIN_user.data.id;
    this.data1.date_from = moment(this.data1.date_from).format('YYYY-MM-DD');
    this.data1.date_to = moment(this.data1.date_to).format('YYYY-MM-DD');
    if (this.data1.travel_type == 'Area Visit') {
      this.data1.date_created = this.today_date;
      this.data1.travel_list = this.lists['value'];
    }
    this.data1.uid = this.userId;
    this.data1.uname = this.userName;
    this.encryptedData = this.service.payLoad ? this.data1: this.cryptoService.encryptData(this.data1);
    this.service.post_rqst(this.encryptedData, "Travel/add_travelPlan").subscribe((result => {
    this.decryptedData = this.service.payLoad ? result : this.cryptoService.decryptData(JSON.stringify(result));
      if ((this.decryptedData['msg']) == "exist") {
        this.Toastr.errorToastr("Travel Plan already exist to selected date");
      }
      else {
        this.dialog.closeAll();
      }
      if (this.decryptedData['msg'] == "success") {

        this.dialog1.success("Travel Plan", "Added");
        this.loader = false;
      }
      else {

        this.dialog1.error("Something Went Wrong Please try again !");
        this.loader = false;
        this.dialog.closeAll();

      }
      setTimeout(() => {
        this.loader = '';
      }, 100);
    }))
  }
  update_travel_plan() {
    this.data1.uid = this.userId;
    this.data1.uname = this.userName;
    this.encryptedData = this.service.payLoad ? { 'id': this.data1.user_id, 'city': this.data1.route_name, 'beat_code': this.data1.beat_code, 'remarks': this.data1.status_remark, 'user_id': this.data1.sales_user_id }: this.cryptoService.encryptData({ 'id': this.data1.user_id, 'city': this.data1.route_name, 'beat_code': this.data1.beat_code, 'remarks': this.data1.status_remark, 'user_id': this.data1.sales_user_id });

    this.service.post_rqst(this.encryptedData, "Travel/update_travelPlan").subscribe((result => {
    this.decryptedData = this.service.payLoad ? result : this.cryptoService.decryptData(JSON.stringify(result));
      if ((this.decryptedData) == "exist") {
        this.Toastr.errorToastr("Travel Plan already exist to selected date");
      }
      else (this.decryptedData == "success")
      {
        this.toast.successToastr("Travel Plan Updated");
        this.dialog.closeAll();
      }
      setTimeout(() => {
        this.loader = '';
      }, 100);
    }))
    // }
  }


  updateTravelPlan() {
    this.savingFlag = true;
    this.encryptedData = this.service.payLoad ? { 'uid': this.userId, 'updated_by': this.userName, 'data': this.data, 'typeVisit': 'Area' }: this.cryptoService.encryptData({ 'uid': this.userId, 'updated_by': this.userName, 'data': this.data, 'typeVisit': 'Area' });
    this.service.post_rqst(this.encryptedData, "Travel/updateTravelPlan").subscribe((result => {
    this.decryptedData = this.service.payLoad ? result : this.cryptoService.decryptData(JSON.stringify(result));
      if (this.decryptedData['statusCode'] == 200) {
        this.savingFlag = false;
        this.dialogRef.close();
        this.toast.successToastr(this.decryptedData['statusMsg']);
      }
      else {
        this.savingFlag = false;
        this.toast.errorToastr(this.decryptedData['statusMsg'])
      }
    }))

  }







  // ----------------------



}
