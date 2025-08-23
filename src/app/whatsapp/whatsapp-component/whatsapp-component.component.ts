import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrManager } from 'ng6-toastr-notifications';
import { CryptoService } from 'src/_services/CryptoService';
import { DatabaseService } from 'src/_services/DatabaseService';
import { DialogComponent } from 'src/app/dialog.component';
import { sessionStorage } from 'src/app/localstorage.service';
import { ProgressService } from 'src/app/progress.service';
import * as moment from 'moment';


@Component({
  selector: 'app-whatsapp-component',
  templateUrl: './whatsapp-component.component.html',
  styleUrls: ['./whatsapp-component.component.scss']
})
export class WhatsappComponentComponent implements OnInit {

  sr_no: any = 0;
  pageCount: any;
  total_page: any;
  page_limit: any;
  pagenumber: any = 1;
  start: any = 0;
  encryptedData: any;
  decryptedData: any;
  filter: any = {};
  loader: boolean = false;
  ledgerList: any = [];
  templateList: any = [];
  transctionList: any = [];
  active_tab: any = 'Configuration';
  logined_user_data: any = {};
  assign_login_data: any = {};
  bal: any = {};

  constructor(public service: DatabaseService, public cryptoService: CryptoService, public rout: ActivatedRoute, public alert: DialogComponent, public toast: ToastrManager, public dialog: MatDialog, public route: Router, public session: sessionStorage, private progressService: ProgressService) {
    this.page_limit = service.pageLimit;
    this.logined_user_data = JSON.parse(localStorage.getItem('st_user'));

  }

  ngOnInit() {
    if(this.logined_user_data.organisation_data.whatsapp_enable == 1){
    this.getBal();
    if(this.active_tab == 'Configuration'){
      this.getConfigurationList(this.active_tab);
    }
    else if (this.active_tab == 'Ledger') {
      this.getLedgerList(this.active_tab);
    }else{
      this.getTransctionList(this.active_tab);
    }
  }
}

  refresh() {
    this.filter = {};
    this.getLedgerList(this.active_tab);
    this.getConfigurationList(this.active_tab);
    this.getTransctionList(this.active_tab);
  }

  pervious() {
    this.start = this.start - this.page_limit;
    this.getLedgerList(this.active_tab);
    this.getConfigurationList(this.active_tab);
    this.getTransctionList(this.active_tab);
  }

  nextPage() {
    this.start = this.start + this.page_limit;
    this.getLedgerList(this.active_tab);
    this.getConfigurationList(this.active_tab);
    this.getTransctionList(this.active_tab);
  }

  date_format(): void {
    this.filter.date_created = moment(this.filter.date_created).format('YYYY-MM-DD');
    this.getLedgerList(this.active_tab);
    this.getConfigurationList(this.active_tab);
    this.getTransctionList(this.active_tab);
  }

  getBal() {
    this.encryptedData = this.service.payLoad ? { 'filter': this.filter, 'start': this.start, 'pagelimit': this.page_limit } : this.cryptoService.encryptData({ 'filter': this.filter, 'start': this.start, 'pagelimit': this.page_limit });
    this.service.post_rqst(this.encryptedData, 'Whatsapp/getBalance').subscribe((result) => {
      this.decryptedData = this.service.payLoad ? result : this.cryptoService.decryptData(JSON.stringify(result));
      if (this.decryptedData['statusCode'] == 200) {
        this.bal = this.decryptedData['result'];
      }
      else {
        this.toast.errorToastr(this.decryptedData['statusMsg']);
      }
    }
      , error => {
      })
  }

