import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialog } from '@angular/material';
import { DatabaseService } from 'src/_services/DatabaseService';
import { Router } from '@angular/router';
import * as moment from 'moment';
import { ToastrManager } from 'ng6-toastr-notifications';
import { DialogComponent } from 'src/app/dialog.component';
import { sessionStorage } from 'src/app/localstorage.service';
import { CryptoService } from 'src/_services/CryptoService';

@Component({
  selector: 'app-distributor-model',
  templateUrl: './distributor-model.component.html',
  styleUrls: ['./distributor-model.component.scss']
})
export class DistributorModelComponent implements OnInit {



  empData: any = [];
  contact_arr: any = {

  };
  data2: any = {
    designation: '',
  };
  googleData: string;
  lat: string;
  long: string;
  latlong: any = [];
  latlongData: any = {};
  dbID: any;
  productlist: any;
  noProduct: boolean = false;
  dr_lead_name: any;
  size_List: any;
  productName: any;
  productCode: any;
  showErr: boolean = false;
  today_date: any;
  dr_id: any;
  requirement_list: any = [];
  category_name: any;
  product_name: any;
  quantity: any;
  id: any;
  userData: any;
  userId: any;
  userName: any;
  encryptedData: any;
  decryptedData: any;


  constructor(
    @Inject(MAT_DIALOG_DATA) public data,
    public service: DatabaseService,
    public cryptoService: CryptoService,
    public rout: Router,
    public dialog2: MatDialog,
    public alert: DialogComponent,
    public session: sessionStorage,
    private dialogRef: MatDialogRef<DistributorModelComponent>,
    public Toastr: ToastrManager) {
    this.today_date = new Date();
    this.dr_id = data.id;
    this.userData = JSON.parse(localStorage.getItem('st_user'));
    this.userId = this.userData['data']['id'];
    this.userName = this.userData['data']['name'];
    // this.getProducts();
    this.get_category_list();

    if (data.type == 'addDbContact' || data.type == 'addLeadContact') {
      this.data2.name = '';
      this.data2.mobile = '';
      this.data2.whatsapp_no = '';
      this.data2.email = '';
      this.data2.dob = '';
      this.data2.doa = '';
      this.data2.designation = '';
    }

    if (data.type == 'updateDBSecContact') {
      if (data.updateData.doa == '0000-00-00') {
        data.updateData.doa = '';
      }
      if (data.updateData.dob == '0000-00-00') {
        data.updateData.dob = '';
      }
    }

    if (data.type == 'updateGoogleLocation') {
      this.dbID = data.id;
      this.googleData = '';

    }

  }

  ngOnInit() { }




  addSecContact() {

    const requestData = {
      dr_id: this.data.id,
      contact_arr: this.empData,
      uid: this.userId,
      uname: this.userName
    };

    this.encryptedData = this.service.payLoad ? requestData : this.cryptoService.encryptData(requestData);
    if (this.data.type == 'addDbContact') {
      this.service.post_rqst(this.encryptedData, "Distributors/distributors_contact_add").subscribe((result => {
        this.dialog2.closeAll();
      }))
    }
    else if (this.data.type == 'addLeadContact') {
      this.service.post_rqst(this.encryptedData, "Distributors/distributors_contact_add").subscribe((result => {
        this.dialog2.closeAll();
      }))
    }
  }

