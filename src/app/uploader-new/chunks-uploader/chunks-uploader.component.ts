import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrManager } from 'ng6-toastr-notifications';
import { CryptoService } from 'src/_services/CryptoService';
import { DatabaseService } from 'src/_services/DatabaseService';
import { DialogComponent } from 'src/app/dialog.component';
import { ErrorLogsComponent } from 'src/app/error-logs/error-logs.component';
import { sessionStorage } from 'src/app/localstorage.service';
import { ProgressService } from 'src/app/progress.service';
import * as moment from 'moment';

@Component({
  selector: 'app-chunks-uploader',
  templateUrl: './chunks-uploader.component.html',
  styleUrls: ['./chunks-uploader.component.scss']
})
export class ChunksUploaderComponent implements OnInit {
  url: any = ''
  excel_name: any = '';
  file: any = {};
  type: any = [];
  network_type: any;
  uploadurl: any;
  formData = new FormData();
  loader: boolean = false;
  modal_for: any = ''
  come_from: any = ''
  payment_flag = '';
  excel_data: any = [];
  excel_loader: any = false;
  userData: any;
  modal_type: any;
  userId: any;
  uploadError: boolean = false;
  uploadErrorMsg: any;
  uploadErrorMsgCount: any;
  userName: any;
  user_type: any
  excelLoader: boolean;
  savingFlag: boolean = false;
  decryptedUploadData: any;
  code: any;
  uploader: any = false;
  upload_percent: number = 0;
  totalCount: any;
  remainingCount: number = 0;
  downurl: any = '';
  usersList: any = [];
  filter: any = {};
  today_date: any = new Date();


  constructor(@Inject(MAT_DIALOG_DATA) public data, public cryptoService: CryptoService, public session: sessionStorage, public toast: ToastrManager, public service: DatabaseService, public ActivatedRoute: ActivatedRoute, public dialog: DialogComponent, public dialogRef: MatDialogRef<ChunksUploaderComponent>, private progressService: ProgressService, public rout: Router, public matDialog: MatDialog) {
    this.modal_for = data['For'];
    this.modal_type = data['modal_type'];
    this.today_date = new Date();
    this.downurl = service.uploadUrl;
    this.uploadurl = service.uploadUrl + '';
    localStorage.setItem('uploder_name', JSON.stringify(this.modal_for));
    if (this.modal_for == 'Travel Plan Daily' || this.modal_for == 'Travel Plan Monthly') {
      this.getSalesUserForReporting();
    }
  }

  ngOnInit() {
  }
  onUploadChange(evt, type) {
    this.user_type = type
    this.file = evt.target.files[0];
    this.excel_name = this.file['name'];
  }

  checkQueueRequest() {
    this.service.upload_rqst({ 'data': { 'uploaderName': this.modal_for } }, "UploaderMaster/checkQueueRequest").subscribe((result) => {
      if (result['statusCode'] == 200 && this.decryptedUploadData['code'] == 1) {
        this.modal_for=result['uploaderName']
        this.chunksFileupload(result['apiPath']);
      }
      else {
        this.logsDownload(result['apiPath']);
      }

    }, err => {
      this.excelLoader = false;
      this.toast.errorToastr('Something Went Wrong!... ');

    });

  }

  getSalesUserForReporting() {
    this.excel_loader = true;
    this.service.upload_rqst({}, 'Travel/getSalesUserForReporting').subscribe((result) => {
   
      if (result['statusCode'] == 200) {
        this.excel_loader = false;
        this.usersList = result['all_sales_user'];
      }
      else {
        this.excel_loader = false;
        this.toast.errorToastr(result['statusMsg']);
      }
    }, err => {
      this.excel_loader = false;
    })

  }

  createQueueRequest() {
    this.service.upload_rqst({ 'data': { 'uploaderName': this.modal_for } }, "UploaderMaster/createQueueRequest").subscribe((result) => {
      this.decryptedUploadData = this.service.payLoad ? result : this.cryptoService.decryptData(JSON.stringify(result));
      if (this.decryptedUploadData['statusCode'] == 200 && this.decryptedUploadData['code'] == 0) {
        this.uploadDataFunc(this.decryptedUploadData['code']);
      }
      else if(this.decryptedUploadData['statusCode'] == 200 && this.decryptedUploadData['code'] == 1){
        this.uploadDataFunc(this.decryptedUploadData['code']);
      }

      else {
        this.toast.errorToastr(this.decryptedUploadData['statusMsg']);
      }

    }, err => {
      this.excelLoader = false;
      this.toast.errorToastr('Something Went Wrong!... ');

    });

  }



