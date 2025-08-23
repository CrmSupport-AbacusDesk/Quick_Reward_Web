// import { InjectFlags } from '@angular/compiler/src/core';
import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { ToastrManager } from 'ng6-toastr-notifications';
import { DatabaseService } from 'src/_services/DatabaseService';
import { DialogComponent } from '../dialog.component';
import * as _ from 'lodash';
import { sessionStorage } from '../localstorage.service';
import { CryptoService } from 'src/_services/CryptoService';

@Component({
  selector: 'app-product-upload',
  templateUrl: './product-upload.component.html',
  styleUrls: ['./product-upload.component.scss']
})
export class ProductUploadComponent implements OnInit {
  formData = new FormData();
  excel_name: any = '';
  file: any = {};
  file_name: any;
  loader: any;
  url: any;
  typecheck: any = '';
  istrue: boolean = false;
  assign_login_data: any = {};
  logined_user_data: any = {};
  savingFlag: boolean = false;
  come_from: any;
  modal_type: any;
  excel_loader: any = false;
  uploadError: boolean = false;
  uploadErrorMsg: any;
  uploadErrorMsgCount: any;
  encryptedData: any;
  decryptedData:any;

  constructor(@Inject(MAT_DIALOG_DATA) public data, public cryptoService:CryptoService, public session: sessionStorage, public toast: ToastrManager, public service: DatabaseService, public dialog: DialogComponent, public dialogRef: MatDialogRef<ProductUploadComponent>) {
    this.url = this.service.uploadUrl;
    this.assign_login_data = this.session.getSession();
    this.logined_user_data = this.assign_login_data.value.data;
    this.come_from = data['from']
    this.modal_type = data['modal_type']
  }
  ngOnInit() {
  }


  onUploadChange(evt, f) {
    this.file = evt.target.files[0];
    f.resetForm();
    this.excel_name = this.file.name;

    const allowed_types = ['text/csv'];
    this.typecheck = !_.includes("text/csv", this.file.type)
    if (!_.includes(allowed_types, this.file.type)) {
      this.toast.errorToastr('Only CSV File Accepted');
      this.file = ''
      this.excel_name = '';
      this.istrue = false;
      return
    }
    let byte = 1000000    // equal to 1mb
    if (this.file.size > (byte * 10)) {
      this.toast.errorToastr('Csv file size is too large, maximum file size is 10 MB.');
      this.file = ''
      this.istrue = false;
      return
    }
    else { this.istrue = true; }
  }

  download_sample_file(upload_type) {
    this.encryptedData = this.service.payLoad ? { 'type': upload_type }: this.cryptoService.encryptData({ 'type': upload_type });
    this.service.post_rqst(this.encryptedData, "Master/generateExcelForUpdate").subscribe((result) => {
    this.decryptedData = this.service.payLoad ? result : this.cryptoService.decryptData(JSON.stringify(result));
     
      if (this.decryptedData['statusCode'] == 200) {
        document.location.replace(this.url + 'update_sample_file/updateProduct.csv');
        this.toast.successToastr(this.decryptedData['statusMsg']);
      }
      else {
        this.toast.errorToastr(this.decryptedData['statusMsg'])
      }
    })

  }



  upload_user_data_excel(upload_type) {
    this.dialogRef.disableClose = true;
    this.formData.append('category', this.file, this.file.name);
    this.formData.append('created_by_id', this.logined_user_data.id);
    this.formData.append('created_by_name', this.logined_user_data.name);
    this.formData.append('operation_type', this.modal_type);
    this.loader = 1;
    this.savingFlag = true;
    let header: any;

    if (upload_type == 'insert') {
      header = this.service.FileData((this.formData), 'Master/uploadProductInBulkByCsv')
    } else if (upload_type == 'update') {
      header = this.service.FileData((this.formData), 'Master/updateProductBasicInBulkByCsv')
    } else if (upload_type == 'update_mrp') {
      header = this.service.FileData((this.formData), 'Master/updateProductMrpInBulkByCsv')
    } else if (upload_type == 'update_point') {
      header = this.service.FileData((this.formData), 'Master/updateProductPointCatInBulkByCsv')
    }
    header.subscribe(result => {
      this.decryptedData = this.service.payLoad ? result : this.cryptoService.decryptData(JSON.stringify(result));

      this.dialogRef.disableClose = false;
      this.formData = new FormData();
      if (this.decryptedData['statusCode'] == 200) {
        // this.toast.successToastr(this.decryptedData['statusMsg']);
        // this.dialogRef.close(true);
        // this.loader='';
        if (this.decryptedData['statusMsg'] == 'sucess') {
          this.toast.successToastr(this.decryptedData['statusMsg']);
          this.dialogRef.close(true);
          this.savingFlag = false;
        }
        else {
          this.savingFlag = false;
          this.uploadError = true;
          this.uploadErrorMsg = this.decryptedData['statusMsg'];
          this.uploadErrorMsgCount = this.decryptedData['respose_count'];
        }
      }
      else {
        this.toast.errorToastr(result['statusMsg'])
        this.savingFlag = false;
      }

    }, err => { this.formData = new FormData(); });
  }

}
