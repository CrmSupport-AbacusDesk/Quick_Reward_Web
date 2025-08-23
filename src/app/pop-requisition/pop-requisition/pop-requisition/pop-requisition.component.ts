
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { Router } from '@angular/router';
import { DialogComponent } from 'src/app/dialog.component';
import { ImageModuleComponent } from 'src/app/image-module/image-module.component';
import { sessionStorage } from 'src/app/localstorage.service';
import { DatabaseService } from 'src/_services/DatabaseService';
import * as moment from 'moment';
import { ToastrManager } from 'ng6-toastr-notifications';
import { StatusModalComponent } from 'src/app/order/status-modal/status-modal.component';
import { CryptoService } from 'src/_services/CryptoService';



@Component({
  selector: 'app-pop-requisition',
  templateUrl: './pop-requisition.component.html'
})
export class PopRequisitionComponent implements OnInit {
  active_tab: any = 'Pending';
  data: any = {};
  PopData: any = [];
  result: any = [];
  datanotfound = false;
  loader: boolean = true;
  filter: any = {};

  assign_login_data: any = [];
  assign_login_data2: any = [];


  url: any;
  excel_data: any = [];
  exp_data: any = [];

  // pagination
  total_page: any;
  pageCount: any;
  tabCount: any;
  page_limit: any;
  pagenumber: any = 1;
  sr_no: number;
  start = 0;
  today: Date;
  encryptedData: any;
  decryptedData:any;


  constructor(public toast: ToastrManager, public cryptoService:CryptoService, public service: DatabaseService, public dialog: MatDialog, public dialog1: DialogComponent, public route: Router, public session: sessionStorage) {
    this.page_limit = this.service.pageLimit
    this.assign_login_data = this.session.getSession();
    this.assign_login_data = this.assign_login_data.value;
    this.assign_login_data2 = this.assign_login_data.data;
    this.today = new Date();
  }

  ngOnInit() {
    this.filter = this.service.getData()
    this.transactionData()

  }




  refresh() {
    this.filter = {};
    if (this.start < 0) {
      this.start = 0;
    }
    this.service.setData(this.filter)
    this.service.currentUserID = ''
    this.transactionData()
  }

  date_format(): void {
    this.filter.date_created = moment(this.filter.date_created).format('YYYY-MM-DD');
    this.transactionData();
  }

  pervious() {
    this.start = this.start - this.page_limit;
    this.transactionData();
  }

  nextPage() {
    this.start = this.start + this.page_limit;
    this.transactionData();
  }






  popList: any = [];
  transactionData() {
    this.loader = true;
    let count


    if (this.pagenumber > this.total_page) {
      this.pagenumber = this.total_page;
      this.start = this.pageCount - this.page_limit;
    }

    if (this.start < 0) {
      this.start = 0;
    }
    this.encryptedData = this.service.payLoad ? { 'filter': this.filter, 'status': this.active_tab }: this.cryptoService.encryptData({ 'filter': this.filter, 'status': this.active_tab });
    this.service.post_rqst(this.encryptedData, "PopGift/popRequestList").subscribe(result => {
      this.decryptedData = this.service.payLoad ? result : this.cryptoService.decryptData(JSON.stringify(result));
      if (this.decryptedData['statusCode'] == 200) {
        this.popList = this.decryptedData['data'];
        setTimeout(() => {
          this.loader = false;
        }, 500);
        if (this.popList.length == 0) {
          this.datanotfound = true;
        }
        else {
          this.datanotfound = false;
          this.loader = false;
        }
        this.loader = false;


        this.tabCount = this.decryptedData['count'];


        if (this.active_tab == 'Pending') {
          this.pageCount = this.decryptedData['count']['pending']
        }
        if (this.active_tab == 'Approved') {
          this.pageCount = this.decryptedData['count']['approved']
        }

        if (this.active_tab == 'Reject') {
          this.pageCount = this.decryptedData['count']['reject']
        }


        if (this.pagenumber > this.total_page) {
          this.pagenumber = this.total_page;
          this.start = count - this.page_limit;
        }

        else {
          this.pagenumber = Math.ceil(this.start / this.page_limit) + 1;
        }
        this.total_page = Math.ceil(this.pageCount / this.page_limit);
        this.sr_no = this.pagenumber - 1;
        this.sr_no = this.sr_no * this.page_limit;


      } else {
        this.toast.errorToastr(this.decryptedData['statusMsg']);
      }
    }, err => {
      this.loader = false;
      this.toast.errorToastr('Something went wrong');
    });

  }

  openModal(id, qty, status) {
    const dialogRef = this.dialog.open(StatusModalComponent, {
      width: '500px',
      panelClass: 'cs-modal',
      disableClose: true,
      data: {
        'delivery_from': 'pop-req',
        'id': id,
        'qty': qty,
        'status': status,

      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result == true) {
        this.transactionData();
      }
    });
  }

}

