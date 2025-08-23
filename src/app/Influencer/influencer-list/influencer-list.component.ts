import { Component, Input, OnInit, SimpleChanges } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DatabaseService } from 'src/_services/DatabaseService';
import { MatBottomSheet, MatDialog } from '@angular/material';
import { RedeemStatusModalComponent } from 'src/app/redeem-status-modal/redeem-status-modal.component';
import * as moment from 'moment';
import { sessionStorage } from 'src/app/localstorage.service';
import { ToastrManager } from 'ng6-toastr-notifications';
import { DialogComponent } from 'src/app/dialog.component';
import { BottomSheetComponent } from 'src/app/bottom-sheet/bottom-sheet.component';
import { CryptoService } from 'src/_services/CryptoService';
import { ProgressService } from 'src/app/progress.service';


@Component({
  selector: 'app-influencer-list',
  templateUrl: './influencer-list.component.html'
})
export class InfluencerListComponent implements OnInit {
  filter: any = {};
  type: any = '';
  active_tab: any = 'Pending';
  network: any = '';
  Influencer_List: any = [];
  loader: boolean = false;
  datanotfound: boolean = false;
  page_limit: any;
  start: any = 0;
  pagenumber: any = 1;
  total_page: any;
  pageCount: any;
  sr_no: any = 0;
  tab_count: any = {};
  sorting_type: any = ''
  login_data: any = {};
  login_data5: any = {};
  logined_user_data: any = {};
  assign_login_data: any = {};
  today_date: Date;
  gotoPageNumber: any = 1
  downurl: any = '';
  states: any = [];
  encryptedData: any;
  decryptedData: any;
  headerData: any = [];
  @Input() dataToReceive: any;
  padding0: any;
  hide: boolean = true;
  payload: any = {};


  constructor(public alert: DialogComponent, public cryptoService: CryptoService, public ActivatedRoute: ActivatedRoute, public toast: ToastrManager, public service: DatabaseService, public route: Router, public dialog: MatDialog, public session: sessionStorage, private bottomSheet: MatBottomSheet, private progressService: ProgressService) {
    this.downurl = service.downloadUrl;
    this.page_limit = service.pageLimit;
    this.login_data = this.session.getSession();
    this.login_data = this.login_data.value;
    this.login_data5 = this.login_data.data;
    this.assign_login_data = this.session.getSession();
    this.logined_user_data = this.assign_login_data.value;
    this.today_date = new Date();
    this.filter = this.service.getData();

    this.start = this.service.getStart();
    console.log(this.filter);

    // this.ActivatedRoute.params.subscribe(params => {
    //   this.type = params.type;
    //   this.network = params.network;
    //   this.InfluencerList();
    // });
  }

  // ngOnInit() {
  //   console.log(this.dataToReceive, 'dataToReceive');
  //   this.getStateList();

