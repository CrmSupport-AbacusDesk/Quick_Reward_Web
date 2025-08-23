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
  selector: 'app-warranty-list',
  templateUrl: './warranty-list.component.html',
  styleUrls: ['./warranty-list.component.scss']
})
export class WarrantyListComponent implements OnInit {

  fabBtnValue: any = 'add';
  warrantyList: any = [];
  active_tab: any = 'Pending';
  filter: any ={};
  data: any = [];
  page_limit: any;
  start: any = 0;
  count: any;
  all_count: any;
  tab_count: any;
  total_page: any = 0;
  pagenumber: any = 0;
  loader: boolean = false;
  // tab_active = 'all';
  scheme_active_count: any;
  filter_data: any = {};
  today_date = new Date().toISOString().slice(0, 10);
  excelLoader: boolean = false;
  pageCount: any;
  sr_no: number;
  datanotfound: boolean = false;
  downurl: any = '';
  encryptedData: any;
  decryptedData:any;


  constructor(public dialog: DialogComponent, public cryptoService:CryptoService, public dialogs: MatDialog, public alert: DialogComponent, public service: DatabaseService, public rout: Router, public toast: ToastrManager, public session: sessionStorage) {
    this.downurl = service.downloadUrl
    this.page_limit = service.pageLimit;

  }

  ngOnInit() {
    this.filter_data = this.service.getData()
    if (this.filter_data.status) {
      this.active_tab = this.filter_data.status
    }
    this.getWarrantyList('');
  }

  pervious() {
    this.start = this.start - this.page_limit;
    this.getWarrantyList('');
  }

  nextPage() {
    this.start = this.start + this.page_limit;
    this.getWarrantyList('');
  }

  refresh() {
    this.start = 0;
    this.filter_data = {};
    this.getWarrantyList('');
  }

  clear() {
    this.refresh();
  }

  goToDetailHandler(id) {
    window.open(`/customer-detail/` + id);
  }
  date_format(): void {
    this.filter_data.date_created = moment(this.filter_data.date_created).format('YYYY-MM-DD');
    this.getWarrantyList('');
  }

  date_format2(): void {
    this.filter_data.date_of_purchase = moment(this.filter_data.date_of_purchase).format('YYYY-MM-DD');
    this.getWarrantyList('');
  }

  date_format3(): void {
    this.filter_data.warranty_end_date = moment(this.filter_data.warranty_end_date).format('YYYY-MM-DD');
    this.getWarrantyList('');
  }

  date_format4(): void {
    this.filter_data.verification_on = moment(this.filter_data.verification_on).format('YYYY-MM-DD');
    this.getWarrantyList('');
  }

  getWarrantyList(data) {
    if (this.pagenumber > this.total_page) {
      this.pagenumber = this.total_page;
      this.start = this.pageCount - this.page_limit;
    }
    if (this.start < 0) {
      this.start = 0;
    }
    this.filter_data.status = this.active_tab;
    this.encryptedData = this.service.payLoad ? { 'filter': this.filter_data, 'start': this.start, 'pagelimit': this.page_limit }: this.cryptoService.encryptData({ 'filter': this.filter_data, 'start': this.start, 'pagelimit': this.page_limit });
    let header = this.service.post_rqst(this.encryptedData, "ServiceTask/serviceWarrantyList")

    this.loader = true;
    header.subscribe((result) => {
      this.decryptedData = this.service.payLoad ? result : this.cryptoService.decryptData(JSON.stringify(result));
      if (this.decryptedData['statusCode'] == 200) {
        this.warrantyList = this.decryptedData['result'];
        this.pageCount = this.decryptedData['count'];
        this.tab_count = this.decryptedData['tab_count'];
        this.all_count=this.decryptedData['tab_count']['all_count'];
        this.loader = false;
        if (this.warrantyList.length == 0) {
          this.datanotfound = true;
        } else {
          this.datanotfound = false;
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


        for (let i = 0; i < this.warrantyList.length; i++) {
          if (this.warrantyList[i].status == '1') {
            this.warrantyList[i].newStatus = true
          }
          else if (this.warrantyList[i].status == '0') {
            this.warrantyList[i].newStatus = false;
          }
        }
      }
      else {
        this.toast.errorToastr(this.decryptedData['statusMsg']);
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
    this.service.post_rqst(this.encryptedData, "Excel/service_warranty_list").subscribe((result => {
    this.decryptedData = this.service.payLoad ? result : this.cryptoService.decryptData(JSON.stringify(result));
      if (this.decryptedData['msg'] == true) {
        window.open(this.downurl + this.decryptedData['filename'])
        this.getWarrantyList('');
        this.excelLoader=false;
      } else {
      }
    }));
  }

}


