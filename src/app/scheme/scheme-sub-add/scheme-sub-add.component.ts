import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrManager } from 'ng6-toastr-notifications';
import { DatabaseService } from 'src/_services/DatabaseService';
import { DialogComponent } from 'src/app/dialog.component';
import * as moment from 'moment';
import { Location } from '@angular/common';


@Component({
  selector: 'app-scheme-sub-add',
  templateUrl: './scheme-sub-add.component.html',
  styleUrls: ['./scheme-sub-add.component.scss']
})
export class SchemeSubAddComponent implements OnInit {

  userData: any;
  userId: any;
  userName: any;
  data: any = {};
  slabItem: any = {};
  errorMsg: boolean;
  loader: any = false;
  selected_image: any = [];
  updated_image: any = [];
  image_id: any;
  image = new FormData();
  savingFlag: boolean = false;
  uploadingFlag: boolean = false;
  showErrorLine: boolean = false;
  today_date: Date;
  bonus_schemeList: any = []
  slabData: any = []
  upload_url: any;
  nav_data: any
  gift_id: any;
  savingListFlag: boolean = false;
  scheme_type: any;
  stateList: any = []
  districtList: any = []
  userList: any = [];
  categoryList: any = [];
  subCategoryList: any = [];
  productList: any = [];
  categoryName: any = [];
  subCategoryName: any = [];
  scheme_id: any;
  schemeDetails: any = [];
  date_from: any;
  editorConfig = {
    editable: true,
    spellcheck: false,
    height: '10rem',
    minHeight: '5rem',
    placeholder: '',
    translate: 'no',
    "toolbar": [
      ["bold", "italic", "underline", "strikeThrough", "superscript", "subscript"],
      ["fontName", "fontSize", "color"],
      ["justifyLeft", "justifyCenter", "justifyRight", "justifyFull", "indent", "outdent"],
      ["cut", "copy", "delete", "removeFormat", "undo", "redo"],
      ["paragraph", "blockquote", "removeBlockquote", "horizontalLine", "orderedList", "unorderedList"],

    ]
  };
  overlapError: any = false;
  type: any;
  point_type: any;
  gift_type: any;
  criteria_type: any;


  constructor(public service: DatabaseService, public location: Location, public navparams: ActivatedRoute, public router: Router, private route: ActivatedRoute, public toast: ToastrManager, public alert: DialogComponent) {
    this.nav_data = this.navparams['params']['_value']
    this.gift_id = this.nav_data.id;
    this.scheme_type = this.nav_data.type;
    this.upload_url = this.service.uploadUrl + 'schemeBanners/'
    this.userData = JSON.parse(localStorage.getItem('st_user'));
    this.userId = this.userData['data']['id'];
    this.userName = this.userData['data']['name'];
    this.today_date = new Date();
    this.data.area_selection = 'Area Wise Selection';
    this.data.scheme_type = 'Sales';
    this.route.params.subscribe((params) => {

      this.type = params.type;
      this.scheme_id = params.id;
    });
    this.point_type = this.navparams.queryParams['_value']['point_type'];
    this.gift_type = this.navparams.queryParams['_value']['gift_type'];
    this.criteria_type = this.navparams.queryParams['_value']['criteria_type'];
    this.getSchemeDetails();
  }

  ngOnInit() {
    this.getCategoryList('');
  }


  getSchemeDetails() {
    this.service.post_rqst({ 'scheme_id': this.scheme_id }, "Scheme/schemeDetails")
      .subscribe((result => {
        console.log(result);

        if (result['statusCode'] == 200) {
          this.schemeDetails = result['result'];
          console.log(this.schemeDetails);


          setTimeout(() => {
          }, 700);
        }
        else {
          this.toast.errorToastr(result['statusMsg']);
        }
      }))
  }



  MobileNumber(event: any) {
    const pattern = /[0-9\+\-\ ]/;
    let inputChar = String.fromCharCode(event.charCode);
    if (event.keyCode != 8 && !pattern.test(inputChar)) { event.preventDefault(); }

  }

  allSelect(type) {
    if (type == "allCategory") {
      setTimeout(() => {
        if (this.data.allCategory == true) {
          const array = [];
          for (let i = 0; i < this.categoryList.length; i++) {
            array.push(this.categoryList[i].id);
          }
          this.data.categoryData = array.map(String);
          console.log(this.data.categoryData);
          this.getCategoryName(this.data.categoryData);
          this.getSubCategoryList('', '');
        }
        else {
          this.data.categoryData = [];

          this.data.subCategoryData = [];
          this.subCategoryList = [];
          this.data.allSubCategory = false;

          this.data.product = [];
          this.productList = [];
          this.data.allProduct = false;
          console.log(this.data);
        }

      }, 50);
    }
    else if (type == "allSubCategory") {
      setTimeout(() => {
        if (this.data.allSubCategory == true) {
          const array = [];
          for (let i = 0; i < this.subCategoryList.length; i++) {
            array.push(this.subCategoryList[i].id);
          }
          this.data.subCategoryData = array.map(String);
          console.log(this.data.subCategoryData);
          this.getSubCategoryName(this.data.subCategoryData);
          this.getProductList('', '');
        }
        else {
          this.data.subCategoryData = [];

          this.data.product = [];
          this.productList = [];
          this.data.allProduct = false;
          console.log(this.data);
        }

      }, 50);
    }
    else if (type == "allProduct") {
      setTimeout(() => {
        if (this.data.allProduct == true) {
          const array = [];
          for (let i = 0; i < this.productList.length; i++) {
            array.push(this.productList[i].id);
          }
          this.data.product = array.map(String);
          console.log(this.data.product);
        }
        else {
          this.data.product = [];
          console.log(this.data);
        }

      }, 50);
    }
  }



