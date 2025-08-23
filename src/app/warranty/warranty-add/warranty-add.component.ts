import { Component, OnInit, Renderer2 } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrManager } from 'ng6-toastr-notifications';
import { DatabaseService } from 'src/_services/DatabaseService';
import { sessionStorage } from 'src/app/localstorage.service';
import { HttpClient } from '@angular/common/http';
import { Location } from '@angular/common';
import { DialogComponent } from 'src/app/dialog.component';
import { MatDialog } from '@angular/material';
import * as moment from 'moment';
import { CryptoService } from 'src/_services/CryptoService';


@Component({
  selector: 'app-warranty-add',
  templateUrl: './warranty-add.component.html',
  styleUrls: ['./warranty-add.component.scss']
})
export class WarrantyAddComponent implements OnInit {
  data: any = {};
  data2: any = {};
  states: any = [];
  dr_type: any;
  district_list: any = [];
  savingFlag: boolean = false;
  params_id: any;
  image_id: any;
  errorMsg: boolean = false;
  segmentList: any = [];
  SubcategoryList: any = [];
  productList: any = [];
  category_list: any = [];
  brandList: any = [];
  colorList: any = [];
  feature: any = {};
  exist: boolean = false;
  value: any = [];
  formData = new FormData();
  loader: boolean = false;
  showMRP = false;
  showSize = false;
  userData: any;
  userId: any;
  myDate: any
  id: any;
  userName: any;
  image = new FormData();
  product_id: any;
  url: any;
  selected_image: any = [];
  selected_image2: any = [];
  state: any = [];
  pointCategories_data: any = []
  getData: any = {};
  params_network: any;
  params_type: any;
  billBase64: boolean = false;
  bill_img_id: any;
  warrantyBase64: boolean = false;
  warranty_img_id: any;
  bill_copy_img: any;
  warranty_card_copy_img: any;
  warrantyImg: any = [];
  uploadurl: any;
  warranty_period: string;
  selectedWarrantyDate: string;
  warrantyEndDate: string;
  filter: any = {};
  currentDate: Date;
  encryptedData: any;
  decryptedData:any;

  constructor(private renderer: Renderer2,
    public location: Location,
    public service: DatabaseService,
    public rout: Router,
    public toast: ToastrManager,
    public cryptoService:CryptoService,
    private route: ActivatedRoute,
    public dialog: DialogComponent,
    public dialog2: MatDialog) {

      this.uploadurl = this.service.uploadUrl + 'service_task/'

      this.route.params.subscribe(params => {
        this.id = params.id;
        this.warranty_img_id = params.id;
        this.bill_img_id = params.id;

        console.log(this.id);
        if (this.id) {
          this.getWarrantyDetail(this.id);
        }

        this.currentDate = new Date();

        this.getSegment();


      });
    }

    ngOnInit() {
    }



    submitDetail() {

      console.log(this.data.warranty_card_copy_img);
      if(!this.data.warranty_card_copy_img){
        
        this.toast.errorToastr('Warranty images required');
        return;
      }
      if(!this.data.bill_copy_img){
        this.toast.errorToastr('Bill images required');
        return;
      }


      // this.data.billBase64 = this.billBase64;
      // this.data.warrantyBase64 = this.warrantyBase64;

      if (this.data.date_of_purchase) {
        this.data.date_of_purchase = moment(this.data.date_of_purchase).format('YYYY-MM-DD');
        this.data.date_of_purchase = this.data.date_of_purchase;
      }
      if (this.data.warranty_end_date) {
        this.data.warranty_end_date = moment(this.data.warranty_end_date).format('YYYY-MM-DD');
        this.data.warranty_end_date = this.data.warranty_end_date;
      }
      this.savingFlag = true;
      let header
      if (this.id) {
        this.encryptedData = this.service.payLoad ? { "data": this.data, 'type': 'Edit', 'id': this.id }: this.cryptoService.encryptData({ "data": this.data, 'type': 'Edit', 'id': this.id });
        header = this.service.post_rqst(this.encryptedData, "ServiceTask/serviceWarrantyAdd")
      }
      else {
        this.encryptedData = this.service.payLoad ? { "data": this.data, 'type': 'Add', }: this.cryptoService.encryptData({ "data": this.data, 'type': 'Add', });
        header = this.service.post_rqst(this.encryptedData, "ServiceTask/serviceWarrantyAdd")
      }
      header.subscribe((result => {
        this.decryptedData = this.service.payLoad ? result : this.cryptoService.decryptData(JSON.stringify(result));
        if (this.decryptedData['statusCode'] == 200) {
          this.rout.navigate(['/warranty-list']);
          this.toast.successToastr(this.decryptedData['statusMsg']);
          this.savingFlag = false;
        }
        else {
          this.toast.errorToastr(this.decryptedData['statusMsg']);
          this.savingFlag = false;
        }

      }));
    }
    back(): void {
      this.location.back()
    }

