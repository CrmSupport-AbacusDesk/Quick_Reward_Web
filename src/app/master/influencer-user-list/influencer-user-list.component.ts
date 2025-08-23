import { Component, OnInit } from '@angular/core';
import { DialogComponent } from 'src/app/dialog.component';
import { DatabaseService } from 'src/_services/DatabaseService';
import * as moment from 'moment';
import { Router } from '@angular/router';
import { ToastrManager } from 'ng6-toastr-notifications';
import { sessionStorage } from 'src/app/localstorage.service';
import { CryptoService } from 'src/_services/CryptoService';


@Component({
  selector: 'app-influencer-user-list',
  templateUrl: './influencer-user-list.component.html'
})


export class InfluencerUserListComponent implements OnInit {
  filter:any ={};
  excelLoader:boolean= false;
  categoryList:any =[];
  loader:boolean = false;
  page_limit: any;
  start: any = 0;
  pagenumber:any =1;
  total_page:any; 
  pageCount:any;
  sr_no:any =0;
  datanotfound: boolean=false;
  downurl:any = ''
  assign_login_data:any={};
  logined_user_data:any={};
  today_date: Date;
  encryptedData: any;
  decryptedData:any;
  
  constructor(public service: DatabaseService,public cryptoService:CryptoService,  public toast:ToastrManager, public alert: DialogComponent, private router: Router,public session: sessionStorage) { 
    this.page_limit = service.pageLimit;
    this.downurl = service.downloadUrl
    this.assign_login_data = this.session.getSession();
    this.logined_user_data = this.assign_login_data.value.data;
    this.getInfluencer();
    this.today_date = new Date();

  }
  
  ngOnInit() {
  }
  
  pervious(){
    this.start = this.start - this.page_limit;
    this.getInfluencer();
  }
  
  nextPage(){
    this.start = this.start + this.page_limit;
    this.getInfluencer();
  }
  
  
  date_format(): void
  {
    this.filter.date_created=moment(this.filter.date_created).format('YYYY-MM-DD'); 
    this.getInfluencer();
  }
  
  
  getInfluencer() {
    this.loader = true;
    if(this.pagenumber > this.total_page){
      this.pagenumber = this.total_page;
      this.start = this.pageCount - this.page_limit;
    }
    if(this.start<0){
      this.start=0;
    }
    this.encryptedData = this.service.payLoad ? {'filter':this.filter, 'start':this.start,'pagelimit':this.page_limit}: this.cryptoService.encryptData({'filter':this.filter, 'start':this.start,'pagelimit':this.page_limit});
    this.service.post_rqst(this.encryptedData, "Master/influencerMasterList").subscribe((result => {
      this.decryptedData = this.service.payLoad ? result : this.cryptoService.decryptData(JSON.stringify(result));
      if(this.decryptedData['statusCode'] == 200){
        this.categoryList = this.decryptedData['result'];
        this.pageCount = this.decryptedData['count'];
        if(this.categoryList.length==0){
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
        this.loader = false;
      }
      else{
        this.toast.errorToastr(this.decryptedData['statusMsg']);
      }
    }));
    
  }
  
  
  refresh(){
    this.filter = {};
    this.getInfluencer();
  }
  
  delete(id){
    this.alert.delete('Influencer category!').then((result) => {
      if (result) {
    this.encryptedData = this.service.payLoad ? {'id':id}: this.cryptoService.encryptData({'id':id});
        this.service.post_rqst(this.encryptedData,'Master/influencerMasterDelete').subscribe((resp)=>
        {   
          this.decryptedData = this.service.payLoad ? result : this.cryptoService.decryptData(JSON.stringify(result));
          if (this.decryptedData['statusCode'] == 200) {
            this.toast.successToastr(this.decryptedData['statusMsg']);
            this.getInfluencer()
          }
          else {
            this.toast.errorToastr(this.decryptedData['statusMsg']);
          }
        })
      }
    });
    
    
  }
  downloadExcel(){
    this.encryptedData = this.service.payLoad ? {'filter':this.filter, 'start':this.start,'pagelimit':this.page_limit}: this.cryptoService.encryptData({'filter':this.filter, 'start':this.start,'pagelimit':this.page_limit});
    this.service.post_rqst(this.encryptedData, "Excel/influencerMasterList").subscribe((result => {
      this.decryptedData = this.service.payLoad ? result : this.cryptoService.decryptData(JSON.stringify(result));
      if(this.decryptedData['msg'] == true){
        window.open(this.downurl + this.decryptedData['filename'])
        this.getInfluencer();
      }else{
      }
    }));
  }
  
  edit(id, module_name, scanning_rights){
    this.router.navigate(['/influencer-user-add/' + module_name + '/' + id + '/' + scanning_rights], { queryParams: { module_name, id, scanning_rights} });
  }
  
  
}
