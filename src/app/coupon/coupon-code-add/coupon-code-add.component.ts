import { Component, OnInit } from '@angular/core';
import { DatabaseService } from 'src/_services/DatabaseService';
import { ToastrManager } from 'ng6-toastr-notifications';
import { Router, ActivatedRoute } from '@angular/router';
import { DialogComponent } from 'src/app/dialog.component';
import * as moment from 'moment';
import { sessionStorage } from 'src/app/localstorage.service';
import { Location } from '@angular/common';
import { CryptoService } from 'src/_services/CryptoService';
import { ProgressService } from 'src/app/progress.service';

@Component({
  selector: 'app-coupon-code-add',
  templateUrl: './coupon-code-add.component.html'
})
export class CouponCodeAddComponent implements OnInit {
  userData: any;
  userId: any;
  userName: any;
  product_data: any = []
  coupon_summary_list: any = []
  data: any = {};
  filter: any = {};
  savingFlag: boolean = false;
  page_limit: any;
  start: any = 0;
  pagenumber: any = 1;
  total_page: any;
  pageCount: any;
  sr_no: any = 0;
  loader: boolean = false;
  noResult: boolean = false;
  assign_login_data: any = [];
  assign_login_data2: any = [];
  uploadurl: any;
  today_date: Date;
  downurl:any;
  downloader: any = false;
  download_percent: any;
  totalDownloadCount: any;
  remainingDownloadCount: any;
  totalCount: any;
  pointCategories_data: any;
  remainingCount: any;
  organisation_data:any={}

  constructor(public location: Location, public cryptoService:CryptoService, public service: DatabaseService, public route: ActivatedRoute, public rout: Router, public toast: ToastrManager, public dialog: DialogComponent, public session: sessionStorage,private progressService: ProgressService) {
    this.downurl = service.downloadUrl;
    this.page_limit = service.pageLimit;
    this.uploadurl = service.uploadUrl;
    this.assign_login_data = this.session.getSession();
    this.assign_login_data = this.assign_login_data.value;
    this.assign_login_data2 = this.assign_login_data.data;
    this.userData = JSON.parse(localStorage.getItem('st_user'));
    this.organisation_data=this.userData.organisation_data
    this.userId = this.userData['data']['id'];
    this.userName = this.userData['data']['name'];
    this.today_date = new Date();
    this.data.coupon_type = 'Item Box';
    
  }

  ngOnInit() {
    this.getProduct('');
    this.generated_coupon_listing();
    this.getPaperSize()

    if(this.assign_login_data2.organisation_data.qr_genration==1){
      this.pointCategory_data()
    }
  }


  pervious() {
    this.start = this.start - this.page_limit;
    this.generated_coupon_listing();
  }

  nextPage() {
    this.start = this.start + this.page_limit;
    this.generated_coupon_listing();
  }



  refresh() {
    this.filter = {};
    this.generated_coupon_listing();
  }

  getProduct(searcValue) {
    this.filter.coupon_type = this.data.coupon_type;
    this.filter.product_name = searcValue;
    this.service.post_rqst({ 'filter': this.filter }, 'CouponCode/productList').subscribe((result) => {
      if (result['statusCode'] == 200) {
        this.product_data = result['data'];
      }
      else {
        this.toast.errorToastr(result['statusMsg']);
      }
    }, error => {
    })
  }

  MobileNumber(event: any) {
    const pattern = /[0-9\+\-\ ]/;
    let inputChar = String.fromCharCode(event.charCode);
    if (event.keyCode != 8 && !pattern.test(inputChar)) { event.preventDefault(); }
  }

  date_format(): void {
    this.filter.date_created = moment(this.filter.date_created).format('YYYY-MM-DD');
    this.generated_coupon_listing();
  }

  pointCategory_data(searcValue='') {
    this.filter.point_type = 'Item Box';
    this.filter.point_category_name = searcValue;
    console.log(this.service.payLoad)
    this.service.post_rqst({'filter': this.filter}, 'Master/pointCategoryMasterList').subscribe((result) => {
      if (result['statusCode'] == 200) {
        this.pointCategories_data = result['point_category_list'];
      }
      else {
        this.toast.errorToastr(result['statusMsg'])
      }
    }, error => {
    })
  }


  paperSize:any =[];

  getPaperSize(){
    this.service.post_rqst('', "CouponCode/organisationWiseTemplateList").subscribe((result => {
      if(result['statusCode'] == 200){
        console.log(result);
        
        this.paperSize = result['result'];
      }
      else{
        this.toast.errorToastr(result['statusMsg']);
      }
      // this.sales_type = this.decryptedData ['all_designation'];
    }));
  }

  printStatus(id) {
    this.service.post_rqst({'id':id}, "CouponCode/updateCoponHistoryStatus").subscribe((result => {
      if(result['statusCode'] == 200){
        this.toast.successToastr(result['statusMsg']);
      }
      else{
        this.toast.errorToastr(result['statusMsg']);
      }
    }));
  }

  generated_coupon_listing() {
    this.loader = true;
    if (this.pagenumber > this.total_page) {
      this.pagenumber = this.total_page;
      this.start = this.pageCount - this.page_limit;
    }
    if (this.start < 0) {
      this.start = 0;
    }
    this.service.post_rqst({ 'search': this.filter, 'start': this.start, 'pagelimit': this.page_limit }, 'CouponCode/couponSummaryList').subscribe((result) => {
      if (result['statusCode'] == 200) {
        this.coupon_summary_list = result['coupon_summary_list'];
        this.coupon_summary_list.forEach(item => item['encrypt_id'] = this.cryptoService.encryptId(item['id']));
        this.loader = false;
        this.pageCount = result['count'];
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


        setTimeout(() => {
          if (this.coupon_summary_list.length == 0) {
            this.noResult = true;
          }
        }, 500);


      }
      else {
        this.toast.errorToastr(result['statusMsg']);
      }
    }, error => {
    })
  }


