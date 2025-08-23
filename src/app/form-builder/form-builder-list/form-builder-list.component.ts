import { Component, OnInit } from '@angular/core';
import { DatabaseService } from 'src/_services/DatabaseService';
import { DialogComponent } from 'src/app/dialog.component';
import { ToastrManager } from 'ng6-toastr-notifications';
import { sessionStorage } from 'src/app/localstorage.service';
import { CryptoService } from 'src/_services/CryptoService';

@Component({
  selector: 'app-form-builder-list',
  templateUrl: './form-builder-list.component.html'
})
export class FormBuilderListComponent implements OnInit {
  formList: any = [];
  skLoading: boolean = false;
  data: any = {};
  datanotfound: boolean = false;
  pageCount: any;
  total_page: any;
  page_limit: any;
  pagenumber: any = 1;
  start: any = 0;
  sr_no: number;
  encryptedData: any;
  decryptedData:any;

  constructor(public service: DatabaseService, public cryptoService:CryptoService, public toast: ToastrManager, public dialog: DialogComponent, public session: sessionStorage) {
    this.page_limit = this.service.pageLimit;
    this.getData();
  }


  ngOnInit() {
  }

  pervious() {
    this.start = this.start - this.page_limit;
    this.getData();
  }

  nextPage() {
    this.start = this.start + this.page_limit;
    this.getData();
  }


  refresh() {
    this.getData();
    this.data = '';
  }

  getData() {
    this.skLoading = true;

    if (this.pagenumber > this.total_page) {
      this.pagenumber = this.total_page;
      this.start = this.pageCount - this.page_limit;
    }

    if (this.start < 0) {
      this.start = 0;
    }
    this.encryptedData = this.service.payLoad ? { 'filter': this.data, 'start': this.start, 'pagelimit': this.page_limit }: this.cryptoService.encryptData({ 'filter': this.data, 'start': this.start, 'pagelimit': this.page_limit });

    this.service.post_rqst(this.encryptedData, 'Master/formBuilderOrgListing').subscribe((result) => {
      this.decryptedData = this.service.payLoad ? result : this.cryptoService.decryptData(JSON.stringify(result));
     
      if (this.decryptedData['statusCode'] == 200) {
        this.skLoading = false;
        this.formList = this.decryptedData['data'];
        this.pageCount = this.formList.length;

        if (this.formList.length == 0) {
          this.datanotfound = true;
        } else {
          this.datanotfound = false;
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
      }
      else {
        this.toast.errorToastr(this.decryptedData['statusMsg'])
      }
    }
    )
  }


  delete(id) {
    this.dialog.delete('').then((result) => {
      if (result) {
    this.encryptedData = this.service.payLoad ? { "id": id }: this.cryptoService.encryptData({ "id": id });
        this.service.post_rqst(this.encryptedData, "Master/formBuilderOrgDelete").subscribe((result => {
      this.decryptedData = this.service.payLoad ? result : this.cryptoService.decryptData(JSON.stringify(result));
          if (this.decryptedData['statusCode'] == 200) {
            this.toast.successToastr(this.decryptedData['statusMsg']);
            this.getData();
          }
          else {
            this.toast.errorToastr(this.decryptedData['statusMsg']);
          }

        }))
      }
    })

  }


}

