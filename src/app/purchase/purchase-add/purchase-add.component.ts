import { Component, OnInit, Renderer2 } from '@angular/core';
import { DatabaseService } from 'src/_services/DatabaseService';
import { ActivatedRoute, Router } from '@angular/router';
import { DialogComponent } from '../../dialog.component';
import { MatDialog } from '@angular/material';
import { Location } from '@angular/common'
import { ToastrManager } from 'ng6-toastr-notifications';
import { CryptoService } from 'src/_services/CryptoService';
import * as moment from 'moment';


@Component({
  selector: 'app-purchase-add',
  templateUrl: './purchase-add.component.html'
})
export class PurchaseAddComponent implements OnInit {
  savingFlag: boolean = false;
  data: any = {};
  loader: boolean = false;
  errorMsg: boolean = false;
  userData: any;
  userId: any;
  userName: any;
  image = new FormData();
  product_id: any;
  image_id: any;
  url: any;
  selected_image: any = [];
  logined_user_data:any ={};
  influenceList:any =[];
  productList:any =[];
  purchaseItem:any ={};
  item_list:any =[];
  today:any;
  billDoc:any =[]
  total_sqft:any =0;
  total_point_value:any =0;
  
  
  constructor(
    public location: Location,
    public cryptoService:CryptoService,
    public service: DatabaseService,
    public rout: Router,
    public toast: ToastrManager,
    private route: ActivatedRoute,
    public dialog: DialogComponent,
    public dialog2: MatDialog) {
      this.url = this.service.uploadUrl + 'product_image/';
      this.userData = JSON.parse(localStorage.getItem('st_user'));
      this.userId = this.userData['data']['id'];
      this.userName = this.userData['data']['name'];
      this.today = new Date();
      this.logined_user_data = this.userData['data'];
    }
    
    ngOnInit() {
      this.route.params.subscribe(params => {
        let id = params.id.replace(/_/g, '/');
        this.product_id = this.cryptoService.decryptId(id);
        this.image_id = this.cryptoService.decryptId(id);
        if (id) {
          this.loader = true;
        }
        
      });
    }
    
    
    getInfluencer(search) {
      this.service.post_rqst({ 'type': this.data.influencer_type_id, 'search':search }, "Purchase/getInfluencerDetail").subscribe((result => {
        if (result['statusCode'] == 200) {
          this.influenceList = result['result'];
        }
        else{
          this.toast.errorToastr(result['statusMsg'])
        }
      }))
    }
    
    getProduct(search) {
      this.service.post_rqst({'search':search }, "Purchase/productListing").subscribe((result => {
        if (result['statusCode'] == 200) {
          this.productList = result['products'];
        }
        else{
          this.toast.errorToastr(result['statusMsg'])
        }
      }))
    }
    
    findId(id) {
      let index = this.service.InfluenceArray.findIndex(row => row.id == id);
      if (index != -1) {
        this.data.influencer_type = this.service.InfluenceArray[index].module_name;
      }
    }
    findName(id) {
      let index = this.influenceList.findIndex(row => row.id == id);
      if (index != -1) {
        this.data.influencer_name = this.influenceList[index].name;
        this.data.influencer_mobile = this.influenceList[index].mobile_no;

      }
    }
    getProductDetails(id){
      let index = this.productList.findIndex(row => row.id == id);
      if (index != -1) {
        this.purchaseItem.product_name = this.productList[index].product_name;
        this.purchaseItem.product_code = this.productList[index].product_code;
        this.purchaseItem.point_value = this.productList[index].point ? this.productList[index].point : 0;
      }
    }
    
    onUploadChange(evt: any) {
      let files = evt.target.files;
      evt.preventDefault();
      if (files) {
        for (let file of files) {
          let fileType = file.type; 
          let fileSize = file.size;
          if (fileType === 'application/pdf' || fileType === 'image/png' || fileType === 'image/jpeg') {
            const byte = 1000000; // 1 MB in bytes
            if (fileSize > (byte * 2)) {
              this.toast.errorToastr('File size must not exceed 2 MB.');
              continue;
            }
            
            let reader = new FileReader();
            reader.onload = (e: any) => {
              if (this.billDoc.length > 4) {
                this.toast.errorToastr('You can upload only five bills');
                return;
              } else {
                this.billDoc.push({"image": e.target.result, 'type':file.type});
              }
            };
            reader.readAsDataURL(file);
          } else {
            this.toast.errorToastr('Only PDF, PNG, and JPG files are allowed.');
          }
        }
      }
    }
    
    
    remove(event: any, i: any) {
      event.preventDefault();
      this.billDoc.splice(i, 1);
    }
    
    
    
    
    
