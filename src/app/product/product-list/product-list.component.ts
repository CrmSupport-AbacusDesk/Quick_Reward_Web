import { Component, OnInit } from '@angular/core';
import { slideToTop } from '../../router-animation/router-animation.component';
import { DatabaseService } from 'src/_services/DatabaseService';
import { Router } from '@angular/router';
import { DialogComponent } from 'src/app/dialog.component';
import { ToastrManager } from 'ng6-toastr-notifications';
import { sessionStorage } from 'src/app/localstorage.service';
import * as moment from 'moment';
import { MatDialog } from '@angular/material';
import { ProductUploadComponent } from 'src/app/product-upload/product-upload.component';
import { DesignationComponent } from 'src/app/user/designation/designation.component';
import { CryptoService } from 'src/_services/CryptoService';
import { ChunksUploaderComponent } from 'src/app/uploader-new/chunks-uploader/chunks-uploader.component';
import { ProgressService } from 'src/app/progress.service';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  animations: [slideToTop()]
})
export class ProductListComponent implements OnInit {
  segmentList: any = [];
  SubcategoryList: any = [];
  productlist: any = [];
  filter: any = false;
  data: any = [];
  page_limit: any;
  start: any = 0;
  gotoPageNumber: any = 1
  brand_list: any = [];
  product_brand: any = [];
  count: any;
  category_list: any = [];
  subCategory_list: any = [];
  total_page: any = 0;
  pagenumber: any = 0;
  loader: boolean = false;
  tab_active = 'all';
  scheme_active_count: any;
  filter_data: any = {};
  assign_login_data: any = {};
  logined_user_data: any = {};
  today_date: Date;
  fabBtnValue: any = 'add';
  excelLoader: boolean = false;
  pageCount: any;
  sr_no: number;
  datanotofound: boolean = false;
  downurl: any = ''
  totalCount: any;
  remainingCount: any;


  constructor(public dialog: DialogComponent, public cryptoService: CryptoService, public dialogs: MatDialog, public alert: DialogComponent, public service: DatabaseService, public rout: Router, public toast: ToastrManager, public session: sessionStorage, public progressService: ProgressService) {
    this.page_limit = service.pageLimit;
    this.downurl = service.downloadUrl
    this.assign_login_data = this.session.getSession();
    this.logined_user_data = this.assign_login_data.value.data;
    this.today_date = new Date();
    this.filter_data.start = this.start;
  }

  ngOnInit() {
    this.filter_data = this.service.getData();
    console.log(this.filter_data);
    if (this.filter_data.start) {
      this.start = this.filter_data.start;
    }
    this.getSegment();
    this.getProductList('');
  }


  pervious() {
    if (this.start > 0) {
      this.start -= this.page_limit;
      this.pagenumber = Math.ceil(this.start / this.page_limit) + 1; // Update current page number
      this.gotoPageNumber = this.pagenumber; // Update input box
      this.filter_data.start = this.start;
      this.getProductList('');
    }
  }

  nextPage() {
    if (this.pagenumber < this.total_page) {
      this.start += this.page_limit;
      this.pagenumber = Math.ceil(this.start / this.page_limit) + 1; // Update current page number
      this.gotoPageNumber = this.pagenumber; // Update input box
      this.filter_data.start = this.start;
      this.getProductList('');
    }
  }
  goToPage() {
    if (this.gotoPageNumber < 1 || this.gotoPageNumber > this.total_page) {
      this.toast.errorToastr("Invalid page number");
      return;
    }
    this.pagenumber = this.gotoPageNumber;
    this.start = (this.pagenumber - 1) * this.page_limit;
    this.filter_data.start = this.start;
    this.getProductList('');
  }

  getProductList(data) {
    if (this.pagenumber > this.total_page) {
      this.pagenumber = this.total_page;
      this.start = this.pageCount - this.page_limit;
    }
    if (this.start < 0) {
      this.start = 0;
    }

    this.loader = true;
    this.service.post_rqst({ 'filter': this.filter_data, 'start': this.start, 'pagelimit': this.page_limit }, "Master/productList").subscribe((result) => {
      if (result['statusCode'] == 200) {
        this.productlist = result['product_list'];
        this.pageCount = result['count'];
        this.scheme_active_count = result['scheme_active_count'];
        this.loader = false;
        if (this.productlist.length == 0) {
          this.datanotofound = false;
        } else {
          this.datanotofound = true;
          this.loader = false;
        }

        if (this.pagenumber > this.total_page) {
          this.pagenumber = this.total_page;
          this.start = this.pageCount - this.page_limit;
          this.gotoPageNumber = this.pagenumber;
        }
        else {
          this.pagenumber = Math.ceil(this.start / this.page_limit) + 1;
          this.gotoPageNumber = this.pagenumber;
        }
        this.total_page = Math.ceil(this.pageCount / this.page_limit);
        this.sr_no = this.pagenumber - 1;
        this.sr_no = this.sr_no * this.page_limit


        for (let i = 0; i < this.productlist.length; i++) {
          this.productlist[i]['encrypt_id'] = this.cryptoService.encryptId(this.productlist[i]['id'].toString());
          if (this.productlist[i].status == '1') {
            this.productlist[i].newStatus = true
          }
          else if (this.productlist[i].status == '0') {
            this.productlist[i].newStatus = false;
          }

          if (this.productlist[i].View == '1') {
            this.productlist[i].ViewStatus = true
          }
          else if (this.productlist[i].View == '0') {
            this.productlist[i].ViewStatus = false;
          }
          
        }
        
      }
      else {
        this.toast.errorToastr(result['statusMsg']);
        this.datanotofound = true;
        this.loader = false;
      }

    })
  }


