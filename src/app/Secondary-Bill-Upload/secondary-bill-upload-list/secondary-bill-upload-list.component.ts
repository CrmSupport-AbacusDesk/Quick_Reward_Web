import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import * as moment from 'moment';
import { ToastrManager } from 'ng6-toastr-notifications';
import { DatabaseService } from 'src/_services/DatabaseService';
import { sessionStorage } from 'src/app/localstorage.service';
import { StatusModalComponent } from 'src/app/order/status-modal/status-modal.component';


@Component({
  selector: 'app-secondary-bill-upload-list',
  templateUrl: './secondary-bill-upload-list.component.html',
  styleUrls: ['./secondary-bill-upload-list.component.scss']
})
export class SecondaryBillUploadListComponent implements OnInit {
  
  filter: any = {};
  pageCount: any;
  page_limit: any = 50;
  pagenumber: any = 1;
  total_page: any;
  sr_no: any = 0;
  start: any = 0;
  loader: boolean = false;
  active_tab = 'Pending';
  excelLoader: boolean = false;
  total_list: any
  loginData: any;
  dispatchGatepassCount: any;
  secBillCounts: any ={};
  secBillSummaryrrayCounts: any;
  downurl: any = '';
  search_val: any = {};
  @Input() dataToReceive: any;
  padding0: any;
  hide: boolean = false;
  party_id:any;


  constructor(public serve: DatabaseService,public toast: ToastrManager,public session: sessionStorage,public dialog: MatDialog) { 
    this.downurl = serve.downloadUrl;
    // this.loginData = this.session.getSession();
    // this.loginData = this.loginData.value;
    // this.loginData = this.loginData.data;
  }
  
  ngOnInit() {
    if (this.dataToReceive != undefined) {
      this.padding0 = this.dataToReceive.padding0;
      this.hide = this.dataToReceive.hide;
      this.party_id = this.dataToReceive.id;
      this.getsecBillList('')
    }
    else{
      this.getsecBillList('');
    }
  }
  
  refresh(blnk, active_tab) {
    this.start = 0;
    this.filter = {};
    this.getsecBillList('');
  }
  
  secBillList: any = [];
  getsecBillList(action: any = '') {
    if (action == "refresh") {
      this.filter = {};
      this.secBillList = [];
      this.start = 0;
    }
    if (this.pagenumber > this.total_page) {
      this.pagenumber = this.total_page;
      this.start = this.pageCount - this.page_limit;
    }
    
    if (this.start < 0) {
      this.start = 0;
    }
    if (this.filter.date_created) {
      this.filter.date_created = moment(this.filter.date_created).format('YYYY-MM-DD');
    }
    if (this.filter.bill_date) {
      this.filter.bill_date = moment(this.filter.bill_date).format('YYYY-MM-DD');
    }
    this.loader = true;
    this.filter.active_tab = this.active_tab;
    this.serve.post_rqst({ 'filter': this.filter, 'party_id':this.party_id, 'start': this.start, 'pagelimit': this.page_limit }, "Order/secondaryOrdersBillListing")
    .subscribe((result => {
      console.log(result);
      
      if (result['statusCode'] == 200) {
        this.secBillList = (result['result']);
        this.secBillCounts = result['tab_count'];
        this.secBillSummaryrrayCounts = result['sum_array'];
        
        this.total_list = (result['total_count']);
        console.log(this.total_list);
        
        this.loader = false;
        
        if (this.active_tab == 'Pending') {
          this.pageCount = this.secBillCounts.Pending;
          this.total_page = Math.ceil(this.pageCount / this.page_limit);
          console.log(this.pageCount);
          console.log(this.total_page);
          
        }
        else if (this.active_tab == 'Verified') {
          this.pageCount = this.secBillCounts.Verified;
          this.total_page = Math.ceil(this.pageCount / this.page_limit);
          console.log(this.pageCount);
          console.log(this.total_page);
          
        }
        else if (this.active_tab == 'Reject') {
          this.pageCount = this.secBillCounts.Reject;
          this.total_page = Math.ceil(this.pageCount / this.page_limit);
          console.log(this.pageCount);
          console.log(this.total_page);
          
        }
        if (this.pagenumber > this.total_page) {
          this.pagenumber = this.total_page;
          this.start = this.pageCount - this.page_limit;
        }
        else {
          this.pagenumber = Math.ceil(this.start / this.page_limit) + 1;
        }
        console.log(this.pagenumber);
        
        
        this.total_page = Math.ceil(this.pageCount / this.page_limit);
        this.sr_no = this.pagenumber - 1;
        this.sr_no = this.sr_no * this.page_limit;
      } else {
        this.loader = false;
        this.toast.errorToastr(result['statusMsg'])
      }
    }))
  }
  
  downloadExcel() {
    this.loader = true;
    this.serve.post_rqst({ 'start': this.start, 'pagelimit': this.page_limit, 'filter': this.filter}, "Order/secondaryOrdersBillExcel").subscribe((result) => {
      if (result['statusCode'] == 200) {
        this.loader = false;
        window.open(this.downurl + result['filename'])
        this.getsecBillList('');
      } else {
        this.loader = false;
      }
    }, err => {
      this.loader = false;
      
    });
  }

  openBillingPercentDialog(): void {
    const dialogRef = this.dialog.open(StatusModalComponent, {
      width: '400px' ,
      data: {
        'from': 'BillingPercent',
      }
    });
    
    dialogRef.afterClosed().subscribe(result => {
      if (result != false) {
        this.getsecBillList('');
      }
    });
  }
  
}
