import { Component, OnInit } from '@angular/core';
import { MatBottomSheet, MatDialog } from '@angular/material';
import { ToastrManager } from 'ng6-toastr-notifications';
import { BottomSheetComponent } from 'src/app/bottom-sheet/bottom-sheet.component';
import { sessionStorage } from 'src/app/localstorage.service';
import * as moment from 'moment';
import { DatabaseService } from 'src/_services/DatabaseService';
import { ProductWiseSecondaryReportModalComponent } from 'src/app/reports/prouct-wise-secondary-report/product-wise-secondary-report-modal/product-wise-secondary-report-modal.component';



@Component({
  selector: 'app-loyalty-report-scan-ageing',
  templateUrl: './loyalty-report-scan-ageing.component.html',
  styleUrls: ['./loyalty-report-scan-ageing.component.scss']
})
export class LoyaltyReportScanAgeingComponent implements OnInit {

  loader: boolean = false;
  secondaryProductReportList: any = [];
  search: any = {};
  login_data: any = [];
  page_limit: any = 50;
  start: any = 0;
  pagenumber: any = '';
  total_page: any;
  pageCount: any;
  sr_no: any;
  filter: any = {};
  filtering: any = false;
  length:number =0;

  constructor(private bottomSheet: MatBottomSheet, public service: DatabaseService, public toast: ToastrManager, public session: sessionStorage, public dialog: MatDialog,) {
    this.login_data = this.session.getSession();
    this.login_data = this.login_data.value.data;
  }

  ngOnInit() {
    this.length =0;
    this.getSecondaryProductWiseReport('',this.length);
  }

  refresh(){
    this.start = 0;
    this.getSecondaryProductWiseReport('',this.length)
  }

  pervious() {
    this.start = this.start - this.page_limit;
    this.getSecondaryProductWiseReport('',this.length);
  }

  nextPage() {
    this.start = this.start + this.page_limit;
    this.getSecondaryProductWiseReport('',this.length);
  }

  header_list: any = [];


  getSecondaryProductWiseReport(action: any,length) {
    this.loader = true;
    
    if (this.pagenumber > this.total_page) {
      this.pagenumber = this.total_page;
      this.start = this.pageCount - this.page_limit;
    } if (this.start < 0) {
      this.start = 0
    }


//  if (this.filter.date_from) {
//       this.filter.date_from = moment(this.filter.date_from).format('YYYY-MM-DD');
//     }
//     if (this.filter.date_to) {
//       this.filter.date_to = moment(this.filter.date_to).format('YYYY-MM-DD');
//     }

//     if (this.filter.date) this.filtering = true;
//     this.filter.mode = 0;
//     this.filter.limit = length;

//     if (action == 'refresh') {
//       this.filter.date_from = '';
//       this.filter.date_to = '';
//     }



    this.service.post_rqst({'start': this.start, 'pagelimit': this.page_limit,'filter': this.filter}, 'LoyaltyReport/point_category_state_wise_scan_report').subscribe((resp) => {
  
      if (resp['statusCode'] == 200) {
        this.secondaryProductReportList = resp['result'];
        this.header_list = resp.headers;

        this.pageCount = resp['count'];

        if (this.pagenumber > this.total_page) {
          this.pagenumber = this.total_page;
          this.start = this.pageCount - this.page_limit;
        }
        else {
          this.pagenumber = Math.ceil(this.start / this.page_limit) + 1;
        }
        this.total_page = Math.ceil(this.pageCount / this.page_limit);
        this.sr_no = this.pagenumber - 1;
        this.sr_no = this.sr_no * this.page_limit;
        
  
        this.loader = false;

      }
      else {
        this.toast.errorToastr(resp['statusMsg']);
      }
    }, err => {
      this.loader = false;

    })
  }

  public onDate(event) {
    console.log(event);
    this.filter.date_to = moment(event.target.value).format('YYYY-MM-DD');
    this.filter.date_from = moment(event.target.value).format('YYYY-MM-DD');

    this.getSecondaryProductWiseReport('',this.length);

  }

  openBottomSheet(): void {
    this.bottomSheet.open(BottomSheetComponent, {
      data: {
        'filterPage': 'product_wise_secondary',
      }
    });
    this.bottomSheet._openedBottomSheetRef.afterDismissed().subscribe((data) => {
      this.filter.date_from = data.date_from;
      this.filter.date_to = data.date_to;
      // this.search.userId = data.user_id;
    this.length =0;
      this.getSecondaryProductWiseReport(this.filter.date_to,this.filter.date_from);
    })
  }

  getproductWiseSecondaryReportExcel() {
    this.loader = true;
    this.service.post_rqst({ 'search': this.search }, "LoyaltyReport/excel_point_category_state_wise_scan_report").subscribe((result) => {
      if (result['msg'] == true) {
        this.loader = false;
        window.open(this.service.downloadUrl + result['filename'])
        this.getSecondaryProductWiseReport('',this.length);
      }
    });
  }

  openProductWiseSecondarySubCategoryReport(drId, category, startDate, endDate, salesUserId): void {
    const dialogRef = this.dialog.open(ProductWiseSecondaryReportModalComponent, {
      width: '800px',
      panelClass: 'cs-modal',
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