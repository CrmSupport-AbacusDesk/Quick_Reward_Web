import { Component, OnInit } from '@angular/core';
import { slideToTop } from '../../router-animation/router-animation.component';
import { DatabaseService } from 'src/_services/DatabaseService';
// import { moment } from 'ngx-bootstrap/chronos/test/chain';
import * as moment from 'moment';
import { ToastrManager } from 'ng6-toastr-notifications';
import { Router } from '@angular/router';
import { CryptoService } from 'src/_services/CryptoService';


@Component({
  selector: 'app-add-holiday',
  templateUrl: './add-holiday.component.html',
  animations: [slideToTop()]
  
})
export class AddHolidayComponent implements OnInit {
  data:any={};
  state_data:any={};
  states: any = [];
  savingFlag:boolean = false;
  date;

  
  constructor(public service:DatabaseService,  public cryptoService:CryptoService,  public rout: Router,public toast:ToastrManager,) 
  {
    this.date = new Date();
    this.data.type = 'National';
  }
  
  
  ngOnInit() 
  {
    
  }
  
  
  
  
  getStateList() {
      this.service.post_rqst(0, "Master/getAllState").subscribe((result => {
      
        if (result['statusCode'] == 200) {
          this.states = result['all_state'];
        }
        else{
          this.toast.errorToastr(result['statusMsg'])
        }
      }));
  }
  
  
  submit()
  {
    
    if(this.data.holiday_date){
      this.data.holiday_date = moment(this.data.holiday_date).format('YYYY-MM-DD');
      this.data.holiday_date=this.data.holiday_date;
    }
    this.savingFlag = true;
    this.service.post_rqst(this.data,'Master/addHoliday').subscribe((result)=>
    {
      if(result['statusCode'] == 200){
        this.toast.successToastr(result['statusMsg']);
        this.savingFlag = false;
        this.rout.navigate(['/holiday-list']);
      }
      else{
        this.toast.errorToastr(result['statusMsg']);
        this.savingFlag = false;
      }
    })
  }
  
  
}
