import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrManager } from 'ng6-toastr-notifications';
import { DatabaseService } from 'src/_services/DatabaseService';

@Component({
  selector: 'app-expense-status',
  templateUrl: './expense-status.component.html',
  styleUrls: ['./expense-status.component.scss']
})
export class ExpenseStatusComponent implements OnInit {
  formData: any = {};
  savingFlag: boolean = false;
  star: any = '';
  start_rating: any = {};
  detail: any = {};
  URL: any = '';
  id: any;
  type:any;
  totalAmt: any;
  OrderStatus: boolean = false;
  constructor(public service: DatabaseService, public rout: Router, public route: ActivatedRoute, public toast: ToastrManager,) {

    this.route.params.subscribe(params => {
      console.log(params);
      this.id = params.id;
      if(this.id){
        this.expenseDetail();
      }
      this.type = params.type;
      this.formData.id = this.id;
      this.formData.seniorStatus = this.type;

    });
  }


  ngOnInit() {
  }

  Submit() {
    if(this.formData.seniorApprovedAmount == 0){
       this.toast.errorToastr('Enter a valid amount');
      return;
    }
    this.savingFlag = true;
    this.service.post_rqst({ 'data': this.formData }, 'WhatsappCron/expenseApproved').subscribe((result => {
      if (result['statusCode'] == 200) {
        this.OrderStatus = true;
        this.toast.successToastr(result['statusMsg']);
        // window.location.href='www.google.com';
        // window.close();
      }
      else {
        this.toast.errorToastr(result['statusMsg'])
        this.savingFlag = false;
      }

    }))
  }

  expenseDetail() {
    this.service.post_rqst({'id': this.id}, 'WhatsappCron/getexpenseDetail').subscribe((result => {
      if (result['statusCode'] == 200) {
        this.detail = result['result'];
        console.log(this.detail,'test');
      }


    }))
  }
  checkAmount(val){
    if(parseInt(val) > parseInt(this.detail.totalAmt)){
      this.formData.seniorApprovedAmount ='';
      this.toast.errorToastr('Amount Should Not More Than Claim Amount');
      return;
    }


  }
}
