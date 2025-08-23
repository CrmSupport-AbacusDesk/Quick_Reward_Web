import { Component, NgZone, OnInit } from '@angular/core';
import { slideToTop } from '../../router-animation/router-animation.component';
import { DatabaseService } from 'src/_services/DatabaseService'
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { FormControl } from '@angular/forms';
import { debounceTime, tap, switchMap, finalize } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { DatePipe, Location } from '@angular/common';
import * as moment from 'moment';
import { sessionStorage } from 'src/app/localstorage.service';
import { ToastrManager } from 'ng6-toastr-notifications';
import { param } from 'jquery';
import { CryptoService } from 'src/_services/CryptoService';
import { uploadImgService } from 'src/_services/uploadImg';

@Component({
    selector: 'app-add-distribution',
    templateUrl: './add-distribution.component.html',
    animations: [slideToTop()],
    providers: [DatePipe],
})
export class AddDistributionComponent implements OnInit {
    savingFlag: boolean = false;
    states: any = [];
    district_list: any = [];
    userId: any;
    userName: any;
    params_id: any;
    allBrandList:any=[]
    params_type: any;
    city_list: any = [];
    beat_code_data: any = [];
    pinCode_list: any = [];
    data: any = {};
    contact_person = {};
    asmList: any = [];
    assignUserList = [];
    assignUserId = [];
    dr_type: any;
    brand_list: any = [];
    competitorBrandList: any = [];

    options: string[] = ['One', 'Two', 'Three'];
    filteredOptions: Observable<string[]>;
    searchMoviesCtrl = new FormControl();
    rsm: any = [];
    ass_user: any = [];
    brand: any = [];
    tmp_drlist: any = [];
    drlist: any = [];
    tmpsearchdr: any = {};

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
    pageType: any;
    front_img_id: any;
    back_img_id: any;
    pan_img_id: any;
    bank_img_id: any;
    uploadurl: any;
    panBase64: boolean = false;
    bankImgBase64: boolean = false;
    docFrontBase64: boolean = false;
    docBackBase64: boolean = false;
    document_image: any;
    document_image_back: any;
    pan_img: any;
    image_id: any;
    image = new FormData();
    url: any;
    network_type: any = {};
    customerNetwork: any = [];
    logined_user_data: any = {};
    formData: any = [];
    dependentformData: any = [];
    fomDataloader: boolean = false;
    fomDeploader: boolean = false;
    addressData: any = [];

    login_data: any = {};



    stateMoreAddress: any = [];
    constructor(
        public service: DatabaseService,
        public rout: Router,
        public location: Location,
        public route: ActivatedRoute,
        public toast: ToastrManager,
        public session: sessionStorage,
        private zone: NgZone,
        public uploadDoc: uploadImgService,
        public cryptoService: CryptoService,
        private http: HttpClient) {
        this.uploadurl = service.uploadUrl;
        this.url = this.service.uploadUrl + 'retailer_doc/';
         this.GetBrandList();
        this.getSalesUser('');
        this.getStateList('');
        this.getStateList2('');
       
        this.route.params.subscribe(params => {
            let id
            if (params.type) {
                id = params.type.replace(/_/g, '/');
            }
            this.network_type = this.route.queryParams['_value'];
            this.dr_type = params['id'];
            this.params_type = this.cryptoService.decryptId(id);
            this.pageType = params['pageType']
            this.userData = JSON.parse(localStorage.getItem('st_user'));
            this.userId = this.userData['data']['id'];
            this.userName = this.userData['data']['name'];
            this.logined_user_data = this.userData['data'];
            this.login_data = this.session.getSession();
            this.login_data = this.login_data.value;
            if (this.dr_type == '1') {
                this.getTransport('')
            }


            if (this.params_type && params['id']) {
                this.params_id = params['id'];
                // && (this.logined_user_data.organisation_data.home_page_sfa == 'Default' || this.logined_user_data.organisation_data.home_page_dms == 'Default')
                if (params['pageType'] == 'edit') {
                    this.distributorDetail();
                }
            }
            this.getFormData();
            this.getNetworkType();
            this.myDate = new Date();

        });
    }

    ngOnInit() {
        this.searchMoviesCtrl.valueChanges.pipe(debounceTime(500), tap(() => {
            this.errorMsg = "";
            this.filter_data = [];
            this.isLoading = true;
        }),
            switchMap(value => this.http.post(this.service.dbUrl + "cp_suggestive/get_result", { 'value': value }).pipe(finalize(() => {
                this.isLoading = false
            })))).subscribe(data => {

                if (data['res'] == undefined) {
                    this.errorMsg = data['Error'];
                    this.filter_data = [];
                } else {
                    this.errorMsg = "";
                    this.filter_data = data['res'];
                }
            });
    }



