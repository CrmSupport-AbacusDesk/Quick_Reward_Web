import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { DatabaseService } from 'src/_services/DatabaseService';
import { DialogComponent } from 'src/app/dialog.component';
import { ToastrManager } from 'ng6-toastr-notifications';
import { ActivatedRoute, Router } from '@angular/router';
import { slideToTop } from '../../router-animation/router-animation.component';
import { sessionStorage } from 'src/app/localstorage.service';
import { CryptoService } from 'src/_services/CryptoService';


@Component({
  selector: 'app-secondary-order-add-quantity',
  templateUrl: './secondary-order-add-quantity.component.html',
  styleUrls: ['./secondary-order-add-quantity.component.scss']
})
export class SecondaryOrderAddQuantityComponent implements OnInit {
  loader: boolean = false;
  savingFlag: boolean = false;
  data: any = {}
  items: any = []
  dealerList: any = []
  dr_id: any;
  product_detail: any = {}
  dr_detail: any = {}
  Dist_state = ''
  add_list = []
  user_data: any = {};
  order_discount: any = 0;
  total_qty: any = 0;
  netamount: any = 0;
  sub_total: any = 0;
  gst_amount: any = 0;
  net_total: any = 0;
  total_Order_amount: any = 0;
  login_data: any = {};
  Distributor_list: any = []
  encryptedData: any;
  decryptedData: any;
  fix_discount: any = 0;
  net_price: any = 0;
  discount_amount: any = 0;
  amount: any = ''
  total_price: any = 0;
  segmentList: any = [];
  subCatList: any = [];
  
  
  constructor(public service: DatabaseService, public cryptoService: CryptoService, public toast: ToastrManager, public route: ActivatedRoute, public dialog: DialogComponent, private router: Router, public session: sessionStorage,) {
    this.login_data = this.session.getSession();
    this.login_data = this.login_data.value;
    this.login_data = this.login_data.data;
  }
  ngOnInit() {
    this.route.params.subscribe(params => {
      this.data.dr_disc = 0
      this.distributors('');
    })
  }
  
  distributors(masterSearch) {
    this.loader = true
    this.encryptedData = this.service.payLoad ? { 'dr_type': '3', 'master_search': masterSearch } : this.cryptoService.encryptData({ 'dr_type': '3', 'master_search': masterSearch });
    this.service.post_rqst(this.encryptedData, "Order/followupCustomer").subscribe((result) => {
      this.decryptedData = this.service.payLoad ? result : this.cryptoService.decryptData(JSON.stringify(result));
      if (this.decryptedData['statusCode'] == 200) {
        this.loader = false
        this.dealerList = this.decryptedData['result'];
      } else {
        this.toast.errorToastr(this.decryptedData['statusMsg'])
        this.loader = false
      }
    }, err => {
      this.loader = false;
      
    })
  }
  
  
  distributorDetail() {
    this.loader = true;
    console.log(this.data.distributor_id)
    this.dr_id = this.data.distributor_id;
    let id = { "id": this.dr_id };
    this.encryptedData = this.service.payLoad ? id : this.cryptoService.encryptData(id);
    this.service.post_rqst(this.encryptedData, "CustomerNetwork/distributorDetail").subscribe((result) => {
      this.decryptedData = this.service.payLoad ? result : this.cryptoService.decryptData(JSON.stringify(result));
      if (this.decryptedData['statusCode'] == 200) {
        this.loader = false
        this.dr_detail = this.decryptedData['distributor_detail'];
        this.getSegment();
        this.getSubSegment();
        this.getItemList('', this.dr_detail.brand)
      } else {
        this.loader = true
        this.toast.errorToastr(this.decryptedData['statusMsg'])
      }
      
    })
  }
  getAllDistributor() {
    
    this.loader = true;
    let id = { "id": this.dr_id }
    this.encryptedData = this.service.payLoad ? id : this.cryptoService.encryptData(id);
    this.service.post_rqst(this.encryptedData, "Order/getAllDistributor").subscribe((result) => {
      this.decryptedData = this.service.payLoad ? result : this.cryptoService.decryptData(JSON.stringify(result));
      if (this.decryptedData['statusCode'] == 200) {
        this.loader = false
        this.dr_detail = this.decryptedData['distributor_detail'];
        this.getItemList('', this.dr_detail.brand)
      } else {
        this.loader = true
        this.toast.errorToastr(this.decryptedData['statusMsg'])
      }
      
    })
  }
  
