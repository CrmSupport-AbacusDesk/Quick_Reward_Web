import { Component, OnInit } from '@angular/core';
import { DatabaseService } from 'src/_services/DatabaseService'
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
// import { FormControl } from '@angular/forms';
import { debounceTime, tap, switchMap, finalize } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { DatePipe, Location } from '@angular/common';
import * as moment from 'moment';
import { sessionStorage } from 'src/app/localstorage.service';
import { ToastrManager } from 'ng6-toastr-notifications';
import { CryptoService } from 'src/_services/CryptoService';
import { uploadImgService } from 'src/_services/uploadImg';

@Component({
    selector: 'app-add-influencer',
    templateUrl: './add-influencer.component.html',
    styleUrls: ['./add-influencer.component.scss']
})
export class AddInfluencerComponent implements OnInit {
    savingFlag: boolean = false;
    states: any = [];
    district_list: any = [];
    userId: any;
    userName: any;
    params_network: any;
    params_type: any;
    document_image: any;
    document_image_back: any;
    pan_img: any;
    image_id: any;
    image = new FormData();
    city_list: any = [];
    city_area_list: any = [];
    pinCode_list: any = [];
    data: any = {};
    contact_person = {};
    asmList: any = [];
    assignUserList = [];
    assignUserId = [];
    brand_list: any = [];
    options: string[] = ['One', 'Two', 'Three'];
    filteredOptions: Observable<string[]>;
    // searchMoviesCtrl = new FormControl();
    rsm: any = [];
    ass_user: any = [];
    brand: any = [];
    tmp_drlist: any = [];
    drlist: any = [];
    tmpsearchdr: any = {};
    allState_district: any = {};
    
    filter_data: any;
    isLoading = false;
    errorMsg: string;
    active: any = {};
    submit: any = true;
    exist: boolean = false;
    tmp_userList: any = [];
    search: any = {};
    tmpsearch: any = {};
    ass_dist: any = [];
    myDate: Date;
    userData: any;
    params_id: any;
    front_img_id: any;
    back_img_id: any;
    pan_img_id: any;
    voter_img_id: any;
    driving_img_id: any;
    
    bank_img_id: any;
    uploadurl: any;
    panBase64: boolean = false;
    voterBase64: boolean = false;
    drivingBase64: boolean = false;
    
    bankImgBase64: boolean = false;
    docFrontBase64: boolean = false;
    docBackBase64: boolean = false;
    architectUser: any = [];
    contractorUser: any = [];
    user_assign_detail: any = [];
    company_name_flag:any;
    formData:any =[];
    dependentformData:any =[];
    fomDataloader: boolean = false;
    fomDeploader: boolean = false;
    login_data: any = {};
    
    constructor(
        public service: DatabaseService,
        public cryptoService:CryptoService,
        public rout: Router,
        public location: Location,
        public route: ActivatedRoute,
        public toast: ToastrManager,
        public session: sessionStorage,
        public uploadDoc:uploadImgService,
        private http: HttpClient) {
            this.login_data = this.session.getSession();
            this.login_data = this.login_data.value;
            this.getStateList('');
            
        }
        
