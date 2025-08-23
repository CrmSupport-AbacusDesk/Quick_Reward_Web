import { Component, OnInit, Input, EventEmitter, Output, SimpleChanges } from '@angular/core';
import { slideToTop } from '../../router-animation/router-animation.component';
import { DatabaseService } from 'src/_services/DatabaseService';
import { ActivatedRoute, Router } from '@angular/router';
import { DialogComponent } from 'src/app/dialog.component';
import { sessionStorage } from 'src/app/localstorage.service';
import * as moment from 'moment';
import { UploadFileModalComponent } from 'src/app/upload-file-modal/upload-file-modal.component';
import { MatBottomSheet, MatDialog } from '@angular/material';
import { ToastrManager } from 'ng6-toastr-notifications';
import { BottomSheetComponent } from 'src/app/bottom-sheet/bottom-sheet.component';
import { ProgressService } from '../../progress.service';
import { CryptoService } from 'src/_services/CryptoService';
import { ChunksUploaderComponent } from 'src/app/uploader-new/chunks-uploader/chunks-uploader.component';
@Component({
  selector: 'app-distribution-list',
  templateUrl: './distribution-list.component.html',
  animations: [slideToTop()]

})
export class DistributionListComponent implements OnInit {
  active_tab = 'Active';
  fabBtnValue: any = 'add';
  retailer_type = 'Dr';
  filter: any = {}
  excelLoader: boolean = false;
  pageCount: any;
  savingFlag: boolean = false;
  value: any = {};
  dr_list_temp: any = [];
  distributor_list: any = [];
  start: any = 0;

  count: any;
  sr_no: any;
  total_page: any;
  pagenumber: any = '';
  page_limit: any = 50
  exp_loader: any = false;
  loader: boolean = false;
  data: any = [];
  gotoPageNumber: any
  datanotfound = false;
  type: any;
  type_id: any;
  brand_master: any = [];
  state_values: any = [];
  login_data: any = [];
  login_dr_id: any;
  skelton: any = {};
  selectedLead: any[] = [];
  today_date: Date;
  add: any = {};
  sort: any = {}
  delete: any = {};
  sorting_type: any = ''
  column: any = ''
  edit: any = {};
  assign_login_data2: any = [];
  all_count: any = {}
  downValue: any;
  downType: any;
  downTypeId: any;
  downFilter: any;

  assign_login_data: any = [];
  view_edit: boolean = true;
  view_add: boolean = true;
  view_delete: boolean = true;
  downurl: any = '';
  padding0: any;
  download_percent: any;
  downloader: any = false;
  hitCount: any;
  totalCount: any;
  remainingCount: any;
  @Input() dataToReceive: any;
  hide: boolean = true;
  encryptedData: any;
  decryptedData: any;
  userData: any;
  logined_user_data: any = {};
  headerData: any = [];

  constructor(public service: DatabaseService, public cryptoService: CryptoService, public toast: ToastrManager, public alert: DialogComponent, public route: Router, public ActivatedRoute: ActivatedRoute, public dialog: DialogComponent, public session: sessionStorage, private bottomSheet: MatBottomSheet, public alrt: MatDialog, private progressService: ProgressService) {
    this.active_tab = 'Active'
    this.downurl = service.downloadUrl;
    this.today_date = new Date();
    this.assign_login_data = this.session.getSession();
    this.assign_login_data = this.assign_login_data.value;
    this.assign_login_data2 = this.assign_login_data.data;
    this.assign_login_data = this.assign_login_data.assignModule;
    this.userData = JSON.parse(localStorage.getItem('st_user'));
    this.logined_user_data = this.userData['data'];
    console.log(this.logined_user_data.organisation_data);
  }


  ngAfterViewInit() {
  }


  ngOnChanges(changes: SimpleChanges) {
    if (changes.dataToReceive && !changes.dataToReceive.firstChange) {
      this.updateData();
    }

  }

  private updateData() {
    this.padding0 = this.dataToReceive.padding0;
    this.type_id = this.dataToReceive.type;
    this.type = this.dataToReceive.netWorkName;
    this.hide = this.dataToReceive.hide;
    this.filter.user_id = this.dataToReceive.user_id;
    this.filter.active_tab = this.active_tab
    this.distributorList('', this.column, this.sorting_type);
  }

