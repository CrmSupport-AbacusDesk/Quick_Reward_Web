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
import { InstallationUpdateModelComponent } from '../installation-update-model/installation-update-model.component';
import { EngineerAssignModelComponentComponent } from 'src/app/engineer-assign-model-component/engineer-assign-model-component.component';
import { AddComplaintRemarkComponent } from 'src/app/add-complaint-remark/add-complaint-remark.component';
import { CryptoService } from 'src/_services/CryptoService';

@Component({
  selector: 'app-installation-detail',
  templateUrl: './installation-detail.component.html',
  styleUrls: ['./installation-detail.component.scss']
})
export class InstallationDetailComponent implements OnInit {
  id;
  getData: any = {};
  add_list: any = {};
  skLoading: boolean = false;
  loader: any;
  url: any;
  assign_login_data: any = {};
  logined_user_data: any = {};
  stateDetail: any = [];
  product_size: any = [];
  featureFlag: boolean = false;
  allMrpFlag: boolean = false;
  complaintImg: any = [];
  fabBtnValue: any = 'excel';
  inspectionImg: any = [];
  closeImg: any = [];
  logs: any = [];
  encryptedData: any;
  decryptedData:any;



  constructor(public location: Location, public cryptoService:CryptoService, public session: sessionStorage, private router: Router, public alert: DialogComponent, public service: DatabaseService, public editdialog: DialogService, public dialog: MatDialog, public route: ActivatedRoute, public toast: ToastrManager, public excelservice: ExportexcelService, public dialog1: DialogComponent) {

    this.url = this.service.uploadUrl + 'service_task/'
    this.route.params.subscribe(params => {
      this.id = params.id;
      this.service.currentUserID = params.id
      if (this.id) {
        this.getInstallationDetail();
      }
    });
  }

  ngOnInit() {
  }

  getInstallationDetail() {
    this.loader = 1;
    this.skLoading = true;
    this.encryptedData = this.service.payLoad ? { 'complaint_id': this.id }: this.cryptoService.encryptData({ 'complaint_id': this.id });
    this.service.post_rqst(this.encryptedData, "ServiceTask/serviceInstallationDetail").subscribe(result => {
      this.decryptedData = this.service.payLoad ? result : this.cryptoService.decryptData(JSON.stringify(result));
      
      if (this.decryptedData['statusCode'] == 200) {
        this.skLoading = false;
        this.getData = this.decryptedData['result'];
        this.add_list = this.getData['add_list'];
        this.inspectionImg = this.getData['inspection_image'];
        this.closeImg = this.getData['image'];
        this.logs = this.getData['log'];
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

  openDialog(row, state): void {
    console.log(row);
    const dialogRef = this.dialog.open(EngineerAssignModelComponentComponent, {
      width: '400px',
      panelClass: 'cs-model',
      data: {
        id: row,
        state: state,
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result==true) {
        this.getInstallationDetail();
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
        this.getInstallationDetail();
      }
    });
  }
  updateInstallationStataus(id) {
    const dialogRef = this.dialog.open(InstallationUpdateModelComponent, {
      width: '400px',
      panelClass: 'cs-model',
      data: {
        id: id,
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result==true) {
        this.getInstallationDetail();
      }
    });
  }

}

