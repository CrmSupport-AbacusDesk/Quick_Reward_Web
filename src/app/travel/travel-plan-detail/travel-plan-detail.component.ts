import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { DatabaseService } from 'src/_services/DatabaseService';
import { Router } from '@angular/router';
import { Location } from '@angular/common';

import { ActivatedRoute } from '@angular/router';
import { DialogComponent } from 'src/app/dialog.component';
import { ToastrManager } from 'ng6-toastr-notifications';
import { MatDialog } from '@angular/material';
import { StatusModalComponent } from 'src/app/order/status-modal/status-modal.component';
import { sessionStorage } from 'src/app/localstorage.service';
import { addTravelListModal } from '../add-travel-list/add-travel-list-modal.component';
import { CheckindocumentComponent } from 'src/app/checkindocument/checkindocument.component';
import { CryptoService } from 'src/_services/CryptoService';




@Component({
  selector: 'app-travel-plan-detail',
  templateUrl: './travel-plan-detail.component.html',
  styleUrls: ['./travel-plan-detail.component.scss']
})
export class TravelPlanDetailComponent implements OnInit {
  skLoading: boolean = false;
  travellist: any;
  travelData: any = {};
  cus_network: any = [];
  checkin: any = [];
  traveldistributor: any;
  travelarea: any;
  travel_id: any;
  travel_date: any;
  travel_month: any;
  travel_year: any;
  check_in_data: any = [];
  assign_user_data: any = {};
  logined_user_data: any = {};
  travelType: any = {};
  traveldetailsAreawise: any = [];
  showAddbuttonArea: boolean = false;

  constructor(public alert: DialogComponent, public cryptoService:CryptoService, public toast: ToastrManager, public service: DatabaseService, public dialog: MatDialog, public rout: Router, public route: ActivatedRoute, private _location: Location, public session: sessionStorage) {
    this.skLoading = true;
    this.route.params.subscribe(params => {
      this.travel_id = route.params['_value'].id;
      this.service.currentUserID = route.params['_value'].id
      this.travel_date = this.route.queryParams['_value']['date'];
      this.travel_month = this.route.queryParams['_value']['currentMonth'];
      this.travel_year = this.route.queryParams['_value']['currentYear'];
    });
    this.assign_user_data = this.session.getSession();
    this.logined_user_data = this.assign_user_data.value.data;
    this.travelDetail()
  }

  ngOnInit() {


  }
  backToList() {
    this._location.back();
  }


  travelDetail() {
    this.skLoading = true;
    this.service.post_rqst({ 'User_id': this.travel_id, 'Travel_date': this.travel_date }, "Travel/travelPlanDetail").subscribe(result => {
      if (result['statusCode'] == 200) {
        this.skLoading = false;
        this.travellist = result['result']['tarvel_plan_detail'];
        this.cus_network = result['result']['distributor_network'];
        this.checkin = result['result']['checkin_data'];
        this.travelType = result['typeVisit'];
      }
      else {
        this.skLoading = false;
        let id = this.travel_id;
        let year = this.travel_year;
        let month = this.travel_month;
        this.showAddbuttonArea = true;
        this.toast.errorToastr(result['statusMsg']);
        // this.rout.navigate(['/travel-sub-detail/' + this.travel_id], { queryParams: { id, month, year } });
      }

    }, err => {
      this.skLoading = false;
      this.toast.errorToastr('Something went wrong');

    })
  }


 

  openDialog(listt): void {
    const dialogRef = this.dialog.open(StatusModalComponent, {
      width: '400px',
      panelClass: 'cs-model',
      data: {
        drType: listt.type,
        company_name: listt.company_name,
        drId: listt.dr_id,
        delivery_from: 'edit_travel_plan_retailer',
        employee_id: this.travellist.employee_id,
        travel_plan_id: listt.id,
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result = true) {
        this.travelDetail();
      }
    });
  }

  addArea(): void {
    const dialogRef = this.dialog.open(addTravelListModal, {
      width: '500px',
      panelClass: 'cs-model',
      data: {
        delivery_from: 'add_travel_plan',
        employee_id: this.travellist.employee_id,
        'user_id': this.travel_id,
        'id': this.travellist.id,
        'travel_date': this.travel_date
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result != false) {
        this.travelDetail();
      }
    });
  }

  addCustomerNetwork(): void {
    const dialogRef = this.dialog.open(StatusModalComponent, {
      width: '400px',
      panelClass: 'cs-model',
      data: {
        drType: '',
        company_name: '',
        drId: '',
        delivery_from: 'add_travel_plan_retailer',
        employee_id: this.travellist.employee_id,
        travel_plan_id: this.travellist.id,
        'user_id': this.travel_id,
        'travel_date': this.travel_date

      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result = true) {
        this.travelDetail();
      }
    });
  }


  deleteCustomerNetwork(data) {
    this.alert.delete('Customer Network Detail !').then((res) => {
      if (res) {
        this.service.post_rqst({ 'id': data.id }, 'Travel/drTravelDelete').subscribe((result) => {
          if (result['statusCode'] == 200) {
            this.toast.successToastr(result['statusMsg']);
            this.travelDetail()
          }
          else {
            this.toast.errorToastr(result['statusMsg']);
          }
        })
      }
    });
  }

  deleteAreaTravelPlan(data) {
    this.alert.delete('Area Travel Detail !').then((res) => {
      if (res) {
        this.service.post_rqst({ 'id': data.id }, 'Travel/drTravelDelete').subscribe((result) => {
          if (result['statusCode'] == 200) {
            this.toast.successToastr(result['statusMsg']);
            this.travelDetail()
          }
          else {
            this.toast.errorToastr(result['statusMsg']);
          }
        })
      }
    });
  }


  opendoc(list) {

    const dialogRef = this.dialog.open(CheckindocumentComponent, {
      width: '768px',
      data: {
        list: [{ 'doc': list }]
      }
    });
    dialogRef.afterClosed().subscribe(result => {

    });

  }

}