    getFormData() {
        this.fomDataloader = true;
        this.service.post_rqst({}, "FormBuilder/fetchCustomerNetworkFormBuilderFields").subscribe((result => {

            if (result['statusCode'] == 200) {
                this.fomDataloader = false;
                this.formData = result['data'];
            } else {
                this.fomDataloader = false;
                this.toast.errorToastr(result['statusMsg']);
            }
        }));
    }

    dependentFeilds(name, value) {
        this.dependentformData = [];
        this.fomDeploader = true;
        this.service.post_rqst({ 'field_name': name, 'value': value }, "FormBuilder/fetchCustomerNetworkDependentFields").subscribe((result => {

            if (result['statusCode'] == 200) {
                this.fomDeploader = false;
                this.dependentformData = result['data'];
            } else {
                this.fomDeploader = false;
                this.toast.errorToastr(result['statusMsg']);
            }
        }));
    }

    getNetworkType() {
        this.service.post_rqst({ 'type': this.network_type.network_type }, "CustomerNetwork/distributionNetworkSubType").subscribe((result => {

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


    distributorDetail() {
        let id = { "id": this.params_type }
        this.service.post_rqst(id, "CustomerNetwork/distributorDetail").subscribe((result) => {
            if (result['statusCode'] == 200) {
                this.data = result['distributor_detail'];
                if (this.data.type == 1) {
                    if (this.data.transport_id > 0) {
                        this.data.transport = [this.data.transport_id.toString()];
                    }
                    else {
                        this.data.transport = this.data.transport_id.split(",");
                    }
                }
                if (this.data.type == 3) {
                    this.data.distributor_id = this.data.distributors_id.toString();
                }
                this.data.assigned_sales_user_name = this.data.assigned_sales_user_name.map(String);
                this.data.credit_limit = this.data.credit_limit.toString();
                this.data.credit_period = this.data.credit_period.toString();
                this.data.id = result['distributor_detail']['id'];
                this.formData = result['distributor_detail']['form_builder'];
                if (this.data.multiple_address) {
                    this.addressData = this.data.multiple_address;
                }
                if (this.formData.length > 0) {
                    this.formData.forEach((item, index) => {
                        if (item.field_type === 'File' && item.value != '') {
                            this.formData[index]['img_id'] = id;
                        }
                    });
                }

                this.dependentformData = result['distributor_detail']['form_builder_dependent'];
                if (this.data.distributor_id != '') {
                    this.distributorList('', '');
                }
                if (this.data.state) {
                    this.getDistrict(1, '');
                }
                if (this.data.district != '') {
                    this.getBeatCode('', 1);
                }
            }
            else {
                this.toast.errorToastr(result['statusMsg'])
            }
        })
    }
    processPincode(pincode, val) {
        const pincodeValue = pincode;
        if (pincodeValue.length > 5) {
            this.service.post_rqst({ 'pincode': pincodeValue }, "Enquiry/getPostalInfo").subscribe((result => {


                if (result['statusCode'] == 200) {
                    if (val == 1) {
                        this.data.state = result['result'].state_name
                        this.data.district = result['result'].district_name
                        this.data.city = result['result'].city
                        this.getDistrict(1, '');
                        this.getBeatCode('', 1)
                    } else {
                        this.data.state2 = result['result'].state_name;
                        this.data.district2 = result['result'].district_name;
                        console.log(this.data.district2);
                        this.data.city2 = result['result'].city;
                        this.getDistrict(2, '')
                    }
                }
                else {
                    this.toast.errorToastr(result['statusMsg'])
                }
            }))
        }




    }




    getStateList(search) {
        this.service.post_rqst({ 'search': search }, "CustomerNetwork/getAllState").subscribe((result => {
            if (result['statusCode'] == 200) {
                this.states = result['all_state'];
            } else {
                this.toast.errorToastr(result['statusMsg']);
            }
        }));
    }



    transportList: any = []
    getTransport(search) {
        this.service.post_rqst({ 'search': search }, "CustomerNetwork/transportCompanyName").subscribe((result => {
            if (result['statusCode'] == 200) {
                this.transportList = result['result'];
                if (this.transportList.length == 1) {
                    this.data.transport = this.transportList[0]['id'].toString();
                }
            } else {
                this.toast.errorToastr(result['statusMsg']);
            }

        }));
    }

    getStateList2(search) {
        this.service.post_rqst({ 'search': search }, "CustomerNetwork/getAllState").subscribe((result => {
            if (result['statusCode'] == 200) {
                this.stateMoreAddress = result['all_state'];
            } else {
                this.toast.errorToastr(result['statusMsg']);
            }
        }));
    }


    district_list2: any = [];
    getDistrict(val, search) {

        if (this.dr_type == 3) {
            this.distributorList('', this.data.state);
        }

        let st_name;
        if (val == 1) {
            if (this.data.state) {
                st_name = this.data.state;
            }
        } else {
            st_name = this.data.state2;
        }
        this.service.post_rqst({ 'state_name': st_name, 'search': search }, "CustomerNetwork/getAllDistrict").subscribe((result => {

            if (result['statusCode'] == 200) {
                if (val == 1) {
                    this.district_list = result['all_district'];
                } else {
                    this.district_list2 = result['all_district'];
                }
            } else {
                this.toast.errorToastr(result['statusMsg']);
            }
        }));
    }



    getBeatCode(searcValue, val) {
        let dist_name;
        if (val == 1) {
            dist_name = this.data.district;
        }
        let value = { "state": this.data.state, "district": dist_name, 'searchValue': searcValue }
        this.service.post_rqst(value, "CustomerNetwork/territoryCodeList").subscribe((result => {

            if (result['statusCode'] == 200) {
                this.beat_code_data = result['result'];
            } else {
                this.toast.errorToastr(result['statusMsg']);
            }
        }));
    }
    findArea(code) {
        let index
        index = this.beat_code_data.findIndex(row => row.beat_code == code);
        if (index != -1) {
            this.data.beat_code_area = this.beat_code_data[index]['beat_code_area'];
        }
    }
    salesUser: any = [];
    getSalesUser(searcValue) {
        this.service.post_rqst({ 'search': searcValue }, "CustomerNetwork/salesUserList").subscribe((result => {

            if (result['statusCode'] == 200) {
                this.salesUser = result['all_sales_user'];
            } else {
                this.toast.errorToastr(result['statusMsg']);
            }

        }));
    }

    MobileNumber(event: any) {
        const pattern = /[0-9\+\-\ ]/;
        let inputChar = String.fromCharCode(event.charCode);
        if (event.keyCode != 8 && !pattern.test(inputChar)) { event.preventDefault(); }

    }

    check_number() {
        if (this.data.mobile.length == 10) {
            this.service.post_rqst({ "mobile": this.data.mobile }, "CustomerNetwork/checkDrMobile").subscribe((result => {

                if (result['statusCode'] == 200) {
                    this.exist = false;
                }
                else {
                    this.toast.errorToastr(result['statusMsg']);
                    this.exist = true;
                }
            }))
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

    distributorList(searcValue, state) {
        this.service.post_rqst({ 'search': searcValue, 'state': state }, "CustomerNetwork/distributorsList").subscribe((result => {

            if (result['statusCode'] == 200) {
                this.drlist = result['distributors'];
            } else {
                this.toast.errorToastr(result['statusMsg']);
            }
        }))
    }
    GetBrandList() {
        this.service.post_rqst({}, "CustomerNetwork/brands").subscribe((res => {

            if (res['statusCode'] == 200) {
                console.log(res)
                this.allBrandList = res['result'];
            } else {
                this.toast.errorToastr(res['statusMsg']);
            }
        }))
    }

    back(): void {
        this.location.back()
    }
    Adhr_frnt_Upload(data: any) {
        for (let i = 0; i < data.target.files.length; i++) {
            const file = data.target.files[i];
            this.uploadDoc.processImageFile(file)
                .then(({ dataURL, cleanedFile }) => {
                    if (file) {
                        this.front_img_id = '';
                        this.docFrontBase64 = true;
                        this.data.document_image = dataURL;
                        this.image.append("" + i, cleanedFile, cleanedFile.name);
                    }
                    else {
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
                    if (file) {
                        this.back_img_id = '';
                        this.docBackBase64 = true;
                        this.data.document_image_back = dataURL;
                        this.image.append("" + i, cleanedFile, cleanedFile.name);
                    }
                    else {
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
                    if (file) {
                        this.pan_img_id = '';
                        this.panBase64 = true;
                        this.data.pan_img = dataURL;
                        this.image.append("" + i, cleanedFile, cleanedFile.name);
                    }
                    else {
                        this.panBase64 = false;
                    }
                })
                .catch(err => {
                    this.toast.errorToastr(err);
                });
        }
    }
    bankImg_Upload(data: any) {
        for (let i = 0; i < data.target.files.length; i++) {
            const file = data.target.files[i];
            this.uploadDoc.processImageFile(file)
                .then(({ dataURL, cleanedFile }) => {
                    if (file) {
                        this.bank_img_id = '';
                        this.bankImgBase64 = true;
                        this.data.bank_img = dataURL;
                        this.image.append("" + i, cleanedFile, cleanedFile.name);
                    }
                    else {
                        this.bankImgBase64 = false;
                    }
                })
                .catch(err => {
                    this.toast.errorToastr(err);
                });
        }
    }

    DOBError: boolean = false;
    DOAError: boolean = false;


    onUploadChange(data: any, id) {
        for (let i = 0; i < data.target.files.length; i++) {
            const file = data.target.files[i];
            this.uploadDoc.processImageFile(file)
                .then(({ dataURL, cleanedFile }) => {
                    this.zone.run(() => {
                        this.formData.forEach((item, index) => {
                            if (item.id === id) {
                                this.formData[index]['img_id'] = '';
                                this.formData[index]['value'] = dataURL;
                            }
                        });
                    });
                    this.image.append("" + i, cleanedFile, cleanedFile.name);
                })
                .catch(err => {
                    this.toast.errorToastr(err);
                });
        }
    }


    submitDetail() {

        if (this.userId != '1') {
            this.ass_user[0] = this.userId;
            this.data.sales_executive = this.ass_user;
        }

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
        if (this.addressData) {
            this.data.multiple_address = this.addressData;
        }

        let header
        if (this.pageType == 'edit') {
            header = this.service.post_rqst({ "data": this.data, 'type': this.dr_type }, "CustomerNetwork/updateDistributors")
        }
        else {
            header = this.service.post_rqst({ "data": this.data, 'type': this.dr_type }, "CustomerNetwork/distributorsAdd")
        }
        header.subscribe((result => {

            if (result['statusCode'] == 200 && !this.params_id) {

                let state = this.data.state;
                let id = this.data.id;
                let type = this.params_type;
                // this.rout.navigate([`distribution-list/${this.dr_type}/${this.params_type}/distribution-detail/` + result['last_id']], { queryParams: { state, id, type:this.dr_type} });
                this.back()
                // this.rout.navigate([`distribution-list/${this.dr_type}/${this.params_type}/distribution-detail/` + result['last_id'] + '/Profile']);
                this.toast.successToastr(result['statusMsg']);
                this.service.dr_list();
            }
            else if (result['statusCode'] == 200 && this.params_id) {
                let state = this.data.state;
                let id = this.data.id;
                let type = this.params_type;

                this.back()
                // this.rout.navigate([`distribution-list/${this.dr_type}/${this.params_type}/distribution-detail/` + result['last_id'] + '/Profile'], { queryParams: { state, id, type: this.dr_type } });

                this.toast.successToastr(result['statusMsg']);
            }
            else {
                this.toast.errorToastr(result['statusMsg']);
                this.savingFlag = false;
            }

        }));
    }


    addToList() {
        if ((this.data.pincode2 == undefined) && (this.data.district2 == undefined) && (this.data.state2 == undefined) && (this.data.city2 == undefined)) {
            this.toast.errorToastr('Fill adreess section for add to list.');
            return;
        }
        if ((this.data.pincode2 != undefined) && (this.data.district2 != undefined) && (this.data.state2 != undefined) && (this.data.city2 != undefined)) {
            this.addressData.push({ pincode: this.data.pincode2, state: this.data.state2, district: this.data.district2, city: this.data.city2, address: this.data.address2 })
        }
        if (this.data.pincode2 == '' || this.data.district2 == '' || this.data.state2 == '' || this.data.city2 == '' || this.data.address2 == '') {
            this.data.pincode2 = undefined;
            this.data.district2 = undefined;
            this.data.state2 = undefined;
            this.data.city2 = undefined;
            this.data.address2 = undefined;
        }

    }

    delteDataRequest(index) {
        this.addressData.splice(index, 1);
        this.data.pincode2 = undefined;
        this.data.district2 = undefined;
        this.data.state2 = undefined;
        this.data.city2 = undefined;
        this.data.address2 = undefined;
    }
}