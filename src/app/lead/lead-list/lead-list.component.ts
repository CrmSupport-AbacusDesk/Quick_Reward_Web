import { Component, OnInit } from '@angular/core';
import { slideToTop } from '../../router-animation/router-animation.component';
import { DatabaseService } from 'src/_services/DatabaseService'; import { ActivatedRoute, Router } from '@angular/router';
import { DialogComponent } from 'src/app/dialog.component';
import * as moment from 'moment';
import { sessionStorage } from 'src/app/localstorage.service';
import { UploadFileModalComponent } from 'src/app/upload-file-modal/upload-file-modal.component';
import { MatBottomSheet, MatDialog } from '@angular/material';
import { ChangeEnquiryStatusComponent } from '../change-enquiry-status/change-enquiry-status.component';
import { ToastrManager } from 'ng6-toastr-notifications';
import { CryptoService } from 'src/_services/CryptoService';
import { ProgressService } from 'src/app/progress.service';
import { ChunksUploaderComponent } from 'src/app/uploader-new/chunks-uploader/chunks-uploader.component';
import { BottomSheetComponent } from 'src/app/bottom-sheet/bottom-sheet.component';

@Component({
  selector: 'app-lead-list',
  templateUrl: './lead-list.component.html',
  animations: [slideToTop()]


})
export class LeadListComponent implements OnInit {
  active_tab: any = 'Pending';
  fabBtnValue: any = 'add';
  lead_List: any = [];
  datanotfound: boolean = true;
  type_id: any = 1;
  gotoPageNumber: number;
  loader: any = false;
  data: any = [];
  value: any = {};
  allSourceList: any = []
  data_not_found = false;
  search_val: any = {}
  type: any;
  today_date: any;
  count_list: any = {};
  login_data: any = {};
  login_data5: any = {};
  add: any = {};
  filter: any = {}
  enquiryList: any = []
  sr_no: any = 0;
  pageCount: any;
  total_page: any;
  pagenumber: any = 1;
  start: any = 0;
  count: any = {};
  states: any = []
  page_limit: any;
  networkType: any;
  sevenDaysBeforeDate: any;
  threeDaysBeforeDate: any
  salesUser: any = []
  downloader: any = false;
  download_percent: any;
  totalDownloadCount: any;
  remainingDownloadCount: any;
  totalCount: any;
  remainingCount: any;
  downurl: any = '';
  headerData: any = [];
  allStageList: any = [];


  constructor(public service: DatabaseService, public cryptoService: CryptoService, private bottomSheet: MatBottomSheet, public toast: ToastrManager, public dialog: DialogComponent, public alrt: MatDialog, public router: Router, public route: ActivatedRoute, public session: sessionStorage, private progressService: ProgressService, public dialogs: MatDialog) {
    this.downurl = service.downloadUrl;
    this.page_limit = this.service.pageLimit
    this.login_data = this.session.getSession();
    this.login_data = this.login_data.value;
    this.login_data5 = this.login_data.data;

    const today = new Date();
    const sevenDaysBefore = new Date();
    sevenDaysBefore.setDate(today.getDate() - 7);
    this.sevenDaysBeforeDate = sevenDaysBefore.toISOString().slice(0, 10);
    console.log('7 days minus date', this.sevenDaysBeforeDate)
    const threeDaysBefore = new Date();
    threeDaysBefore.setDate(today.getDate() - 3);
    this.threeDaysBeforeDate = threeDaysBefore.toISOString().slice(0, 10);
    console.log('3 days minus date', this.threeDaysBeforeDate);

    this.route.params.subscribe(params => {
      this.today_date = new Date().toISOString().slice(0, 10);

      this.type_id = params.id;
      this.type = params.type;
    });
  }

  ngOnInit() {
    this.filter = this.service.getData()
    if (this.filter.status) {
      this.active_tab = this.filter.status
    }
    this.leadList(this.active_tab);
    this.getNetworkType();
    this.getSalesUser('');
    this.getStateList('');
    this.getSourceList();
    this.getStageList();

  }

  previous() {
    if (this.start > 0) {
      this.start = this.start - this.page_limit;
      this.leadList(this.active_tab);
    }
  }

  nextPage() {
    if (this.pagenumber < this.total_page) {
      this.start = this.start + this.page_limit;
      this.leadList(this.active_tab);
    }
  }

  public onDate(event) {
    this.filter.date_created = moment(event.target.value).format('YYYY-MM-DD');
    this.leadList(this.active_tab);
  }

