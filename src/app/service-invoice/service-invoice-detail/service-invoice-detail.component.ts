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
import { ServicePaymentAddComponent } from '../service-payment-add/service-payment-add.component';
import { CryptoService } from 'src/_services/CryptoService';
@Component({
  selector: 'app-service-invoice-detail',
  templateUrl: './service-invoice-detail.component.html',
  styleUrls: ['./service-invoice-detail.component.scss']
})
export class ServiceInvoiceDetailComponent implements OnInit {
  
  id;
  getData: any = {};
  skLoading: boolean = false;
  url: any;
  add_list:any =[];
  encryptedData: any;
  decryptedData:any;
  
  constructor(public location: Location, public cryptoService:CryptoService, public session: sessionStorage, private router: Router, public alert: DialogComponent, public service: DatabaseService, public editdialog: DialogService, public dialog: MatDialog, public route: ActivatedRoute, public toast: ToastrManager, public excelservice: ExportexcelService, public dialog1: DialogComponent) {
    
    
    this.url = this.service.uploadUrl + 'service_task/'
    
    this.route.params.subscribe(params => {
      this.id = params.id;
      this.service.currentUserID = params.id
      if (this.id) {
        this.getInvoiceDetail();
      }
    });
  }
  
  ngOnInit() {
  }
  
  getInvoiceDetail() {
    this.skLoading = true;
    this.encryptedData = this.service.payLoad ? { 'invoice_id': this.id }: this.cryptoService.encryptData({ 'invoice_id': this.id });
    this.service.post_rqst(this.encryptedData , "ServiceInvoice/serviceInvoiceDetail").subscribe((result => {
      this.decryptedData = this.service.payLoad ? result : this.cryptoService.decryptData(JSON.stringify(result));
      this.getData = this.decryptedData['result'];
      this.add_list = this.getData['add_list'];
      this.skLoading = false;
    }
    ));
    
  }
  back(): void {
    this.location.back()
  }
  
  loader: any;
  exportPdf() {
    this.loader = 1;
    this.skLoading = true;
    this.encryptedData = this.service.payLoad ? {'invoice_id':this.id}: this.cryptoService.encryptData({'invoice_id':this.id});
    this.service.post_rqst(this.encryptedData, "ServiceInvoice/exportInvoice").subscribe((result) => {
    this.decryptedData = this.service.payLoad ? result : this.cryptoService.decryptData(JSON.stringify(result));
      if (this.decryptedData['statusCode'] == 200) {
        this.skLoading = false;
        window.open(this.service.uploadUrl + 'orderPdf/' + this.decryptedData['file_name']);
        setTimeout(() => {
          this.loader = '';
          
        }, 700);
      } else {
        setTimeout(() => {
          this.loader = '';
          
        }, 700);
        this.skLoading = false;
        this.toast.errorToastr(this.decryptedData['statusMsg'])
      }
    }
    , err => {
      this.skLoading = false;
      
    }
    )
  }
  addPayment(invoice_id,invoice_final_amount) {
    const dialogRef = this.dialog.open(ServicePaymentAddComponent, {
      width: '500px',
      panelClass: 'cs-modal',
      data: {
        invoice_id:invoice_id,
        invoice_final_amount:invoice_final_amount
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result==true) {        
        this.getInvoiceDetail();
      }
    });
  }
  
}
