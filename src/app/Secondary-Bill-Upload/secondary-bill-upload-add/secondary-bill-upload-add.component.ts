import { Component, OnInit } from '@angular/core';
import { slideToTop } from '../../router-animation/router-animation.component';
import { DatabaseService } from 'src/_services/DatabaseService';
import { ActivatedRoute } from '@angular/router';
import { DialogComponent } from '../../dialog.component';
import { Router } from '@angular/router';
// import { $ } from 'protractor';
import * as $ from 'jquery';
import * as moment from 'moment';
import { sessionStorage } from 'src/app/localstorage.service';
import { Toastr, ToastrManager } from 'ng6-toastr-notifications';
// import { QuillEditorComponent } from 'ngx-quill/src/quill-editor.component';

@Component({
  selector: 'app-secondary-bill-upload-add',
  templateUrl: './secondary-bill-upload-add.component.html',
  styleUrls: ['./secondary-bill-upload-add.component.scss']
})
export class SecondaryBillUploadAddComponent implements OnInit {

  login_data: any = {};
  loader: boolean = false;
  data: any = {};
  retailerList: any = [];
  add_list: any = [];
  drList: any = [];
  today_date: Date;
  image = new FormData();
  image_id: any;
  errorMsg: boolean;
  selected_image: any = [];
  updated_image: any = [];
  productList: any = [];
  savingFlag: boolean = false;

  constructor(public serve: DatabaseService, public route: ActivatedRoute, public toast: ToastrManager, public dialog: DialogComponent, private router: Router, public session: sessionStorage,) { 
    this.login_data = this.session.getSession();
    this.login_data = this.login_data.value;
    this.login_data = this.login_data.data;
    this.today_date = new Date();
    this.getRetailers('');

  }

  ngOnInit() {
  }

  back() {
    window.history.back();
  }

  getRetailers(masterSearch){
    this.loader = true
    this.serve.post_rqst({'master_search': masterSearch}, "Order/fetchRetailer").subscribe((result) => {
      if (result['statusCode'] == 200) {
        this.loader = false
        this.retailerList = result['result'];
      } else {
        this.loader = true
        this.toast.errorToastr(result['statusMsg'])
      }
    }, err => {
      this.loader = false;

    })
  }

  deleteProductImage(arrayIndex){
    this.selected_image.splice(arrayIndex, 1);
  }

  getAssignedDistributors(drId){
    this.loader = true
    this.serve.post_rqst({'dealer_id': drId}, "Order/assignDistributor").subscribe((result) => {
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

  getProductList(masterSearch, dr_id){
    this.loader = true
    this.serve.post_rqst({'master_search': masterSearch, 'dr_id': dr_id}, "Order/fetchProduct").subscribe((result) => {
      if (result['statusCode'] == 200) {
        this.loader = false
        this.productList = result['result'];
      } else {
        this.loader = true
        this.toast.errorToastr(result['statusMsg'])
      }
    }, err => {
      this.loader = false;

    })
  }

  addToList() {
    let idx = this.productList.findIndex((row)=> row.id == this.data.product_id);
    this.data.product = this.productList[idx];
    let newData
    newData = this.data;
    if (this.add_list.length == 0) {
      console.log('1');
      
      this.add_list.push({'product':newData.product, 'qty':newData.qty, 'price':newData.price, 'amount': newData.qty*newData.price});
      
      console.log(newData, 'newData');
      console.log(this.add_list, 'newData');
    }
    else
    {
      let existIndex = this.add_list.findIndex(row => (row.product.id == this.data['product']['id']));
      console.log(existIndex);
      
      if (existIndex != -1) {
        // console.log('1');
        // this.service.errorToast('Already same product added to items')
        console.log( typeof newData.qty);
        
        this.add_list[existIndex].qty=parseInt(this.add_list[existIndex].qty)+parseInt(newData.qty);
        this.add_list[existIndex].amount= this.add_list[existIndex].qty * this.add_list[existIndex].price;
      }
      else
      {
        console.log('1');
        this.add_list.push({'product':newData.product, 'qty':newData.qty, 'price':newData.price, 'amount': newData.qty*newData.price});
      }
      
    }
    this.data.bill_amount=0
    for(let i=0; i<this.add_list.length; i++){
      this.data.bill_amount+= this.add_list[i].amount;
    }
    this.data.product = '';
    this.data.product_id = '';
    this.data.qty = '';
    this.data.price = '';
    this.data.scanType = '';
  }

  listdelete(i) {
    this.add_list.splice(i, 1);
    this.data.bill_amount=0
    for(let i=0; i<this.add_list.length; i++){
      this.data.bill_amount+= this.add_list[i].amount;
    }
  }  

  onUploadChange(data: any) {
    this.errorMsg = false;
    this.image_id = '';
    for (let i = 0; i < data.target.files.length; i++) {
        let files = data.target.files[i];
        if (files) {
            let reader = new FileReader();
            reader.onload = (e: any) => {
                this.selected_image.push({ "image": e.target.result });
                this.updated_image.push({ "image": e.target.result });
            }
            reader.readAsDataURL(files);
        }
        this.image.append("" + i, data.target.files[i], data.target.files[i].name);
    }
}

submitDetail(){

  this.data.bill_date = moment(this.data.bill_date).format('YYYY-MM-DD') 
  this.data.add_list = this.add_list;
  this.data.image = this.selected_image;
  if(!this.selected_image.length)
    {
      this.toast.errorToastr('Bill image is required')
      return;
    }
    this.savingFlag = true;
  this.serve.post_rqst({'data': this.data}, "Order/secondaryOrdersBillUpload").subscribe((result) => {
    if (result['statusCode'] == 200) {
      this.savingFlag = false;
      this.router.navigate(['/secondary-bill-upload-list']);

    } else {
      this.savingFlag = true
      this.toast.errorToastr(result['statusMsg'])
    }
  }, err => {
    this.savingFlag = false;

  })
}

}
