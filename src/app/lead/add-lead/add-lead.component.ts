import { Component, NgZone, OnInit } from '@angular/core';
import { slideToTop } from '../../router-animation/router-animation.component';
import { DatabaseService } from 'src/_services/DatabaseService';
import { _localeFactory } from '@angular/core/src/application_module';
import { ActivatedRoute, Router } from '@angular/router';
import { DialogComponent } from 'src/app/dialog.component';
import * as moment from 'moment';
import { sessionStorage } from 'src/app/localstorage.service';
import { Location } from '@angular/common';
import { ToastrManager } from 'ng6-toastr-notifications';
import { CryptoService } from 'src/_services/CryptoService';
import { uploadImgService } from 'src/_services/uploadImg';


@Component({
  selector: 'app-add-lead',
  templateUrl: './add-lead.component.html',
  animations: [slideToTop()]
  
})
export class AddLeadComponent implements OnInit {
  
  data: any = {};
  savingFlag: boolean = false;
  status = '';
  today_date: any;
  userData: any;
  userId: any;
  userName: any;
  networkType: any = [];
  city_area_list: any = [];
  loader: boolean = false;
  states: any = [];
  district_list: any = [];
  selectedFile: any = [];
  urls: any = [];
  formData:any [];
  dependentformData:any =[];
  fomDataloader: boolean = false;
  fomDeploader: boolean = false;
  url: any;
  enquiryUrl: any
  image= new FormData();
  
  
  
  constructor(public service: DatabaseService, public uploadDoc:uploadImgService,
   private zone: NgZone, public cryptoService: CryptoService, public router: Router, public location: Location, public rout: Router, public session: sessionStorage, public dialog: DialogComponent, public ActivatedRoute: ActivatedRoute, public toast: ToastrManager) {
    this.today_date = new Date();
    this.url = this.service.uploadUrl + 'Attachment/';
    this.enquiryUrl = service.uploadUrl + 'enquiry/';
    this.userData = JSON.parse(localStorage.getItem('st_user'));
    this.userId = this.userData['data']['id'];
    this.userName = this.userData['data']['name'];
    this.getStateList('');
    this.getsource_list();
  }
  
  ngOnInit() {
    this.ActivatedRoute.params.subscribe(params => {
      let id = params.id.replace(/_/g, '/');
      this.data.id = this.cryptoService.decryptId(id);;
      if(this.data.id){
        this.leadDetail()
      }
    });
    
    if(!this.data.id){
      this.getFormData();
      this.getNetworkType();
    }
    
    
    
  }
  
  
  delete_img(i){
    this.urls.splice(i, 1);
  }
  
  onUploadChange(data: any, id) {
    for (let i = 0; i < data.target.files.length; i++) {
      const file = data.target.files[i];
      this.uploadDoc.processImageFile(file)
      .then(({ dataURL, cleanedFile }) => {
        this.formData.forEach((item, index) => {
          if (item.id === id) {
            this.formData[index]['img_id'] = '';
            this.formData[index]['value'] = dataURL;
          }
        });
        this.image.append("" + i, cleanedFile, cleanedFile.name);
      })
      .catch(err => {
          this.toast.errorToastr(err);
      });
  }
  }
  
  
  leadDetail() {
    this.loader = true;
    this.fomDeploader = true;
    this.fomDataloader = true
    this.service.post_rqst({ 'id': this.data.id }, "Enquiry/enquiryDetail").subscribe(result => {
      if (result['statusCode'] == 200) {
        this.data = result['enquiry_detail'];
        if(result['enquiry_detail']['sub_type']){
          this.data.network_type = result['enquiry_detail']['influencer_type'] ;
          this.data.customer_network_type = result['enquiry_detail']['sub_type'];
          this.getCustomerNetworkType(this.data.network_type);
          this.getCustomerTypeDetails(this.data.customer_network_type);
        }
        this.formData = this.data['form_builder'];
        this.dependentformData = this.data['form_builder_dependent'];
        if(this.formData.length > 0){
          this.formData.forEach((item, index) => {
            if (item.field_type === 'File' && item.value != '') {
              this.formData[index]['img_id'] = this.data.id;
            }
          });
        }
        this.fomDeploader = false;
        this.fomDataloader = false
        this.loader = false;
        this.data.dr_type = this.data.enquiry_type_id.toString();
        if(this.data.dr_type){
          this.getNetworkType();
        }
        if(this.data.state){
          this.getDistrict(1,'')
        }
      }
      else {
        this.toast.errorToastr(result['statusMsg']);
        this.fomDeploader = false;
        this.fomDataloader = false
        this.loader = false
      }
    })
  }
  
  
  
  selectLeadType(dr_type) {
    let Index = this.networkType.findIndex(row => row.type == dr_type)
    if (Index != -1) {
      this.data.type_name = this.networkType[Index].module_name;
      this.data.type = this.networkType[Index].type
      this.data.lead_convert = this.networkType[Index].lead_convert
      this.data.sfa = this.networkType[Index].sfa
      this.data.dms = this.networkType[Index].dms
      this.data.field_type = 'enquiry_type'
    } else {
    }
    
  }
  insertImage(event) {
    let files = event.target.files;
    if (files) {
      for (let file of files) {
        let reader = new FileReader();
        reader.onload = (e: any) => {
          let img = new Image();
          img.onload = () => {
            let canvas = document.createElement('canvas');
            let ctx = canvas.getContext('2d');
            canvas.width = img.width;
            canvas.height = img.height;
            ctx.drawImage(img, 0, 0);
            let dataURL = canvas.toDataURL(file.type);
            this.urls.push(dataURL);
          };
          img.src = e.target.result;
        };
        reader.readAsDataURL(file);
      }
    }
    for (var i = 0; i < event.target.files.length; i++) {
      this.selectedFile.push(event.target.files[i]);
    }
  }
  
