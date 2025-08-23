import { Component, OnInit } from '@angular/core';
import { slideToTop } from '../../router-animation/router-animation.component';
import { DatabaseService } from 'src/_services/DatabaseService';
import { ActivatedRoute } from '@angular/router';
import { DialogComponent } from '../../dialog.component';
import { Router } from '@angular/router';
// import { $ } from 'protractor';
import * as $ from 'jquery';
import { sessionStorage } from 'src/app/localstorage.service';
import { Toastr, ToastrManager } from 'ng6-toastr-notifications';
import { CryptoService } from 'src/_services/CryptoService';
// import { QuillEditorComponent } from 'ngx-quill/src/quill-editor.component';

    
    @Component({
      selector: 'app-dist-primary-order-add-qty',
      templateUrl: './dist-primary-order-add-qty.component.html',
      styleUrls: ['./dist-primary-order-add-qty.component.scss'],
      animations: [slideToTop()]
})
export class DistPrimaryOrderAddQtyComponent implements OnInit {
  
  data: any = {}
  dr_id: any;
  dr_detail: any;
  items: any = [];
  product_list: any = [];
  add_list: any = []
  product_resp: boolean;
  special_discount: any = 0;
  nexturl: any;
  product_detail: any = {};
  brandList: any = [];
  colorList: any = [];
  temp_add_list: any = [];
  total_qty: any = 0;
  netamount: any = 0;
  total_gst_amount: any = 0;
  order_grand_total: any = 0;
  sub_total: any = 0;
  dis_amt: any = 0;
  gst_amount: any = 0;
  net_total: any = 0;
  spcl_dis_amt: any = 0
  grand_total: any = 0;
  order_discount: any = 0;
  order_total: any = 0;
  total_Order_amount: any = ''
  addToListButton: boolean = true;
  savingFlag: boolean = false;
  user_data: any = {};
  login_data: any = {};
  Dist_state: any = '';
  loader: boolean = false;
  drList: any = [];
  encryptedData: any;
  decryptedData: any;
  feature_data: any = [];
  segmentList: any = [];
  subCatList: any = [];
  logined_user_data:any ={};
  userData: any;
  
  
  constructor(public service: DatabaseService, public cryptoService: CryptoService, public route: ActivatedRoute, public toast: ToastrManager, public dialog: DialogComponent, private router: Router, public session: sessionStorage,) {
    this.login_data = this.session.getSession();
    this.login_data = this.login_data.value;
    this.login_data = this.login_data.data;
    this.userData = JSON.parse(localStorage.getItem('st_user'));
    this.logined_user_data = this.userData['data'];
    console.log(this.logined_user_data);
  }
  
  ngOnInit() {
    this.route.params.subscribe(params => {
      this.dr_id = params.id;
      this.distributorDetail()
    })
  }
  distributorDetail() {
    this.loader = true
    let id = { "id": this.dr_id }
    this.encryptedData = this.service.payLoad ? id : this.cryptoService.encryptData(id);
    this.service.post_rqst(this.encryptedData, "CustomerNetwork/distributorDetail").subscribe((result) => {
      this.decryptedData = this.service.payLoad ? result : this.cryptoService.decryptData(JSON.stringify(result));
      if (this.decryptedData['statusCode'] == 200) {
        this.loader = false
        this.dr_detail = this.decryptedData['distributor_detail'];
        this.getSegment()
      } else {
        this.loader = true
        this.toast.errorToastr(this.decryptedData['statusMsg'])
      }
      
    }, err => {
      this.loader = false;
      
    })
  }
  
  networkType: any = []
  distributors(masterSearch) {
    this.loader = true
    this.encryptedData = this.service.payLoad ? { 'dr_type': '1', 'master_search': masterSearch } : this.cryptoService.encryptData({ 'dr_type': '1', 'master_search': masterSearch });
    this.service.post_rqst(this.encryptedData, "Order/followupCustomer").subscribe((result) => {
      this.decryptedData = this.service.payLoad ? result : this.cryptoService.decryptData(JSON.stringify(result));
      if (this.decryptedData['statusCode'] == 200) {
        this.loader = false
        this.drList = this.decryptedData['result'];
      } else {
        this.loader = true
        this.toast.errorToastr(this.decryptedData['statusMsg'])
      }
    }, err => {
      this.loader = false;
      
    })
  }
  
