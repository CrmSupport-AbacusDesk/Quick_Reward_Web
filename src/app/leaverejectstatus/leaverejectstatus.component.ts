import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrManager } from 'ng6-toastr-notifications';
import { DatabaseService } from 'src/_services/DatabaseService';

@Component({
  selector: 'app-leaverejectstatus',
  templateUrl: './leaverejectstatus.component.html',
  styleUrls: ['./leaverejectstatus.component.scss']
})
export class LeaverejectstatusComponent implements OnInit {

  formData: any = {};
  savingFlag: boolean = false;
  star: any = '';
  start_rating: any = {};
  URL: any = '';
  id: any;
  type: any;
  OrderStatus: boolean = false;

    constructor(public service: DatabaseService, public rout: Router, public route: ActivatedRoute, public toast: ToastrManager,) {

    this.route.params.subscribe(params => {
      console.log(params);
      this.id = params.id;
      this.type = params.type;
      this.formData.id= this.id;
      this.formData.status= this.type;
      // if (this.formData.status == 'Approved') {
      //   this.Submit();
      // }
      //  else{
      //   this.formData.status = 'Reject';
      // }
      console.log(this.formData);
    });


  }



   ngOnInit() {
  }

  Submit() {
    this.savingFlag = true;
    this.service.post_rqst({ 'data': this.formData }, 'WhatsappCron/leaveApproved').subscribe((result => {
      if (result['statusCode'] == 200) {
        this.toast.successToastr(result['statusMsg']);
        // this.OrderStatus = true;
        // window.location.href='www.google.com';
        // window.close();
      }
      else {
        this.toast.errorToastr(result['statusMsg'])
        // this.savingFlag = false;
      }

    }))
  }
}