  findProductId(code) {
    let index = this.product_data.findIndex(row => row.product_code == code)
    if (index != -1) {
      this.data.product_id = this.product_data[index].product_id;
      this.data.product_name = this.product_data[index].product_name;
      this.data.sku_code = this.product_data[index].sku_code;
      this.data.mrp = this.product_data[index].mrp;
      this.data.qty = this.product_data[index].qty;
      this.data.point_category_id = this.product_data[index].point_category_id;
      this.data.point_category_name = this.product_data[index].point_category_name;
      this.data.uom = this.product_data[index].uom;
      this.data.small_packing_size = this.product_data[index].small_packing_size;
    }
  }

  findCategoryName(id){
    let index = this.pointCategories_data.findIndex(row => row.id == id)

    if(index != -1){
      this.data.point_category_name = this.product_data[index].point_category_name;
    }
  }

  findId(id){
    let index = this.paperSize.findIndex(row => row.id == id)
    if(index != -1){
      this.data.paper_size = this.paperSize[index].size;
      this.data.temp_image = this.paperSize[index].temp_image;
    }
  }


  submitDetail() {
    if (parseInt(this.data.total_coupon) < 1) {
      this.toast.errorToastr('Minimum coupon value 1');
      return
    }
    else if (this.assign_login_data2.organisation_data.qr_printing == 0 && this.data.total_coupon > 5000) {
      this.toast.errorToastr('Total Coupon Should be less than or Equal 5000');
      this.savingFlag = false;
      return
    }
    else if (this.assign_login_data2.organisation_data.qr_printing == 1 && this.data.total_coupon > 25000) {
      this.toast.errorToastr('Total Coupon Should be less than 25000');
      this.savingFlag = false;
      return
    }

    else {
      this.data.created_by_name = this.userName;
      this.data.created_by_id = this.userId;
      this.savingFlag = true;
      this.service.post_rqst({ 'data': this.data }, this.data.coupon_type == 'Item Box' ? 'CouponCode/genrateCoupon' : 'CouponCode/genrateCouponMasterBox').subscribe((result) => {
        if (result['statusCode'] == 200) {
          this.toast.successToastr(result['statusMsg']);
          if(this.assign_login_data2.organisation_data.qr_printing == 0)
          {
            this.rout.navigate(['coupon-list/coupon-add/coupon-code-detail/' + this.cryptoService.encryptId(result['offer_coupon_history_id'])]);
          }
          else
          {
            this.generated_coupon_listing();            
          }
          this.savingFlag = false;
          this.data = {};
        }
        else {
          this.toast.errorToastr(result['statusMsg']);
          this.savingFlag = false;
        }
      })
    }

  }
  deletecoupon(id) {
    this.dialog.delete('Coupon!').then((res) => {
      if (res) {
        this.service.post_rqst({ 'coupon_summary_id': id }, 'CouponCode/deleteCouponSummary').subscribe((result) => {
          if (result['statusCode'] == 200) {
            this.toast.successToastr(result['statusMsg']);
            this.generated_coupon_listing()
          }
          else {
            this.toast.errorToastr(result['statusMsg']);
          }
        })
      }
    });


  }



  downloadCoupon(id) {
    this.service.post_rqst({ 'id': id }, "Excel/coupon_code_all_list").subscribe((result) => {
      document.location.replace(this.uploadurl + 'Download_excel/couponcode.csv');
      if (result['msg'] == true) {
        this.toast.successToastr('Success');
      }
      else {
        this.toast.errorToastr('Failed');
      }
    })
  }


  back() {
    this.location.back()
  }

  exportAsXLSX(id) {
    this.loader = true;
    this.service.post_rqst({ 'id': id }, '/Excel/coupon_code_all_list_new').subscribe((result => {
      if (result['msg'] == true) {
        this.loader = false;
        window.open(this.downurl + result['filename'])
        // this.generated_coupon_listing();
      } else {
        this.loader = false;
      }
    }));
  }
  downloadInChunks(id) {
    this.service.post_rqst({ 'id': id }, "DownloadMaster/createQueueRequest").subscribe((result) => {
      if (result['statusCode'] == 200) {
        if (result['code'] == 0) {
          this.toast.errorToastr(result['statusMsg']);
          return;
        }

        if (result['code'] == 1) {
          this.downloadExcel2(id);
        }
      }
    }, err => {
      this.loader = false;
    });
  }

  downloadExcel2(id) {
    let can
    this.progressService.getCancelReq().subscribe(cancelReq => {
      can = cancelReq
    })
    if (can == false) {
      this.downloader = true;
      if (this.download_percent == null) {
        this.download_percent = 0;
      }
      this.service.post_rqst({ 'id': id }, "DownloadMaster/downloadCouponCodeHistoryData").subscribe((result) => {
        if (result['code'] === 1) {
          this.downloader = false;
          this.download_percent = null;
          window.open(this.downurl + result['filename']);
          this.progressService.setTotalCount(0);
          this.progressService.setRemainingCount(0);
          this.progressService.setDownloadProgress(0);
          this.progressService.setDownloaderActive(false);
          this.generated_coupon_listing();
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
          this.downloadExcel2(id);
        }
      }, err => {
        this.loader = false;

      });
    }
  }
}
