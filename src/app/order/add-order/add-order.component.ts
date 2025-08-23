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
import { MatDialog } from '@angular/material';
import { StatusModalComponent } from '../status-modal/status-modal.component';
// import { QuillEditorComponent } from 'ngx-quill/src/quill-editor.component';



@Component({
  selector: 'app-add-order',
  templateUrl: './add-order.component.html',
  animations: [slideToTop()]
  
})
export class AddOrderComponent implements OnInit {
  
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
  feature_data: any = [];
  segmentList: any = [];
  subCatList: any = [];
  logined_user_data:any ={};
  userData: any;
  transportList:any =[];
  
  constructor(public service: DatabaseService, public dialogs: MatDialog, public cryptoService: CryptoService, public route: ActivatedRoute, public toast: ToastrManager, public dialog: DialogComponent, private router: Router, public session: sessionStorage,) {
    this.login_data = this.session.getSession();
    this.login_data = this.login_data.value;
    this.login_data = this.login_data.data;
    this.userData = JSON.parse(localStorage.getItem('st_user'));
    this.logined_user_data = this.userData['data'];
  }
  
  ngOnInit() {
    this.distributors('');
  }
  
  
  
  getTransport(id) {
    this.service.post_rqst({'dr_id':this.data.type_name, 'transport_id':id}, "Order/transportCompanyName").subscribe((result => {
      if (result['statusCode'] == 200) {
        this.transportList = result['result'];
        if(this.transportList.length == 1){
          this.data.transport = this.transportList[0]['id'].toString();
        }
      } else {
        this.toast.errorToastr(result['statusMsg']);
      }
      
    }));
  }
  
  
  distributorDetail() {
    this.loader = true
    let id = { "id": this.dr_id }
    this.service.post_rqst(id, "CustomerNetwork/distributorDetail").subscribe((result) => {
      
      if (result['statusCode'] == 200) {
        this.loader = false
        this.dr_detail = result['distributor_detail'];
        this.getTransport(this.dr_detail.transport_id) 
        this.getitem('')
      } else {
        this.loader = true
        this.toast.errorToastr(result['statusMsg'])
      }
      
    }, err => {
      this.loader = false;
      
    })
  }
  
  networkType: any = []
  distributors(masterSearch) {
    this.loader = true
    this.service.post_rqst({ 'dr_type': '1', 'master_search': masterSearch }, "Order/followupCustomer").subscribe((result) => {
      
      if (result['statusCode'] == 200) {
        this.loader = false
        this.drList = result['result'];
      } else {
        this.loader = true
        this.toast.errorToastr(result['statusMsg'])
      }
    }, err => {
      this.loader = false;
      
    })
  }
  
