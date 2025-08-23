import { Component, OnInit } from '@angular/core';
import { slideToTop } from '../../router-animation/router-animation.component';
import { DatabaseService } from 'src/_services/DatabaseService'
import { sessionStorage } from 'src/app/localstorage.service';
import { ToastrManager } from 'ng6-toastr-notifications';
import { CryptoService } from 'src/_services/CryptoService';

@Component({
  selector: 'app-annoucement-list',
  templateUrl: './annoucement-list.component.html',
  animations: [slideToTop()]
  
})
export class AnnoucementListComponent implements OnInit {
  
  announcementList:any=[];
  loader:any;
  datanotfound=false;
  skelton:any={}
  assign_login_data: any = [];
  assign_login_data2: any = [];
  
  sr_no:any=0;
  total_page:any;
  pageCount:any;
  page_limit: any = 20;
  pagenumber:any =1;
  start: any = 0;
  
  
  constructor(public toast: ToastrManager, public cryptoService:CryptoService, public service:DatabaseService,public session: sessionStorage)
  {
    this.skelton = new Array(10);
    
    this.assign_login_data = this.session.getSession();
    this.assign_login_data = this.assign_login_data.value;
    this.assign_login_data2 = this.assign_login_data.data;
    
    this.assign_login_data = this.assign_login_data.assignModule;
    
    
  }
  
  ngOnInit() {
    this.annoucementList();
    
  }
  
  
  inputValue(value){
    if(value > this.total_page){
      this.start = this.total_page;
    }
    else if(value == '' || value <= 0){
      this.start= 0;
    }
    else{
      this.start= (this.pagenumber*this.page_limit)-this.page_limit;
    }
    
    this.annoucementList()
  }
  
  pervious(){
    this.start = this.start - this.page_limit;
    this.annoucementList();
  }
  
  nextPage(){
    
    this.start = this.start + this.page_limit;
    this.annoucementList();
  }
  
  refresh(){
    this.service.currentUserID = ''
    this.annoucementList();
  }
  
  annoucementList()
  {
    this.loader=1;
    if(this.pagenumber > this.total_page){
      this.pagenumber = this.total_page;
      this.start = this.pageCount - this.page_limit;
    }
    
    if(this.start<0){
      this.start=0;
    }
    
    this.service.post_rqst({'user_id': this.assign_login_data2.id, 'start': this.start,'pagelimit': this.page_limit,'user_type': this.assign_login_data2.type},'Announcement/announcementList').subscribe((resp)=>
      {
      if(resp['statusCode']==200){
        this.announcementList = resp['announcementList'];
        this.announcementList.forEach(item => item['encrypt_id'] = this.cryptoService.encryptId(item['id']));
        
        this.pageCount=resp['count']
        
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
        
        if(this.announcementList.length ==0)
          {
          this.datanotfound=true;
        }
        else
        {
          this.datanotfound=false;
        }
        this.loader='';
      }else{
        this.toast.errorToastr(resp['statusMsg']);
      }
      
    },err=>{
      this.toast.errorToastr('Something went wrong');
    })
  }
  
}
