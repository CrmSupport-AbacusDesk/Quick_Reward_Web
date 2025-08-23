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
  selector: 'app-complaint-list',
  templateUrl: './complaint-list.component.html',
  styleUrls: ['./complaint-list.component.scss']
})
export class ComplaintListComponent implements OnInit {
  fabBtnValue: any = 'add';
  segmentList: any = [];
  SubcategoryList: any = [];
  complaintList: any = [];
  filter: any = false;
  data: any = [];
  page_limit: any;
  start: any = 0;
  count: any;
  total_page: any = 0;
  pagenumber: any = 0;
  loader: boolean = false;
  active_tab: any = 'Pending';
  sub_active_tab: any='Not_Assigned'
  tab_count: any;
  sub_tab_count: any;
  scheme_active_count: any;
  filter_data: any = {};
  today_date = new Date().toISOString().slice(0, 10);
  excelLoader: boolean = false;
  pageCount: any;
  sr_no: number;
  datanotfound: boolean = false;
  downurl: any = ''
  encryptedData: any;
  decryptedData:any;

  constructor(public dialog: DialogComponent,public cryptoService:CryptoService, public dialogs: MatDialog, public alert: DialogComponent, public service: DatabaseService, public rout: Router, public toast: ToastrManager, public session: sessionStorage) {
    this.downurl = service.downloadUrl
    this.page_limit = service.pageLimit;
  }

  ngOnInit() {
    this.filter_data = this.service.getData()

    if (this.filter_data.status) {
      this.active_tab = this.filter_data.status
      if ( this.active_tab=='Pending') {
        this.sub_active_tab='Not_Assigned'
        this.sub_active_tab=this.filter_data.sub_status
      }else{
        this.sub_active_tab=this.filter_data.sub_status
      }
    }
    this.getComplantList('');



  }

  pervious() {
    this.start = this.start - this.page_limit;
    this.getComplantList('');
  }

  nextPage() {
    this.start = this.start + this.page_limit;
    this.getComplantList('');
  }

  refresh() {
    this.start = 0;
    this.filter_data = {};
    this.getComplantList('');
  }

  clear() {
    this.refresh();
  }

  goToDetailHandler(id) {
    window.open(`/complaint-detail/` + id);
  }
  date_format(): void {
    this.filter_data.date_created = moment(this.filter_data.date_created).format('YYYY-MM-DD');
    this.getComplantList('');
  }
  date_format2(): void {
    this.filter_data.closed_date = moment(this.filter_data.closed_date).format('YYYY-MM-DD');
    this.getComplantList('');
  }
  date_format3(): void {
    this.filter_data.return_on = moment(this.filter_data.return_on).format('YYYY-MM-DD');
    this.getComplantList('');
  }

  getComplantList(data) {
    if (this.pagenumber > this.total_page) {
      this.pagenumber = this.total_page;
      this.start = this.pageCount - this.page_limit;
    }
    if (this.start < 0) {
      this.start = 0;
    }

    if (this.active_tab == 'All') {
      this.filter_data.status = this.active_tab;
      this.filter_data.sub_status = '';
    }
    if (this.active_tab == 'Pending') {
      this.filter_data.status = this.active_tab;
      this.filter_data.sub_status = 'Not_Assigned';
    }

    if (this.active_tab == 'Cancel') {
      this.filter_data.status = this.active_tab;
      this.filter_data.sub_status = '';
    }

    if (this.active_tab == 'Closed') {
      this.filter_data.status = this.active_tab;
      this.filter_data.sub_status = 'Closed_By_Service';
    }

    if (this.sub_active_tab == 'Not_Assigned') {
      this.filter_data.sub_status = this.sub_active_tab;
    }

    if (this.sub_active_tab == 'Assigned') {
      this.filter_data.sub_status = this.sub_active_tab;
    }

    if (this.sub_active_tab == 'Inspection_Complete') {
      this.filter_data.sub_status = this.sub_active_tab;
    }
    if (this.sub_active_tab == 'Replacement_Pending') {
      this.filter_data.sub_status = this.sub_active_tab;
    }
    if (this.sub_active_tab == 'Sparepart_Pending') {
      this.filter_data.sub_status = this.sub_active_tab;
    }

    if (this.sub_active_tab == 'Closed_By_Service') {
      this.filter_data.sub_status = this.sub_active_tab;
    }

    if (this.sub_active_tab == 'Closed_By_Replacement') {
      this.filter_data.sub_status = this.sub_active_tab;
    }

    if (this.sub_active_tab == 'Return_Pending') {
      this.filter_data.sub_status = this.sub_active_tab;
    }
    if (this.sub_active_tab == 'Feedback_Complete') {
      this.filter_data.sub_status = this.sub_active_tab;
    }
    this.encryptedData = this.service.payLoad ? { 'filter': this.filter_data, 'start': this.start, 'pagelimit': this.page_limit }: this.cryptoService.encryptData({ 'filter': this.filter_data, 'start': this.start, 'pagelimit': this.page_limit });

    let header = this.service.post_rqst(this.encryptedData, "ServiceTask/serviceComplaintList")

    this.loader = true;
    header.subscribe((result) => {
      if (result['statusCode'] == 200) {
        this.decryptedData = this.service.payLoad ? result : this.cryptoService.decryptData(JSON.stringify(result));
        this.complaintList = this.decryptedData['result'];
        this.pageCount = this.decryptedData['count'];
        this.tab_count = this.decryptedData['tab_count'];
        this.sub_tab_count = this.decryptedData['sub_tab_count'];
        this.scheme_active_count = this.decryptedData['scheme_active_count'];
        this.loader = false;
        if (this.complaintList.length == 0) {
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


        for (let i = 0; i < this.complaintList.length; i++) {
          if (this.complaintList[i].status == '1') {
            this.complaintList[i].newStatus = true
          }
          else if (this.complaintList[i].status == '0') {
            this.complaintList[i].newStatus = false;
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
    this.service.post_rqst(this.encryptedData, "Excel/service_complaint_list").subscribe((result => {
      this.decryptedData = this.service.payLoad ? result : this.cryptoService.decryptData(JSON.stringify(result));
      if (this.decryptedData['msg'] == true) {
        window.open(this.downurl + this.decryptedData['filename'])
        this.getComplantList('');
        this.excelLoader=false;
      } else {
      }
    }));
  }
}