        ngOnInit() {
            this.route.queryParams.subscribe(params => {
                this.uploadurl = this.service.uploadUrl + 'influencer_doc/'
                this.data.country = 'india';
                if (params.type) {
                    let id 
                    if(params.id){
                        id = params.id.replace(/_/g, '/');
                    }
                    
                    this.params_network = params.network;
                    this.params_type = Number(params.type);
                    this.params_id = this.cryptoService.decryptId(id);
                    this.front_img_id = this.cryptoService.decryptId(id);
                    this.back_img_id = this.cryptoService.decryptId(id);
                    this.pan_img_id = this.cryptoService.decryptId(id);
                    this.voter_img_id = this.cryptoService.decryptId(id);
                    this.driving_img_id = this.cryptoService.decryptId(id);
                    this.bank_img_id = this.cryptoService.decryptId(id);
                    
                    
                    if(this.service.InfluenceArray.length > 0){
                        let index = this.service.InfluenceArray.findIndex(row => row.type == params.type)
                        if (index != -1) {
                            this.company_name_flag = this.service.InfluenceArray[index].company_name_flag;
                        }
                    }
                    if (id) {
                        this.InfluencerDetail();
                    }
                }
                this.myDate = new Date();
                this.userData = JSON.parse(localStorage.getItem('st_user'));
                this.userId = this.userData['data']['id'];
                this.userName = this.userData['data']['name'];
                
            });
            
            if(!this.data.id){
                this.getFormData();
            }
            
            this.getSalesUser('');
            this.distributorList('', '');
        }
        
        
        
        
        
        
        InfluencerDetail() {
            this.service.post_rqst({ 'id': this.params_id }, 'Influencer/influencerCustomerDetail').subscribe((result) => {
                result = this.service.payLoad ? result : this.cryptoService.decryptData(JSON.stringify(result));
                if (result['statusCode'] == 200) {
                    this.data = result['result'];
                    this.formData = result['result']['form_builder'];
                    this.dependentformData = result['result']['form_builder_dependent'];
                    
                    if (this.data.state) {
                        this.getDistrict(1,'');
                    }
                    if (this.data.dob == '0000-00-00') {
                        this.data.dob = '';
                    }
                    if (this.data.doa == '0000-00-00') {
                        this.data.doa = '';
                    }
                }
                else {
                    this.toast.errorToastr(result['statusMsg']);
                }
            })
        }
        
        getStateList(search) {
            this.service.post_rqst({'search':search}, "Influencer/getAllState").subscribe((result => {
                if (result['statusCode'] == 200) {
                    this.states = result['all_state'];
                }
                else {
                    this.toast.errorToastr(result['statusMsg']);
                }
            }));
        }
        
        
        
        
        
