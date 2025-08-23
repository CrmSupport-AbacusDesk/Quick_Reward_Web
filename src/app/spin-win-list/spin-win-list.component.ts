import { Component, OnInit } from '@angular/core';
import { ToastrManager } from 'ng6-toastr-notifications';
import { CryptoService } from 'src/_services/CryptoService';
import { DatabaseService } from 'src/_services/DatabaseService';
import { DialogComponent } from '../dialog.component';
import { sessionStorage } from '../localstorage.service';
import * as moment from 'moment';
import { StatusModalComponent } from '../order/status-modal/status-modal.component';
import { MatDialog } from '@angular/material';

@Component({
  selector: 'app-spin-win-list',
  templateUrl: './spin-win-list.component.html',
  styleUrls: ['./spin-win-list.component.scss']
})
export class SpinWinListComponent implements OnInit {
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
  spinDataList:any = [];
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
    // if (this.filter.status) {
    //   this.active_tab = this.filter.status
    // }
    this.spinBonusList();

  }

  pervious() {
    this.start = this.start - this.page_limit;
    this.spinBonusList();
  }

  nextPage() {
    this.start = this.start + this.page_limit;
    this.spinBonusList();
  }

  spinBonusList() {
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
    this.service.post_rqst(this.encryptedData, 'Bonus/userSpinList').subscribe((result) => {
      this.decryptedData = this.service.payLoad ? result : this.cryptoService.decryptData(JSON.stringify(result));
      if ( this.decryptedData['statusCode'] == 200) {
        this.spinDataList =  this.decryptedData['result']
        console.log(this.spinDataList);
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
          if (this.spinDataList.length == 0) {
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
    this.spinBonusList();

  }
  change_status(id, index) {
    this.alert.confirm("You Want To Change Status !").then((result) => {
      if (result) {

        if (this.spinDataList[index].status == "active") {
          this.spinDataList[index].status = "inactive";
        }
        else {
          this.spinDataList[index].status = "active";
        }
        let status = this.spinDataList[index].status
        this.encryptedData = this.service.payLoad ? { 'uid': this.userId, 'id': id, 'status': status }: this.cryptoService.encryptData({ 'uid': this.userId, 'id': id, 'status': status });
        this.service.post_rqst(this.encryptedData, 'Bonus/spinStatusUpdate').subscribe((result) => {
        this.decryptedData = this.service.payLoad ? result : this.cryptoService.decryptData(JSON.stringify(result));
          if (this.decryptedData['statusCode'] == 200) {
            this.toast.successToastr(this.decryptedData['statusMsg']);
            this.spinBonusList();
          }
          else {
            this.toast.errorToastr(this.decryptedData['statusMsg']);
          }
        }, error => {
          this.spinBonusList();
        })
      }
      this.spinBonusList();
    })
  }

  // goToImage(image)
  // {
  //   const dialogRef = this.dialogs.open(ImageModuleComponent, {
  //     panelClass:'Image-modal',
  //     data:{
  //       'image':image,
  //       'type':'base64'
  //     }});
  //     dialogRef.afterClosed().subscribe(result => {
  //     });
  //   }

  openDialog(id): void {
      const dialogRef = this.dialogs.open(StatusModalComponent, {
        width: '1024px',
        panelClass: 'cs-modal',
        disableClose: true,
        data: {
          from: 'spinwin',
          id: id
        }
  
      });
  
      dialogRef.afterClosed().subscribe(result => {
       
      });
    }

}
