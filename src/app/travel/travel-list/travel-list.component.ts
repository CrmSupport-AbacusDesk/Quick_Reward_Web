import { Component, OnInit, Input } from '@angular/core';
import { DatabaseService } from 'src/_services/DatabaseService';
import * as moment from 'moment';
import { MatBottomSheet, MatDialog } from '@angular/material';
import { DialogComponent } from 'src/app/dialog.component';
import { TravelStatusModalComponent } from '../travel-status-modal/travel-status-modal.component';
import { addTravelListModal } from '../add-travel-list/add-travel-list-modal.component';
import { sessionStorage } from 'src/app/localstorage.service';
import { UploadFileModalComponent } from 'src/app/upload-file-modal/upload-file-modal.component';
import { ToastrManager } from 'ng6-toastr-notifications';
import { ActivatedRoute, Router } from '@angular/router';
import { BottomSheetComponent } from 'src/app/bottom-sheet/bottom-sheet.component';
import { CryptoService } from 'src/_services/CryptoService';
import { ChunksUploaderComponent } from 'src/app/uploader-new/chunks-uploader/chunks-uploader.component';
import { ProgressService } from 'src/app/progress.service';



@Component({
  selector: 'app-travel-list',
  templateUrl: './travel-list.component.html'
})
export class TravelListComponent implements OnInit {
  active_tab: any = 'Pending';
  travel_list: any = [];
  hod: any = []
  rsm2: any = []
  loader: boolean = false;
  search: any = {};
  skelton: any;
  datanotfound = false;
  status: any = {};
  travel_list1: any = [];
  travel_list2: any = [];
  count_list: any = [];
  table_head: boolean = false;
  today_date: Date;
  assign_login_data2: any = [];
  report_manager: any = [];
  count: any = {}
  assign_login_data: any = [];
  view_edit: boolean = true;
  view_add: boolean = true;
  view_delete: boolean = true;
  data: any = {}
  tmpsearch: string
  asmList: any = []
  secondary_lead_list: any = [];
  sr_no: any = 0;
  total_page: any;
  pageCount: any;
  page_limit: any;
  pagenumber: any = 1;
  start: any = 0;
  downurl: any = '';
  @Input() dataToReceive: any;
  padding0: any;
  hide: any;

  constructor(public alert: DialogComponent,private progressService: ProgressService, public cryptoService: CryptoService, public routes: ActivatedRoute, public route: Router, public service: DatabaseService, public dialog1: DialogComponent, public alrt: MatDialog, public dialog: MatDialog, public session: sessionStorage, public toast: ToastrManager, private bottomSheet: MatBottomSheet) {
    this.page_limit = service.pageLimit;
    this.downurl = service.downloadUrl;
    this.skelton = new Array(10);
    this.getReportManager('');
    this.assign_login_data = this.session.getSession();
    this.assign_login_data = this.assign_login_data.value;
    this.assign_login_data2 = this.assign_login_data.data;
    this.assign_login_data = this.assign_login_data.assignModule;
    this.today_date = new Date();

  }

  ngOnInit() {
    this.search = this.service.getData();
    if (typeof this.active_tab === 'object' && Object.keys(this.active_tab).length === 0) {
      this.active_tab = 'Approved';
    }

    if (this.dataToReceive != undefined) {
      this.padding0 = this.dataToReceive.padding0;
      this.hide = this.dataToReceive.hide;
      this.search.employee_id = this.dataToReceive.employee_id;
      this.getTravelList();
    }
    else {
      this.getTravelList();
    }

  }