  updateSelectAll(type){
    if (type == "allState") {
        if(this.data.stateData.length == this.stateList.length){
            this.data.allState = true;
        }
        else{
            this.data.allState = false;
        }
    }
    else if(type == "allDistrict"){
        if(this.data.districtData.length == this.districtList.length){
            this.data.allDistrict = true;
        }
        else{
            this.data.allDistrict = false;
        }
    }
    else if(type == "allUser"){
        if(this.data.userData.length == this.userList.length){
            this.data.allUser = true;
        }
        else{
            this.data.allUser = false;
        }
    }
    else if(type == "allCategory"){
        if(this.data.categoryData.length == this.categoryList.length){
            this.data.allCategory = true;
        }
        else{
            this.data.allCategory = false;
        }
    }
    else if(type == "allSubCategory"){
        if(this.data.subCategoryData.length == this.subCategoryList.length){
            this.data.allSubCategory = true;
        }
        else{
            this.data.allSubCategory = false;
        }
    }
    else if(type == "allProduct"){
        if(this.data.product.length == this.productList.length){
            this.data.allProduct = true;
        }
        else{
            this.data.allProduct = false;
        }
    }

}
  
  
  getCategoryList(search) {       
    this.service.post_rqst({'search' : search, 'scheme_id': this.scheme_id}, 'Scheme/fetchCategory').subscribe((resp) => {
      if (resp['statusCode'] == 200) {
        this.categoryList = resp['result']
        // if(this.scheme_id){
        //     this.updateCategory();
        // }
      }
      else {
        this.toast.errorToastr(resp['statusMsg']);
      }
    }, error => {
      this.toast.errorToastr(error);
    })
  }

  
  getSubCategoryList(search, call) {       
    this.service.post_rqst({'search' : search , 'categoryData' : this.data.categoryData, 'scheme_id': this.scheme_id}, 'Scheme/fetchSubCategory').subscribe((resp) => {
      if (resp['statusCode'] == 200) {
        this.subCategoryList = resp['result']
      }
      else {
        this.toast.errorToastr(resp['statusMsg']);
      }
    }, error => {
      this.toast.errorToastr(error);
    })
  }

  getProductList(search, update_type) {       
    this.service.post_rqst({'search' : search , 'categoryData' : this.data.categoryData , 'subCategoryData' : this.data.subCategoryData, 'scheme_id': this.scheme_id}, 'Scheme/fetchProduct').subscribe((resp) => {
      if (resp['statusCode'] == 200) {
        this.productList = resp['result'];
      }
      else {
        this.toast.errorToastr(resp['statusMsg']);
      }
    }, error => {
      this.toast.errorToastr(error);
    })
  }

  checkValidity() {
    if (this.slabItem.slab_start && this.slabItem.slab_end) {
      this.checkSlab(this.slabItem.slab_start, this.slabItem.slab_end);
      this.checkOverlap(this.slabItem.slab_start, this.slabItem.slab_end);
    }
  }

  checkOverlap(start, end) {
    this.overlapError = false;
    for (let i = 0; i < this.slabData.length; i++) {
      if (this.slabData[i].slab_type == this.slabItem.slab_type) {
        if ((start > this.slabData[i].slab_end) || (end < this.slabData[i].slab_start)) {
          this.overlapError = this.overlapError || false;
        }
        else {
          this.overlapError = true;
        }
      }
    }
  }

  checkSlab(slab_start, slab_end) {
    console.log(slab_end, '>', slab_start);

    if (slab_start >= slab_end) {
      console.log('In error');
      this.showErrorLine = true;
    }
    else {
      this.showErrorLine = false;
      console.log('outside');
    }
  }


