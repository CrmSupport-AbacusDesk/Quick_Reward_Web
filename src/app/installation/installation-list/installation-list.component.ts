import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { Router } from '@angular/router';
import * as moment from 'moment';
import { ToastrManager } from 'ng6-toastr-notifications';
import { DatabaseService } from 'src/_services/DatabaseService';
import { DialogComponent } from 'src/app/dialog.component';
import { sessionStorage } from 'src/app/localstorage.service';
import { ProductDetailModelComponent } from '../product-detail-model/product-detail-model.component';

@Component({
  selector: 'app-installation-list',
  templateUrl: './installation-list.component.html',
  styleUrls: ['./installation-list.component.scss']
})
export class InstallationListComponent implements OnInit {


  fabBtnValue: any = 'add';
  installationList: any = [];
  filter: any = false;
  data: any = [];
  page_limit: any;
  start: any = 0;
  count: any;
  total_page: any = 0;
  pagenumber: any = 0;
  loader: boolean = false;
  tab_active = 'all';
  active_tab: any = 'Pending';
  tab_count: any;
  scheme_active_count: any;
  filter_data: any = {};
  today_date = new Date().toISOString().slice(0, 10);
  excelLoader: boolean = false;
  pageCount: any;
  sr_no: number;
  datanotfound: boolean = false;
  downurl: any = ''

  constructor(public dialog: DialogComponent, public dialogs: MatDialog, public alert: DialogComponent, public service: DatabaseService, public rout: Router, public toast: ToastrManager, public session: sessionStorage,public dialog2: MatDialog) {
    this.downurl = service.downloadUrl
    this.page_limit = service.pageLimit;
  }

  ngOnInit() {
    this.filter_data = this.service.getData()
    if (this.filter_data.status) {
      this.active_tab = this.filter_data.status
    }
    this.getinspectionList('');
  }

  pervious() {
    this.start = this.start - this.page_limit;
    this.getinspectionList('');
  }

  nextPage() {
    this.start = this.start + this.page_limit;
    this.getinspectionList('');
  }

  refresh() {
    this.start = 0;
    this.filter_data = {};
    this.getinspectionList('');
  }

  clear() {
    this.refresh();
  }

  goToDetailHandler(id) {
    window.open(`/installation-detail/` + id);
  }
  date_format(): void {
    this.filter_data.date_created = moment(this.filter_data.date_created).format('YYYY-MM-DD');
    this.getinspectionList('');
  }
   date_format2(): void {
    this.filter_data.status_updated_date = moment(this.filter_data.status_updated_date).format('YYYY-MM-DD');
    this.getinspectionList('');
  }

  getinspectionList(data) {
    if (this.pagenumber > this.total_page) {
      this.pagenumber = this.total_page;
      this.start = this.pageCount - this.page_limit;
    }
    if (this.start < 0) {
      this.start = 0;
    }
    this.filter_data.status = this.active_tab;

    let header = this.service.post_rqst({ 'filter': this.filter_data, 'start': this.start, 'pagelimit': this.page_limit }, "ServiceTask/serviceInstallationList")

    this.loader = true;
    header.subscribe((result) => {
      if (result['statusCode'] == 200) {

        // console.log('result',result);


        this.installationList = result['result'];
        // console.log(this.installationList);
        // console.log(this.installationList['add_list']);

        this.pageCount = result['count'];
        this.tab_count = result['tab_count'];
        this.scheme_active_count = result['scheme_active_count'];
        this.loader = false;
        if (this.installationList.length == 0) {
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


        for (let i = 0; i < this.installationList.length; i++) {
          if (this.installationList[i].status == '1') {
            this.installationList[i].newStatus = true
          }
          else if (this.installationList[i].status == '0') {
            this.installationList[i].newStatus = false;
          }
        }
      }
      else {
        this.toast.errorToastr(result['statusMsg']);
        this.loader = false;
      }

    })
  }
  lastBtnValue(value) {
    this.fabBtnValue = value;
  }


  downloadExcel() {
    let header=this.service.post_rqst({ 'filter': this.filter_data }, "Excel/service_installation_list")
    this.excelLoader=true
    header.subscribe((result => {
      if (result['msg'] == true) {
        window.open(this.downurl + result['filename'])
        this.getinspectionList('');
        this.excelLoader = false;
      } else {
      }
    }));
  }

  attendancDetail(row) {
    console.log(row.add_list);

    const dialogRef = this.dialog2.open(ProductDetailModelComponent, {
      width: '800px',
        panelClass: 'cs-model',
        data: {
          row:row.add_list,
        }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result != false) {
        // this.getinspectionList('');
      }

    });
  }
}
