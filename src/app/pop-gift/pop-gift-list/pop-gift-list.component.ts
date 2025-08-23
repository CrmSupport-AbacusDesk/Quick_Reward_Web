import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { Router } from '@angular/router';
import { DialogComponent } from 'src/app/dialog.component';
import { ImageModuleComponent } from 'src/app/image-module/image-module.component';
import { sessionStorage } from 'src/app/localstorage.service';
import { DatabaseService } from 'src/_services/DatabaseService';
import { PopGiftAddComponent } from '../pop-gift-add/pop-gift-add.component';
import { PopGiftIssueModalComponent } from '../pop-gift-issue-modal/pop-gift-issue-modal.component';
import * as moment from 'moment';
import { ToastrManager } from 'ng6-toastr-notifications';
import { CryptoService } from 'src/_services/CryptoService';



@Component({
  selector: 'app-pop-gift-list',
  templateUrl: './pop-gift-list.component.html'
})
export class PopGiftListComponent implements OnInit {
  transactionType: any = 'Pop Gift';
  fabBtnValue: any = 'add';
  skelton: any = {}
  data: any = {};
  PopData: any = [];
  result: any = [];
  datanotfound = false;
  loader: boolean = true;
  filter: any = {};

  assign_login_data: any = [];
  assign_login_data2: any = [];

  view_edit: boolean = true;
  view_add: boolean = true;
  view_delete: boolean = true;
  url: any;
  excel_data: any = [];
  exp_data: any = [];

  // pagination
  total_page: any;
  pageCount: any;
  page_limit: any;
  pagenumber: any = 1;
  sr_no: number;
  start = 0;


  constructor(public toast: ToastrManager, public cryptoService:CryptoService, public service: DatabaseService, public dialog: MatDialog, public dialog1: DialogComponent, public route: Router, public session: sessionStorage) {
    this.skelton = new Array(10);
    this.page_limit = this.service.pageLimit
    this.assign_login_data = this.session.getSession();
    this.assign_login_data = this.assign_login_data.value;
    this.assign_login_data2 = this.assign_login_data.data;
    this.url = this.service.uploadUrl + 'pop_gift/';
  }

  ngOnInit() {
    this.filter = this.service.getData()
    if (this.filter.transaction_type) {
      this.transactionType = this.filter.transaction_type
    }
    this.gift_list(this.transactionType);

  }

  lastBtnValue(value) {
    this.fabBtnValue = value;
  }


  refresh(transactionType) {
    if (this.start < 0) {
      this.start = 0;
    }
    this.transactionData(transactionType)
    this.filter = {};
    this.service.setData(this.filter)
    this.service.currentUserID = ''
    this.gift_list(transactionType);
  }

  date_format(): void {
    this.filter.date_created = moment(this.filter.date_created).format('YYYY-MM-DD');
    this.transactionData(this.transactionType);
  }

  pervious(type) {
    this.start = this.start - this.page_limit;
    if (type == 'Pop Gift') {
      this.gift_list(this.transactionType);
    }
    else {
      this.transactionData(this.transactionType)
    }
  }

  nextPage(type) {
    this.start = this.start + this.page_limit;
    if (type == 'Pop Gift') {
      this.gift_list(this.transactionType);
    }
    else {
      this.transactionData(this.transactionType)
    }
  }


  gift_list(type) {
    if (this.pagenumber > this.total_page) {
      this.pagenumber = this.total_page;
      this.start = this.pageCount - this.page_limit;
    }
    if (this.start < 0) {
      this.start = 0;
    }

    this.loader = true;
    this.filter.transaction_type = type;
    this.service.post_rqst({ 'user_id': this.assign_login_data2.id, 'transaction_type': type, 'filter': this.filter, 'pagelimit': this.page_limit, 'start': this.start }, "PopGift/popGiftList").subscribe(result => {
      if (result['statusCode'] == 200) {
        this.PopData = result['result'];
        this.PopData.forEach(item => item['encrypt_id'] = this.cryptoService.encryptId(item['id']));
        this.pageCount = result['count'];

        if (this.PopData.length == 0) {
          this.datanotfound = true;
        }
        else {
          this.datanotfound = false;
        }
        this.loader = false;



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

      } else {
        this.toast.errorToastr(result['statusMsg']);
      }
    }, err => {
      this.loader = false;
      this.toast.errorToastr('Something went wrong');
    })
  }



