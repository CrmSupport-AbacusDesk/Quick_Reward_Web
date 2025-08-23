import { Component, Inject, OnInit } from '@angular/core';
import { DatabaseService } from 'src/_services/DatabaseService';
import { ActivatedRoute, Router } from '@angular/router';
import { DialogComponent } from 'src/app/dialog.component';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material';
import { MatDialogRef } from '@angular/material';
import { sessionStorage } from 'src/app/localstorage.service';
import * as moment from 'moment';
import { Location } from '@angular/common';
import { ToastrManager } from 'ng6-toastr-notifications';
import { OrderDetailComponent } from '../order/order-detail/order-detail.component';
import { CryptoService } from 'src/_services/CryptoService';




@Component({
  selector: 'app-add-item',
  templateUrl: './add-item.component.html',
  styleUrls: ['./add-item.component.scss']
})
export class AddItemComponent implements OnInit {
  userData: any = {};
  orderData: any = {};
  tabActiveType: any = {};
  state_list: any = [];
  states: any = [];
  rsm_list: any;
  report_manager: any = [];
  district_list: any = [];
  city_list: any = [];
  area_list: any = [];
  pinCode_list: any = [];
  isslected;
  user_type;
  usertype = true;
  basicdetails = false;
  userrole;
  active: any = {};
  sales_type: any = [];
  reporting_sales_type: any = [];
  rsm: any = [];
  ass_user: any = [];
  tmp_userList: any = [];
  search: any = {};
  tmpsearch: any = {};
  submit = false;
  loader: any;
  module_name: any = [];
  access: any = {};
  exist: boolean = false;
  assign_module_data: any = [];
  segmentList: any = [];
  product_price_list: any = [];
  userId: any;
  userName: any;
  savingFlag: boolean = false;
  product_resp: boolean = false;
  assign_login_data: any = {};
  logined_user_data: any = {};
  Param_data: any = {};
  type: any = ''
  company_name: any = ''
  name: any = ''
  contact_person: any = ''
  order_id: any = ''
  dr_id: any = ''
  check_qty_flag: boolean = false;
  order_item: any = [];
  order_detail: any = {};
  filter: any = {};
  lastGstPercent: any = '';
  brandList: any = [];
  colorList: any = [];
  productlist: any = [];
  product_list: any = [];
  productlist2: any = [];
  total_qty: any = 0;
  netamount: any = 0;
  product_detail: any = {};
  addToListButton: boolean = true;
  order_total: any = 0;
  tempSearch: any = '';
  user_data: any = {};
  feature_data: any = [];
  subCatList: any = [];

  constructor(@Inject(MAT_DIALOG_DATA) public params: any, public cryptoService: CryptoService, public dialogRef: MatDialogRef<OrderDetailComponent>, public service: DatabaseService,
    private route: ActivatedRoute, public toast: ToastrManager, public location: Location, public session: sessionStorage, public rout: Router, public dialog: DialogComponent, public model: MatDialog) {
    this.orderData.state = params.state
    this.dr_id = params.dr_id
    this.orderData.order_id = params.order_id
    this.orderData.type = params.type
    this.orderData.company_name = params.company_name
    this.orderData.name = params.name
    this.orderData.contact_person = params.contact_person
    this.assign_login_data = this.session.getSession();
    this.logined_user_data = this.assign_login_data.value.data;
    
    
  }

  tabActive(tab: any) {
    this.tabActiveType = {};
    this.tabActiveType[tab] = true;
  }

  ngOnInit() {
    this.orderDetail();
    // this.getSegment()
  }

  getSegment() {
    this.loader = true
    this.service.post_rqst({ 'cat_id': this.orderData.segment_id }, "Order/segment")
      .subscribe(result => {
       
        if (result['statusCode'] == 200) {
          this.loader = false
          this.segmentList = result['result'];
        }
        else {
          this.loader = false
          this.dialog.error(result['statusMsg']);
        }
      })
  }

  getSubSegment() {
    this.loader = true
    this.service.post_rqst({ 'cat_id': this.orderData.segment }, "Order/subSegment").subscribe(result => {
     
      if (result['statusCode'] == 200) {
        this.loader = false
        this.subCatList = result['result'];
      }
      else {
        this.loader = false
        this.dialog.error(result['statusMsg']);
      }
    })
  }


