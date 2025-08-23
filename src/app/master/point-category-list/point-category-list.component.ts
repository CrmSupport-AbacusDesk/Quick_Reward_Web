import { Component, OnInit } from '@angular/core';
import { slideToTop } from '../../router-animation/router-animation.component';
// import { MyserviceService } from 'src/app/myservice.service';
import { DatabaseService } from 'src/_services/DatabaseService';
import { DialogComponent } from 'src/app/dialog.component';
import { Router } from '@angular/router';
import * as moment from 'moment';
import { sessionStorage } from 'src/app/localstorage.service';
import { ToastrManager } from 'ng6-toastr-notifications';
import { CryptoService } from 'src/_services/CryptoService';
import { StatusModalComponent } from 'src/app/order/status-modal/status-modal.component';
import { MatDialog } from '@angular/material';
import { ProgressService } from 'src/app/progress.service';

@Component({
  selector: 'app-point-category-list',
  templateUrl: './point-category-list.component.html'
})
export class PointCategoryListComponent implements OnInit {
  fabBtnValue:any ='add';
  no_found:boolean = false;
  pointCategories_data:any=[];
  loader:boolean = false;
  filter:any = {};
  sr_no:any=0;
  pageCount:any;
  total_page:any; 
  page_limit: any;
  pagenumber:any =1;
  start: any = 0;
  assign_login_data:any={};
  logined_user_data:any={};
  downurl :any;
  today_date: Date;
  subType:any=1
  userData: any;
  headers:any=[]
  active_tab:any;
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


  
  constructor(public service:DatabaseService, public progressService: ProgressService, public cryptoService:CryptoService, public toast:ToastrManager, public alert: DialogComponent, public dialog2: MatDialog, public dialog:DialogComponent, private router: Router,public session: sessionStorage) 
  { 
    this.page_limit = service.pageLimit;
    this.downurl = service.downloadUrl
    this.pointCategory_data(this.active_tab);
    this.assign_login_data = this.session.getSession();
    this.logined_user_data = this.assign_login_data.value.data;
    this.today_date = new Date();
    this.userData = JSON.parse(localStorage.getItem('st_user'));
    console.log(this.userData);
    this.subType = parseInt(this.userData['organisation_data']['scanning_sub_type_wise'])

    if (this.userData.organisation_data.loyalty == '1') {
      this.active_tab = 'Influencer';
    }
    else
    {
      this.active_tab = 'Secondary';
    }
  }
  
  ngOnInit() {
  }
  
  pervious(){
    this.start = this.start - this.page_limit;
    this.pointCategory_data(this.active_tab);
    
  }
  
  nextPage(){
    this.start = this.start + this.page_limit;
    this.pointCategory_data(this.active_tab);
    
  }
  
  date_format(): void
  {
    this.filter.date_created=moment(this.filter.date_created).format('YYYY-MM-DD'); 
    this.pointCategory_data(this.active_tab);
    
  }

  openDialog(data) {
    data.columns = [
      {'label':'first', 'value':12},
      {'label':'second', 'value':13},
      {'label':'third', 'value':14},
    ]
    const dialogRef = this.dialog2.open(StatusModalComponent, {
      width: '400px',
      panelClass: 'cs-model',
      data: {
        from: 'point_category_modal',
        data:data
      }
    });

    // dialogRef.afterClosed().subscribe(result => {
    //   if (result != false) {
    //     this.pointCategory_data(this.active_tab);
    //   }
    // });
  }
  
  pointCategory_data(tab)
  {
    this.loader = true;
    if(this.pagenumber > this.total_page){
      this.pagenumber = this.total_page;
      this.start = this.pageCount - this.page_limit;
    }
    if(this.start<0){
      this.start=0;
    }
    
    this.filter.point_type = tab;
    this.service.post_rqst({'filter':this.filter, 'start':this.start,'pagelimit':this.page_limit} ,'Master/pointCategoryMasterListForPointCategory').subscribe((result)=>
    {
      if(result['statusCode'] == 200){
        this.pointCategories_data=result['point_category_list'];
        this.headers = result['headers']
        this.pageCount = result['count'];
        if(this.pagenumber > this.total_page){
          this.pagenumber = this.total_page;
          this.start = this.pageCount - this.page_limit;
        }
        else{
          this.pagenumber = Math.ceil(this.start/this.page_limit)+1;
        }
        this.total_page = Math.ceil(this.pageCount/this.page_limit);
        this.sr_no = this.pagenumber - 1;
        this.sr_no = this.sr_no * this.page_limit; 
        setTimeout(() => {
          this.loader = false;
        }, 700);
      }
      else{
        this.toast.errorToastr(result['statusMsg']);
      }
    }
    , error => {
    })
  }
  
  
  


  downloadInChunks() {
    this.service.post_rqst({'filter':this.filter}, "DownloadMaster/createQueueRequest").subscribe((result) => {
      if(result['statusCode'] == 200){
          if(result['code']== 0){
            this.toast.errorToastr(result['statusMsg']);
            return;
          }

          if(result['code']== 1 ){
            this.downloadExcel();
          }
      }
    }, err => {
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
      this.service.post_rqst({ 'filter': this.filter}, "DownloadMaster/downloadPointCategory").subscribe((result) => {
        
        if (result['code'] === 1) {
          this.downloader = false;
          this.download_percent = null;
          window.open(this.downurl + result['filename']);
          this.progressService.setTotalCount(0);
          this.progressService.setRemainingCount(0);
          this.progressService.setDownloadProgress(0);
          this.progressService.setDownloaderActive(false);
          this.pointCategory_data(this.active_tab);
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
      });
    }
  }


  lastBtnValue(value){
    this.fabBtnValue = value;
  }  
  refresh(){
    this.filter = {};
    this.pointCategory_data(this.active_tab);
  }
  edit(id){
    this.router.navigate(['/point-add/' +id]);
  } 
  
  delete(id){
    this.alert.delete('Point Category !').then((result) => {
      if (result) {
        this.service.post_rqst({'id':id}, "Master/deletePointCategoryMaster").subscribe((result) => {
          if (result['statusCode'] == 200) {
            this.toast.successToastr(result['statusMsg']);
            this.pointCategory_data(this.active_tab);
          }
          else {
            this.toast.errorToastr(result['statusMsg']);
          }
         
        })
      }
    });
    
    
  }
}
