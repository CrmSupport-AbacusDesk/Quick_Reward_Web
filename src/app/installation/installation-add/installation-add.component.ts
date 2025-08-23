import { Component, OnInit, Renderer2, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrManager } from 'ng6-toastr-notifications';
import { DatabaseService } from 'src/_services/DatabaseService';
import { sessionStorage } from 'src/app/localstorage.service';
import { HttpClient } from '@angular/common/http';
import { Location } from '@angular/common';
import { DialogComponent } from 'src/app/dialog.component';
import { MatDialog } from '@angular/material';
import { CryptoService } from 'src/_services/CryptoService';

@Component({
  selector: 'app-installation-add',
  templateUrl: './installation-add.component.html',
  styleUrls: ['./installation-add.component.scss']
})
export class InstallationAddComponent implements OnInit {
  @ViewChild('fileInput') fileInput: any;
  data: any = {};
  data2: any = {};
  product_data: any = {};
  states: any = [];
  dr_type: any;
  district_list: any = [];
  savingFlag: boolean = false;
  params_id: any;
  image_id: any;
  errorMsg: boolean = false;
  segmentList: any = [];
  productList: any = [];
  SubcategoryList: any = [];
  category_list: any = [];
  brandList: any = [];
  colorList: any = [];
  feature: any = {};
  value: any = [];
  formData = new FormData();
  loader: boolean = false;
  showMRP = false;
  showSize = false;
  exist: boolean = false;
  userData: any;
  userId: any;
  id: any;
  type: any;
  userName: any;
  image = new FormData();
  product_id: any;
  url: any;
  selected_image: any = [];
  add_list: any = [];
  selected_image2: any = [];
  state: any = [];
  pointCategories_data: any = []
  getData: any = {};
  params_network: any;
  params_type: any;
  billBase64: boolean = false;
  bill_img_id: any;
  warrantyBase64: boolean = false;
  warranty_img_id: any;
  bill_img: any;
  filter: any = {};
  warranty_img: any;
  urls = new Array<string>();
  selectedFile = [];
  encryptedData: any;
  decryptedData:any;

  constructor(private renderer: Renderer2,
    public location: Location,
    public service: DatabaseService,
    public rout: Router,
    public toast: ToastrManager,
    private route: ActivatedRoute,
    public cryptoService:CryptoService,
    public dialog: DialogComponent,
    public dialog2: MatDialog) {

    this.url = this.service.uploadUrl + 'service_task/'

    this.getStateList();
    this.route.params.subscribe(params => {
      this.id = params.id;
      this.type = params.type;
      console.log(this.id);
      console.log(this.type);
      if (this.id) {
        this.getInstallationDetail(this.id);
      }

      this.getSegment();


    });
  }

  ngOnInit() {
  }
  submitDetail() {

    if (this.selected_image.length > 5) {

      this.toast.errorToastr('Nuber Of Image Should Be Less Then 5 Or Equal To 5 ');
      return;
    }

    this.data.image = this.selected_image ? this.selected_image : [];
    this.data.add_list = this.add_list
    this.savingFlag = true;
    let header
    if (this.id) {
      this.encryptedData = this.service.payLoad ? { "data": this.data, 'type': 'Edit', 'id': this.id }: this.cryptoService.encryptData({ "data": this.data, 'type': 'Edit', 'id': this.id });
      if (this.data2.complaint_type == 'Installation') {
        header = this.service.post_rqst(this.encryptedData, "ServiceTask/serviceInstallationAdd")
      } else {
        header = this.service.post_rqst(this.encryptedData, "ServiceTask/serviceComplaintAdd")
      }

    }
    else {
      this.encryptedData = this.service.payLoad ? { "data": this.data, 'type': 'Add'}: this.cryptoService.encryptData({ "data": this.data, 'type': 'Edit', 'id': this.id });
      if (this.data2.complaint_type == 'Installation') {
        header = this.service.post_rqst(this.encryptedData, "ServiceTask/serviceInstallationAdd")
      }
      else {
        header = this.service.post_rqst(this.encryptedData, "ServiceTask/serviceComplaintAdd")
      }
    }
    header.subscribe((result => {
    this.decryptedData = this.service.payLoad ? result : this.cryptoService.decryptData(JSON.stringify(result));
      if (this.decryptedData['statusCode'] == 200) {
        if (this.data2.complaint_type == 'Installation') {
          this.rout.navigate(['/installation-list']);
        }
        else {
          this.rout.navigate(['/complaint-list']);
        }
        this.toast.successToastr(this.decryptedData['statusMsg']);
        this.savingFlag = false;
      }
      else {
        this.toast.errorToastr(this.decryptedData['statusMsg']);
        this.savingFlag = false;
      }

    }));
  }
  back(): void {
    this.location.back()
  }

