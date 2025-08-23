import { Component, OnInit, Renderer2 } from '@angular/core';
import { slideToTop } from '../../router-animation/router-animation.component';
import { DatabaseService } from 'src/_services/DatabaseService';
import { ActivatedRoute, Router } from '@angular/router';
import { DialogComponent } from '../../dialog.component';
import { MatDialog } from '@angular/material';
import { Location } from '@angular/common'
import { ToastrManager } from 'ng6-toastr-notifications';
import { CryptoService } from 'src/_services/CryptoService';
import { uploadImgService } from 'src/_services/uploadImg';



@Component({
  selector: 'app-add-product',
  templateUrl: './add-product.component.html',
  animations: [slideToTop()]
})
export class AddProductComponent implements OnInit {
  savingFlag: boolean = false;
  segmentList: any = [];
  SubcategoryList: any = [];
  category_list: any = [];
  data: any = {};
  value: any = [];
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
  pointCategories_data: any = [];
  logined_user_data:any ={};
  productFeature :any =[];
  formData:any =[];
  dependentformData:any =[];
  fomDataloader: boolean = false;
  fomDeploader: boolean = false;
  
  constructor(
    private renderer: Renderer2,
    public location: Location,
    public cryptoService:CryptoService,
    public service: DatabaseService,
    public rout: Router,
    public toast: ToastrManager,
    private route: ActivatedRoute,
    public dialog: DialogComponent,
    public uploadDoc:uploadImgService,
    public dialog2: MatDialog) {
      
      this.url = this.service.uploadUrl + 'product_image/';
      this.getSegment();
      this.pointCategory_data('');
      this.userData = JSON.parse(localStorage.getItem('st_user'));
      this.userId = this.userData['data']['id'];
      this.userName = this.userData['data']['name'];
      
      this.logined_user_data = this.userData['data'];
    }
    
    ngOnInit() {
      this.data.feature = 'No';
      this.data.product_scan = 'Yes';
      this.route.params.subscribe(params => {
        let id = params.id.replace(/_/g, '/');
        this.product_id = this.cryptoService.decryptId(id);
        this.image_id = this.cryptoService.decryptId(id);
        if (id) {
          this.loader = true;
          this.getProductDetail();
          
        }
        if (!this.product_id) {
          this.data.boxWOItem = '0';
        }
      });
      
      if(!this.data.id){
        this.getFormData();
      }
      
    }
    getSegment() {
      this.service.post_rqst({}, "Master/getProductCategoryList").subscribe((result => {
        if (result['statusCode'] == 200) {
          this.segmentList =  result['segment_list'];
        }
        else{
          this.toast.errorToastr(result['statusMsg'])
        }
      }))
    }
    getSubCatgory(id) {
      this.service.post_rqst({ 'id': id }, "Master/subCategoryList").subscribe((result => {
        
        if (result['statusCode'] == 200) {
          this.SubcategoryList = result['result'];
        }
        else{
          this.toast.errorToastr(result['statusMsg'])
        }
      }))
    }
    
    
    
    
    deleteProductDetail(arrayIndex) {
      this.productFeature.splice(arrayIndex, 1);
    }
    
    
    addToList() {
      
      if(!this.data.feature_name){
        this.toast.errorToastr('Feature required');
        return
      }
      if(!this.data.feature_mrp){
        this.toast.errorToastr('Mrp required');
        return
      }
      
      
      if (this.productFeature.length > 0) {
        let existIndex
        existIndex = this.productFeature.findIndex(row => row.feature_name === this.data.feature_name);
        if (existIndex != -1) {
          this.productFeature.splice(existIndex, 1)
          this.productFeature.push({
            'feature_name': this.data.feature_name,
            'mrp': this.data.feature_mrp,
            
          });
        }
        else {
          this.productFeature.push({
            'feature_name': this.data.feature_name,
            'mrp': this.data.feature_mrp,
            
          });
        }
      }
      else {
        this.productFeature.push({
          'feature_name': this.data.feature_name,
          'mrp': this.data.feature_mrp,
        });
      }
      this.data.feature_name ='';
      this.data.feature_mrp ='';
    }
    
    
    
    getFormData() {
      this.fomDataloader = true;
      this.service.post_rqst({}, "FormBuilder/fetchProductFormBuilderFields").subscribe((result => {
        
        if (result['statusCode'] == 200) {
          this.fomDataloader = false;
          this.formData = result['data'];
        } else {
          this.fomDataloader = false;
          this.toast.errorToastr(result['statusMsg']);
        }
      }));
    }
    