    addToList() {
      if (!this.purchaseItem.product) {
        this.toast.errorToastr('Select Product')
        return
      }
      if (!this.purchaseItem.sqft) {
        this.toast.errorToastr('Enter SQFT')
        return
      }
      if (parseInt(this.purchaseItem.sqft) === 0) {
        this.toast.errorToastr('Minimum qty 1 is required')
        return
      }
      
      if (this.item_list.length > 0) {
        let existIndex
        existIndex = this.item_list.findIndex(row => (row.product_code == this.purchaseItem.product_code));
        if (existIndex != -1) {
          this.item_list[existIndex]['sqft'] = parseFloat(this.item_list[existIndex]['sqft']) + parseFloat(this.purchaseItem.sqft)
          this.item_list[existIndex]['total_points'] = parseFloat(this.item_list[existIndex]['sqft']) * parseFloat(this.purchaseItem.point_value);
        }
        else {
          this.item_list.push({
            'product_name': this.purchaseItem.product_name,
            'product_code': this.purchaseItem.product_code,
            'per_sqft': this.purchaseItem.point_value,
            'sqft': this.purchaseItem.sqft,
            'total_points': parseFloat(this.purchaseItem.sqft) * parseFloat(this.purchaseItem.point_value),
          });
        }
      }
      else {
        this.item_list.push({
          'product_name': this.purchaseItem.product_name,
          'product_code': this.purchaseItem.product_code,
          'per_sqft': this.purchaseItem.point_value,
          'sqft': this.purchaseItem.sqft,
          'total_points': parseFloat(this.purchaseItem.sqft) * parseFloat(this.purchaseItem.point_value),
        });
      }
      
      this.total_sqft = 0;
      this.total_point_value = 0;
      for (let i = 0; i < this.item_list.length; i++) {
        this.total_sqft = (parseFloat(this.total_sqft) + parseFloat(this.item_list[i]['sqft']));
        this.total_point_value = parseFloat(this.total_point_value) + parseFloat(this.item_list[i]['total_points']);
      }
      this.purchaseItem.product_name = '';
      this.purchaseItem.product_code = '';
      this.purchaseItem.points = '';
      this.purchaseItem.product = '';
      this.purchaseItem.sqft = '';
      this.purchaseItem.point_value = '';
    }
    
    listdelete(i) {
      this.item_list.splice(i, 1);
      this.total_sqft = 0;
      this.total_point_value = 0;
      for (let i = 0; i < this.item_list.length; i++) {
        this.total_sqft = (parseInt(this.total_sqft) + parseInt(this.item_list[i]['sqft']));
        this.total_point_value = parseFloat(this.total_point_value) + parseFloat(this.item_list[i]['total_points']);
      }
    }
    
    deleteProductImage(arrayIndex, id, name) {
      
      if (id) {
        this.service.post_rqst({ 'image_id': id, 'image': name }, "Master/productImageDeleted").subscribe((result => {
          if (result['statusCode'] == '200') {
            this.toast.successToastr(result['statusMsg']);
            this.selected_image.splice(arrayIndex, 1);
            
          } else {
            this.toast.errorToastr(result['statusMsg']);
          }
        }
      ))
    }
    else {
      this.selected_image.splice(arrayIndex, 1);
    }
    // this.selected_image.splice(arrayIndex, 1);
    
    
  }
  
  
  submit(){
    this.dialog.confirm("You want to submit purchase !").then((result) => {
      if (result) {
        this.save();
      } else {
        this.toast.errorToastr("Cancelled")
      }
    })
  }
  
  save() {
    if (this.item_list.length === 0) {
      this.toast.errorToastr('Add at least one product');
      return;
    }
    if (this.data.invoice_date) {
      this.data.invoice_date = moment(this.data.invoice_date).format('YYYY-MM-DD');
      this.data.invoice_date = this.data.invoice_date;
    }
    this.data.billImage = this.billDoc ? this.billDoc :[];
    this.data.item_list = this.item_list;
    this.data.total_item = this.item_list.length;
    this.data.total_sqft = this.total_sqft;
    this.data.total_point_value = this.total_point_value;
    this.savingFlag = true;
    this.data.created_by_name = this.userName;
    this.data.created_by = this.userId;
    this.service.post_rqst({ 'data': this.data }, "Purchase/addPurchase").subscribe((result) => {
      if (result['statusCode'] == 200) {
        this.rout.navigate(['/purchase']);
        this.toast.successToastr(result['statusMsg']);
      }
      else {
        this.toast.errorToastr(result['statusMsg']);
        this.savingFlag = false;
      }
    }, err => {
      this.savingFlag = false;
    })
  }
  
  
  back(): void {
    this.location.back()
  }
}

