import { Component, OnInit } from '@angular/core';
import { slideToTop } from '../../router-animation/router-animation.component';
import { DatabaseService } from 'src/_services/DatabaseService';
import * as moment from 'moment';
import { DialogComponent } from 'src/app/dialog.component';
import { MatBottomSheet, MatDialog } from '@angular/material';
import { sessionStorage } from 'src/app/localstorage.service';
import { ToastrManager } from 'ng6-toastr-notifications';
import { BottomSheetComponent } from 'src/app/bottom-sheet/bottom-sheet.component';
import { LeadAddFollowupModelComponent } from 'src/app/lead/lead-add-followup-model/lead-add-followup-model.component';
import { StatusModalComponent } from 'src/app/order/status-modal/status-modal.component';
import { CryptoService } from 'src/_services/CryptoService';
import { Router } from '@angular/router';
import { ProgressService } from 'src/app/progress.service';


@Component({
  selector: 'app-followup-list',
  templateUrl: './followup-list.component.html',
  animations: [slideToTop()]

})
export class FollowupListComponent implements OnInit {

  followup_list: any = [];
  search: any = {};
  active_tab = 'pending';
  loader: any;
  datanotfound = false;
  skelton: any = {}
  excel_data: any = [];
  count_list: any = [];
  assign_login_data: any = [];
  assign_login_data2: any = [];
  view_edit: boolean = true;
  view_add: boolean = true;
  view_delete: boolean = true;
  sr_no: any = 0;
  total_page: any;
  pageCount: any;
  page_limit: any;
  fabBtnValue: any = 'excel';
  pagenumber: any = 1;
  start: any = 0;
  tabCount: any = 0;
  downurl: any = '';
  excelLoader: boolean = false;
  downloader: any = false;
  download_percent: any;
  downValue: any;
  downType: any;
  downTypeId: any;
  downFilter: any;
  totalDownloadCount: any;
  remainingDownloadCount: any;
  totalCount: any;
  remainingCount: any;



  constructor(public toast: ToastrManager, public cryptoService: CryptoService, public service: DatabaseService, public alert: DialogComponent, public bottomSheet: MatBottomSheet, public dialog: MatDialog, public session: sessionStorage, public route: Router, public progressService: ProgressService) {
    this.page_limit = service.pageLimit;
    this.downurl = service.downloadUrl;

    this.skelton = new Array(10);

    this.assign_login_data = this.session.getSession();
    this.assign_login_data = this.assign_login_data.value;
    this.assign_login_data2 = this.assign_login_data.data;

    this.assign_login_data = this.assign_login_data.assignModule;


  }

  ngOnInit() {
    this.search = this.service.getData()
    if (this.search.status) {
      this.active_tab = this.search.status
    }
    this.followUpList();
  }


  clearFilter() {
    this.search = {};
    this.service.setData(this.search)
    this.service.currentUserID = ''
    this.followUpList();
  }


  pervious() {
    this.start = this.start - this.page_limit;
    this.followUpList('');
  }

  nextPage() {

    this.start = this.start + this.page_limit;
    this.followUpList('');
  }


  followUpList(action: any = '') {

    if (this.pagenumber > this.total_page) {
      this.pagenumber = this.total_page;
      this.start = this.pageCount - this.page_limit;
    }

    if (action == "refresh") {
      this.search = {};
    }
    if (this.search.followup_date) {
      this.search.followup_date = moment(this.search.followup_date).format('YYYY-MM-DD');
    }
    if (this.search.date_created) {
      this.search.date_created = moment(this.search.date_created).format('YYYY-MM-DD');
    }
    if (this.search.date_from) {
      this.search.date_from = moment(this.search.date_from).format('YYYY-MM-DD');
    }
    if (this.search.date_to) {
      this.search.date_to = moment(this.search.date_to).format('YYYY-MM-DD');
    }

    if (this.start < 0) {
      this.start = 0;
    }

    this.loader = true;
    this.service.post_rqst({ 'user_id': this.assign_login_data2.id, 'start': this.start, 'pagelimit': this.page_limit, 'search': this.search, 'active_tab': this.active_tab, 'user_type': this.assign_login_data2.type }, "Followup/followupList").subscribe(result => {
      if (result['statusCode'] == 200) {
        this.followup_list = result['followup_list'];
        for (let i = 0; i < this.followup_list.length; i++) {
          this.followup_list[i]['dr_encrypt_id'] = this.cryptoService.encryptId(this.followup_list[i]['dr_id'])
          this.followup_list[i]['encrypt_id'] = this.cryptoService.encryptId(this.followup_list[i]['id'])
        }
        this.tabCount = result['count'];
        this.pageCount = result['count'];
        if (this.active_tab == 'pending') {
          this.pageCount = this.pageCount.pending;
          this.total_page = Math.ceil(this.pageCount / this.page_limit);

        }
        else if (this.active_tab == 'upcoming') {
          this.pageCount = this.pageCount.upcoming;
          this.total_page = Math.ceil(this.pageCount / this.page_limit);
        }
        else {
          this.pageCount = this.pageCount.complete;
          this.total_page = Math.ceil(this.pageCount / this.page_limit);
        }



        if (this.pagenumber > this.total_page) {
          this.pagenumber = this.total_page;
          this.start = this.pageCount - this.page_limit;
        }
        else {
          this.pagenumber = Math.ceil(this.start / this.page_limit) + 1;
        }
        this.sr_no = this.pagenumber - 1;
        this.sr_no = this.sr_no * this.page_limit;
        if (this.count_list.length == 0) {
          this.datanotfound = true;
        }
        else {
          this.datanotfound = false;
        }

        setTimeout(() => {
          this.loader = false;

        }, 100);
      } else {
        this.loader = false;
        this.toast.errorToastr(result['statusMsg']);
      }
    }, err => {
      this.loader = false;
      this.toast.errorToastr('Something went wrong');
    })
  }


