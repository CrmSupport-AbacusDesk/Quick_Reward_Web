import { Component, OnInit, Inject } from '@angular/core';
import { DatabaseService } from 'src/_services/DatabaseService';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material';
import { sessionStorage } from 'src/app/localstorage.service';
import { ToastrManager } from 'ng6-toastr-notifications';
import * as moment from 'moment';
import { DialogComponent } from '../dialog.component';
import { CryptoService } from 'src/_services/CryptoService';

@Component({
  selector: 'app-redeem-status-modal',
  templateUrl: './redeem-status-modal.component.html',
  styleUrls: ['./redeem-status-modal.component.scss']
})
export class RedeemStatusModalComponent implements OnInit {
  savingFlag: boolean = false;
  segment: any = {};
  category: any = {};
  login: any = {};
  drlist: any = []
  delivery_from: any;
  userData: any;
  userId: any;
  userName: any;
  today_date: any;
  user_id: any;
  encryptedData: any;
  decryptedData: any;
  otpFlag: boolean = false
  level: any
  brandId: any;
  gift_status: any = '';

  constructor(@Inject(MAT_DIALOG_DATA) public data, public cryptoService: CryptoService, public dialog: MatDialog, public service: DatabaseService, public session: sessionStorage, public toast: ToastrManager, public alert: DialogComponent, public dialogRef: MatDialogRef<RedeemStatusModalComponent>) {
    this.userData = JSON.parse(localStorage.getItem('st_user'));
    this.today_date = new Date();
    this.segment = this.data.segment;
    this.userId = this.userData['data']['id'];
    this.userName = this.userData['data']['name'];
    this.delivery_from = this.data.delivery_from;
    this.user_id = this.data.user_id;
    this.brandId = this.data.id;
    if (this.data.delivery_from == 'influencer_list' && this.data.level != '') {
      this.level = this.data.level;
    }

    if (this.data.delivery_from == 'influencer_list' && this.data.influence_status == '') {
      this.data.influence_status = 'Pending';
    }
    if (this.data.delivery_from == 'redeem_status') {
      this.data.order_status = this.data.gift_status;
    }
    if (this.delivery_from == 'redeem_status') {
      this.getUserEarnPoints();
    }
    if (this.delivery_from == 'brandValLogs') {
      this.getBrandsLogs();
    }
    if (this.data.delivery_from == 'Influencer') {
      this.data = data;
    }
    if (this.data.delivery_from == 'sales_person_edit') {
      this.data = data;
      this.data.assigned_sales_user_name= this.data.welcome_bonus_flag
      this.getSalesUser('')
    }

  }

  ngOnInit() {
    this.login = JSON.parse(localStorage.getItem('login'));
  }



  transform(value: number): number {
    return Number(value);
  }

  getOtp() {


    if ((this.data.request_type == 'Cash' && this.data.order_status == 'Approved' && (this.transform(this.data.cash_amount) > this.transform(this.userData.organisation_data.payout_per_transaction_limit)))) {
      this.toast.errorToastr('Maximum per transaction allowed amount  ₹' + this.userData.organisation_data.payout_per_transaction_limit);
      return
    }

    this.data.verify_otp = Math.floor(100000 + Math.random() * 900000);
    this.encryptedData = this.service.payLoad ? { 'mobile': this.userData['data']['contact_01'], 'otp': this.data.verify_otp } : this.cryptoService.encryptData({ 'mobile': this.userData['data']['contact_01'], 'otp': this.data.verify_otp });
    this.service.post_rqst(this.encryptedData, "RedeemRequest/verifyOtp").subscribe((result: any) => {
      this.decryptedData = this.service.payLoad ? result : this.cryptoService.decryptData(JSON.stringify(result));
      if (this.decryptedData['statusCode'] == 200) {
        this.otpFlag = true;
      }
      else {
        this.toast.errorToastr(this.decryptedData['statusMsg'])
      }
    })
  }


  otpvalidation() {
    if (this.data.otp.length == 6) {
      if (this.data.otp != this.data.verify_otp) {
        this.toast.errorToastr('Invaild OTP');
      }
    }
  }


