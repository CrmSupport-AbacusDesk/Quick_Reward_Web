import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Router } from '@angular/router';
import { ToastrManager } from 'ng6-toastr-notifications';
import { sessionStorage } from 'src/app/localstorage.service';
import { DatabaseService } from 'src/_services/DatabaseService';
import { CryptoService } from 'src/_services/CryptoService';

@Component({
  selector: 'app-product-wise-secondary-report-modal',
  templateUrl: './product-wise-secondary-report-modal.component.html'
})
export class ProductWiseSecondaryReportModalComponent implements OnInit {
  reportSubcategoryData: any = [];
  reportProductCodeData: any = [];
  encryptedData:any;
  decryptedData:any;


  constructor(public toast: ToastrManager, public cryptoService:CryptoService, @Inject(MAT_DIALOG_DATA) public modelData, public rout: Router, public session: sessionStorage, public service: DatabaseService, public dialogRef: MatDialogRef<ProductWiseSecondaryReportModalComponent>) {
    this.getProductWisePriSecReport();
  }

  ngOnInit() {
  }

  getProductWisePriSecReport() {
    this.encryptedData = this.service.payLoad ? this.modelData: this.cryptoService.encryptData(this.modelData);
    this.service.post_rqst(this.encryptedData, "Master/getProductWiseSecReportSubcategory").subscribe(result => {
      this.decryptedData = this.service.payLoad ? result : this.cryptoService.decryptData(JSON.stringify(result));

      if ( this.decryptedData['order_item'].length > 0) this.reportSubcategoryData =  this.decryptedData['order_item'][0]['itemData'];
      for (var i = 0; i < this.reportSubcategoryData.length; i++) {
        this.reportSubcategoryData[i]['total_amount'] = parseInt(this.reportSubcategoryData[i]['total_amount']);
      }
    });
  }

  getProductCodes(subCategory) {
    subCategory = subCategory == null ? '' : subCategory;
    this.encryptedData = this.service.payLoad ? { data: this.modelData, subCategory: subCategory, category: this.modelData.category }: this.cryptoService.encryptData({ data: this.modelData, subCategory: subCategory, category: this.modelData.category });
    this.service.post_rqst(this.encryptedData, "product/getProductWiseSecReportCatNo").subscribe(result => {
      this.decryptedData = this.service.payLoad ? result : this.cryptoService.decryptData(JSON.stringify(result));
      if (this.decryptedData['order_item'].length > 0) this.reportProductCodeData = this.decryptedData['order_item'][0]['itemData'];
      for (var i = 0; i < this.reportProductCodeData.length; i++) {
        this.reportProductCodeData[i]['total_amount'] = parseInt(this.reportProductCodeData[i]['total_amount']);
      }
    });
  }


}