    bill_Upload(data: any) {
      for (let i = 0; i < data.target.files.length; i++) {

        let files = data.target.files[i];
        if (files) {
          this.bill_img_id = '';
          this.billBase64 = true;
          let reader = new FileReader();
          reader.onload = (e: any) => {
            this.data.bill_copy_img = e.target.result
          }
          reader.readAsDataURL(files);
        }
        else {
          this.billBase64 = false;
        }
        this.image.append("" + i, data.target.files[i], data.target.files[i].name);
      }
    }

    warrannty_Upload(data: any) {
      for (let i = 0; i < data.target.files.length; i++) {

        let files = data.target.files[i];
        if (files) {
          this.warranty_img_id = '';
          this.warrantyBase64 = true;
          let reader = new FileReader();
          reader.onload = (e: any) => {
            this.data.warranty_card_copy_img = e.target.result
          }
          reader.readAsDataURL(files);
        }
        else {
          this.warrantyBase64 = false;
        }
        this.image.append("" + i, data.target.files[i], data.target.files[i].name);
      }
    }

    getWarrantyDetail(id) {
      this.encryptedData = this.service.payLoad ? { 'warranty_id': id }: this.cryptoService.encryptData({ 'warranty_id': id });
      this.service.post_rqst(this.encryptedData, "ServiceTask/serviceWarrantyDetail").subscribe((result => {
        this.decryptedData = this.service.payLoad ? result : this.cryptoService.decryptData(JSON.stringify(result));

        this.data = this.decryptedData['result'];
        this.data.segment_id = this.data.segment_id.toString();
        this.data.sub_segment_id = this.data.sub_segment_id.toString();
        this.data.product_id = this.data.product_id.toString();
        this.data.warranty_period = parseInt(this.data.warranty_period);

        if(this.data.segment_id){
          this.getSubCatgory(this.data.segment_id)
        }

         if(this.data.sub_segment_id){
          this.getProduct(this.data.segment_id, this.data.sub_segment_id);
        }
        this.getSegment();
        if (this.data.product_id) {
          setTimeout(() => {
            this.getProductInfo(this.data.product_id);
          }, 1000);
        }
      }
      ));

    }

    getSegment() {
      this.service.post_rqst({}, "Master/getProductCategoryList").subscribe((result => {
        this.decryptedData = this.service.payLoad ? result : this.cryptoService.decryptData(JSON.stringify(result));
        if (this.decryptedData['statusCode'] == 200) {
          this.segmentList = this.decryptedData['segment_list'];
        }
      }))
    }

