import { Component, ElementRef, OnInit, ViewChild, Input } from '@angular/core';
import { DatabaseService } from 'src/_services/DatabaseService';
import * as moment from 'moment';
import { ExpenseModalComponent } from '../expense-modal/expense-modal.component';
import { MatBottomSheet, MatDialog } from '@angular/material';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common'
import { sessionStorage } from 'src/app/localstorage.service';
import * as XLSX from 'xlsx';
import { ToastrManager } from 'ng6-toastr-notifications';
import { BottomSheetComponent } from 'src/app/bottom-sheet/bottom-sheet.component';
import { CryptoService } from 'src/_services/CryptoService';
import { ProgressService } from 'src/app/progress.service';




@Component({
  selector: 'app-list-expense',
  templateUrl: './list-expense.component.html',
  styleUrls: ['./list-expense.component.scss']
})
export class ListExpenseComponent implements OnInit {
  @ViewChild('table') table: ElementRef;

  food_expense_list: any = [];
  out_expense_list: any = [];
  hotel_expense_list: any = [];
  misc_expense_list: any = []
  local_expense_list: any = []
  user_list: any = []
  savingFlag: boolean = false;
  rsmData: any
  rsmname: any
  rsmrole: any
  user: any = []
  name: any
  designation: any
  out: any = 0
  selectedExpense: any[] = [];
  // selectedExpense: any = []
  local: any = 0
  misc: any = 0
  food: any = 0
  hotel: any = 0
  total: any
  expense_list: any = [];
  search: any = {};
  active_tab = 'Pending';
  loader: any;
  datanotfound = false;
  skelton: any;
  searchData: any;
  search_val: any = {}
  backButton: boolean = false;
  list1: any = []
  assign_login_data: any = [];
  assign_login_data2: any = [];
  view_edit: boolean = true;
  view_add: boolean = true;
  view_delete: boolean = true;
  tabCount: any;
  sr_no: any = 0;
  total_page: any;
  pageCount: any;
  page_limit: any;
  pagenumber: any = 1;
  start: any = 0;
  today_date: any = new Date()
  status_count: any;
  downurl: any = '';
  downloadingLoader: boolean = false;
  totalAmt: any = 0;
  seniorApprovedAmount:any =0;
  totalApprovedAmt: any = 0;
  report_manager: any = [];
  rsm2: any = [];
  hodList: any = [];
  downloader: any = false;
  download_percent: any;
  totalDownloadCount: any;
  remainingDownloadCount: any;
  totalCount: any;
  remainingCount: any;


  @Input() dataToReceive: any;
  padding0: any;
  hide: any;

  constructor(public toast: ToastrManager, public cryptoService:CryptoService, private bottomSheet: MatBottomSheet, public service: DatabaseService, public location: Location, public navparams: ActivatedRoute, public dialog: MatDialog, public session: sessionStorage,private progressService: ProgressService) {
    this.downurl = service.downloadUrl;
    this.page_limit = service.pageLimit;
    this.skelton = new Array(7);
    this.assign_login_data = this.session.getSession();
    this.assign_login_data = this.assign_login_data.value;
    this.assign_login_data2 = this.assign_login_data.data;
    this.assign_login_data = this.assign_login_data.assignModule;

    this.getReportManager('');
  }

  ngOnInit() {
    if (this.dataToReceive != undefined) {
      this.padding0 = this.dataToReceive.padding0;
      this.hide = this.dataToReceive.hide;
      this.search.employeeCode = this.dataToReceive.employee_id;
      this.expenseList();
    }
    else {
      this.search = this.service.getData()
      if (this.search.status) {
        this.active_tab = this.search.status
      }
      this.searchData = (this.navparams['params']['_value']);
      if (this.searchData.selectedUser && this.searchData.selectedDate) {
        this.backButton = true;
        this.search.userName = this.searchData.selectedUser;
        this.search.dateCreated = this.searchData.selectedDate;
        this.search.claimDateCreated = this.searchData.selectedDate;
        this.expenseList();
      }
      this.expenseList();
    }

  }

  refresh() {
    this.search = {};
    this.selectedExpense = [];
    if (this.dataToReceive != undefined) {
      this.search.employeeCode = this.dataToReceive.employee_id;
    }
    this.service.setData(this.search)
    this.service.currentUserID = ''
    this.expenseList();
  }


  pervious() {
    this.start = this.start - this.page_limit;
    this.expenseList('');
  }