  getitem(search) {
    this.filter.dr_id = this.order_detail.dr_id;
    this.filter.order_type = 'primary';
    this.service.post_rqst({ 'data': { 'dr_id': this.dr_id, 'cat_id': this.orderData.segment, 'sub_cat_id': this.orderData.sub_segment }, 'filter': { 'search': search }}, "Order/segmentItems").subscribe((result) => {
      if (result['statusCode'] == 200) {
        this.productlist = result['result'];
        this.productlist2 = result['result'];
      } else {
        this.toast.errorToastr(result['statusMsg'])
      }
    })
  }


  get_product_details(id) {
    this.service.post_rqst({ 'product_id': id, 'dr_id': this.order_detail.dr_id, 'type': 'order', 'order_type': 'primary' }, "Order/segmentItemsDetails")
      .subscribe(result => {
        if (result['statusCode'] == 200) {
          this.loader = false
          this.product_detail = result['result'];
          this.orderData.segment = this.product_detail.category_id.toString();
          this.orderData.sub_segment = this.product_detail.sub_category_id.toString()
          this.getSegment();
          this.getSubSegment();
          if (this.product_detail.feature == 'Yes') {
            this.feature_data = this.product_detail.feature_data
          }
          this.orderData.product_name = this.product_detail.product_name;
          this.orderData.product_code = this.product_detail.product_code;
          this.orderData.discount = this.product_detail.discount;
          this.orderData.edit_dis = this.product_detail.discount;
          this.orderData.mrp = this.product_detail['mrp'];
          this.orderData.master_packing_size = this.product_detail.master_packing_size ? this.product_detail.master_packing_size : '0';
          this.orderData.small_packing_size = this.product_detail.small_packing_size ? this.product_detail.small_packing_size : '0';
        } else {
          this.toast.errorToastr(result['statusMsg'])
          this.loader = false
        }
      })
  }



  save_orderalert() {
    for (let index = 0; index < this.order_item.length; index++) {
      if (parseFloat(this.order_item[index]['qty']) <= 0) {
        this.toast.errorToastr('qty required row number ' + (index + 1));
        return
      }
    }
    this.dialog.confirm("You want to update this order ?").then((result) => {
      if (result) {
        this.save_order()
      }
    })
  }


  save_order() {

    this.savingFlag = true;
    this.user_data.gst_percent = this.lastGstPercent;
    this.service.post_rqst({ "cart_data": this.order_item, 'user_data': this.user_data, "orderId": this.orderData.order_id, }, "Order/primaryOrderAddItem").subscribe((result) => {
      if (result['statusCode'] == 200) {
        let id = this.order_id
        this.toast.successToastr(result['statusMsg']);
        this.dialogRef.close(true);
        this.savingFlag = false;
      }
      else {
        this.toast.errorToastr(result['statusMsg']);
        this.savingFlag = false;
      }
    }, err => {
      this.savingFlag = false;

    })



  }

  orderDetail() {
    this.loader = 1;
    let id = { 'id': this.orderData.order_id }
    this.service.post_rqst(id, "Order/primaryOrderDetail").subscribe((result => {
      if (result['statusCode'] == 200) {
        this.order_item = result['result']['item_info'];
        this.order_detail = result['result'];
        for (let i = 0; i < this.order_item.length; i++) {
          this.total_qty = (parseInt(this.total_qty) + parseInt(this.order_item[i]['qty']));
          this.total_order_amount = parseFloat(this.total_order_amount) + (parseFloat(this.order_item[i]['price']) * this.order_item[i]['qty']);
          this.order_discount = parseFloat(this.order_item[i].discount_amount) + parseFloat(this.order_discount);
          this.order_total = parseFloat(this.order_total) + parseFloat(this.order_item[i]['amount']);
          this.total_gst_amount = parseFloat(this.order_item[i].gst_amount) + parseFloat(this.total_gst_amount);
          this.net_price = parseFloat(this.net_price) + parseFloat(this.order_item[i]['net_price']);
        };
        this.getSegment();
        this.getSubSegment();
        this.getitem('');

      } else {
        this.toast.errorToastr(result['statusMsg'])
      }
    }))
  }


  searchItems(event) {
    let item = event.target.value.toLowerCase();
    this.tempSearch = '';
    this.productlist = [];
    for (let x = 0; x < this.productlist2.length; x++) {
      this.tempSearch = this.productlist2[x].product_name.toLowerCase();
      if (this.tempSearch.includes(item)) {
        this.productlist.push(this.productlist2[x]);
      }
    }
  }