    getSubCatgory(id) {
      this.encryptedData = this.service.payLoad ? { 'id': id }: this.cryptoService.encryptData({ 'id': id });
      this.service.post_rqst(this.encryptedData, "Master/subCategoryList").subscribe((result => {
        this.decryptedData = this.service.payLoad ? result : this.cryptoService.decryptData(JSON.stringify(result));
        if (this.decryptedData['statusCode'] == 200) {
          this.SubcategoryList = this.decryptedData['result'];
          if (this.SubcategoryList.length <= 0) {
            this.getProduct(this.data.segment_id, '')
          }
        }
      }))
    }

    getProduct(segment_id, sub_segment_id) {
      this.filter.segment = segment_id
      this.filter.sub_category_name = sub_segment_id
      this.filter.product_warranty = 'not_zero';
      this.encryptedData = this.service.payLoad ? { 'filter': this.filter }: this.cryptoService.encryptData({ 'filter': this.filter });
      this.service.post_rqst(this.encryptedData, "Master/productList").subscribe((result => {
      this.decryptedData = this.service.payLoad ? result : this.cryptoService.decryptData(JSON.stringify(result));
        if (this.decryptedData['statusCode'] == 200) {
          this.productList = this.decryptedData['product_list'];
          console.log(this.productList);
        }
      }))
    }

    getProductInfo(product_id) {

      if(!this.id){
         this.data.date_of_purchase='';
        this.data.warranty_end_date='';
      }
      console.log(this.productList);

      console.log(product_id);
      if (product_id) {
        let index = this.productList.findIndex(d => d.id == product_id);
        if (index != -1) {
          this.data.product_name = this.productList[index].product_name;
          this.data.product_code = this.productList[index].product_code;
          this.data.warranty_period = this.productList[index].warranty_period;
        }
      }
      typeof(this.data.warranty_period)
      this.data.warranty_period = parseInt(this.data.warranty_period);
    }
    // calculateWarrantyEnd() {
    //   const warrantyStartDate = new Date(this.data.date_of_purchase);
    //   const warrantyEnd = new Date(warrantyStartDate.getFullYear(), warrantyStartDate.getMonth() + parseInt(this.warranty_period), warrantyStartDate.getDate());
    //   console.log(warrantyEnd);
    //   this.data.warranty_end_date = warrantyEnd;
    // }

    MobileNumber(event: any) {
      const pattern = /[0-9\+\-\ ]/;
      let inputChar = String.fromCharCode(event.charCode);
      if (event.keyCode != 8 && !pattern.test(inputChar)) { event.preventDefault(); }
    }


    checkMobile() {
      this.data.customer_name='';
      if (this.data.customer_mobile.length == 10) {
        this.encryptedData = this.service.payLoad ? { 'customer_mobile': this.data.customer_mobile }: this.cryptoService.encryptData({ 'customer_mobile': this.data.customer_mobile });
        this.service.post_rqst(this.encryptedData, "ServiceTask/customerCheck").subscribe((result) => {
         this.decryptedData = this.service.payLoad ? result : this.cryptoService.decryptData(JSON.stringify(result));
          if (this.decryptedData.statusMsg == "Exist") {
            this.data.customer_name = this.decryptedData.data.customer_name
            // this.getDistrict(1)
          }
        });
      }
    }

    findId(id) {
      let index = this.productList.findIndex(row => row.id == id)
      if (index != -1) {
        this.data2.id = this.productList[index].id;
        this.data2.product_name = this.productList[index].product_name;
      }
    }
    getProductName(id) {
      this.filter.product_detail = id;
      this.encryptedData = this.service.payLoad ? { 'filter': this.filter }: this.cryptoService.encryptData({ 'filter': this.filter });
      this.service.post_rqst({ 'filter': this.filter }, "Master/productList").subscribe((result) => {
        this.decryptedData = this.service.payLoad ? result : this.cryptoService.decryptData(JSON.stringify(result));
        if (this.decryptedData["statusCode"] == 200) {
          this.productList = this.decryptedData["product_list"];
        }
      });
    }
    blankdata(){
       this.data.date_of_purchase='';
      this.data.warranty_end_date='';
    }

  }