  StatusChangeModel(id) {
    this.selectedLead = [];
    this.alert.confirm("You Want To Change Status !").then((res) => {
      if (res) {
        this.encryptedData = this.service.payLoad ? { 'dr_id': id } : this.cryptoService.encryptData({ 'dr_id': id });
        this.service.post_rqst(this.encryptedData, "CustomerNetwork/convertLead")
          .subscribe(result => {
            this.decryptedData = this.service.payLoad ? result : this.cryptoService.decryptData(JSON.stringify(result));
            if (this.decryptedData['statusCode'] == 200) {
              this.toast.successToastr(this.decryptedData['statusMsg']);
              this.distributorList('', this.column, this.sorting_type);
            } else {
              this.toast.errorToastr(this.decryptedData['statusMsg']);
            }
          });
      }

    })

  }

  updateMultipleLead(val, i) {
    if (val == true) {
      this.selectedLead.push(this.dr_list_temp[i]['id'])
    }
    else if (val == false) {
      let index = this.selectedLead.findIndex((row) => {
        return row == this.dr_list_temp[i]['id']
      })
      this.selectedLead.splice(index, 1);
    }
  }

  updateAllLead(action) {
    console.log(this.dr_list_temp.length);
    console.log(this.dr_list_temp);
    this.selectedLead = [];
    if (this.data.alllead == true) {
      const productData = [];
      for (let i = 0; i < this.dr_list_temp.length; i++) {
        this.selectedLead.push(this.dr_list_temp[i].id)
      }
      console.log(this.selectedLead)
      this.selectedLead.map((userid) => {
        let index = this.dr_list_temp.findIndex(row => row.id == userid);
        if (index != -1) {
          this.dr_list_temp[index].approval = true;
        }
      })
    } else {
      this.selectedLead = [];
      console.log(this.selectedLead)

      this.dr_list_temp.map((row) => {
        row.approval = false;
      })
    }



  }


  ngOnInit() {



    if (this.dataToReceive != undefined) {
      this.updateData();
      // this.distributorList('', this.column, this.sorting_type);
    }

    else {
      this.filter = this.service.getData();
      if (this.filter.active_tab) {
        this.active_tab = this.filter.active_tab
      }
      if ((this.logined_user_data.organisation_data.home_page_sfa == 'Influencer' || this.logined_user_data.organisation_data.home_page_dms == 'Influencer')) {
        this.filter.active_tab = 'Inactive'
      }
      this.login_data = this.session.getSession();
      this.login_data = this.login_data.value.data;
      this.skelton = new Array(10);

      if (this.login_data.access_level != '1') {
        this.login_dr_id = this.login_data.id;
      }

      this.ActivatedRoute.params.subscribe(params => {
        this.type_id = params.id;
        this.type = params.type;
        this.filter.active_tab = this.active_tab;
        if ((this.logined_user_data.organisation_data.home_page_sfa == 'Influencer' || this.logined_user_data.organisation_data.home_page_dms == 'Influencer')) {
          this.filter.active_tab = 'Inactive'
        }
        this.distributorList('', this.column, this.sorting_type);
      });
    }


  }




  lastBtnValue(value) {
    this.fabBtnValue = value;
  }



  dr_count: any;

  date_format(event): void {
    this.filter.date_created = moment(event.target.value).format('YYYY-MM-DD');
    // this.filter.date_created = moment(this.filter.date_created).format('YYYY-MM-DD');
    this.distributorList('', this.column, this.sorting_type);
  }
  pervious() {
    if (this.start > 0) {
      this.start -= this.page_limit;
      this.pagenumber = Math.ceil(this.start / this.page_limit) + 1; // Update current page number
      this.gotoPageNumber = this.pagenumber; // Update input box
      this.distributorList('', this.column, this.sorting_type);
    }
  }

  nextPage() {
    if (this.pagenumber < this.total_page) {
      this.start += this.page_limit;
      this.pagenumber = Math.ceil(this.start / this.page_limit) + 1; // Update current page number
      this.gotoPageNumber = this.pagenumber; // Update input box
      this.distributorList('', this.column, this.sorting_type);
    }
  }
  goToPage() {
    if (this.gotoPageNumber < 1 || this.gotoPageNumber > this.total_page) {
      this.toast.errorToastr("Invalid page number");
      return;
    }
    this.pagenumber = this.gotoPageNumber;
    this.start = (this.pagenumber - 1) * this.page_limit;
    this.distributorList('', this.column, this.sorting_type);
  }