  get_state_list() {
    let index = this.drList.findIndex(r => r.id == this.data.type_name);
    if (index > -1) {
      this.Dist_state = this.drList[index].state;
    }
    this.dr_id = this.data.type_name;
    this.distributorDetail();
  }
  
  
  getitem(search) {
    this.loader = true
    this.encryptedData = this.service.payLoad ? { 'data': { 'dr_id': this.dr_id, 'cat_id': this.data.segment, 'sub_cat_id': this.data.sub_segment }, 'filter': { 'search': search } } : this.cryptoService.encryptData({ 'data': { 'dr_id': this.dr_id, 'cat_id': this.data.segment, 'sub_cat_id': this.data.sub_segment }, 'filter': { 'search': search } });
    this.service.post_rqst(this.encryptedData, "Order/segmentItems")
    .subscribe(result => {
      this.decryptedData = this.service.payLoad ? result : this.cryptoService.decryptData(JSON.stringify(result));
      if (this.decryptedData['statusCode'] == 200) {
        this.loader = false
        this.items = this.decryptedData['result'];
      } else {
        this.loader = false
        this.toast.errorToastr(this.decryptedData['statusMsg'])
      }
    })
  }
  
  
  get_product_details(id) {
    this.data.brand = '';
    this.data.color = '';
    this.loader = true
    this.encryptedData = this.service.payLoad ? { 'product_id': id, 'type': 'order', 'dr_id': this.dr_id, 'order_type': 'primary' } : this.cryptoService.encryptData({ 'product_id': id, 'type': 'order', 'dr_id': this.data.type_name, 'order_type': 'primary' });
    this.service.post_rqst(this.encryptedData, "Order/segmentItemsDetails")
    .subscribe(result => {
      this.decryptedData = this.service.payLoad ? result : this.cryptoService.decryptData(JSON.stringify(result));
      if (this.decryptedData['statusCode'] == 200) {
        this.loader = false
        this.product_detail = this.decryptedData['result'];
        // this.data.segment = this.subCatList[index]['master_category_id'].toString();
        // this.data.segment_id = this.subCatList[index]['master_category_id'].toString();
        this.data.segment = this.product_detail.category_id.toString();
        // this.data.segment_id = this.product_detail.category_id.toString();
        this.data.sub_segment = this.product_detail.sub_category_id.toString()
        this.getSegment();
        this.getSubSegment();
        
        
        if (this.product_detail.feature == 'Yes') {
          this.feature_data = this.product_detail.feature_data
        }
        this.data.product_name = this.product_detail.product_name;
        this.data.product_code = this.product_detail.product_code;
        this.data.discount = this.product_detail.discount;
        this.data.edit_dis = this.product_detail.discount;
        this.data.mrp = this.product_detail['mrp'];
        this.data.master_packing_size = this.product_detail.master_packing_size ? this.product_detail.master_packing_size : '0';
        this.data.small_packing_size = this.product_detail.small_packing_size ? this.product_detail.small_packing_size : '0';
        
        
      } else {
        this.toast.errorToastr(this.decryptedData['statusMsg'])
        this.loader = false
      }
    })
  }
  gst: any;
  net_price: any = 0;
  total_order_amount: any = 0;
  
