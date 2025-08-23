import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { ActivatedRoute, Router } from '@angular/router';
import { DialogComponent } from 'src/app/dialog.component';
import { DatabaseService } from 'src/_services/DatabaseService';
import { TravelStatusModalComponent } from '../travel-status-modal/travel-status-modal.component';
import { sessionStorage } from 'src/app/localstorage.service';
import { ToastrManager } from 'ng6-toastr-notifications';
import { Location } from '@angular/common';
import { CryptoService } from 'src/_services/CryptoService';
import { RedeemStatusModalComponent } from 'src/app/redeem-status-modal/redeem-status-modal.component';


@Component({
  selector: 'app-travel-sub-detail',
  templateUrl: './travel-sub-detail.component.html'
})
export class TravelSubDetailComponent implements OnInit {
  loader: boolean = false;
  todayDate: any = new Date().toISOString().slice(0, 10);
  monthNames: string[];
  date: any;
  userId: any
  travel_id: any;
  travel_detail: any = {};
  assign_login_data: any;
  assign_login_data2: any;
  skLoading: boolean = false;
  activeDate: any = new Date();
  activeIndex: number = 0;
  routesValue: any;
  
  constructor(public toast: ToastrManager, public cryptoService:CryptoService, public location: Location, public service: DatabaseService, public dialog: MatDialog, public dialog1: DialogComponent, public router: Router, public route: ActivatedRoute, public session: sessionStorage) {
    this.date = new Date();
    this.monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    this.assign_login_data = this.session.getSession();
    this.assign_login_data = this.assign_login_data.value;
    this.assign_login_data2 = this.assign_login_data.data;
    
  }
  
  ngOnInit() {
    this.route.params.subscribe(params => {
      this.routesValue = this.route.queryParams['_value'];
      let id = params.id.replace(/_/g, '/');
      this.travel_id = this.cryptoService.decryptId(id);
      this.service.currentUserID = this.cryptoService.decryptId(id);
      this.userId = this.cryptoService.decryptId(id);
      if(id){
        this.travelDetail('');
      }
      
    });
  }
  
  setActiveIndex(index: number) {
    this.activeIndex = index;
  }
  
  
  
  travelDetail(date) {
    this.skLoading = true;
    this.service.post_rqst({ 'filter': 'month', 'travel_id': this.travel_id, 'date': date }, "Travel/getTravelData").subscribe(result => {
      if (result['statusCode'] == 200) {
        this.skLoading = false;
        this.travel_detail = result['user_list_travel_plan'];
        
      } else {
        this.skLoading = false;
        this.toast.errorToastr(result['statusMsg']);
      }
      
    }, err => {
      this.toast.errorToastr('Something went wrong');
    })
  }
  
  
  back(): void {
    this.location.back()
  }
  
  changeStatusDialog(id, type): void {
    const dialogRef = this.dialog.open(RedeemStatusModalComponent, {
      width: '400px', data: {
        id: id,
        delivery_from: type,       
      }
    });
    
    dialogRef.afterClosed().subscribe(result => {
      if (result != false) {
        this.travelDetail('');
      }
    });
  }
  
}