  upload_excel() {
    const dialogRef = this.alrt.open(UploadFileModalComponent, {
      width: '500px',
      data: {
        'from': 'travel',
      }
    });
    dialogRef.afterClosed().subscribe(result => {
    });
  }
  filter_dr(dr_name) {
    this.tmpsearch = '';
    this.asmList = [];
    for (var i = 0; i < this.secondary_lead_list.length; i++) {
      dr_name = dr_name.toLowerCase();
      this.tmpsearch = this.secondary_lead_list[i]['name'].toLowerCase();
      if (this.tmpsearch.includes(dr_name)) {
        this.asmList.push(this.secondary_lead_list[i]);
      }
    }
  }
  refresh() {
    this.start = 0;
    this.pagenumber = 1;
    this.search = {}
    this.service.setData(this.search)
    this.service.currentUserID = ''
    this.data = {};
    if (this.dataToReceive != undefined) {
      this.search.employee_id = this.dataToReceive.employee_id;
    }
    this.getTravelList();
  }


  pervious() {
    this.start = this.start - this.page_limit;
    this.getTravelList();
  }

  nextPage() {

    this.start = this.start + this.page_limit;
    this.getTravelList();
  }
  getTravelList() {
    if (this.search.date_to) {
      this.search.date_to = moment(this.search.date_to).format('YYYY-MM-DD');
    }

    if (this.search.date_from) {
      this.search.date_from = moment(this.search.date_from).format('YYYY-MM-DD');
    }
    if (this.search.date_created) {
      this.search.date_created = moment(this.search.date_created).format('YYYY-MM-DD');
    }

    if (this.pagenumber > this.total_page) {
      this.pagenumber = this.total_page;
      this.start = this.pageCount - this.page_limit;
    }
    if (this.start < 0) {
      this.start = 0;
    }
    this.loader = true;
    this.search.status = this.active_tab;
    this.service.post_rqst({ 'user_id': this.assign_login_data2.id, 'start': this.start, 'pagelimit': this.page_limit, 'filter': 'month', 'data': this.data, 'search': this.search, 'user_type': this.assign_login_data2.type }, "Travel/travelList").subscribe(result => {
      if (result['statusCode'] == 200) {
        this.travel_list = result['user_list_travel_plan'];
        this.travel_list.forEach(item => item['encrypt_id'] = this.cryptoService.encryptId(item['id']));
        this.loader = false;
        if (this.travel_list.length == 0) {
          this.datanotfound = true
        } else {
          this.datanotfound = false
        }
        this.pageCount = result['count']
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
      } else {
        this.loader = false;
        this.toast.errorToastr(result['statusMsg']);
      }
    }, err => {
      this.loader = false;
      this.toast.errorToastr('Something went wrong');
    })
  }

  public onDate(event): void {
    if (this.search.date_created) {
      this.search.date_created = moment(this.search.date_created).format('YYYY-MM-DD');
    }
    if (this.search.date_from) {
      this.search.date_from = moment(this.search.date_from).format('YYYY-MM-DD');
    }

    if (this.search.date_to) {
      this.search.date_to = moment(this.search.date_to).format('YYYY-MM-DD');
    }
    this.getTravelList();
  }

  getReportManager(search, type: any = '') {
    this.service.post_rqst({ 'search': search }, "Travel/getSalesUserForReporting").subscribe(result => {
      if (result['statusCode'] == 200) {
        if (type == 'hod') {
          this.hod = result['all_sales_user'];
        }
        else if (type == 'rsm1') {
          this.report_manager = result['all_sales_user'];
        }
        else if (type == 'rsm2') {
          this.rsm2 = result['all_sales_user'];
        } else {
          this.hod = result['all_sales_user'];
          this.report_manager = result['all_sales_user'];
          this.rsm2 = result['all_sales_user'];
        }
      } else {
        this.loader = false;
        this.toast.errorToastr(result['statusMsg']);
      }
    }, err => {
      this.loader = false;
      this.toast.errorToastr('Something went wrong');
    });
  }

  statusModal(id, date) {
    const dialogRef = this.dialog.open(TravelStatusModalComponent, {
      width: '400px',
      panelClass: 'cs-modal',
      disableClose: true,
      data: {
        id,
        date
      }
    });
    dialogRef.afterClosed().subscribe(result => {

      this.getTravelList();
    });

  }