        getDistrict(val,search) {
            let st_name;
            if (val == 1) {
                st_name = this.data.state;
            }
            this.service.post_rqst({ 'state_name': st_name,'search':search }, "Influencer/getAllDistrict").subscribe((result => {
                if (result['statusCode'] == 200) {
                    this.district_list = result['all_district'];
                }
                else {
                    this.toast.errorToastr(result['statusMsg']);
                }
            }));
            
        }
        
        
        distributorList(searcValue, state) {
            this.service.post_rqst({ 'search': searcValue, 'state': state }, "Influencer/distributorsList").subscribe((result => {
                
                if (result['statusCode'] == 200) {
                    this.drlist = result['distributors'];
                }
                else {
                    this.toast.errorToastr(result['statusMsg']);
                }
                
            }))
        }
        salesUser: any = [];
        getSalesUser(searcValue) {
            this.service.post_rqst({ 'search': searcValue }, "Influencer/salesUserList").subscribe((result => {
                
                if (result['statusCode'] == 200) {
                    this.salesUser = result['all_sales_user'];
                }
                else {
                    this.toast.errorToastr(result['statusMsg']);
                }
            }));
        }
        
        
        
        
        getFormData() {
            this.fomDataloader = true;
            this.service.post_rqst({}, "FormBuilder/fetchInfluencerFormBuilderFields").subscribe((result => {
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
            this.service.post_rqst({'field_name':name, 'value': value }, "FormBuilder/fetchInfluencerDependentFields").subscribe((result => {
                if (result['statusCode'] == 200) {
                    this.fomDeploader = false;
                    this.dependentformData = result['data'];
                } else {
                    this.fomDeploader = false;
                    this.toast.errorToastr(result['statusMsg']);
                }
            }));
        }
        
        
        
        
        Addressblank() {
            this.data.state = '';
            this.data.pincode = '';
            this.data.district = '';
            this.data.city = '';
        }
        
        MobileNumber(event: any) {
            const pattern = /[0-9\+\-\ ]/;
            let inputChar = String.fromCharCode(event.charCode);
            if (event.keyCode != 8 && !pattern.test(inputChar)) { event.preventDefault(); }
            
        }
        AdhaarNumber(event: any) {
            const pattern = /^[2-9]{1}[0-9]{3}\s{1}[0-9]{4}\s{1}[0-9]{4}$/;
            let inputChar = String.fromCharCode(event.charCode);
            if (event.keyCode != 8 && !pattern.test(inputChar)) { event.preventDefault(); }
            
        }
        Adhr_frnt_Upload(data: any) {
            for (let i = 0; i < data.target.files.length; i++) {
                const file = data.target.files[i];
                this.uploadDoc.processImageFile(file)
                .then(({ dataURL, cleanedFile }) => {
                    if(file){
                        this.front_img_id = '';
                        this.docFrontBase64 = true;
                        this.data.document_image = dataURL;
                        this.image.append("" + i, cleanedFile, cleanedFile.name);
                    }
                    else{
                        this.docFrontBase64 = false;
                    }
                })
                .catch(err => {
                    this.toast.errorToastr(err);
                });
            }
            
        }
        Adhr_bck_Upload(data: any) {
            for (let i = 0; i < data.target.files.length; i++) {
                const file = data.target.files[i];
                this.uploadDoc.processImageFile(file)
                .then(({ dataURL, cleanedFile }) => {
                    if(file){
                        this.back_img_id = '';
                        this.docBackBase64 = true;
                        this.data.document_image_back = dataURL;
                        this.image.append("" + i, cleanedFile, cleanedFile.name);
                    }
                    else{
                        this.docBackBase64 = false;
                    }
                })
                .catch(err => {
                    this.toast.errorToastr(err);
                });
            }
        }
        Pan_Upload(data: any) {
            for (let i = 0; i < data.target.files.length; i++) {
                const file = data.target.files[i];
                this.uploadDoc.processImageFile(file)
                .then(({ dataURL, cleanedFile }) => {
                    if(file){
                        this.pan_img_id = '';
                        this.panBase64 = true;
                        this.data.pan_img = dataURL;
                        this.image.append("" + i, cleanedFile, cleanedFile.name);
                    }
                    else{
                        this.panBase64 = false;
                    }
                })
                .catch(err => {
                    this.toast.errorToastr(err);
                });
            }
        }
        
        /////
        
        voter_Upload(data: any) {
            for (let i = 0; i < data.target.files.length; i++) {
                const file = data.target.files[i];
                this.uploadDoc.processImageFile(file)
                .then(({ dataURL, cleanedFile }) => {
                    if(file){
                        this.voter_img_id = '';
                        this.voterBase64 = true;
                        this.data.voter_img = dataURL;
                        this.image.append("" + i, cleanedFile, cleanedFile.name);
                    }
                    else{
                        this.voterBase64 = false;
                    }
                })
                .catch(err => {
                    this.toast.errorToastr(err);
                });
            }
        }
        
        
        
        Driving_Upload(data: any) {
            for (let i = 0; i < data.target.files.length; i++) {
                const file = data.target.files[i];
                this.uploadDoc.processImageFile(file)
                .then(({ dataURL, cleanedFile }) => {
                    if(file){
                        this.driving_img_id = '';
                        this.drivingBase64 = true;
                        this.data.driving_img = dataURL;
                        this.image.append("" + i, cleanedFile, cleanedFile.name);
                    }
                    else{
                        this.drivingBase64 = false;
                    }
                })
                .catch(err => {
                    this.toast.errorToastr(err);
                });
            }
        }
        
        //////
        bankImg_Upload(data: any) {
            for (let i = 0; i < data.target.files.length; i++) {
                const file = data.target.files[i];
                this.uploadDoc.processImageFile(file)
                .then(({ dataURL, cleanedFile }) => {
                    if(file){
                        this.bank_img_id = '';
                        this.bankImgBase64 = true;
                        this.data.bank_img = dataURL;
                        this.image.append("" + i, cleanedFile, cleanedFile.name);
                    }
                    else{
                        this.bankImgBase64 = false;
                    }
                })
                .catch(err => {
                    this.toast.errorToastr(err);
                });
            }
        }
        
        getItemsList(search) {
            this.asmList = [];
            for (var i = 0; i < this.tmp_userList.length; i++) {
                search = search.toLowerCase();
                this.tmpsearch = this.tmp_userList[i]['name'].toLowerCase();
                if (this.tmpsearch.includes(search)) {
                    this.asmList.push(this.tmp_userList[i]);
                }
            }
        }
        
        assign_to_distributor(id, index, e) {
            if (e.checked) {
                this.assignUserId.push(id);
                this.assignUserList.push(this.asmList[index]);
            }
            else {
                var index_val = index;
                for (var j = 0; j < this.assignUserId.length; j++) {
                    if (this.asmList[index].id == this.assignUserId[j]) {
                        this.assignUserId.splice(j, 1);
                        this.removeUser(j);
                    }
                }
            }
        }
        
        removeUser(index) {
            this.assignUserList.splice(index, 1);
        }
        
        
        user_assign_check(value, index, event) {
            
            if (event.checked) {
                if (this.rsm.indexOf(this.asmList[index]['id']) === -1) {
                    this.rsm.push(value);
                }
            }
            else {
                for (var j = 0; j < this.asmList.length; j++) {
                    if (this.asmList[index]['id'] == this.rsm[j]) {
                        this.rsm.splice(j, 1);
                    }
                }
            }
            
            this.ass_user = this.rsm
        }
        
        product_Brand(value, index, event) {
            if (event.checked) {
                this.brand.push(value);
            }
            else {
                for (var j = 0; j < this.brand_list.length; j++) {
                    if (this.brand_list[index]['brand_name'] == this.brand[j]) {
                        this.brand.splice(j, 1);
                    }
                }
            }
        }
        
        
        
        back(): void {
            this.location.back()
        }
        
        
        DOBError: boolean = false;
        DOAError: boolean = false;
        
        assignUserName(userid) {
            let Index = this.salesUser.findIndex(row => row.id == userid)
            if (Index != -1) {
                this.data.user_assined_name = this.salesUser[Index].name;
            } else {
            }
        }
        
        submitDetail() {
            
            if (this.data.dob) {
                this.data.dob = moment(this.data.dob).format('YYYY-MM-DD');
                this.data.dob = this.data.dob;
            }
            if (this.data.date_of_wedding) {
                this.data.date_of_wedding = moment(this.data.date_of_wedding).format('YYYY-MM-DD');
                this.data.date_of_wedding = this.data.date_of_wedding;
            }
            if (this.data.doa) {
                this.data.doa = moment(this.data.doa).format('YYYY-MM-DD');
                this.data.doa = this.data.doa;
            }
            this.data.created_by_name = this.userName
            this.data.created_by_id = this.userId;
            this.savingFlag = true;
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
            
            let header
            if (this.params_id) {
                this.data.update_id = this.params_id;
                this.data.panBase64 = this.panBase64;
                this.data.bankImgBase64 = this.bankImgBase64;
                this.data.docFrontBase64 = this.docFrontBase64;
                this.data.docBackBase64 = this.docBackBase64;
                header = this.service.post_rqst({ "data": this.data, 'type': this.params_type, 'influencer_type': this.params_network }, "Influencer/updateInfluencer")
            }
            else {
                header = this.service.post_rqst({ "data": this.data, 'type': this.params_type, 'influencer_type': this.params_network }, "Influencer/addInfluencer")
            }
            header.subscribe((result => {
                
                if (result['statusCode'] == 200) {
                    // this.rout.navigate(['/influencer/' + this.params_type + '/' + this.params_network + '/']);
                    window.history.back();
                    this.toast.successToastr(result['statusMsg']);
                    this.savingFlag = false;
                }
                else {
                    this.toast.errorToastr(result['statusMsg']);
                    this.savingFlag = false;
                }
                
            }));
        }
        
        
        getaddress(pincode) {
            if (this.data.pincode.length == '6') {
                this.service.post_rqst({ 'pincode': pincode }, 'Influencer/PinCodeWiseState').subscribe((result) => {
                    
                    if (result['statusCode'] == 200) {
                        this.allState_district = result['all_State_district'];
                        if (this.allState_district != null) {
                            this.data.state = this.allState_district.state_name;
                            this.getDistrict(1,'');
                            this.getStateList('');
                            this.data.district = this.allState_district.district_name;
                            this.data.city = this.allState_district.city_name;
                        }
                    }
                    
                });
            }
            else if (this.data.pincode.length == '0') {
                this.data.state = '';
                this.data.district = '';
                this.data.city = ''
                
            }
            
        }
        
    }
    
    
    