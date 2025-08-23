import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { ImageModuleComponent } from 'src/app/image-module/image-module.component';
import { ActivatedRoute, Router } from '@angular/router';
import { DatabaseService } from 'src/_services/DatabaseService';
import { sessionStorage } from 'src/app/localstorage.service';
import { ToastrManager } from 'ng6-toastr-notifications';
import { Location } from '@angular/common'
import { DialogComponent } from 'src/app/dialog.component';
import { DialogService } from 'src/app/dialog.service';
import { ExportexcelService } from 'src/app/service/exportexcel.service';
import { EngineerAssignModelComponentComponent } from 'src/app/engineer-assign-model-component/engineer-assign-model-component.component';
import { AddComplaintRemarkComponent } from 'src/app/add-complaint-remark/add-complaint-remark.component';
import { ComplaintUpdateModelComponent } from '../complaint-update-model/complaint-update-model.component';
import { ServiceInvoiceAddComponent } from 'src/app/service-invoice/service-invoice-add/service-invoice-add.component';
import { FeedbackAddComponent } from '../feedback-add/feedback-add.component';
import { CryptoService } from 'src/_services/CryptoService';

@Component({
  selector: 'app-complaint-detail',
  templateUrl: './complaint-detail.component.html',
  styleUrls: ['./complaint-detail.component.scss']
})
export class ComplaintDetailComponent implements OnInit {
  id;
  getData: any = {};
  loader: any;
  skLoading: boolean = false;
  url: any;
  assign_login_data: any = {};
  logined_user_data: any = {};
  stateDetail: any = [];
  product_size: any = [];
  spare_list: any = [];
  complaint_visit: any = [];
  featureFlag: boolean = false;
  allMrpFlag: boolean = false;
  complaintImg: any = [];
  inspectionImg: any = [];
  closeImg: any = [];
  fabBtnValue: any = 'excel';
  encryptedData: any;
  decryptedData:any;

  constructor(public location: Location, public cryptoService:CryptoService, public session: sessionStorage, private router: Router, public alert: DialogComponent, public service: DatabaseService, public editdialog: DialogService, public dialog: MatDialog, public route: ActivatedRoute, public toast: ToastrManager, public excelservice: ExportexcelService, public dialog1: DialogComponent) {


    this.url = this.service.uploadUrl + 'service_task/'
    this.route.params.subscribe(params => {
      this.id = params.id;
      this.service.currentUserID = params.id
      if (this.id) {
        this.getComplaintDetail();
      }
    });
  }

  ngOnInit() {
  }

  getComplaintDetail() {
    this.loader = 1;
    this.skLoading = true;
    this.encryptedData = this.service.payLoad ? { 'complaint_id': this.id }: this.cryptoService.encryptData({ 'complaint_id': this.id });
    this.service.post_rqst(this.encryptedData, "ServiceTask/serviceComplaintDetail").subscribe(result => {
    this.decryptedData = this.service.payLoad ? result : this.cryptoService.decryptData(JSON.stringify(result));
      if (this.decryptedData['statusCode'] == 200) {
        this.skLoading = false;
        this.getData = this.decryptedData['result'];
        this.complaintImg = this.getData['image'];
        this.inspectionImg = this.getData['inspection_image'];
        this.closeImg = this.getData['closing_image'];
        this.spare_list = this.getData['spare_list'];
        this.complaint_visit = this.getData['complaint_visit'];
      } else {
        this.skLoading = false;
        this.toast.errorToastr(this.decryptedData['statusMsg']);
      }
    }, err => {
      this.skLoading = false;
      this.toast.errorToastr('Something went wrong');
    })
  }


  imageModel(image) {
    const dialogRef = this.dialog.open(ImageModuleComponent, {
      panelClass: 'Image-modal',
      data: {
        image,
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log(result);
    });
  }


  back(): void {
    this.location.back()
  }
  openDialog(row, state,carpenter_id): void {
    console.log(row);
    const dialogRef = this.dialog.open(EngineerAssignModelComponentComponent, {
      width: '400px',
      panelClass: 'cs-model',
      data: {
        id: row,
        state: state,
        carpenter_id: carpenter_id,
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result==true) {
        this.getComplaintDetail();
      }
    });
  }

  openDialog2(id) {
    const dialogRef = this.dialog.open(AddComplaintRemarkComponent, {
      width: '500px',
      panelClass: 'cs-modal',
      data: {
        id: id,
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result==true) {
        this.getComplaintDetail();
      }
    });
  }
  updateComplaintStataus(id) {
    const dialogRef = this.dialog.open(ComplaintUpdateModelComponent, {
      width: '400px',
      panelClass: 'cs-model',
      data: {
        id: id,
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result==true) {
        this.getComplaintDetail();
      }
    });
  }
  openInvoicePage(data){
    const dialogRef = this.dialog.open(ServiceInvoiceAddComponent, {
      width: '800px',
      panelClass: 'cs-model',
      data: {
        data:data,
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result==true) {
        this.getComplaintDetail();
      }
    });
  }
  reOpenComplaint(id) {
    this.dialog1.reopen('Complaint!').then((result) => {
      if (result) {
        this.encryptedData = this.service.payLoad ? { 'complaint_id': id }: this.cryptoService.encryptData({ 'complaint_id': id });
        this.service.post_rqst(this.encryptedData, "ServiceTask/complaintReopen").subscribe((result) => {
          this.decryptedData = this.service.payLoad ? result : this.cryptoService.decryptData(JSON.stringify(result));
          if (this.decryptedData['statusCode'] == 200) {
            this.toast.successToastr(this.decryptedData['statusMsg']);
            this.getComplaintDetail();
          }
          else {
            this.toast.errorToastr(this.decryptedData['statusMsg']);
          }
        })
      }
    });
  }


  openFeedbackForm(id){
    const dialogRef = this.dialog.open(FeedbackAddComponent, {
      width: '500px',
      panelClass: 'cs-model',
      data: {
        id:id,
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result==true) {
        this.getComplaintDetail();
      }
    });
  }
}