  getStateList(search) {
    this.service.post_rqst({'search':search}, "CustomerNetwork/getAllState").subscribe((result => {
     
      if (result['statusCode'] == 200) {
        this.states = result['all_state'];
      } else {
        this.toast.errorToastr(result['statusMsg']);
      }
    }));
  }
  
  
  getFormData() {
    this.fomDataloader = true;
    this.service.post_rqst({}, "FormBuilder/fetchEnquiryFormBuilderFields").subscribe((result => {
     
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
    this.service.post_rqst({'field_name':name, 'value': value }, "FormBuilder/fetchDependentFields").subscribe((result => {
     
      if (result['statusCode'] == 200) {
        this.fomDeploader = false;
        this.dependentformData = result['data'];
      } else {
        this.fomDeploader = false;
        this.toast.errorToastr(result['statusMsg']);
      }
    }));
  }
  
  
  
  processPincode(pincode) {
    const pincodeValue = pincode;
    if (pincodeValue.length > 5) {
      this.service.post_rqst({ 'pincode': pincodeValue } , "Enquiry/getPostalInfo").subscribe((result => {
        if (result['statusCode'] == 200) {
          this.data.state = result['result'].state_name
          this.data.district = result['result'].district_name
          this.data.city = result['result'].city
          this.getDistrict(1,'')
        }
        else {
          this.toast.errorToastr(result['statusMsg'])
        }
      }))
    }
    
    
    
    
  }
  
  
  //submit function
  submitDetail() {
    this.data.date_of_anniversary = moment(this.data.date_of_anniversary).format('YYYY-MM-DD');
    this.data.date_of_birth = moment(this.data.date_of_birth).format('YYYY-MM-DD');
    this.data.uid = this.userId;
    this.data.uname = this.userName;
    this.data.status = this.status
    this.data.image_data = this.urls
    
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
    this.service.post_rqst( {'data': this.data }, this.data.id ? "Enquiry/updateEnquiry" :"Enquiry/addEnquiry").subscribe((result) => {

      if (result['statusCode'] == 200) {
        this.toast.successToastr(result['statusMsg']);
        this.rout.navigate(['/lead-list/']);
        this.loader = false;
        this.savingFlag = false;
      }
      
      else {
        this.dialog.error(result['statusMsg']);
      }
    }, error => {
    })
  }
  
  MobileNumber(event: any) {
    const pattern = /[0-9\+\-\ ]/;
    let inputChar = String.fromCharCode(event.charCode);
    if (event.keyCode != 8 && !pattern.test(inputChar)) { event.preventDefault(); }
  }
  
  
  
  getNetworkType() {
    this.service.post_rqst('', "Enquiry/getAllEnquiryType").subscribe((result => {
     
      if (result['statusCode'] == 200) {
        this.networkType = result['modules'];
        if(this.data.enquiry_type_id){
          this.selectLeadType(this.data.enquiry_type_id);
        }
      }
      else {
        this.toast.errorToastr(result['statusMsg'])
      }
    }))
  }
  source_list: any = [];
  getsource_list() {
    this.service.post_rqst('', "Enquiry/enquirySourceList").subscribe((result => {
     
      if (result['statusCode'] == 200) {
        this.source_list = result['lead_source_list'];
      }
      else {
        this.toast.errorToastr(result['statusMsg'])
      }
      
    }))
  }
  getDistrict(val,search) {
    let st_name;
    if (val == 1) {
      st_name = this.data.state;
    }
    this.service.post_rqst({ 'state_name': st_name,'search':search }, "CustomerNetwork/getAllDistrict").subscribe((result => {
     
      
      if (result['statusCode'] == 200) {
        
        this.district_list = result['all_district'];
      } else {
        this.toast.errorToastr(result['statusMsg']);
      }
    }));
  }
  getArea(val) {
    let dist_name;
    if (val == 1) {
      dist_name = this.data.district;
    }
    let value = { "state": this.data.state, "district": dist_name }
    this.service.post_rqst(value, "CustomerNetwork/getAreaData").subscribe((result => {
     
      if (result['statusCode'] == 200) {
        this.city_area_list = result['area'];
      } else {
        this.toast.errorToastr(result['statusMsg']);
      }
      
    }));
  }
  
  
  back(): void {
    this.location.back()
  }


  customerNetwork:any =[];
  getCustomerNetworkType(type) {
    this.service.post_rqst({ 'type': type }, "CustomerNetwork/distributionNetworkSubType").subscribe((result => {
        if (result['statusCode'] == 200) {
            this.customerNetwork = result['result'];
            if (this.customerNetwork.length == 1) {
                this.data.customer_network_type = this.customerNetwork[0]['name'];
                this.getCustomerTypeDetails(this.data.customer_network_type);
            }
        } else {
            this.toast.errorToastr(result['statusMsg']);
        }

    }));
}

getCustomerTypeDetails(customer_network_type) {
    let index
    index = this.customerNetwork.findIndex(row => row.name == customer_network_type);
    if (index != -1) {
        this.data.customer_network_type_id = this.customerNetwork[index]['id'];
    }
}



}
