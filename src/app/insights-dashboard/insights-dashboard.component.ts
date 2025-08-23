import { Component, OnInit } from '@angular/core';
import { ToastrManager } from 'ng6-toastr-notifications';
import { DatabaseService } from 'src/_services/DatabaseService';

@Component({
  selector: 'app-insights-dashboard',
  templateUrl: './insights-dashboard.component.html',
  styleUrls: ['./insights-dashboard.component.scss']
})
export class InsightsDashboardComponent implements OnInit {
  
  insightsCount1:any =[];
  insightsCount2:any =[];
  loader1:boolean = false;

  constructor(public service: DatabaseService, public toast: ToastrManager) {
    this.getInsightsCount();
  }
  
  ngOnInit() {
  }

  refresh(){
    this.getInsightsCount();

  }
  
  getInsightsCount() {
    this.loader1 = true;
    this.service.post_rqst({}, 'Master/fetchAllCounts').subscribe((result) => {
      if (result['statusCode'] == 200) {
        this.loader1 = false;
        this.insightsCount1 = result['result']['data1'];
        this.insightsCount2 = result['result']['data2'];
        
      }
      else {
        this.toast.errorToastr(result['statusMsg']);
      }
    }, err => {
      this.toast.errorToastr('Something went wrong');
    })
  }
  
}
