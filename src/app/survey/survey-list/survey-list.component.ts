import { Component, OnInit } from '@angular/core';
import { DatabaseService } from 'src/_services/DatabaseService';
import * as moment from 'moment';
import { DialogComponent } from 'src/app/dialog.component';
import { ToastrManager } from 'ng6-toastr-notifications';
import { sessionStorage } from 'src/app/localstorage.service';
import { CryptoService } from 'src/_services/CryptoService';


@Component({
  selector: 'app-survey-list',
  templateUrl: './survey-list.component.html'
})
export class SurveyListComponent implements OnInit {
  
  fabBtnValue:any ='add';
  active_tab:any ='Active'
  filter:any = {};
  loader:boolean = false;
  pageCount:any;
  total_page:any; 
  page_limit: any;
  pagenumber:any =1;
  start: any = 0;
  sr_no: number;
  count:any={};
  tabCount:any ={};
  serveylistdata:any=[];
  noResult:boolean = false;
  userData: any;
  userId: any;
  userName: any;
  assign_login_data:any;
  assign_login_data2:any;


  constructor(public service:DatabaseService, public cryptoService:CryptoService,public toast:ToastrManager, public alert: DialogComponent,public session:sessionStorage) {
    this.page_limit = service.pageLimit;
    this.assign_login_data = this.session.getSession();
    this.assign_login_data = this.assign_login_data.value;
    this.assign_login_data2 = this.assign_login_data.data;
    this.userData = JSON.parse(localStorage.getItem('st_user'));
    this.userId=this.userData['data']['id'];
    this.userName=this.userData['data']['name'];
    
    
  }
  
  ngOnInit() {
    this.filter = this.service.getData()
    if(this.filter.status){
      this.active_tab = this.filter.status
    }
    this.surveyList();

  }
  
  pervious(){
    this.start = this.start - this.page_limit;
    this.surveyList();
  }
  
  nextPage(){
    this.start = this.start + this.page_limit;
    this.surveyList();
  }
  
  
  surveyList(){
    this.loader =true;
    this.filter.status =  this.active_tab
    if(this.pagenumber > this.total_page){
      this.pagenumber = this.total_page;
    }
    if(this.start<0){
      this.start=0;
    }
    if (this.filter.date_created){
      this.filter.date_created = moment(this.filter.date_created).format('YYYY-MM-DD');
    }
    if (this.filter.start_date){
      this.filter.start_date = moment(this.filter.start_date).format('YYYY-MM-DD');
    }
    if (this.filter.end_date){
      this.filter.end_date = moment(this.filter.end_date).format('YYYY-MM-DD');
    }
    this.service.post_rqst({'filter':this.filter,'status':this.active_tab, 'start':this.start,'pagelimit':this.page_limit},'/Survey/surveyList').subscribe((result)=>{
      if (result['statusCode'] == 200) {
        this.serveylistdata = result['result'];
        this.serveylistdata.forEach(item => item['encrypt_id'] = this.cryptoService.encryptId(item['id']));
        this.loader =false;
        this.tabCount=result['tabCount']
        this.pageCount=result['count'];
        if(this.pagenumber > this.total_page){
          this.pagenumber = this.total_page;
          if(this.pageCount!=0){
            this.start = this.pageCount - this.page_limit;
          }
          else{
            this.start= 0
          }
        }
        
        else{
          this.pagenumber = Math.ceil(this.start/this.page_limit)+1;
        }
        this.total_page = Math.ceil(this.pageCount/this.page_limit);
        this.sr_no = this.pagenumber - 1;
        this.sr_no = this.sr_no * this.page_limit; 
        
        setTimeout(() => {
          if(this.serveylistdata.length == 0){
            this.noResult = true;
          } 
        }, 500);
      }
      else{
        this.toast.errorToastr(result['statusMsg']);
      }
    })
  }
  
  lastBtnValue(value){
    this.fabBtnValue = value;
  }  
  
  refresh()
  {
    this.filter={};
    this.service.setData(this.filter)
    this.service.currentUserID = ''
    this.surveyList();
  }
  
  change_status(id,index){
    this.alert.confirm("You Want To Change Status !").then((result)=>{
      if(result){
        
        if (this.serveylistdata[index].status == "Active") {
          this.serveylistdata[index].status = "Inactive";
        }
        else {
          this.serveylistdata[index].status = "Active";
        }
        let status=  this.serveylistdata[index].status 

        this.service.post_rqst({'uid':this.userId,'id':id,'status':status},'survey/surveyStatusUpdate').subscribe((result)=>
        { 
          if (result['statusCode'] == 200){
            this.toast.successToastr('Status Updated Successfully');
            this.surveyList();
          }
          else{
            this.toast.errorToastr(result['statusMsg']);
          }
        }, error => {
        })
      }
      
    })
  }
  
}
