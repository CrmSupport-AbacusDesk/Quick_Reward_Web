import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastrManager } from 'ng6-toastr-notifications';
import { DatabaseService } from 'src/_services/DatabaseService';
import { DialogComponent } from 'src/app/dialog.component';
import { ImageModuleComponent } from 'src/app/image-module/image-module.component';
import { sessionStorage } from 'src/app/localstorage.service';
import { StatusModalComponent } from 'src/app/order/status-modal/status-modal.component';
import { Location } from '@angular/common';

@Component({
  selector: 'app-secondary-bill-upload-detail',
  templateUrl: './secondary-bill-upload-detail.component.html',
  styleUrls: ['./secondary-bill-upload-detail.component.scss']
})
export class SecondaryBillUploadDetailComponent implements OnInit {
  orderType: any = 'order';
  BillID: any;
  url: any;
  skLoading: boolean = false;
  nexturl:any;
  secBillUploadItems: any = [];
  invoice_bill_item: any = [];
  order_logs: any = [];
  secBillUploadData: any = [];
  secBillUploadBillDocs: any = [];
  login_dr_id: any;
  distrbutorId: any;
  constructor(public route: ActivatedRoute, public serve: DatabaseService, public toast: ToastrManager, public dialog: MatDialog, public session: sessionStorage, public dialogs: DialogComponent, public router: Router, public alert: DialogComponent,public location: Location) {
    this.url = this.serve.uploadUrl + 'secondary_orders_bill_doc/';
    
    this.route.params.subscribe(params => {
      this.BillID = params.id;
      this.serve.currentUserID = params.id
    });
    this.getsecBillUploadDetail();
  }
  
  ngOnInit() {}
  
  back(): void {
    this.location.back()
  }
  
  loader: any;
  edit_cash_discount: any = false;
  Order_Amount: any;
  getsecBillUploadDetail() {
    this.loader = 1;
    this.skLoading = true;
    let id = { 'bill_id': this.BillID }
    
    setTimeout(() => {
      this.serve.post_rqst(id, "Order/secondaryOrdersBillDetails").subscribe((result => {
        if (result['statusCode'] == 200) {
          this.skLoading = false;
          this.secBillUploadData = result['result'];
          this.secBillUploadBillDocs = result['result']['bill_docs'];
          this.secBillUploadItems = result['result']['bill_items'];
          
          setTimeout(() => {
            this.loader = '';
          }, 700);
        } else {
          setTimeout(() => {
            this.loader = '';
          }, 700);
          this.skLoading = false;
          this.toast.errorToastr(result['statusMsg'])
        }
      }))
    }, 700);
  }
  
  openDialog(secBillUploadStatus,bill_amount): void {
    const dialogRef = this.dialog.open(StatusModalComponent, {
      width: '500px' ,
      data: {
        'bill_amount': bill_amount,
        'order_status': secBillUploadStatus,
        'BillID': this.BillID,
        'bill_items': this.secBillUploadItems,
        'from': 'secBillUploadStatus',
      }
    });
    
    dialogRef.afterClosed().subscribe(result => {
      if (result != false) {
        this.getsecBillUploadDetail();
      }
    });
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
}
