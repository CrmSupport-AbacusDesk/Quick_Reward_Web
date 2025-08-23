import { Component, Inject, OnInit } from '@angular/core';
import { ProgressService } from '../progress.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { DatabaseService } from 'src/_services/DatabaseService';
import { CryptoService } from 'src/_services/CryptoService';
import { ToastrManager } from 'ng6-toastr-notifications';
import { ActivatedRoute, Router } from '@angular/router';
import { DialogComponent } from '../dialog.component';
import { DomSanitizer, SafeStyle } from '@angular/platform-browser';
import { debounceTime } from 'rxjs/operators';
import { sessionStorage } from '../localstorage.service';


@Component({
  selector: 'app-error-logs',
  templateUrl: './error-logs.component.html',
  styleUrls: ['./error-logs.component.scss']
})
export class ErrorLogsComponent implements OnInit {

  totalCount = this.progressService.getTotalCount();
  remainingCount = this.progressService.getRemainingCount();
  uploadPercent$ = this.progressService.getUploadProgress();
  uploaderActive$: any = false;
  uploader: any = false;
  upload_percent: any;
  encryptedData: any;
  modal_for: any = ''
  apiPath: any = ''
  decryptedData: any;
  total_count: any = 0;
  remaining_count: any = 0;
  excelLoader: boolean;
  errorLog: any = []
  errorLogHeader: any = {};
  downurl: any = '';
  chunkType: any = {};
  file_name: any = {};
  active_tab: any = 'Reject';
  filter_data: any = {};
  datanotofound: boolean = false;
  tab_count: any = {};
  loader: boolean = false;
  start: any = 0;
  count: any;
  total_page: any = 0;
  pagenumber: any = 0;
  pageCount: any;
  progress: number = 0;
  page_limit: any;
  sr_no: number;
  radius = 140; // Updated radius for larger circle
  circumference = 2 * Math.PI * this.radius;

  // @Inject(MAT_DIALOG_DATA) public data
  constructor(private progressService: ProgressService, private sanitizer: DomSanitizer, public session: sessionStorage, public service: DatabaseService, public cryptoService: CryptoService, public toast: ToastrManager, public ActivatedRoute: ActivatedRoute, public dialog1: DialogComponent,public router: Router) {
    this.downurl = service.uploadUrl;
    this.page_limit = service.pageLimit;
    this.modal_for = JSON.parse(localStorage.getItem('uploder_name'));
    this.file_name = JSON.parse(localStorage.getItem('api_name'));
  }





  setProgress(percent: number) {
    const offset = this.circumference - (percent / 100 * this.circumference);
    const circle = document.querySelector('.progress-ring__circle') as SVGCircleElement;
    if (circle) {
      circle.style.strokeDasharray = `${this.circumference} ${this.circumference}`;
      circle.style.strokeDashoffset = `${offset}`;
    }
  }

  ngOnInit() {

    this.uploadPercent$ = this.progressService.getUploadProgress().pipe(debounceTime(10));
    this.uploadPercent$.subscribe(percent => {
      this.setProgress(percent);
    });

    this.ActivatedRoute.params.subscribe(params => {
      this.chunkType = this.ActivatedRoute.queryParams['_value']['type'];
      // this.file_name = this.ActivatedRoute.queryParams['_value']['file_name'];
      // this.modal_for = this.ActivatedRoute.queryParams['_value']['name'];
      if (this.chunkType != 'pending' && this.modal_for) {
        this.exportLogs();
      }
    });
    this.progressService.getUploaderActive().subscribe(uploaderActive => {
      this.uploaderActive$ = uploaderActive
    });
  }

  pervious() {
    this.start = this.start - this.page_limit;
    this.exportLogs();
  }

  nextPage() {
    this.start = this.start + this.page_limit;
    this.exportLogs();
  }

  refresh() {
    this.start = 0;
    this.filter_data = {};
    this.exportLogs();
  }

  clear() {
    this.refresh();
  }

  transform(value: number): number {
    return Math.round(value);
  }

  logsDownload(APIendpoint) {

    this.loader = true;
    this.encryptedData = this.service.payLoad ? { 'data': { 'uploaderName': this.modal_for, 'type': this.modal_for }, 'status': this.active_tab } : this.cryptoService.encryptData({ 'data': { 'uploaderName': this.modal_for, 'type': this.modal_for }, 'status': this.active_tab });
    this.service.upload_rqst(this.encryptedData, APIendpoint).subscribe((result) => {
      this.decryptedData = this.service.payLoad ? result : this.cryptoService.decryptData(JSON.stringify(result));
      if (this.decryptedData['statusCode'] == 200) {
        if (this.decryptedData['code'] === 0) {
          this.logsDownload(this.decryptedData.apiPath);
        }
        if (this.decryptedData['code'] === 1) {
          this.exportLogs();
          this.toast.successToastr(this.decryptedData['statusMsg'])
        }
        this.loader = false;
      }
      else {
        this.loader = false;
        this.toast.errorToastr('Logs not downloaded: ' + this.decryptedData['statusMsg']);
      }

    }, err => {
      this.loader = false;
      this.toast.errorToastr('Something Went Wrong!... ');

    });
  }