  add_data() {
    this.showErr = false;

    if ((this.data2.doa) && (this.data2.dob)) {
      if ((this.data2.dob) < (this.data2.doa)) {
        if (this.data2.doa > this.today_date) {
          this.Toastr.errorToastr("DOA should be less than today's Date");
        }
        else if (this.data2.dob > this.today_date) {
          this.Toastr.errorToastr("DOB should be less than today's Date");
        }
        else {
          this.data2.doa = moment(this.data2.doa).format('YYYY-MM-DD');
          this.data2.dob = moment(this.data2.dob).format('YYYY-MM-DD');
          this.empData.push({
            contact_person: this.data2.name,
            mobile_no: this.data2.mobile,
            whatsapp_no: this.data2.whatsapp_no,
            email: this.data2.email,
            designation: this.data2.designation,
            dob: this.data2.dob,
            doa: this.data2.doa,
          });
          this.data2.name = undefined;
          this.data2.mobile = undefined;
          this.data2.whatsapp_no = '';
          this.data2.email = '';
          this.data2.designation = '';
          this.data2.dob = '';
          this.data2.doa = '';
        }
      }
      else {
        this.Toastr.errorToastr("DOA should be less than DOB");
      }




    }
    else if (this.data2.doa) {
      if (this.data2.doa > this.today_date) {
        this.Toastr.errorToastr("DOA should be less than today's Date");
      }
      else {
        this.data2.doa = moment(this.data2.doa).format('YYYY-MM-DD');
        this.data2.dob = moment(this.data2.dob).format('YYYY-MM-DD');
        this.empData.push({
          contact_person: this.data2.name,
          mobile_no: this.data2.mobile,
          whatsapp_no: this.data2.whatsapp_no,
          email: this.data2.email,
          designation: this.data2.designation,
          dob: this.data2.dob,
          doa: this.data2.doa,
        });
        this.data2.name = undefined;
        this.data2.mobile = undefined;
        this.data2.whatsapp_no = '';
        this.data2.email = '';
        this.data2.designation = '';
        this.data2.dob = '';
        this.data2.doa = '';

      }
    }
    else if (this.data2.dob) {
      if (this.data2.dob > this.today_date) {
        this.Toastr.errorToastr("DOB should be less than today's Date");
      }
      else {
        this.data2.doa = moment(this.data2.doa).format('YYYY-MM-DD');
        this.data2.dob = moment(this.data2.dob).format('YYYY-MM-DD');
        this.empData.push({
          contact_person: this.data2.name,
          mobile_no: this.data2.mobile,
          whatsapp_no: this.data2.whatsapp_no,
          designation: this.data2.designation,
          email: this.data2.email,
          dob: this.data2.dob,
          doa: this.data2.doa,
        });
        this.data2.name = undefined;
        this.data2.mobile = undefined;
        this.data2.whatsapp_no = '';
        this.data2.email = '';
        this.data2.designation = '';
        this.data2.dob = '';
        this.data2.doa = '';


      }
    }
    else {
      this.data2.doa = moment(this.data2.doa).format('YYYY-MM-DD');
      this.data2.dob = moment(this.data2.dob).format('YYYY-MM-DD');
      this.empData.push({
        contact_person: this.data2.name,
        mobile_no: this.data2.mobile,
        whatsapp_no: this.data2.whatsapp_no,
        email: this.data2.email,
        designation: this.data2.designation,
        dob: this.data2.dob,
        doa: this.data2.doa,
      });

      this.data2.name = undefined;
      this.data2.mobile = undefined;
      this.data2.whatsapp_no = '';
      this.data2.email = '';
      this.data2.designation = '';
      this.data2.dob = '';
      this.data2.doa = '';
    }
  }


  deleteContactDetail(arrayIndex) {

    if (this.empData.length < 2) {
      this.showErr = true;
    }

    this.empData.splice(arrayIndex, 1);
  }


  updateContactDetail() {

    this.data.updateData.doa = moment(this.data.updateData.doa).format('YYYY-MM-DD');
    this.data.updateData.dob = moment(this.data.updateData.dob).format('YYYY-MM-DD');
    this.encryptedData = this.service.payLoad ? this.data.updateData : this.cryptoService.encryptData(this.data.updateData);
    this.service.post_rqst(this.encryptedData, "Distributors/distributors_contact_update").subscribe((result => {
      this.decryptedData = this.service.payLoad ? result : this.cryptoService.decryptData(JSON.stringify(result));
      if (this.decryptedData['distributors_contact_update'] == 'success') {
        this.dialog2.closeAll();
      }
      else {
        this.alert.error("Something went Wrong")
      }
    }))
  }