  addToList() {
    let subTotal
    let disAmount
    let gstAmount
    
    
    if (!this.data.feature_id && this.product_detail.feature == 'Yes') {
      this.toast.errorToastr('Select Feature')
      return
    }
    
    
    if (!this.data.qty) {
      this.toast.errorToastr('Qty is required')
      return
    }
    if (parseInt(this.data.qty) === 0) {
      this.toast.errorToastr('Minimum qty 1 is required')
      return
    }
    
    if (this.login_data.organisation_data.primary_dist_edit == '1' && parseFloat(this.data.edit_dis) > parseFloat(this.data.discount)) {
      this.toast.errorToastr('Maximum discount allowed ' + this.data.discount + ' %')
      return
    }
    
    if (this.login_data.organisation_data.primary_dist_edit == '1') {
      this.data.discount = this.data.edit_dis;
    }
    
    if (parseFloat(this.data.discount) > 0) {
      disAmount = (parseFloat(this.data.mrp ? this.data.mrp : 0) * parseFloat(this.data.discount ? this.data.discount : 0) / 100);
      subTotal = parseFloat(this.data.mrp) - parseFloat(disAmount);
      gstAmount = (parseFloat(subTotal) * parseFloat(this.product_detail.gst ? this.product_detail.gst : 0) / 100)
    }
    if (parseInt(this.data.discount) == 0) {
      subTotal = this.data.mrp;
      gstAmount = (parseFloat(this.data.mrp ? this.data.mrp : 0) * parseFloat(this.product_detail.gst ? this.product_detail.gst : 0) / 100)
    }
    
    if (this.add_list.length > 0) {
      let existIndex
      existIndex = this.add_list.findIndex(row => (row.product_id == this.data.product_id && row.feature_name === this.data.feature_name));
      if (existIndex != -1) {
        this.add_list.splice(existIndex, 1)
        this.add_list.push({
          'product_name': this.data.product_name,
          'segment_id': this.product_detail.category_id,
          'product_id': this.data.product_id,
          'segment_name': this.product_detail.category,
          'product_code': this.data.product_code,
          'feature_name': this.data.feature_name ? this.data.feature_name : '',
          'qty': this.data.qty,
          'discount_percent': this.data.discount,
          'discount_amount': disAmount * parseFloat(this.data.qty),
          'price': this.data.mrp,
          'total_price': this.data.mrp * parseFloat(this.data.qty),
          'amount': parseFloat(this.data.qty) * subTotal,
          'gst_amount': gstAmount * parseFloat(this.data.qty),
          'gst_percent': this.product_detail.gst,
          'net_price': (subTotal + gstAmount) * parseFloat(this.data.qty),
          'small_packing_size': this.data.small_packing_size ? this.data.small_packing_size : '0',
          'master_packing_size': this.data.master_packing_size ? this.data.master_packing_size : '0',
        });
      }
      else {
        this.add_list.push({
          'product_name': this.data.product_name,
          'segment_id': this.product_detail.category_id,
          'product_id': this.data.product_id,
          'segment_name': this.product_detail.category,
          'product_code': this.data.product_code,
          'feature_name': this.data.feature_name ? this.data.feature_name : '',
          'qty': this.data.qty,
          'discount_percent': this.data.discount,
          'discount_amount': disAmount * parseFloat(this.data.qty),
          'price': this.data.mrp,
          'total_price': this.data.mrp * parseFloat(this.data.qty),
          'amount': parseFloat(this.data.qty) * subTotal,
          'gst_amount': gstAmount * parseFloat(this.data.qty),
          'gst_percent': this.product_detail.gst,
          'net_price': (subTotal + gstAmount) * parseFloat(this.data.qty),
          'small_packing_size': this.data.small_packing_size ? this.data.small_packing_size : '0',
          'master_packing_size': this.data.master_packing_size ? this.data.master_packing_size : '0',
        });
      }
    }
    else {
      this.add_list.push({
        'product_name': this.data.product_name,
        'segment_id': this.product_detail.category_id,
        'product_id': this.data.product_id,
        'segment_name': this.product_detail.category,
        'product_code': this.data.product_code,
        'feature_name': this.data.feature_name ? this.data.feature_name : '',
        'qty': this.data.qty,
        'discount_percent': this.data.discount,
        'discount_amount': disAmount * parseFloat(this.data.qty),
        'price': this.data.mrp,
        'total_price': this.data.mrp * parseFloat(this.data.qty),
        'amount': parseFloat(this.data.qty) * subTotal,
        'gst_amount': gstAmount * parseFloat(this.data.qty),
        'gst_percent': this.product_detail.gst,
        'net_price': (subTotal + gstAmount) * parseFloat(this.data.qty),
        'small_packing_size': this.data.small_packing_size ? this.data.small_packing_size : '0',
        'master_packing_size': this.data.master_packing_size ? this.data.master_packing_size : '0',
      });
      
    }
    
    this.total_qty = 0;
    this.net_price = 0;
    this.total_gst_amount = 0;
    this.order_discount = 0;
    this.total_order_amount = 0;
    this.order_total = 0;
    for (let i = 0; i < this.add_list.length; i++) {
      this.total_qty = (parseInt(this.total_qty) + parseInt(this.add_list[i]['qty']));
      this.total_order_amount = parseFloat(this.total_order_amount) + (parseFloat(this.add_list[i]['price']) * this.add_list[i]['qty']);
      this.order_discount = parseFloat(this.add_list[i].discount_amount) + parseFloat(this.order_discount);
      this.order_total = parseFloat(this.order_total) + parseFloat(this.add_list[i]['amount']);
      this.total_gst_amount = parseFloat(this.add_list[i].gst_amount) + parseFloat(this.total_gst_amount);
      this.net_price = parseFloat(this.net_price) + parseFloat(this.add_list[i]['net_price']);
    }
    
    this.data.product_id = '';
    this.data.qty = '';
    this.data.feature_id = '';
    this.data.feature_name = '';
    this.data.small_packing_size = '';
    this.data.master_packing_size = '';
    this.data.segment_id = '';
    this.getSegment();
  }
  
  
  getCatId(id) {
    let index
    index = this.subCatList.findIndex(row => row.id == id);
    if (index != -1) {
      this.data.segment = this.subCatList[index]['master_category_id'].toString();
      this.data.segment_id = this.subCatList[index]['master_category_id'].toString();
      this.getSegment();
    }
  }
  
  
  changeMRP(id) {
    let index
    index = this.feature_data.findIndex(row => row.id == id);
    if (index != -1) {
      this.data.mrp = this.feature_data[index]['mrp'];
      this.data.feature_name = this.feature_data[index]['feature_name'];
    }
  }
  
