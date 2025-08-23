import { Component, OnInit } from '@angular/core';
import { DatabaseService } from 'src/_services/DatabaseService';
import * as moment from 'moment';
import { ToastrManager } from 'ng6-toastr-notifications';
import { DialogComponent } from 'src/app/dialog.component';
import { sessionStorage } from 'src/app/localstorage.service';
import { CryptoService } from 'src/_services/CryptoService';
import { ProgressService } from 'src/app/progress.service';


@Component({
  selector: 'app-bonus-list',
  templateUrl: './bonus-list.component.html'
})
export class BonusListComponent implements OnInit {

  fabBtnValue: any = 'add';
  active_tab: any = 'active'
  filter: any = {};
  
  count: any = {};
  tabCount: any;
  loader: boolean = false;

  // pegination
  pageCount: any;
  total_page: any;
  page_limit: any;
  pagenumber: any = 1;
  start: any = 0;
  bonusList_data: any = [];
  sr_no: number;
  userData: any;
  userId: any;
  assign_login_data: any = [];
  assign_login_data2: any = [];
  userName: any;
  noResult: boolean = false;
  downurl: any = '';
  today_date: Date;


  constructor(public service: DatabaseService,public progressService:ProgressService, public cryptoService:CryptoService,public toast: ToastrManager, public alert: DialogComponent, public session: sessionStorage) {
    this.today_date = new Date();
    this.downurl = service.downloadUrl;
    this.page_limit = service.pageLimit;
    this.assign_login_data = this.session.getSession();
    this.assign_login_data = this.assign_login_data.value;
    this.assign_login_data2 = this.assign_login_data.data;
    this.userData = JSON.parse(localStorage.getItem('st_user'));
    this.userId = this.userData['data']['id'];
    this.userName = this.userData['data']['name'];
  }

  ngOnInit() {
    this.filter = this.service.getData()
    if (this.filter.status) {
      this.active_tab = this.filter.status
    }
    this.bonusList();

  }

  pervious() {
    this.start = this.start - this.page_limit;
    this.bonusList();
  }

  nextPage() {
    this.start = this.start + this.page_limit;
    this.bonusList();
  }

  bonusList() {
    this.loader = true;
    if (this.pagenumber > this.total_page) {
      this.pagenumber = this.total_page;
    }
    if (this.start < 0) {
      this.start = 0;
    }

    if (this.filter.date_created) {

      this.filter.date_created = moment(this.filter.date_created).format('YYYY-MM-DD');
    }
    if (this.filter.end_date) {

      this.filter.end_date = moment(this.filter.end_date).format('YYYY-MM-DD');
    }
    if (this.filter.start_date) {

      this.filter.start_date = moment(this.filter.start_date).format('YYYY-MM-DD');
    }
    this.filter.status = this.active_tab
    this.service.post_rqst({ 'filter': this.filter, 'start': this.start, 'pagelimit': this.page_limit, 'status': this.active_tab }, 'Bonus/bonusList').subscribe((result) => {
      if ( result['statusCode'] == 200) {

        this.bonusList_data =  result['result'];
        this.bonusList_data.forEach(item => item['encrypt_id'] = this.cryptoService.encryptId(item['id']));
        this.tabCount =  result['tabCount'];
        this.pageCount =  result['count'];
        this.loader = false;
        if (this.pagenumber > this.total_page) {
          this.pagenumber = this.total_page;
          if (this.pageCount != 0) {

            this.start = this.pageCount - this.page_limit;
          }
          else {
            this.start = 0
          }
        }

        else {
          this.pagenumber = Math.ceil(this.start / this.page_limit) + 1;
        }
        this.total_page = Math.ceil(this.pageCount / this.page_limit);
        this.sr_no = this.pagenumber - 1;
        this.sr_no = this.sr_no * this.page_limit;
        setTimeout(() => {
          if (this.bonusList_data.length == 0) {
            this.noResult = true;
          }
        }, 500);
      }
      else {
        this.toast.errorToastr( result['statusMsg']);
      }
    })
  }


  lastBtnValue(value) {
    this.fabBtnValue = value;
  }
  refresh() {
    this.filter = {}
    this.service.setData(this.filter)
    this.service.currentUserID = ''
    this.bonusList();

  }
  change_status(id, index) {
    this.alert.confirm("You Want To Change Status !").then((result) => {
      if (result) {

        if (this.bonusList_data[index].status == "Active") {
          this.bonusList_data[index].status = "Inactive";
        }
        else {
          this.bonusList_data[index].status = "Active";
        }
        let status = this.bonusList_data[index].status
        this.service.post_rqst({ 'uid': this.userId, 'id': id, 'status': status }, 'Bonus/bonusStatusUpdate').subscribe((result) => {
          if (result['statusCode'] == 200) {
            this.toast.successToastr(result['statusMsg']);
            this.bonusList();
          }
          else {
            this.toast.errorToastr(result['statusMsg']);
          }
        }, error => {
        })
      }

    })
  }



  exportAsXLSX() {
    this.loader = true;
    this.service.post_rqst({ 'filter': this.filter, 'start': this.start, 'pagelimit': this.page_limit, 'status': this.active_tab }, 'Excel/bonus_list').subscribe((result) => {
      if (result['msg'] == true) {
        this.loader = false;
        window.open(this.downurl + result['filename'])
        this.bonusList();
      } else {
        this.loader = false;
      }
    }, err => {
      this.loader = false;
    });
  }

  downloadInChunks() {
    this.service.post_rqst({ 'filter': this.filter, 'start': this.start, 'pagelimit': this.page_limit }, "DownloadMaster/createQueueRequest").subscribe((result) => {
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
      this.excelLoader = false;
    });
  }

  downloader: any = false;
  download_percent: any;
  excelLoader: boolean = false;
  totalCount: any;
  remainingCount: any;
  

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
      this.service.post_rqst({ 'filter': this.filter, 'start': this.start, 'pagelimit': this.page_limit }, "DownloadMaster/downloadBonusData").subscribe((result) => {
        
        if (result['code'] === 1) {
          this.downloader = false;
          this.download_percent = null;
          window.open(this.downurl + result['filename']);
          this.progressService.setTotalCount(0);
          this.progressService.setRemainingCount(0);
          this.progressService.setDownloadProgress(0);
          this.progressService.setDownloaderActive(false);
          this.bonusList();
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