  get_dealerList() {
    this.loader = true
    this.encryptedData = this.service.payLoad ? { 'dr_id': this.dr_id, 'dr_type': 3 } : this.cryptoService.encryptData({ 'dr_id': this.dr_id, 'dr_type': 3 });
    this.service.post_rqst(this.encryptedData, "Order/assignedDealer").subscribe(result => {
      this.decryptedData = this.service.payLoad ? result : this.cryptoService.decryptData(JSON.stringify(result));
      if (this.decryptedData['statusCode'] == 200) {
        this.loader = false
        this.dealerList = this.decryptedData['result'];
      } else {
        this.toast.errorToastr(this.decryptedData['statusMsg'])
        this.loader = false
      }
    })
  }
  
  get_distributorList(event: any = '') {
    this.loader = true
    this.encryptedData = this.service.payLoad ? { 'dealer_id': this.data.dealer_name, 'master_search': event } : this.cryptoService.encryptData({ 'dealer_id': this.data.dealer_name, 'master_search': event });
    this.service.post_rqst(this.encryptedData, "Order/getAssignDistributor").subscribe(result => {
      this.decryptedData = this.service.payLoad ? result : this.cryptoService.decryptData(JSON.stringify(result));
      if (this.decryptedData['statusCode'] == 200) {
        this.loader = false
        this.Distributor_list = this.decryptedData['distributor_arr'];
        if (this.Distributor_list.length > 0) { this.data.distributor_id = this.Distributor_list[0].id; this.distributorDetail() }
      } else {
        this.toast.errorToastr(this.decryptedData['statusMsg'])
        this.loader = false
      }
    })
  }
  