  nextPage() {

    this.start = this.start + this.page_limit;
    this.expenseList('');
  }

  getReportManager(search, type: any = '') {
    this.service.post_rqst({ 'search': search }, "Checkin/getSalesUserForReporting").subscribe((result => {
      if (result['statusCode'] == 200) {
        if (type == 'hod') {
          this.hodList = result['all_sales_user'];
        }
        else if (type == 'rsm1') {
          this.report_manager = result['all_sales_user'];
        }
        else if (type == 'rsm2') {
          this.rsm2 = result['all_sales_user'];
        } else {
          this.report_manager = result['all_sales_user'];
          this.rsm2 = result['all_sales_user'];
          this.hodList = result['all_sales_user'];
        }
      }
      else {
        this.toast.errorToastr(result['statusMsg'])
      }
    }));
  }

  updateMultipleExp(val, i) {
    if (val == true) {
      this.selectedExpense.push(this.expense_list[i]['id'])
    }
    else if (val == false) {
      let index = this.selectedExpense.findIndex((row) => {
        return row == this.expense_list[i]['id']
      })
      this.selectedExpense.splice(index, 1);
    }
  }



  expenseList(action: any = '') {
    if (action == "refresh") {
      this.search = {};
    }
    this.loader = true;

    if (this.search.dateCreated) {
      this.search.dateCreated = moment(this.search.dateCreated).format('YYYY-MM-DD');
    }
    if (this.search.claimDate) {
      this.search.claimDate = moment(this.search.claimDate).format('YYYY-MM-DD');
    }
    if (this.pagenumber > this.total_page) {
      this.pagenumber = this.total_page;
      this.start = this.pageCount - this.page_limit;
    }
    if (this.start < 0) {
      this.start = 0;
    }
    this.loader = true;
    this.search.status = this.active_tab;

    this.service.post_rqst({ 'user_id': this.assign_login_data2.id, 'start': this.start, 'pagelimit': this.page_limit, 'search': this.search, 'expenseStatus': this.active_tab, 'user_type': this.assign_login_data2.type }, "Expense/expenseList").subscribe(result => {
      if (result['statusCode'] == 200) {
        this.expense_list = result['result'];
        this.expense_list.forEach(item => item['encrypt_id'] = this.cryptoService.encryptId(item['id']));
        this.pageCount = result['count'];
        this.tabCount = result['sub_count'];
        this.totalAmt = result['totalAmt'];
        this.seniorApprovedAmount = result['seniorApprovedAmount'];
        this.totalApprovedAmt = result['totalApprovedAmt']
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
        if (this.expense_list.length == 0) {
          this.datanotfound = true;
        }
        else {
          this.datanotfound = false;
        }

        setTimeout(() => {
          this.loader = false;

        }, 100);
      } else {
        this.loader = false;
        this.toast.errorToastr(result['statusMsg']);
      }
    }, err => {
      this.loader = false;
      this.toast.errorToastr('Something went wrong');
    })

    if (this.search.date_from) {
      this.search.date_from = moment(this.search.date_from).format('YYYY-MM-DD');
    }
    if (this.search.date_to) {
      this.search.date_to = moment(this.search.date_to).format('YYYY-MM-DD');
    }
  }

  Approval() {
    this.savingFlag = true;
    this.service.post_rqst({ 'data': this.selectedExpense }, "Expense/updateMultipleExpense").subscribe((result) => {
      if (result['statusCode'] == 200) {
        this.savingFlag = false;
        this.expenseList();
        this.toast.successToastr("Successfully Approved");
      }
      else {
        this.savingFlag = false;
        this.toast.errorToastr(result['statusMsg'])
      }
    }, error => {
      this.loader = false;
      this.savingFlag = false;
    });
  }


  expModal(type, id, totalAmt) {
    const dialogRef = this.dialog.open(ExpenseModalComponent, {
      width: '500px',
      panelClass: 'cs-modal',
      data: {
        type,
        id,
        from: 'expenseStatus',
        totalAmt

      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result == true) {
        this.expenseList();
      }
    });

  }
  StatusChangeModel(id) {

    const dialogRef = this.dialog.open(ExpenseModalComponent, {
      width: '500px',
      panelClass: 'cs-modal',
      data: {
        'Change_status': id,
        from: 'expenseBulkStatus',
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result == true) {
        this.selectedExpense = [];
        this.expenseList();
      }


    });

  }