  distributorList(action: any = '', column, sorting_type) {
    if (action == "refresh") {
      let activeTab = this.filter.active_tab
      this.filter = { 'active_tab': activeTab };
      this.dr_list_temp = [];
      this.start = 0;
    }
    this.distributor_list = [];


    if (this.sort.type1 == 'DESC') {
      this.sort.value = "company_name"
      this.sort.type = "DESC"

    }
    else if (this.sort.type1 == 'ASC') {
      this.sort.value = "company_name"
      this.sort.type = "ASC"
    }
    else {
      this.sort.value = "date_created"
      this.sort.type = "DESC"
    }

    this.loader = true;

    if (this.pagenumber > this.total_page) {
      this.pagenumber = this.total_page;
      this.start = this.pageCount - this.page_limit;
    } if (this.start < 0) {
      this.start = 0
    }
    this.encryptedData = this.service.payLoad ? { 'start': this.start, 'pagelimit': this.page_limit, 'filter': this.filter, 'type': this.type_id, 'column_name': this.column, 'sorting_type': this.sorting_type } : this.cryptoService.encryptData({ 'start': this.start, 'pagelimit': this.page_limit, 'filter': this.filter, 'type': this.type_id, 'column_name': this.column, 'sorting_type': this.sorting_type });
    this.service.post_rqst(this.encryptedData, "CustomerNetwork/drList")
      .subscribe((result => {
        this.decryptedData = this.service.payLoad ? result : this.cryptoService.decryptData(JSON.stringify(result));
        if (this.decryptedData['statusCode'] == 200) {
          this.dr_list_temp = this.decryptedData['distributor'];
          this.headerData = this.decryptedData['headerData'];
          // this.gotoPageNumber = this.pagenumber; // ✅ Update input box when navigating

          this.pageCount = this.decryptedData['count'];
          if (this.dr_list_temp.length == 0) {
            this.datanotfound = true
          } else {
            this.datanotfound = false

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

          for (let i = 0; i < this.dr_list_temp.length; i++) {
            this.dr_list_temp[i]['encrypt_id'] = this.cryptoService.encryptId(this.dr_list_temp[i]['id'].toString());

            if (this.dr_list_temp[i].status == '1') {
              this.dr_list_temp[i].newStatus = true
            }
            else if (this.dr_list_temp[i].status == '0') {
              this.dr_list_temp[i].newStatus = false;

            }
          }
          this.loader = false;
        } else {
          this.toast.errorToastr(this.decryptedData['statusMsg']);
        }
      }))
  }


  // download excel

  excel_data: any = [];
  downloadExcel() {
    this.excelLoader = true;
    this.encryptedData = this.service.payLoad ? { 'search': this.value, 'type': this.type_id, 'filter': this.filter, 'type_name': this.type } : this.cryptoService.encryptData({ 'search': this.value, 'type': this.type_id, 'filter': this.filter, 'type_name': this.type });
    this.service.post_rqst(this.encryptedData, "Excel/dr_list").subscribe((result) => {
      this.decryptedData = this.service.payLoad ? result : this.cryptoService.decryptData(JSON.stringify(result));
      if (this.decryptedData['msg'] == true) {
        window.open(this.downurl + this.decryptedData['filename']);
        this.excelLoader = false;
        this.distributorList('', this.column, this.sorting_type);

      } else {

      }

    }, err => {
      this.excelLoader = false;

    });
  }

  // downloadInChunks() {

  //   this.downFilter = this.filter;
  //   this.downType = this.type;
  //   this.downTypeId = this.type_id;
  //   this.downValue = this.value;
  //   this.checkQue()
  // }

  downloadInChunks() {
    this.downFilter = this.filter;
    this.downType = this.type;
    this.downTypeId = this.type_id;
    this.downValue = this.value;

    this.encryptedData = this.service.payLoad ? { 'start': this.start, 'pagelimit': this.page_limit, 'filter': this.filter, 'type': this.type_id, 'column_name': this.column, 'sorting_type': this.sorting_type } : this.cryptoService.encryptData({ 'start': this.start, 'pagelimit': this.page_limit, 'filter': this.filter, 'type': this.type_id, 'column_name': this.column, 'sorting_type': this.sorting_type });
    this.service.post_rqst(this.encryptedData, "DownloadMaster/createQueueRequest").subscribe((result) => {
      this.decryptedData = this.service.payLoad ? result : this.cryptoService.decryptData(JSON.stringify(result));
      if (this.decryptedData['statusCode'] == 200) {
        if (this.decryptedData['code'] == 0) {
          this.toast.errorToastr(this.decryptedData['statusMsg']);
          return;
        }

        if (this.decryptedData['code'] == 1) {
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
      this.encryptedData = this.service.payLoad ? { 'search': this.downValue, 'type': this.downTypeId, 'filter': this.downFilter, 'type_name': this.type } : this.cryptoService.encryptData({ 'search': this.downValue, 'type': this.downTypeId, 'filter': this.downFilter, 'type_name': this.type });
      this.service.post_rqst(this.encryptedData, "DownloadMaster/downloadNetworkData").subscribe((result) => {
        this.decryptedData = this.service.payLoad ? result : this.cryptoService.decryptData(JSON.stringify(result));
        if (this.decryptedData['code'] === 1) {
          this.downloader = false;
          this.download_percent = null;
          // this.progressService.setDownloadProgress(this.download_percent);
          // this.progressService.setDownloaderActive(this.downloader);
          window.open(this.downurl + this.decryptedData['filename']);
          this.progressService.setTotalCount(0);
          this.progressService.setRemainingCount(0);
          this.progressService.setDownloadProgress(0);
          this.progressService.setDownloaderActive(false);
          this.distributorList('', this.column, this.sorting_type);
        } else if (this.decryptedData['code'] === 0) {
          // this.download_percent = ((this.decryptedData['totalCount'] - this.decryptedData['leftCount']) / this.decryptedData['totalCount']) * 100;
          this.download_percent = Math.ceil(((this.decryptedData['totalCount'] - this.decryptedData['leftCount']) / this.decryptedData['totalCount']) * 100);

          if (this.download_percent > 100) {
            this.download_percent = 100;
          }
          this.totalCount = this.decryptedData['totalCount'];
          this.remainingCount = this.decryptedData['leftCount'];
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





  updateStatus(index, id, event) {
    this.alert.confirm("You Want To Change Status !").then((res) => {
      if (res) {
        if (event.checked == false) {
          this.dr_list_temp[index].status = "0";
        }
        else {
          this.dr_list_temp[index].status = "1";
        }
        let value = this.dr_list_temp[index].status;
        this.encryptedData = this.service.payLoad ? { 'id': id, 'status': value, 'status_changed_by_id': this.assign_login_data2.id, 'status_changed_by_name': this.assign_login_data2.name } : this.cryptoService.encryptData({ 'id': id, 'status': value, 'status_changed_by_id': this.assign_login_data2.id, 'status_changed_by_name': this.assign_login_data2.name });

        this.service.post_rqst(this.encryptedData, "CustomerNetwork/drStatusChange")
          .subscribe(result => {
            this.decryptedData = this.service.payLoad ? result : this.cryptoService.decryptData(JSON.stringify(result));
            if (this.decryptedData['statusCode'] == 200) {
              this.toast.successToastr(this.decryptedData['statusMsg']);
              this.distributorList('', this.column, this.sorting_type);
            }
            else {
              this.toast.errorToastr(this.decryptedData['statusMsg']);
            }
          })
      }
    })
  }

  // upload_excel(type) {
  //   const dialogRef = this.alrt.open(UploadFileModalComponent, {
  //     width: '500px',
  //     panelClass: 'cs-modal',
  //     disableClose: true,
  //     data: {
  //       'from': 'Distribution',
  //       'type': this.type_id,
  //       'modal_type': type,
  //       'filter_data': this.filter

  //     }
  //   });
  //   dialogRef.afterClosed().subscribe(result => {
  //     if (result != false) {
  //       this.distributorList('', this.column, this.sorting_type);
  //     }

  //   });
  // }

  refresh() {
    console.log(this.dataToReceive)
    console.log(this.filter, 'line 419');
    this.filter = {};
    this.service.setData(this.filter)
    this.filter.active_tab = this.active_tab;
    if ((this.logined_user_data.organisation_data.home_page_sfa == 'Influencer' || this.logined_user_data.organisation_data.home_page_dms == 'Influencer')) {
      this.filter.active_tab = 'Inactive'
    }
    console.log(this.filter.active_tab);
    if (this.dataToReceive) {
      if (this.dataToReceive.user_id && this.logined_user_data.organisation_data.sfa == 1) {
        this.filter.user_id = this.dataToReceive.user_id
      }
    }
    this.start = 0;
    this.gotoPageNumber = 1;
    this.service.currentUserID = ''
    this.distributorList('refresh', this.column, this.sorting_type);
  }
  userDetail(id) {
    this.route.navigate(['/distribution-detail/' + id]);
  }
  tmpsearch1: any = {};


  id: any;
  state: any;
  goTODetail(id, state, type) {
    this.route.navigate(['/distribution-detail/' + id], { queryParams: { state, id, type } });
  }


  resetDevice(index, id) {
    this.alert.confirm("You Want To  Reset Device !").then((result) => {
      if (result) {
        this.encryptedData = this.service.payLoad ? { 'id': id, 'type': 'customer' } : this.cryptoService.encryptData({ 'id': id, 'type': 'customer' });

        this.service.post_rqst(this.encryptedData, "CustomerNetwork/resetDeviceId")
          .subscribe(result => {
            this.decryptedData = this.service.payLoad ? result : this.cryptoService.decryptData(JSON.stringify(result));

            if (this.decryptedData['statusCode'] == 200) {
              this.toast.successToastr(this.decryptedData['statusMsg']);
              this.distributorList('', this.column, this.sorting_type);
            }
            else {
              this.toast.errorToastr(this.decryptedData['statusMsg']);
            }
          })
      }
    })

  }

  openBottomSheet(): void {
    this.bottomSheet.open(BottomSheetComponent, {
      data: {
        'filterPage': 'distribution_list',
      }
    });
    this.bottomSheet._openedBottomSheetRef.afterDismissed().subscribe((data) => {
      console.log(data, "this is data")
      this.filter.date_from = data.date_from;
      this.filter.date_to = data.date_to;
      // this.search.userId = data.user_id;
      this.distributorList('', this.column, this.sorting_type);
    })
  }

  upload_excel(type) {
    const dialogRef = this.alrt.open(ChunksUploaderComponent, {
      width: '500px',
      panelClass: 'cs-modal',
      disableClose: true,
      data: {
        'For': type
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result == true) {
        this.distributorList('', this.column, this.sorting_type);
      }
    });
  }

  moveToActive(dr_id) {
    this.alert.confirm("You Want To Change Status !").then((res) => {
      // if (res) {
      //   this.encryptedData = this.service.payLoad ? { 'dr_id': dr_id} : this.cryptoService.encryptData({ 'dr_id': dr_id});
      //   this.service.post_rqst(this.encryptedData, "CustomerNetwork/convertLead")
      //   .subscribe(result => {
      //     this.decryptedData = this.service.payLoad ? result : this.cryptoService.decryptData(JSON.stringify(result));
      //     if (this.decryptedData['statusCode'] == 200) {
      //       this.toast.successToastr(this.decryptedData['statusMsg']);
      //       this.distributorList('', this.column, this.sorting_type);
      //     }
      //     else {
      //       this.toast.errorToastr(this.decryptedData['statusMsg']);
      //     }
      //   })
      // }
      if (res) {
        const drIdArray = [dr_id]; // Wrapping dr_id in an array
        this.encryptedData = this.service.payLoad ? { 'dr_id': drIdArray } : this.cryptoService.encryptData({ 'dr_id': drIdArray });
        this.service.post_rqst(this.encryptedData, "CustomerNetwork/convertLead")
          .subscribe(result => {
            this.decryptedData = this.service.payLoad ? result : this.cryptoService.decryptData(JSON.stringify(result));
            if (this.decryptedData['statusCode'] == 200) {
              this.toast.successToastr(this.decryptedData['statusMsg']);
              this.distributorList('', this.column, this.sorting_type);
            } else {
              this.toast.errorToastr(this.decryptedData['statusMsg']);
            }
          });
      }

    })
  }

  onClickRejectLead(dr_id) {
    this.alert.confirm("You Want To Change Status !").then((res) => {
      if (res) {
        this.encryptedData = this.service.payLoad ? { 'dr_id': dr_id } : this.cryptoService.encryptData({ 'dr_id': dr_id });
        this.service.post_rqst(this.encryptedData, "CustomerNetwork/leadStatusChange")
          .subscribe(result => {
            this.decryptedData = this.service.payLoad ? result : this.cryptoService.decryptData(JSON.stringify(result));
            if (this.decryptedData['statusCode'] == 200) {
              this.toast.successToastr(this.decryptedData['statusMsg']);
              this.distributorList('', this.column, this.sorting_type);
            }
            else {
              this.toast.errorToastr(this.decryptedData['statusMsg']);
            }
          })
      }
    })
  }


  upload_excel2(type) {
    const dialogRef = this.alrt.open(UploadFileModalComponent, {
      width: '500px',
      panelClass: 'cs-modal',
      disableClose: true,
      data: {
        'from': 'Distribution',
        'type': this.type_id,
        'modal_type': type,
        'filter_data': this.filter

      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result != false) {
        this.distributorList('', this.column, this.sorting_type);
      }

    });
  }

}