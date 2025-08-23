import { Component, OnInit, Inject } from '@angular/core';
import { DatabaseService } from 'src/_services/DatabaseService';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material';
import { sessionStorage } from 'src/app/localstorage.service';
import { ToastrManager } from 'ng6-toastr-notifications';
import * as moment from 'moment';
import { DialogComponent } from 'src/app/dialog.component';
import { CryptoService } from 'src/_services/CryptoService';
import { ProgressService } from 'src/app/progress.service';
import { Router } from '@angular/router';
declare const L: any



@Component({
    selector: 'app-status-modal',
    templateUrl: './status-modal.component.html'
})
export class StatusModalComponent implements OnInit {

    savingFlag: boolean = false;
    segment: any = {};
    category: any = {};
    login: any = {};
    delivery_from: any;
    userData: any;
    userId: any;
    userName: any;
    salesUser: any = [];
    ActiveTab: any = 'incoming'
    tabType: any = 'stock'
    stockDetails: any = [];
    dr_outDetails: any = [];
    transferRequestData: any = [];
    dr_inDetails: any = [];
    reqProductDetails: any = [];
    stockRequestDetails: any = [];
    sendProductDetails: any = [];
    organisationData: any = [];
    assignDistArray: any = [];
    drlist: any = [];
    tmpOrderStatus: any = '';
    segmentList: any = [];
    dr_data: any = [];
    states: any = [];
    order_item: any = [];
    networkType: any = [];
    warehouse: any = [];
    today_date: any = new Date()
    add_list: any = [];
    networklist: any = [];
    networklist2: any = [];
    productlist: any = [];
    productlist2: any = [];
    tempSearch: any = '';
    stockForm: any = {};
    logined_user_data: any = {};
    pageType: any = {};
    district_list: any = [];
    start: any = 0;
    page_limit: any = 50;
    downurl: any;
    excelLoader: boolean = false;
    download_percent: any;
    downloader: any = false;
    totalCount: any;
    remainingCount: any;
    fabBtnValue: any = 'add';
    beatArea: any = [];
    skLoading: boolean = false;
    filter: any = {};
    myMap: any;
    pincode_list: any = [];
    customerNetwork: any = [];
    transportList: any = [];
    discountList: any = [];



    constructor(@Inject(MAT_DIALOG_DATA) public data, public rout: Router, public progressService: ProgressService, public cryptoService: CryptoService, public dialog: MatDialog, public dialog1: DialogComponent, public service: DatabaseService, public session: sessionStorage, public toast: ToastrManager, public dialogRef: MatDialogRef<StatusModalComponent>,) {
        if ((this.data.from == "segment_list_page" && data.type == 'edit' || data.type == 'view') || this.data.from == "dr_detail") {
            if (this.data.discountList.length > 0) {
                this.discountList = this.data.discountList;


            }
        }
        this.userData = JSON.parse(localStorage.getItem('st_user'));
        this.logined_user_data = this.userData['data'];
        this.data.checkWareHouse = "No";
        this.downurl = service.downloadUrl;
        this.segment = this.data.segment;
        this.userId = this.userData['data']['id'];
        this.userName = this.userData['data']['name'];
        this.delivery_from = this.data.delivery_from;


        if (this.delivery_from == 'beat_code_edit') {
            this.data.state = this.data.all_data.state
            this.data.district = this.data.all_data.distirct;
            this.getPincode('', 1);
            this.data.pincode = this.data.all_data.pincode.split(",").map(item => item.trim());
        }
        if (this.delivery_from == 'purchase') {
            this.data = this.data.modalData;
            this.data.total_point_value = this.data.total_point_value.toString();

        }

        if (this.delivery_from == 'AdminLoyaltyReport') {

            this.getSalesUser('');
            this.getStateList('');
        }

        if (this.data.from == 'primary_order') {

            if (this.data.transport_id) {
                this.data.transport_id = this.data.transport_id.toString();
            }
            this.getTransport();
            for (let i = 0; i < this.data.order_item.length; i++) {
                this.order_item.push({ 'id': this.data.order_item[i]['id'], 'product_name': this.data.order_item[i]['product_name'], 'product_code': this.data.order_item[i]['product_code'], 'order_qty': this.data.order_item[i]['qty'], 'qty': this.data.order_item[i]['sale_dispatch_qty'], 'dispatch_qty': parseInt(this.data.order_item[i]['qty']) - parseInt(this.data.order_item[i]['sale_dispatch_qty']) })
            }
        }

        if (this.data.from == 'dr-convert') {
            this.getCusNetwork(this.data.network_type)
        }


        this.tmpOrderStatus = this.data.order_status;
        if (this.tmpOrderStatus) {
            if (this.data.pageType) {
                this.pageType = this.data.pageType;
                this.data.order_status = this.data.order_status;
            }
            else {
                this.data.order_status = '';
                this.data.reason = '';
            }

        }
    }

    ngOnInit() {
        if (this.delivery_from == 'assignDist') {
            this.distributorList('', this.data.state)
            this.distributorDetail();

        }
        else if (this.delivery_from == 'assignSales') {
            this.distributorDetail();
            this.getSalesUser('');
        }
        else if (this.delivery_from == 'ScanningRedemptionReport' || this.delivery_from == 'AdminLoyaltyReport') {
            this.getSalesUser('');
        }


        else if (this.delivery_from == 'subcategory-list') {
            this.data.segment_id = this.data.master_category_id.toString();
            this.getSegment();
        }
        else if (this.delivery_from == 'edit_travel_plan_retailer') {
            this.data.employee_id = this.data.employee_id.toString();
            this.data.id = this.data.travel_plan_id.toString();
            this.data.distributor_id = this.data.drId.toString();
            this.allCustomerNetworkList('');
        }
        else if (this.delivery_from == 'add_travel_plan_retailer') {
            this.data.employee_id = this.data.employee_id.toString();
            this.data.id = this.data.travel_plan_id.toString();
            this.allCustomerNetworkList('');

        }
        else if (this.delivery_from == 'month_wise_secondary_sale' || this.delivery_from == 'StateWiseRedeemReport' || this.delivery_from == 'StateWiseCouponReport') {
            this.getStateList('');
        }

        else if (this.delivery_from == 'beat_code_view') {
            this.getBeatCodeNetwork();
        }

        else if (this.delivery_from == 'beat_code_map_view') {
            this.getBeatCodeNetwork();
            this.getMap();
        }
        else if (this.delivery_from == 'primaryVsSecondaryReport' || this.delivery_from == 'UserMonthlyReport' || this.delivery_from == 'ProductWisePrimaryReport') {
            this.getSalesUser('')
        }
        else if (this.data.from == 'request_product_data') {
            this.reqProductDetails = this.data.reqProductData.product_details;
        }
        else if (this.data.from == 'stockRequestDetailsModal') {
            this.stockRequestDetails = this.data.reqProductData;
        }

        else if (this.data.from == 'send_product_data') {
            this.sendProductDetails = this.data.sendProductData.product_details;
        }
        else if (this.data.from == 'stock_product_trans') {
            this.dr_outDetails = this.data.stockProductTrans.dr_out;
            this.dr_inDetails = this.data.stockProductTrans.dr_in;
        }
        else if (this.data.from == 'sendStockToRetailer') {
            this.getNetworkList('');
            this.stockForm.type = this.data.type;
        }
        else if (this.data.from == 'add_new_follow_up') {
            this.getSalesUser('')
        }
        else if (this.data.from == 'approve_transfer_equest') {
            this.transferRequestData = this.data.requestData;
            this.data.requestId = this.transferRequestData.id;
        }
        else if (this.data.from == 'badge') {
            this.getEnrollInfluencer()
        }
        else if (this.data.from == 'spinwin') {
            this.getEnrollSpinInfluencer()
        }


        this.login = JSON.parse(localStorage.getItem('login'));
    }


