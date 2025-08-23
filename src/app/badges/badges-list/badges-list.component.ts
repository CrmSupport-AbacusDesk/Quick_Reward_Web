import { Component, OnInit } from '@angular/core';
import { DatabaseService } from 'src/_services/DatabaseService';
import * as moment from 'moment';
import { ToastrManager } from 'ng6-toastr-notifications';
import { DialogComponent } from 'src/app/dialog.component';
import { sessionStorage } from 'src/app/localstorage.service';
import { CryptoService } from 'src/_services/CryptoService';
import { MatDialog } from '@angular/material';
import { ImageModuleComponent } from 'src/app/image-module/image-module.component';
import { StatusModalComponent } from 'src/app/order/status-modal/status-modal.component';


@Component({
  selector: 'app-badges-list',
  templateUrl: './badges-list.component.html'
})
export class BadgesListComponent implements OnInit {

  fabBtnValue: any = 'add';
  active_tab: any = 'active'
  filter: any = {};
  count: any = {};
  tabCount: any ={};
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
  encryptedData: any;
  decryptedData:any;
  today_date: Date;
  url:any;
  subType:number=0


  constructor(public service: DatabaseService, public cryptoService:CryptoService,public toast: ToastrManager, public dialogs: MatDialog, public alert: DialogComponent, public session: sessionStorage) {
    this.url = this.service.uploadUrl + 'badge_img/'
    this.today_date = new Date();
    this.downurl = service.downloadUrl;
    this.page_limit = service.pageLimit;
    this.assign_login_data = this.session.getSession();
    this.assign_login_data = this.assign_login_data.value;
    this.assign_login_data2 = this.assign_login_data.data;
    this.userData = JSON.parse(localStorage.getItem('st_user'));
    this.userId = this.userData['data']['id'];
    this.userName = this.userData['data']['name'];
    this.subType = parseInt(this.userData['organisation_data']['scanning_sub_type_wise']);
  }

  ngOnInit() {
    this.filter = this.service.getData()
    if (this.filter.status) {
      this.active_tab = this.filter.status
    }
    this.badgeList();

  }

  pervious() {
    this.start = this.start - this.page_limit;
    this.badgeList();
  }

  nextPage() {
    this.start = this.start + this.page_limit;
    this.badgeList();
  }

  badgeList() {
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
  
    this.filter.status = this.active_tab
    this.encryptedData = this.service.payLoad ? { 'filter': this.filter, 'start': this.start, 'pagelimit': this.page_limit, 'status': this.active_tab }: this.cryptoService.encryptData({ 'filter': this.filter, 'start': this.start, 'pagelimit': this.page_limit, 'status': this.active_tab });
    this.service.post_rqst(this.encryptedData, 'Bonus/influencerBudgeList').subscribe((result) => {
      this.decryptedData = this.service.payLoad ? result : this.cryptoService.decryptData(JSON.stringify(result));
      if ( this.decryptedData['statusCode'] == 200) {
        this.bonusList_data =  this.decryptedData['result']
        this.tabCount =  this.decryptedData['tabCount'];
        this.pageCount =  this.decryptedData['count'];
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
        this.toast.errorToastr( this.decryptedData['statusMsg']);
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
    this.badgeList();

  }
  change_status(id, index) {
    this.alert.confirm("You Want To Change Status !").then((result) => {
      if (result) {

        if (this.bonusList_data[index].status == "active") {
          this.bonusList_data[index].status = "inactive";
        }
        else {
          this.bonusList_data[index].status = "active";
        }
        let status = this.bonusList_data[index].status
        this.encryptedData = this.service.payLoad ? { 'uid': this.userId, 'id': id, 'status': status }: this.cryptoService.encryptData({ 'uid': this.userId, 'id': id, 'status': status });
        this.service.post_rqst(this.encryptedData, 'Bonus/badgeStatusUpdate').subscribe((result) => {
        this.decryptedData = this.service.payLoad ? result : this.cryptoService.decryptData(JSON.stringify(result));
          if (this.decryptedData['statusCode'] == 200) {
            this.toast.successToastr(this.decryptedData['statusMsg']);
            this.badgeList();
          }
          else {
            this.toast.errorToastr(this.decryptedData['statusMsg']);
          }
        }, error => {
        })
      }

    })
  }

  goToImage(image)
  {
    const dialogRef = this.dialogs.open(ImageModuleComponent, {
      panelClass:'Image-modal',
      data:{
        'image':image,
        'type':'base64'
      }});
      dialogRef.afterClosed().subscribe(result => {
      });
    }

  openDialog(id): void {
      const dialogRef = this.dialogs.open(StatusModalComponent, {
        width: '1024px',
        panelClass: 'cs-modal',
        disableClose: true,
        data: {
          from: 'badge',
          id: id
        }
  
      });
  
      dialogRef.afterClosed().subscribe(result => {
       
      });
    }

}