  districtAppend: String;
  state4xl: String;
  cityexcel: String;

  area: any
  areaexcel: any;
  company_name: String;


  openEditDialog2(row): void {
    const dialogRef = this.dialog.open(addTravelListModal, {
      width: '720px', data: {
        row,

      }

    });

    dialogRef.afterClosed().subscribe(result => {

      this.getTravelList()

    });
  }

  addTravelPlan() {
    const dialogRef = this.dialog.open(addTravelListModal, {
      width: '720px',
      data: {

      }
    });
    dialogRef.afterClosed().subscribe(result => {
      this.getTravelList();
      setTimeout(() => {
        this.loader = false;
      }, 100);

      if (result != false) {
        this.active_tab = 'Approved'
        this.getTravelList();
      }
      else {
        this.active_tab = 'Approved'
        this.getTravelList();
      }

    });


  }



  exportAsXLSX(status) {
    this.loader = true;
    this.search.status = status;
    this.service.post_rqst({ 'user_id': this.assign_login_data2.id, 'filter': 'month', 'start': this.start, 'pagelimit': this.page_limit, 'data': this.data, 'search': this.search, 'user_type': this.assign_login_data2.type }, "Excel/travel_list").subscribe((result => {
      if (result['msg'] == true) {
        this.loader = false;
        window.open(this.downurl + result['filename'])
        this.getTravelList();
      } else {
        this.loader = false;
      }

    }));

  }

  goTODetail(id, month, year) {
    this.route.navigate(['/travel-sub-detail/' + id], { queryParams: { id, month, year } });
  }

  openTravelListModal(type) {
    const dialogRef = this.dialog.open(ChunksUploaderComponent, {
      width: '720px',
      panelClass: 'cs-modal',
      disableClose: true,
      data: {
        // 'from': 'Travel Plan Monthly',
        'For': type,
      }
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result == true) {
        this.getTravelList();
      }
    })
  }
  openBottomSheet(): void {
    this.bottomSheet.open(BottomSheetComponent, {
      data: {
        'filterPage': 'travel_plan_list',
      }
    });
    this.bottomSheet._openedBottomSheetRef.afterDismissed().subscribe((data) => {

      if (data != undefined) {
        this.search.date_from = data.date_from;
        this.search.date_to = data.date_to;
        this.getTravelList();
      }


    })
  }

 // chunk data download start
 excelLoader: boolean = false;
 downloader: any = false;
 download_percent: any;
 remainingCount: any;
 totalCount: any;
 downloadInChunks(active_tab) {
this.search.status = active_tab;
  this.service.post_rqst({ 'user_id': this.assign_login_data2.id, 'start': this.start, 'pagelimit': this.page_limit, 'search': this.data, 'user_type': this.assign_login_data2.type }, "DownloadMaster/createQueueRequest").subscribe((result) => {
    if(result['statusCode'] == 200){
      if(result['code']== 0){
        this.toast.errorToastr(result['statusMsg']);
        return;
      }
      if(result['code']== 1 ){
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
    console.log('line no 302'+cancelReq);
    can = cancelReq
  })
  if (can == false) {
    console.log('line no 305');
    this.downloader = true;
    if (this.download_percent == null) {
      this.download_percent = 0;
    }
  
    this.service.post_rqst({ 'user_id': this.assign_login_data2.id, 'start': this.start, 'pagelimit': this.page_limit, 'search': this.search, 'user_type': this.assign_login_data2.type }, "DownloadMaster/travelReportAreaWise").subscribe((result) => {
      if (result['code'] === 1) {
        this.downloader = false;
        this.download_percent = null;
        window.open(this.downurl + result['filename']);
        this.progressService.setTotalCount(0);
        this.progressService.setRemainingCount(0);
        this.progressService.setDownloadProgress(0);
        this.progressService.setDownloaderActive(false);
        this.getTravelList();
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