  // }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.dataToReceive && !changes.dataToReceive.firstChange) {
      this.updateData();
    }

  }

  private updateData() {
    this.padding0 = this.dataToReceive.padding0;
    this.type = this.dataToReceive.type;
    this.filter.user_id = this.dataToReceive.user_id;
    this.hide = this.dataToReceive.hide;

    this.InfluencerList();
  }


  ngOnInit(): void {
    if (this.dataToReceive != undefined) {

      this.updateData();

    }
    else {
      this.ActivatedRoute.params.subscribe(params => {
        this.type = params.type;
        this.network = params.network;
        if (this.filter.status) {
          this.active_tab = this.filter.status;
        }
        this.InfluencerList();
      }
      );



    }

    this.getStateList();

  }



  getStateList() {
    this.service.post_rqst(0, "Master/getAllState").subscribe((result => {

      if (result['statusCode'] == 200) {
        this.states = result['all_state'];
      }
      else {
        this.toast.errorToastr(result['statusMsg'])
      }
    }));
  }


  date_format(): void {
    this.filter.date_created = moment(this.filter.date_created).format('YYYY-MM-DD');
    this.InfluencerList();
  }

  // pervious() {
  //   this.start = this.start - this.page_limit;
  //   this.InfluencerList();
  // }

  // nextPage() {
  //   this.start = this.start + this.page_limit;
  //   this.InfluencerList();
  // }
  pervious() {
    if (this.start > 0) {
      this.start -= this.page_limit;
      this.pagenumber = Math.ceil(this.start / this.page_limit) + 1; // Update current page number
      this.gotoPageNumber = this.pagenumber; // Update input box
      this.InfluencerList();
    }
  }

  nextPage() {
    if (this.pagenumber < this.total_page) {
      this.start += this.page_limit;
      this.pagenumber = Math.ceil(this.start / this.page_limit) + 1; // Update current page number
      this.gotoPageNumber = this.pagenumber; // Update input box
      this.InfluencerList();
    }
  }

  goToPage() {
    if (this.gotoPageNumber < 1 || this.gotoPageNumber > this.total_page) {
      this.toast.errorToastr("Invalid page number");
      return;
    }
    this.pagenumber = this.gotoPageNumber;
    this.start = (this.pagenumber - 1) * this.page_limit;
    this.InfluencerList();
  }
  InfluencerList() {
    if (this.pagenumber > this.total_page) {
      this.pagenumber = this.total_page;
      this.start = this.pageCount - this.page_limit;
    }
    if (this.start < 0) {
      this.start = 0;
    }
    this.loader = true;

    this.filter.status = this.active_tab;
    this.filter.sort_by_wallet = this.sorting_type;
    if (this.active_tab == 'Approved') {
      this.filter.login_status = parseInt(this.filter.login_status);
    }


    if (this.filter.unique_id) {
      this.filter.unique_id = this.filter.unique_id.replace(/[a-zA-Z]/g, '');
    }

    this.service.post_rqst({ 'type': this.type, 'filter': this.filter, 'start': this.start, 'pagelimit': this.page_limit }, 'Influencer/influencerCustomerList').subscribe((result) => {
      if (result['statusCode'] == 200) {
        this.loader = false;
        this.Influencer_List = result['result'];
        this.headerData = result['headerData'];
        this.pageCount = result['count'];
        this.tab_count = result['tab_count'];
        for (let i = 0; i < this.Influencer_List.length; i++) {
          this.Influencer_List[i]['encrypt_id'] = this.cryptoService.encryptId(this.Influencer_List[i]['id'].toString());
          if (this.Influencer_List[i].login_status == 1) {
            this.Influencer_List[i].user_status = true
          }
          else if (this.Influencer_List[i].login_status == 0) {
            this.Influencer_List[i].user_status = false;
          }
        }
        console.log(this.Influencer_List, 'Influencer_List');

        if (this.Influencer_List.length == 0) {
          this.datanotfound = true;
        } else {
          this.datanotfound = false;
        }
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
      }
      else {
        this.loader = false;
        this.toast.errorToastr(result['statusMsg']);
      }
    })
  }


  resetDevice(id) {
    this.alert.confirm("You Want To  Reset Device !").then((result) => {
      if (result) {
        this.service.post_rqst({ 'id': id, 'type': 'influencer' }, "Master/resetDeviceId")
          .subscribe(result => {
            if (result['statusCode'] == 200) {
              this.toast.successToastr(result['statusMsg']);
              this.InfluencerList();
            }
            else {
              this.toast.errorToastr(result['statusMsg']);
            }
          })
      }
    })

  }




  updateStatus(index, id, event) {
    this.alert.confirm("You Want To Change Status !").then((res) => {
      if (res) {
        if (event.checked == false) {
          this.Influencer_List[index].login_status = 0;
        }
        else {
          this.Influencer_List[index].login_status = 1;
        }
        let value = this.Influencer_List[index].login_status;
        this.service.post_rqst({ 'id': id, 'login_status': value, 'status_changed_by_id': this.logined_user_data.data.id, 'status_changed_by_name': this.logined_user_data.data.name }, "Influencer/disableInfluencer")
          .subscribe(result => {
            if (result['statusCode'] == 200) {
              this.toast.successToastr(result['statusMsg']);
              this.InfluencerList();
            }
            else {
              this.toast.errorToastr(result['statusMsg']);
            }
          })
      }
      else {
        this.InfluencerList();
      }
    })
  }

  refresh() {
    this.filter = {};
    this.service.setData(this.filter)
    this.service.currentUserID = ''
    this.InfluencerList();
    this.start = 0;
    this.gotoPageNumber = 1;

  }



  Addnew() {
    let network = this.network
    let type = this.type
    this.route.navigate(['/add-influencer/'], { queryParams: { type, network } });
  }



  public onDate(event) {
    this.filter.date_created = moment(event.target.value).format('YYYY-MM-DD');
    this.InfluencerList();
  }

  openBottomSheet(type): void {
    this.bottomSheet.open(BottomSheetComponent, {
      data: {
        'filterPage': 'distribution_list',
      }
    });
    this.bottomSheet._openedBottomSheetRef.afterDismissed().subscribe((data) => {
      this.filter.date_from = data.date_from;
      this.filter.date_to = data.date_to;
      console.log(this.filter, 'filter');
      if (data) {
        // this.downloadInChunks();
        this.InfluencerList();
      }
    })
  }

  downFilter: any;
  downloader: any = false;
  download_percent: any;
  totalCount: any;
  remainingCount: any;

  downloadInChunks() {
    this.service.post_rqst({ 'type': this.type, 'filter': this.filter, 'start': this.start, 'pagelimit': this.page_limit }, "DownloadMaster/createQueueRequest").subscribe((result) => {
      if (result['statusCode'] == 200) {
        if (result['code'] == 0) {
          this.toast.errorToastr(result['statusMsg']);
          return;
        }

        if (result['code'] == 1) {
          this.downloadExcel();
        }
      }
    }, err => {
      this.loader = false;

    });
  }

  downloadExcel() {
    let can
    this.progressService.getCancelReq().subscribe(cancelReq => {
      can = cancelReq
    })
    if (can == false) {
      this.downloader = true;
      if (this.download_percent == null) {
        this.download_percent = 0;
      }
      this.service.post_rqst({ 'type': this.type, 'filter': this.filter, 'start': this.start, 'pagelimit': this.page_limit }, "DownloadMaster/downloadInfluencerData").subscribe((result) => {
        if (result['code'] === 1) {
          this.downloader = false;
          this.download_percent = null;
          window.open(this.downurl + result['filename']);
          this.progressService.setTotalCount(0);
          this.progressService.setRemainingCount(0);
          this.progressService.setDownloadProgress(0);
          this.progressService.setDownloaderActive(false);
          this.InfluencerList();
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
          this.downloadExcel();
        }
      }, err => {
        this.loader = false;
      });
    }
  }


  updateType(id, type): void {
    const dialogRef = this.dialog.open(RedeemStatusModalComponent, {
      width: '400px', data: {
        id: id,
        delivery_from: 'Influencer',
        influencer_type: type.toString(),
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result == true) {
        this.InfluencerList();
      }
    });
  }
}
