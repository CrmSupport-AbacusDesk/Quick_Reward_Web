import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material';
import * as moment from 'moment';
import { getDate } from 'ngx-bootstrap/chronos/utils/date-getters';
// import { parse } from 'querystring';
import { DialogComponent } from 'src/app/dialog.component';
import { DatabaseService } from 'src/_services/DatabaseService';

@Component({
  selector: 'app-expesne-edit',
  templateUrl: './expesne-edit.component.html',
  styleUrls: ['./expesne-edit.component.scss']
})
export class ExpesneEditComponent implements OnInit {
  expense_detail: any = {};
  expense_type: any = 'no type';
  today_date = new Date();
  depatureTime:boolean = true;
  
  constructor(@Inject(MAT_DIALOG_DATA)public data,public dialog:MatDialog,public serve:DatabaseService,public dialogComponent: DialogComponent) { 
    
    console.log(this.data);
    if(this.data['from'] == 'expense detail page'){
      this.expense_detail = this.data['expense_detail'][0];
      this.expense_type = this.data['expense_type'];
      console.log(this.expense_detail);
      console.log(this.expense_type);
      
    } 
    
  }
  
  ngOnInit() {
  }
  
  date_format(type){
    
    if(type == 'hotel checkIn Date'){
      this.expense_detail.checkInDate = moment(this.expense_detail.checkInDate).format('YYYY-MM-DD');  
    }
    
    else if(type == 'hotel checkOut Date'){
      this.expense_detail.checkOutDate = moment(this.expense_detail.checkOutDate).format('YYYY-MM-DD');  
    }
    
    else if(type == 'Travelentitlement depatureDate'){
      this.expense_detail.depatureDate = moment(this.expense_detail.depatureDate).format('YYYY-MM-DD');  
    }
    
    else if(type == 'Travelentitlement arrivalDate'){
      this.expense_detail.arrivalDate = moment(this.expense_detail.arrivalDate).format('YYYY-MM-DD');  
    }
    
    else{
      this.expense_detail.date = moment(this.expense_detail.date).format('YYYY-MM-DD');
    }
    
    
    
  }
  
  update_expense(){
    console.log("update_expense method calls ");
    console.log(this.expense_detail);
    this.serve.post_rqst({ 'expense_detail': this.expense_detail,'expense_type':this.expense_type }, "Expense/update_expense_detail").subscribe((result => {
      console.log(result);
      if (result['msg'] == 'Updated Successfully') {
        console.log('in success function');
        this.dialog.closeAll();
        this.dialogComponent.success("Expense", "Updated");
      }
      else {
        console.log('in failed function');
        this.dialogComponent.error(result['msg']);
      }
    }))
    
    
  }
  
  
  convert_time(event,type){
    console.log("convert_time method calls");
    console.log(event);
    console.log(type);
    
    if(type == 'depatureTime'){
      this.expense_detail.depatureTime = moment(event).format('LT');
      console.log(this.expense_detail.depatureTime);
    }
    else if(type == 'arrivalTime'){
      this.expense_detail.arrivalTime = moment(event).format('LT');
      console.log(this.expense_detail.arrivalTime);
    }
    
    else{
      console.log(event);
      console.log(type);
      
    }
    
    
    
  }
  
  
  calc_amount(type){
    console.log("calc_amount method calls");
    console.log(type);
    
    if(type == 'local'){
      this.expense_detail.approvedAmount = parseInt(this.expense_detail.amount)  
      console.log(this.expense_detail.approvedAmount);
      
    }
    
    
    else if(type == 'food'){
      this.expense_detail.approvedAmount = parseInt(this.expense_detail.amount) 
      console.log(this.expense_detail.approvedAmount);

    }
    
    else if(type == 'hotel' || type == 'food' || type == 'local' || type == 'misc'){
      this.expense_detail.approvedAmount = parseInt(this.expense_detail.amount) 
      console.log(this.expense_detail.approvedAmount);

      
    }
    
    else if(type == 'Travelentitlement'){
      this.expense_detail.approvedAmount = parseInt(this.expense_detail.arrivalAmount) + parseInt(this.expense_detail.depatureAmount) 
      console.log(this.expense_detail.approvedAmount);

    }
    
    else if(type == 'misc'){
      this.expense_detail.approvedAmount = parseInt(this.expense_detail.amount) 
      console.log(this.expense_detail.approvedAmount);
      
    }
    else{
      console.log("in else");
      console.log(this.expense_detail);
      
    }
    console.log(this.expense_detail);
    
    
  }
  
  
  
  
  
  
}