  reason_reject: any
  redeem_status_change(reason, status) {

    if ((this.data.request_type == 'Cash' && this.data.order_status == 'Approved' && (this.transform(this.data.cash_amount) > this.transform(this.userData.organisation_data.payout_per_transaction_limit)))) {
      this.toast.errorToastr('Maximum per transaction allowed amount  ₹' + this.userData.organisation_data.payout_per_transaction_limit);
      return
    }

    if ((this.data.request_type == 'Cash' && this.data.order_status == 'Approved' && (this.transform(this.data.cash_amount) > this.transform(this.userData.organisation_data.payout_otp_required_amount))) && this.data.otp != this.data.verify_otp) {
      this.toast.errorToastr('Invaild OTP');
      return
    }


    this.savingFlag = true;
    this.encryptedData = this.service.payLoad ? { 'status': status, 'id': this.data.id, 'created_by_id': this.userId, 'created_by_name': this.userName, 'reject_reason': reason } : this.cryptoService.encryptData({ 'status': status, 'id': this.data.id, 'created_by_id': this.userId, 'created_by_name': this.userName, 'reject_reason': reason });
    this.service.post_rqst(this.encryptedData, "RedeemRequest/redeemRequestStatusChange").subscribe((result => {
      this.decryptedData = this.service.payLoad ? result : this.cryptoService.decryptData(JSON.stringify(result));
      if (this.decryptedData['statusCode'] == 200) {
        this.dialogRef.close(true);
        this.savingFlag = false;
        this.toast.successToastr(this.decryptedData['statusMsg']);
      }
      else {
        this.toast.errorToastr(this.decryptedData['statusMsg']);
        this.savingFlag = false;
      }

    }))

  }


  updateNumber() {
    this.savingFlag = true;
    this.encryptedData = this.service.payLoad ? { 'wallet_number': this.data.wallet_number, 'id': this.data.id, 'created_by_id': this.userId, 'created_by_name': this.userName } : this.cryptoService.encryptData({ 'wallet_number': this.data.wallet_number, 'id': this.data.id, 'created_by_id': this.userId, 'created_by_name': this.userName });
    this.service.post_rqst(this.encryptedData, "RedeemRequest/saveWalletNumber").subscribe((result => {
      this.decryptedData = this.service.payLoad ? result : this.cryptoService.decryptData(JSON.stringify(result));
      if (this.decryptedData['statusCode'] == 200) {
        this.dialogRef.close(true);
        this.savingFlag = false;
        this.toast.successToastr(this.decryptedData['statusMsg']);
      }
      else {
        this.toast.errorToastr(this.decryptedData['statusMsg']);
        this.savingFlag = false;
      }

    }))

  }




