import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { ToastrManager } from 'ng6-toastr-notifications';
import { DialogComponent } from 'src/app/dialog.component';
import { sessionStorage } from 'src/app/localstorage.service';
import { DatabaseService } from 'src/_services/DatabaseService';
import { CryptoService } from 'src/_services/CryptoService';

@Component({
  selector: 'app-support-status',
  templateUrl: './support-status.component.html'
})
export class SupportStatusComponent implements OnInit {
  @ViewChild('fileInput') fileInput: any;
  data: any = {}
  savingFlag: boolean = false;
  userData: any;
  userId: any;
  userName: any;
  dealerList: any = [];
  file: any = {};
  image = new FormData();
  supportImage: any = [];
  tickets: any = [];
  encryptedData: any;
  decryptedData: any;

  constructor(@Inject(MAT_DIALOG_DATA) public modelData, public cryptoService: CryptoService, public dialog: MatDialog, public service: DatabaseService, public session: sessionStorage, public toast: ToastrManager, public alert: DialogComponent, public dialogRef: MatDialogRef<SupportStatusComponent>) {
    this.userData = JSON.parse(localStorage.getItem('st_user'));
    this.userId = this.userData['data']['id'];
    this.userName = this.userData['data']['name'];

    if (modelData.type == 'add') {
      this.service.orgUserType();
    }
  }


  ngOnInit() {
    if (this.modelData.type == 'add') {
      this.getTicketType();
    }

    if (this.modelData.network_type) {
      this.data.dr_type = this.modelData.network_type.network_type.toString();
      this.data.customer_id = this.modelData.id.toString();
      this.findName('network', this.data.dr_type);
      this.distributors('');
    }
  }

  distributors(masterSearch) {
    this.encryptedData = this.service.payLoad ? { 'dr_type': this.data.dr_type, 'master_search': masterSearch, 'dr_id': this.data.customer_id } : this.cryptoService.encryptData({ 'dr_type': this.data.dr_type, 'master_search': masterSearch, 'dr_id': this.data.customer_id });
    this.service.post_rqst(this.encryptedData, "Support/userList").subscribe((result) => {
      this.decryptedData = this.service.payLoad ? result : this.cryptoService.decryptData(JSON.stringify(result));
      if (this.decryptedData['statusCode'] == 200) {
        this.dealerList = this.decryptedData['result'];
        if (this.modelData.network_type) {
          this.findName('customer', this.data.customer_id);
        }
      } else {
        this.toast.errorToastr(this.decryptedData['statusMsg'])
      }
    }, err => {
    })
  }

  onUploadChange(data: any) {
    if (this.supportImage.length > 4) {
      this.toast.errorToastr('Maximum five image allowed');
      return;
    }
    else {
      for (let i = 0; i < data.target.files.length; i++) {
        let files = data.target.files[i];
        let byte = 1000000
        if (files.size > (byte * 2)) {
          this.toast.errorToastr('Image size is too be large, maximum file size is 2 MB.');
          return;
        }
        if (files) {
          let reader = new FileReader();
          reader.onload = (e: any) => {
            this.supportImage.push(e.target.result);
          }
          reader.readAsDataURL(files);
        }
        this.image.append("" + i, data.target.files[i], data.target.files[i].name);
      }
      this.fileInput.nativeElement.value = '';
    }

  }

  deleteProductImage(i) {
    this.supportImage.splice(i, 1)
  }

  findName(type, id) {
    if (type == 'network') {
      let Index = this.service.drArray.findIndex(row => row.id == id);
      if (Index != -1) {
        this.data.customer_type = this.service.drArray[Index]['module_name']
      }
    }
    if (type == 'customer') {
      let Index = this.dealerList.findIndex(row => row.id == id);
      if (Index != -1) {
        this.data.customer_name = this.dealerList[Index]['name'];
        this.data.type = this.dealerList[Index]['type'];
      }
    }
    if (type == 'ticket') {
      let Index = this.tickets.findIndex(row => row.id == id);
      if (Index != -1) {
        this.data.type_name = this.tickets[Index]['category_name']
      }
    }

  }

  getTicketType() {
    this.service.post_rqst({}, "Support/getSupportcategory").subscribe((result) => {
      this.decryptedData = this.service.payLoad ? result : this.cryptoService.decryptData(JSON.stringify(result));
      if (this.decryptedData['statusCode'] == 200) {
        this.tickets = this.decryptedData['data'];
      } else {
        this.toast.errorToastr(this.decryptedData['statusMsg'])
      }
    }, err => {
    })
  }



  submitAlert(type) {
    this.alert.confirm("Do you want to raise a ticket ?").then((result) => {
      if (result) {
        this.submit(type)
      }
    })
  }


  submit(type) {

    if (this.data.dr_type == 'Influencer') {
      this.data.dr_type == 'influencer'
    }
    this.data.created_by_id = this.userId;
    this.data.created_by_name = this.userName;
    if (type == 'status') {
      this.savingFlag = true;
      this.data.id = this.modelData.id;
      this.encryptedData = this.service.payLoad ? { 'data': this.data } : this.cryptoService.encryptData({ 'data': this.data });
      this.service.post_rqst(this.encryptedData, "Support/closeComplaint").subscribe((result => {
        this.decryptedData = this.service.payLoad ? result : this.cryptoService.decryptData(JSON.stringify(result));

        if (this.decryptedData['statusCode'] == 200) {
          this.dialogRef.close(true);
          this.savingFlag = false;
          this.toast.successToastr(this.decryptedData['statusMsg']);
        }
        else {
          this.toast.errorToastr(this.decryptedData['statusMsg']);
          this.savingFlag = false;
        }

      }));
    }

    if (type == 'brandStatus') {
      this.savingFlag = true;
      this.data.id = this.modelData.id;
      this.encryptedData = this.service.payLoad ? { 'status': this.data.status, 'reason': this.data.reason, 'id': this.data.id, 'value': this.data.value } : this.cryptoService.encryptData({ 'data': this.data });
      this.service.post_rqst(this.encryptedData, "BrandAudit/brandAuditUpdate").subscribe((result => {
        this.decryptedData = this.service.payLoad ? result : this.cryptoService.decryptData(JSON.stringify(result));

        if (this.decryptedData['statusCode'] == 200) {
          this.dialogRef.close(true);
          this.savingFlag = false;
          this.toast.successToastr(this.decryptedData['statusMsg']);
        }
        else {
          this.toast.errorToastr(this.decryptedData['statusMsg']);
          this.savingFlag = false;
        }

      }));
    }
    if(type == 'ticket') {
      console.log('ttse');
      this.data.image = this.supportImage;
      this.savingFlag = true;
      this.encryptedData = this.service.payLoad ? { 'data': this.data } : this.cryptoService.encryptData({ 'data': this.data });
      this.service.post_rqst(this.encryptedData, "Support/addSupport").subscribe((result => {
        this.decryptedData = this.service.payLoad ? result : this.cryptoService.decryptData(JSON.stringify(result));
        if (this.decryptedData['statusCode'] == 200) {
          this.dialogRef.close(true);
          this.savingFlag = false;
          this.toast.successToastr(this.decryptedData['statusMsg']);
        }
        else {
          this.toast.errorToastr(this.decryptedData['statusMsg']);
          this.savingFlag = false;
        }

      }));
    }
  }





}