  delete_followup(followup_id) {
    this.alert.delete('Followup !').then((res) => {
      if (res) {
        this.service.post_rqst({ 'followup_id': followup_id }, "Followup/deleteFollowup").subscribe((result) => {
          if (result['statusCode'] == 200) {
            this.toast.successToastr(result['statusMsg']);
            this.followUpList()
            this.service.count_list();

          }
          else {
            this.toast.errorToastr(result['statusMsg']);
          }
        }, err => {
          this.toast.errorToastr('Something went wrong');
        })
      }
    });


  }


  exportAsXLSX(status) {
    this.loader = true;
    this.search.status = status;
    this.service.post_rqst({ 'user_id': this.assign_login_data2.id, 'start': this.start, 'pagelimit': this.page_limit, 'search': this.search, 'active_tab': this.active_tab, 'user_type': this.assign_login_data2.type }, "Excel/followup_list").subscribe((result) => {
      if (result['msg'] == true) {
        this.loader = false;
        window.open(this.downurl + result['filename'])
        this.followUpList('');
      } else {
        this.loader = false;
      }
    });

  }
  openBottomSheet(): void {
    this.bottomSheet.open(BottomSheetComponent, {
      data: {
        'filterPage': 'distribution_list',
      }
    });
    this.bottomSheet._openedBottomSheetRef.afterDismissed().subscribe((data) => {
      this.search.date_from = data.date_from;
      this.search.date_to = data.date_to;
      // this.search.userId = data.user_id;
      this.followUpList();
    })
  }
  sortData() {
    this.followup_list.reverse();
  }


  openDialog() {
    const dialogRef = this.dialog.open(StatusModalComponent, {
      width: '500px',
      panelClass: 'cs-modal',
      disableClose: true,
      data: {
        from: 'add_new_follow_up'
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result != false) {
        this.followUpList();
      }
    });
  }

  goToPage(id, dr_type) {
    // let id = this.cryptoService.encryptId(dr_id)
    if (dr_type == 4) {
      this.route.navigate(['followup-list/distribution-detail/', id, 'Profile', 'lead-detail', id]);
    }
    else if (dr_type == 5) {
      this.route.navigate(['followup-list/site-detail/', id]);
    }
    else if (dr_type == 1 || dr_type == 3) {
      this.route.navigate(['followup-list/distribution-detail/', id, 'Profile'], { queryParams: { 'id': id, 'type': dr_type } });
    }
    else {
      this.route.navigate(['followup-list/influencer-detail/', id, dr_type], { queryParams: { 'id': id, 'type': dr_type } });
    }
  }


  downloadInChunks() {
    this.service.post_rqst({ 'user_id': this.assign_login_data2.id, 'start': this.start, 'pagelimit': this.page_limit, 'search': this.search, 'active_tab': this.active_tab, 'user_type': this.assign_login_data2.type }, "DownloadMaster/createQueueRequest").subscribe((result) => {
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
      this.service.post_rqst({ 'user_id': this.assign_login_data2.id, 'start': this.start, 'pagelimit': this.page_limit, 'search': this.search, 'active_tab': this.active_tab, 'user_type': this.assign_login_data2.type }, "DownloadMaster/downloadFollowupReport").subscribe((result) => {

        if (result['code'] === 1) {
          this.downloader = false;
          this.download_percent = null;
          window.open(this.downurl + result['filename']);
          this.progressService.setTotalCount(0);
          this.progressService.setRemainingCount(0);
          this.progressService.setDownloadProgress(0);
          this.progressService.setDownloaderActive(false);
          this.followUpList('');
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