  back(): void {
    this.location.back()
  }
  public date(date) {
    if (this.search.date_from) {
      this.search.date_from = moment(this.search.date_from).format('YYYY-MM-DD');
    }
    if (this.search.date_to) {
      this.search.date_to = moment(this.search.date_to).format('YYYY-MM-DD');
    }
  }



  openBottomSheet(): void {
    this.bottomSheet.open(BottomSheetComponent, {
      data: {
        'filterPage': 'Expense',
      }
    });
    this.bottomSheet._openedBottomSheetRef.afterDismissed().subscribe((data) => {
      this.search.date_from = data.date_from;
      this.search.date_to = data.date_to;
      this.search.userId = data.user_id;
      this.search.rep_man = data.rep_man;
      this.progressService.setCancelReq(false);
      this.downloadInChunks();
    })
  }
  exportAsXLSX(status) {
    this.loader = true;
    this.search.status = status;
    this.service.post_rqst({ 'user_id': this.assign_login_data2.id, 'start': this.start, 'pagelimit': this.page_limit, 'search': this.search, 'expenseStatus': this.active_tab, 'user_type': this.assign_login_data2.type }, "Excel/expense_list").subscribe((result => {
      if (result['msg'] == true) {
        this.loader = false;
        window.open(this.downurl + result['filename'])
        this.expenseList();
      } else {
        this.loader = false;
        this.toast.errorToastr('Data not found');
      }
    }));
  }

  sortData() {
    this.expense_list.reverse();
  }

  downloadExcel() {
    this.downloadingLoader = true;
    this.service.post_rqst({ 'user_id': this.assign_login_data2.id, 'start': this.start, 'pagelimit': this.page_limit, 'search': this.search, 'expenseStatus': this.active_tab, 'user_type': this.assign_login_data2.type }, "Excel/expenseList").subscribe((result) => {
      if (result['msg'] == true) {
        this.downloadingLoader = false;
        window.open(this.downurl + result['filename'])
        this.expenseList('');
      } else {
      }
    }, err => {
      this.downloadingLoader = false;
    });
  }
  
  downloadInChunks() {
    this.service.post_rqst({ 'user_id': this.assign_login_data2.id, 'start': this.start, 'pagelimit': this.page_limit, 'search': this.search, 'expenseStatus': this.active_tab, 'user_type': this.assign_login_data2.type }, "DownloadMaster/createQueueRequest").subscribe((result) => {
      if(result['statusCode'] == 200){
          if(result['code']== 0){
            this.toast.errorToastr(result['statusMsg']);
            return;
          }

          if(result['code']== 1 ){
            this.downloadExcel2();
          }
      }
    }, err => {
      this.loader = false;
    });
  }

  downloadExcel2() {
    // console.log(text);
    
    let can
    this.progressService.getCancelReq().subscribe(cancelReq => {
      can = cancelReq
    })
    console.log(can);
    
    if (can == false) {
      this.downloader = true;
      if (this.download_percent == null) {
        this.download_percent = 0;
      }
      this.service.post_rqst({ 'user_id': this.assign_login_data2.id, 'start': this.start, 'pagelimit': this.page_limit, 'search': this.search, 'expenseStatus': this.active_tab, 'user_type': this.assign_login_data2.type }, "DownloadMaster/downloadExpenseData").subscribe((result) => {
        if (result['code'] === 1) {
          this.downloader = false;
          this.download_percent = null;
          window.open(this.downurl + result['filename']);
          this.progressService.setTotalCount(0);
          this.progressService.setRemainingCount(0);
          this.progressService.setDownloadProgress(0);
          this.progressService.setDownloaderActive(false);
          this.expenseList();
        } else if (result['code'] === 0) {
          this.download_percent = Math.ceil(((result['totalCount'] - result['leftCount']) / result['totalCount']) * 100);

          if (this.download_percent > 100) {
            this.download_percent = 100;
          }
          this.totalCount = result['totalCount'];
          this.remainingCount = result['leftCount'];
          this.progressService.setTotalCount(this.totalCount);
          this.progressService.setRemainingCount(this.remainingCount);
          this.progressService.setDownloadProgress(this.download_percent);
          this.progressService.setDownloaderActive(this.downloader);
          this.downloadExcel2();
        }
      }, err => {
        this.loader = false;

      });
    }
  }
}
