import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { ActivatedRoute } from '@angular/router';
import { ToastrManager } from 'ng6-toastr-notifications';
import { CryptoService } from 'src/_services/CryptoService';
import { DatabaseService } from 'src/_services/DatabaseService';
import { sessionStorage } from 'src/app/localstorage.service';
import { RedeemStatusModalComponent } from 'src/app/redeem-status-modal/redeem-status-modal.component';

@Component({
  selector: 'app-travel-daily-plan-detail',
  templateUrl: './travel-daily-plan-detail.component.html'
})
export class TravelDailyPlanDetailComponent implements OnInit {
  skLoading: boolean = false;
  travel_id: any;
  travel_detail: any = {};
  encryptedData: any;
  decryptedData:any;
  assign_login_data: any;
  assign_login_data2: any;
  constructor(public location: Location,public dialog: MatDialog, public session: sessionStorage, public cryptoService:CryptoService, public service: DatabaseService, public route: ActivatedRoute, public toast: ToastrManager) {
    this.assign_login_data = this.session.getSession();
    this.assign_login_data = this.assign_login_data.value;
    this.assign_login_data2 = this.assign_login_data.data;
  }
  
  ngOnInit() {
    this.route.params.subscribe(params => {
      let id = params.id.replace(/_/g, '/');
      this.travel_id = this.cryptoService.decryptId(id);
      this.service.currentUserID = this.cryptoService.decryptId(id);
      if (this.travel_id) {
        this.travelDetail();
      }
    });
    
    
    
    
    
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
        this.travelDetail();
      }
    });
  }
  
  
  
  travelDetail() {
    this.skLoading = true;
    this.encryptedData = this.service.payLoad ? { 'travel_id': this.travel_id, 'filter': 'daily' }: this.cryptoService.encryptData({ 'travel_id': this.travel_id, 'filter': 'daily' });
    this.service.post_rqst(this.encryptedData, "Travel/getTravelData").subscribe(result => {
      this.decryptedData = this.service.payLoad ? result : this.cryptoService.decryptData(JSON.stringify(result));
      if (this.decryptedData['statusCode'] == 200) {
        this.skLoading = false;
        this.travel_detail = this.decryptedData['user_list_travel_plan'];
      } else {
        this.skLoading = false;
        this.toast.errorToastr(this.decryptedData['statusMsg']);
      }
      
    }, err => {
      this.toast.errorToastr('Something went wrong');
    })
  }
  
}
