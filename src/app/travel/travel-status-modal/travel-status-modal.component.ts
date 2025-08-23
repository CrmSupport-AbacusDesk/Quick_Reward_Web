import { Component, OnInit, Inject } from '@angular/core';
import { ToastrManager } from 'ng6-toastr-notifications';
import { DatabaseService } from 'src/_services/DatabaseService';
import { DialogComponent } from 'src/app/dialog.component';
import { MatDialog, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { ActivatedRoute, Router } from '@angular/router';
import * as moment from 'moment';
import { CryptoService } from 'src/_services/CryptoService';



@Component({
  selector: 'app-travel-status-modal',
  templateUrl: './travel-status-modal.component.html'
})
export class TravelStatusModalComponent implements OnInit {
  resetform: any;
  locationAssign: boolean = false;
  arealist: any = [];
  allNetwork: any = [];
  userData: any;
  userId: any;
  userName: any;
  planData: any = {};
  partyList: any = [];
  savingFlag: boolean = false;
  encryptedData: any;
  decryptedData:any;

  constructor(@Inject(MAT_DIALOG_DATA) public data,
    public dialog: MatDialog,
    public service: DatabaseService,
    public cryptoService:CryptoService,
    public alert: DialogComponent,
    public navparams: ActivatedRoute,
    public dialogRef: MatDialogRef<TravelStatusModalComponent>,
    public toast: ToastrManager) {

    this.userData = JSON.parse(localStorage.getItem('st_user'));
    this.userId = this.userData['data']['id'];
    this.userName = this.userData['data']['name'];
    if (this.data.from == 'plan-edit') {
      this.planData.travel_day = this.data.currentDate;

    }
    if (this.data['deleteAreaId'] && this.data['deleteAreaName'] && this.data['from'] == 'location-master') {
      this.locationAssign = true;
      this.area_list();
    }
    else {
      this.locationAssign = false;
    }


  }

  ngOnInit() {
    this.GetAllNetwork()
  }

  update_status() {
    this.encryptedData = this.service.payLoad ? this.data: this.cryptoService.encryptData(this.data);
    this.service.post_rqst(this.encryptedData, "Travel/changeStatusTravelPlan").subscribe((result) => {
      this.decryptedData = this.service.payLoad ? result : this.cryptoService.decryptData(JSON.stringify(result));

      if (this.decryptedData['statusCode'] == 200) {
        this.toast.successToastr(this.decryptedData['statusMsg']);
        this.dialogRef.close(true);
      }
      else {
        this.toast.errorToastr(this.decryptedData['statusMsg']);
      }
    })
  }
  GetAllNetwork() {

    this.service.post_rqst('', "Travel/allNetworkModule").subscribe((result) => {
      this.decryptedData = this.service.payLoad ? result : this.cryptoService.decryptData(JSON.stringify(result));
      if (this.decryptedData['statusCode'] == 200) {
        this.allNetwork = this.decryptedData['modules'];
      }
      else {
        this.toast.errorToastr(this.decryptedData['statusMsg']);
      }
    })
  }



  area_list() {
    this.encryptedData = this.service.payLoad ? this.data: this.cryptoService.encryptData(this.data);
    this.service.post_rqst(this.encryptedData, "User/area_list").subscribe((result => {
      this.decryptedData = this.service.payLoad ? result : this.cryptoService.decryptData(JSON.stringify(result));

      for (let i = 0; i < this.decryptedData['area_list'].length; i++) {

        if (parseInt(this.data['deleteAreaId']) == parseInt(this.decryptedData['area_list'][i]['id'])) {
        }
        else {
          this.arealist.push(this.decryptedData['area_list'][i]);
        }
      }
    }))

  }

  assign_area() {
    this.encryptedData = this.service.payLoad ? { 'id': this.data['deleteAreaId'], 'delarea': this.data['deleteAreaName'], 'updateArea': this.data.area }: this.cryptoService.encryptData({ 'id': this.data['deleteAreaId'], 'delarea': this.data['deleteAreaName'], 'updateArea': this.data.area });
    this.service.post_rqst(this.encryptedData, "User/delete_area").subscribe((result => {
    this.decryptedData = this.service.payLoad ? result : this.cryptoService.decryptData(JSON.stringify(result));

      if (this.decryptedData['msg'] == 'Deleted') {
        this.alert.success("Location", "Deleted");
        this.dialog.closeAll();
      }
      else {
        this.alert.error("Something went wrong");
        this.dialog.closeAll();
      }
    }))
  }

  getCustomer(type, search) {
    if (type == 'Distributor' || type == 'Channel Partner') {
      type = 1;
    } else if (type == 'Retailer' || type == 'Dealer') {
      type = 3;
    } else if (type == 'Direct Dealer') {
      type = 7;
    }
    this.encryptedData = this.service.payLoad ? {'dr_type': type, 'user_id':this.data.user_id, 'search': search}: this.cryptoService.encryptData({'dr_type': type, 'user_id':this.data.user_id, 'search': search});

    this.service.post_rqst(this.encryptedData, "Travel/getDrList").subscribe((result => {
    this.decryptedData = this.service.payLoad ? result : this.cryptoService.decryptData(JSON.stringify(result));

      if (this.decryptedData['statusCode'] == 200) {
        this.partyList = this.decryptedData['result']
      }
    }))

  }

  checkId(id) {
    var index = this.data.alreadyPlan.findIndex(row => row.dr_id == id)
    if (index != -1) {
      this.alert.error(this.data.alreadyPlan[index]['company_name'] + ' Already Added For ' + this.data.alreadyPlan[index]['date']);
      this.planData.customerId = '';
      return
    }
  }


  submitDetail() {

    if (this.planData.travel_day) {
      this.planData.travel_day = moment(this.planData.travel_day).format('YYYY-MM-DD');
    }

    this.planData.user_id = this.data.user_id;
    this.planData.travel_id = this.data.travel_id;
    this.savingFlag = true;
    this.encryptedData = this.service.payLoad ? { 'data': this.planData }: this.cryptoService.encryptData({ 'data': this.planData });
    this.service.post_rqst(this.encryptedData, "Travel/editTravelPlan").subscribe((result => {
    this.decryptedData = this.service.payLoad ? result : this.cryptoService.decryptData(JSON.stringify(result));
      if (this.decryptedData['statusCode'] == 200) {
        this.toast.successToastr(this.decryptedData['statusMsg']);
        this.dialogRef.close(true);
      }
      else {
        this.savingFlag = false;
        this.toast.errorToastr(this.decryptedData['statusMsg']);
      }
    }))

  }
}
