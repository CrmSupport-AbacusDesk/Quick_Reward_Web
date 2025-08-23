import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import * as moment from 'moment';
import { DialogComponent } from 'src/app/dialog.component';
import { DatabaseService } from 'src/_services/DatabaseService';
import { MatDialog, PageEvent } from '@angular/material';
import { UploadFileModalComponent } from 'src/app/upload-file-modal/upload-file-modal.component';
import { sessionStorage } from 'src/app/localstorage.service';
import { ToastrManager } from 'ng6-toastr-notifications';
import { CryptoService } from 'src/_services/CryptoService';

@Component({
  selector: 'app-customer-category-list',
  templateUrl: './customer-category-list.component.html'
})
export class CustomerCategoryListComponent implements OnInit {
  filter: any = {};
  categoryList: any = [];
  loader: boolean = false;
  page_limit: any;
  start: any = 0;
  pagenumber: any = 1;
  assign_login_data: any = {};
  login_data: any = {};
  total_page: any;
  pageCount: any;
  sr_no: any = 0;
  fabBtnValue: any = 'add';
  datanotfound: boolean = true;
  downurl: any = ''
  today_date: Date;

  constructor(public dialog: MatDialog, public cryptoService:CryptoService, public toast: ToastrManager, public service: DatabaseService, public alert: DialogComponent, private router: Router, public session: sessionStorage) {
    this.page_limit = service.pageLimit;
    this.downurl = service.downloadUrl
    this.assign_login_data = this.session.getSession();
    this.login_data = this.assign_login_data.value.data;
    this.getCustomerCategory();
    this.today_date = new Date();

  }

  ngOnInit() {
  }





  upload_excel(type) {
    const dialogRef = this.dialog.open(UploadFileModalComponent, {
      width: '500px',
      panelClass: 'cs-modal',
      disableClose: true,
      data: {
        'from': 'customerCategoryList',
        'modal_type': type
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      this.getCustomerCategory();

    });
  }


  inputValue(value) {
    if (value > this.total_page) {
      this.start = this.total_page;
    }
    else if (value == '' || value <= 0) {
      this.start = 0;
    }
    else {
      this.start = (this.pagenumber * this.page_limit) - this.page_limit;
    }

    this.getCustomerCategory()
  }

  pervious() {
    this.start = this.start - this.page_limit;
    this.getCustomerCategory();
  }

  nextPage() {
    this.start = this.start + this.page_limit;
    this.getCustomerCategory();
  }


  date_format(): void {
    this.filter.date_created = moment(this.filter.date_created).format('YYYY-MM-DD');
    this.getCustomerCategory();
  }


  getCustomerCategory() {
    this.loader = true;
    if (this.pagenumber > this.total_page) {
      this.pagenumber = this.total_page;
      this.start = this.pageCount - this.page_limit;
    }
    if (this.start < 0) {
      this.start = 0;
    }
    this.service.post_rqst({ 'filter': this.filter, 'start': this.start, 'pagelimit': this.page_limit }, "Master/customerCategoryMasterList").subscribe((result => {
      if (result['statusCode'] == 200) {
        this.categoryList = result['customer_category_list'];
        this.pageCount = result['count'];
        if (this.categoryList.length == 0) {
          this.datanotfound = false;
        } else {
          this.datanotfound = true;
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
      }
      else {
        this.toast.errorToastr(result['statusMsg']);
      }
    }));

  }


  delete(id) {
    this.alert.delete('Customer Category !').then((result) => {
      if (result) {
    this.service.post_rqst({ 'id': id }, "Master/deleteCustomerCategory").subscribe((result) => {
          if (result['statusCode'] == 200) {
            this.toast.successToastr(result['statusMsg']);
            this.getCustomerCategory()
          }
          else {
            this.toast.errorToastr(result['statusMsg']);
          }
        })
      }
    });


  }

  refresh() {
    this.filter = {};
    this.getCustomerCategory();
  }

  downloadExcel() {
    this.service.post_rqst({ 'filter': this.filter }, "Excel/customer_category_master_list_for_export").subscribe((result => {
      if (result['msg'] == true) {
        window.open(this.downurl + result['filename'])
        this.getCustomerCategory();
      } else {
      }
    }));
  }


}