  gst: any;
  net_price: any = 0;
  total_order_amount: any = 0;
  total_gst_amount: any = 0;
  order_grand_total: any = 0;
  order_discount: any = 0;

  changeMRP(id) {
    let index
    index = this.feature_data.findIndex(row => row.id == id);
    if (index != -1) {
      this.orderData.mrp = this.feature_data[index]['mrp'];
      this.orderData.feature_name = this.feature_data[index]['feature_name'];
    }
  }


  getCatId(id) {
    let index
    index = this.subCatList.findIndex(row => row.id == id);
    if (index != -1) {
      this.orderData.segment = this.subCatList[index]['master_category_id'].toString();
      this.orderData.segment_id = this.subCatList[index]['master_category_id'].toString();
      this.getSegment();
    }
  }


  addToList() {
    let subTotal :any = 0
    let disAmount :any = 0
    let otherDiscount :any = 0
    let gstAmount :any = 0

    if (!this.orderData.qty) {
      this.toast.errorToastr('Qty is required')
      return
    }
    if (parseInt(this.orderData.qty) === 0) {
      this.toast.errorToastr('Minimum qty 1 is required')
      return
    }
    if (this.logined_user_data.organisation_data.primary_dist_edit == '1' && parseFloat(this.orderData.edit_dis) > parseFloat(this.orderData.discount)) {
      this.toast.errorToastr('Maximum discount allowed ' + this.orderData.discount + ' %')
      return
    }

    if (this.logined_user_data.organisation_data.primary_dist_edit == '1') {
      this.orderData.discount = this.orderData.edit_dis;
    }


    if (parseFloat(this.orderData.discount) > 0) {
      disAmount = (parseFloat(this.orderData.mrp ? this.orderData.mrp : 0) * parseFloat(this.orderData.discount ? this.orderData.discount : 0) / 100);
      subTotal = parseFloat(this.orderData.mrp) - parseFloat(disAmount);
      for (let index = 0; index < this.product_detail.discount_list.length; index++) {
        if(parseFloat(this.product_detail.discount_list[index]['sale_value']) > parseFloat(this.product_detail.discount_list[index]['discount_value'])){
          this.toast.errorToastr('Maximum ' +this.product_detail.discount_list[index]['discount_name'] + ' discount allowed ' + this.product_detail.discount_list[index]['discount_value'] + ' %');
          return
        }
        else{
          otherDiscount = (parseFloat(subTotal ? subTotal : 0) * parseFloat(this.product_detail.discount_list[index]['sale_value'] ? this.product_detail.discount_list[index]['sale_value'] : 0) / 100);
          this.product_detail.discount_list[index]['otherDisAmt'] = otherDiscount*parseFloat(this.orderData.qty);
          subTotal = parseFloat(subTotal) - parseFloat(otherDiscount);
        }
      }
      gstAmount = (parseFloat(subTotal) * parseFloat(this.product_detail.gst ? this.product_detail.gst : 0) / 100)
    }

    if (parseInt(this.orderData.discount) == 0) {
      subTotal = this.orderData.mrp;
      gstAmount = (parseFloat(this.orderData.mrp ? this.orderData.mrp : 0) * parseFloat(this.product_detail.gst ? this.product_detail.gst : 0) / 100)
    }

    if (this.order_item.length > 0) {
      let existIndex
      
      existIndex = this.order_item.findIndex(row => (row.product_id == this.orderData.product_id));

      if (existIndex != -1) {
        this.order_item.splice(existIndex, 1)
        this.order_item.push({
          'product_name': this.orderData.product_name,
          'segment_id': this.product_detail.category_id,
          'product_id': this.orderData.product_id,
          'segment_name': this.product_detail.category,
          'feature_name': this.orderData.feature_name ? this.orderData.feature_name : '',
          'product_code': this.orderData.product_code,
          'qty': this.orderData.qty,
          // 'discount_percent': this.orderData.discount,
          'discount_percent': this.product_detail.discount_list.length > 0 ? this.orderData.discount + '+' + this.product_detail.discount_list.map(discount => discount.sale_value).join('+') : this.orderData.discount,
          // 'discount_amount': disAmount * parseFloat(this.orderData.qty),
          'discount_amount': this.product_detail.discount_list.reduce((sum, discount) => (sum + discount.otherDisAmt), 0) +disAmount * parseFloat(this.orderData.qty),
          'price': this.orderData.mrp,
          'total_price': this.orderData.mrp * parseFloat(this.orderData.qty),
          'amount': parseFloat(this.orderData.qty) * subTotal,
          'gst_amount': gstAmount * parseFloat(this.orderData.qty),
          'gst_percent': this.product_detail.gst,
          'net_price': (parseFloat(this.orderData.qty) * subTotal) + (gstAmount * parseFloat(this.orderData.qty)),
          'small_packing_size': this.orderData.small_packing_size ? this.orderData.small_packing_size : '0',
          'master_packing_size': this.orderData.master_packing_size ? this.orderData.master_packing_size : '0',
        });
      }
      else {
        this.order_item.push({
          'product_name': this.orderData.product_name,
          'segment_id': this.product_detail.category_id,
          'product_id': this.orderData.product_id,
          'segment_name': this.product_detail.category,
          'feature_name': this.orderData.feature_name ? this.orderData.feature_name : '',
          'product_code': this.orderData.product_code,
          'qty': this.orderData.qty,
         // 'discount_percent': this.orderData.discount,
         'discount_percent': this.product_detail.discount_list.length > 0 ? this.orderData.discount + '+' + this.product_detail.discount_list.map(discount => discount.sale_value).join('+') : this.orderData.discount,
         // 'discount_amount': disAmount * parseFloat(this.orderData.qty),
         'discount_amount': this.product_detail.discount_list.reduce((sum, discount) => (sum + discount.otherDisAmt), 0) +disAmount * parseFloat(this.orderData.qty),
          'price': this.orderData.mrp,
          'total_price': this.orderData.mrp * parseFloat(this.orderData.qty),
          'amount': parseFloat(this.orderData.qty) * subTotal,
          'gst_amount': gstAmount * parseFloat(this.orderData.qty),
          'gst_percent': this.product_detail.gst,
         'net_price': (parseFloat(this.orderData.qty) * subTotal) + (gstAmount * parseFloat(this.orderData.qty)),
          'small_packing_size': this.orderData.small_packing_size ? this.orderData.small_packing_size : '0',
          'master_packing_size': this.orderData.master_packing_size ? this.orderData.master_packing_size : '0',
        });
      }
    }
    else {
      this.order_item.push({
        'product_name': this.orderData.product_name,
        'segment_id': this.product_detail.category_id,
        'product_id': this.orderData.product_id,
        'segment_name': this.product_detail.category,
        'feature_name': this.orderData.feature_name ? this.orderData.feature_name : '',
        'product_code': this.orderData.product_code,
        'qty': this.orderData.qty,
        // 'discount_percent': this.orderData.discount,
        'discount_percent': this.product_detail.discount_list.length > 0 ? this.orderData.discount + '+' + this.product_detail.discount_list.map(discount => discount.sale_value).join('+') : this.orderData.discount,
        // 'discount_amount': disAmount * parseFloat(this.orderData.qty),
        'discount_amount': this.product_detail.discount_list.reduce((sum, discount) => (sum + discount.otherDisAmt), 0) +disAmount * parseFloat(this.orderData.qty),
        'price': this.orderData.mrp,
        'total_price': this.orderData.mrp * parseFloat(this.orderData.qty),
        'amount': parseFloat(this.orderData.qty) * subTotal,
        'gst_amount': gstAmount * parseFloat(this.orderData.qty),
        'gst_percent': this.product_detail.gst,
       'net_price': (parseFloat(this.orderData.qty) * subTotal) + (gstAmount * parseFloat(this.orderData.qty)),
        'small_packing_size': this.orderData.small_packing_size ? this.orderData.small_packing_size : '0',
        'master_packing_size': this.orderData.master_packing_size ? this.orderData.master_packing_size : '0',
      });
    }

    this.total_qty = 0;
    this.net_price = 0;
    this.total_gst_amount = 0;
    this.order_discount = 0;
    this.total_order_amount = 0;
    this.order_total = 0;
    for (let i = 0; i < this.order_item.length; i++) {
      this.total_qty = (parseInt(this.total_qty) + parseInt(this.order_item[i]['qty']));
      this.total_order_amount = parseFloat(this.total_order_amount) + (parseFloat(this.order_item[i]['price']) * this.order_item[i]['qty']);
      this.order_discount = parseFloat(this.order_item[i].discount_amount) + parseFloat(this.order_discount);
      this.order_total = parseFloat(this.order_total) + parseFloat(this.order_item[i]['amount']);
      this.total_gst_amount = parseFloat(this.order_item[i].gst_amount) + parseFloat(this.total_gst_amount);
      this.net_price = parseFloat(this.net_price) + parseFloat(this.order_item[i]['net_price']);
    }

    this.orderData.product_id = '';
    this.orderData.qty = '';
    this.orderData.feature_id = '';
    this.orderData.feature_name = '';
    this.orderData.segment_id = '';
    this.getSegment();

  }


