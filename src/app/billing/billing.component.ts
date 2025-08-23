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
import { ChunksUploaderComponent } from '../uploader-new/chunks-uploader/chunks-uploader.component';

@Component({
  selector: 'app-billing',
  templateUrl: './billing.component.html',
  styleUrls: ['./billing.component.scss']
})
export class BillingComponent implements OnInit {
  excelLoader: boolean = false;
  total_list: any
  value: any = {};
  dr_list_temp: any = [];
  billingList: any = [];
  count: any;
  total_page: any;
  sr_no: any = 0;
  pageCount: any;
  page_limit: any;
  pagenumber: any = 1;
  start: any = 0;
  loader: any = false;
  fabBtnValue: any = 'add';
  data: any = [];
  datanotfound = false;
  type: any;
  type_id: any;
  filter: any = {};
  login_data: any = [];
  login_dr_id: any;
  skelton: any = {}
  today_date: Date;
  assign_login_data2: any = [];
  assign_login_data: any = [];
  currentMonth_no: any;
  currentYear: any;
  currentMonth: any;
  monthNames: string[];
  OrderMonth: any;
  OrderYear: any;
  date: any;
  downurl: any = '';
  CompanyId:any


  constructor(public service: DatabaseService,  public cryptoService:CryptoService, public route: Router, public ActivatedRoute: ActivatedRoute,
    public dialog: DialogComponent, public session: sessionStorage, public alrt: MatDialog, public toast: ToastrManager) {
    this.downurl = service.downloadUrl;

    this.page_limit = service.pageLimit;
    this.today_date = new Date();
    this.assign_login_data = this.session.getSession();
    this.assign_login_data = this.assign_login_data.value;
    this.assign_login_data2 = this.assign_login_data.data;
    this.date = new Date();
    this.monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec'];
    this.currentMonth = this.monthNames[this.date.getMonth()];
    this.currentYear = this.date.getFullYear();
    this.currentMonth_no = this.date.getMonth() + 1;
    this.assign_login_data = this.assign_login_data.assignModule;

    let flag = 0;




  }

  ngOnInit() {
    this.filter = this.service.getData()
    if (this.filter.year && this.filter.month) {
      this.currentYear = this.filter.year
      this.currentMonth_no = this.filter.month
    }
    this.login_data = this.session.getSession();
    this.login_data = this.login_data.value.data;
    this.skelton = new Array(10);

    if (this.login_data.access_level != '1') {
      this.login_dr_id = this.login_data.id;
    }

    this.ActivatedRoute.params.subscribe(params => {
      this.type_id = params.id;
      this.type = params.type;
      this.billData('', this.currentMonth_no, this.currentYear);
    });

  }
  //   ngOnDestroy(){
  //     this.service.setData(this.filter)

  //  }

  dr_count: any;

  pervious(blnk, month, year) {
    this.start = this.start - this.page_limit;
    this.billData(blnk, month, year);
  }

  nextPage(blnk, month, year) {
    this.start = this.start + this.page_limit;
    this.billData(blnk, month, year);
  }

  date_format(event, month, year): void {
    this.filter.date_created = moment(event).format('YYYY-MM-DD');
    this.billData('', month, year);
  }
  date_billing_format(event, month, year): void {
    this.filter.billing_date = moment(event).format('YYYY-MM-DD');
    this.billData('', month, year);
  }
  calenderInfo: any = []
  billData(action: any = '', month, year) {
    if (action == "refresh") {
      this.filter = {};
      this.billingList = [];
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
    this.filter.month = this.OrderMonth
    this.filter.year = this.OrderYear
    this.loader = true;
    this.service.post_rqst({ 'filter': this.filter, 'start': this.start, 'pagelimit': this.page_limit, 'month': month, 'year': year }, "Account/tallyInvoiceCreditBillingListing")
      .subscribe((result => {
        if (result['statusCode'] == 200) {
          this.billingList = (result['credit_billing_list']);
          this.billingList.forEach(item => item['encrypt_id'] = this.cryptoService.encryptId(item['id']));
          this.calenderInfo = (result['calenderInfo']);
          if (this.billingList.length == 0) {
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
          this.loader = false;
          this.pageCount = result['count'];
          this.total_list = (result['overall_total_sum']);
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
        } else {
          this.loader = false;
          this.toast.errorToastr(result['statusMsg'])
        }
      }))
  }





  exportAsXLSX(month, year) {
    this.loader = true;
    this.service.post_rqst({ 'filter': this.filter, 'start': this.start, 'pagelimit': this.page_limit, 'month': month, 'year': year }, "Excel/tally_invoice_credit_billing_listing")
      .subscribe((result) => {
        if (result['msg'] == true) {
          this.loader = false;
          window.open(this.downurl + result['filename'])
          this.billData('', month, year);
        } else {
          this.loader = false;
        }

      }, err => {
        this.loader = false;
      });

  }


  upload_excel(type) {
    const dialogRef = this.alrt.open(ChunksUploaderComponent, {
      width: '500px',
      panelClass: 'cs-modal',
      disableClose: true,
      data: {
        // 'from': 'invoice',
        'For': type,
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



}