  exportLogs() {
    if (this.pagenumber > this.total_page) {
      this.pagenumber = this.total_page;
      this.start = this.pageCount - this.page_limit;
    }
    if (this.start < 0) {
      this.start = 0;
    }
    this.loader = true;

    this.encryptedData = this.service.payLoad ? { 'data': { 'uploaderName': this.modal_for, 'type': this.modal_for }, 'status': this.active_tab, 'pagelimit': this.page_limit, 'start': this.start } : this.cryptoService.encryptData({ 'data': { 'uploaderName': this.modal_for, 'type': this.modal_for }, 'status': this.active_tab, 'pagelimit': this.page_limit, 'start': this.start });
    this.service.upload_rqst(this.encryptedData, "UploaderMaster/exportLogs").subscribe((result) => {
      this.decryptedData = this.service.payLoad ? result : this.cryptoService.decryptData(JSON.stringify(result));
      if (this.decryptedData['statusCode'] == 200) {
        this.apiPath = this.decryptedData.apiPath;
        this.errorLog = this.decryptedData.data;
        this.tab_count = this.decryptedData.tabCount;
        this.pageCount = this.decryptedData.totalCount;
        this.errorLogHeader = this.decryptedData.data[0];
        this.loader = false;
        if (this.decryptedData.page_name != '') {  
          if(this.service.producation == true){
            window.open(`/#/${this.decryptedData.page_name}`, '_blank');
          }
          else{
            window.open(`./#/${this.decryptedData.page_name}`, '_blank');
          }
        }
        if (this.errorLog.length == 0) {
          this.datanotofound = false;
        } else {
          this.datanotofound = true;
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

        for (let i = 0; i < this.errorLog.length; i++) {
          if (this.errorLog[i].status == '1') {
            this.errorLog[i].newStatus = true
          }
          else if (this.errorLog[i].status == '0') {
            this.errorLog[i].newStatus = false;
          }
        }

      }
      else {
        this.loader = false;
        this.toast.errorToastr('Logs not downloaded: ' + this.decryptedData['statusMsg']);
      }

    }, err => {
      this.loader = false;
      this.toast.errorToastr('Something Went Wrong!... ');

    });
  }



  getObjectKey() {
    return Object.keys(this.errorLogHeader)
  }

  mergeKey(data) {
    return Object.keys(data)
  }

  downloadExcel() {
    this.encryptedData = this.service.payLoad ? { 'data': { 'uploaderName': this.modal_for, 'type': this.modal_for, 'csv': 1 }, 'status': this.active_tab } : this.cryptoService.encryptData({ 'data': { 'uploaderName': this.modal_for, 'type': this.modal_for, 'csv': 1 }, 'status': this.active_tab });
    this.service.upload_rqst(this.encryptedData, "UploaderMaster/exportLogs").subscribe((result) => {
      this.decryptedData = this.service.payLoad ? result : this.cryptoService.decryptData(JSON.stringify(result));
      if (this.decryptedData['statusCode'] == 200) {
        this.progressService.setUploaderDownloadUrl(this.decryptedData['filename']);
        window.open(this.downurl + this.decryptedData['filename']);
      }
      else {
        this.toast.errorToastr('Logs not downloaded: ' + this.decryptedData['statusMsg']);
      }

    }, err => {
      this.excelLoader = false;
      this.toast.errorToastr('Something Went Wrong!... ');

    });
  }

  deleteRow(id) {
    this.dialog1.delete('delete!').then((result) => {
      if (result) {
        this.encryptedData = this.service.payLoad ? { 'data': { 'id': id } } : this.cryptoService.encryptData({ 'data': { 'id': id } });
        this.service.upload_rqst(this.encryptedData, "UploaderMaster/deleteLogs").subscribe((result) => {
          this.decryptedData = this.service.payLoad ? result : this.cryptoService.decryptData(JSON.stringify(result));
          if (this.decryptedData['statusCode'] == 200) {
            this.toast.successToastr(this.decryptedData['statusMsg']);
            this.logsDownload(this.file_name)
          }
          else {
            this.toast.errorToastr(this.decryptedData['statusMsg']);
          }
        })
      }
    });
  }

  uploadSuspectData() {
    this.logsDownload(this.apiPath);
  }



}
