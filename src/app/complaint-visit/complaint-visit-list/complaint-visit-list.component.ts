import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { ActivatedRoute, Router } from '@angular/router';
import * as moment from 'moment';
import { ToastrManager } from 'ng6-toastr-notifications';
import { CryptoService } from 'src/_services/CryptoService';
import { DatabaseService } from 'src/_services/DatabaseService';
import { DialogComponent } from 'src/app/dialog.component';
import { DialogService } from 'src/app/dialog.service';
import { sessionStorage } from 'src/app/localstorage.service';
import { ExportexcelService } from 'src/app/service/exportexcel.service';

@Component({
  selector: 'app-complaint-visit-list',
  templateUrl: './complaint-visit-list.component.html',
  styleUrls: ['./complaint-visit-list.component.scss']
})
export class ComplaintVisitListComponent implements OnInit {

  fabBtnValue: any = 'add';
  complaintVisitList: any = [];
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
  today_date: Date;
  excelLoader: boolean = false;
  pageCount: any;
  sr_no: number;
  datanotofound: boolean = false;
  downurl: any = ''
  url: any;
  encryptedData: any;
  decryptedData:any;


  constructor(public session: sessionStorage, private router: Router,   public cryptoService:CryptoService, public alert: DialogComponent, public service: DatabaseService, public editdialog: DialogService, public dialog: MatDialog, public route: ActivatedRoute, public toast: ToastrManager, public excelservice: ExportexcelService, public dialog1: DialogComponent) {
    this.url = this.service.uploadUrl + 'service_task/'
    this.downurl = service.downloadUrl
    this.page_limit = service.pageLimit;
  }
  ngOnInit() {
    this.filter_data = this.service.getData()
    this.getComplaintVisitList('');
  }

  pervious() {
    this.start = this.start - this.page_limit;
    this.getComplaintVisitList('');
  }

  nextPage() {
    this.start = this.start + this.page_limit;
    this.getComplaintVisitList('');
  }

  refresh() {
    this.start = 0;
    this.filter_data = {};
    this.getComplaintVisitList('');
  }

  clear() {
    this.refresh();
  }

  goToDetailHandler(id) {
    window.open(`/customer-detail/` + id);
  }
  date_format(): void {
    this.filter_data.date_created = moment(this.filter_data.date_created).format('YYYY-MM-DD');
    this.getComplaintVisitList('');
  }
  lastBtnValue(value) {
    this.fabBtnValue = value;
  }

  getComplaintVisitList(data) {
    if (this.pagenumber > this.total_page) {
      this.pagenumber = this.total_page;
      this.start = this.pageCount - this.page_limit;
    }
    if (this.start < 0) {
      this.start = 0;
    }
    this.encryptedData = this.service.payLoad ? { 'filter': this.filter_data, 'start': this.start, 'pagelimit': this.page_limit }: this.cryptoService.encryptData({ 'filter': this.filter_data, 'start': this.start, 'pagelimit': this.page_limit });

    let header = this.service.post_rqst(this.encryptedData, "ServiceTask/complaintVisitList")

    this.loader = true;
    header.subscribe((result) => {
    this.decryptedData = this.service.payLoad ? result : this.cryptoService.decryptData(JSON.stringify(result));
      if (this.decryptedData['statusCode'] == 200) {
        this.complaintVisitList = this.decryptedData['result'];
        this.pageCount = this.decryptedData['count'];
        this.scheme_active_count = this.decryptedData['scheme_active_count'];
        this.loader = false;
        if (this.complaintVisitList.length == 0) {
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

        for (let i = 0; i < this.complaintVisitList.length; i++) {
          if (this.complaintVisitList[i].status == '1') {
            this.complaintVisitList[i].newStatus = true
          }
          else if (this.complaintVisitList[i].status == '0') {
            this.complaintVisitList[i].newStatus = false;
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
  endVisit(id) {
    this.dialog1.visit('visit!').then((result) => {
      if (result) {
        this.encryptedData = this.service.payLoad ? { 'visit_id': id }: this.cryptoService.encryptData({ 'visit_id': id });
        this.service.post_rqst(this.encryptedData, "ServiceTask/stopComplaintVisit").subscribe((result) => {
          this.decryptedData = this.service.payLoad ? result : this.cryptoService.decryptData(JSON.stringify(result));
          if (this.decryptedData['statusCode'] == 200) {
            this.toast.successToastr(this.decryptedData['statusMsg']);
            this.getComplaintVisitList('')
          }
          else {
            this.toast.errorToastr(this.decryptedData['statusMsg']);
          }
        })
      }
    });
  }

  downloadExcel() {
    this.excelLoader=true;
    this.encryptedData = this.service.payLoad ? { 'filter': this.filter_data }: this.cryptoService.encryptData({ 'filter': this.filter_data });
    this.service.post_rqst(this.encryptedData, "Excel/complaint_visit_list").subscribe((result => {
    this.decryptedData = this.service.payLoad ? result : this.cryptoService.decryptData(JSON.stringify(result));
      if (this.decryptedData['msg'] == true) {
        window.open(this.downurl + this.decryptedData['filename'])
        this.getComplaintVisitList('');
        this.excelLoader=false;
      } else {
      }
    }));
  }
}
