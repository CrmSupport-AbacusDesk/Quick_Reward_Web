import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { ImageModuleComponent } from 'src/app/image-module/image-module.component';
import { ActivatedRoute, Router } from '@angular/router';
import { DatabaseService } from 'src/_services/DatabaseService';
import { ChartType, ChartDataSets, ChartOptions, Chart } from 'chart.js';
import * as moment from 'moment';
import { sessionStorage } from 'src/app/localstorage.service';
import { ToastrManager } from 'ng6-toastr-notifications';
import { Location } from '@angular/common'
import { DialogComponent } from 'src/app/dialog.component';
import { DialogService } from 'src/app/dialog.service';
import { ExportexcelService } from 'src/app/service/exportexcel.service';
import { ProductDetailModelComponent } from 'src/app/installation/product-detail-model/product-detail-model.component';
import { CryptoService } from 'src/_services/CryptoService';
// import { type } from 'os';

@Component({
  selector: 'app-customer-detail',
  templateUrl: './customer-detail.component.html',
  styleUrls: ['./customer-detail.component.scss']
})
export class CustomerDetailComponent implements OnInit {

  id;
  tabType: any = 'Profile';
  filter: any = {}
  getData: any = {};
  url: any;
  assign_login_data: any = {};
  logined_user_data: any = {};
  stateDetail: any = [];
  warrantyList: any = [];
  complaintList: any = [];
  installationList: any = [];
  product_size: any = [];
  featureFlag: boolean = false;
  allMrpFlag: boolean = false;
  productImg: any = [];
  total_page: any;
  pagenumber: any = 0;
  Influencer_Detail: any = {};
  pageCount: any;
  start: any = 0;
  page_limit: any;
  sr_no: any;
  checkinLoader: boolean = false;
  type_id: any;
  login_data: any = {};
  login_data5: any = {};
  user_assign_name: any = '';
  savingFlag: boolean = false;
  filter_data: any = {};
  fabBtnValue: any = 'excel';
  today_date: any;
  loader: any;
  skLoading: boolean = false;
  encryptedData: any;
  decryptedData:any;


  constructor(public location: Location, public cryptoService:CryptoService, public session: sessionStorage, private router: Router, public alert: DialogComponent, public service: DatabaseService, public editdialog: DialogService, public dialog: MatDialog, public route: ActivatedRoute, public toast: ToastrManager, public excelservice: ExportexcelService, public dialog1: DialogComponent, public dialog2: MatDialog) {
    this.page_limit = service.pageLimit;
    // this.page_limit = 1;
    this.route.params.subscribe(params => {
      this.id = params.id;
      this.service.currentUserID = params.id
      if (this.id) {
        this.getCustomerDetail();
      }
    });
  }

  ngOnInit() {
  }

  refresh() {
    this.start = 0;
    this.filter_data = {};
    this.getComplaintDetail();
    this.getCustomerDetail();
    this.getInstallationDetail();
    this.getWarrantyDetail();
  }

  clear() {
    this.refresh();
  }

  getCustomerDetail() {
    this.loader = 1;
    this.skLoading = true;
    this.filter.status = this.tabType
    this.encryptedData = this.service.payLoad ? { 'customer_id': this.id }: this.cryptoService.encryptData({ 'customer_id': this.id });

    this.service.post_rqst(this.encryptedData, "ServiceCustomer/serviceCustomerDetail").subscribe(result => {
      this.decryptedData = this.service.payLoad ? result : this.cryptoService.decryptData(JSON.stringify(result));

      if (this.decryptedData['statusCode'] == 200) {
        this.skLoading = false;
        this.getData = this.decryptedData['result'];
      console.log('getData', this.getData);

      this.productImg = this.getData['img'];


      } else {
        this.skLoading = false;
        this.toast.errorToastr(this.decryptedData['statusMsg']);
      }
    }, err => {
      this.skLoading = false;
      this.toast.errorToastr('Something went wrong');
    })
  }


  pervious(type) {
    this.start = this.start - this.page_limit;
    if (type == 'warranty') {
      this.getWarrantyDetail();
    }
    else if (type == 'installation') {
      this.getInstallationDetail();
    }
    else {
      this.getComplaintDetail();
    }
  }
  nextPage(type) {
    this.start = this.start + this.page_limit;
    if (type == 'warranty') {
      this.getWarrantyDetail();
    }
    else if (type == 'installation') {
      this.getInstallationDetail();
    }
    else {
      this.getComplaintDetail();
    }
  }

  date_format(type): void {
    this.filter_data.date_created = moment(this.filter_data.date_created).format('YYYY-MM-DD');
    if (type == 'warranty') {
      this.getWarrantyDetail();
    }
    else if (type == 'installation') {
      this.getInstallationDetail();
    }
    else {
      this.getComplaintDetail();
    }
  }

  date_format2(): void {
    this.filter_data.date_of_purchase = moment(this.filter_data.date_of_purchase).format('YYYY-MM-DD');
    this.getWarrantyDetail();
  }

  date_format3(): void {
    this.filter_data.warranty_end_date = moment(this.filter_data.warranty_end_date).format('YYYY-MM-DD');
    this.getWarrantyDetail();
  }
  date_format4(): void {
    this.filter_data.verification_on = moment(this.filter_data.verification_on).format('YYYY-MM-DD');
    this.getWarrantyDetail();
  }
  date_format5(): void {
    this.filter_data.closed_date = moment(this.filter_data.closed_date).format('YYYY-MM-DD');
    this.getComplaintDetail();
  }
  date_format6(): void {
    this.filter_data.status_updated_date = moment(this.filter_data.status_updated_date).format('YYYY-MM-DD');
    this.getInstallationDetail();
  }
  
  

