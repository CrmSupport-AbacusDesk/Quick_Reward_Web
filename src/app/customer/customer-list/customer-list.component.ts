import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { Router } from '@angular/router';
import * as moment from 'moment';
import { ToastrManager } from 'ng6-toastr-notifications';
import { CryptoService } from 'src/_services/CryptoService';
import { DatabaseService } from 'src/_services/DatabaseService';
import { DialogComponent } from 'src/app/dialog.component';
import { sessionStorage } from 'src/app/localstorage.service';

@Component({
  selector: 'app-customer-list',
  templateUrl: './customer-list.component.html',
  styleUrls: ['./customer-list.component.scss']
})
export class CustomerListComponent implements OnInit {
  fabBtnValue: any = 'add';
  customerList: any = [];
  filter: any = false;
  data: any = [];
  page_limit: any;
  start: any = 0;
  count: any;
  total_page: any = 0;
  pagenumber: any = 0;
  loader: boolean = false;
  tab_active = 'all';
  scheme_active_count: any;
  filter_data: any = {};
  today_date = new Date().toISOString().slice(0, 10);
  excelLoader: boolean = false;
  pageCount: any;
  sr_no: number;
  datanotofound: boolean = false;
  downurl: any = '';
  encryptedData: any;
  decryptedData:any;


  constructor(public dialog: DialogComponent, public cryptoService:CryptoService, public dialogs: MatDialog, public alert: DialogComponent, public service: DatabaseService, public rout: Router, public toast: ToastrManager, public session: sessionStorage) {
    this.downurl = service.downloadUrl
    this.page_limit = service.pageLimit;
  }
  ngOnInit() {
    this.filter_data = this.service.getData()
    this.getCumtomerList('');
  }

  pervious() {
    this.start = this.start - this.page_limit;
    this.getCumtomerList('');
  }

  nextPage() {
    this.start = this.start + this.page_limit;
    this.getCumtomerList('');
  }

  refresh() {
    this.start = 0;
    this.filter_data = {};
    this.getCumtomerList('');
  }

  clear() {
    this.refresh();
  }

  goToDetailHandler(id) {
    window.open(`/customer-detail/` + id);
  }
  date_format(): void {
    this.filter_data.date_created = moment(this.filter_data.date_created).format('YYYY-MM-DD');
    this.getCumtomerList('');
  }

  getCumtomerList(data) {
    if (this.pagenumber > this.total_page) {
      this.pagenumber = this.total_page;
      this.start = this.pageCount - this.page_limit;
    }
    if (this.start < 0) {
      this.start = 0;
    }
    this.encryptedData = this.service.payLoad ? { 'filter': this.filter_data, 'start': this.start, 'pagelimit': this.page_limit }: this.cryptoService.encryptData({ 'filter': this.filter_data, 'start': this.start, 'pagelimit': this.page_limit });
    let header = this.service.post_rqst(this.encryptedData, "ServiceCustomer/serviceCustomerList")

    this.loader = true;
    header.subscribe((result) => {
    this.decryptedData = this.service.payLoad ? result : this.cryptoService.decryptData(JSON.stringify(result));
      if (this.decryptedData['statusCode'] == 200) {
        this.customerList = this.decryptedData['result'];
        this.pageCount = this.decryptedData['count'];
        this.scheme_active_count = this.decryptedData['scheme_active_count'];
        this.loader = false;
        if (this.customerList.length == 0) {
          this.datanotofound = false;
        } else {
          this.datanotofound = true;
          this.loader = false;
        }

        if (this.pagenumber > this.total_page) {
          this.pagenumber = this.total_page;
          this.start = this.pageCount - this.page_limit;
        }
        else {
          this.pagenumber = Math.ceil(this.start / this.page_limit) + 1;
        }
        this.total_page = Math.ceil(this.pageCount / this.page_limit);
        this.sr_no = this.pagenumber - 1;
        this.sr_no = this.sr_no * this.page_limit


        for (let i = 0; i < this.customerList.length; i++) {
          if (this.customerList[i].status == '1') {
            this.customerList[i].newStatus = true
          }
          else if (this.customerList[i].status == '0') {
            this.customerList[i].newStatus = false;
          }
        }
      }
      else {
        this.toast.errorToastr(this.decryptedData['statusMsg']);
        this.datanotofound = true;
        this.loader = false;
      }

    })
  }
  lastBtnValue(value) {
    this.fabBtnValue = value;
  }

  downloadExcel() {
    this.excelLoader=true;
    this.encryptedData = this.service.payLoad ? { 'filter': this.filter_data }: this.cryptoService.encryptData({ 'filter': this.filter_data });
    this.service.post_rqst(this.encryptedData, "Excel/service_customer_list").subscribe((result => {
    this.decryptedData = this.service.payLoad ? result : this.cryptoService.decryptData(JSON.stringify(result));
      if (this.decryptedData['msg'] == true) {
        window.open(this.downurl + this.decryptedData['filename'])
        this.getCumtomerList('');
        this.excelLoader=false;
      } else {
      }
    }));
  }

}
