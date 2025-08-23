import { Component, OnInit } from '@angular/core';
import { DatabaseService } from 'src/_services/DatabaseService';
import { UploadFileModalComponent } from 'src/app/upload-file-modal/upload-file-modal.component';
import { MatDialog } from '@angular/material';
import { sessionStorage } from 'src/app/localstorage.service';
import { ToastrManager } from 'ng6-toastr-notifications';
import { CryptoService } from 'src/_services/CryptoService';
import { ChunksUploaderComponent } from '../uploader-new/chunks-uploader/chunks-uploader.component';


@Component({
  selector: 'app-distributor-target',
  templateUrl: './distributor-target.component.html',
  styleUrls: ['./distributor-target.component.scss']
})
export class DistributorTargetComponent implements OnInit {
  come_from: any = ''
  exp_data: any = [];
  excel_data: any = [];
  fabBtnValue: any = 'excel';
  loader: boolean = false;
  datanotfound: boolean = false;
  sr_no: any = 0;
  pageCount: any;
  total_page: any;
  page_limit: any;
  pagenumber: any = 1;
  start: any = 0;

  value: any = {};
  distributor_list: any = [];
  assign_login_data: any = [];
  assign_login_data2: any = [];
  downurl: any;
  encryptedData:any;
  decryptedData:any;


  constructor(public service: DatabaseService,public cryptoService:CryptoService,  public toast: ToastrManager, public alrt: MatDialog, public session: sessionStorage) {
    this.page_limit = service.pageLimit;
    this.downurl = service.downloadUrl
    this.assign_login_data = this.session.getSession();
    this.assign_login_data = this.assign_login_data.value;
    this.assign_login_data2 = this.assign_login_data.data;
    this.assign_login_data = this.assign_login_data.assignModule;
    console.log(this.assign_login_data2, 'assign_login_data2');
    
    this.get_distributor_list();
  }

  ngOnInit() {
  }




  pervious() {
    this.start = this.start - this.page_limit;
    this.get_distributor_list();
  }

  nextPage() {
    this.start = this.start + this.page_limit;
    this.get_distributor_list();
  }

  lastBtnValue(value) {
    this.fabBtnValue = value;
  }
  refresh1() {
    this.value = {};
    this.get_distributor_list()
  }

  get_distributor_list() {
    if (this.pagenumber > this.total_page) {
      this.pagenumber = this.total_page;
      this.start = this.pageCount - this.page_limit;
    }

    if (this.start < 0) {
      this.start = 0;
    }

    this.loader = true;
    this.encryptedData = this.service.payLoad ? { 'user_id': this.assign_login_data2.id, 'start': this.start, 'pagelimit': this.page_limit, 'filter': this.value }: this.cryptoService.encryptData({ 'user_id': this.assign_login_data2.id, 'start': this.start, 'pagelimit': this.page_limit, 'filter': this.value });
    this.service.post_rqst(this.encryptedData, "Target/distributorsTargetList").subscribe((result => {
      this.decryptedData = this.service.payLoad ? result : this.cryptoService.decryptData(JSON.stringify(result));
      if (this.decryptedData['statusCode'] == 200) {
        this.distributor_list = this.decryptedData['target_list'];
        this.pageCount = this.decryptedData['count'];
        if (this.distributor_list.length == 0) {
          this.datanotfound = true
        } else {
          this.datanotfound = false
        }

        // for (let i = 0; i < this.distributor_list.length; i++) {
        //   this.distributor_list[i].achieve = parseFloat(this.distributor_list[i].achieve)
        //   this.distributor_list[i].achieve = this.distributor_list[i].achieve.toFixed(2)
        // }

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
        }, 200);
      }
      else {
        this.toast.errorToastr(this.decryptedData['statusMsg']);
      }


    }));
  }
  upload_excel(type) {
    const dialogRef = this.alrt.open(ChunksUploaderComponent, {
      width: '500px',
      panelClass: 'cs-modal',
      data: {
        'For': 'Distributor Target',
        'modal_type': type
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      this.get_distributor_list();

    });
  }


  exportAsXLSX(): void {
    this.loader = true;
    this.service.FileData({ 'search': this.value }, "Excel/distributors_target_list")
      .subscribe(resp => {
        if (resp['msg'] == true) {
          this.loader = false;
          window.open(this.downurl + resp['filename'])
          this.get_distributor_list();
        } else {
        }

      })


  }
}
