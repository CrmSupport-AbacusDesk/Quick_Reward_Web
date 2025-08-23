import { Component, OnInit, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { DatabaseService } from 'src/_services/DatabaseService';
import { ToastrManager } from 'ng6-toastr-notifications';
import { Router, ActivatedRoute } from '@angular/router';
import { sessionStorage } from 'src/app/localstorage.service';
import { CouponDetailModalComponent } from '../../coupon/coupon-detail-modal/coupon-detail-modal.component';
import { MatDialog} from '@angular/material';
import { Location } from '@angular/common';
import * as moment from 'moment';


@Component({
  selector: 'app-manual-dispatch-list',
  templateUrl: './manual-dispatch-list.component.html'
})

export class ManualDispatchListComponent implements OnInit {
  @ViewChild('focusInput') inputEl: ElementRef;
  
  
  data:any ={};
  couponNumber:any={};
  savingFlag:boolean = false;
  filter:any ={};
  distributorData:any =[];
  userData: any;
  
  returnData:any =[];
  loader: boolean = false;
  count: any;
  total_page: any;
  sr_no: any = 0;
  pageCount: any;
  page_limit: any;
  pagenumber: any = 1;
  start: any = 0;
  active_tab = 'Manual List';
  loginData: any;
  datanotfound : boolean = false
  total_list: any
  downurl:any ='';
  
  
  
  constructor(public location: Location,public service: DatabaseService, public dialog:MatDialog, public route: ActivatedRoute, public session:sessionStorage, public rout: Router, public toast:ToastrManager) { 
   
    this.loginData = this.session.getSession();
    this.loginData = this.loginData.value;
    this.loginData = this.loginData.data;
    this.userData = JSON.parse(localStorage.getItem('st_user'));
    this.data.created_by_id=this.userData['data']['id'];
    this.data.created_by_name=this.userData['data']['name'];
    this.page_limit = service.pageLimit;
    this.getDistributor('');
    this.getManualList('');
    
  }
  
  ngOnInit() {
  }
  
  
  ngAfterViewInit() {
    setTimeout(() => this.inputEl.nativeElement.focus());
  }
  
  
  
  pervious(active_tab) {
    this.start = this.start - this.page_limit;
    if(active_tab == 'Manual List'){
      this.getManualList('');
    }
  }
  
  nextPage(active_tab) {
    
    this.start = this.start + this.page_limit;
    if(active_tab == 'Manual List'){
      this.getManualList('');
    }
  }
  
  
  getDistributor(searcValue)
  {
    this.filter.search = searcValue;
    this.service.post_rqst({'filter':this.filter},'CouponCode/allDr').subscribe((result)=>
    {
      if (result['statusCode'] == 200){
        this.distributorData=result['result'];
      }
      else{
        this.toast.errorToastr(result['statusMsg']);
      }
    }, error => {
    })
  }
  
  
  
  findDr(id){
    let index=  this.distributorData.findIndex(row=>row.id==id)
    if(index!= -1){
      this.data.company_name= this.distributorData[index].company_name;
      this.data.dr_code= this.distributorData[index].dr_code;
    }
  }
  
  
  openDialog(id, type): void {  
    const dialogRef = this.dialog.open(CouponDetailModalComponent, {
      width: '1024px',
      panelClass:'cs-modal',
      data:{
        // 'from':'sales-return',
        'id': id,
      }
      
    });
    
    dialogRef.afterClosed().subscribe(result => {
      if(result == true){
      }
    });
  }
  
  couponList:any =[];
  
  checkCoupon(number)
  {
    if(number.length == 16){
      if(number == undefined){
        this.toast.errorToastr("Enter coupon code number");
        return;
      }
      if(number == ''){
        this.toast.errorToastr("Enter coupon code number");
        return;
      }
      
      this.service.post_rqst({'coupon_code':number},'CouponCode/checkCouponCodeCheck').subscribe((result)=>
      {
        if (result['statusCode'] == 200){
          this.couponNumber.coupon_number = '';
          let temData = result['data'];
          if(this.couponList != '')
          {
            let index = this.couponList.findIndex(row => row.coupon_code == temData.coupon_code)
            if (index != -1) {
              if(this.couponList[index].coupon_code === temData.coupon_code){
                this.toast.errorToastr('Coupon code already exists');
                return
              }
            }
          }
          this.couponList.push({'id':temData.id, 'coupon_code':temData.coupon_code, 'coupon_type':temData.coupon_type, 'master_packing_size':temData.master_packing_size});
        }
        else{
          this.couponNumber.coupon_number = '';
          this.toast.errorToastr(result['statusMsg']);
        }
      }
      , error => {
      })
    }
  }
  
  
  deleteCoupon(i)
  {
    this.couponList.splice(i,1);
    this.toast.successToastr('Coupon code delete successfully');
  }
  
  
  
  submitDetail(){
    this.data.couponData = this.couponList;
    this.savingFlag = true;
    this.service.post_rqst({'data':this.data},'CouponCode/updateDispatch').subscribe((result)=>
    {
      if (result['statusCode'] == 200){
        this.toast.successToastr(result['statusMsg']);
        this.active_tab = 'Manual List';
        this.savingFlag = false;
      }
      else{
        this.toast.errorToastr(result['statusMsg']);
        this.savingFlag = false;
      }
    })
    
  }
  
  back(){
    this.location.back()
  }  



  getManualList(action: any = '') {
    if (action == "refresh") {
      this.filter = {};
      this.start = 0;
    }
    if (this.pagenumber > this.total_page) {
      this.pagenumber = this.total_page;
      this.start = this.pageCount - this.page_limit;
    }
    
    if (this.start < 0) {
      this.start = 0;
    }
    if(this.filter.date_created){
      this.filter.date_created = moment(this.filter.date_created).format('YYYY-MM-DD');
    }
    this.loader = true;
    this.filter.active_tab = this.active_tab;
    this.service.post_rqst({'branch_code':this.loginData.branch_code, 'filter': this.filter, 'start': this.start, 'pagelimit': this.page_limit}, "Dispatch/getManualDispatchList")
    .subscribe((result => {
      if(result['statusCode']==200){
        this.returnData = result['result'];
        this.loader = false;
        this.pageCount = result['count'];
        this.total_list = (result['overall_total_sum']);
        if(this.returnData.length == 0){
          this.datanotfound = true
        }else{
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
      }else{
        this.loader = false;
        this.toast.errorToastr(result['statusMsg'])
      }
    }))
  }


  refresh(any, active_tab) {
    this.start = 0;
    this.filter={};
    if(active_tab == 'Manual List'){
      this.getManualList('');
    }
  }

  downloadExcel(){
    this.service.post_rqst({'branch_code':this.loginData.branch_code, 'filter': this.filter,}, "Excel/manualDispatchCsv").subscribe((result => {
      if(result['msg'] == true){
        window.open(this.downurl + result['filename'])
      }else{
      }
    }));
  }
  
}