  salesUser: any = [];
  getSalesUser(searcValue) {
    this.encryptedData = this.service.payLoad ? { 'search': searcValue } : this.cryptoService.encryptData({ 'search': searcValue });
    this.service.post_rqst(this.encryptedData, "influencer/salesUserList").subscribe((result => {
      this.decryptedData = this.service.payLoad ? result : this.cryptoService.decryptData(JSON.stringify(result));
      if (this.decryptedData['statusCode'] == 200) {
        this.salesUser = this.decryptedData['all_sales_user'];
      }
      else {
        this.toast.errorToastr(this.decryptedData['statusMsg']);
      }

    }));
  }
  distributorList(searcValue, state) {
    this.encryptedData = this.service.payLoad ? { 'search': searcValue, 'state': state } : this.cryptoService.encryptData({ 'search': searcValue, 'state': state });
    this.service.post_rqst({ 'search': searcValue, 'state': state }, "influencer/distributorsList").subscribe((result => {
      this.decryptedData = this.service.payLoad ? result : this.cryptoService.decryptData(JSON.stringify(result));
      if (this.decryptedData['statusCode'] == 200) {
        this.drlist = this.decryptedData['distributors'];
      }
      else {
        this.toast.errorToastr(this.decryptedData['statusMsg']);
      }

    }))
  }
  influencer_status_change(reason, status) {
    if (status == 'Approved') {
      this.savingFlag = true;
      this.alert.confirm('Are you sure ?').then((res) => {
        if (res) {
          if (this.level == '' || this.level == undefined) {
            this.encryptedData = this.service.payLoad ? { 'status': status, 'influencer_id': Number(this.data.id), 'welcome_bonus_flag': Number(this.data.welcome_bonus_flag), 'created_by': Number(this.userId), 'distributor_id': this.data.distributor_id, 'referred_by': this.data.referred_by_id, 'name': this.data.name, 'influencer_type': this.data.influencer_type } : this.cryptoService.encryptData({ 'status': status, 'influencer_id': Number(this.data.id), 'welcome_bonus_flag': Number(this.data.welcome_bonus_flag), 'created_by': Number(this.userId), 'distributor_id': this.data.distributor_id, 'referred_by': this.data.referred_by_id, 'name': this.data.name, 'influencer_type': this.data.influencer_type });
          }
          if (this.level != '' && this.level != undefined) {
            this.encryptedData = this.service.payLoad ? { 'status': status, 'influencer_id': Number(this.data.id), 'welcome_bonus_flag': Number(this.data.welcome_bonus_flag), 'created_by': Number(this.userId), 'distributor_id': this.data.distributor_id, 'referred_by': this.data.referred_by_id, 'name': this.data.name, 'influencer_type': this.data.influencer_type, 'level': this.level } : this.cryptoService.encryptData({ 'status': status, 'influencer_id': Number(this.data.id), 'welcome_bonus_flag': Number(this.data.welcome_bonus_flag), 'created_by': Number(this.userId), 'distributor_id': this.data.distributor_id, 'referred_by': this.data.referred_by_id, 'name': this.data.name, 'influencer_type': this.data.influencer_type, 'level': this.level });
          }
          this.service.post_rqst(this.encryptedData, (this.level != '' && this.level != undefined) ? "Influencer/influencerLevelStatusChange" : "Influencer/influencerStatusChange").subscribe((result => {
            this.decryptedData = this.service.payLoad ? result : this.cryptoService.decryptData(JSON.stringify(result));
            if (this.decryptedData['statusCode'] == 200) {
              this.dialogRef.close(true);
              this.savingFlag = false;
              this.toast.successToastr('Status Changed Successfully');
            }
            else {
              this.toast.errorToastr(this.decryptedData['statusMsg']);
              this.savingFlag = false;
            }

          }))
        }
      });
    } else {
      this.savingFlag = true;
      if (this.level == '' || this.level == undefined) {
        this.encryptedData = this.service.payLoad ? { 'status': status, 'influencer_id': Number(this.data.id), 'welcome_bonus_flag': Number(this.data.welcome_bonus_flag), 'created_by': Number(this.userId), 'reject_reason': reason, 'referred_by': this.data.referred_by_id, 'name': this.data.name, 'influencer_type': this.data.influencer_type } : this.cryptoService.encryptData({ 'status': status, 'influencer_id': Number(this.data.id), 'welcome_bonus_flag': Number(this.data.welcome_bonus_flag), 'created_by': Number(this.userId), 'reject_reason': reason, 'referred_by': this.data.referred_by_id, 'name': this.data.name, 'influencer_type': this.data.influencer_type });
      }
      if (this.level != '' && this.level != undefined) {
        this.encryptedData = this.service.payLoad ? { 'status': status, 'influencer_id': Number(this.data.id), 'welcome_bonus_flag': Number(this.data.welcome_bonus_flag), 'created_by': Number(this.userId), 'reject_reason': reason, 'referred_by': this.data.referred_by_id, 'name': this.data.name, 'influencer_type': this.data.influencer_type, 'level': this.level } : this.cryptoService.encryptData({ 'status': status, 'influencer_id': Number(this.data.id), 'welcome_bonus_flag': Number(this.data.welcome_bonus_flag), 'created_by': Number(this.userId), 'reject_reason': reason, 'referred_by': this.data.referred_by_id, 'name': this.data.name, 'influencer_type': this.data.influencer_type, 'level': this.level });
      }

      this.service.post_rqst(this.encryptedData, (this.level != undefined && this.level != '') ? "Influencer/influencerLevelStatusChange" : "Influencer/influencerStatusChange").subscribe((result => {
        this.decryptedData = this.service.payLoad ? result : this.cryptoService.decryptData(JSON.stringify(result));
        if (this.decryptedData['statusCode'] == 200) {
          this.dialogRef.close(true);
          this.savingFlag = false;
          this.toast.successToastr('Status Changed Successfully');
        }
        else {
          this.toast.errorToastr(this.decryptedData['statusMsg']);
          this.savingFlag = false;
        }

      }))
    }
  }


