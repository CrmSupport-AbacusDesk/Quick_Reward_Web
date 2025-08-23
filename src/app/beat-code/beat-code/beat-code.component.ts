import { Component, OnInit } from '@angular/core';
import { DatabaseService } from 'src/_services/DatabaseService';
import { DialogComponent } from 'src/app/dialog.component';
import { ToastrManager } from 'ng6-toastr-notifications';
import { MatDialog } from '@angular/material';
import * as moment from 'moment';
import { sessionStorage } from 'src/app/localstorage.service';
import { StatusModalComponent } from 'src/app/order/status-modal/status-modal.component';
import { CryptoService } from 'src/_services/CryptoService';
import { ChunksUploaderComponent } from 'src/app/uploader-new/chunks-uploader/chunks-uploader.component';
import { ProgressService } from 'src/app/progress.service';

@Component({
  selector: 'app-beat-code',
  templateUrl: './beat-code.component.html'
})
export class BeatCodeComponent implements OnInit {
  active_tab:any ={}
  beat_code_data:any=[];
  postal_code_data:any=[];
  skLoading:boolean = false;
  data:any ={};
  filter:any ={};
  datanotfound:boolean=false;
  pageCount:any;
  total_page:any;
  page_limit: any;
  pagenumber:any =1;
  start: any = 0;
  sr_no: number;
  savingFlag:boolean= false;
  downurl: any = ''
  download_excel_loader:boolean=false;
  assign_login_data:any;
  assign_login_data2:any;
  login_data:any={};
  today_date:any;
  excelLoader: boolean = false;
  downloader: any = false;
  download_percent: any;
  totalCount: any;
  remainingCount: any;

  
  
  constructor(public service:DatabaseService, public progressService: ProgressService,  public cryptoService: CryptoService, public toast:ToastrManager, public dialog:DialogComponent,public alrt: MatDialog,public session: sessionStorage)
  {
    
    this.assign_login_data = this.session.getSession();
    this.assign_login_data = this.assign_login_data.value;
    this.assign_login_data2 = this.assign_login_data.data;
    this.login_data = this.session.getSession();
    this.login_data = this.login_data.value;
    this.login_data = this.login_data.data;
    this.downurl = service.downloadUrl;
    this.page_limit = this.service.pageLimit;
    this.today_date = new Date();
    this.beatCode();
    this.active_tab = 'Territory';
  }
  
  
  ngOnInit() {
  }
  
  pervious(){
    this.start = this.start - this.page_limit;
    if(this.active_tab == 'Territory'){
      this.beatCode();
    }
    else{
      this.postalCode();
    }
  
  }
  
  nextPage(){
    this.start = this.start + this.page_limit;
    if(this.active_tab == 'Territory'){
      this.beatCode();
    }
    else{
      this.postalCode();
    }
  }
  
  
  refresh(){
    this.filter = {};
    this.data ='';
    this.start = 0;
    if(this.active_tab == 'Territory'){
      this.beatCode();
    }
    else{
      this.postalCode();
    }
  }
  
  public onDate(event): void{
    if(this.filter.date_created){
      this.filter.date_created=moment(event.value).format('YYYY-MM-DD');
      this.beatCode();
    }
  }
  
  
  beatCode()
  {
    this.skLoading =true;
    if(this.pagenumber > this.total_page){
      this.pagenumber = this.total_page;
      this.start = this.pageCount - this.page_limit;
    }
    
    if(this.start<0){
      this.start=0;
    }
    this.service.post_rqst({'filter':this.filter, 'start':this.start,'pagelimit':this.page_limit},'Master/territoryCodeList').subscribe((result)=>
      {
      if (result['statusCode'] == 200) {
        this.skLoading =false;
        this.beat_code_data=result['result'];
        this.pageCount = result['count'];
        if(this.beat_code_data.length==0){
          this.datanotfound=true;
        }else{
          this.datanotfound=false;
        }
        
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
        this.service.count_list();
      }
      else{
        this.skLoading =false;
        this.toast.errorToastr(result['statusMsg'])
      }
    }
  )
}

postalCode()
{
  this.skLoading =true;
  if(this.pagenumber > this.total_page){
    this.pagenumber = this.total_page;
    this.start = this.pageCount - this.page_limit;
  }
  
  if(this.start<0){
    this.start=0;
  }
  this.service.post_rqst({'filter':this.filter, 'start':this.start,'pagelimit':this.page_limit},'Master/postalCodeList').subscribe((result)=>
    {
    if (result['statusCode'] == 200) {
      this.skLoading =false;
      this.postal_code_data=result['result'];
      this.pageCount = result['count'];
      if(this.postal_code_data.length==0){
        this.datanotfound=true;
      }else{
        this.datanotfound=false;
      }
      
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
      this.service.count_list();
    }
    else{
      this.skLoading =false;
      this.toast.errorToastr(result['statusMsg'])
    }
  }
)
}



delete(id)
{
  this.dialog.delete('Territory Code!').then((result) => {
    if(result)
      {
      this.service.post_rqst({"id":id},"Master/territoryDelete").subscribe((result=>{
        if (result['statusCode'] == 200) {
          this.toast.successToastr(result['statusMsg']);
          this.beatCode();
        }
        else {
          this.toast.errorToastr(result['statusMsg']);
        }
        
      }))
    }})
    
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
        this.beatCode();
      }
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
            this.downloadExcel();
          }
      }
    }, err => {
      this.excelLoader = false;
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
      this.service.post_rqst({ 'filter': this.filter, 'start': this.start, 'pagelimit': this.page_limit }, "DownloadMaster/downloadTerritoryData").subscribe((result) => {
        if (result['code'] === 1) {
          this.downloader = false;
          this.download_percent = null;
          window.open(this.downurl + result['filename']);
          this.progressService.setTotalCount(0);
          this.progressService.setRemainingCount(0);
          this.progressService.setDownloadProgress(0);
          this.progressService.setDownloaderActive(false);
          this.beatCode();

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
        this.excelLoader = false;

      });
    }
  }
  

  openDialog(list, type): void {
    const dialogRef = this.alrt.open(StatusModalComponent, {
      width: type == 'beat_code_edit'? '400px' : '1024px',
      panelClass:'cs-model',
      data: {
        id:list.id,
        area_name:list.area,
        all_data:list,
        beat_code:list.beat_code,
        delivery_from: type,
      }
    });
    
    dialogRef.afterClosed().subscribe(result => {
      if(result != false){
        this.beatCode();
      }
    });
  }
  
}