  uploadDataFunc(code) {
    this.code=code
    this.progressService.getUploaderActive().subscribe(uploaderActive => {
      this.uploader = uploaderActive
    })
    if (this.uploader) {
      alert('Previous Uploading is in Progress. Please Wait !');
      return;
    }
    this.dialogRef.disableClose = true;
    this.formData.append('file', this.file, this.file.name);
    this.formData.append('uploaderName', this.modal_for);
    this.formData.append('type', this.modal_for);
    this.excel_loader = true;
    this.service.FileData(this.formData, 'UploaderMaster/validateHeaderAndRows').subscribe(result => {
        this.dialogRef.disableClose = false;
        this.formData = new FormData();
        console.log(result, 'result');
        
        if (result['statusCode'] == 200) {
          this.dialogRef.close(true);
          this.excel_loader = false;
          if (code && code == 0) {
            this.dialog.successUploader(result['statusMsg']);
          }else{
            this.totalCount = result['totalCount'];
            localStorage.setItem('api_name', JSON.stringify(result['apiPath']));
            this.chunksFileupload(result['apiPath']);
            this.rout.navigate(['/chunkuploader/0'], { queryParams: { 'type': 'pending', 'file_name': result['apiPath'], 'name': this.modal_for } });
          }
        }
        else {
          this.dialog.error(result['statusMsg']);
          this.excel_loader = '';
        }


      }, err => {
        this.toast.errorToastr('Something Went Wrong!... ');
        this.excel_loader = false;

      });
  }


  chunksFileupload(APIendpoint) {
    this.uploader = true;
    if (this.upload_percent == null) {
      this.upload_percent = 0;
    }
    this.progressService.setUploaderDownloadUrl('');
    this.service.upload_rqst({ 'data': { 'uploaderName': this.modal_for,'type': this.modal_for } }, APIendpoint).subscribe((result) => {
      if (result['statusCode'] == 200) {
        if (result['statusMsg'] && result['statusMsg'] == 'continue') {
          this.upload_percent =  (result['completeCount'] /this.totalCount)*100
          if (this.upload_percent > 100) {
            this.upload_percent = 100;
          }
          this.remainingCount = result['completeCount'];
          this.progressService.setTotalCount(this.totalCount);
          this.progressService.setRemainingCount(this.remainingCount);
          this.progressService.setUploadProgress(this.upload_percent);
          this.progressService.setUploaderActive(this.uploader);
          this.chunksFileupload(APIendpoint);
        } else {
          this.uploader = false;
          this.upload_percent = null;
          this.progressService.setUploadProgress(this.upload_percent);
          this.progressService.setUploaderActive(this.uploader);
          this.checkQueueRequest();
        }
      }
      else {
        this.toast.errorToastr(result['statusMsg']);
      }

    }, err => {
      this.excelLoader = false;
      this.toast.errorToastr('Something Went Wrong!... ');

    });
  }


  logsDownload(APIendpoint) {
    this.dialog.fileCheck("").then((result) => {
      if (result) {
        this.rout.navigate(['/chunkuploader/1'], { queryParams: { 'type': 'complete', 'file_name': APIendpoint, 'name': this.modal_for } });
      }
    });
  }



  downloadSampleFile() {

    let header = {}

    if(this.modal_for == 'Redeem Status' && this.data.redeem_type == 'Cash'){
      this.filter.redeem_type = this.data.redeem_type;
      header = 'UploaderMaster/generateExcelForRedeemRequest'
    }
    else if(this.modal_for == 'Redeem Status' && this.data.redeem_type == 'Gift'){
      this.filter.redeem_type = this.data.redeem_type;
      header = 'UploaderMaster/getSampleFilesPath'
    }
    else{
      header = 'UploaderMaster/getSampleFilesPath'
    }

    this.service.upload_rqst({ 'data': { 'uploaderName': this.modal_for,'type': this.modal_for,'filter': this.filter } }, header).subscribe((result) => {
      if (result['statusCode'] == 200) {
        window.open(this.downurl + result['filename']);
      }
      else {
        this.toast.errorToastr(result['statusMsg']);
      }
    }, err => {
      this.excelLoader = false;
      this.toast.errorToastr('Something Went Wrong!... ');

    });
  }
  downloadSampleFileTravel(head) {  
    this.excel_loader = true;
    if(this.filter.date_from){
      this.filter.date_from = moment(this.filter.date_from).format('YYYY-MM-DD');
    }
    if(this.filter.date_to){
      this.filter.date_to = moment(this.filter.date_to).format('YYYY-MM-DD');
    }
    this.service.upload_rqst({ 'filter': this.filter }, head).subscribe((result) => {
   
      
      if (result['statusCode'] == 200) {
        this.excel_loader = false;
        document.location.replace(this.downurl + 'sample_file/' + result['filename']);
      }
      else {
        this.excel_loader = false;
        this.toast.errorToastr(result['statusMsg']);
      }
    }, err => {
      this.excel_loader = false;
    })

  }