  getSegment() {
    this.loader = true
    this.service.post_rqst({ 'cat_id': this.data.segment_id }, "Order/segment")
    .subscribe(result => {
      this.decryptedData = this.service.payLoad ? result : this.cryptoService.decryptData(JSON.stringify(result));
      if (this.decryptedData['statusCode'] == 200) {
        this.loader = false
        this.segmentList = this.decryptedData['result'];
      }
      else {
        this.loader = false
        this.dialog.error(this.decryptedData['statusMsg']);
      }
    })
  }
  
  getSubSegment() {
    this.loader = true
    this.service.post_rqst({ 'cat_id': this.data.segment }, "Order/subSegment").subscribe(result => {
      this.decryptedData = this.service.payLoad ? result : this.cryptoService.decryptData(JSON.stringify(result));
      if (this.decryptedData['statusCode'] == 200) {
        this.loader = false
        this.subCatList = this.decryptedData['result'];
      }
      else {
        this.loader = false
        this.dialog.error(this.decryptedData['statusMsg']);
      }
    })
  }
  
  
  
  listdelete(i) {
    this.dialog.confirm("Are you sure ?").then((result) => {
      if (result) {
        this.add_list.splice(i, 1);
        this.total_qty = 0;
        this.net_price = 0;
        this.total_gst_amount = 0;
        this.order_discount = 0;
        this.total_order_amount = 0;
        this.order_total = 0;
        
        for (let i = 0; i < this.add_list.length; i++) {
          this.total_qty = (parseInt(this.total_qty) + parseInt(this.add_list[i]['qty']));
          this.total_order_amount = parseFloat(this.total_order_amount) + (parseFloat(this.add_list[i]['price']) * this.add_list[i]['qty']);
          this.order_discount = parseFloat(this.add_list[i].discount_amount) + parseFloat(this.order_discount);
          this.order_total = parseFloat(this.order_total) + parseFloat(this.add_list[i]['amount']);
          this.total_gst_amount = (parseFloat(this.add_list[i].gst_amount)) + parseFloat(this.total_gst_amount);
          this.net_price = parseFloat(this.net_price) + parseFloat(this.add_list[i]['net_price']);
        }
      }
    })
  }
  
  save_orderalert() {
    this.dialog.confirm("You want to submit this order ?").then((result) => {
      if (result) {
        this.save_order()
      }
    })
  }
  save_order() {
    this.savingFlag = true;
    this.user_data.type = '1';
    this.user_data.Disctype = '1';
    this.user_data.dr_id = this.dr_id
    this.user_data.remark = this.data.remark;
    this.user_data.total_Order_amount = this.total_Order_amount;
    this.user_data.order_discount = this.order_discount;
    this.user_data.tcs_percent = this.dr_detail.tcs_percentage;
    this.user_data.order_type = 'WEB ORDER';
    this.user_data.gst_percent = this.product_detail.gst;
    this.user_data.order_total = this.order_total;
    this.user_data.total_gst_amount = this.total_gst_amount;
    this.user_data.order_grand_total = this.order_grand_total;
    this.user_data.product_code = this.data.product_code
    if (this.data.distributor_id && this.data.delivery_from)
      this.user_data.distributor_id = this.data.delivery_from
    this.encryptedData = this.service.payLoad ? { "cart_data": this.add_list, "user_data": this.user_data, } : this.cryptoService.encryptData({ "cart_data": this.add_list, "user_data": this.user_data, });
    this.service.post_rqst(this.encryptedData, "Order/primaryOrdersAddQtyWise").subscribe(result => {
      this.decryptedData = this.service.payLoad ? result : this.cryptoService.decryptData(JSON.stringify(result));
      if (this.decryptedData['statusCode'] == 200) {
        if (this.user_data.order_status == 'Draft') {
          this.dialog.success('', this.decryptedData['statusMsg'])
        }
        else {
          this.dialog.success('', this.decryptedData['statusMsg'])
        }
        // this.router.navigate(['/order-list'])
        this.back()
      } else {
        this.dialog.error(this.decryptedData['statusMsg']);
      }
    })
  }
  
  back() {
    window.history.back();
  }
  
  
  
}
