import { Component, OnInit } from '@angular/core';
import { MatBottomSheet, MatDialog } from '@angular/material';
import { ToastrManager } from 'ng6-toastr-notifications';
import { BottomSheetComponent } from 'src/app/bottom-sheet/bottom-sheet.component';
import { sessionStorage } from 'src/app/localstorage.service';
import { DatabaseService } from 'src/_services/DatabaseService';
import { ProductWiseSecondaryReportModalComponent } from './product-wise-secondary-report-modal/product-wise-secondary-report-modal.component';
import { CryptoService } from 'src/_services/CryptoService';

@Component({
  selector: 'app-prouct-wise-secondary-report',
  templateUrl: './prouct-wise-secondary-report.component.html',
  styleUrls: ['./prouct-wise-secondary-report.component.scss']
})
export class ProuctWiseSecondaryReportComponent implements OnInit {
  loader: boolean = false;
  secondaryProductReportList: any = [];
  search: any = {};
  login_data: any = [];
  pageCount: any;
  total_page: any;
  pagenumber: any = 0;
  start: any = 0;
  pagelimit: any = 50;
  encryptedData:any;
  decryptedData:any;

  constructor(private bottomSheet: MatBottomSheet,public cryptoService:CryptoService, public service: DatabaseService, public toast: ToastrManager, public session: sessionStorage, public dialog: MatDialog,) {
    this.login_data = this.session.getSession();
    this.login_data = this.login_data.value.data;;

    this.getSecondaryProductWiseReport();
  }

  ngOnInit() {

  }

  refresh() {
    this.getSecondaryProductWiseReport()
  }

  pervious() {
    this.start = this.start - this.pagelimit;
    this.getSecondaryProductWiseReport();
  }

  nextPage() {
    this.start = this.start + this.pagelimit;
    this.getSecondaryProductWiseReport();
  }

  getSecondaryProductWiseReport() {
    this.loader = true;
    this.encryptedData = this.service.payLoad ? { 'search': this.search, 'start': this.start, 'pagelimit': this.pagelimit }: this.cryptoService.encryptData({ 'search': this.search, 'start': this.start, 'pagelimit': this.pagelimit });
    this.service.post_rqst(this.encryptedData, 'Reports/productWiseSecondaryReport').subscribe((result) => {
      this.decryptedData = this.service.payLoad ? result : this.cryptoService.decryptData(JSON.stringify(result));
      if (this.decryptedData['statusCode'] == 200) {
        this.secondaryProductReportList = this.decryptedData['result']['order_item'];
        this.loader = false;
        this.pageCount = this.decryptedData['count'];
        this.pagenumber = Math.ceil(this.start / this.pagelimit) + 1;
        this.total_page = Math.ceil(this.pageCount / this.pagelimit);
      }
      else {
        this.toast.errorToastr(this.decryptedData['statusMsg']);
      }
    }, err => {
      this.loader = false;

    })
  }



  openBottomSheet(): void {
    this.bottomSheet.open(BottomSheetComponent, {
      data: {
        'filterPage': 'product_wise_secondary_report',
      }
    });
    this.bottomSheet._openedBottomSheetRef.afterDismissed().subscribe((data) => {
      this.search.date_from = data.date_from;
      this.search.date_to = data.date_to;
      this.search.userId = data.user_id;
      this.getSecondaryProductWiseReport();
    })
  }

  getproductWiseSecondaryReportExcel() {
    this.loader = true;
    this.encryptedData = this.service.payLoad ? { 'search': this.search, 'start': this.start, 'pagelimit': this.pagelimit }: this.cryptoService.encryptData({ 'search': this.search, 'start': this.start, 'pagelimit': this.pagelimit });
    this.service.post_rqst(this.encryptedData, "Excel/productWiseSecondaryReport").subscribe((result) => {
      this.decryptedData = this.service.payLoad ? result : this.cryptoService.decryptData(JSON.stringify(result));
      if (this.decryptedData['msg'] == true) {
        this.loader = false;
        window.open(this.service.downloadUrl + this.decryptedData['filename']);

        this.getSecondaryProductWiseReport();
      }
    });
  }

  openProductWiseSecondarySubCategoryReport(drId, category, startDate, endDate, salesUserId): void {
    const dialogRef = this.dialog.open(ProductWiseSecondaryReportModalComponent, {
      width: '800px',
      panelClass: 'cs-modal',
      disableClose: true,
      data: {
        'from': 'product-wise-sub-category',
        drId: drId,
        category: category,
        startDate: startDate,
        endDate: endDate,
        salesUserId: salesUserId
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result != false) {

      }

    });
  }

}