  transaction_list: any = [];
  transactionData(type) {
    this.loader = true;
    this.service.post_rqst({ 'filter': this.filter, 'transaction_type': type }, "PopGift/popGiftTransactionLogList").subscribe(result => {
      if (result['statusCode'] == 200) {
        this.transaction_list = result['result'];
        setTimeout(() => {
          this.loader = false;
        }, 500);
        if (this.transaction_list.length == 0) {
          this.datanotfound = true;

        }
        else {
          this.datanotfound = false;
          this.loader = false;

        }
        this.loader = false;
      } else {
        this.toast.errorToastr(result['statusMsg']);
      }
    }, err => {
      this.loader = false;
      this.toast.errorToastr('Something went wrong');
    })

  }

  popModal(type, id, user_id,) {
    const dialogRef = this.dialog.open(PopGiftIssueModalComponent, {
      width: '768px',
      panelClass: 'cs-modal',
      disableClose: true,
      data: {
        type, id, user_id,
      }
    });
    dialogRef.afterClosed().subscribe(result => {

      if (result != false) {
        this.gift_list(this.transactionType);
      }
    });
  }


  deleteGift(id) {
    this.dialog1.delete('POP Gift Data!').then((res) => {
      if (res) {
        this.loader = true;
        this.service.post_rqst({ "id": id }, "PopGift/deletePopGift").subscribe(result => {
          if (result['statusCode'] == 200) {
            this.loader = false;
            this.toast.successToastr(result['statusMsg']);
            this.gift_list(this.transactionType);
          } else {
            this.loader = false;
            this.toast.errorToastr(result['statusMsg']);
          }
        }, err => {
          this.loader = false;
          this.toast.errorToastr('Something went wrong');
        })
      }
    })

  }

  edit(id) {
    this.route.navigate(["/pop-gift-add/" + id])
  }

  goToImage(image) {
    const dialogRef = this.dialog.open(ImageModuleComponent, {
      panelClass: 'Image-modal',
      data: {
        'image': image,
        'type': 'base64'
      }
    });
    dialogRef.afterClosed().subscribe(result => {
    });

  }
  downloadExcel() {
    this.service.post_rqst({ 'filter': this.transactionType }, "PopGift/popGiftList").subscribe((result => {
      this.PopData =  this.result['result'];
      for (let i = 0; i < this.PopData.length; i++) {
        this.excel_data.push({
          'Sr No.': i + 1,
          'Date': this.PopData[i].date_created,
          'Item Name': this.PopData[i].item_name,
          'Stock QTY.': this.PopData[i].qty_stock,
          'Rate': this.PopData[i].rate,
          'Total Amount': this.PopData[i].amount,
          'Employee Stock': this.PopData[i].executive_qty,
          'Distributor Stock': this.PopData[i].distributor_qty,
        });
      }
      this.service.exportAsExcelFile(this.excel_data, this.transactionType);
      this.excel_data = [];
      this.gift_list(this.transactionType);
    }));
  }

  downloadExcel1() {
    this.service.post_rqst({ 'transaction_type': this.transactionType }, "PopGift/popGiftTransactionLogList").subscribe((result => {
      this.transaction_list = result['result'];
      for (let i = 0; i < this.transaction_list.length; i++) {
        this.excel_data.push({
          'Sr No.': i + 1,
          'Date': this.transaction_list[i].date_created,
          'Item Name': this.transaction_list[i].pop_item_name,
          'Transfer Stock': this.transaction_list[i].stock_qty,
          'Remaining Stock': this.transaction_list[i].remaining_stock,
          'Issue Date': this.transaction_list[i].date_created,
          'User Type': this.transaction_list[i].transfer_to_type,
          'User Details': this.transaction_list[i].transfer_to_name,
          'Remark': this.transaction_list[i].remarks,
        });
      }
      this.service.exportAsExcelFile(this.excel_data, this.transactionType);
      this.excel_data = [];
      this.transactionData(this.transactionType);
    }));
  }
}