    dependentFeilds(name, value){
      this.dependentformData = [];
      this.fomDeploader = true;
      this.service.post_rqst({'field_name':name, 'value': value }, "FormBuilder/fetchProductDependentFields").subscribe((result => {
        if (result['statusCode'] == 200) {
          this.fomDeploader = false;
          this.dependentformData = result['data'];
        } else {
          this.fomDeploader = false;
          this.toast.errorToastr(result['statusMsg']);
        }
      }));
    }
    
    
    
    getProductDetail() {
      this.getSegment();
      this.service.post_rqst({ 'product_id': this.product_id }, "Master/productDetail").subscribe((result => {
        if (result['statusCode'] == 200) {
          if (result.product_detail.master_packing_size == 0) {
            this.data.master_packing_size = '';
          }
          
          if (result.product_detail.small_packing_size == 0) {
            this.data.small_packing_size = '';
          }
          if (result.product_detail.mrp == 0) {
            this.data.mrp = '';
          }
          this.data = result.product_detail;
          this.data.segment_id = result.product_detail.category_id.toString();
          this.data.warranty_period = result.product_detail.warranty_period.toString();
          this.data.point_category_id = result.product_detail.point_category_id.toString();
          this.data.sub_segment_id = result.product_detail.sub_category_id.toString();
          this.data.boxWOItem = result.product_detail.boxWOItem.toString();
          this.formData = result['product_detail']['form_builder'];
          this.dependentformData = result['product_detail']['form_builder_dependent'];
          if (result.product_detail.category_id) {
            this.getSubCatgory(this.data.segment_id)
          }
          if (this.data.feature == 'Yes') {
            this.productFeature = this.data.feature_data;
          }
          this.selected_image = result.product_detail.img;
          this.loader = false;
        }
        else {
          this.toast.errorToastr(result['statusMsg']);
        }
        
        
      }
    ));
  }
  findId(id) {
    let index = this.pointCategories_data.findIndex(row => row.id == id);
    
    if (index != -1) {
      this.data.point_category_id = this.pointCategories_data[index].id;
      this.data.point_category_name = this.pointCategories_data[index].point_category_name;
    }
    
  }
  filter: any = {};
  pointCategory_data(searcValue) {
    this.filter.point_type = 'Item Box';
    this.filter.point_category_name = searcValue;
    this.service.post_rqst({ 'filter': this.filter, }, 'Master/pointCategoryMasterList').subscribe((result) => {
      if (result['statusCode'] == 200) {
        this.pointCategories_data = result['point_category_list'];
      }
      else {
        this.toast.errorToastr(result['statusMsg'])
      }
    }, error => {
    })
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

// add image
onUploadChange(data: any) {
  this.errorMsg = false;
  this.image_id = '';
  for (let i = 0; i < data.target.files.length; i++) {
    const file = data.target.files[i];
    this.uploadDoc.processImageFile(file)
    .then(({ dataURL, cleanedFile }) => {
      if(file){
        this.selected_image.push({ image: dataURL });
        this.image.append("" + i, cleanedFile, cleanedFile.name);
      }
    })
    .catch(err => {
      this.toast.errorToastr(err);
    });
  }
  
}


submit() {
  if (this.data.feature == 'No') {
    this.productFeature = [];
  }
  else{
    this.data.feature_data =this.productFeature;
  }
  this.data.image = this.selected_image ? this.selected_image : [];
  
  let header
  if (this.data.feature == 'Yes' && this.productFeature.length === 0) {
    this.toast.errorToastr('Feature required');
    return
  }
  
  this.formData.forEach((item) => {
    if (item.dependent_flag === 1) {
      if (item.dependent_field_name === this.data.field_type && item.dependent_field_value === this.data.type_name) {
      } else {
        item.value = '';
      }
    }
  });
  this.data.form_builder = this.formData;
  this.data.form_builder_dependent = this.dependentformData;
  
  
  this.savingFlag = true;
  if (this.product_id) {
    this.data.last_updated_by_name = this.userName;
    this.data.last_updated_by = this.userId;
    header = this.service.post_rqst({ 'data': this.data }, "Master/updateProduct")
  }
  else {
    this.data.created_by_name = this.userName;
    this.data.created_by = this.userId;
    header = this.service.post_rqst({ 'data': this.data }, "Master/addProduct")
  }
  header.subscribe((result) => {
    
    if (result['statusCode'] == 200) {
      this.rout.navigate(['/product-list']);
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