  calcValue(i, qty, discount_percent, price, gst_percent) {
    let subTotal
    let disAmount
    let gstAmount

    if (!parseInt(qty)) {
      this.toast.errorToastr('Qty is required')
      return
    }
    if (parseInt(qty) === 0) {
      this.toast.errorToastr('Minimum qty 1 is required')
      return
    }


    if (parseFloat(discount_percent) > 0) {
      disAmount = (parseFloat(price ? price : 0) * parseFloat(discount_percent ? discount_percent : 0) / 100);
      subTotal = parseFloat(price) - parseFloat(disAmount);
      gstAmount = (parseFloat(subTotal) * parseFloat(gst_percent ? gst_percent : 0) / 100)
    }
    if (parseInt(discount_percent) == 0) {
      subTotal = price;
      gstAmount = (parseFloat(price ? price : 0) * parseFloat(gst_percent ? gst_percent : 0) / 100)
    }


    this.order_item[i]['discount_amount'] = disAmount * parseFloat(qty);
    this.order_item[i]['total_price'] = parseFloat(price) * parseFloat(qty);
    this.order_item[i]['amount'] = parseFloat(qty) * subTotal;
    this.order_item[i]['gst_amount'] = gstAmount * parseFloat(qty);
    this.order_item[i]['net_price'] = (subTotal + gstAmount) * parseFloat(qty)
    this.total_qty = 0;
    this.net_price = 0;
    this.total_gst_amount = 0;
    this.order_discount = 0;
    this.total_order_amount = 0;
    this.order_total = 0;
    for (let i = 0; i < this.order_item.length; i++) {
      this.total_qty = (parseInt(this.total_qty) + parseInt(this.order_item[i]['qty']));
      this.total_order_amount = parseFloat(this.total_order_amount) + (parseFloat(this.order_item[i]['price']) * this.order_item[i]['qty']);
      this.order_discount = parseFloat(this.order_item[i].discount_amount) + parseFloat(this.order_discount);
      this.order_total = parseFloat(this.order_total) + parseFloat(this.order_item[i]['amount']);
      this.total_gst_amount = parseFloat(this.order_item[i].gst_amount) + parseFloat(this.total_gst_amount);
      this.net_price = parseFloat(this.net_price) + parseFloat(this.order_item[i]['net_price']);
    }

    this.orderData.product_id = '';
    this.orderData.qty = '';
    this.orderData.feature_id = '';
    this.orderData.feature_name = '';

  }



  listdelete(i) {
    this.order_item.splice(i, 1);
    this.toast.successToastr('Deleted');
    this.total_qty = 0;
    this.net_price = 0;
    this.total_gst_amount = 0;
    this.order_discount = 0;
    this.total_order_amount = 0;
    this.order_total = 0;

    for (let i = 0; i < this.order_item.length; i++) {
      this.total_qty = (parseInt(this.total_qty) + parseInt(this.order_item[i]['qty']));
      this.total_order_amount = parseFloat(this.total_order_amount) + (parseFloat(this.order_item[i]['price']) * this.order_item[i]['qty']);
      this.order_discount = parseFloat(this.order_item[i].discount_amount) + parseFloat(this.order_discount);
      this.order_total = parseFloat(this.order_total) + parseFloat(this.order_item[i]['amount']);
      this.total_gst_amount = (parseFloat(this.order_item[i].gst_amount)) + parseFloat(this.total_gst_amount);
      this.net_price = parseFloat(this.net_price) + parseFloat(this.order_item[i]['net_price']);
    }
  }
}