  gift_status_change(header) {
    this.encryptedData = this.service.payLoad ? header : this.cryptoService.encryptData(header);
    this.service.post_rqst(this.encryptedData, 'RedeemRequest/redeemRequestGiftStatusChange').subscribe((result => {
      this.decryptedData = this.service.payLoad ? result : this.cryptoService.decryptData(JSON.stringify(result));
      if (this.decryptedData['statusCode'] == 200) {
        this.dialogRef.close(true);
        this.savingFlag = false;
        this.toast.successToastr(this.decryptedData['statusMsg']);
      }
      else {
        this.toast.errorToastr(this.decryptedData['statusMsg']);
        this.savingFlag = false;
      }
    }))
  }
  giftHoldRemark(header) {
    this.encryptedData = this.service.payLoad ? header : this.cryptoService.encryptData(header);
    this.service.post_rqst(this.encryptedData, 'RedeemRequest/redeemRequestGiftHoldRemark').subscribe((result => {
      this.decryptedData = this.service.payLoad ? result : this.cryptoService.decryptData(JSON.stringify(result));
      if (this.decryptedData['statusCode'] == 200) {
        this.dialogRef.close(true);
        this.savingFlag = false;
        this.toast.successToastr(this.decryptedData['statusMsg']);
      }
      else {
        this.toast.errorToastr(this.decryptedData['statusMsg']);
        this.savingFlag = false;
      }
    }))
  }

  updateStatus(status) {
    this.data.estimate_date = moment(this.data.estimate_date).format('YYYY-MM-DD')
    this.data.transfer_date = moment(this.data.transfer_date).format('YYYY-MM-DD')
    this.savingFlag = true;
    let header = {}
    if (status == 'Under Process' || status == 'Received') {
      header = { 'status': status, 'id': this.data.id }
      this.gift_status_change(header)
    } else if (status == 'Shipped') {

      header = { 'status': status, 'id': this.data.id, 'shipping_remark': this.data.Shipped_remark, 'shipping_type': this.data.shipping_type, 'estimate_date': this.data.estimate_date }
      this.gift_status_change(header)
    } else if (status == 'Transferred') {
      header = { 'status': status, 'id': this.data.id, 'payment_mode': this.data.transfer_mode, 'transfer_date': this.data.transfer_date, "transfer_remark": this.data.transfer_remark, 'transaction_no': this.data.transaction_number }
      this.gift_status_change(header)
      // if (this.data.transfer_mode == 'Online') {
      //   header = { 'status': status, 'id': this.data.id, 'payment_mode': this.data.transfer_mode, 'transfer_date': this.data.transfer_date, "transfer_remark": this.data.transfer_remark }
      //   this.gift_status_change(header)
      // } else if (this.data.transfer_mode == 'Online') {

      // }
    }
    else if (status == 'Hold') {
      header = { 'status': status, 'id': this.data.id, "hold_remark": this.data.transfer_remark, }
      this.giftHoldRemark(header)
      // if (this.data.transfer_mode == 'Online') {
      //   header = { 'status': status, 'id': this.data.id, 'payment_mode': this.data.transfer_mode, 'transfer_date': this.data.transfer_date, "transfer_remark": this.data.transfer_remark }
      //   this.gift_status_change(header)
      // } else if (this.data.transfer_mode == 'Online') {

      // }
    }
  }