  getSegment() {
    this.service.post_rqst({}, "Master/getProductCategoryList").subscribe((result => {
    this.decryptedData = this.service.payLoad ? result : this.cryptoService.decryptData(JSON.stringify(result));
      if (this.decryptedData['statusCode'] == 200) {
        this.segmentList = this.decryptedData['segment_list'];
      }
    }))
  }

  getSubCatgory(id) {
    this.encryptedData = this.service.payLoad ? { 'id': id }: this.cryptoService.encryptData({ 'id': id });
    this.service.post_rqst(this.encryptedData, "Master/subCategoryList").subscribe((result => {
    this.decryptedData = this.service.payLoad ? result : this.cryptoService.decryptData(JSON.stringify(result));
      if (this.decryptedData['statusCode'] == 200) {
        this.SubcategoryList = this.decryptedData['result'];
        if (this.SubcategoryList.length <= 0) {
          this.getProduct(this.product_data.segment_id, '')
        }
      }
    }))
  }

  getProduct(segment_id, sub_segment_id) {
    this.filter.segment = segment_id
    this.filter.sub_category_name = sub_segment_id
    this.filter.installation_responsibility = 'Company';
    this.encryptedData = this.service.payLoad ? { 'filter': this.filter }: this.cryptoService.encryptData({ 'filter': this.filter });
    this.service.post_rqst(this.encryptedData, "Master/productList").subscribe((result => {
     this.decryptedData = this.service.payLoad ? result : this.cryptoService.decryptData(JSON.stringify(result));
      if (this.decryptedData['statusCode'] == 200) {
        this.productList = result['product_list'];
      }
    }))
  }

  getProductInfo(product_id) {
    if (product_id) {
      let index = this.productList.findIndex(d => d.id == product_id);
      if (index != -1) {
        this.data.product_name = this.productList[index].product_name;
        this.data.product_code = this.productList[index].product_code;
      }
    }
  }

  getStateList() {
    this.service.post_rqst(0, "Influencer/getAllState").subscribe((result => {
    this.decryptedData = this.service.payLoad ? result : this.cryptoService.decryptData(JSON.stringify(result));

      if (this.decryptedData['statusCode'] == 200) {
        this.states = this.decryptedData['all_state'];
      }
      else {
        this.toast.errorToastr(this.decryptedData['statusMsg']);
      }
    }));
  }

  getDistrict(val) {
    let st_name;
    if (val == 1) {
      st_name = this.data.state;
    }
    this.encryptedData = this.service.payLoad ? { 'state_name': st_name }: this.cryptoService.encryptData({ 'state_name': st_name });
    this.service.post_rqst(this.encryptedData, "Influencer/getAllDistrict").subscribe((result => {
      this.decryptedData = this.service.payLoad ? result : this.cryptoService.decryptData(JSON.stringify(result));
      if (this.decryptedData['statusCode'] == 200) {
        this.district_list = this.decryptedData['all_district'];
      }
      else {
        this.toast.errorToastr(this.decryptedData['statusMsg']);
      }
    }));

  }

  deleteProductImage(arrayIndex, id, name) {

    if (id) {
    this.encryptedData = this.service.payLoad ? { 'image_id': id, 'image': name }: this.cryptoService.encryptData({ 'image_id': id, 'image': name });
      this.service.post_rqst(this.encryptedData, "Master/productImageDeleted").subscribe((result => {
        this.decryptedData = this.service.payLoad ? result : this.cryptoService.decryptData(JSON.stringify(result));
        if (this.decryptedData['statusCode'] == '200') {
          this.toast.successToastr(this.decryptedData['statusMsg']);
          this.selected_image.splice(arrayIndex, 1);

        } else {
          this.toast.errorToastr(this.decryptedData['statusMsg']);
        }
      }
      ))
    }
    else {
      this.selected_image.splice(arrayIndex, 1);
    }
  }

  onUploadChange(data: any) {
    this.errorMsg = false;
    this.image_id = '';
    for (let i = 0; i < data.target.files.length; i++) {
      let files = data.target.files[i];
      if (files.size > 5242880) {
        this.dialog.error('Image size more than 5 Mb is not allowed.');
        return;
      }
      if (files) {
        let reader = new FileReader();
        reader.onload = (e: any) => {
          this.selected_image.push({ "image": e.target.result });
        }
        reader.readAsDataURL(files);
      }
      this.image.append("" + i, data.target.files[i], data.target.files[i].name);
    }
  }

