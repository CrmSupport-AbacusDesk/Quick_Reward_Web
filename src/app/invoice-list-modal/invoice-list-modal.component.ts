import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { DatabaseService } from 'src/_services/DatabaseService';
import { sessionStorage } from '../localstorage.service';
import { Router } from '@angular/router';
import { DialogComponent } from '../dialog.component';
import { ToastrManager } from 'ng6-toastr-notifications';
import { AttendanceDetailComponent } from '../attendance-detail/attendance-detail.component';
import { CryptoService } from 'src/_services/CryptoService';


@Component({
  selector: 'app-invoice-list-modal',
  templateUrl: './invoice-list-modal.component.html'
})
export class InvoiceListModalComponent implements OnInit {
  invoice_listing:any =[];
  loader:boolean = false;
  noResult:boolean = false;
  encryptedData: any;
  decryptedData:any;

  constructor(@Inject(MAT_DIALOG_DATA)public data,
  public cryptoService:CryptoService, 
  public service:DatabaseService,public session: sessionStorage,public dialog:MatDialog,public rout:Router, public dialogRef: MatDialogRef<AttendanceDetailComponent>,public alert:DialogComponent,public toast:ToastrManager){
    
    this.invoice_data();
  }
  
  ngOnInit() {
  }
  
  
  
  close(){
    this.dialogRef.close();
  }
  
  
  invoice_data() {
    this.loader = true;
    this.encryptedData = this.service.payLoad ? {'dr_code':this.data.dr_code, 'start_date':this.data.start_date, 'end_date':this.data.end_date}: this.cryptoService.encryptData({'dr_code':this.data.dr_code, 'start_date':this.data.start_date, 'end_date':this.data.end_date});
    this.service.post_rqst(this.encryptedData, "CustomerNetwork/dateWiseInvoiceBill").subscribe((result) => {
      this.decryptedData = this.service.payLoad ? result : this.cryptoService.decryptData(JSON.stringify(result));
     if(this.decryptedData['statusCode']==200){
      this.invoice_listing = this.decryptedData['invoice_bill'];
      setTimeout(() => {
        this.loader = false;

        if(this.invoice_listing.length == 0){
          this.noResult = true;
        }
      }, 500);

    }else{
      this.toast.errorToastr('statusMsg')
      setTimeout(() => {
        this.loader = false;
        this.noResult = true;
      }, 500);
    }
     
    });
  }
  
  goTODetail(id){
    this.rout.navigate(['/billing-details/'+id],{ queryParams: { id} });
    this.dialogRef.close();
  }
  
}
