import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import * as moment from 'moment';
import { DialogComponent } from 'src/app/dialog.component';
import { DatabaseService } from 'src/_services/DatabaseService';
import { sessionStorage } from 'src/app/localstorage.service';
import { ToastrManager } from 'ng6-toastr-notifications';
import { CryptoService } from 'src/_services/CryptoService';

const now = new Date();

@Component({
  selector: 'app-pop-gift-issue-modal',
  templateUrl: './pop-gift-issue-modal.component.html',
  styleUrls: ['./pop-gift-issue-modal.component.scss']
})
export class PopGiftIssueModalComponent implements OnInit {
  savingFlag: boolean = false;
  user_data: any = [];
  PopData: any = {};
  model_data: any = [];
  list: any = {};
  listarray: any = [];
  data1: any = {};
  loader: any;
  today_date: any;
  max: any;
  result: any = [];
  change: any = [];
  router: any;
  remaining_stock: any = [];
  list1: any = {};
  logIN_user: any;
  itemName: any;
  flag = 0;
  user_id: any = [];
  showItemInfo: boolean = false;
  stockData: any;
  customerType: any;
  encryptedData: any;
  decryptedData:any;

  constructor(public service: DatabaseService, public cryptoService:CryptoService,public toast: ToastrManager, @Inject(MAT_DIALOG_DATA) public data, public session: sessionStorage, public dialog: MatDialog, public dialogRef: MatDialogRef<PopGiftIssueModalComponent>, public dialog1: DialogComponent) {

    this.PopData.gift_type = 'Marketing Material';
    if (data.type == 'Update_stock') {
      this.stockData = data.id;
      this.data1.totalAmt = this.stockData.amount
    }

    this.get_data();
    this.today_date = new Date().toISOString().slice(0, 10);
    this.logIN_user = JSON.parse(localStorage.getItem('st_user'));
    this.user_id = this.logIN_user['data']['id'];
    this.list.qty = 0;
  }

  ngOnInit() {

  }

  checkValue() {
    if (this.list.qty > this.list.remaining_stock) {
      this.toast.errorToastr('Quantity should be less then Stock Quantity');
    }
  }


  get_data() {
    this.encryptedData = this.service.payLoad ? { 'filter': { 'gift_type': this.PopData.gift_type } }: this.cryptoService.encryptData({ 'filter': { 'gift_type': this.PopData.gift_type } });
    this.service.post_rqst(this.encryptedData, "PopGift/popGiftList").subscribe((result => {
      this.decryptedData = this.service.payLoad ? result : this.cryptoService.decryptData(JSON.stringify(result));
      this.user_data = this.decryptedData['result']
      for (let i = 0; i < this.user_data.length; i++) {
        this.user_data[i].qty_stock = parseInt(this.user_data[i].qty_stock)
      }
      this.remaining_stock = this.user_data['qty_stock']
    }))
  }

  get_user(search) {
    this.encryptedData = this.service.payLoad ? { 'user_id': this.user_id, 'search': search, 'issue_type': this.PopData.issue_type }: this.cryptoService.encryptData({ 'user_id': this.user_id, 'search': search, 'issue_type': this.PopData.issue_type });
    this.service.post_rqst(this.encryptedData, "PopGift/getAllUser").subscribe((result => {
      this.decryptedData = this.service.payLoad ? result : this.cryptoService.decryptData(JSON.stringify(result));
      if (this.decryptedData['statusCode'] == 200) {
        this.model_data = this.decryptedData['result'];
      } else {
        this.toast.errorToastr(this.decryptedData['statusMsg']);
      }
    }))
    this.showItemInfo = false;
  }

  currentQty: any;
  get_Stock(id) {
    this.encryptedData = this.service.payLoad ? { 'id': id }: this.cryptoService.encryptData({ 'id': id });
    this.service.post_rqst(this.encryptedData, "PopGift/getPopStockQty").subscribe((result => {
      this.decryptedData = this.service.payLoad ? result : this.cryptoService.decryptData(JSON.stringify(result));
      if (this.decryptedData['statusCode'] == 200) {
        this.currentQty = this.decryptedData['result']['qty_stock'];
        this.list.remaining_stock = this.currentQty;
        this.list.remaining_stock = parseInt(this.list.remaining_stock);
      } else {
        this.toast.errorToastr(this.decryptedData['statusMsg']);
      }
    }))
  }

