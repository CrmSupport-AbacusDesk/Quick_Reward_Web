import { Component, OnInit, Injectable, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { MatProgressBarModule } from '@angular/material'
// import { DialogComponent } from 'src/app/dialog/dialog.component';
import { DatabaseService } from 'src/_services/DatabaseService';
import { DialogComponent } from 'src/app/dialog.component';
// import { PearlService } from '';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrManager } from 'ng6-toastr-notifications';
import { CryptoService } from 'src/_services/CryptoService';

@Component({
  selector: 'app-upload-file-modal',
  templateUrl: './upload-file-modal.component.html'
})
export class UploadFileModalComponent implements OnInit {

  url: any = ''
  excel_name: any = '';
  file: any = {};
  type: any = [];
  network_type: any;
  uploadurl: any;
  formData = new FormData();
  loader: boolean = false;
  come_from: any = ''
  payment_flag = '';
  excel_data: any = [];
  download_sample_area_excel_data: any = [];
  excel_loader: any = false;
  userData: any;
  modal_type: any;
  usersList: any = [];
  filter_data: any;
  userId: any;
  uploadError: boolean = false;
  uploadErrorMsg: any;
  uploadErrorMsgCount: any;
  userName: any;
  user_type: any
  excelLoader: boolean;
  segmentList: any;
  filter: any = {};
  savingFlag: boolean = false;
  view_tab: any = 'customer_network_visit';
  encryptedData: any;
  decryptedData: any;


  constructor(@Inject(MAT_DIALOG_DATA) public data, public cryptoService: CryptoService, public toast: ToastrManager, public service: DatabaseService, public ActivatedRoute: ActivatedRoute, public dialog: DialogComponent, public dialogRef: MatDialogRef<UploadFileModalComponent>) {
    this.uploadurl = service.uploadUrl + '';
    this.url = this.service.uploadUrl;
    this.come_from = data['from'];
    this.modal_type = data['modal_type'];
    this.network_type = data['type'];
    this.filter_data = data['filter_data']
    if (data['type']) {
      this.type = data['type']
    }

    if (this.come_from == 'Travel Plan Daily' || this.come_from == 'Travel Plan Monthly') {
      this.getSalesUserForReporting();
    }
    this.userData = JSON.parse(localStorage.getItem('st_user'));
    this.userId = this.userData['data']['id'];
    this.userName = this.userData['data']['name'];
  }
  ngOnInit() {
  }
  onUploadChange(evt, type) {
    this.user_type = type
    this.file = evt.target.files[0];
    this.excel_name = this.file['name'];
  }





  // Segment Update Excel Update Sample file start
  downloadUpdateSample() {
    this.service.post_rqst({}, "Master/segmentUpdateDataDownload").subscribe((result) => {
      this.decryptedData = this.service.payLoad ? result : this.cryptoService.decryptData(JSON.stringify(result));

      if (this.decryptedData['statusCode'] == 200) {
        document.location.replace(this.uploadurl + 'update_sample_file/updateCategory.csv');
        this.toast.successToastr(this.decryptedData['statusMsg']);
      }
      else {
        this.toast.errorToastr(this.decryptedData['statusMsg']);
      }
    })
  }

  // Segment Update Excel Update Sample file end


  upload_user_data_excel() {
    this.dialogRef.disableClose = true;
    this.formData.append('category', this.file, this.file.name);
    this.excel_loader = true;
    this.service.FileData(this.formData, 'Import/import_visiting_target_excel')
      .subscribe(result => {
        this.decryptedData = this.service.payLoad ? result : this.cryptoService.decryptData(JSON.stringify(result));

        this.dialogRef.disableClose = false;
        this.formData = new FormData();
        if (this.decryptedData['msg'] == 'Data Imported successfully') {
          this.dialog.success("Excel Uploaded", " Successfully");
          this.dialogRef.close(true);
          setTimeout(() => {
            this.excel_loader = false;
          }, 700);
          return;
        }
        else {
          setTimeout(() => {
            this.excel_loader = false;
          }, 700);
          this.dialog.error(this.decryptedData['msg']);
          return;
        }

      }, err => { });
  }


  userUpdateSample() {
    this.excel_loader = true;
    this.service.post_rqst({}, "Master/generateExcelForUpdateUser").subscribe((result) => {
      this.decryptedData = this.service.payLoad ? result : this.cryptoService.decryptData(JSON.stringify(result));

      if (this.decryptedData['statusCode'] == 200) {
        this.excel_loader = false;
        document.location.replace(this.uploadurl + 'update_sample_file/updateUser.csv');
        this.toast.successToastr(this.decryptedData['statusMsg']);
      }
      else {
        this.excel_loader = false;
        this.toast.errorToastr(this.decryptedData['statusMsg']);
      }
    }, err => {
      this.excel_loader = false;
    })

  }
  download_sample_excel() {
    this.excel_loader = true;
    this.service.post_rqst({}, "Master/generateExcelForUser").subscribe((result) => {
      this.decryptedData = this.service.payLoad ? result : this.cryptoService.decryptData(JSON.stringify(result));
      if (this.decryptedData['statusCode'] == 200) {
        this.excel_loader = false;
        document.location.replace(this.uploadurl + 'update_sample_file/User.csv');
        this.toast.successToastr(this.decryptedData['statusMsg']);
      }
      else {
        this.excel_loader = false;
        this.toast.errorToastr(this.decryptedData['statusMsg']);
      }
    }, err => {
      this.excel_loader = false;
    })

  }


  upload_salesUser_data_excel(type) {
    this.formData.append('category', this.file, this.file.name);
    this.formData.append('created_by_id', this.userId)
    this.formData.append('created_by_name', this.userName)
    this.dialogRef.disableClose = true;
    this.excel_loader = true;
    let header
    if (type == 'insert') {
      header = this.service.FileData(this.formData, 'Master/uploadUserInBulkByCsv');
    }
    else {
      header = this.service.FileData(this.formData, 'Master/updateUserInBulkByCsv');
    }

    header.subscribe(result => {
      this.decryptedData = this.service.payLoad ? result : this.cryptoService.decryptData(JSON.stringify(result));

      this.dialogRef.disableClose = false;
      this.formData = new FormData();
      if (this.decryptedData['statusCode'] == 200) {
        this.toast.successToastr(this.decryptedData['statusMsg']);
        this.excel_loader = false;
        this.dialogRef.close(true);
      }
      else {
        this.toast.errorToastr(this.decryptedData['statusMsg'])
        this.excel_loader = false;
      }
    }, err => { });
  }


  upload_segment_data_excel() {
    this.dialogRef.disableClose = true;
    this.formData.append('category', this.file, this.file.name);
    this.formData.append('created_by_id', this.userId)
    this.formData.append('created_by_name', this.userName)
    this.formData.append('operation_type', this.modal_type)
    this.excel_loader = true
    this.service.FileData(this.formData, 'Master/uploadSegmentInBulkByCsv').subscribe(result => {
      this.decryptedData = this.service.payLoad ? result : this.cryptoService.decryptData(JSON.stringify(result));
      this.dialogRef.disableClose = false;
      this.formData = new FormData();
      if (this.decryptedData['statusCode'] == 200) {
        if (this.decryptedData['statusMsg'] == 'sucess') {
          this.toast.successToastr(this.decryptedData['statusMsg']);
          this.dialogRef.close(true);
          this.excel_loader = false;
        }
        else {
          this.excel_loader = false;
          this.uploadError = true;
          this.uploadErrorMsg = this.decryptedData['statusMsg'];
          this.uploadErrorMsgCount = this.decryptedData['respose_count'];
        }

      }
      else {
        this.excel_loader = false;
        this.toast.errorToastr(this.decryptedData['statusMsg']);
      }

    }, err => { });
  }

  upload_customer_data_excel() {
    this.dialogRef.disableClose = true;
    this.formData.append('category', this.file, this.file.name);
    this.formData.append('created_by_id', this.userId)
    this.formData.append('created_by_name', this.userName)
    this.formData.append('operation_type', this.modal_type)
    this.excel_loader = true;
    this.service.FileData(this.formData, 'demoapi/demoapi').subscribe(result => {
      this.decryptedData = this.service.payLoad ? result : this.cryptoService.decryptData(JSON.stringify(result));
      this.dialogRef.disableClose = false;
      this.formData = new FormData();
      if (this.decryptedData['msg'] == 'Data Imported successfully') {
        this.dialog.success("Excel Uploaded", " Successfully");
        this.dialogRef.close(true);
        setTimeout(() => {
          this.excel_loader = false;
        }, 700);
        return;
      }
      else {
        setTimeout(() => {
          this.excel_loader = false;
        }, 700);
        this.dialog.error(this.decryptedData['msg']);
        return;
      }

    }, err => { });
  }


  distributorSample() {
    if (this.network_type == 1) {
      document.location.replace(this.uploadurl + 'sample_file/DistributorUpload.csv');
    }
    else if (this.network_type == 3) {
      document.location.replace(this.uploadurl + 'sample_file/RetailerUpload.csv');
    }

    else {
      document.location.replace(this.uploadurl + 'sample_file/DirectDealerUpload.csv');
    }
  }

  otherSample(type) {
    let CsvName
    if (this.network_type == '1') {
      CsvName = 'Distributor'
    }
    else if (this.network_type == '3') {
      CsvName = 'Retailer'
    }
    else {
      CsvName = 'DirectDealer'
    }
    this.excel_loader = true;
    this.encryptedData = this.service.payLoad ? { 'type': this.network_type, 'type_name': CsvName } : this.cryptoService.encryptData({ 'type': this.network_type, 'type_name': CsvName });
    if (type == 'geo_location') {
      this.service.post_rqst(this.encryptedData, "CustomerNetwork/generateExcelForLatLngUpdate").subscribe((result) => {
        this.decryptedData = this.service.payLoad ? result : this.cryptoService.decryptData(JSON.stringify(result));

        if (this.decryptedData['statusCode'] == 200) {
          this.excel_loader = false;
          document.location.replace(this.uploadurl + 'update_sample_file/' + CsvName + 'geoLocationUpdate.csv');
        }
      }, err => {
        this.excel_loader = false;
      })
    }
    else if (type == 'credit_limit') {
      this.service.post_rqst(this.encryptedData, "CustomerNetwork/generateExcelForCreditLimitUpdate").subscribe((result) => {
        this.decryptedData = this.service.payLoad ? result : this.cryptoService.decryptData(JSON.stringify(result));
        if (this.decryptedData['statusCode'] == 200) {
          this.excel_loader = false;
          document.location.replace(this.uploadurl + 'update_sample_file/' + CsvName + 'CreditLimitUpdate.csv');
        }
      }, err => {
        this.excel_loader = false;
      })
    }
    else {
      this.service.post_rqst(this.encryptedData, "CustomerNetwork/generateExcelForbasicUpdate").subscribe((result) => {
        this.decryptedData = this.service.payLoad ? result : this.cryptoService.decryptData(JSON.stringify(result));
        if (this.decryptedData['statusCode'] == 200) {
          this.excel_loader = false;
          window.open(this.uploadurl + 'updateSampleFile/' + this.decryptedData['response']);
        }
        else {
          this.toast.errorToastr(this.decryptedData['statusMsg']);
        }
      }, err => {
        this.excel_loader = false;
      })
    }

  }



  upload_distribution_excel(type) {
    this.dialogRef.disableClose = true;
    this.formData.append('category', this.file, this.file.name);
    this.formData.append('created_by_id', this.userId);
    this.formData.append('created_by_name', this.userName);
    this.formData.append('type', this.type);

    this.excel_loader = true;
    let header
    if ((this.network_type == 1 || this.network_type == 7) && type == 'credit_limit') {
      header = this.service.FileData(this.formData, 'CustomerNetwork/updateCreditLimit')
    }
    else if ((this.network_type == 1 || this.network_type == 3 || this.network_type == 7) && type == 'geo_location') {
      header = this.service.FileData(this.formData, 'CustomerNetwork/updateGeoLocation')
    }
    else if (type == 'update') {
      header = this.service.FileData(this.formData, 'CustomerNetwork/updateCustomerBasicDetails')
    }
    else if (this.network_type == 3 && type == 'insert') {
      header = this.service.FileData(this.formData, 'CustomerNetwork/importRetailerExcel')
    }

    else {
      header = this.service.FileData(this.formData, 'CustomerNetwork/importDistributorExcel')
    }
    header.subscribe(result => {
      this.decryptedData = this.service.payLoad ? result : this.cryptoService.decryptData(JSON.stringify(result));

      this.dialogRef.disableClose = false;
      this.formData = new FormData();
      if (this.decryptedData['statusCode'] == 200) {
        this.toast.successToastr(this.decryptedData['statusMsg']);
        this.dialogRef.close(true);
        this.excel_loader = false;
        this.service.dr_list();
        return;
      }
      else if (this.decryptedData['response'].length) {
        this.uploadError = true;
        this.uploadErrorMsg = this.decryptedData['response'];
        this.uploadErrorMsgCount = this.decryptedData['resCount'];
        console.log(this.uploadErrorMsgCount);

        this.excel_loader = false;
      }
      else {
        this.uploadError = true;
        this.uploadErrorMsg = this.decryptedData['response'];
        this.uploadErrorMsgCount = this.decryptedData['resCount'];
        console.log(this.uploadErrorMsgCount);

        this.excel_loader = false;
        this.dialog.error(this.decryptedData['statusMsg']);
        setTimeout(() => {
          this.excel_loader = '';
        }, 700);
      }
    }, err => {
      this.toast.errorToastr('Something went wrong');
      this.excel_loader = false;
    });
  }


  upload_lead_excel() {
    this.dialogRef.disableClose = true;
    this.formData.append('category', this.file, this.file.name);
    this.formData.append('id', this.userId);
    this.formData.append('created_by_id', this.userId)
    this.formData.append('created_by_name', this.userName)
    this.excel_loader = true;
    this.service.FileData(this.formData, 'Enquiry/add_enquiry_by_csv')
      .subscribe(result => {
        this.decryptedData = this.service.payLoad ? result : this.cryptoService.decryptData(JSON.stringify(result));

        this.dialogRef.disableClose = false;
        this.formData = new FormData();
        if (this.decryptedData['msg'] == 'Data Imported successfully') {
          this.dialog.success("Excel Uploaded", " Successfully");
          this.dialogRef.close(true);
          setTimeout(() => {
            this.excel_loader = false;
          }, 700);
          return;
        }
        else {
          setTimeout(() => {
            this.excel_loader = false;
          }, 700);
          this.dialog.error(this.decryptedData['msg']);
          return;
        }

      }, err => { });
  }
  upload_travel_excel() {
    this.dialogRef.disableClose = true;
    this.formData.append('file', this.file, this.file.name);
    this.formData.append('id', this.userId);
    this.excel_loader = true;
    this.service.FileData(this.formData, 'Travel/import_travel_excel')
      .subscribe(result => {
        this.decryptedData = this.service.payLoad ? result : this.cryptoService.decryptData(JSON.stringify(result));


        this.dialogRef.disableClose = false;
        this.formData = new FormData();
        if (this.decryptedData['msg'] == 'Data Imported successfully') {
          this.dialog.success("Excel Uploaded", " Successfully");
          this.dialogRef.close(true);
          setTimeout(() => {
            this.excel_loader = false;
          }, 700);
          return;
        }
        else {
          setTimeout(() => {
            this.excel_loader = false;

          }, 700);
          this.dialog.error(this.decryptedData['msg']);
          return;
        }

      }, err => { });
  }
  upload_beat_excel() {
    this.dialogRef.disableClose = true;
    this.formData.append('file', this.file, this.file.name);
    this.formData.append('id', this.userId);
    this.excel_loader = true;
    this.service.FileData(this.formData, 'Import/importBeatCode_excel')
      .subscribe(result => {
        this.decryptedData = this.service.payLoad ? result : this.cryptoService.decryptData(JSON.stringify(result));

        this.dialogRef.disableClose = false;
        this.formData = new FormData();
        if (this.decryptedData['msg'] == 'Data Imported successfully') {
          this.dialog.success("Excel Uploaded", " Successfully");
          this.dialogRef.close(true);
          setTimeout(() => {
            this.excel_loader = false;
          }, 700);
          return;
        }
        else {
          setTimeout(() => {
            this.excel_loader = false;
          }, 700);
          this.dialog.error(this.decryptedData['msg']);
          return;
        }

      }, err => { });
  }





  targetSample() {
    if (this.modal_type == 'add new' && this.come_from == 'distributor_target') {
      this.encryptedData = this.service.payLoad ? { 'type': this.network_type } : this.cryptoService.encryptData({ 'type': this.network_type });
      this.service.post_rqst(this.encryptedData, "Target/generateExcelForDistributorTargetUpload").subscribe((result) => {
        this.decryptedData = this.service.payLoad ? result : this.cryptoService.decryptData(JSON.stringify(result));
        if (this.decryptedData['statusCode'] == 200) {
          document.location.replace(this.uploadurl + 'sample_file/DistributorTargetUpload.csv');
        }
        else {
          this.toast.errorToastr(this.decryptedData['statusMsg']);
        }
      })
    }
    if (this.modal_type == 'update' && this.come_from == 'distributor_target') {

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

      this.encryptedData = this.service.payLoad ? { 'type': this.network_type, 'month': this.filter.month, 'year': this.filter.year } : this.cryptoService.encryptData({ 'type': this.network_type, 'month': this.filter.month, 'year': this.filter.year });
      this.service.post_rqst(this.encryptedData, "Target/generateExcelForDistributorTargetUpdate").subscribe((result) => {
        this.decryptedData = this.service.payLoad ? result : this.cryptoService.decryptData(JSON.stringify(result));
        if (this.decryptedData['statusCode'] == 200) {
          document.location.replace(this.uploadurl + 'update_sample_file/DistributorTargetUpdate.csv');
        }
        else {
          this.toast.errorToastr(this.decryptedData['statusMsg']);
        }
      })
    }
  }


  upload_distributor_data_excel() {
    this.dialogRef.disableClose = true;
    this.formData.append('category', this.file, this.file.name);
    this.excel_loader = true;

    let header

    if (this.modal_type == 'add new') {
      header = this.service.FileData(this.formData, 'Target/importDistributorTargetexcel')
    }
    else {
      header = this.service.FileData(this.formData, 'Target/importDistributorTargetexcel')
    }



    header.subscribe(result => {
      this.decryptedData = this.service.payLoad ? result : this.cryptoService.decryptData(JSON.stringify(result));

      this.dialogRef.disableClose = false;
      this.formData = new FormData();

      if (this.decryptedData['statusCode'] == 200) {
        this.toast.successToastr(this.decryptedData['statusMsg']);
        this.excel_loader = false;
        this.dialogRef.close();
      }

      else {
        // this.toast.errorToastr(d['statusMsg']);
        this.excel_loader = false;
        this.uploadError = true;
        this.uploadErrorMsg = this.decryptedData['statusMsg'];
        this.uploadErrorMsgCount = this.decryptedData['response'];
        this.excel_loader = false;

      }

    }, err => {
      this.toast.errorToastr('Something went wrong');
      this.excel_loader = false;
    });
  }


  upload_distributor_data_excel2() {
    this.dialogRef.disableClose = true;
    this.formData.append('category', this.file, this.file.name);
    this.excel_loader = true;

    let header

    if (this.modal_type == 'add new') {
      header = this.service.FileData(this.formData, 'Target/importTargetAchievementList')
    }

    header.subscribe(result => {
      this.decryptedData = this.service.payLoad ? result : this.cryptoService.decryptData(JSON.stringify(result));

      this.dialogRef.disableClose = false;
      this.formData = new FormData();

      if (this.decryptedData['statusCode'] == 200) {
        this.toast.successToastr(this.decryptedData['statusMsg']);
        this.excel_loader = false;
        this.dialogRef.close(true);
      }

      else {
        // this.toast.errorToastr(d['statusMsg']);
        this.excel_loader = false;
        this.uploadError = true;
        this.uploadErrorMsg = this.decryptedData['statusMsg'];
        this.uploadErrorMsgCount = this.decryptedData['response'];
        this.excel_loader = false;

      }

    }, err => {
      this.toast.errorToastr('Something went wrong');
      this.excel_loader = false;
    });
  }

  upload_Kri_kpa_data_excel() {
    this.dialogRef.disableClose = true;
    this.formData.append('category', this.file, this.file.name);
    this.excel_loader = true;

    let header

    if (this.modal_type == 'add new') {
      header = this.service.FileData(this.formData, 'Target/uploadUserKRI')
    }

    header.subscribe(result => {
      this.decryptedData = this.service.payLoad ? result : this.cryptoService.decryptData(JSON.stringify(result));

      this.dialogRef.disableClose = false;
      this.formData = new FormData();

      if (this.decryptedData['statusCode'] == 200) {
        this.toast.successToastr(this.decryptedData['statusMsg']);
        this.excel_loader = false;
        this.dialogRef.close(true);
      }

      else {
        // this.toast.errorToastr(d['statusMsg']);
        this.excel_loader = false;
        this.uploadError = true;
        this.uploadErrorMsg = this.decryptedData['statusMsg'];
        this.uploadErrorMsgCount = this.decryptedData['response'];
        this.excel_loader = false;

      }

    }, err => {
      this.toast.errorToastr('Something went wrong');
      this.excel_loader = false;
    });
  }


  uploadAllTarget() {
    this.dialogRef.disableClose = true;
    this.formData.append('category', this.file, this.file.name);

    this.service.FileData(this.formData, 'Target/importUserTargetexcel').subscribe(result => {
      this.decryptedData = this.service.payLoad ? result : this.cryptoService.decryptData(JSON.stringify(result));
      this.dialogRef.disableClose = false;

      if (this.decryptedData['statusCode'] == 200) {
        this.toast.successToastr(this.decryptedData['statusMsg']);
        this.excel_loader = false;
        this.dialogRef.close(true);
      }

      else {
        // this.toast.errorToastr(d['statusMsg']);
        this.excel_loader = false;
        this.uploadError = true;
        this.uploadErrorMsg = this.decryptedData['statusMsg'];
        this.uploadErrorMsgCount = this.decryptedData['response'];
        this.excel_loader = false;

      }

    }, err => {
      this.toast.errorToastr('Something went wrong');
      this.excel_loader = false;
    });
  }



  secondaryTargetSample() {
    this.excel_loader = true;
    if (this.modal_type == 'secondary sale' && this.come_from == 'secondary_target') {
      this.encryptedData = this.service.payLoad ? { 'type': this.network_type } : this.cryptoService.encryptData({ 'type': this.network_type });
      this.service.post_rqst(this.encryptedData, this.data.customer_type == 'primary' ? 'Target/generateExcelForEmpPrimaryTargetupload' : "Target/generateExcelForEmpSecTargetupload").subscribe((result) => {
        this.decryptedData = this.service.payLoad ? result : this.cryptoService.decryptData(JSON.stringify(result));
        if (this.decryptedData['statusCode'] == 200) {
          this.excel_loader = false;
          let filename
          filename = this.data.customer_type == 'primary' ? 'EmployeePrimaryTargetUpload.csv' : 'EmployeeSecondaryTargetUpload.csv'
          document.location.replace(this.uploadurl + 'sample_file/' + filename);
        }
        else {
          this.excel_loader = false;
          this.toast.errorToastr(this.decryptedData['statusMsg']);
        }
      }, err => {
        this.excel_loader = false;
      })
    }
    if (this.modal_type == 'secondary sale Update' && this.come_from == 'secondary_target') {

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
      this.encryptedData = this.service.payLoad ? { 'type': this.network_type, 'month': this.filter.month, 'year': this.filter.year } : this.cryptoService.encryptData({ 'type': this.network_type, 'month': this.filter.month, 'year': this.filter.year });
      this.service.post_rqst(this.encryptedData, "Target/generateExcelForEmpSecTargetupdate").subscribe((result) => {
        this.decryptedData = this.service.payLoad ? result : this.cryptoService.decryptData(JSON.stringify(result));
        if (this.decryptedData['statusCode'] == 200) {
          this.excel_loader = false;
          document.location.replace(this.uploadurl + 'update_sample_file/EmployeeSecondaryTargetUpdate.csv');
        }
        else {
          this.excel_loader = false;
          this.toast.errorToastr(this.decryptedData['statusMsg']);
        }
      }, err => {
        this.excel_loader = false;
      })
    }
  }


  upload_secondary_data_excel() {
    this.dialogRef.disableClose = true;
    this.formData.append('category', this.file, this.file.name);
    this.excel_loader = true;

    let header
    if (this.modal_type == 'secondary sale') {
      header = this.service.FileData(this.formData, this.data.customer_type == 'primary' ? 'Target/importEmpDirectPrimaryTarget' : 'Target/importUserTargetexcel')
    }
    else {
      header = this.service.FileData(this.formData, 'Target/importUserTargetexcel')
    }

    header.subscribe(result => {
      this.decryptedData = this.service.payLoad ? result : this.cryptoService.decryptData(JSON.stringify(result));

      this.dialogRef.disableClose = false;
      this.formData = new FormData();
      if (this.decryptedData['statusCode'] == 200) {
        this.toast.successToastr(this.decryptedData['statusMsg']);
        this.excel_loader = false;
        this.dialogRef.close(true);
      }
      else {
        // this.toast.errorToastr(d['statusMsg']);
        this.excel_loader = false;
        this.uploadError = true;
        this.uploadErrorMsg = this.decryptedData['statusMsg'];
        this.uploadErrorMsgCount = this.decryptedData['response'];
        this.excel_loader = false;

      }
    }, err => {
      this.toast.errorToastr('Something went wrong');
      this.excel_loader = false;
    });
  }


  visitSample() {
    this.excel_loader = true;
    if (this.modal_type == 'visit add' && this.come_from == 'user_visit_target') {
      this.encryptedData = this.service.payLoad ? { 'type': this.network_type } : this.cryptoService.encryptData({ 'type': this.network_type });
      this.service.post_rqst(this.encryptedData, "Target/generateExcelForEmpvisitTargetupload").subscribe((result) => {
        this.decryptedData = this.service.payLoad ? result : this.cryptoService.decryptData(JSON.stringify(result));
        if (this.decryptedData['statusCode'] == 200) {
          this.excel_loader = false;
          document.location.replace(this.uploadurl + 'sample_file/EmployeeVisitTargetUpload.csv');
        }
        else {
          this.excel_loader = false;
          this.toast.errorToastr(this.decryptedData['statusMsg']);
        }
      }, err => {
        this.excel_loader = false;
      })
    }
    if (this.modal_type == 'visit update' && this.come_from == 'user_visit_target') {
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
      this.encryptedData = this.service.payLoad ? { 'type': this.network_type, 'month': this.filter.month, 'year': this.filter.year } : this.cryptoService.encryptData({ 'type': this.network_type, 'month': this.filter.month, 'year': this.filter.year });

      this.service.post_rqst(this.encryptedData, "Target/generateExcelForEmpvisitTargetupdate").subscribe((result) => {
        this.decryptedData = this.service.payLoad ? result : this.cryptoService.decryptData(JSON.stringify(result));
        if (this.decryptedData['statusCode'] == 200) {
          this.excel_loader = false;
          document.location.replace(this.uploadurl + 'update_sample_file/EmployeeVisitTargetUpdate.csv');
        }
        else {
          this.excel_loader = false;
          this.toast.errorToastr(this.decryptedData['statusMsg']);
        }
      }, err => {
        this.excel_loader = false;
      })
    }
  }


  upload_user_visit_data_excel() {
    this.dialogRef.disableClose = true;
    this.formData.append('category', this.file, this.file.name);
    this.excel_loader = true;
    let header;
    if (this.modal_type == 'visit update' && this.come_from == 'user_visit_target') {
      header = this.service.FileData(this.formData, 'Target/importVisitingTargetExcel')
    }

    else {
      header = this.service.FileData(this.formData, 'Target/importVisitingTargetExcel')
    }
    header.subscribe(result => {
      this.decryptedData = this.service.payLoad ? result : this.cryptoService.decryptData(JSON.stringify(result));
      this.dialogRef.disableClose = false;
      this.formData = new FormData();
      if (this.decryptedData['statusCode'] == 200) {
        this.toast.successToastr(this.decryptedData['statusMsg'])
        this.dialogRef.close();
        this.excel_loader = false;
      }
      else {
        // this.toast.errorToastr(d['statusMsg']);
        this.excel_loader = false;
        this.uploadError = true;
        this.uploadErrorMsg = this.decryptedData['statusMsg'];
        this.uploadErrorMsgCount = this.decryptedData['response'];
        this.excel_loader = false;

      }
    }, err => { });
  }





  upload_billing_data_excel() {
    this.dialogRef.disableClose = true;
    this.formData.append('category', this.file, this.file.name);
    this.excel_loader = true;
    this.service.FileData(this.formData, 'Excel_import_data/import_tally_bill_data_by_excel')
      .subscribe(result => {
        this.decryptedData = this.service.payLoad ? result : this.cryptoService.decryptData(JSON.stringify(result));

        this.dialogRef.disableClose = false;
        this.formData = new FormData();
        if (this.decryptedData['msg'] == 'Data Imported successfully') {
          this.dialog.success("Excel Uploaded", " Successfully");
          this.dialogRef.close(true);
          setTimeout(() => {
            this.excel_loader = false;
          }, 700);


          return;
        }
        else {
          this.dialog.error(this.decryptedData['msg']);
          setTimeout(() => {
            this.excel_loader = false;
          }, 700);
          return;

        }

      }, err => { });
  }
  // upload_invoice_excel() {
  //   this.dialogRef.disableClose = true;

  //   this.formData.append('category', this.file, this.file.name);
  //   this.excel_loader = true;
  //   this.service.FileData(this.formData, 'Account/bulkUploadOfInvoiceByCsv')

  //     .subscribe(d => {

  //       this.dialogRef.disableClose = false;
  //       this.formData = new FormData();
  //       if (d['status'] == 200) {
  //         this.dialog.success("Excel Uploaded", d['statusMsg']);
  //         this.dialogRef.close(true);
  //         setTimeout(() => {
  //           this.excel_loader = false;
  //         }, 700);


  //         return;
  //       }
  //       else {
  //         this.dialog.error(d['statusMsg']);
  //         setTimeout(() => {
  //           this.excel_loader = false;
  //         }, 700);
  //         return;

  //       }

  //     }, err => { });
  // }
  upload_payment_excel() {
    this.dialogRef.disableClose = true;
    this.formData.append('category', this.file, this.file.name);
    this.excel_loader = true;

    this.service.FileData(this.formData, 'Account/bulkUploadPaymentByCsv')


      .subscribe(result => {
        this.decryptedData = this.service.payLoad ? result : this.cryptoService.decryptData(JSON.stringify(result));

        this.dialogRef.disableClose = false;
        this.formData = new FormData();
        if (this.decryptedData['statusCode'] == 200) {
          this.dialog.success("Excel Uploaded", this.decryptedData['statusMsg']);
          this.dialogRef.close(true);
          setTimeout(() => {
            this.excel_loader = false;
          }, 700);


          return;
        }
        else {
          this.dialog.error(this.decryptedData['statusMsg']);
          setTimeout(() => {
            this.excel_loader = false;
          }, 700);
          return;

        }

      }, err => { });
  }
  upload_payment_data_excel() {
    this.dialogRef.disableClose = true;
    this.formData.append('category', this.file, this.file.name);
    this.excel_loader = true;
    this.service.FileData(this.formData, 'Excel_import_data/tally_payment_receipt_by_excel')

      .subscribe(result => {
        this.decryptedData = this.service.payLoad ? result : this.cryptoService.decryptData(JSON.stringify(result));

        this.dialogRef.disableClose = false;
        this.formData = new FormData();
        if (this.decryptedData['msg'] == 'Data Imported successfully') {
          this.dialog.success("Excel Uploaded", " Successfully");
          this.dialogRef.close(true);
          setTimeout(() => {
            this.excel_loader = false;
          }, 700);


          return;
        }
        else {
          this.dialog.error(this.decryptedData['msg']);
          setTimeout(() => {
            this.excel_loader = false;
          }, 700);
          return;

        }

      }, err => { });
  }
  upload_credit_note_data_excel() {
    this.dialogRef.disableClose = true;
    this.formData.append('category', this.file, this.file.name);
    this.excel_loader = true;
    this.service.FileData(this.formData, 'Account/bulkUploadCreditNoteByCsv')

      .subscribe(result => {
        this.decryptedData = this.service.payLoad ? result : this.cryptoService.decryptData(JSON.stringify(result));

        this.dialogRef.disableClose = false;
        this.formData = new FormData();
        if (this.decryptedData['statusCode'] == 200) {
          this.dialog.success("Excel Uploaded", this.decryptedData['statusMsg']);
          this.dialogRef.close(true);
          setTimeout(() => {
            this.excel_loader = false;
          }, 700);


          return;
        }
        else {
          this.dialog.error(this.decryptedData['statusMsg']);
          setTimeout(() => {
            this.excel_loader = false;
          }, 700);
          return;

        }

      }, err => { });
  }

  bonusSample(type) {
    document.location.replace(this.uploadurl + 'sample_file/Assign Influencer Sample File.csv');
  }

  upload_bonus_user_data_excel() {
    this.dialogRef.disableClose = true;
    this.formData.append('category', this.file, this.file.name);
    this.formData.append('district', this.data['district'])
    this.formData.append('userType', this.data['user_type'])
    this.formData.append('bonus_id', this.data['bonus_id'])
    this.formData.append('influencerType', this.data['influencer_type'])
    this.excel_loader = true;
    this.service.FileData(this.formData, 'Bonus/uploadBonusInfluencerInBulk')

      .subscribe(result => {
        this.decryptedData = this.service.payLoad ? result : this.cryptoService.decryptData(JSON.stringify(result));
        this.dialogRef.disableClose = false;
        this.formData = new FormData();
        if (this.decryptedData['statusCode'] == 200) {
          this.dialog.success("Excel Uploaded", this.decryptedData['statusMsg']);
          this.dialogRef.close(true);
          setTimeout(() => {
            this.excel_loader = false;
          }, 700);
          return;
        }
        else {
          this.dialog.error(this.decryptedData['statusMsg']);
          setTimeout(() => {
            this.excel_loader = false;
          }, 700);
          return;
        }

      }, err => { });
  }


  upload_travel_plan_data_excel() {
    this.dialogRef.disableClose = true;
    this.formData.append('category', this.file, this.file.name);
    this.excel_loader = true;
    this.service.FileData(this.formData, 'UploaderMaster/importDailyUserTravelPlan')
      .subscribe(result => {
        this.decryptedData = this.service.payLoad ? result : this.cryptoService.decryptData(JSON.stringify(result));
        this.dialogRef.disableClose = false;
        this.formData = new FormData();

        if (this.decryptedData['statusCode'] == 200 && !this.decryptedData['exist'].length) {
          this.dialog.success("Excel Uploaded", this.decryptedData['statusMsg']);
          this.dialogRef.close(true);
          setTimeout(() => {
            this.excel_loader = false;
          }, 700);
          return;
        } else if (this.decryptedData['statusCode'] == 200 && this.decryptedData['exist'].length) {
          this.dialog.success("Excel Uploaded", this.decryptedData['statusMsg']);
          this.uploadError = true;
          this.uploadErrorMsg = this.decryptedData['exist'];
          this.uploadErrorMsgCount = this.decryptedData['response'];
          setTimeout(() => {
            this.excel_loader = false;


          }, 700);
          return;
        }
        else {
          this.uploadError = true;
          this.uploadErrorMsg = this.decryptedData['statusMsg'];
          this.uploadErrorMsgCount = this.decryptedData['response'];
          setTimeout(() => {
            this.excel_loader = false;


          }, 700);
          return;
        }

      }, err => {
        this.excel_loader = false;

      });
  }

  upload_travel_plan_data_excel2() {
    this.dialogRef.disableClose = true;
    this.formData.append('category', this.file, this.file.name);
    this.excel_loader = true;
    this.service.FileData(this.formData, 'Travel/importMonthlyUserTravelPlan')
      .subscribe(result => {
        this.decryptedData = this.service.payLoad ? result : this.cryptoService.decryptData(JSON.stringify(result));
        this.dialogRef.disableClose = false;
        this.formData = new FormData();
        if (this.decryptedData['statusCode'] == 200 && !this.decryptedData['exist'].length) {
          this.dialog.success("Excel Uploaded", this.decryptedData['statusMsg']);
          this.dialogRef.close(true);
          setTimeout(() => {
            this.excel_loader = false;
          }, 700);
          return;
        }
        else if (this.decryptedData['statusCode'] == 200 && this.decryptedData['exist'].length) {
          this.dialog.success("Excel Uploaded", this.decryptedData['statusMsg']);
          this.uploadError = true;
          this.uploadErrorMsg = this.decryptedData['exist'];
          this.uploadErrorMsgCount = this.decryptedData['response'];
          setTimeout(() => {
            this.excel_loader = false;


          }, 700);
          return;
        }
        else {
          this.uploadError = true;
          this.uploadErrorMsg = this.decryptedData['statusMsg'];
          this.uploadErrorMsgCount = this.decryptedData['response'];
          setTimeout(() => {
            this.excel_loader = false;


          }, 700);
          return;
        }

      }, err => {
        this.excel_loader = false;

      });
  }

  getSalesUserForReporting() {
    this.excel_loader = true;
    this.service.post_rqst({}, 'Travel/getSalesUserForReporting').subscribe((result) => {
      this.decryptedData = this.service.payLoad ? result : this.cryptoService.decryptData(JSON.stringify(result));
      if (this.decryptedData['statusCode'] == 200) {
        this.excel_loader = false;
        this.usersList = this.decryptedData['all_sales_user'];
      }
      else {
        this.excel_loader = false;
        this.toast.errorToastr(this.decryptedData['statusMsg']);
      }
    }, err => {
      this.excel_loader = false;
    })

  }

  downloadSampleFile(head) {
    this.excel_loader = true;
    this.encryptedData = this.service.payLoad ? { 'filter': this.filter } : this.cryptoService.encryptData({ 'filter': this.filter });
    this.service.post_rqst(this.encryptedData, head).subscribe((result) => {
      this.decryptedData = this.service.payLoad ? result : this.cryptoService.decryptData(JSON.stringify(result));

      if (this.decryptedData['statusCode'] == 200) {
        this.excel_loader = false;
        document.location.replace(this.url + 'sample_file/' + this.decryptedData['filename']);
      }
      else {
        this.excel_loader = false;
        this.toast.errorToastr(this.decryptedData['statusMsg']);
      }
    }, err => {
      this.excel_loader = false;
    })

  }

  upload_pendingbills_excel() {
    this.dialogRef.disableClose = true;
    this.formData.append('category', this.file, this.file.name);

    this.excel_loader = true;
    this.service.FileData(this.formData, 'Account/bulkUploadPendingBillPaymentsCsv').subscribe(result => {
      this.decryptedData = this.service.payLoad ? result : this.cryptoService.decryptData(JSON.stringify(result));

      this.dialogRef.disableClose = false;
      this.formData = new FormData();
      if (this.decryptedData['statusCode'] == 200 && !this.decryptedData['response'].length) {
        this.toast.successToastr(this.decryptedData['statusMsg']);
        this.dialogRef.close(true);
        this.excel_loader = false;
        this.service.dr_list();
      }
      else {
        this.dialog.error(this.decryptedData['statusMsg']);
        setTimeout(() => {
          this.excel_loader = '';
        }, 700);


      }
      if (this.decryptedData['response'].length) {
        this.uploadError = true;
        this.uploadErrorMsg = this.decryptedData['response'];
        // this.uploadErrorMsgCount = d['response'];
        this.excel_loader = false;
      }
    }, err => { });
  }

  upload_ledger_excel() {
    this.dialogRef.disableClose = true;
    this.formData.append('category', this.file, this.file.name)

    this.excel_loader = true;
    this.service.FileData(this.formData, 'Account/bulkUploadledgerCsv').subscribe(result => {
      this.decryptedData = this.service.payLoad ? result : this.cryptoService.decryptData(JSON.stringify(result));

      this.dialogRef.disableClose = false;
      this.formData = new FormData();
      if (this.decryptedData['statusCode'] == 200 && !this.decryptedData['response'].length) {
        this.toast.successToastr(this.decryptedData['statusMsg']);
        this.dialogRef.close(true);
        this.excel_loader = false;
        this.service.dr_list();
      }
      else {
        this.dialog.error(this.decryptedData['statusMsg']);
        setTimeout(() => {
          this.excel_loader = '';
        }, 700);
      }
      if (this.decryptedData['response'].length) {
        this.uploadError = true;
        this.uploadErrorMsg = this.decryptedData['response'];
        // this.uploadErrorMsgCount = d['response'];
        this.excel_loader = false;
      }
    }, err => { });
  }

  upload_invoice_excel() {
    this.dialogRef.disableClose = true;

    this.formData.append('category', this.file, this.file.name);
    this.excel_loader = true;
    this.service.FileData(this.formData, 'Account/bulkUploadOfInvoiceByCsv')

      .subscribe(result => {
        this.decryptedData = this.service.payLoad ? result : this.cryptoService.decryptData(JSON.stringify(result));

        this.dialogRef.disableClose = false;
        this.formData = new FormData();
        if (this.decryptedData['statusCode'] == 200 && !this.decryptedData['response'].length) {
          this.toast.successToastr(this.decryptedData['statusMsg']);
          this.dialogRef.close(true);
          this.excel_loader = false;
          this.service.dr_list();
        }
        else {
          this.dialog.error(this.decryptedData['statusMsg']);
          setTimeout(() => {
            this.excel_loader = '';
          }, 700);
        }
        if (this.decryptedData['response'].length) {
          this.uploadError = true;
          this.uploadErrorMsg = this.decryptedData['response'];
          // this.uploadErrorMsgCount = d['response'];
          this.excel_loader = false;
        }

      }, err => { });
  }


  sampleFlag: boolean = false;



  targetSecProjection() {
    if ((this.data.page_type == 'Secondary Sales Projections' || this.data.page_type == 'Stock Sales Projections') && this.come_from == 'distributor_target') {

      if (!this.filter.dr_type && this.data.page_type == 'Secondary Sales Projections') {
        this.toast.errorToastr("Please select customer type!");
        return;
      }
      if (this.data.page_type == 'Stock Sales Projections') {
        this.filter.dr_type = '3'
      }

      this.sampleFlag = true;
      this.encryptedData = this.service.payLoad ? { 'type': this.filter.dr_type } : this.cryptoService.encryptData({ 'type': this.filter.dr_type });
      this.service.post_rqst(this.encryptedData, "Target/generateExcelForSecondaryTargetUpload").subscribe((result) => {
        this.decryptedData = this.service.payLoad ? result : this.cryptoService.decryptData(JSON.stringify(result));
        if (this.decryptedData['statusCode'] == 200) {
          this.sampleFlag = false;
          document.location.replace(this.uploadurl + 'sample_file/SecondaryTargetUpload.csv');
        }
        else {
          this.sampleFlag = false;
          this.toast.errorToastr(this.decryptedData['statusMsg']);
        }
      })
    }
  }

  uploadProjectionsExcel() {

    if (!this.filter.dr_type && this.data.page_type == 'Secondary Sales Projections') {
      this.toast.errorToastr("Please select customer type!");
      return;
    }
    if (this.data.page_type == 'Stock Sales Projections') {
      this.filter.dr_type = '3'
    }

    this.dialogRef.disableClose = true;
    this.formData.append('category', this.file, this.file.name);
    this.formData.append('type', this.filter.dr_type)
    this.excel_loader = true;
    this.service.FileData(this.formData, 'Target/importSecondaryTargetexcel').subscribe(result => {
      this.decryptedData = this.service.payLoad ? result : this.cryptoService.decryptData(JSON.stringify(result));
      this.dialogRef.disableClose = false;
      this.formData = new FormData();
      if (this.decryptedData['statusCode'] == 200) {
        this.toast.successToastr(this.decryptedData['statusMsg']);
        this.excel_loader = false;
        this.dialogRef.close(true);
      }

      else {
        // this.toast.errorToastr(d['statusMsg']);
        this.excel_loader = false;
        this.uploadError = true;
        this.uploadErrorMsg = this.decryptedData['statusMsg'];
        this.uploadErrorMsgCount = this.decryptedData['response'];
        this.excel_loader = false;

      }

    }, err => {
      this.toast.errorToastr('Something went wrong');
      this.excel_loader = false;
    });
  }

}