  pointsData: any = {}
  getUserEarnPoints() {
    this.encryptedData = this.service.payLoad ? { 'influencer_id': this.user_id } : this.cryptoService.encryptData({ 'influencer_id': this.user_id });
    this.service.post_rqst(this.encryptedData, "Influencer/getRedeemreport").subscribe((result => {
      this.decryptedData = this.service.payLoad ? result : this.cryptoService.decryptData(JSON.stringify(result));
      if (this.decryptedData['statusCode'] == 200) {
        this.pointsData = this.decryptedData['point_array'];
      }
      else {
        this.toast.errorToastr(this.decryptedData['statusMsg']);
      }

    }));
  }



  findName(type) {
    let index = this.service.InfluenceArray.findIndex(row => row.type == type)
    if (index != -1) {
      this.data.module_name = this.service.InfluenceArray[index]['module_name'];
    }
  }

  updateUserType() {
    this.savingFlag = true;
    this.encryptedData = this.service.payLoad ? { 'type': this.data.influencer_type, 'influencer_type': this.data.module_name, 'inf_id': this.data.id, 'created_by_id': this.userId, 'created_by_name': this.userName } : this.cryptoService.encryptData({ 'type': this.data.influencer_type, 'influencer_type': this.data.module_name, 'inf_id': this.data.id, 'created_by_id': this.userId, 'created_by_name': this.userName });
    this.service.post_rqst(this.encryptedData, "Influencer/dr_type_update").subscribe((result => {
      this.decryptedData = this.service.payLoad ? result : this.cryptoService.decryptData(JSON.stringify(result));
      if (this.decryptedData['statusCode'] == 200) {
        this.dialogRef.close(true);
        this.savingFlag = false;
        this.toast.successToastr(this.decryptedData['statusMsg']);
      }
      else {
        this.toast.errorToastr(this.decryptedData['statusMsg']);
        this.savingFlag = false;
      }

    }))

  }



  travel_status_change(reason, status) {
    this.savingFlag = true;
    this.alert.confirm('Are you sure ?').then((res) => {
      if (res) {
        this.encryptedData = this.service.payLoad ? { 'status': status, 'id': Number(this.data.id), 'created_by': Number(this.userId), 'reason': reason } : this.cryptoService.encryptData({ 'status': status, 'id': Number(this.data.id), 'created_by': Number(this.userId), 'reason': reason });
        this.service.post_rqst(this.encryptedData, "Travel/updateStatus").subscribe((result => {
          this.decryptedData = this.service.payLoad ? result : this.cryptoService.decryptData(JSON.stringify(result));
          if (this.decryptedData['statusCode'] == 200) {
            this.dialogRef.close(true);
            this.savingFlag = false;
            this.toast.successToastr('Status Changed Successfully');
          }
          else {
            this.toast.errorToastr(this.decryptedData['statusMsg']);
            this.savingFlag = false;
          }

        }))
      }
    });

  }



  brandDataLogs: any = [];
  getBrandsLogs() {
    this.encryptedData = this.service.payLoad ? { 'id': this.brandId } : this.cryptoService.encryptData({ 'id': this.brandId });
    this.service.post_rqst(this.encryptedData, "BrandAudit/getBrandAuditDetail").subscribe((result => {
      this.decryptedData = this.service.payLoad ? result : this.cryptoService.decryptData(JSON.stringify(result));
      if (this.decryptedData['statusCode'] == 200) {
        this.brandDataLogs = this.decryptedData['data'];
        console.log(this.brandDataLogs.log);
      }
      else {
        this.toast.errorToastr(this.decryptedData['statusMsg']);
      }

    }));
  }


  UpdateSalesUser() {
    this.savingFlag = true;
    
      this.service.post_rqst({ 'data': this.data}, "Influencer/userAssign").subscribe((result => {
        if (result['statusCode'] == 200) {
          this.dialog.closeAll();
          this.savingFlag = false;
          this.toast.successToastr(result['statusMsg']);
        }
        else {
          this.savingFlag = false;
          this.toast.errorToastr(result['statusMsg'])
        }
      }))
    
  }

}
