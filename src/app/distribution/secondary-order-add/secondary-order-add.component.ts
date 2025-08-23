import { Component, OnInit } from '@angular/core';
import { DatabaseService } from 'src/_services/DatabaseService';
import { ToastrManager } from 'ng6-toastr-notifications';
import { ActivatedRoute, Router } from '@angular/router';
import { DialogComponent } from 'src/app/dialog.component';
import { sessionStorage } from 'src/app/localstorage.service';




@Component({
  selector: 'app-secondary-order-add',
  templateUrl: './secondary-order-add.component.html',
  styleUrls: ['./secondary-order-add.component.scss']
})
export class SecondaryOrderAddComponent implements OnInit {
  loader: boolean = false;
  savingFlag: boolean = false;
  data: any = {}
  items: any = []
  dealerList: any = []
  dr_id: any;
  colorList: any = []
  brandList: any = []
  product_data = []
  product_detail: any = {}
  dr_detail: any = {}
  condition: any = {}
  Dist_state = ''
  product_resp: boolean;
  setPrice: any;
  gst: any;
  add_list = []
  user_data: any = {};
  order_total: any = 0;
  order_discount: any = 0;
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
  total_Order_amount: any = ''
  new_grand_total: any = 0;
  SpecialDiscountLable: any = ''
  contenteditable: boolean = true;
  editprice: boolean = true;
  nexturl: any;
  login_data: any = {};
  addToListButton: boolean = true;
  deactive: boolean = false;
  selectedBrand: any = '';





  constructor(public serve: DatabaseService, public toast: ToastrManager, public route: ActivatedRoute, public dialog: DialogComponent, private router: Router, public session: sessionStorage,) {
    this.login_data = this.session.getSession();
    this.login_data = this.login_data.value;
    this.login_data = this.login_data.data;
  }
  ngOnInit() {
    this.route.params.subscribe(params => {
      this.dr_id = params.id;
      this.data.gst_type = 'Gst Paid';
      this.data.dr_disc = 0
      this.distributorDetail()
      this.get_dealerList();
    })
  }

  distributorDetail() {

    this.loader = true
    let id = { "id": this.dr_id }
    this.serve.post_rqst(id, "CustomerNetwork/distributorDetail").subscribe((result) => {
      if (result['statusCode'] == 200) {
        this.loader = false
        this.dr_detail = result['distributor_detail'];
        this.getItemList('', this.dr_detail.brand)
      } else {
        this.loader = true
        this.toast.errorToastr(result['statusMsg'])
      }

    })
  }

  get_dealerList() {
    this.loader = true

    this.serve.post_rqst({ 'dr_id': this.dr_id, 'dr_type': 3 }, "Order/assignedDealer").subscribe(resp => {
      if (resp['statusCode'] == 200) {
        this.loader = false
        this.dealerList = resp['result'];
      } else {
        this.toast.errorToastr(resp['statusMsg'])
        this.loader = false
      }
    })
  }
  getItemList(search, brand) {
    this.serve.post_rqst({ 'data': { 'dr_id': this.dr_id, 'brand': brand, 'order_type': 'secondary', 'fixed_brand': this.selectedBrand != '' ? [this.selectedBrand] : [] }, 'filter': { 'search': search } }, "Order/segmentItems")
      .subscribe(resp => {

        if (resp['statusCode'] == 200) {
          this.loader = false
          this.items = resp['result'];


        } else {
          this.toast.errorToastr(resp['statusMsg'])
          this.loader = false
        }
      })

  }