  secondaryTargetSample() {
    this.excel_loader = true;
      this.service.upload_rqst({ 'type': this.network_type }, this.data.customer_type == 'primary' ? 'Target/generateExcelForEmpPrimaryTargetupload' : "Target/generateExcelForEmpSecTargetupload").subscribe((result) => {
        if (result['statusCode'] == 200) {
          this.excel_loader = false;
          let filename
           filename= this.data.customer_type == 'primary' ? 'EmployeePrimaryTargetUpload.csv' : 'EmployeeSecondaryTargetUpload.csv'
          document.location.replace(this.uploadurl + 'sample_file/' + filename);
        }
        else {
          this.excel_loader = false;
          this.toast.errorToastr(result['statusMsg']);
        }
      }, err => {
        this.excel_loader = false;
      })
  }

  visitSample() {
    this.excel_loader = true;
    if (this.modal_type == 'visit add' && this.modal_for == 'User Visit Target') {
      this.service.upload_rqst({ 'type': this.network_type }, "Target/generateExcelForEmpvisitTargetupload").subscribe((result) => {
     
        if (result['statusCode'] == 200) {
          this.excel_loader = false;
          document.location.replace(this.uploadurl + 'sample_file/EmployeeVisitTargetUpload.csv');
        }
        else{
          this.excel_loader = false;
          this.toast.errorToastr(result['statusMsg']);
        }
      }, err => {
        this.excel_loader = false;
      })
    }
    if (this.modal_type == 'visit update' && this.modal_for == 'User Visit Target') {
      if (!this.filter.month) {
        this.toast.errorToastr("Please select month!");
        return;
      }
      if (!this.filter.year) {
        this.toast.errorToastr("Please enter year!");
        return;
      }
      if (this.filter.year.length < 4) {
        this.toast.errorToastr("Year is not valid");
        return;
      }
      this.service.upload_rqst({ 'type': this.network_type, 'month': this.filter.month, 'year': this.filter.year }, "Target/generateExcelForEmpvisitTargetupdate").subscribe((result) => {
   
        if (result['statusCode'] == 200) {
          this.excel_loader = false;
          document.location.replace(this.uploadurl + 'update_sample_file/EmployeeVisitTargetUpdate.csv');
        }
        else {
          this.excel_loader = false;
          this.toast.errorToastr(result['statusMsg']);
        }
      }, err => {
        this.excel_loader = false;
      })
    }
  }

  targetSample() {
    if (this.modal_type == 'add new' && this.modal_for == 'Distributor Target') {
      this.service.upload_rqst({ 'type': this.network_type }, "Target/generateExcelForDistributorTargetUpload").subscribe((result) => {
        if (result['statusCode'] == 200) {
          document.location.replace(this.uploadurl + 'sample_file/DistributorTargetUpload.csv');
        }
        else {
          this.toast.errorToastr(result['statusMsg']);
        }
      })
    }
    if (this.modal_type == 'update' && this.modal_for == 'Distributor Target') {

      if (!this.filter.month) {
        this.toast.errorToastr("Please select month!");
        return;
      }

      if (!this.filter.year) {
        this.toast.errorToastr("Please enter year!");
        return;
      }

      if (this.filter.year.length < 4) {
        this.toast.errorToastr("Year is not valid");
        return;
      }

      this.service.upload_rqst({ 'type': this.network_type, 'month': this.filter.month, 'year': this.filter.year }, "Target/generateExcelForDistributorTargetUpdate").subscribe((result) => {
        if (result['statusCode'] == 200) {
          document.location.replace(this.uploadurl + 'update_sample_file/DistributorTargetUpdate.csv');
        }
        else {
          this.toast.errorToastr(result['statusMsg']);
        }
      })
    }
  }
}

