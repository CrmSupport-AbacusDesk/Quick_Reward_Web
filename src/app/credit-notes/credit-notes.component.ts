import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { ActivatedRoute, Router } from '@angular/router';
import { DatabaseService } from 'src/_services/DatabaseService';
import { DialogComponent } from '../dialog.component';
import { sessionStorage } from '../localstorage.service';
import { UploadFileModalComponent } from '../upload-file-modal/upload-file-modal.component';
import { ToastrManager } from 'ng6-toastr-notifications';
import * as moment from 'moment';

@Component({
  selector: 'app-credit-notes',
  templateUrl: './credit-notes.component.html'
})

export class CreditNotesComponent implements OnInit {
  active_tab = 'active';
  excelLoader: boolean = false;
  paymentData: any = [];
  count: any;
  total_page: any;
  sr_no: any = 0;
  pageCount: any;
  page_limit: any;
  pagenumber: any = 1;
  start: any = 0;
  loader: any = false;
  datanotfound: boolean = false;
  type: any;
  type_id: any;
  filter: any = {};
  login_data: any = [];
  login_dr_id: any;
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
  constructor(public serve: DatabaseService, public route: Router, public ActivatedRoute: ActivatedRoute,
    public dialog: DialogComponent, public session: sessionStorage, public alrt: MatDialog, public toast: ToastrManager) {
    this.downurl = serve.downloadUrl;
    this.page_limit = serve.pageLimit;
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
    this.filter = this.serve.getData()
    this.login_data = this.session.getSession();
    this.login_data = this.login_data.value.data;
    if (this.login_data.access_level != '1') {
      this.login_dr_id = this.login_data.id;
    }

    this.ActivatedRoute.params.subscribe(params => {
      this.type_id = params.id;
      this.type = params.type;
      this.creditNote('', this.currentMonth_no, this.currentYear);
    });

  }
  ngOnDestroy() {
    this.serve.setData(this.filter)
  }

  pervious(blnk, month, year) {
    this.start = this.start - this.page_limit;
    this.creditNote(blnk, month, year);
  }

  nextPage(blnk, month, year) {
    this.start = this.start + this.page_limit;
    this.creditNote(blnk, month, year);
  }

  date_format(event, month, year): void {

    this.filter.transaction_date = moment(event.value).format('YYYY-MM-DD');
    this.creditNote('', month, year);
  }
  calenderInfo: any = []
  creditNote(action: any = '', month, year) {
    if (action == "refresh") {
      this.filter = {};
      this.paymentData = [];
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
    this.serve.post_rqst({ 'filter': this.filter, 'start': this.start, 'pagelimit': this.page_limit, 'month': month, 'year': year }, "Account/paymentListing")
      .subscribe((result => {
        if (result['statusCode'] == 200) {
          this.paymentData = (result['result']);
          // this.calenderInfo = (result['calenderInfo']);
          this.pageCount = result['count'];
          if (this.paymentData.length == 0) {
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
          this.serve.count_list();
        } else {
          this.toast.errorToastr(result['statusMsg'])
        }
      }))
  }




  refresh(blnk, month, year) {

    this.creditNote(blnk, month, year);
  }
  upload_excel() {
    const dialogRef = this.alrt.open(UploadFileModalComponent, {
      width: '500px',
      panelClass: 'cs-modal',
      disableClose: true,
      data: {
        'from': 'credit_note',
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      this.creditNote('', this.OrderMonth, this.OrderYear);

    });
  }
  id: any;
  state: any;
  tothepage(id, state, type) {
    this.route.navigate(['/distribution-detail/' + id], { queryParams: { state, id, type } });
  }


  exportAsXLSX(month, year) {
    this.serve.post_rqst({ 'filter': this.filter, 'start': this.start, 'pagelimit': this.page_limit, 'month': month, 'year': year }, "Excel/credit_note_listing")
      .subscribe((result => {
        if (result['msg'] == true) {
          window.open(this.downurl + result['filename'])
          this.creditNote('', month, year);
        } else {
        }

      }));
  }
}
