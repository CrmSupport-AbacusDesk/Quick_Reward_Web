import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { ActivatedRoute, Router } from '@angular/router';
import * as moment from 'moment';
import { DatabaseService } from 'src/_services/DatabaseService';
import { sessionStorage } from 'src/app/localstorage.service';
import { ToastrManager } from 'ng6-toastr-notifications';
import { CryptoService } from 'src/_services/CryptoService';
import { UploadFileModalComponent } from 'src/app/upload-file-modal/upload-file-modal.component';
import { ChunksUploaderComponent } from 'src/app/uploader-new/chunks-uploader/chunks-uploader.component';

@Component({
  selector: 'app-pending-bill-list',
  templateUrl: './pending-bill-list.component.html'
})
export class PendingBillListComponent implements OnInit {

  sr_no: any = 0;
  pageCount: any;
  page_limit: any;
  pagenumber: any = 1;
  start: any = 0;
  loader: any = false;
  datanotfound = false;
  Bills: any = [];
  filter: any = {};
  calenderInfo: any = []
  billMonth: any;
  billYear: any;
  total_page: any;
  total_list: any
  downurl: any = '';
  fabBtnValue: any = 'add';
  encryptedData: any;
  decryptedData:any;
  login_data:any ={}

  constructor(public service: DatabaseService, public cryptoService:CryptoService, public route: Router, public ActivatedRoute: ActivatedRoute,
    public session: sessionStorage, public alrt: MatDialog, public toast: ToastrManager, public dialogs: MatDialog,) {
    this.page_limit = service.pageLimit;
    this.downurl = service.downloadUrl;
    this.login_data = this.session.getSession();
    this.login_data = this.login_data.value;
    this.login_data = this.login_data.data;
    this.pendingBillsData()
  }

  ngOnInit() {
  }

  pervious() {
    this.start = this.start - this.page_limit;
    this.pendingBillsData();
  }

  nextPage() {
    this.start = this.start + this.page_limit;
    this.pendingBillsData();
  }

  date_created_format(event,): void {
    this.filter.date_created = moment(event).format('YYYY-MM-DD');
    this.pendingBillsData('');
  }
  invoice_date_format(event,): void {
    this.filter.invoice_date = moment(event).format('YYYY-MM-DD');
    this.pendingBillsData('');
  }
  pendingBillsData(action: any = '') {
    if (action == "refresh") {
      this.filter = {};
      this.Bills = [];
      this.start = 0;
    }
    if (this.pagenumber > this.total_page) {
      this.pagenumber = this.total_page;
      this.start = this.pageCount - this.page_limit;
    }

    if (this.start < 0) {
      this.start = 0;
    }
    this.loader = true;
    this.encryptedData = this.service.payLoad ? { 'filter': this.filter, 'start': this.start, 'pagelimit': this.page_limit }: this.cryptoService.encryptData({ 'filter': this.filter, 'start': this.start, 'pagelimit': this.page_limit });
    this.service.post_rqst(this.encryptedData, "Account/pendingBillPaymentsListing")
      .subscribe((result => {
      this.decryptedData = this.service.payLoad ? result : this.cryptoService.decryptData(JSON.stringify(result));

        if (this.decryptedData['statusCode'] == 200) {
          this.Bills = (this.decryptedData['result']);
          this.calenderInfo = (this.decryptedData['calenderInfo']);
          if (this.Bills.length == 0) {
            this.datanotfound = true
          } else {
            this.datanotfound = false

          }
          this.loader = false;
          this.pageCount = this.decryptedData['count'];
          this.total_list = (this.decryptedData['overall_total_sum']);
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

          this.service.count_list();
        }
        else {
          this.loader = false;
          this.toast.errorToastr(this.decryptedData['statusMsg'])
        }
      }))

  }

  refresh() {
    this.filter = {}
    this.service.setData(this.filter)
    this.pendingBillsData();
  }


  exportAsXLSX() {
    this.loader = true;
    this.encryptedData = this.service.payLoad ? { 'filter': this.filter, 'start': this.start, 'pagelimit': this.page_limit }: this.cryptoService.encryptData({ 'filter': this.filter, 'start': this.start, 'pagelimit': this.page_limit });
    this.service.post_rqst({ 'filter': this.filter, 'start': this.start, 'pagelimit': this.page_limit }, "Excel/pendingBillPaymentsListingCsv")
      .subscribe((result) => {
      this.decryptedData = this.service.payLoad ? result : this.cryptoService.decryptData(JSON.stringify(result));
        if (this.decryptedData['msg'] == true) {
          this.loader = false;
          window.open(this.downurl + this.decryptedData['filename'])
          this.pendingBillsData('');
        } else {
          this.loader = false;
        }

      }, err => {
        this.loader = false;
      });

  }


  
  upload_excel() {
    const dialogRef = this.alrt.open(ChunksUploaderComponent, {
      width: '500px',
      panelClass: 'cs-modal',
      data: {
        'For': 'PendingBills',
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if(result){
          this.pendingBillsData('');
      }
    });
  }

}
