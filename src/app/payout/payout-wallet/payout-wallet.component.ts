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

@Component({
  selector: 'app-payout-wallet',
  templateUrl: './payout-wallet.component.html',
})
export class PayoutWalletComponent implements OnInit {
  fabBtnValue:any ='add';
  active_tab:any ='Ledger';
  no_found:boolean = false;
  payOutList:any=[];
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
  encryptedData:any;
  decryptedData:any;
  bal:any ={};


  
  constructor(public service:DatabaseService, public cryptoService:CryptoService, public toast:ToastrManager, public alert: DialogComponent, public dialog:DialogComponent, private router: Router,public session: sessionStorage) 
  { this.page_limit = service.pageLimit;
    this.downurl = service.downloadUrl
    this.assign_login_data = this.session.getSession();
    this.logined_user_data = this.assign_login_data.value.data;
    this.today_date = new Date();
  }
  
  ngOnInit() {
    if(this.logined_user_data.organisation_data.payout == '1'){
      this.getPayoutList(this.active_tab);
      this.getBal();
    }
  }
  
  
  
  pervious(){
    this.start = this.start - this.page_limit;
    this.getPayoutList(this.active_tab);
    
  }
  
  nextPage(){
    this.start = this.start + this.page_limit;
    this.getPayoutList(this.active_tab);
    
  }
  
  date_format(): void
  {
    this.filter.date_created=moment(this.filter.date_created).format('YYYY-MM-DD'); 
    this.getPayoutList(this.active_tab);
    
  }
  
  getPayoutList(tab)
  {
    this.loader = true;
    if(this.pagenumber > this.total_page){
      this.pagenumber = this.total_page;
      this.start = this.pageCount - this.page_limit;
    }
    if(this.start<0){
      this.start=0;
    }
    
    this.filter.status = tab;
    this.encryptedData = this.service.payLoad ? {'filter':this.filter, 'start':this.start,'pagelimit':this.page_limit}: this.cryptoService.encryptData({'filter':this.filter, 'start':this.start,'pagelimit':this.page_limit});
    this.service.post_rqst(this.encryptedData ,'Payout/transactionHistory').subscribe((result)=>
    {
      this.decryptedData = this.service.payLoad ? result : this.cryptoService.decryptData(JSON.stringify(result));
      if(this.decryptedData['statusCode'] == 200){
        this.payOutList=this.decryptedData['client_ledger'];
        this.pageCount = this.decryptedData['count'];
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
        this.toast.errorToastr(this.decryptedData['statusMsg']);
      }
    }
    , error => {
    })
  }

  getBal()
  {
    this.encryptedData = this.service.payLoad ? {'filter':this.filter, 'start':this.start,'pagelimit':this.page_limit}: this.cryptoService.encryptData({'filter':this.filter, 'start':this.start,'pagelimit':this.page_limit});
    this.service.post_rqst(this.encryptedData ,'Payout/getBalance').subscribe((result)=>
    {
      this.decryptedData = this.service.payLoad ? result : this.cryptoService.decryptData(JSON.stringify(result));
      if(this.decryptedData['statusCode'] == 200){
        this.bal=this.decryptedData['result'];
      }
      else{
        this.toast.errorToastr(this.decryptedData['statusMsg']);
      }
    }
    , error => {
    })
  }
  
  
  
  
  
  getpointCategoryExcel(user_type) {
    this.service.post_rqst({'filter':this.filter}, "Excel/point_category_master_list_for_export").subscribe((result) => {
      this.decryptedData = this.service.payLoad ? result : this.cryptoService.decryptData(JSON.stringify(result));
      if(this.decryptedData['msg'] == true){
        window.open(this.downurl + this.decryptedData['filename'])
        this.getPayoutList(this.active_tab);
      }else{
      }
    });
  }
  lastBtnValue(value){
    this.fabBtnValue = value;
  }  
  refresh(){
    this.filter = {};
    this.getPayoutList(this.active_tab);
  }
  edit(id){
    this.router.navigate(['/point-add/' +id]);
  } 
  
  delete(id){
    this.alert.delete('Point Category !').then((result) => {
      if (result) {
    this.encryptedData = this.service.payLoad ? {'id':id}: this.cryptoService.encryptData({'id':id});
        this.service.post_rqst(this.encryptedData, "Master/deletePointCategoryMaster").subscribe((result) => {
      this.decryptedData = this.service.payLoad ? result : this.cryptoService.decryptData(JSON.stringify(result));
          
          if (this.decryptedData['statusCode'] == 200) {
            this.toast.successToastr(this.decryptedData['statusMsg']);
            this.getPayoutList(this.active_tab);
          }
          else {
            this.toast.errorToastr(this.decryptedData['statusMsg']);
          }
         
        })
      }
    });
    
    
  }
}