  getWarrantyDetail() {
    this.filter.status = this.tabType;

    if (this.pagenumber > this.total_page) {
      this.pagenumber = this.total_page;
      this.start = this.pageCount - this.page_limit;
    }
    if (this.start < 0) {
      this.start = 0;
    }
    this.encryptedData = this.service.payLoad ? { 'customer_id': this.id, 'pagelimit': this.page_limit, 'start': this.start, 'filter': this.filter_data }: this.cryptoService.encryptData({ 'customer_id': this.id, 'pagelimit': this.page_limit, 'start': this.start, 'filter': this.filter_data });

    this.service.post_rqst(this.encryptedData, 'ServiceTask/serviceWarrantyList').subscribe((result) => {
    this.decryptedData = this.service.payLoad ? result : this.cryptoService.decryptData(JSON.stringify(result));

      this.loader = true;
      if (this.decryptedData['statusCode'] == 200) {
        this.warrantyList = this.decryptedData['result'];
        this.loader = false;
        this.pageCount = this.decryptedData['count'];
        if (this.pagenumber > this.total_page) {
          this.pagenumber = this.total_page;
          this.start = this.pageCount - this.page_limit;
        }
        else {
          this.pagenumber = Math.ceil(this.start / this.page_limit) + 1;
          this.loader = false;
        }
        this.total_page = Math.ceil(this.pageCount / this.page_limit);
        this.sr_no = this.pagenumber - 1;
        this.sr_no = this.sr_no * this.page_limit;
        setTimeout(() => {
        }, 700)
      }
      else {
        this.toast.errorToastr(this.decryptedData['statusMsg']);
        this.loader = false;
      }
    })
  }



  getInstallationDetail() {
    this.filter.status = this.tabType;
    if (this.pagenumber > this.total_page) {
      this.pagenumber = this.total_page;
      this.start = this.pageCount - this.page_limit;
    }
    if (this.start < 0) {
      this.start = 0;
    }

    this.encryptedData = this.service.payLoad ? { 'customer_id': this.id, 'pagelimit': this.page_limit, 'start': this.start, 'filter': this.filter_data }: this.cryptoService.encryptData({ 'customer_id': this.id, 'pagelimit': this.page_limit, 'start': this.start, 'filter': this.filter_data });
    this.service.post_rqst(this.encryptedData, 'ServiceTask/serviceInstallationList').subscribe((result) => {
    this.decryptedData = this.service.payLoad ? result : this.cryptoService.decryptData(JSON.stringify(result));

      this.loader = true;
      if (this.decryptedData['statusCode'] == 200) {
        this.installationList = this.decryptedData['result'];
        this.loader = false;
        this.pageCount = this.decryptedData['count'];
        if (this.pagenumber > this.total_page) {
          this.pagenumber = this.total_page;
          this.start = this.pageCount - this.page_limit;
        }
        else {
          this.pagenumber = Math.ceil(this.start / this.page_limit) + 1;
        }
        this.total_page = Math.ceil(this.pageCount / this.page_limit);
        this.sr_no = this.pagenumber - 1;
        this.sr_no = this.sr_no * this.page_limit;
        setTimeout(() => {
        }, 700)
      }
      else {
        this.toast.errorToastr(this.decryptedData['statusMsg']);
        this.loader = false;
      }
    })
  }

  getComplaintDetail() {
    this.filter.status = this.tabType;

    if (this.pagenumber > this.total_page) {
      this.pagenumber = this.total_page;
      this.start = this.pageCount - this.page_limit;
    }
    if (this.start < 0) {
      this.start = 0;
    }

    this.encryptedData = this.service.payLoad ? { 'customer_id': this.id, 'pagelimit': this.page_limit, 'start': this.start, 'filter': this.filter_data }: this.cryptoService.encryptData({ 'customer_id': this.id, 'pagelimit': this.page_limit, 'start': this.start, 'filter': this.filter_data });

    this.service.post_rqst(this.encryptedData, 'ServiceTask/serviceComplaintList').subscribe((result) => {
      this.loader = true;
      this.decryptedData = this.service.payLoad ? result : this.cryptoService.decryptData(JSON.stringify(result));

      if (this.decryptedData['statusCode'] == 200) {
        this.complaintList = this.decryptedData['result'];
        this.loader = false;
        this.pageCount = this.decryptedData['count'];
        if (this.pagenumber > this.total_page) {
          this.pagenumber = this.total_page;
          this.start = this.pageCount - this.page_limit;
        }
        else {
          this.pagenumber = Math.ceil(this.start / this.page_limit) + 1;
        }
        this.total_page = Math.ceil(this.pageCount / this.page_limit);
        this.sr_no = this.pagenumber - 1;
        this.sr_no = this.sr_no * this.page_limit;
        setTimeout(() => {
        }, 700)
      }
      else {
        this.toast.errorToastr(this.decryptedData['statusMsg']);
        this.loader = false;
      }
    })
  }
  back(): void {
    this.location.back()
  }
  editCustomer() {
    this.router.navigate(['add-customer/' + this.id]);
  }



  attendancDetail(row) {
    console.log(row.add_list);

    const dialogRef = this.dialog2.open(ProductDetailModelComponent, {
      width: '800px',
      panelClass: 'cs-model',
      data: {
        row: row.add_list,
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result != false) {
        // this.getinspectionList('');
      }

    });
  }
}
