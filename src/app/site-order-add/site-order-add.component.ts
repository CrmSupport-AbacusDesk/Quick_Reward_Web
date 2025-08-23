import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { DatabaseService } from 'src/_services/DatabaseService';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import * as moment from 'moment';
import * as $ from 'jquery';
import { Location } from '@angular/common';
import { sessionStorage } from 'src/app/localstorage.service';
import { Toastr, ToastrManager } from 'ng6-toastr-notifications';
import { DialogComponent } from '../dialog.component';
import { CryptoService } from 'src/_services/CryptoService';



@Component({
  selector: 'app-site-order-add',
  templateUrl: './site-order-add.component.html'
})
export class SiteOrderAddComponent implements OnInit {
  @ViewChild("myInput") myInputField: ElementRef;
  data: any = {}
  dr_id: any;
  dr_detail: any;
  items: any = [];
  product_list: any = [];
  add_list: any = []
  product_resp: boolean;
  nexturl: any;
  product_detail: any = {};
  total_qty: any = 0;
  net_price: any = 0;
  total_gst_amount: any = 0;
  order_grand_total: any = 0;
  sub_total: any = 0;
  dis_amt: any = 0;
  gst_amount: any = 0;
  net_total: any = 0;
  grand_total: any = 0;
  order_discount: any = 0;
  sub_total_after_cd: any = 0;
  grand_total_before_tcs: any = 0;
  order_total: any = 0;
  total_Order_amount: any = ''
  cd_value: any = 0;
  ins_value: any = 0;
  tcs_value: any = 0;
  addToListButton: boolean = true;
  savingFlag: boolean = false;
  user_data: any = {};
  login_data: any = {};
  Dist_state: any = '';
  loader: boolean = false;
  segmentList: any = [];
  check_qty_flag: boolean = false;
  freightCodeList: any = []
  fraightTaxCodeList: any = []
  today_date = new Date();
  new_name: boolean;
  networkType: any = [];
  siteList: any = [];
  quotationList: any = [];
  orderId: any = {}
  orderDetailData: any = {}
  gst: any;
  pageType: any = {};
  encryptedData: any;
  decryptedData: any;