  getItemList(search, brand) {
    this.encryptedData = this.service.payLoad ? { 'data': { 'dr_id': this.dr_id, 'cat_id': this.data.segment, 'sub_cat_id': this.data.sub_segment, 'order_type': 'secondary' }, 'filter': { 'search': search } } : this.cryptoService.encryptData({ 'data': { 'dr_id': this.dr_id, 'cat_id': this.data.segment, 'sub_cat_id': this.data.sub_segment, 'order_type': 'secondary' }, 'filter': { 'search': search } });
    this.service.post_rqst(this.encryptedData, "Order/segmentItems")
    .subscribe(result => {
      this.decryptedData = this.service.payLoad ? result : this.cryptoService.decryptData(JSON.stringify(result));
      if (this.decryptedData['statusCode'] == 200) {
        this.loader = false
        this.items = this.decryptedData['result'];
      } else {
        this.toast.errorToastr(this.decryptedData['statusMsg'])
        this.loader = false
      }
    })
    
  }
  get_product_details(id) {
    this.data.brand = '';
    this.data.color = '';
    this.loader = true
    this.encryptedData = this.service.payLoad ? { 'product_id': id, 'type': 'order', 'order_type': 'secondary', 'dr_id': this.data.dealer_name } : this.cryptoService.encryptData({ 'product_id': id, 'type': 'order', 'order_type': 'secondary', 'dr_id': this.data.dealer_name });
    this.service.post_rqst(this.encryptedData, "Order/segmentItemsDetails")
    .subscribe(result => {
      this.decryptedData = this.service.payLoad ? result : this.cryptoService.decryptData(JSON.stringify(result));
      if (this.decryptedData['statusCode'] == 200) {
        this.loader = false
        this.product_detail = this.decryptedData['result'];
        this.data.product_name = this.product_detail.product_name;
        this.data.product_code = this.product_detail.product_code;
        this.fix_discount = this.product_detail.discount;
        this.data.mrp = this.product_detail['mrp'];
        this.getSegment();
        this.getSubSegment();
        
      } else {
        this.toast.errorToastr(this.decryptedData['statusMsg'])
        this.loader = false
      }
    })
  }
  getdealerstate(id) {
    let Index = this.dealerList.findIndex(row => row.id == id);
    if (Index != -1) {
      
      this.Dist_state = this.dealerList[Index].state
    }
  }
  getitemdetail(id) {
    let Index = this.items.findIndex(row => row.id == id);
    if (Index != -1) {
      
      this.data.product_gst = this.items[Index].gst
    }
  }
  
  
  
  
  addToList() {
    let subTotal: number = 0
    let disAmount: number = 0
    let gstAmount: number = 0
    
    if (parseInt(this.data.discount) > parseInt(this.fix_discount)) {
      this.toast.errorToastr('Maximum discount allowed ' + this.fix_discount + '%')
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
    
    
    if (parseFloat(this.data.discount) > 0) {
      disAmount = (parseFloat(this.data.mrp ? this.data.mrp : 0) * parseFloat(this.data.discount ? this.data.discount : 0) / 100);
      subTotal = parseFloat(this.data.mrp) - disAmount;
      gstAmount = (subTotal * parseFloat(this.product_detail.gst ? this.product_detail.gst : 0) / 100)
    }
    if (parseInt(this.data.discount) == 0 || !this.data.discount) {
      subTotal = this.data.mrp;
      gstAmount = (parseFloat(this.data.mrp ? this.data.mrp : 0) * parseFloat(this.product_detail.gst ? this.product_detail.gst : 0) / 100)
    }
    
    if (this.add_list.length > 0) {
      let existIndex
      existIndex = this.add_list.findIndex(row => row.product_id == this.data.product_id);
      
      if (existIndex != -1) {
        this.add_list.splice(existIndex, 1)
        this.add_list.push({
          'product_name': this.data.product_name,
          'segment_id': this.product_detail.category_id,
          'product_id': this.data.product_id,
          'product_new_name': this.data.product_new_name,
          'segment_name': this.product_detail.category,
          'product_code': this.data.product_code,
          'qty': this.data.qty,
          'discount_percent': this.data.discount ? this.data.discount : 0,
          'discount_amount': disAmount * parseFloat(this.data.qty),
          'price': this.data.mrp,
          'total_price': this.data.mrp * parseFloat(this.data.qty),
          'amount': parseFloat(this.data.qty) * subTotal,
          'gst_amount': gstAmount * parseFloat(this.data.qty),
          'gst_percent': this.product_detail.gst,
          'net_price': (parseFloat(this.data.qty) * subTotal) + (gstAmount * parseFloat(this.data.qty))
        });
      }
      else {
        this.add_list.push({
          'product_name': this.data.product_name,
          'segment_id': this.product_detail.category_id,
          'product_id': this.data.product_id,
          'segment_name': this.product_detail.category,
          'product_code': this.data.product_code,
          'qty': this.data.qty,
          'product_new_name': this.data.product_new_name,
          'discount_percent': this.data.discount ? this.data.discount : 0,
          'discount_amount': disAmount * parseFloat(this.data.qty),
          'price': this.data.mrp,
          'total_price': this.data.mrp * parseFloat(this.data.qty),
          'amount': parseFloat(this.data.qty) * subTotal,
          'gst_amount': gstAmount * parseFloat(this.data.qty),
          'gst_percent': this.product_detail.gst,
          'net_price': (parseFloat(this.data.qty) * subTotal) + (gstAmount * parseFloat(this.data.qty))
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
        'qty': this.data.qty,
        'discount_percent': this.data.discount ? this.data.discount : 0,
        'discount_amount': disAmount * parseFloat(this.data.qty),
        'price': this.data.mrp,
        'total_price': this.data.mrp * parseFloat(this.data.qty),
        'amount': parseFloat(this.data.qty) * subTotal,
        'gst_amount': gstAmount * parseFloat(this.data.qty),
        'gst_percent': this.product_detail.gst,
        'net_price': (parseFloat(this.data.qty) * subTotal) + (gstAmount * parseFloat(this.data.qty))
      });
    }
    
    this.total_qty = 0;
    this.net_price = 0;
    this.gst_amount = 0;
    this.discount_amount = 0;
    this.total_price = 0;
    this.amount = 0;
    for (let i = 0; i < this.add_list.length; i++) {
      this.total_qty = (parseInt(this.total_qty) + parseInt(this.add_list[i]['qty']));
      this.total_price = parseFloat(this.total_price) + (parseFloat(this.add_list[i]['price']) * this.add_list[i]['qty']);
      this.discount_amount = parseFloat(this.add_list[i].discount_amount ? this.add_list[i].discount_amount : 0) + parseFloat(this.discount_amount);
      this.amount = parseFloat(this.amount) + parseFloat(this.add_list[i]['amount']);
      this.gst_amount = parseFloat(this.add_list[i].gst_amount) + parseFloat(this.gst_amount);
      this.net_price = parseFloat(this.net_price) + (parseFloat(this.add_list[i]['amount']) + parseFloat(this.add_list[i].gst_amount));
    }
    this.data.product_id = '';
    this.data.qty = '';
    this.data.discount = '';
    this.data.segment_id = '';
    this.getSegment();
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
        this.netamount = 0;
        this.total_Order_amount = 0;
        this.total_qty = 0;
        this.net_price = 0;
        this.gst_amount = 0;
        this.discount_amount = 0;
        this.total_price = 0;
        this.amount = 0;
        for (let i = 0; i < this.add_list.length; i++) {
          this.total_qty = (parseInt(this.total_qty) + parseInt(this.add_list[i]['qty']));
          this.total_price = parseFloat(this.total_price) + (parseFloat(this.add_list[i]['price']) * this.add_list[i]['qty']);
          this.discount_amount = parseFloat(this.add_list[i].discount_amount ? this.add_list[i].discount_amount : 0) + parseFloat(this.discount_amount);
          this.amount = parseFloat(this.amount) + parseFloat(this.add_list[i]['amount']);
          this.gst_amount = parseFloat(this.add_list[i].gst_amount) + parseFloat(this.gst_amount);
          this.net_price = parseFloat(this.net_price) + (parseFloat(this.add_list[i]['amount']) + parseFloat(this.add_list[i].gst_amount));
        }
      }
    })
  }
  
  
  
  
  save_order() {
    this.savingFlag = true;
    this.user_data.order_discount = this.order_discount;
    this.user_data.dr_id = this.data.dealer_name
    this.user_data.distributor_id = this.dr_id
    this.user_data.remark = this.data.remark;
    this.encryptedData = this.service.payLoad ? { "cart_data": this.add_list, "user_data": this.user_data, } : this.cryptoService.encryptData({ "cart_data": this.add_list, "user_data": this.user_data, });
    this.service.post_rqst(this.encryptedData, "Order/secondaryOrdersAddQtyWise").subscribe(result => {
      this.decryptedData = this.service.payLoad ? result : this.cryptoService.decryptData(JSON.stringify(result));
      if (this.decryptedData['statusCode'] == 200) {
        this.dialog.success('', this.decryptedData['statusMsg'])
        this.savingFlag = false;
        this.router.navigate(['/secondary-order-list']);
        
      } else {
        this.savingFlag = false;
        this.dialog.error(this.decryptedData['statusMsg']);
        
      }
    },
    error => {
      
    })
    
  }
  back() {
    window.history.back();
  }
}

