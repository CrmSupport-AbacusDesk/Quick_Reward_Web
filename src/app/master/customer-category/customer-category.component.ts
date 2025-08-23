import { Component, OnInit } from '@angular/core';
import { DatabaseService } from 'src/_services/DatabaseService';
import { ToastrManager } from 'ng6-toastr-notifications';
import { ActivatedRoute, Router } from '@angular/router';
import { CryptoService } from 'src/_services/CryptoService';


@Component({
  selector: 'app-customer-category',
  templateUrl: './customer-category.component.html'
})
export class CustomerCategoryComponent implements OnInit {
  data:any ={};
  savingFlag:boolean = false;
  userData: any;
  userId: any;
  userName:any;
  customer_category_id:any;
  
  constructor(public service:DatabaseService, public cryptoService:CryptoService, public rout: Router, public toast:ToastrManager, private router: Router, private route: ActivatedRoute) {
    this.userData = JSON.parse(localStorage.getItem('st_user'));
    this.userId = this.userData['data']['id'];
    this.userName = this.userData['data']['name'];
  }
  
  ngOnInit() {
    this.route.params.subscribe(params => {
      this.customer_category_id = params['id'];
      if (this.customer_category_id)
      {
        // this.loader = true;
        this.getCategoryDetail();
      }
    });
  }
  
  MobileNumber(event: any) {
    const pattern = /[0-9\+\-\ ]/;
    let inputChar = String.fromCharCode(event.charCode);
    if (event.keyCode != 8 && !pattern.test(inputChar)) { event.preventDefault(); }
  }
  
  
  getCategoryDetail(){
    this.service.post_rqst({'id':this.customer_category_id},'Master/customerCategoryMasterDetail').subscribe((result)=>
    {
      if(result['statusCode'] == 200){
        this.data =  result['customer_category_detail'];
      }
      else{
        this.toast.errorToastr(result['statusMsg']);
      }

    })
  }
  
  
  
  submitDetail(){
    if(parseInt(this.data.range_end) <= parseInt(this.data.range_start) ){
      this.toast.errorToastr('The range end value should be greater than the range start value');
      return;
    }
    
    this.savingFlag = true;
    this.data.created_by_id   = this.userId;
    this.data.created_by_name   = this.userName;

    let header
    if(this.customer_category_id){
      header = this.service.post_rqst(this.data,'Master/editCustomerCategory')
    }
    else{
      header = this.service.post_rqst(this.data,'Master/addCustomerCategory')
    }
    
    header.subscribe((result)=>
    {
      if(result['statusCode'] == 200){
        this.toast.successToastr(result['statusMsg']);
        this.savingFlag = false;
        this.rout.navigate(['/customer-category']);
      }
      else{
        this.toast.errorToastr(result['statusMsg']);
        this.savingFlag = false;
      }
      
    })
    
  }
  
  
  
}