  addToList() {
    if (this.showErrorLine == true) {
      this.toast.errorToastr('Slab end is always greater than slab start.');
      console.log('1');

      return
    }
    if (this.overlapError) {
      this.toast.errorToastr('Already exist with same slab type and range.');
      console.log('2');

      return
    }
    if (!this.slabItem.slab_start || !this.slabItem.slab_end) {
      this.toast.errorToastr('Fill all required fields.');
      console.log('3');

      return;
    }
    if (this.data.gift_type == 'Gift' && !this.slabItem.gift_detail) {
      this.toast.errorToastr('Fill all required fields.');
      console.log('4');

      return;
    }
    if (this.data.gift_type == 'Point' && this.data.point_type == 'Fixed' && !this.slabItem.per_point_value) {
      this.toast.errorToastr('Fill all required fields.');
      console.log('5');

      return;
    }
    // else if (this.slabItem.slab_start && this.slabItem.slab_end && (this.data.gift_type == 'Gift' ? this.slabItem.gift_detail)) {
    //    
    console.log('In Console');
    console.log(this.slabItem);
    this.slabData.push(this.slabItem);
    this.slabItem = {};
    console.log(this.slabData);
    // }
  }

  listdelete(i) {
    this.slabData.splice(i, 1);
  }

  getCategoryName(categoryData) {
    this.categoryName = [];
    console.log(categoryData);
    for (let i = 0; i < categoryData.length; i++) {
      let idx = this.categoryList.findIndex((row) => row.id == categoryData[i])

      if (idx != -1) {
        this.categoryName[i] = this.categoryList[idx].category;
      }
    }
  }

  getSubCategoryName(subCategoryData) {
    this.subCategoryName = [];
    for (let i = 0; i < subCategoryData.length; i++) {
      let idx = this.subCategoryList.findIndex((row) => row.id == subCategoryData[i])

      if (idx != -1) {
        // console.log('got here')
        this.subCategoryName[i] = this.subCategoryList[idx].sub_category_name;
      }
    }
  }

  submitDetail() {
    this.savingFlag = true;
    if (this.data.categoryData) {
      this.getCategoryName(this.data.categoryData);
    }
    if (this.data.subCategoryData) {
      this.getSubCategoryName(this.data.subCategoryData);
    }
    this.data.date_from ? (this.data.date_from = moment(this.data.date_from).format('YYYY-MM-DD')) : null;
    this.data.date_to ? (this.data.date_to = moment(this.data.date_to).format('YYYY-MM-DD')) : null;
    if (this.data.gift_type == 'Cash') {
      if (parseInt(this.data.range_end) <= parseInt(this.data.range_start)) {
        this.toast.errorToastr('The range end value should be greater than the range start value');
        return;
      }
    }
    this.data.categoryName = this.categoryName;
    this.data.subCategoryName = this.subCategoryName;
    if (this.data.gift_type == 'Gift') {
      if (this.selected_image == undefined) {
        this.toast.errorToastr('Please Upload Image');
        return;
      }
    }
    this.data.slabData = this.slabData;
    // this.data.created_by_name = this.userName;
    // this.data.created_by_id = this.userId;
    this.data.gift_img = this.selected_image;
    let header: any;

    header = this.service.post_rqst({ 'subSchemeData': this.data, 'schemeData': this.schemeDetails }, 'Scheme/submitSubScheme')
    header.subscribe((resp) => {
      if (resp['statusCode'] == 200) {
        this.toast.successToastr(resp['statusMsg']);
        this.savingFlag = false;
        this.router.navigate(['/scheme/' + this.type + '/scheme-detail/' + this.scheme_id + '/scheme-sub-list/' + this.scheme_id]);
        this.service.count_list();

      }
      else {
        this.toast.errorToastr(resp['statusMsg']);
        this.savingFlag = false;
      }

    }, error => {
      this.toast.errorToastr(error);
    })
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

  deleteBannerImage(arrayIndex) {

    // if (id) {
    //   this.service.post_rqst({ 'image_id': id, 'image': name }, "Master/productImageDeleted").subscribe((result => {
    //     if (result['statusCode'] == '200') {
    //       this.toast.successToastr(result['statusMsg']);
    //       this.selected_image.splice(arrayIndex, 1);

    //     } else {
    //       this.toast.errorToastr(result['statusMsg']);
    //     }
    //   }
    //   ))
    // }
    // else {
    //   this.selected_image.splice(arrayIndex, 1);
    // }
    if (this.selected_image[arrayIndex].id) {

      this.alert.confirm("You Want To Delete Image!").then((result) => {

        if (result) {
          this.service.post_rqst({ 'gift_img': this.selected_image[arrayIndex], 'scheme_id': this.scheme_id }, 'Scheme/deleteSchemeBanner').subscribe((resp) => {
            if (resp['statusCode'] == 200) {
              console.log('success');
              this.selected_image.splice(arrayIndex, 1);
            }
            else {
              this.toast.errorToastr(resp['statusMsg']);
            }
          }, error => {
            this.toast.errorToastr(error);
          })
        }

      });
    }
    else {
      this.alert.confirm("You Want To Delete Image!").then((result) => {
        if (result) {
          this.selected_image.splice(arrayIndex, 1);
          this.updated_image.splice((arrayIndex - this.schemeDetails.bannerData.length), 1);
        }
      })
    }
  }

  deleteProductImage(arrayIndex) {
    this.selected_image.splice(arrayIndex, 1);
  }

  back(): void {
    this.location.back()
  }
 
}