  addtolist() {

    // if (this.customerType != '' && this.totalPoints > this.marketing_points) {
    //   this.toast.errorToastr("Insufficient CP Marketing Points");
    //   return;
    // }
    // this.marketing_points = this.marketing_points - this.totalPoints;
    let index = this.user_data.findIndex(row => row.id == this.list.item_id);
    this.list.item_name = this.user_data[index].item_name;
    if (this.listarray.length > 0) {
      let existIndex
      existIndex = this.listarray.findIndex(row => row.item_id == this.list.item_id);
      if (existIndex != -1) {
        this.listarray[existIndex]['qty'] += parseFloat(this.list.qty);
        this.listarray[existIndex]['gift_value'] += parseFloat(this.list.gift_value);
        this.blankValue();
      }
      else {
        this.listarray.push({ 'item_id': this.list.item_id, 'item_name': this.list.item_name, 'qty': parseFloat(this.list.qty), 'remaining_stock': parseFloat(this.list.remaining_stock), 'gift_value': parseFloat(this.list.gift_value) })
        this.blankValue();

      }
    }
    else {
      this.listarray.push({ 'item_id': this.list.item_id, 'item_name': this.list.item_name, 'qty': parseFloat(this.list.qty), 'remaining_stock': parseFloat(this.list.remaining_stock), 'gift_value': parseFloat(this.list.gift_value) })
      this.blankValue();
    }
  }


  blankValue() {
    this.list = {};
  }



  delete(index) {
    this.marketing_points += parseInt(this.listarray[index]['gift_value']);
    this.listarray.splice(index, 1);
  }


  submit() {
    if (!this.PopData.delivery_note) {
      this.toast.errorToastr("Delivery note required");
      return;
    }

    var local_data = {
      'issue_type': this.PopData.issue_type, 'assign_id': this.PopData.user_id, 'delivery_note': this.PopData.delivery_note,
    }
    this.savingFlag = true;
    this.encryptedData = this.service.payLoad ? { 'item_list': this.listarray, 'user_data': local_data, 'created_by_name': this.logIN_user.data.name, 'created_by_id': this.logIN_user.data.id }: this.cryptoService.encryptData({ 'item_list': this.listarray, 'user_data': local_data, 'created_by_name': this.logIN_user.data.name, 'created_by_id': this.logIN_user.data.id });
    this.service.post_rqst(this.encryptedData, "PopGift/submitPopIssue").subscribe((result => {
      this.decryptedData = this.service.payLoad ? result : this.cryptoService.decryptData(JSON.stringify(result));
      if (this.decryptedData['statusCode'] == 200) {
        this.savingFlag = false;
        this.toast.successToastr(this.decryptedData['statusMsg']);
        this.dialog.closeAll();
      }
      else {
        this.savingFlag = false;
        this.toast.errorToastr(this.decryptedData['statusMsg']);
      }
    }))
  }

  qtychange() {
    let index = this.user_data.findIndex(row => row.id == this.list.item_id);
    if (index != -1) {
      if (parseInt(this.user_data[index]['qty_stock']) < parseInt(this.list.qty)) {
        this.list.qty = parseInt(this.user_data[index]['qty_stock'])
      } else if (parseInt(this.list.qty) < 0) {
        this.list.qty = 0;
      }
    }

  }

  add_stock() {
    if (this.data1.qty == undefined) {
      this.toast.errorToastr('QTY. is required');
      return;
    }
    this.data1.id = this.stockData.id
    this.data1.created_by_id = this.logIN_user.data.id;
    this.data1.created_by_name = this.logIN_user.data.name;

    this.savingFlag = true;
    this.encryptedData = this.service.payLoad ? { 'data': this.data1 }: this.cryptoService.encryptData({ 'data': this.data1 });
    this.service.post_rqst(this.encryptedData, "PopGift/submitStock").subscribe((result => {
      this.decryptedData = this.service.payLoad ? result : this.cryptoService.decryptData(JSON.stringify(result));
      if (this.decryptedData['statusCode'] == 200) {
        this.savingFlag = false;
        this.toast.successToastr(this.decryptedData['statusMsg']);
        this.dialog.closeAll();
      }

      else {
        this.dialogRef.disableClose = false;
        this.savingFlag = false;
        this.toast.errorToastr(this.decryptedData['statusMsg']);
      }
    }))

  }

  eligible_point: any = 0
  marketing_points: any = 0;

  get_points() {
    let index = this.user_data.findIndex(row => row.id == this.list.item_id);
    if (index != -1) {
      this.eligible_point = parseFloat(this.user_data[index]['eligible_point'])
    }
  }

  // getPartyPoint() {
  //   let index = this.model_data.findIndex(row => row.id == this.PopData.user_id);
  //   if (index != -1) {
  //     this.marketing_points = parseFloat(this.model_data[index]['marketing_points']);
  //     this.customerType = this.model_data[index]['type'] ? this.model_data[index]['type'] : '';

  //   }
  // }

  totalPoints: any = 0;
  getValue(point) {
    this.totalPoints = parseFloat(point) * parseFloat(this.eligible_point);
    this.list.gift_value = this.totalPoints;
  }

}