  getNetworkType() {
    this.service.post_rqst('', "Enquiry/getAllEnquiryType").subscribe((result => {
      result = this.service.payLoad ? result : this.cryptoService.decryptData(JSON.stringify(result));
      if (result['statusCode'] == 200) {
        this.networkType = result['modules'];
      }
      else {
        this.toast.errorToastr(result['statusMsg'])
      }
    }))
  }


  openBottomSheet(): void {
    this.bottomSheet.open(BottomSheetComponent, {
      data: {
        'filterPage': 'Enquiry_List',
      }
    });
    this.bottomSheet._openedBottomSheetRef.afterDismissed().subscribe((modelData) => {
      this.filter.date_from = modelData.date_from;
      this.filter.date_to = modelData.date_to;
       this.leadList(this.active_tab);
    })
  }

  getSalesUser(searchValue) {
    this.service.post_rqst({ 'search': searchValue }, "Expense/salesUserList").subscribe((result => {
      result = this.service.payLoad ? result : this.cryptoService.decryptData(JSON.stringify(result));
      if (result['statusCode'] == 200) {
        this.salesUser = result['all_sales_user'];
      }
      else {
        this.toast.errorToastr(result['statusMsg'])
      }
    }))
  }


  leadList(status) {
    this.loader = true;
    if (this.search_val.modified_date) {
      this.search_val.modified_date = moment(this.search_val.modified_date).format('YYYY-MM-DD');

    }
    if (this.pagenumber > this.total_page) {
      this.pagenumber = this.total_page;
      this.start = this.pageCount - this.page_limit;
    }
    if (this.start < 0) {
      this.start = 0;
    }

    if (status == 'subTab') {
      this.active_tab = 'Inprocess';
      status = this.active_tab;
    }

    this.filter.status = status;
    this.filter.source = this.filter.source && this.filter.source.length ? this.filter.source : undefined;
    this.service.post_rqst({ 'filter': this.filter, 'start': this.start, 'pagelimit': this.page_limit }, "Enquiry/enquiryList")
      .subscribe((result => {

        if (result['statusCode'] == 200) {
          this.count = result['count'];
          this.lead_List = result['enquiry_list'];
          this.headerData = result['headerData'];
          this.lead_List.forEach(item => item['encrypt_id'] = this.cryptoService.encryptId(item['id']));
          // Calculate total pages based on the selected status
          this.pageCount = this.count[status] || this.count.Lost;
          this.total_page = Math.ceil(parseInt(this.pageCount) / this.page_limit);

          this.pagenumber = Math.ceil(this.start / this.page_limit) + 1;
          this.gotoPageNumber = this.pagenumber; // ✅ Update input box when navigating pages

          if (this.lead_List.length == 0) {
            this.datanotfound = true;
          } else {
            this.datanotfound = false;
          }
          this.pagenumber = Math.ceil(this.start / this.page_limit) + 1;
          if (status == 'Pending') {
            this.pageCount = this.count.Pending;
            this.total_page = Math.ceil(parseInt(this.pageCount) / this.page_limit);
          }
          else if (status == 'Qualified') {
            this.pageCount = this.count.Qualified;
            this.total_page = Math.ceil(parseInt(this.pageCount) / this.page_limit);
          }
          else if (status == 'Disqualified') {
            this.pageCount = this.count.Disqualified;
            this.total_page = Math.ceil(parseInt(this.pageCount) / this.page_limit);
          }
          else if (status == 'Assigned') {
            this.pageCount = this.count.Assigned;
            this.total_page = Math.ceil(parseInt(this.pageCount) / this.page_limit);
          }
          else if (status == 'Inprocess') {
            this.pageCount = this.count.Inprocess;
            this.total_page = Math.ceil(parseInt(this.pageCount) / this.page_limit);
          }
          else if (status == 'Win') {
            this.pageCount = this.count.Win;
            this.total_page = Math.ceil(parseInt(this.pageCount) / this.page_limit);
          }
          else {
            this.pageCount = this.count.Lost;
            this.total_page = Math.ceil(parseInt(this.pageCount) / this.page_limit);
          }
          if (this.pagenumber > this.total_page) {
            this.pagenumber = this.total_page;
            this.start = this.pageCount - this.page_limit;
          }
          else {
            this.pagenumber = Math.ceil(this.start / this.page_limit) + 1;
          }
          this.service.count_list();
          setTimeout(() => {
            this.loader = false;
          }, 700);
          if (this.lead_List.length == 0) {
            this.data_not_found = true;
          } else {
            this.data_not_found = false;
          }
          this.sr_no = this.pagenumber - 1;
          this.sr_no = this.sr_no * this.page_limit;
          this.loader = false;
        }
        else {
          this.toast.errorToastr(result['statusMsg']);
          this.loader = false;
        }


      }))

  }
  goToPage() {
    if (this.gotoPageNumber < 1 || this.gotoPageNumber > this.total_page) {
      this.toast.errorToastr("Invalid page number");
      return;
    }
    this.pagenumber = this.gotoPageNumber;
    this.start = (this.pagenumber - 1) * this.page_limit;
    this.leadList(this.active_tab);
  }