  getlocation: any = [];
  getLatLong() {
    this.encryptedData = this.service.payLoad ? { address: this.googleData } : this.cryptoService.encryptData({ address: this.googleData });
    this.service.post_rqst(this.encryptedData, "CustomerNetwork/getLocation").subscribe((result => {
      this.decryptedData = this.service.payLoad ? result : this.cryptoService.decryptData(JSON.stringify(result));
      if (this.decryptedData['statusCode'] == 200) {
        this.getlocation = this.decryptedData['result'];
        this.lat = this.getlocation.lat;
        this.long = this.getlocation.lng;
      } else {
        this.Toastr.errorToastr(this.decryptedData['statusMsg'])
      }
    }))

  }


  updategoogleLocation() {
    this.encryptedData = this.service.payLoad ? { id: this.dbID, lat: this.latlongData.lat, lng: this.latlongData.long, 'uid': this.userId, 'uname': this.userName } : this.cryptoService.encryptData({ id: this.dbID, lat: this.lat, lng: this.long, 'uid': this.userId, 'uname': this.userName });
    this.service.post_rqst(this.encryptedData, "CustomerNetwork/updateLocation").subscribe((result => {
      this.decryptedData = this.service.payLoad ? result : this.cryptoService.decryptData(JSON.stringify(result));
      if (this.decryptedData['statusCode'] == 200) {
        this.dialogRef.close();
      } else {
        this.Toastr.errorToastr(this.decryptedData['statusMsg'])
        this.dialogRef.close();
      }
    }))


  }


  conInt(val) {
    return parseInt(val)
  }

  getProducts() {
    this.encryptedData = this.service.payLoad ? { 'category': this.requiredata.category } : this.cryptoService.encryptData({ 'category': this.requiredata.category });
    this.service.post_rqst(this.encryptedData, "Product/product_list").subscribe((result) => {
      this.decryptedData = this.service.payLoad ? result : this.cryptoService.decryptData(JSON.stringify(result));
      this.productlist = this.decryptedData['product_list'];
      if (this.productlist.length == 0) {
        this.noProduct = true;
      }
      else {
        this.noProduct = false;
      }
    })
  }
  category_list: any = [];
  get_category_list() {
    this.service.post_rqst({}, "Product/categoryList").subscribe((result) => {
      this.decryptedData = this.service.payLoad ? result : this.cryptoService.decryptData(JSON.stringify(result));
      this.category_list = this.decryptedData;
    })
  }

  getSize() {
    this.data.productSize = null
    if (this.data.Product) {
      let filterData = this.productlist.filter(row => row.id == this.data.Product);
      for (let i = 0; i < filterData[0].multi_products.length; i++) {
        this.size_List = filterData[0].multi_products;
      }
    }
  }

  requiredata: any = {};

  add_requirement() {

    let existIndex = this.requirement_list.findIndex(row => row.id == this.requiredata.product);
    if (existIndex == -1) {
      let rowData = this.productlist.findIndex(row => row.id == this.requiredata.product)
      this.requirement_list.push({
        category_name: this.requiredata.category,
        id: this.requiredata.product,
        product_name: this.productlist[rowData].product_name,
        qty: this.requiredata.qty,
      });
    }
    else {
      this.requirement_list[existIndex].qty = parseInt(this.requirement_list[existIndex].qty) + parseInt(this.requiredata.qty);
    }

    this.requiredata = {};




  }
  save_requirement() {

    let item = [];
    item = this.requirement_list;
    this.encryptedData = this.service.payLoad ? { 'item': this.requirement_list, 'dr_id': this.dr_id, 'uid': this.userId, 'uname': this.userName } : this.cryptoService.encryptData({ 'item': this.requirement_list, 'dr_id': this.dr_id, 'uid': this.userId, 'uname': this.userName });

    this.service.post_rqst(this.encryptedData, "Lead/requirementAdd").subscribe((result) => {
      this.decryptedData = this.service.payLoad ? result : this.cryptoService.decryptData(JSON.stringify(result));

      if (this.decryptedData['status'] == 'Success') {
        this.dialog2.closeAll();
      }
      else {
        this.alert.error("Something went Wrong")
      }
    })
  }
}