  upload_excel(type) {
    const dialogRef = this.dialogs.open(ChunksUploaderComponent, {
      width: '500px',
      panelClass: 'cs-modal',
      disableClose: true,
      data: {
        'For': type
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result == true) {
        this.getProductList('');
      }
    });
  }
  excel_data: any = [];
  districtAppend: any;
  state4xl: any;

  lastBtnValue(value) {
    this.fabBtnValue = value;
  }
  getSegment() {
    this.service.post_rqst({}, "Master/getProductCategoryList").subscribe((result => {

      if (result['statusCode'] == 200) {
        this.segmentList = result['segment_list'];
      }
      else {
        this.toast.errorToastr(result['statusMsg'])
      }
    }))
  }


  getSubCatgory() {
    this.service.post_rqst({ 'id': this.filter_data.segment }, "Master/subCategoryList").subscribe((result => {
      if (result['statusCode'] == 200) {
        this.SubcategoryList = result['result'];
      }
      else {
        this.toast.errorToastr(result['statusMsg'])
      }
    }))
  }

  goToDetailHandler(pId) {
    window.open(`/product-detail/` + pId);
  }




  deleteProduct(id) {
    this.dialog.delete('Product Data !').then((result) => {
      if (result) {
        this.service.post_rqst({ "id": id }, "Master/deleteProduct").subscribe((result) => {
          if (result) {
            this.getProductList('');
          }
        });
      }
    });
  }


  refresh() {
    this.start = 0;
    this.gotoPageNumber = 1
    this.filter_data = {};
    this.getProductList('');
  }


  Filter() {
    this.filter = true;
  }
  close() {
    this.filter = false;
  }

  clear() {
    this.data.brand = "";
    this.data.category = "";
    this.data.sub_category = "";
    this.refresh();
  }




  date_format(): void {

    this.filter_data.date_created = moment(this.filter_data.date_created).format('YYYY-MM-DD');
    this.getProductList('');
  }


  updateStatus(index, id, event) {
    this.alert.confirm("You Want To Change Status !").then((result) => {
      if (result) {
        if (event.checked == false) {
          this.productlist[index].status = "0";
        }
        else {
          this.productlist[index].status = "1";
        }
        let value = this.productlist[index].status;
        this.service.post_rqst({ 'product_id': id, 'status': value, 'status_changed_by': this.logined_user_data.id, 'status_changed_by_name': this.logined_user_data.name }, "Master/productStatusChange")
          .subscribe(result => {

            if (result['statusCode'] == '200') {
              this.toast.successToastr(result['statusMsg']);
              this.getProductList('');
            }
            else {
              this.toast.errorToastr(result['statusMsg']);
            }
          })
      } else {
        this.getProductList('');
        this.toast.errorToastr("Your Data Is Safe...!")
      }
    })
  }
  updateViewStatus(index, id, event) {
    this.alert.confirm("You Want To Change Status !").then((result) => {
      if (result) {
        if (event.checked == false) {
          this.productlist[index].status_Flag = "0";
        }
        else {
          this.productlist[index].status_Flag = "1";
        }
        let value = this.productlist[index].status_Flag;
        this.service.post_rqst({ 'product_id': id, 'status_Flag': value, 'status_changed_by': this.logined_user_data.id, 'status_changed_by_name': this.logined_user_data.name }, "Master/productViewStatusChangeApp")
          .subscribe(result => {

            if (result['statusCode'] == '200') {
              this.toast.successToastr(result['statusMsg']);
              this.getProductList('');
            }
            else {
              this.toast.errorToastr(result['statusMsg']);
            }
          })
      } else {
        this.getProductList('');
        this.toast.errorToastr("Your Data Is Safe...!")
      }
    })
  }

  downloadExcel() {
    this.service.post_rqst({ 'filter': this.filter_data }, "Excel/product_list_for_excel").subscribe((result => {

      if (result['msg'] == true) {
        window.open(this.downurl + result['filename'])
        this.getProductList('');
      } else {
      }
    }));
  }