  upload_excel(type) {
    const dialogRef = this.alrt.open(ChunksUploaderComponent, {
      width: '500px',
      panelClass: 'cs-modal',
      disableClose: true,
      data: {
        'For': 'Enquiry',
        'modal_type': type
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result == true) {
        this.leadList(this.active_tab);
      }
    });
  }


  refresh() {
    this.filter = {};
    this.service.currentUserID = ''
    this.service.setData(this.filter)
    this.leadList(this.active_tab);
    this.start = 0;
    this.gotoPageNumber = 1;
  }
  getStateList(search) {

    this.service.post_rqst({ 'search': search }, "Announcement/getAllState").subscribe(response => {
      if (response['statusCode'] == 200) {
        this.states = response['all_state'];
      } else {
        this.toast.errorToastr(response['statusMsg']);
      }
    }, err => {
      this.toast.errorToastr('Something went wrong');

    });

  }
  getSourceList() {

    this.service.post_rqst({}, "Enquiry/sourceList").subscribe(response => {
      if (response['statusCode'] == 200) {
        this.allSourceList = response['result'];
      } else {
        this.toast.errorToastr(response['statusMsg']);
      }
    }, err => {
      this.toast.errorToastr('Something went wrong');

    });

  }


  getStageList() {

    this.service.post_rqst({}, "Enquiry/enquiryStagesList").subscribe(response => {
      if (response['statusCode'] == 200) {
        this.allStageList = response['enquiry_stages_list'];
      } else {
        this.toast.errorToastr(response['statusMsg']);
      }
    }, err => {
      this.toast.errorToastr('Something went wrong');

    });

  }

  change_date_filter(type): void {
    if (type == 'date_from') {
      this.search_val.date_from = moment(this.search_val.date_from).format('YYYY-MM-DD');
      this.leadList(this.active_tab);
    }

    else if (type == 'date_to') {
      this.search_val.date_to = moment(this.search_val.date_to).format('YYYY-MM-DD');
      this.leadList(this.active_tab);
    }
    else {
    }


  }


  related_tabs(tab) {
    this.active_tab = tab;
  }





  changeStatus(data) {
    const dialogRef = this.alrt.open(ChangeEnquiryStatusComponent, {
      width: '600px',
      panelClass: 'cs-modal',
      disableClose: true,
      data: {
        'id': data.id,
        'dr_type': data.type,
        'lead_data': data,
        'active_tab': this.active_tab,
        // 'user_name': name,
        // 'enquiry_id': enqid,
        // 'user_employee_code': this.lead_detail.user_employee_code,
        // 'dr_type': this.lead_detail.type,
        // 'lead_data': data,
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result == true) {
        this.leadList(this.active_tab);
      }
    });
  }

  lastBtnValue(value) {
    this.fabBtnValue = value;
  }


  downloadInChunks() {
    this.service.post_rqst({ 'filter': this.filter, 'start': this.start, 'pagelimit': this.page_limit }, "DownloadMaster/createQueueRequest").subscribe((result) => {
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
      this.loader = false;
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
      this.service.post_rqst({ 'filter': this.filter, 'start': this.start, 'pagelimit': this.page_limit }, "DownloadMaster/downloadEnquiryData").subscribe((result) => {
        result = this.service.payLoad ? result : this.cryptoService.decryptData(JSON.stringify(result));
        if (result['code'] === 1) {
          this.downloader = false;
          this.download_percent = null;
          window.open(this.downurl + result['filename']);
          this.progressService.setTotalCount(0);
          this.progressService.setRemainingCount(0);
          this.progressService.setDownloadProgress(0);
          this.progressService.setDownloaderActive(false);
          this.leadList(this.active_tab);
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
        this.loader = false;

      });
    }
  }


  selectAll2(action) {
    if (action == 'allSource') {
      setTimeout(() => {
        if (this.filter.allSource == true) {
          const productData = [];
          for (let i = 0; i < this.allSourceList.length; i++) {
            productData.push(this.allSourceList[i].source)
          }
          this.filter.source = productData;

        } else {
          this.filter.source = [];
        }
        this.leadList(this.active_tab)

      }, 500);
    }
  }


}