  get_state_list() {
    let index = this.drList.findIndex(r => r.id == this.data.type_name);
    if (index > -1) {
      console.log(this.drList[index], 'this.drList[index]');
      
      this.Dist_state = this.drList[index].state;
    }
    this.dr_id = this.data.type_name;

    this.distributorDetail();
  }
  
  
  getitem(search) {
    this.loader = true
    this.service.post_rqst({ 'data': { 'dr_id': this.dr_id, 'cat_id': this.data.segment, 'sub_cat_id': this.data.sub_segment }, 'filter': { 'search': search } }, "Order/segmentItems")
    .subscribe(result => {
      
      if (result['statusCode'] == 200) {
        this.loader = false
        this.items = result['result'];
      } else {
        this.loader = false
        this.toast.errorToastr(result['statusMsg'])
      }
    })
  }
  
  
  get_product_details(id) {
    this.data.brand = '';
    this.data.color = '';
    this.loader = true
    this.service.post_rqst({ 'product_id': id, 'type': 'order', 'dr_id': this.data.type_name, 'order_type': 'primary' }, "Order/segmentItemsDetails")
    .subscribe(result => {
      
      if (result['statusCode'] == 200) {
        this.loader = false
        this.product_detail = result['result'];
        this.data.segment = this.product_detail.category_id.toString();
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
        this.toast.errorToastr(result['statusMsg'])
        this.loader = false
      }
    })
  }
  gst: any;
  net_price: any = 0;
  total_order_amount: any = 0;
  addToList() {
    let subTotal:any = 0
    let disAmount:any = 0
    let otherDiscount:any = 0
    let gstAmount:any = 0
    
    
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
      for (let index = 0; index < this.product_detail.discount_list.length; index++) {
        if(parseFloat(this.product_detail.discount_list[index]['sale_value']) > parseFloat(this.product_detail.discount_list[index]['discount_value'])){
          this.toast.errorToastr('Maximum ' +this.product_detail.discount_list[index]['discount_name'] + ' discount allowed ' + this.product_detail.discount_list[index]['discount_value'] + ' %');
          return
        }
        else{
          otherDiscount = (parseFloat(subTotal ? subTotal : 0) * parseFloat(this.product_detail.discount_list[index]['sale_value'] ? this.product_detail.discount_list[index]['sale_value'] : 0) / 100);
          this.product_detail.discount_list[index]['otherDisAmt'] = otherDiscount*parseFloat(this.data.qty);
          subTotal = parseFloat(subTotal) - parseFloat(otherDiscount);
        }
      }
      gstAmount = (parseFloat(subTotal) * parseFloat(this.product_detail.gst ? this.product_detail.gst : 0) / 100)
    }
    if (parseInt(this.data.discount) == 0) {
      subTotal = this.data.mrp;
      gstAmount = (parseFloat(this.data.mrp ? this.data.mrp : 0) * parseFloat(this.product_detail.gst ? this.product_detail.gst : 0) / 100)
    }
    console.log(subTotal, 'subTotal');
    if (this.add_list.length > 0) {
      let existIndex
      existIndex = this.add_list.findIndex(row => (row.product_id == this.data.product_id));
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
          // 'discount_percent': this.data.discount,
          'discount_percent': this.product_detail.discount_list.length > 0 ? this.data.discount + '+' + this.product_detail.discount_list.map(discount => discount.sale_value).join('+') : this.data.discount,
          // 'discount_amount': disAmount * parseFloat(this.data.qty),
          'discount_amount': this.product_detail.discount_list.reduce((sum, discount) => (sum + discount.otherDisAmt), 0) +disAmount * parseFloat(this.data.qty),
          'price': this.data.mrp,
          'total_price': this.data.mrp * parseFloat(this.data.qty),
          'amount': parseFloat(this.data.qty) * subTotal,
          'gst_amount': gstAmount * parseFloat(this.data.qty),
          'gst_percent': this.product_detail.gst,
          'net_price': (parseFloat(this.data.qty) * subTotal) + (gstAmount * parseFloat(this.data.qty)),
          'small_packing_size': this.data.small_packing_size ? this.data.small_packing_size : '0',
          'master_packing_size': this.data.master_packing_size ? this.data.master_packing_size : '0',
          'discount_list':this.product_detail.discount_list,
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
          // 'discount_percent': this.data.discount,
          'discount_percent': this.product_detail.discount_list.length > 0 ? this.data.discount + '+' + this.product_detail.discount_list.map(discount => discount.sale_value).join('+') : this.data.discount,
          // 'discount_amount': disAmount * parseFloat(this.data.qty),
          'discount_amount': this.product_detail.discount_list.reduce((sum, discount) => (sum + discount.otherDisAmt), 0) +disAmount * parseFloat(this.data.qty),
          'price': this.data.mrp,
          'total_price': this.data.mrp * parseFloat(this.data.qty),
          'amount': parseFloat(this.data.qty) * subTotal,
          'gst_amount': gstAmount * parseFloat(this.data.qty),
          'gst_percent': this.product_detail.gst,
        
          'net_price': (parseFloat(this.data.qty) * subTotal) + (gstAmount * parseFloat(this.data.qty)),
          'small_packing_size': this.data.small_packing_size ? this.data.small_packing_size : '0',
          'master_packing_size': this.data.master_packing_size ? this.data.master_packing_size : '0',
          'discount_list':this.product_detail.discount_list,
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
        // 'discount_percent': this.data.discount,
        'discount_percent': this.product_detail.discount_list.length > 0 ? this.data.discount + '+' + this.product_detail.discount_list.map(discount => discount.sale_value).join('+') : this.data.discount,
        // 'discount_amount': disAmount * parseFloat(this.data.qty),
        'discount_amount': this.product_detail.discount_list.reduce((sum, discount) => (sum + discount.otherDisAmt), 0) +disAmount * parseFloat(this.data.qty),
        'price': this.data.mrp,
        'total_price': this.data.mrp * parseFloat(this.data.qty),
        'amount': parseFloat(this.data.qty) * subTotal,
        'gst_amount': gstAmount * parseFloat(this.data.qty),
        'gst_percent': this.product_detail.gst,
        'net_price': (parseFloat(this.data.qty) * subTotal) + (gstAmount * parseFloat(this.data.qty)),
        'small_packing_size': this.data.small_packing_size ? this.data.small_packing_size : '0',
        'master_packing_size': this.data.master_packing_size ? this.data.master_packing_size : '0',
        'discount_list':this.product_detail.discount_list,
      });
      
    }
    
    this.add_list.concat(this.product_detail.discount_list); 
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
    this.product_detail.discount_list = [];
    
    console.log(this.add_list, 'add_list');
    
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
    this.service.post_rqst({ 'cat_id': this.data.segment }, "Order/subSegment").subscribe(result => {
      
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
    this.user_data.transport_id = this.data.transport_id;
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
    this.service.post_rqst({ "cart_data": this.add_list, "user_data": this.user_data, }, "Order/primaryOrdersAdd").subscribe(result => {
      if (result['statusCode'] == 200) {
        if (this.user_data.order_status == 'Draft') {
          this.dialog.success('', result['statusMsg'])
        }
        else {
          this.dialog.success('', result['statusMsg'])
        }
        this.router.navigate(['/order-list'])
      } else {
        this.dialog.error(result['statusMsg']);
      }
    })
  }
  
  back() {
    window.history.back();
  }
}