  getLedgerList(tab) {
    this.loader = true;
    if (this.pagenumber > this.total_page) {
      this.pagenumber = this.total_page;
      this.start = this.pageCount - this.page_limit;
    }
    if (this.start < 0) {
      this.start = 0;
    }

    this.filter.status = tab;
    this.encryptedData = this.service.payLoad ? { 'filter': this.filter, 'start': this.start, 'pagelimit': this.page_limit } : this.cryptoService.encryptData({ 'filter': this.filter, 'start': this.start, 'pagelimit': this.page_limit });
    this.service.post_rqst(this.encryptedData, 'Whatsapp/transactionHistory').subscribe((result) => {
      this.decryptedData = this.service.payLoad ? result : this.cryptoService.decryptData(JSON.stringify(result));
      if (this.decryptedData['statusCode'] == 200) {
        this.ledgerList = this.decryptedData['client_ledger'];
        this.pageCount = this.decryptedData['count'];
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
        setTimeout(() => {
          this.loader = false;
        }, 700);
      }
      else {
        this.toast.errorToastr(this.decryptedData['statusMsg']);
      }
    }
      , error => {
      })
  }

  getConfigurationList(tab) {
    this.loader = true;
    if (this.pagenumber > this.total_page) {
      this.pagenumber = this.total_page;
      this.start = this.pageCount - this.page_limit;
    }
    if (this.start < 0) {
      this.start = 0;
    }

    this.filter.status = tab;
    this.encryptedData = this.service.payLoad ? { 'filter': this.filter, 'start': this.start, 'pagelimit': this.page_limit } : this.cryptoService.encryptData({ 'filter': this.filter, 'start': this.start, 'pagelimit': this.page_limit });
    this.service.post_rqst(this.encryptedData, 'Whatsapp/templateList').subscribe((result) => {
      this.decryptedData = this.service.payLoad ? result : this.cryptoService.decryptData(JSON.stringify(result));
      if (this.decryptedData['statusCode'] == 200) {
        this.templateList = this.decryptedData['result'];
        this.pageCount = this.decryptedData['count'];
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
        setTimeout(() => {
          this.loader = false;
        }, 700);
      }
      else {
        this.toast.errorToastr(this.decryptedData['statusMsg']);
      }
    }
      , error => {
      })
  }

  getTransctionList(tab) {
    this.loader = true;
    if (this.pagenumber > this.total_page) {
      this.pagenumber = this.total_page;
      this.start = this.pageCount - this.page_limit;
    }
    if (this.start < 0) {
      this.start = 0;
    }

    this.filter.status = tab;
    this.encryptedData = this.service.payLoad ? { 'filter': this.filter, 'start': this.start, 'pagelimit': this.page_limit } : this.cryptoService.encryptData({ 'filter': this.filter, 'start': this.start, 'pagelimit': this.page_limit });
    this.service.post_rqst(this.encryptedData, 'Whatsapp/transactionLog').subscribe((result) => {
      this.decryptedData = this.service.payLoad ? result : this.cryptoService.decryptData(JSON.stringify(result));
      if (this.decryptedData['statusCode'] == 200) {
        this.transctionList = this.decryptedData['result'];
        // console.log(this.transctionList);
        this.pageCount = this.decryptedData['count'];
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
        setTimeout(() => {
          this.loader = false;
        }, 700);
      }
      else {
        this.toast.errorToastr(this.decryptedData['statusMsg']);
      }
    }
      , error => {
      })
  }


  updateStatus(index, template_id, status) {
    this.alert.confirm("You Want To Change Status!").then((result) => {
      if (result) {
        this.templateList[index].status = status ? "1" : "0";
        let requestData = {
          template_id: template_id,
          status: this.templateList[index].status,
          status_changed_by_id: this.logined_user_data.data.id,
          status_changed_by_name: this.logined_user_data.data.name
        };
        this.encryptedData = this.service.payLoad ? requestData : this.cryptoService.encryptData(requestData);
        this.service.post_rqst(this.encryptedData, "Whatsapp/templateStatus")
          .subscribe(result => {
            this.decryptedData = this.service.payLoad ? result : this.cryptoService.decryptData(JSON.stringify(result));
            if (this.decryptedData['statusCode'] == 200) {
              this.toast.successToastr(this.decryptedData['statusMsg']);
              this.getConfigurationList(this.active_tab);
            } else {
              this.toast.errorToastr(this.decryptedData['statusMsg']);
            }
          });
      }
    });
  }
  
}