  constructor(public location: Location, public cryptoService: CryptoService, public service: DatabaseService, public route: ActivatedRoute, public toast: ToastrManager, public dialog: DialogComponent, private router: Router, public session: sessionStorage,) {
    this.login_data = this.session.getSession();
    this.login_data = this.login_data.value;
    this.login_data = this.login_data.data;
  }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.orderId = params['id'];
      this.pageType = this.route.queryParams['_value']['pageType'] ? this.route.queryParams['_value']['pageType'] : params['type'];
      if (this.orderId) {
        this.loader = true;
        this.data.orderId = this.orderId;
        this.orderDetail();
      }
      else {
        this.getSites('')
      }
    });
  }

  focusedInput() {
    this.myInputField.nativeElement.focus();
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
      } else {
        this.loader = true
        this.toast.errorToastr(this.decryptedData['statusMsg'])
      }

    }, err => {
      this.loader = false;

    })
  }



  getSites(masterSearch) {
    this.loader = true;
    this.encryptedData = this.service.payLoad ? { 'master_search': masterSearch } : this.cryptoService.encryptData({ 'master_search': masterSearch });
    this.service.post_rqst(this.encryptedData, "Enquiry/siteListForOrder").subscribe((result) => {
      this.decryptedData = this.service.payLoad ? result : this.cryptoService.decryptData(JSON.stringify(result));

      if (this.decryptedData['statusCode'] == 200) {
        this.loader = false
        this.siteList = this.decryptedData['enquiry_list'];
      } else {
        this.loader = true
        this.toast.errorToastr(this.decryptedData['statusMsg'])
      }
    }, err => {
      this.loader = false;

    })
  }

  getQuotation(masterSearch) {
    this.loader = true;
    this.encryptedData = this.service.payLoad ? { 'master_search': masterSearch, 'id': this.data.site_id } : this.cryptoService.encryptData({ 'master_search': masterSearch, 'id': this.data.site_id });
    this.service.post_rqst(this.encryptedData, "Enquiry/fetchQuotation").subscribe((result) => {
      this.decryptedData = this.service.payLoad ? result : this.cryptoService.decryptData(JSON.stringify(result));

      if (this.decryptedData['statusCode'] == 200) {
        this.loader = false
        this.quotationList = this.decryptedData['result'];
      } else {
        this.loader = true
        this.toast.errorToastr(this.decryptedData['statusMsg'])
      }
    }, err => {
      this.loader = false;

    })
  }



  findOtherInfo() {
    this.data.dr_id = '';
    this.data.assigned_to_distributor_name = '';
    this.data.assigned_to_dealer_id = '';
    this.data.assigned_to_dealer_name = '';
    this.data.site_name = '';
    this.data.site_mobile = '';
    let index = this.siteList.findIndex(row => row.id == this.data.site_id);
    if (index != -1) {
      this.data.dr_id = this.siteList[index].assigned_to_distributor_id;
      this.data.assigned_to_distributor_name = this.siteList[index].assigned_to_distributor_name;
      this.data.dealer_id = this.siteList[index].assigned_to_dealer_id;
      this.data.assigned_to_dealer_name = this.siteList[index].assigned_to_dealer_name;
      this.data.site_name = this.siteList[index].ownerName;
      this.data.site_mobile = this.siteList[index].ownerMobile;
      this.data.state = this.siteList[index].distributor_state;
      this.data.billing_address = this.siteList[index].address + ' ' + this.siteList[index].city + ' ' + this.siteList[index].district + ' ' + this.siteList[index].state + ' ' + this.siteList[index].pincode;
      this.data.shipping_address = this.siteList[index].address + ' ' + this.siteList[index].city + ' ' + this.siteList[index].district + ' ' + this.siteList[index].state + ' ' + this.siteList[index].pincode;
      this.getSegment();
    }
  }

  isValidNumber(event: any) {
    const pattern = /[0-9\+\-\ ]/;
    let inputChar = String.fromCharCode(event.charCode);
    if (event.keyCode != 8 && !pattern.test(inputChar)) { event.preventDefault(); }

  }

  getitem(search, segment) {
    this.loader = true;
    this.encryptedData = this.service.payLoad ? { 'data': { 'dr_id': this.dr_id, 'cat_id': segment }, 'filter': { 'search': search, 'start': "0", 'limit': "30" } } : this.cryptoService.encryptData({ 'data': { 'dr_id': this.dr_id, 'segment': segment }, 'filter': { 'search': search, 'start': "0", 'limit': "30" } });
    this.service.post_rqst(this.encryptedData, "Order/segmentItems").subscribe(result => {
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
    this.loader = true;
    this.encryptedData = this.service.payLoad ? { 'product_id': id, 'type': 'site', 'dr_id': this.data.dealer_id, 'state_name': this.data.state, 'order_type': 'primary' } : this.cryptoService.encryptData({ 'product_id': id, 'type': 'site', 'dr_id': this.data.dealer_id, 'state_name': this.data.state, 'order_type': 'primary' });

    this.service.post_rqst(this.encryptedData, "Order/segmentItemsDetails")
      .subscribe(result => {
        this.decryptedData = this.service.payLoad ? result : this.cryptoService.decryptData(JSON.stringify(result));

        if (this.decryptedData['statusCode'] == 200) {
          this.loader = false
          this.product_detail = this.decryptedData['result'];
          this.data.product_name = this.product_detail.product_name;
          this.data.product_code = this.product_detail.product_code;
          this.data.mrp = this.product_detail['mrp'];
          this.data.project_discount = this.product_detail['discount'] ? this.product_detail['discount'] : 0;

        } else {
          this.toast.errorToastr(this.decryptedData['statusMsg'])
          this.loader = false
        }
      })
  }




  addToList() {
    let subTotal
    let disAmount
    let gstAmount

    if (!this.data.qty && this.pageType == 'quotation') {
      this.toast.errorToastr('Qty required')
      return
    }
    if (parseInt(this.data.qty) <= 0 && this.pageType == 'quotation') {
      this.toast.errorToastr('Qty should be greater than zero.')
      return
    }

    if (parseInt(this.data.project_discount) >= 100) {
      this.toast.errorToastr('Discount must be less than hundred')
      return
    }
    if (parseInt(this.data.project_discount) >= 100) {
      this.toast.errorToastr('Discount must be less than hundred')
      return
    }
    if (parseFloat(this.data.project_discount) > parseFloat(this.product_detail.discount)) {
      this.toast.errorToastr("Discount can't be greater than" + this.product_detail.discount)
      return
    }
    if (this.data.project_discount > 0) {
      disAmount = (parseFloat(this.data.mrp ? this.data.mrp : 0) * parseFloat(this.data.project_discount ? this.data.project_discount : 0) / 100);
      subTotal = parseFloat(this.data.mrp) - parseFloat(disAmount);
      gstAmount = (parseFloat(subTotal) * parseFloat(this.product_detail.gst ? this.product_detail.gst : 0) / 100)
    }
    if (this.data.project_discount == 0) {
      subTotal = this.data.mrp;
      gstAmount = (parseFloat(this.data.mrp ? this.data.mrp : 0) * parseFloat(this.product_detail.gst ? this.product_detail.gst : 0) / 100)
    }
    if (this.add_list.length > 0) {
      let existIndex
      existIndex = this.add_list.findIndex(row => row.product_id == this.data.product_id);

      if (existIndex != -1) {
        this.add_list[existIndex]['qty'] = parseFloat(this.add_list[existIndex]['qty']) + parseFloat(this.data.qty)
        this.add_list[existIndex]['sale_qty'] = this.data.sale_qty ? parseFloat(this.add_list[existIndex]['sale_qty']) + parseFloat(this.data.sale_qty) : 0
        this.add_list[existIndex]['sale_dispatch_qty'] = this.data.sale_dispatch_qty ? parseFloat(this.add_list[existIndex]['sale_dispatch_qty']) + parseFloat(this.data.sale_dispatch_qty) : 0
        this.add_list[existIndex]['discount_amount'] = parseInt(this.add_list[existIndex]['qty']) * parseInt(disAmount)
        this.add_list[existIndex]['amount'] = parseFloat(this.add_list[existIndex]['qty']) * subTotal
        this.add_list[existIndex]['net_price'] = parseFloat(subTotal + gstAmount) * parseFloat(this.add_list[existIndex]['qty'])
        this.add_list[existIndex]['gst_amount'] = parseFloat(this.add_list[existIndex]['qty']) * parseFloat(gstAmount)
        this.add_list[existIndex]['gst_percent'] = parseFloat(this.add_list[existIndex]['gst_percent']) * parseFloat(this.product_detail.gst)

      }
      else {
        this.add_list.push({
          'product_name': this.data.product_name,
          'segment_id': this.product_detail.category_id,
          'product_id': this.data.product_id,
          'segment_name': this.product_detail.category,
          'product_code': this.data.product_code,

          'qty': this.data.qty,
          'sale_qty': this.data.sale_qty ? this.data.sale_qty : 0,
          'sale_dispatch_qty': this.data.sale_dispatch_qty ? this.data.sale_dispatch_qty : 0,
          'product_new_name': this.data.product_new_name,
          'discount_percent': this.data.project_discount,
          'discount_amount': parseFloat(this.data.qty) * disAmount,
          'price': this.data.mrp,
          'amount': parseFloat(this.data.qty) * subTotal,
          'gst_amount': parseFloat(this.data.qty) * gstAmount,
          'gst_percent': this.product_detail.gst,
          'net_price': (subTotal + gstAmount) * parseFloat(this.data.qty)
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
        'sale_qty': this.data.sale_qty ? this.data.sale_qty : 0,
        'sale_dispatch_qty': this.data.sale_dispatch_qty ? this.data.sale_dispatch_qty : 0,
        'discount_percent': this.data.project_discount,
        'discount_amount': parseFloat(this.data.qty) * disAmount,
        'price': this.data.mrp,
        'amount': parseFloat(this.data.qty) * subTotal,
        'gst_amount': parseFloat(this.data.qty) * gstAmount,
        'gst_percent': this.product_detail.gst,
        'net_price': (subTotal + gstAmount) * parseFloat(this.data.qty)
      });
    }
    this.total_qty = 0;
    this.net_price = 0;
    this.total_gst_amount = 0;
    this.order_discount = 0;
    this.total_Order_amount = 0;
    this.order_total = 0;
    for (let i = 0; i < this.add_list.length; i++) {
      this.total_qty = (parseInt(this.total_qty) + parseInt(this.add_list[i]['qty']));
      this.total_Order_amount = parseFloat(this.total_Order_amount) + (parseFloat(this.add_list[i]['price']) * this.add_list[i]['qty']);
      this.order_discount = parseFloat(this.add_list[i].discount_amount) + parseFloat(this.order_discount);
      this.order_total = parseFloat(this.order_total) + parseFloat(this.add_list[i]['amount']);
      this.total_gst_amount = parseFloat(this.add_list[i].gst_amount) + parseFloat(this.total_gst_amount);
      this.net_price = parseFloat(this.net_price) + parseFloat(this.add_list[i]['net_price']);
    }
    this.product_list = [];
    this.data.qty = '';
    this.data.product_id = '';
    this.data.item_tax_code = '';
    this.data.deliveryDate = '';
    this.data.leadTime = '';
    this.data.aqua_product_code = ''
    this.data.product_name = ''
    this.addToListButton = true;
  }



  checkValidation(i, sale_qty, qty, sale_dispatch_qty, index) {
    if (qty == 0) {

      if ((parseInt(qty)) > (parseInt(sale_qty))) {
        this.toast.errorToastr('Row number ' + index + ' dispatch QTY. can not be greater than QTY.');
        this.add_list[i]['qty'] = this.add_list[i]['sale_qty'];
        this.calc(i);
        return;
      }
      else {
        this.calc(i);
      }
    }
    if (qty > 0) {


      if (((parseInt(qty)) > parseInt(sale_qty) - parseInt(sale_dispatch_qty))) {
        let value = parseInt(sale_qty) - parseInt(sale_dispatch_qty)
        this.toast.errorToastr('Row number ' + index + ' dispatch QTY. can not be greater than remaining QTY. ' + value);
        this.add_list[i]['qty'] = this.add_list[i]['sale_dispatch_qty'] > 0 ? (parseInt(this.add_list[i]['sale_qty']) - parseInt(this.add_list[i]['sale_dispatch_qty'])) : this.add_list[i]['sale_qty'];
        this.calc(i);
        return;
      }
      else {
        this.calc(i);
      }
    }
  }


  calc(i) {
    this.add_list[i]['discount_amount'] = ((parseFloat(this.add_list[i]['price'] ? this.add_list[i]['price'] : 0) * parseFloat(this.add_list[i]['discount_percent'] ? this.add_list[i]['discount_percent'] : 0) / 100)) * parseFloat(this.add_list[i]['qty']);
    this.add_list[i]['amount'] = (parseFloat(this.add_list[i]['qty']) * parseFloat(this.add_list[i]['price'])) - parseFloat(this.add_list[i]['discount_amount'] ? this.add_list[i]['discount_amount'] : 0);
    this.add_list[i]['gst_amount'] = ((parseFloat(this.add_list[i]['amount']) * parseFloat(this.add_list[i]['gst_percent'])) / 100);
    this.add_list[i]['net_price'] = (parseFloat(this.add_list[i]['amount']) + (parseFloat(this.add_list[i]['gst_amount'] ? this.add_list[i]['gst_amount'] : 0)))
    this.total_qty = 0;
    this.net_price = 0;
    this.total_gst_amount = 0;
    this.order_discount = 0;
    this.total_Order_amount = 0;
    this.order_total = 0;
    for (let i = 0; i < this.add_list.length; i++) {
      this.total_qty = (parseInt(this.total_qty) + parseInt(this.add_list[i]['qty']));
      this.total_Order_amount = parseFloat(this.total_Order_amount) + (parseFloat(this.add_list[i]['price']) * this.add_list[i]['qty']);
      this.order_discount = parseFloat(this.add_list[i].discount_amount) + parseFloat(this.order_discount);
      this.order_total = parseFloat(this.order_total) + parseFloat(this.add_list[i]['amount']);
      this.total_gst_amount = parseFloat(this.add_list[i].gst_amount) + parseFloat(this.total_gst_amount);
      this.net_price = parseFloat(this.net_price) + parseFloat(this.add_list[i]['net_price']);
    }


  }


  getSegment() {
    this.loader = true
    this.service.post_rqst({}, "Order/segment")
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



  listdelete(i) {
    this.add_list.splice(i, 1);
    this.total_qty = 0;
    this.net_price = 0;
    this.total_gst_amount = 0;
    this.order_discount = 0;
    this.total_Order_amount = 0;
    this.order_total = 0;

    for (let i = 0; i < this.add_list.length; i++) {
      this.total_qty = (parseInt(this.total_qty) + parseInt(this.add_list[i]['qty']));
      this.total_Order_amount = parseFloat(this.total_Order_amount) + (parseFloat(this.add_list[i]['price']) * this.add_list[i]['qty']);
      this.order_discount = parseFloat(this.add_list[i].discount_amount) + parseFloat(this.order_discount);
      this.order_total = parseFloat(this.order_total) + parseFloat(this.add_list[i]['amount']);
      this.total_gst_amount = parseFloat(this.add_list[i].gst_amount) + parseFloat(this.total_gst_amount);
      this.net_price = parseFloat(this.net_price) + parseFloat(this.add_list[i]['net_price']);
    }

  }


  qtyFlag: boolean = false

  save_orderalert() {
    if (!this.data.assigned_to_distributor_name) {
      this.toast.errorToastr("Primary customer required");
      return
    }

    if (this.grand_total > 20000000) {
      this.dialog.error("Max order value reached, Maximum order value is 2 Cr. !")
    }
    else {
      let msg
      let type
      type = this.pageType
      if (this.orderId) {
        msg = "You want to update this  " + type + " ?"
      }
      else {
        msg = "You want to submit this  " + type + " ?"
      }
      this.dialog.confirm(msg).then((result) => {
        if (result) {
          this.save_order()
        }
      })

    }
  }
  save_order() {
    for (const iterator of this.add_list) {
      if(iterator.qty<1){
        this.toast.errorToastr('Qty should be greater than zero')
        return;
      }
    }
    
    this.savingFlag = true;
    this.data.total_Order_amount = this.total_Order_amount;
    this.data.order_discount = this.order_discount;
    this.data.gst_percent = this.product_detail.gst;
    this.data.total_gst_amount = this.total_gst_amount;
    this.data.net_price = this.net_price;
    this.data.product_code = this.data.product_code;
    this.data.orderId = this.orderId ? this.orderId : '';
    this.encryptedData = this.service.payLoad ? { "cart_data": this.add_list, "user_data": this.data, } : this.cryptoService.encryptData({ "cart_data": this.add_list, "user_data": this.data, });

    this.service.post_rqst(this.encryptedData, (this.orderId && this.pageType == 'order') ? 'Enquiry/primaryOrderAddItem' : (this.orderId && this.pageType == 'quotation') ? 'Enquiry/quotationAddItem' : this.pageType == 'order' ? 'Enquiry/primaryOrdersAdd' : 'Enquiry/quotationAdd').subscribe(result => {
      this.decryptedData = this.service.payLoad ? result : this.cryptoService.decryptData(JSON.stringify(result));

      if (this.decryptedData['statusCode'] == 200) {
        if (this.user_data.order_status == 'Draft') {
          this.dialog.success('', this.decryptedData['statusMsg'])
        }
        else {
          this.dialog.success('', this.decryptedData['statusMsg'])
        }
        this.router.navigate(['/site-order/' + this.pageType])

      } else {
        this.dialog.error(this.decryptedData['statusMsg']);

      }
    },
      error => {


      })



  }

  back(): void {
    this.location.back()
  }

  check_qty() {
    for (let i = 0; i < this.product_list.length; i++) {
      if (this.product_detail.category != 'CP BATH FITTINGS' && this.product_detail.category_id != '9') {
        if (this.product_detail.small_packing_size != '') {
          if (parseInt(this.product_list[i].qty) % parseInt(this.product_detail.small_packing_size) == 0) {
            this.check_qty_flag = false
          }
          else {
            this.check_qty_flag = true;
            if (this.product_list[i].qty != '') {
              this.toast.errorToastr('Qty should be in multiple of small packing - ' + this.product_detail.small_packing_size)
              return;
            }
          }
        }
        else {
          this.check_qty_flag = false
        }
      }
      else {
        this.check_qty_flag = false;

      }
    }
    return this.check_qty_flag;
  }


  orderDetail() {
    this.loader = true;
    this.add_list = [];
    let id = { 'id': this.pageType == 'order' ? this.data.quotation_id : this.orderId }
    this.encryptedData = this.service.payLoad ? id : this.cryptoService.encryptData(id);

    setTimeout(() => {
      this.service.post_rqst(this.encryptedData, (this.pageType != 'order' || this.data.quotation_id) ? "Enquiry/quotationDetail" : "Enquiry/primaryOrderDetail").subscribe((result => {
        this.decryptedData = this.service.payLoad ? result : this.cryptoService.decryptData(JSON.stringify(result));

        if (this.decryptedData['statusCode'] == 200) {
          this.loader = false;
          this.orderDetailData = this.decryptedData['result'];

          if (this.pageType == 'order') {
            this.data.quotation_id = this.decryptedData['result']['id'].toString();
          }

          this.data.assigned_to_dealer_name = this.decryptedData['result']['dealer_name'];
          this.data.assigned_to_distributor_name = this.decryptedData['result']['distributor_name'];
          this.data.site_id = this.decryptedData['result']['site_id'].toString();
          this.total_qty = this.decryptedData['result']['total_order_qty']
          this.total_Order_amount = this.decryptedData['result']['total_order_amount']
          this.order_discount = this.decryptedData['result']['order_discount']
          this.order_total = this.decryptedData['result']['order_total']
          this.total_gst_amount = this.decryptedData['result']['order_gst']
          this.net_price = this.decryptedData['result']['order_grand_total']
          this.data.dealer_id = this.decryptedData['result']['dealer_id']
          this.data.dr_id = this.decryptedData['result']['dr_id'];
          this.data.assigned_to_distributor_name = this.decryptedData['result']['distributor_name'];
          this.data.assigned_to_dealer_name = this.decryptedData['result']['dealer_name'];
          this.data.site_name = this.decryptedData['result']['ownerName'];
          this.data.site_mobile = this.decryptedData['result']['ownerMobile'];;
          this.data.billing_address = this.decryptedData['result']['billing_address'];
          this.data.shipping_address = this.decryptedData['result']['shipping_address'];
          this.data.order_no = this.decryptedData['result']['order_no'];
          this.data.order_status = this.decryptedData['result']['order_status'];
          let item = []

          item = this.decryptedData['result']['item_info'];
          for (let index = 0; index < item.length; index++) {
            this.add_list.push({
              'id': item[index].id,
              'order_id': item[index].order_id,
              'product_name': item[index].product_name,
              'segment_id': item[index].segment_id,
              'product_id': item[index].product_id,
              'segment_name': item[index].segment_name,
              'product_code': item[index].product_code,
              'aqua_product_code': item[index].aqua_product_code,
              'sale_dispatch_qty': item[index].sale_dispatch_qty ? item[index].sale_dispatch_qty : 0,
              'sale_qty': item[index].sale_qty ? item[index].sale_qty : 0,
              'qty': item[index].qty ? item[index].qty : 0,
              'discount_percent': item[index].discount_percent ? item[index].discount_percent : 0,
              'discount_amount': item[index].discount_amount ? item[index].discount_amount : 0,
              'price': item[index].price ? item[index].price : 0,
              'amount': item[index].amount ? item[index].amount : 0,
              'gst_amount': item[index].gst_amount ? item[index].gst_amount : 0,
              'gst_percent': item[index].gst_percent ? item[index].gst_percent : 0,
              'net_price': item[index].net_price ? item[index].net_price : 0
            });
            if (this.pageType == 'order') {
              this.checkValidation(index, this.add_list[index]['sale_qty'], this.add_list[index]['qty'], this.add_list[index]['sale_dispatch_qty'], index + 1)
            }
          }

          if (this.data.site_id) {
            this.getSites('');
            this.getSegment();
          }
        } else {
          this.loader = false;
          this.toast.errorToastr(this.decryptedData['statusMsg'])
        }
      }))
    }, 700);
  }

}