  addProduct() {

    if (this.product_data.qty == 0 || this.product_data.qty == undefined || this.product_data.qty == null || !this.product_data.qty) {
      this.toast.errorToastr("QTY Should Be More Then Zero");
      return;
    }

    if (this.product_data.product_id) {
      let index = this.productList.findIndex(d => d.id == this.product_data.product_id);
      if (index != -1) {
        this.product_data.product_name = this.productList[index].product_name;
        this.product_data.product_code = this.productList[index].product_code;
      }
      
    }
    if (this.product_data.segment_id) {
      let index = this.segmentList.findIndex(d => d.id == this.product_data.segment_id);
      if (index != -1) {
        this.product_data.category_name = this.segmentList[index].category;
      }
    }
    if (this.product_data.sub_segment_id) {
      let index = this.SubcategoryList.findIndex(d => d.id == this.product_data.sub_segment_id);
      if (index != -1) {
        this.product_data.subcat_name = this.SubcategoryList[index].sub_category_name;
      }
    }

    if (this.add_list.length == 0) {
      this.add_list.push(JSON.parse(JSON.stringify(this.product_data)))
      this.product_data = {}
    }
    else {
      let isExistIndex: any;
      isExistIndex = this.add_list.findIndex(row => row.product_id == this.product_data.product_id);
      console.log(isExistIndex)
      if (isExistIndex == -1) {
        this.add_list.push(JSON.parse(JSON.stringify(this.product_data)))
        this.product_data = {}
      }
      else {
        this.add_list[isExistIndex].qty = parseInt(this.add_list[isExistIndex].qty) + parseInt(this.product_data.qty)
        this.product_data = {}
      }
    }
  }

  remove_image(i: any) {
    this.selected_image.splice(i, 1);
  }


  delete(i) {
    this.add_list.splice(i, 1)

  }

  MobileNumber(event: any) {
    const pattern = /[0-9\+\-\ ]/;
    let inputChar = String.fromCharCode(event.charCode);
    if (event.keyCode != 8 && !pattern.test(inputChar)) { event.preventDefault(); }
  }

  checkMobile() {
    if (this.data.customer_mobile.length == 10) {
    this.encryptedData = this.service.payLoad ? { 'customer_mobile': this.data.customer_mobile }: this.cryptoService.encryptData({ 'customer_mobile': this.data.customer_mobile });

      this.service.post_rqst(this.encryptedData, "ServiceTask/customerCheck").subscribe((result) => {
        this.decryptedData = this.service.payLoad ? result : this.cryptoService.decryptData(JSON.stringify(result));
        if (this.decryptedData.statusMsg == "Exist") {
          // this.toast.errorToastr("This Mobile No. alresdy exist in Complaint!");
          this.data = this.decryptedData.data
          this.getDistrict(1)
          // console.log(this.data,'this.data');
        }
      });
    }
    else{
      this.data.customer_name='';
      this.data.alternate_mobile_no='';
      this.data.state='';
      this.data.district='';
      this.data.city='';
      this.data.pincode='';
      this.data.address='';

    }
  }
  getInstallationDetail(id) {
    this.encryptedData = this.service.payLoad ? { 'complaint_id': id }: this.cryptoService.encryptData({ 'complaint_id': id });
    this.service.post_rqst(this.encryptedData, "ServiceTask/serviceInstallationDetail").subscribe((result => {
     this.decryptedData = this.service.payLoad ? result : this.cryptoService.decryptData(JSON.stringify(result));
      this.getData = this.decryptedData['result'];
      this.selected_image = this.getData['image'];
      this.data = this.getData;
      this.data2.complaint_type = this.getData.complaint_type
      this.add_list = this.getData['add_list'];
      this.getDistrict(1)

    }
    ));

  }

  findId(id) {
    let index = this.productList.findIndex(row => row.id == id)
    if (index != -1) {
      this.data.id = this.productList[index].id;
      this.data.product_name = this.productList[index].product_name;
    }
    console.log(this.data)
  }
  getProductName(id) {
    this.filter.product_name = id;
    this.encryptedData = this.service.payLoad ? { 'filter': this.filter }: this.cryptoService.encryptData({ 'filter': this.filter });
    this.service.post_rqst({ 'filter': this.filter }, "Master/productList").subscribe((result) => {
        this.decryptedData = this.service.payLoad ? result : this.cryptoService.decryptData(JSON.stringify(result));
        if (this.decryptedData["statusCode"] == 200) {
          this.productList = this.decryptedData["product_list"];
        }
      });
  }

}