  openDialog(): void {
    const dialogRef = this.dialogs.open(DesignationComponent, {
      width: '500px',
      panelClass: 'cs-modal',
      disableClose: true,
      data: {
        'type': 'color_add'
      }

    });

    dialogRef.afterClosed().subscribe(result => {

      if (result == true) {
        this.getProductList('');
      }

    });
  }

  downloader: any = false;
  download_percent: any;
  downValue: any;
  downType: any;
  downTypeId: any;
  downFilter: any;
  totalDownloadCount: any;
  remainingDownloadCount: any;

  // downloadInChunks() {
  //   this.progressService.getDownloaderActive().subscribe(downloaderActive => {
  //     this.downloader = downloaderActive
  //   })
  //   if (this.downloader) {
  //     alert('One Download in Progress. Please Wait !');
  //     return;
  //   }
  //   // this.downFilter = this.filter;
  //   // this.downType = this.type;
  //   // this.downTypeId = this.type_id;
  //   // this.downValue = this.value;
  //   this.downloadExcel2();
  // }

  // downloadExcel2() {
  //   this.downloader = true;
  //   if (this.download_percent == null) {
  //     this.download_percent = 0;
  //   }

  //   this.encryptedData = this.service.payLoad ? { 'search': this.downValue, 'type': this.downTypeId } : this.cryptoService.encryptData({ 'search': this.downValue, 'type': this.downTypeId, 'filter': this.downFilter });

  //   this.service.post_rqst(this.encryptedData, "Excel/drListInchunks").subscribe((result) => {
  //     

  //     if (result['statusCode'] == 400) {
  //       this.downloader = false;
  //       this.download_percent = null;
  //       this.progressService.setDownloadProgress(this.download_percent);
  //       this.progressService.setDownloaderActive(this.downloader);
  //       window.open(this.downurl + result['filename']);
  //       this.getProductList('');

  //     } else if (result['statusCode'] == 200) {
  //       this.download_percent = ((result['totalCount'] - result['leftCount']) / result['totalCount']) * 100;
  //       if (this.download_percent > 100) {
  //         this.download_percent = 100;
  //       }
  //       this.totalDownloadCount = result['totalCount'];
  //       this.remainingDownloadCount = result['leftCount'];
  //       this.progressService.setTotalCount(this.totalDownloadCount);
  //       this.progressService.setRemainingCount(this.remainingDownloadCount);
  //       this.progressService.setDownloadProgress(this.download_percent);
  //       this.progressService.setDownloaderActive(this.downloader);
  //       console.log(this.download_percent);

  //       this.downloadExcel2();
  //     }

  //   }, err => {
  //     this.excelLoader = false;

  //   });
  // }

  downloadInChunks() {
    this.service.post_rqst({ 'filter': this.filter_data, 'start': this.start, 'pagelimit': this.page_limit }, "DownloadMaster/createQueueRequest").subscribe((result) => {
      if (result['statusCode'] == 200) {
        if (result['code'] == 0) {
          this.toast.errorToastr(result['statusMsg']);
          return;
        }

        if (result['code'] == 1) {
          this.downloadExcel2();
        }
      }
    }, err => {
      this.excelLoader = false;
    });
  }

  downloadExcel2() {
    let can
    this.progressService.getCancelReq().subscribe(cancelReq => {
      can = cancelReq
    })
    if (can == false) {
      this.downloader = true;
      if (this.download_percent == null) {
        this.download_percent = 0;
      }
      this.service.post_rqst({ 'filter': this.filter_data, 'start': this.start, 'pagelimit': this.page_limit }, "DownloadMaster/downloadProductData").subscribe((result) => {

        if (result['code'] === 1) {
          this.downloader = false;
          this.download_percent = null;
          window.open(this.downurl + result['filename']);
          this.progressService.setTotalCount(0);
          this.progressService.setRemainingCount(0);
          this.progressService.setDownloadProgress(0);
          this.progressService.setDownloaderActive(false);
          this.getProductList('');
        } else if (result['code'] === 0) {
          this.download_percent = Math.ceil(((result['totalCount'] - result['leftCount']) / result['totalCount']) * 100);

          if (this.download_percent > 100) {
            this.download_percent = 100;
          }
          this.totalCount = result['totalCount'];
          this.remainingCount = result['leftCount'];
          this.progressService.setTotalCount(this.totalCount);
          this.progressService.setRemainingCount(this.remainingCount);
          this.progressService.setDownloadProgress(this.download_percent);
          this.progressService.setDownloaderActive(this.downloader);
          this.downloadExcel2();
        }
      }, err => {
        this.excelLoader = false;

      });
    }
  }
}