    getTransport() {
        this.service.post_rqst({}, "Order/transportCompanyName").subscribe((result => {
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


    getPincode(search, val) {
        let st_name;
        let dist_name;

        if (val == 1) {
            st_name = this.data.state;
            dist_name = this.data.district;
        }
        this.service.post_rqst({ 'state_name': st_name, 'district_name': this.data.district, 'search': search }, "Master/all_pincode_list").subscribe((result => {
            if (result['statusCode'] == 200) {
                this.pincode_list = result['all_pincode'];
            }
            else {
                this.toast.errorToastr(result['statusMsg'])
            }
        }));

    }


    reason_reject: any
    primary_order_status_change(reason, status) {
        if (status == 'readyToDispatch') {
            for (let i = 0; i < this.order_item.length; i++) {
                let indexValue = i + 1;
                if (this.order_item[i]['qty'] == 0) {
                    if ((parseInt(this.order_item[i]['dispatch_qty'])) > this.order_item[i]['order_qty']) {
                        this.toast.errorToastr('Row number ' + indexValue + ' remaining QTY. can not be greater than QTY.');
                        return;
                    }
                }
                if (this.order_item[i]['qty'] > 0) {
                    if (parseInt(this.order_item[i]['dispatch_qty']) > parseInt(this.order_item[i]['order_qty']) - parseInt(this.order_item[i]['qty'])) {
                        let value = parseInt(this.order_item[i]['order_qty']) - parseInt(this.order_item[i]['qty'])
                        this.toast.errorToastr('Row number ' + indexValue + ' Dispatch QTY. can not be greater than remaining QTY. ' + value);
                        return;
                    }
                }
            }
            this.dialog1.confirm('You want to update dispatch planned?').then((result) => {
                if (result) {
                    this.savingFlag = true;
                    this.service.post_rqst({ 'dispatch_item': this.order_item, 'status': status, 'id': this.data.order_id, 'organisation_id': this.data.organisation_id, 'transport_id': this.data.transport_id, 'action_by': this.login.data.id, 'uid': this.userId, 'uname': this.userName }, "dispatch/dispatchOrderCreate").subscribe((result => {
                        if (result['statusCode'] == 200) {
                            this.dialog.closeAll();
                            this.savingFlag = false;
                            this.toast.successToastr(result['statusMsg']);
                        }
                        else {
                            this.savingFlag = false;
                            this.toast.errorToastr(result['statusMsg'])
                        }
                    }))
                }
            });



        }
        else {
            if (this.data.creditLimit < this.data.openOrder) {
                this.dialog1.confirm('Your credit limit is less than the open order amount, so you need to update the order status.').then((result) => {
                    if (result) {
                        this.updateStatus(reason, status)
                    }
                });
            }
            else {
                this.updateStatus(reason, status)
            }
        }

    }

    EditTarget() {
        this.service.post_rqst({ 'id': this.data.id, 'target': this.data.target }, "Target/updateDistributorsSecondaryTarget").subscribe(result => {
            if (result['statusCode'] == 200) {
                this.toast.successToastr(result['statusMsg'])
                this.dialog.closeAll();
            }
            else {
                this.savingFlag = false;
                this.toast.errorToastr(result['statusMsg'])
            }
        }, () => {

            this.savingFlag = false;
            this.toast.errorToastr('Something went wrong')
        })
    }
    updateStatus(reason, status) {
        this.savingFlag = true;
        this.service.post_rqst({ 'reason': reason, 'status_remark': this.data.status_remark, 'status': status, 'transport_id': this.data.transport_id, 'id': this.data.order_id, 'organisation_id': this.data.organisation_id, 'action_by': this.login.data.id, 'uid': this.userId, 'uname': this.userName, 'driver_name': this.data.driver_name, 'driver_mobile_number': this.data.driver_mobile_number, 'vehicle_no': this.data.vehicle_no, 'dispatch_date': this.data.dispatch_date }, this.pageType == 'quotation' ? "Enquiry/quotationStatusChange" : "Order/primaryOrderStatusChange").subscribe((result => {
            if (result['statusCode'] == 200) {
                this.dialog.closeAll();
                this.savingFlag = false;
                this.toast.successToastr(result['statusMsg']);
            }
            else {
                this.savingFlag = false;
                this.toast.errorToastr(result['statusMsg'])
            }

        }))
    }


    selectWarehouse(value) {
        if (value.value == "Yes") {
            this.service.post_rqst({}, "Dispatch/fetchWarehouse").subscribe((result => {
                if (result['statusCode'] == 200) {
                    this.warehouse = result['result'];
                }
                else {
                    this.toast.errorToastr(result['statusMsg']);
                }
            }));

        }
        else {
            this.data.warehouse_id = '';
            this.warehouse = [];
        }

    }
    secondary_order_status_change(reason, status) {
        this.savingFlag = true;
        this.service.post_rqst({ 'reason': reason, 'status': status, 'id': this.data.order_id, 'action_by': this.login.data.id, 'uid': this.userId, 'uname': this.userName }, "Order/secondaryOrderStatusChange").subscribe((result => {
            if (result['statusCode'] == 200) {
                this.dialog.closeAll();
                this.savingFlag = false;
                this.toast.successToastr(result['statusMsg']);
            }
            else {
                this.savingFlag = false;
                this.toast.errorToastr(result['statusMsg'])
            }
        }))
    }


    getCompanyData() {
        this.service.post_rqst({}, "Order/billingCompanyName").subscribe((result => {
            if (result['statusCode'] == 200) {
                this.organisationData = result['result'];
                if (this.organisationData.length == 1) {
                    this.data.organisation_id = this.organisationData[0]['id'].toString();
                }
            } else {
                this.toast.errorToastr(result['statusMsg']);
            }

        }));
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
    distributorDetail() {
        let id = { "id": this.data.drId }
        this.service.post_rqst(id, "CustomerNetwork/distributorDetail").subscribe((result) => {
            if (result['statusCode'] == 200) {
                this.data = result['distributor_detail'];
                this.data.id = result['distributor_detail']['id'];
                this.data.assigned_sales_user_name = this.data['assigned_sales_user_name'].map(String);
                this.data.distributor_id = this.data['distributors_id'].map(String);
            }
            else {
                this.toast.errorToastr(result['statusMsg'])
            }
        }
        )
    }


    allCustomerNetworkList(searcValue) {
        this.drlist = [];
        this.service.post_rqst({ 'search': searcValue, 'type': this.data.drType, 'employee_id': this.data.employee_id }, "Travel/drList").subscribe((result => {
            if (result['statusCode'] == 200) {
                this.drlist = result['result'];
            } else {
                this.toast.errorToastr(result['statusMsg']);
            }
        }))
    }


    getSegment() {
        this.service.post_rqst({}, "Master/getProductCategoryList").subscribe((result => {
            if (result['statusCode'] == 200) {
                this.segmentList = result['segment_list'];
            }
            else {
                this.savingFlag = false;
                this.toast.errorToastr(result['statusCode'])
            }
        }))
    }
    UpdateSalesUser() {
        this.savingFlag = true;
        setTimeout(() => {
            this.service.post_rqst({ 'drId': this.data.id, 'userArray': this.data.assigned_sales_user_name, 'company_name': this.data.company_name }, "CustomerNetwork/drUserAssign").subscribe((result => {
                if (result['statusCode'] == 200) {
                    this.dialog.closeAll();
                    this.savingFlag = false;
                    this.toast.successToastr(result['statusMsg']);
                }
                else {
                    this.savingFlag = false;
                    this.toast.errorToastr(result['statusMsg'])
                }
            }))
        }, 2000);
    }
    // distArray(data){
    //   this.assignDistArray = []
    //   let index = this.drlist.findIndex(row => row.id == data)
    //   if(index != -1){
    //     this.assignDistArray.push(this.drlist[index].id)
    //   }
    // }
    UpdateDistributor() {
        this.savingFlag = true;
        this.service.post_rqst({ 'drId': this.data.id, 'distributorId': this.data.distributor_id }, "CustomerNetwork/dealerDistributorAssign").subscribe((result => {
            if (result['statusCode'] == 200) {
                this.dialog.closeAll();
                this.savingFlag = false;
                this.toast.successToastr(result['statusMsg']);
            }
            else {
                this.savingFlag = false;
                this.toast.errorToastr(result['statusMsg'])
            }
        }))
    }
    UpdateCustomerNetworkTravel() {
        this.savingFlag = true;
        this.service.post_rqst({ 'id': this.data.id, 'dr_id': this.data.distributor_id }, "Travel/drChange").subscribe((result => {
            if (result['statusCode'] == 200) {

                this.dialogRef.close(true);
                this.savingFlag = false;
                this.toast.successToastr(result['statusMsg']);
            }
            else {
                this.savingFlag = false;
                this.toast.errorToastr(result['statusMsg'])
            }
        }))
    }


    getDrType(networkData) {
        this.dr_data.push(networkData);
    }

    AddCustomerNetworkTravel() {
        this.savingFlag = true;
        this.service.post_rqst({ 'id': this.data.id, 'drData': this.dr_data, 'data': this.data }, "Travel/addDr").subscribe((result => {
            if (result['statusCode'] == 200) {
                this.dialogRef.close(true);
                this.savingFlag = false;
                this.toast.successToastr(result['statusMsg']);
            }
            else {
                this.savingFlag = false;
                this.toast.errorToastr(result['statusMsg'])
            }
        }))
    }


    addToList() {

        if (!this.data.discount_name) {
            this.toast.errorToastr('Discount name is required');
            return
        }
        if (!this.data.discount_value) {
            this.toast.errorToastr('Discount Value is required');
            return
        }


        if (this.discountList.length > 0) {
            let existIndex
            existIndex = this.discountList.findIndex(row => row.discount_name === this.data.discount_name);
            if (existIndex != -1) {
                this.discountList.splice(existIndex, 1)
                this.discountList.push({
                    'discount_name': this.data.discount_name,
                    'discount_value': this.data.discount_value,

                });
            }
            else {
                this.discountList.push({
                    'discount_name': this.data.discount_name,
                    'discount_value': this.data.discount_value,
                });
            }
        }
        else {
            this.discountList.push({
                'discount_name': this.data.discount_name,
                'discount_value': this.data.discount_value,
            });
        }
        this.data.discount_name = '';
        this.data.discount_value = '';
    }


    deleteDiscount(i) {
        this.dialog1.confirm("You want to delete it?").then((result) => {
            if (result) {
                this.discountList.splice(i, 1);
            }
        })
    }

    add_segment() {
        this.savingFlag = true;
        this.data.created_by_name = this.userName;
        this.data.created_by_id = this.userId;
        if (this.logined_user_data.organisation_data.additional_discount == '1' && this.discountList.length > 0) {
            this.data.discountList = this.discountList;
        }
        this.service.post_rqst(this.data, "Master/addCategory").subscribe((result => {
            if (result['statusCode'] == 200) {
                this.toast.successToastr(result['statusMsg']);
                this.savingFlag = false;
                this.dialogRef.close(true)
                this.service.count_list();
            }
            else {
                this.toast.errorToastr(result['statusMsg']);
                this.savingFlag = false;
            }
        }))

    }

    updateDiscount() {
        this.dialog1.confirm('You want to update?').then((result) => {
            if (result) {
                this.savingFlag = true;
                this.service.post_rqst({ 'data': this.data }, "CustomerNetwork/additionalDrDiscount").subscribe((result => {
                    if (result['statusCode'] == 200) {
                        this.dialogRef.close(true);
                        this.savingFlag = false;
                        this.toast.successToastr(result['statusMsg']);
                    }
                    else {
                        this.savingFlag = false;
                        this.toast.errorToastr(result['statusMsg'])
                    }
                }))
            }
        });
    }
    add_subCategory() {
        this.savingFlag = true;
        this.data.created_by_name = this.userName;
        this.data.created_by_id = this.userId;
        this.service.post_rqst(this.data, "Master/addSubCategory").subscribe((result => {
            if (result['statusCode'] == 200) {
                this.toast.successToastr(result['statusMsg']);
                this.savingFlag = false;
                this.dialogRef.close(true)
                this.service.count_list();
            }
            else {
                this.toast.errorToastr(result['statusMsg']);
                this.savingFlag = false;
            }
        }))
    }

    downloadTravelReport() {
        this.savingFlag = true;
        this.data.date_from ? (this.data.date_from = moment(this.data.date_from).format('YYYY-MM-DD')) : null;
        this.data.date_to ? (this.data.date_to = moment(this.data.date_to).format('YYYY-MM-DD')) : null;
        let apiName = '';
        if (this.delivery_from == 'tavel_plan') {
            apiName = "Reports/TravelPlanReport"
        }
        this.service.post_rqst({ "date_from": this.data.date_from, "date_to": this.data.date_to }, apiName).subscribe((result: any) => {
            if (result['statusCode'] == 200) {

                this.savingFlag = false;
                window.open(this.service.downloadUrl + result['filename'])
                // return true;
            } else {
                this.savingFlag = false;
            }
        }, () => this.savingFlag = false)
    }


    downloadsecondarySaleReport() {
        this.savingFlag = true;
        this.service.post_rqst({ "filter": this.data }, 'Excel/monthWiseDealerSaleReport').subscribe((result: any) => {
            if (result['msg'] == true) {
                this.savingFlag = false;
                window.open(this.service.downloadUrl + result['filename'])
                // return true;
            } else {
                this.savingFlag = false;
            }
        }, () => this.savingFlag = false)
    }


    downloadprimaryvssecondaryReport() {
        this.data.start_date = moment(this.data.start_date).format('YYYY-MM-DD');
        this.data.end_date = moment(this.data.end_date).format('YYYY-MM-DD');
        this.savingFlag = true;
        this.service.post_rqst({ "filter": this.data }, 'Excel/primaryVsSecondaryReport').subscribe((result: any) => {
            if (result['msg'] == true) {
                this.savingFlag = false;
                window.open(this.service.downloadUrl + result['filename'])
                // return true;
            } else {
                this.savingFlag = false;
            }
        }, () => this.savingFlag = false)
    }

    downloadstateWisePrimarySecondaryReport() {
        this.data.start_date = moment(this.data.start_date).format('YYYY-MM-DD');
        this.data.end_date = moment(this.data.end_date).format('YYYY-MM-DD');
        this.savingFlag = true;
        this.service.post_rqst({ "start_date": this.data.start_date, "end_date": this.data.end_date }, 'Excel/stateWisePrimarySecondaryReport').subscribe((result: any) => {
            if (result['msg'] == true) {
                this.savingFlag = false;
                window.open(this.service.downloadUrl + result['filename'])
                // return true;
            } else {
                this.savingFlag = false;
            }
        }, () => this.savingFlag = false)
    }



    downloadstateWiseRedeemtionCountReport() {

        if (this.delivery_from == 'StateWiseCouponReport' || this.delivery_from == 'ScannedRedemptionReport' || this.delivery_from == 'AdminLoyaltyReport') {

            this.downLoadReport(this.delivery_from);
        } else {

            this.data.start_date = moment(this.data.start_date).format('YYYY-MM-DD');
            this.data.end_date = moment(this.data.end_date).format('YYYY-MM-DD');
            this.filter.date_from = this.data.start_date;
            this.filter.date_to = this.data.end_date;
            this.filter.state = this.data.state;
            this.savingFlag = true;
            this.service.post_rqst({ 'filter': this.filter }, 'LoyaltyReport/downloadRedeemReportStateWise').subscribe((result: any) => {
                if (result['msg'] == true) {
                    this.savingFlag = false;
                    window.open(this.service.downloadUrl + result['filename'])
                    // return true;
                } else {
                    this.savingFlag = false;
                }
            }, () => this.savingFlag = false)
        }
    }




    downLoadReport(type) {
        this.progressService.setCancelReq(false);
        this.downloadInChunks(type);
    }
    downloadproductwisePrimaryReport() {
        this.data.date_from = moment(this.data.start_date).format('YYYY-MM-DD');
        this.data.date_to = moment(this.data.end_date).format('YYYY-MM-DD');
        this.savingFlag = true;
        this.service.post_rqst({ "search": this.data }, 'Excel/ProductWisePrimaryReport').subscribe((result: any) => {
            if (result['msg'] == true) {
                this.savingFlag = false;
                window.open(this.service.downloadUrl + result['filename'])
                // return true;
            } else {
                this.savingFlag = false;
                this.toast.errorToastr(result['statusMsg']);
            }
        }, () => { this.savingFlag = false; this.toast.errorToastr('Something went wrong'); })
    }

    downLoadMonthlyReport() {
        this.savingFlag = true;
        this.service.post_rqst({ filter: { "user_id": this.data.user_id, "month": this.data.month, "year": this.data.year } }, 'DownloadMaster/monthlySalesReports').subscribe((result: any) => {
            if (result['msg'] == true) {
                this.savingFlag = false;
                window.open(this.service.downloadUrl + result['filename'])
            } else {
                this.savingFlag = false;
                this.toast.errorToastr(result['statusMsg']);
            }
        }, () => { this.savingFlag = false; this.toast.errorToastr('Something went wrong'); })
    }

    downloadInChunks(type) {
        let payload = { 'start': this.start, 'pagelimit': this.page_limit }
        this.service.post_rqst(payload, "DownloadMaster/createQueueRequest").subscribe((result) => {
            if (result['statusCode'] == 200) {
                if (result['code'] == 0) {
                    this.toast.errorToastr(result['statusMsg']);
                    return;
                }

                if (result['code'] == 1) {
                    this.dialog.closeAll();
                    this.downloadExcel(type);
                }
            }
        }, err => {
            this.excelLoader = false;

        });
    }

    downloadExcel(type) {

        let can
        this.progressService.getCancelReq().subscribe(cancelReq => {
            can = cancelReq
        })



        if (type == 'redeem_data' || type == 'StateWiseCouponReport' || type == 'ScannedRedemptionReport'
            || type == 'AdminLoyaltyReport'
        ) {
            this.data.date_from = moment(this.data.start_date).format('YYYY-MM-DD');
            this.data.date_to = moment(this.data.end_date).format('YYYY-MM-DD');
        } else {
            this.data.date_from = moment(this.data.date_from).format('YYYY-MM-DD');
            this.data.date_to = moment(this.data.date_to).format('YYYY-MM-DD');
        }


        if (can == false) {
            this.downloader = true;
            if (this.download_percent == null) {
                this.download_percent = 0;
            }
            let payLoad = {}
            let apiHeader = {}

            if (type == 'secondary' || type == 'InfluencePointReport') {
                payLoad = { filter: { "date_from": this.data.date_from, "date_to": this.data.date_to } }
            }

            if (type == 'redeem_data') {
                payLoad = { search: { "date_from": this.data.date_from, "date_to": this.data.date_to, 'redeem_type': this.data.redeem_type } }
            }


            if (type == 'StateWiseCouponReport') {
                payLoad = { filter: { "date_from": this.data.date_from, "date_to": this.data.date_to, 'state': this.data.state } }
            }

            if (type == 'ScannedRedemptionReport') {
                payLoad = { filter: { "date_from": this.data.date_from, "date_to": this.data.date_to } }
            }
            if (type == 'customerReport') {
                payLoad = { filter: { "date_from": this.data.date_from, "date_to": this.data.date_to } }
            }
            if (type == 'ScanningRedemptionReport') {
                payLoad = { filter: { "date_from": this.data.date_from, "date_to": this.data.date_to, 'assigned_sales_user_name': this.data.assigned_sales_user_name } }
            }

            if (type == 'scanningCategorywiseReport') {
                payLoad = { filter: { "date_from": this.data.date_from, "date_to": this.data.date_to } }
            }

            if (type == 'secondary') {
                apiHeader = "DownloadMaster/downloadOrderSummaryReport"
            }
            if (type == 'customerReport') {
                apiHeader = "DownloadMaster/customerReport"
            }
            if (type == 'ScanningRedemptionReport') {
                apiHeader = "LoyaltyReport/InfluencersScanningRedemptionReport"
            }

            if (type == 'InfluencePointReport') {
                apiHeader = "DownloadMaster/influencerDataWithPointsCalculation"
            }


            if (type == 'redeem_data') {
                apiHeader = "LoyaltyReport/downloadRedeemData"
            }

            if (type == 'StateWiseCouponReport') {
                apiHeader = "LoyaltyReport/downloadScannedReportStateWise"
            }
            if (type == 'AdminLoyaltyReport') {
                payLoad = { 'data': this.data }
                apiHeader = "LoyaltyReport/downloadAdminLoyaltyReport"
            }

            if (type == 'ScannedRedemptionReport') {
                apiHeader = "DownloadMaster/scannedAndRedeemPointReport"
            }
            if (type == 'scanningCategorywiseReport') {
                apiHeader = "LoyaltyReport/influencerScanReportCategoryWise "
            }



            this.service.post_rqst(payLoad, apiHeader).subscribe((result) => {
                if (result['code'] === 1) {
                    this.downloader = false;
                    this.download_percent = null;
                    window.open(this.downurl + result['filename']);
                    this.progressService.setTotalCount(0);
                    this.progressService.setRemainingCount(0);
                    this.progressService.setDownloadProgress(0);
                    this.progressService.setDownloaderActive(false);
                } else if (result['code'] === 0) {
                    this.download_percent = Math.ceil(((result['totalCount'] - result['leftCount']) / result['totalCount']) * 100);

                    if (this.download_percent > 100) {
                        this.download_percent = 100;
                    }
                    this.totalCount = result['totalCount'];
                    this.remainingCount = result['leftCount'];
                    this.progressService.setTotalCount(this.totalCount);
                    this.progressService.setRemainingCount(this.remainingCount);
                    this.progressService.setDownloadProgress(this.download_percent);
                    this.progressService.setDownloaderActive(this.downloader);
                    this.downloadExcel(type);
                }

            }, err => {
                this.excelLoader = false;

            });
        }
    }

    downloadRedeemReport() {
        this.data.date_from = moment(this.data.start_date).format('YYYY-MM-DD');
        this.data.date_to = moment(this.data.end_date).format('YYYY-MM-DD');
        this.savingFlag = true;
        this.service.post_rqst({ "search": this.data }, 'LoyaltyReport/downloadRedeemData').subscribe((result: any) => {
            if (result['msg'] == true) {
                this.savingFlag = false;
                window.open(this.service.downloadUrl + result['filename'])
                // return true;
            } else {
                this.savingFlag = false;
                this.toast.errorToastr(result['statusMsg']);
            }
        }, () => { this.savingFlag = false; this.toast.errorToastr('Something went wrong'); })
    }


    getStateList(search) {
        this.service.post_rqst({ 'search': search }, "Influencer/getAllState").subscribe((result => {
            if (result['statusCode'] == 200) {
                this.states = result['all_state'];
            }
            else {
                this.toast.errorToastr(result['statusMsg']);
            }
        }));
    }

    getAssignDistributorOfSalesman(value) {
        this.service.post_rqst({ 'userId': this.data.assigned_sales_user_name, 'search': value }, "Reports/distributorAssign").subscribe((result => {
            if (result['statusCode'] == 200) {
                this.assignDistArray = result['result'];
            }
            else {
                this.toast.errorToastr(result['statusMsg']);
            }
        }));
    }


    search_val: any = {}

    arrayFilter() {
        let id = this.order_item.map(e => e.product_name).indexOf(this.search_val.created_by_name);
        return id;
    }


    checkValidation(order_qty, qty, dispatch, index) {

        if (qty == 0) {
            if ((parseInt(dispatch)) > order_qty) {
                this.toast.errorToastr('Row number ' + index + ' dispatch QTY. can not be greater than QTY.');
                return;
            }
        }
        if (qty > 0) {
            if ((dispatch > parseInt(order_qty) - parseInt(qty))) {
                let value = parseInt(order_qty) - parseInt(qty)
                this.toast.errorToastr('Row number ' + index + ' dispatch QTY. can not be greater than remaining QTY. ' + value);
                return;
            }
        }

    }

    requestStatusChange(reason, status) {
        this.savingFlag = true;
        this.service.post_rqst({ 'reason': reason, 'status': status, 'requestId': this.data.requestId, 'action_by': this.login.data.id, 'uid': this.userId, 'uname': this.userName }, "Order/").subscribe((result => {
            if (result['statusCode'] == 200) {
                this.dialog.closeAll();
                this.savingFlag = false;
                this.toast.successToastr(result['statusMsg']);
            }
            else {
                this.savingFlag = false;
                this.toast.errorToastr(result['statusMsg'])
            }
        }))
    }


    salesIn: any = [];
    salesOut: any = [];

    getStock() {
        this.service.post_rqst({ 'id': this.data.stockProductTrans.id, 'product_id': this.data.stockProductTrans.product_id, 'dr_id': this.data.id }, "stock/salesReturnPartyList").subscribe((result => {
            if (result['statusCode'] == 200) {
                this.salesIn = result['return_in'];
                this.salesOut = result['return_out'];

            } else {
                this.toast.errorToastr(result['statusMsg']);
            }
        }))
    }

    getSalesUser(searchValue) {
        this.service.post_rqst({ 'search': searchValue, 'state': this.data.state, 'district': this.data.district }, 'Expense/salesUserList').subscribe((result => {
            if (result['statusCode'] == 200) {
                this.salesUser = result['all_sales_user'];

            } else {
                this.toast.errorToastr(result['statusMsg']);
            }
        }));
    }


    getNetworkType() {
        this.service.post_rqst('', "Followup/leadNetworkModule").subscribe((result => {
            if (result['statusCode'] == 200) {
                this.networkType = result['modules'];
            }
            else {
                this.toast.errorToastr(result['statusMsg'])
            }
        }))
    }


    allDistributorForSelectedExecutive(searcValue) {
        this.drlist = [];
        this.service.post_rqst({ 'search': searcValue, 'type': this.data.dr_type, 'employee_id': this.data.user_id }, "Followup/drList").subscribe((result => {
            if (result['statusCode'] == 200) {
                this.drlist = result['result'];
            } else {
                this.toast.errorToastr(result['statusMsg']);
            }
        }))
    }

    addNewFollowUp() {
        this.data.next_followup_date = moment(this.data.followup_date).format('YYYY-MM-DD');
        this.savingFlag = true;
        this.service.post_rqst({ 'data': this.data }, "Followup/addFollowup").subscribe((result => {
            if (result['statusCode'] == 200) {
                this.toast.successToastr(result['statusMsg']);
                this.dialog.closeAll();
                setTimeout(() => {
                    this.savingFlag = false;
                }, 700);
            }
            else {
                this.toast.errorToastr(result['statusMsg']);

            }
        }))

    }

    addIntoToList() {
        let newData
        newData = this.stockForm;
        if (this.add_list.length == 0) {
            this.add_list.push({ 'product': newData.product, 'qty': newData.qty, 'transferPoints': newData.transferPoints });
        }
        else {
            let existIndex = this.add_list.findIndex(row => (row.product.id == this.stockForm['product']['id']));
            if (existIndex != -1) {
                this.toast.errorToastr('Already same product added to items')

                // this.add_list[existIndex].qty=parseInt(this.add_list[existIndex].qty)+parseInt(newData.qty);
                // this.add_list[existIndex].transferPoints = parseInt(this.add_list[existIndex].transferPoints)+parseInt(newData.transferPoints);


            }
            else {
                this.add_list.push({ 'product': newData.product, 'qty': newData.qty, 'transferPoints': newData.transferPoints });
            }

        }
        this.stockForm.product = '';
        this.stockForm.qty = '';
        this.stockForm.transferPoints = '';
    }

    deleteItem(i) {
        this.dialog1.confirm("Delete Item From List?").then((result) => {
            if (result) {
                this.add_list.splice(i, 1);
            }
        })
    }

    searchItems(event, searchType) {
        let item = event.target.value.toLowerCase();
        this.tempSearch = '';
        if (searchType == 'dealer') {
            this.networklist = [];
            for (let x = 0; x < this.networklist2.length; x++) {
                this.tempSearch = this.networklist2[x].name.toLowerCase();
                if (this.tempSearch.includes(item)) {
                    this.networklist.push(this.networklist2[x]);
                }
            }
        }
        else {
            this.productlist = [];
            for (let x = 0; x < this.productlist2.length; x++) {
                this.tempSearch = this.productlist2[x].product_name.toLowerCase();
                if (this.tempSearch.includes(item)) {
                    this.productlist.push(this.productlist2[x]);
                }
            }
        }
    }

    getNetworkList(masterSearch) {
        this.service.post_rqst({ 'master_search': masterSearch, 'userId': this.userId }, "Stock/assignedCustomer").subscribe((result) => {
            if (result['statusCode'] == 200) {
                this.networklist = result['result'];
                this.networklist2 = result['result'];
            } else {
                this.toast.errorToastr(result['statusMsg'])
            }
        })
    }

    getProductList(masterSearch) {
        this.service.post_rqst({ 'master_search': masterSearch, 'userId': this.userId }, this.data.type == 'Transfer' ? 'Stock/fetchNonScannedProduct' : 'Stock/fetchProduct').subscribe((result) => {
            if (result['statusCode'] == 200) {
                this.productlist = result['result'];
                this.productlist2 = result['result'];
            } else {
                this.toast.errorToastr(result['statusMsg'])
            }
        })
    }

    getfieldsClear() {
        this.stockForm.qty = '';
        this.stockForm.transferPoints = '';
    }

    saveStockToRetailer() {
        this.savingFlag = true;
        this.stockForm.add_list = this.add_list;
        this.service.post_rqst({ "data": this.stockForm, 'drId': this.data.drId }, this.stockForm.type == 'Transfer' ? "Stock/sendCustomerPoints" : "Stock/salesReturnRetailer").subscribe((result) => {
            if (result['statusCode'] == 200 && result['statusMsg'] == 'Success') {
                this.toast.successToastr(result['statusMsg']);
                this.dialogRef.close();
                this.savingFlag = false;
            }
            else {
                this.toast.errorToastr(result['statusMsg']);
                this.savingFlag = false;
            }
        }, err => {
            this.savingFlag = false;

        })
    }

    getPointCalculation(data) {
        this.stockForm.transferPoints = data.product.dealer_point * data.qty;

        if (this.stockForm.transferPoints == 0) {
            this.stockForm.transferPoints = '';
        }

    }

    stockCheck() {
        if (this.stockForm.qty > this.stockForm.product.current_stock) {
            this.toast.errorToastr('Less Stock!, Current Stock of this product is ' + this.stockForm.product.current_stock)
            this.stockForm.qty = '';
            this.stockForm.transferPoints = '';
        }
    }

    ChangeRequestStatus() {
        this.savingFlag = true;
        this.service.post_rqst({ 'data': this.data, 'uid': this.userId, 'uname': this.userName }, "Stock/approveRequest").subscribe((result => {
            if (result['statusCode'] == 200 && result['statusMsg'] == 'Success') {
                this.dialog.closeAll();
                this.savingFlag = false;
                this.toast.successToastr(result['statusMsg']);
            }
            else {
                this.savingFlag = false;
                this.toast.errorToastr(result['statusMsg'])
            }
        }))
    }

    updatePop() {

        if (parseFloat(this.data.approved_qty) > parseFloat(this.data.qty)) {
            this.toast.errorToastr('Approved qty can not be greater than QTY.')
            return;
        }


        this.savingFlag = true;
        this.service.post_rqst({ 'data': this.data, 'action_by': this.login.data.id, 'uid': this.userId, 'uname': this.userName }, "PopGift/popStatusChange").subscribe((result => {
            if (result['statusCode'] == 200) {
                this.dialogRef.close(true);
                this.savingFlag = false;
                this.toast.successToastr(result['statusMsg']);
            }
            else {
                this.savingFlag = false;
                this.toast.errorToastr(result['statusMsg'])
            }
        }))

    }


    updateTarget() {
        this.savingFlag = true;

        if (this.data.from == 'target_status' && (this.data.target_type == 'Secondary Sales Projections' || this.data.target_type == 'Stock Sales Projections')) {
            let type = this.data.from == 'target_status_secondary' ? 'secondary' : 'stock';
            this.data.type = type;
            this.service.post_rqst({ 'data': this.data, 'action_by': this.login.data.id, 'uid': this.userId, 'uname': this.userName }, "Target/statusSecondaryChangeTarget").subscribe((result => {
                if (result['statusCode'] == 200) {
                    this.dialogRef.close(true);
                    this.savingFlag = false;
                    this.toast.successToastr(result['statusMsg']);
                }
                else {
                    this.savingFlag = false;
                    this.toast.errorToastr(result['statusMsg'])
                }
            }));
        }

        else if (this.data.from == 'target_status_secondary' && this.data.target_type == 'Secondary Visit Projections') {
            this.service.post_rqst({ 'data': this.data, 'action_by': this.login.data.id, 'uid': this.userId, 'uname': this.userName }, "Target/visitStatusChangeTarget").subscribe((result => {
                if (result['statusCode'] == 200) {
                    this.dialogRef.close(true);
                    this.savingFlag = false;
                    this.toast.successToastr(result['statusMsg']);
                }
                else {
                    this.savingFlag = false;
                    this.toast.errorToastr(result['statusMsg'])
                }
            }));
        }

        else if (this.data.from == 'target_status_secondary' || this.data.from == 'target_status_stock') {
            let type = this.data.from == 'target_status_secondary' ? 'secondary' : 'stock';
            this.data.type = type;
            this.service.post_rqst({ 'data': this.data, 'action_by': this.login.data.id, 'uid': this.userId, 'uname': this.userName }, "Target/secStatusChangeTarget").subscribe((result => {
                if (result['statusCode'] == 200) {
                    this.dialogRef.close(true);
                    this.savingFlag = false;
                    this.toast.successToastr(result['statusMsg']);
                }
                else {
                    this.savingFlag = false;
                    this.toast.errorToastr(result['statusMsg'])
                }
            }));
        }
        else {
            this.service.post_rqst({ 'data': this.data, 'action_by': this.login.data.id, 'uid': this.userId, 'uname': this.userName }, "Target/statusChangeTarget").subscribe((result => {
                if (result['statusCode'] == 200) {
                    this.dialogRef.close(true);
                    this.savingFlag = false;
                    this.toast.successToastr(result['statusMsg']);
                }
                else {
                    this.savingFlag = false;
                    this.toast.errorToastr(result['statusMsg'])
                }
            }));
        }
    }

    getAmount(inputAmount) {

        if (inputAmount > this.data.bill_amount) {


            this.toast.errorToastr('Not more than uploaded bill amount')
            this.data.total_approved_amt = '';

        }

    }
    updateTotalApprovedAmount() {
        // for(let i=0; i<this.data.bill_items.length; i++){
        //   if(this.data.bill_items[i].approved_amount > this.data.bill_items[i].item_amount){
        //     this.toast.errorToastr('Row number ' + (i+1) + ' Approved Amount can not be greater than' + this.data.bill_items[i].item_amount);
        //   }
        // }
        this.data.total_approved_amt = 0
        for (let i = 0; i < this.data.bill_items.length; i++) {
            this.data.total_approved_amt += this.data.bill_items[i].approved_amount;
        }

    }

    complaintStatusChange() {
        this.savingFlag = true;
        this.service.post_rqst({ "data": this.data, 'id': this.data.order_id, 'action_by': this.login.data.id }, "Order/secondaryOrdersBillValidate").subscribe((result => {
            if (result['statusCode'] == 200) {
                this.dialog.closeAll();
                this.savingFlag = false;
                this.toast.successToastr(result['statusMsg']);
            }
            else {
                this.savingFlag = false;
                this.toast.errorToastr(result['statusMsg'])
            }
        }))
    }


    influencer: any = [];
    loader: boolean = false;
    datanotfound: boolean = false;
    sr_no = 0;
    total_page: any = 0;
    pagenumber: any = 0;
    pageCount: any;
    endPage: any = 0;
    search: any = {}


    previousPage() {
        this.start = this.start - this.page_limit;
        this.getEnrollInfluencer();
    }

    nextPage() {
        this.start = this.start + this.page_limit;
        this.getEnrollInfluencer();
    }


    getEnrollInfluencer() {
        if (this.pagenumber > this.total_page) {
            this.pagenumber = this.total_page;
            this.start = this.pageCount - this.page_limit;
        }
        if (this.start < 0) {
            this.start = 0;
        }
        this.loader = true;
        this.service.post_rqst({ 'start': this.start, 'id': this.data.id, 'filter': this.search, 'pagelimit': this.page_limit }, "Bonus/influencerSlabList").subscribe((result => {
            if (result['statusCode'] == 200) {
                this.influencer = result['influencerData'];
                this.pageCount = result['count'];
                this.loader = false;
                if (this.segmentList.length == 0) {
                    this.datanotfound = true;
                } else {
                    this.datanotfound = false;
                }

                this.total_page = Math.ceil(this.pageCount / this.page_limit);
                this.pagenumber = Math.ceil(this.start / this.page_limit) + 1;
                if (this.start + this.page_limit >= this.pageCount) {
                    this.endPage = Math.ceil(this.start + this.page_limit - (this.pageCount / this.page_limit));
                } else if (this.pageCount == 1) {
                    this.endPage = '1';
                }
                else if (this.pageCount != 1 && this.pageCount < this.page_limit) {
                    this.endPage = this.pageCount;
                } else {
                    this.endPage = this.start + this.page_limit;
                }
                this.sr_no = this.pagenumber - 1;
                this.sr_no = this.sr_no * this.page_limit;
            }
            else {
                this.toast.errorToastr(result['statusMsg']);
                this.loader = false;
            }
        }
        ));
    }




    spinInfluencer: any = [];
    previousPage2() {
        this.start = this.start - this.page_limit;
        this.getEnrollSpinInfluencer();
    }

    nextPage2() {
        this.start = this.start + this.page_limit;
        this.getEnrollSpinInfluencer();
    }


    getEnrollSpinInfluencer() {
        if (this.pagenumber > this.total_page) {
            this.pagenumber = this.total_page;
            this.start = this.pageCount - this.page_limit;
        }
        if (this.start < 0) {
            this.start = 0;
        }
        this.loader = true;
        this.service.post_rqst({ 'start': this.start, 'id': this.data.id, 'filter': this.search, 'pagelimit': this.page_limit }, "Bonus/influencerSpinList").subscribe((result => {
            if (result['statusCode'] == 200) {
                this.spinInfluencer = result['influencerData'];
                this.pageCount = result['count'];
                this.loader = false;
                if (this.segmentList.length == 0) {
                    this.datanotfound = true;
                } else {
                    this.datanotfound = false;
                }

                this.total_page = Math.ceil(this.pageCount / this.page_limit);
                this.pagenumber = Math.ceil(this.start / this.page_limit) + 1;
                if (this.start + this.page_limit >= this.pageCount) {
                    this.endPage = Math.ceil(this.start + this.page_limit - (this.pageCount / this.page_limit));
                } else if (this.pageCount == 1) {
                    this.endPage = '1';
                }
                else if (this.pageCount != 1 && this.pageCount < this.page_limit) {
                    this.endPage = this.pageCount;
                } else {
                    this.endPage = this.start + this.page_limit;
                }
                this.sr_no = this.pagenumber - 1;
                this.sr_no = this.sr_no * this.page_limit;
            }
            else {
                this.toast.errorToastr(result['statusMsg']);
                this.loader = false;
            }
        }
        ));
    }



    getBeatCodeNetwork() {
        this.skLoading = true;
        this.service.post_rqst({ 'beat_code': this.data.beat_code, 'filter': this.filter }, "Master/assignedBeatCodeDrList").subscribe((result => {
            if (result['statusCode'] == 200) {
                this.beatArea = result['result'];
                this.skLoading = false;
            }
            else {
                this.skLoading = false;
                this.toast.errorToastr(result['statusMsg']);
            }
        }));
    }


    update_area() {
        this.savingFlag = true;
        this.data.created_by_name = this.userName;
        this.data.created_by_id = this.userId;
        this.service.post_rqst(this.data, "Master/updateTerritoryArea").subscribe((result => {
            if (result['statusCode'] == 200) {
                this.toast.successToastr(result['statusMsg']);
                this.savingFlag = false;
                this.dialogRef.close(true)
                this.service.count_list();

            }
            else {
                this.toast.errorToastr(result['statusMsg']);
                this.savingFlag = false;
            }

        }))

    }

    getMap2() {
        setTimeout(() => {
            if (this.myMap) {
                this.myMap.off();
                this.myMap.remove();
            }

            this.myMap = L.map('map');
            // this.myMap = L.map('map').setView([33.7455747, 75.1499785], 16);

            // Add OpenStreetMap layer
            var OSM = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                maxZoom: 22,
                attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            });
            OSM.addTo(this.myMap);

            // Array of locations
            const locations = [
                { "lat": 33.7456185, "lng": 75.1499867, "address": "P5W2+937, Chee, Anantnag, 192101" },
                { "lat": 33.7455747, "lng": 75.1499785, "address": "P5W2+937, Chee, Anantnag, 192101" },
                { "lat": 33.7455407, "lng": 75.1494204, "address": "P5W2+937, Chee, Anantnag, 192101" },
                { "lat": 33.746091, "lng": 75.1496128, "address": "P5W2+937, Chee, Anantnag, 192101" },
                { "lat": 33.7446091, "lng": 75.1493265, "address": "P5W2+937, Chee, Anantnag, 192101" },
                { "lat": 33.7452662, "lng": 75.1500416, "address": "P5W2+937, Chee, Anantnag, 192101" },
                { "lat": 33.7453919, "lng": 75.1498028, "address": "P5W2+937, Chee, Anantnag, 192101" },
                { "lat": 33.7454068, "lng": 75.1499634, "address": "P5W2+937, Chee, Anantnag, 192101" },
                { "lat": 33.7452834, "lng": 75.150022, "address": "P5W2+937, Chee, Anantnag, 192101" },
                { "lat": 33.745277, "lng": 75.1500489, "address": "P5W2+937, Chee, Anantnag, 192101" },
                { "lat": 33.7445989, "lng": 75.149224, "address": "P5W2+937, Chee, Anantnag, 192101" },
                { "lat": 33.7455332, "lng": 75.1500015, "address": "P5W2+937, Chee, Anantnag, 192101" },
                { "lat": 33.7454073, "lng": 75.14988, "address": "P5W2+937, Chee, Anantnag, 192101" }
            ];

            // Add markers for each location
            locations.forEach(location => {
                const marker = L.marker([location.lat, location.lng]).addTo(this.myMap);
                marker.setIcon(L.icon({
                    iconUrl: './assets/location/shop.png',
                    iconSize: [40, 40],
                    iconAnchor: [16, 32],
                    riseOnHover: true,
                }));
                marker.bindPopup('Address: ' + location.address);
            });

            // Define the boundary coordinates
            const boundaryCoordinates = [
                [33.7465, 75.1493],
                [33.7460, 75.1505],
                [33.7450, 75.1507],
                [33.7440, 75.1499],
                [33.7443, 75.1489],
                [33.7452, 75.1485],
                [33.7465, 75.1493]
            ];

            // Add a polygon to represent the boundary
            L.polygon(boundaryCoordinates, {
                color: 'red',
                weight: 2,
                opacity: 0.8,
                dashArray: '5, 5' // Dotted line style
            }).addTo(this.myMap);

        }, 1000);
    }


    getMap() {
        setTimeout(() => {
            if (this.myMap) {
                this.myMap.off();
                this.myMap.remove();
            }
            this.myMap = L.map('map');
            var OSM = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                maxZoom: 16,
                attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            });
            OSM.addTo(this.myMap);

            let location = []
            let allBlank = []
            const markerCoordinates = [];
            allBlank = this.beatArea.every(location => !location.lat.trim() && !location.lng.trim());
            if (allBlank) {
                this.toast.errorToastr('All party have blank latitude and longitude values.')
            }
            location = this.beatArea.filter(location => location.lat.trim() && location.lng.trim());
            location.forEach(location => {
                const marker = L.marker([location.lat, location.lng]).addTo(this.myMap);
                marker.setIcon(L.icon({
                    iconUrl: './assets/location/shop.png',
                    iconSize: [40, 40],
                    iconAnchor: [16, 32],
                    riseOnHover: true,
                }));
                marker.bindPopup('Customer detail: ' + location.customer_network_type + ' ' + location.company_name + ' ' + location.mobile);
                markerCoordinates.push([location.lat, location.lng]);
            });

            // Define the boundary coordinates
            // const boundaryCoordinates = [
            //     [28.433682921369098, 77.25421986631244],
            //     [28.426991918948296, 77.2837033039745],
            //     [28.38934715067947, 77.27704575353468],
            //     [28.378469505354968, 77.24756231587261],
            //     [28.344155778478047, 77.31223566300231],
            //     [28.38014306187901, 77.37595793149775],
            //     [28.311505600920025, 77.46535932311821],
            //     [28.287220763853025, 77.50435354712289],
            //     [28.234444960731288, 77.45775069404412],
            //     [28.216847221160965, 77.35693635881255],
            //     [28.22606544657686, 77.35978959471532],
            //     [28.267118777497913, 77.32745292115048],
            //     [28.26460576247332, 77.24946447314113],
            //     [28.268794087922657, 77.22283427138186],
            //     [28.29140820009866, 77.19905730552533],
            //     [28.360895567684782, 77.15150337381232],
            //     [28.366753870329475, 77.14769905927528],
            //     [28.405243240135526, 77.17623141830309],
            //     [28.411099093050062, 77.22188319274758],
            //     [28.43451926692695, 77.25326878767817],
            //     [28.428664709211404, 77.27989898943746],
            // ];

            // const boundary = L.polygon(boundaryCoordinates, {
            //     color: 'red',
            //     weight: 3,
            //     opacity: 0.4,
            //     dashArray: '5, 5' 
            // }).addTo(this.myMap);

            // Adjust map view to fit both markers and boundary
            // const allCoordinates = markerCoordinates.concat(boundaryCoordinates);
            this.myMap.fitBounds(markerCoordinates);

        }, 1000);
    }



    submit() {

        if (this.data.status == 'Approved' && (parseFloat(this.data.approved_point) > parseFloat(this.data.total_point_value))) {
            this.toast.errorToastr('Approved Point cannot be greater than claim points')
            return
        }

        this.savingFlag = true;

        this.service.post_rqst({ 'data': this.data }, "Purchase/statusChange").subscribe((result => {
            if (result['statusCode'] == 200) {
                this.dialogRef.close(true);
                this.savingFlag = false;
                this.toast.successToastr(result['statusMsg']);
            }
            else {
                this.savingFlag = false;
                this.toast.errorToastr(result['statusMsg'])
            }

        }))
    }


    getCusNetwork(type) {
        this.service.post_rqst({ 'type': type }, "CustomerNetwork/distributionNetworkSubType").subscribe((result => {
            if (result['statusCode'] == 200) {
                this.customerNetwork = result['result'];
                if (this.customerNetwork.length == 1) {
                    this.data.customer_network_type = this.customerNetwork[0]['name'];
                }

            } else {
                this.toast.errorToastr(result['statusMsg']);
            }
        }));
    }


    convertDr() {
        this.dialog1.confirm('Convert').then((result) => {
            if (result) {
                this.service.post_rqst({ 'type': this.data.dr_type, 'sub_type': this.data.customer_network_type, 'dr_id': this.data.dr_id }, "CustomerNetwork/dr_type_update").subscribe((result => {
                    if (result['statusCode'] == 200) {
                        this.dialog.closeAll();
                        this.toast.successToastr(result['statusMsg']);
                        if (this.data.dr_type == 1) {
                            this.rout.navigate(['/distribution-list/' + 1 + '/' + this.data.network_type]);
                        }
                        if (this.data.dr_type == 3) {
                            this.rout.navigate(['/distribution-list/' + 3 + '/' + this.data.network_type]);
                        }
                    } else {
                        this.toast.errorToastr(result['statusMsg']);
                    }
                }));
            }
        });
    }


    getDistrict() {
        this.data.district = [];
        this.service.post_rqst({ 'state_name': this.data.state }, "Master/getAllDistrict").subscribe((result => {
            if (result['statusCode'] == 200) {
                this.district_list = result['all_district'];
            }
            else {
                this.toast.errorToastr(result['statusMsg'])
            }
        }));

    }


    selectAllOption(type) {
        console.log(type);

        if (type == 'allDistrict') {
            console.log(type);
            setTimeout(() => {
                if (this.data.allWorkingDistrict == true) {
                    const allSelectedDistrict = [];
                    for (let i = 0; i < this.district_list.length; i++) {
                        allSelectedDistrict.push(this.district_list[i].district_name)
                        console.log(allSelectedDistrict);
                    }
                    console.log(allSelectedDistrict);
                    this.data.district = allSelectedDistrict;
                } else {
                    this.data.district = [];
                }
                this.getSalesUser('')
            }, 500);
        }
    }



}