import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { slideToTop } from '../../router-animation/router-animation.component';
import { DatabaseService } from 'src/_services/DatabaseService';
import { MatDialog } from '@angular/material';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { DialogComponent } from 'src/app/dialog.component';
import { ToastrManager } from 'ng6-toastr-notifications';
import { DialogService } from 'src/app/dialog.service';
import { ExportexcelService } from 'src/app/service/exportexcel.service';
import { Location } from '@angular/common';
import { sessionStorage } from 'src/app/localstorage.service';
import { ImageModuleComponent } from '../../image-module/image-module.component';
import { CryptoService } from 'src/_services/CryptoService';



@Component({
  selector: 'app-purchase-detail',
  templateUrl: './purchase-detail.component.html'
})
export class PurchaseDetailComponent implements OnInit {


  product_id;
  getData: any = {};
  skLoading: boolean = false;
  url: any;
  assign_login_data: any = {};
  logined_user_data: any = {};
  product_size: any = [];
  productImg: any = [];
  items:any =[];

  constructor(public location: Location, public cryptoService:CryptoService, public session: sessionStorage, private router: Router, public alert: DialogComponent, public service: DatabaseService, public editdialog: DialogService, public dialog: MatDialog, public route: ActivatedRoute, public toast: ToastrManager, public excelservice: ExportexcelService, public dialog1: DialogComponent) {
    this.assign_login_data = this.session.getSession();
    this.logined_user_data = this.assign_login_data.value.data;
  }
  ngOnInit() {
    this.route.params.subscribe(params => {
      let id = params.id.replace(/_/g, '/');
      this.product_id = this.cryptoService.decryptId(id);
      this.service.currentUserID = this.cryptoService.decryptId(id)
      this.url = this.service.uploadUrl + 'product_image/';
      if (id) {
        this.getProductDetail();
      }
    });
  }


  back(): void {
    this.location.back()
  }

  getProductDetail() {
    this.skLoading = true;
    this.service.post_rqst({ 'id': this.product_id }, "Purchase/purchaseDetail").subscribe((result => {
      if (result['statusCode'] == 200) {
        this.getData = result['result'];
        this.items = result['result']['item'];

        this.skLoading = false;
      }
      else {
        this.toast.errorToastr(result['statusMsg']);
      }
      
 
    }
    ));

  }


  imageModel(image) {
    const dialogRef = this.dialog.open(ImageModuleComponent, {
      panelClass: 'Image-modal',
      data: {
        image,
      }
    });
    dialogRef.afterClosed().subscribe(result => {
    });
  }



  // Product go to add page 
  editProduct() {
    this.router.navigate(['add-product/' + this.product_id]);
  }





}