  get_product_details(id) {
    this.data.brand = '';
    this.data.color = '';
    this.loader = true
    this.serve.post_rqst({ 'product_id': id, 'type': 'order', 'order_type': 'secondary', 'brand': this.dr_detail.brand, 'fixed_brand': this.selectedBrand != '' ? [this.selectedBrand] : [] }, "Order/segmentItemsDetails")
      .subscribe(resp => {

        if (resp['statusCode'] == 200) {
          this.loader = false
          this.product_detail = resp['result'];
          this.brandList = this.product_detail['brand'];
          this.colorList = this.product_detail['color'];
          if (this.brandList.length == 1) {
            this.data.brand = this.brandList[0];
          }
          if (this.colorList.length == 1) {
            this.data.color = this.colorList[0];
          }

        } else {
          this.toast.errorToastr(resp['statusMsg'])
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

  get_product_Size(dr_id, product_id, type, discountValue) {
    let Index = this.items.findIndex(row => row.id == this.data.product_id.id);
    if (Index != -1) {
      this.data.product_name = this.items[Index].product_name
      this.data.feature_apply = this.items[Index].feature_apply
      this.data.product_code = this.items[Index].product_code
    }
    let header
    if (type == 'listInput') {
      header = { 'state_name': this.Dist_state, 'order_type': 'secondary', 'dr_id': this.data.dealer_name, 'input_discount': this.data.dr_disc, 'product_id': this.data.product_id, 'gst_type': this.data.gst_type, 'gst_percent': this.data.product_gst, 'category_id': this.product_detail.category_id, }
    }
    if (type == 'addPrice') {
      header = {
        'state_name': this.Dist_state, 'order_type': 'secondary', 'dr_id': this.data.dealer_name, 'input_discount': 0,
        'input_price': discountValue, 'product_id': this.data.product_id, 'gst_type': this.data.gst_type, 'gst_percent': this.data.product_gst, 'category_id': this.product_detail.category_id,
      }
    }
    if (type == 'addDiscount') {
      header = {
        'state_name': this.Dist_state, 'order_type': 'secondary', 'input_discount': discountValue, 'dr_id': this.data.dealer_name,
        'input_price': this.data.product_price, 'product_id': this.data.product_id, 'gst_type': this.data.gst_type, 'gst_percent': this.data.product_gst, 'category_id': this.product_detail.category_id,
      }
    }
    this.serve.post_rqst(header, "Order/segmentItemPriceWithoutFeatures")
      .subscribe(resp => {
        if (resp['statusCode'] == 200) {

          this.product_data = resp['result'];


          if (this.product_data.length > 0) {
            for (let i = 0; i < this.product_data.length; i++) {
              this.product_data[i].edit_true = false;
            }
          }

          if (this.product_data.length < 1) {
            this.data.product_id = '';
            this.data.brand = '';
            this.data.color = '';
            this.toast.errorToastr(resp['statusMsg']);
          }
          this.addToListButton = true;
        }
        else {
          this.toast.errorToastr(resp['statusMsg'])
        }
      })
  }
  changePrice(dr_id, product_id, type, set_price, product_price) {
    this.setPrice = set_price;
    this.data.product_price = Math.abs(product_price);
    if (set_price < this.data.product_price) {
      this.get_product_Size(dr_id, product_id, type, product_price);
      this.deactive = true;

      this.editprice = true;

    }
    else {
      this.toast.errorToastr('Price cannot be less than Net Price ₹' + set_price);

      this.editprice = false

    }
  }

  changeDiscount(dr_id, product_id, type, discountValue,) {
    if (discountValue == 0) {
      discountValue = ''
    }

    this.data.dr_disc = Math.abs(discountValue);
    if (this.data.dr_disc > 0) {
      this.get_product_Size(dr_id, product_id, type, discountValue);

    } else {
      this.toast.errorToastr("Please Update Discount Above Greater Than 0");
      this.contenteditable = false
    }

  }

  editDiscount() {
    this.contenteditable = false
  }
  editPrice() {
    this.editprice = false
    // this.data.product_price=''
  }
  addToList(set_price) {
    if (!this.add_list.length) {
      this.selectedBrand = this.data.brand;
    }
    for (let i = 0; i < this.product_data.length; i++) {
      if (this.product_data[i]['sec_net_price'] > parseInt(this.product_data[i]['product_price'])) {
        this.toast.errorToastr('Price cannot be less than Net Price ₹' + set_price);
        this.editprice = true
        return;

      }

      if (this.product_data[i]['qty'] && this.product_data[i]['product_price']) {
        let existIndex = this.add_list.findIndex(row => (row.product_id == this.product_data[i]['product_id'] && row.brand == this.data.brand && row.color == this.data.color));
        if (existIndex != -1) {
          this.add_list.splice(existIndex, 1)
        }
        this.product_data[i]['product_name'] = this.product_detail.product_name;
        this.product_data[i]['product_code'] = this.product_detail.product_code;
        this.product_data[i]['segment_id'] = this.product_detail.category_id;
        this.product_data[i]['segment_name'] = this.product_detail.category;
        this.product_data[i]['amount'] = parseFloat(this.product_data[i]['qty']) * parseFloat(this.product_data[i]['net_price']);
        this.product_data[i]['color'] = this.data.color;
        this.product_data[i]['brand'] = this.data.brand;
        this.product_data[i]['discount_amount'] = parseFloat(this.product_data[i]['discounted_price']) * parseFloat(this.product_data[i]['qty']);
        this.product_data[i]['discounted_price'] = parseFloat(this.product_data[i]['discounted_price']);
        // this.add_list.push(this.product_data[i]);


        if (this.data.gst_type == 'Gst Paid') {
          this.product_data[i]['gst_amount'] = parseFloat(this.product_data[i]['amount']) - ((((this.product_data[i]['amount'] * 100))) / (parseFloat(this.product_data[i]['gst_percent'] + 100)));
          this.product_data[i]['gst_percent'] = this.product_data[i]['gst_percent'];
          this.product_data[i]['total_amount'] = (this.product_data[i]['amount']);
          this.product_data[i]['dr_disc'] = this.product_data[i]['dr_disc'];
          this.add_list.push(this.product_data[i]);
        }
        if (this.data.gst_type == 'Gst Extra') {
          this.product_data[i]['gst_amount'] = (((this.product_data[i]['amount']) * (this.product_data[i]['gst_percent'])) / 100);
          this.product_data[i]['gst_percent'] = this.product_data[i]['gst_percent'];
          this.product_data[i]['total_amount'] = parseFloat(this.product_data[i]['gst_amount']) + (this.product_data[i]['amount']);
          this.product_data[i]['dr_disc'] = this.product_data[i]['dr_disc'];
          this.add_list.push(this.product_data[i]);
        }
      }
      //  this.data.product_id=''

    }

    this.total_qty = 0;
    this.netamount = 0;
    this.order_total = 0;
    this.total_gst_amount = 0;
    this.total_Order_amount = 0;
    this.order_discount = 0;


    for (let i = 0; i < this.add_list.length; i++) {
      this.total_qty += parseInt(this.add_list[i]['qty']);
      this.total_gst_amount = parseFloat(this.add_list[i].gst_amount) + parseFloat(this.total_gst_amount);
      this.total_Order_amount = parseFloat(this.total_Order_amount) + (parseFloat(this.add_list[i]['product_price']) * this.add_list[i]['qty']);
      this.netamount = parseFloat(this.netamount) + parseInt(this.add_list[i]['qty']) * parseFloat(this.add_list[i]['net_price']);
      this.order_discount += parseFloat(this.add_list[i].discounted_price) * parseInt(this.add_list[i]['qty']);
      this.order_total = parseFloat(this.order_total) + parseFloat(this.add_list[i]['amount']);
    }
    this.total_gst_amount = parseFloat(this.total_gst_amount);
    this.total_gst_amount = this.total_gst_amount;
    this.total_Order_amount = this.total_Order_amount;
    this.order_total = this.order_total;
    this.order_discount = this.order_discount;
    if (this.data.gst_type == 'Gst Extra') {
      this.new_grand_total = parseFloat(this.netamount) + parseFloat(this.total_gst_amount);
    } else {
      this.new_grand_total = parseFloat(this.netamount)

    }
    this.data.brand = '';
    this.data.color = '';
    this.product_data = [];
    this.data.product_id = {};
    this.addToListButton = true;


    this.editprice = true;
    this.contenteditable = true;


  }
  listdelete(i) {
    this.add_list.splice(i, 1);
    this.total_qty = 0;
    this.netamount = 0;
    this.total_gst_amount = 0;
    this.order_total = 0;
    this.order_discount = 0;
    this.new_grand_total = 0;
    this.total_Order_amount = 0;
    for (let i = 0; i < this.add_list.length; i++) {
      this.total_qty = parseInt(this.total_qty) + parseInt(this.add_list[i]['qty']);
      this.netamount = parseFloat(this.netamount) + parseInt(this.add_list[i]['qty']) * parseFloat(this.add_list[i]['net_price']);
      this.total_Order_amount = parseFloat(this.total_Order_amount) + parseInt(this.add_list[i]['qty']) * parseFloat(this.add_list[i]['product_price']);
      this.order_discount += parseFloat(this.add_list[i].discounted_price) * parseInt(this.add_list[i]['qty']);
      this.total_gst_amount = this.add_list[i].gst_amount + this.total_gst_amount;
      this.order_total += parseFloat(this.add_list[i]['amount']);

    }
    if (this.data.gst_type == 'Gst Extra') {
      this.new_grand_total = parseFloat(this.netamount) + parseFloat(this.total_gst_amount);
    } else {
      this.new_grand_total = parseFloat(this.netamount)

    }
    this.total_qty = parseInt(this.total_qty);
    this.netamount = parseFloat(this.netamount);
    this.total_gst_amount = this.total_gst_amount;
    this.total_Order_amount = this.total_Order_amount;
    if (this.add_list.length == 0) {
      this.selectedBrand = '';
    }
  }
  resetChannel() {
    this.data.product_id = '';
    this.product_data = [];
    this.add_list = [];
    this.brandList = [];
    this.colorList = [];
  }


  save_order() {
    this.user_data.order_discount = this.order_discount;
    this.user_data.dr_id = this.data.dealer_name
    this.user_data.distributor_id = this.dr_id
    this.user_data.gst_type = this.data.gst_type;
    this.user_data.remark = this.data.remark;

    this.user_data.SpecialDiscountLable = this.SpecialDiscountLable


    this.serve.post_rqst({ "cart_data": this.add_list, "user_data": this.user_data, }, "Order/secondaryOrdersAdd").subscribe(resp => {
      if (resp['statusCode'] == 200) {
        this.dialog.success('', resp['statusMsg'])
        this.nexturl = this.route.snapshot.queryParams['returnUrl'] || '/distribution-list/1/Channel%20Partner/distribution-detail/' + this.login_data['id'] + '/' + 'Secondary Order';
        this.router.navigate([this.nexturl]);

      } else {
        this.dialog.error(resp['statusMsg']);

      }
    },
      error => {

      })

  }
  back() {
    this.nexturl = this.route.snapshot.queryParams['returnUrl'] || '/distribution-list/1/Channel%20Partner/distribution-detail/' + this.login_data['id'] + '/' + 'Secondary Order';
    this.router.navigate([this.nexturl]);

  }


}
