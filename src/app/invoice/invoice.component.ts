import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { ActivatedRoute, Router } from '@angular/router';
import * as moment from 'moment';
import { DatabaseService } from 'src/_services/DatabaseService';
import { DialogComponent } from '../dialog.component';
import { UploadFileModalComponent } from '../upload-file-modal/upload-file-modal.component';
import { sessionStorage } from 'src/app/localstorage.service';
import { ToastrManager } from 'ng6-toastr-notifications';
import { CryptoService } from 'src/_services/CryptoService';


@Component({
  selector: 'app-invoice',
  templateUrl: './invoice.component.html',
  styleUrls: ['./invoice.component.scss']
})

export class InvoiceComponent implements OnInit {
  active_tab = 'active';
  excelLoader: boolean = false;
  datanotfound: boolean = false;
  payment_list: any = [];
  count: any;
  total_page: any;
  sr_no: any = 0;
  pageCount: any;
  page_limit: any;
  pagenumber: any = 1;
  start: any = 0;
  exp_loader: any = false;
  loader: any = false;
  type: any;
  type_id: any;
  filter: any = {};
  login_data: any = [];
  login_dr_id: any;
  today_date: Date;
  assign_login_data2: any = [];
  fabBtnValue: any = 'add';
  assign_login_data: any = [];
  currentMonth_no: any;
  currentYear: any;
  currentMonth: any;
  monthNames: string[];
  OrderMonth: any;
  OrderYear: any;
  date: any;
  downurl: any = '';
  encryptedData: any;
  decryptedData:any;

  constructor(public service: DatabaseService,
    public cryptoService:CryptoService,  public route: Router, public ActivatedRoute: ActivatedRoute,
    public dialog: DialogComponent, public session: sessionStorage, public alrt: MatDialog, public toast: ToastrManager) {
    this.downurl = service.downloadUrl;
    this.page_limit = service.pageLimit;
    this.today_date = new Date();
    this.assign_login_data = this.session.getSession();
    this.assign_login_data = this.assign_login_data.value;
    this.assign_login_data2 = this.assign_login_data.data;
    this.assign_login_data = this.assign_login_data.assignModule;
    this.date = new Date();
    this.monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec'];
    this.currentMonth = this.monthNames[this.date.getMonth()];
    this.currentYear = this.date.getFullYear();
    this.currentMonth_no = this.date.getMonth() + 1;
  }

  ngOnInit() {
    this.filter = this.service.getData()
    this.login_data = this.session.getSession();
    this.login_data = this.login_data.value.data;
    if (this.login_data.access_level != '1') {
      this.login_dr_id = this.login_data.id;
    }

    this.ActivatedRoute.params.subscribe(params => {
      this.type_id = params.id;
      this.type = params.type;
      this.billData('', this.currentMonth_no, this.currentYear);
    });

  }
  ngOnDestroy() {
    this.service.setData(this.filter)
  }

  pervious(blnk, month, year) {
    this.start = this.start - this.page_limit;
    this.billData(blnk, month, year);
  }

  nextPage(blnk, month, year) {
    this.start = this.start + this.page_limit;
    this.billData(blnk, month, year);
  }

  date_created_format(event, month, year): void {
      this.filter.date_created = moment(event).format('YYYY-MM-DD');
      this.billData('', month, year);
  }

  transaction_date_format(event, month, year): void {
      this.filter.transaction_date = moment(event).format('YYYY-MM-DD');
      this.billData('', month, year);
  }

  calenderInfo: any = []
  billData(action: any = '', month, year) {
    if (action == "refresh") {
      this.filter = {};
      this.payment_list = [];
      this.start = 0;
    }
    if (this.pagenumber > this.total_page) {
      this.pagenumber = this.total_page;
      this.start = this.pageCount - this.page_limit;
    }

    if (this.start < 0) {
      this.start = 0;
    }
    this.OrderMonth = month
    this.OrderYear = year
    this.loader = true;
    this.encryptedData = this.service.payLoad ? { 'filter': this.filter, 'start': this.start, 'pagelimit': this.page_limit, 'month': month, 'year': year }: this.cryptoService.encryptData({ 'filter': this.filter, 'start': this.start, 'pagelimit': this.page_limit, 'month': month, 'year': year });
    this.service.post_rqst(this.encryptedData, "Account/ledgerListing")
      .subscribe((result => {
      this.decryptedData = this.service.payLoad ? result : this.cryptoService.decryptData(JSON.stringify(result));
        if (this.decryptedData['statusCode'] == 200) {
          this.payment_list = (this.decryptedData['result']);
          this.calenderInfo = (this.decryptedData['calenderInfo']);
          if (this.payment_list.length == 0) {
            this.datanotfound = true
          } else {
            this.datanotfound = false

          }
          for (let index = 0; index < this.calenderInfo.length; index++) {
            const date = new Date();
            date.setMonth(this.calenderInfo[index].month - 1);
            let MonthName = ''
            MonthName = date.toLocaleString('en-US', { month: 'short' })
            this.calenderInfo[index].month_name = MonthName
          }
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
          this.loader = false;
          this.service.count_list();
        } else {
          this.loader = false;
          this.service.count_list();
          this.toast.errorToastr(this.decryptedData['statusMsg'])
        }
      }))
  }


  upload_excel(ledger) {
    const dialogRef = this.alrt.open(UploadFileModalComponent, {
      width: '500px',
      panelClass: 'cs-modal',
      data: {
        'from': ledger,
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      this.billData('', this.OrderMonth, this.OrderYear);
    });
  }


  refresh(blnk, month, year) {
    this.filter = {}
    this.service.setData(this.filter)
    this.service.currentUserID = ''
    this.billData(blnk, month, year);
  }

  id: any;
  state: any;
  tothepage(id, state, type) {
    this.route.navigate(['/distribution-detail/' + id], { queryParams: { state, id, type } });
  }


  exportAsXLSX(month, year) {
    this.loader = true;
    this.encryptedData = this.service.payLoad ? { 'filter': this.filter, 'start': this.start, 'pagelimit': this.page_limit, 'month': month, 'year': year }: this.cryptoService.encryptData({ 'filter': this.filter, 'start': this.start, 'pagelimit': this.page_limit, 'month': month, 'year': year });
    this.service.post_rqst(this.encryptedData, "Excel/ledgerListingCsv")
      .subscribe((result => {
    this.decryptedData = this.service.payLoad ? result : this.cryptoService.decryptData(JSON.stringify(result));
        if (this.decryptedData['msg'] == true) {
          this.loader = false;
          window.open(this.downurl + this.decryptedData['filename'])
          this.billData('', month, year);
        } else {
        }

      }));
  }

}


