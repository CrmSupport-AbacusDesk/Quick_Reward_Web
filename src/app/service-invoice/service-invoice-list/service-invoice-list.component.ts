import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { ActivatedRoute, Router } from '@angular/router';
import * as moment from 'moment';
import { ToastrManager } from 'ng6-toastr-notifications';
import { DatabaseService } from 'src/_services/DatabaseService';
import { DialogComponent } from 'src/app/dialog.component';
import { DialogService } from 'src/app/dialog.service';
import { sessionStorage } from 'src/app/localstorage.service';
import { ExportexcelService } from 'src/app/service/exportexcel.service';import { ServiceInvoiceAddComponent } from '../service-invoice-add/service-invoice-add.component';
import { CryptoService } from 'src/_services/CryptoService';
;

@Component({
  selector: 'app-service-invoice-list',
  templateUrl: './service-invoice-list.component.html',
  styleUrls: ['./service-invoice-list.component.scss']
})
export class ServiceInvoiceListComponent implements OnInit {

  fabBtnValue: any = 'add';
  invoiceList: any = [];
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
  datanotfound: boolean = false;
  downurl: any = ''
  url: any;
  active_tab: any = 'Pending';
  tab_count: any;
  encryptedData: any;
  decryptedData:any;


  constructor(public session: sessionStorage,   public cryptoService:CryptoService,private router: Router, public alert: DialogComponent, public service: DatabaseService, public editdialog: DialogService, public dialog: MatDialog, public route: ActivatedRoute, public toast: ToastrManager, public excelservice: ExportexcelService, public dialog1: DialogComponent) {
    this.url = this.service.uploadUrl + 'service_task/'
    this.downurl = service.downloadUrl
    this.page_limit = service.pageLimit;
  }

  ngOnInit() {
    this.filter_data.status = this.active_tab
    this.filter_data = this.service.getData()
    this.getinvoiceList('');
  }

  pervious() {
    this.start = this.start - this.page_limit;
    this.getinvoiceList('');
  }

  nextPage() {
    this.start = this.start + this.page_limit;
    this.getinvoiceList('');
  }

  refresh() {
    this.start = 0;
    this.filter_data = {};
    this.getinvoiceList('');
  }
  date_format(): void {
    this.filter_data.date_created = moment(this.filter_data.date_created).format('YYYY-MM-DD');
    this.getinvoiceList('');
  }
  clear() {
    this.refresh();
  }

  getinvoiceList(data) {
    if (this.pagenumber > this.total_page) {
      this.pagenumber = this.total_page;
      this.start = this.pageCount - this.page_limit;
    }
    if (this.start < 0) {
      this.start = 0;
    }
    this.filter_data.status = this.active_tab;
    this.encryptedData = this.service.payLoad ? { 'filter': this.filter_data, 'start': this.start, 'pagelimit': this.page_limit }: this.cryptoService.encryptData({ 'filter': this.filter_data, 'start': this.start, 'pagelimit': this.page_limit });
    let header = this.service.post_rqst(this.encryptedData, "ServiceInvoice/serviceInvoiceList")

    this.loader = true;
    header.subscribe((result) => {
      this.decryptedData = this.service.payLoad ? result : this.cryptoService.decryptData(JSON.stringify(result));
      if (this.decryptedData['statusCode'] == 200) {
        this.invoiceList = this.decryptedData['result'];
        console.log(this.invoiceList);
        this.pageCount = this.decryptedData['count'];
        this.tab_count = this.decryptedData['tab_count'];
        this.scheme_active_count = this.decryptedData['scheme_active_count'];
        this.loader = false;
        if (this.invoiceList.length == 0) {
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

        for (let i = 0; i < this.invoiceList.length; i++) {
          if (this.invoiceList[i].status == '1') {
            this.invoiceList[i].newStatus = true
          }
          else if (this.invoiceList[i].status == '0') {
            this.invoiceList[i].newStatus = false;
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

  // addSapre() {
  //   const dialogRef = this.dialog.open(ServiceInvoiceAddComponent, {
  //     width: '850px',
  //     height: '500px',
  //     panelClass: 'cs-modal',
  //     data: {
  //     }
  //   });
  //   dialogRef.afterClosed().subscribe(result => {
  //     console.log(result);
  //     if (result==true) {
  //       this.getinvoiceList('');
  //     }
  //   });
  // }

  delete(id) {
    this.dialog1.delete('Invoice!').then((result) => {
      if (result) {
        this.encryptedData = this.service.payLoad ? { 'id': id }: this.cryptoService.encryptData({ 'id': id });
        this.service.post_rqst(this.encryptedData, "ServiceInvoice/serviceInvoiceDelete").subscribe((result) => {
        this.decryptedData = this.service.payLoad ? result : this.cryptoService.decryptData(JSON.stringify(result));
          if (this.decryptedData['statusCode'] == 200) {
            this.toast.successToastr(this.decryptedData['statusMsg']);
            this.getinvoiceList('')
          }
          else {
            this.toast.errorToastr(this.decryptedData['statusMsg']);
          }
        })
      }
    });
  }

  downloadExcel() {
    this.excelLoader = true;
    this.encryptedData = this.service.payLoad ? { 'filter': this.filter_data }: this.cryptoService.encryptData({ 'filter': this.filter_data });
    this.service.post_rqst(this.encryptedData, "Excel/service_invoice_list").subscribe((result => {
    this.decryptedData = this.service.payLoad ? result : this.cryptoService.decryptData(JSON.stringify(result));

      if (this.decryptedData['msg'] == true) {
        window.open(this.downurl + this.decryptedData['filename'])
        this.getinvoiceList('');
        this.excelLoader = false;
      } else {
      }
    }));
  }

}
