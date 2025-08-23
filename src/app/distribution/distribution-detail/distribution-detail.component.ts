import { Component, OnInit, Renderer2, ElementRef, ViewChild } from '@angular/core';
import { slideToTop } from '../../router-animation/router-animation.component';
import { ActivatedRoute, Router } from '@angular/router';
import { DatabaseService } from 'src/_services/DatabaseService';
import { ToastrManager } from 'ng6-toastr-notifications';
import { MatBottomSheet, MatDialog } from '@angular/material';
import { DistributorModelComponent } from '../distributor-model/distributor-model.component';
import { sessionStorage } from 'src/app/localstorage.service';
import { DialogComponent } from 'src/app/dialog.component';
import * as moment from 'moment';
import { Chart } from 'chart.js';
import { Location } from '@angular/common'
import { InvoiceListModalComponent } from 'src/app/invoice-list-modal/invoice-list-modal.component';
import { StatusModalComponent } from 'src/app/order/status-modal/status-modal.component';
import { ConvertToDistributorComponent } from 'src/app/otp/convert-to-distributor/convert-to-distributor.component';
import { ImageModuleComponent } from 'src/app/image-module/image-module.component';
import { CryptoService } from 'src/_services/CryptoService';
import { UpdateKycComponent } from 'src/app/Influencer/update-kyc/update-kyc.component';
import { BottomSheetComponent } from 'src/app/bottom-sheet/bottom-sheet.component';
import { DesignationComponent } from 'src/app/user/designation/designation.component';
declare const L: any


@Component({
    selector: 'app-distribution-detail',
    templateUrl: './distribution-detail.component.html',
    animations: [slideToTop()]
})


export class DistributionDetailComponent implements OnInit {

    @ViewChild('barCanvas') private barCanvas: ElementRef;
    @ViewChild('targetbarCanvas') private targetbarCanvas: ElementRef;
    @ViewChild('lineCanvas') private lineCanvas: ElementRef;
    tabType: any = 'Profile';
    orderStatus: any = "Approved";
    month: any = 'Oct';
    ledgerType: any = "billing"
    discountFlag: boolean = false;
    productType: any = 'top';
    dr_id: any;
    encrypt_id: any;
    user_type: any;
    dr_detail: any;
    img_url = '';
    assign_sales_user: any = [];
    hide_line_chart: any = false
    hide_bar_chart: any = false
    hide_target_chart: any = false
    search_val: any = {};
    barChart: any;
    targetbarChart: any;
    lineChart: any;
    filter: any = {}
    latitude: any;
    longitude: any;
    zoom = 3;
    loader: any;
    login_data: any = {};
    ledger_data: any = [];
    walletTransaction: any = [];
    count: any = [];
    today_date: any;
    list: any = {};
    data: any = [];
    userData: any;
    userId: any;
    userName: any;
    document: any = []
    currentMonth: any;
    monthNames: string[];
    pageCount: any;
    totalCheckinTime: any = {};
    pagenumber: any = '';
    start: any = 0;
    total_page: any;
    page_limit: any;
    sr_no: any;
    date: any;
    currentMonth_no: any;
    currentYear: any;
    assignedBrands: any;
    transferRequestsList: any = [];
    sendRequestList: any = [];
    drStockData: any = [];
    tabCount: any = [];
    activeTab: any = 'Pending'
    sendRequestTab: any = 'Pending'
    stockTab: any = 'in_stock'
    drType: any;
    downurl: any = '';
    url: any;
    networkName: any = {}
    map: any;
    myMap: any;
    paramsTab: any = ''
    logined_user_data: any = {};
    network_type: any = {};
    activeAcc: any = {}
    wallet_history_type: any = 'ledger'

    removePercent20(inputString: string): string {
        return decodeURIComponent(inputString.replace(/%20/g, ' '));
    }

    constructor(
        public route: ActivatedRoute,
        private bottomSheet: MatBottomSheet,
        public rout: Router,
        public toast: ToastrManager,
        public service: DatabaseService,
        public alert: DialogComponent,
        public dialog: MatDialog,
        public session: sessionStorage,
        public cryptoService: CryptoService,
        public renderer: Renderer2,
        public location: Location,) {
        this.img_url = this.service.uploadUrl + 'influencer_doc/';
        console.log(this.img_url)
        this.page_limit = service.pageLimit;
        this.date = new Date();
        this.downurl = service.uploadUrl;
        this.monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec'];
        this.currentMonth = this.monthNames[this.date.getMonth()];
        this.currentYear = this.date.getFullYear();
        this.currentMonth_no = this.date.getMonth() + 1;
        this.userData = JSON.parse(localStorage.getItem('st_user'));
        this.activeAcc = JSON.parse(localStorage.getItem('activeAcc'));
        this.logined_user_data = this.userData['data'];
        this.userId = this.userData['data']['id'];
        this.userName = this.userData['data']['name'];
        this.login_data = this.session.getSession();
        this.login_data = this.login_data.data;
        this.route.params.subscribe(params => {
            this.paramsTab = this.route.queryParams['_value']['tab']
            this.network_type = this.route.queryParams['_value']['user_type'];
        })

    }

    ngAfterViewInit() {
        this.route.params.subscribe(params => {
            let id = params.id.replace(/_/g, '/');
            let usertype
            usertype = params.type
            this.dr_id = this.logined_user_data.user_type == 'DMS' ? this.activeAcc.id : this.cryptoService.decryptId(id);
            this.encrypt_id = this.logined_user_data.user_type == 'DMS' ? this.activeAcc.id : params.id;

            if (usertype == 'Channel%20Partner') {
                this.drType = this.removePercent20(usertype);
            }
            else {
                this.drType = usertype
            }

            this.service.currentUserID = params.id
            this.user_type = this.route.queryParams['_value']['type'];

            this.tabType = params.tabtype;
            if (this.login_data.user_type == 'DMS') {
                history.pushState(null, null, location.href);
                window.onpopstate = function () {
                    history.go(1);
                }
                if (this.tabType == 'Profile') {
                    this.distributorDetail();
                    this.DistributorTarget();
                    this.DistributorSalesChr();
                }
                else if (this.tabType == 'Checkin') {
                    this.clearFilter();
                    this.getCheckin();
                }
                else if (this.tabType == 'Segment') {
                    this.clearFilter();
                    this.getSegment();
                }
                else if (this.tabType == 'Primary Order') {
                    this.clearFilter();
                    this.getPrimaryOrder('', this.currentMonth_no, this.currentYear, 'Approved');;
                }
                else if (this.tabType == 'Secondary Order') {
                    this.clearFilter();
                    this.getSecondaryOrder('', this.currentMonth_no, this.currentYear, 'Approved');;
                }
                else if (this.tabType == 'Retailer') {
                    this.clearFilter();
                    this.getRetailer();
                }
                else if (this.tabType == 'Target') {
                    this.clearFilter();
                    this.getTarget(this.currentMonth_no, this.currentYear);
                }
                else if (this.tabType == 'transferRequests') {
                    this.clearFilter();
                    this.getTransferRequests(this.activeTab);
                }
                else if (this.tabType == 'sendRequest') {
                    this.clearFilter();
                    this.getSendRequest(this.sendRequestTab);
                }
                else if (this.tabType == 'stock') {
                    this.clearFilter();
                    this.getDrStock(this.stockTab);
                }
                else if (this.tabType == 'Ledger') {
                    this.clearFilter();
                    this.getLedger();
                }
                else if (this.tabType == 'Secondary Billing') {
                    this.clearFilter();
                    this.getsecBillList('');
                }
            }
        });

        setTimeout(() => {
            this.TargetbarChartMethod();
            this.lineChartMethod();
        }, 1000);
    }
    ngOnInit() {
        this.route.params.subscribe(params => {
            this.networkName = params.type;
            this.url = this.service.uploadUrl + 'retailer_doc/'
            let usertype
            usertype = params.type
            let id = params.id.replace(/_/g, '/');
            this.dr_id = this.logined_user_data.user_type == 'DMS' ? this.activeAcc.id : this.cryptoService.decryptId(id);
            this.encrypt_id = this.logined_user_data.user_type == 'DMS' ? this.activeAcc.id : params.id;

            if (usertype == 'Channel%20Partner') {
                this.drType = this.removePercent20(usertype);
            }
            else {
                this.drType = usertype
            }
            this.distributorDetail();
        })

        this.today_date = moment(new Date()).format("MMM - Y");
        this.session.getSession().subscribe(resp => {
            this.login_data = resp.data;
            if (this.login_data.type == '1' && this.login_data.lead_type == 'Dr') {
                this.renderer.addClass(document.body, 'chanel-patner');
            }
            else {
                this.renderer.removeClass(document.body, 'chanel-patner');
            }
        })
    }

    copyAddress(address) {
        // copy text 
        window.navigator['clipboard'].writeText(address);
        this.toast.successToastr("Copied 😊");
    }

    clearFilter() {
        this.filter = {};
    }
    date_format(tabType): void {
        this.filter.date_created = moment(this.filter.date_created).format('YYYY-MM-DD');

        if (tabType == 'Profile') {
        }
        else if (tabType == 'Checkin') {
            this.getCheckin();
        }
        else if (tabType == 'Segment') {

        }
        else if (tabType == 'Primary Order') {
            this.getPrimaryOrder('', this.currentMonth_no, this.currentYear, this.orderStatus);

        }
        else if (tabType == 'Secondary Order') {
            this.getSecondaryOrder('', this.currentMonth_no, this.currentYear, this.orderStatus);

        }
        else if (tabType == 'Retailer') {
            this.getRetailer();
        }
        else if (tabType == 'Ledger') {
            if (this.ledgerType == 'ledger') {
                this.getLedger()
            }
            else if (this.ledgerType == 'billing') {
                this.invoice_data(this.invoiceMonth, this.invoiceYear)
            }
            else if (this.ledgerType == 'payment') {
                this.payment_data(this.paymentMonth, this.paymentYear);
            }
            else if (this.ledgerType == 'credit_note') {
                this.cn_data(this.cnMonth, this.cnYear)
            }
        }
        else if (tabType == 'Secondary Billing') {
            this.getsecBillList('');
        }
        else if (tabType == 'Point Ledger') {
            this.getPointLedger();
        }
        else if (tabType == 'transferRequests') {
            this.getTransferRequests(this.activeTab);
        }
        else if (tabType == 'sendRequest') {
            this.getSendRequest(this.sendRequestTab);
        }
        else if (tabType == 'stock') {
            this.getDrStock(this.stockTab);
        }
        else {

        }

    }
    date_format1(tabType): void {
        if (tabType == 'Ledger') {
            if (this.ledgerType == 'ledger') {
                this.getLedger()
            } else
                if (this.ledgerType == 'billing') {
                    this.filter.billing_date = moment(this.filter.billing_date).format('YYYY-MM-DD');
                    this.invoice_data(this.invoiceMonth, this.invoiceYear)
                } else
                    if (this.ledgerType == 'payment') {
                        this.filter.payment_date = moment(this.filter.billing_date).format('YYYY-MM-DD');
                        this.payment_data(this.paymentMonth, this.paymentYear);
                    } else
                        if (this.ledgerType == 'credit_note') {
                            this.cn_data(this.cnMonth, this.cnYear)
                        }
        }
        else {

        }

    }
    refresh(tabType) {
        this.filter = {};
        if (tabType == 'Profile') {

        }
        else if (tabType == 'Checkin') {
            this.getCheckin();
        }
        else if (tabType == 'Segment') {
            this.getSegment();
        }
        else if (tabType == 'Primary Order') {
            this.getPrimaryOrder('', this.currentMonth_no, this.currentYear, this.orderStatus);
        }
        else if (tabType == 'Secondary Order') {
            this.getSecondaryOrder('', this.currentMonth_no, this.currentYear, this.orderStatus)
        }
        else if (tabType == 'Retailer') {
            this.getRetailer();
        }
        else if (tabType == 'Product') {
            this.getProducts()
        }
        else if (tabType == 'Ledger') {
            if (this.ledgerType == 'ledger') {
                this.getLedger()
            } else
                if (this.ledgerType == 'billing') {
                    this.invoice_data(this.invoiceMonth, this.invoiceYear)
                } else
                    if (this.ledgerType == 'payment') {
                        this.payment_data(this.paymentMonth, this.paymentYear);
                    } else
                        if (this.ledgerType == 'credit_note') {
                            this.cn_data(this.cnMonth, this.cnYear)
                        }
        }
        else if (tabType == 'Secondary Billing') {
            this.getsecBillList('');
        }
        else if (tabType == 'Point Ledger') {
            this.getPointLedger();
        }
        else if (tabType == 'transferRequests') {
            this.getTransferRequests(this.activeTab);
        }
        else if (tabType == 'sendRequest') {
            this.getSendRequest(this.sendRequestTab);
        }
        else if (tabType == 'stock') {
            this.getDrStock(this.stockTab);
        }
        else if (tabType == 'Point Ledger') {
            this.getPointLedger()
        }

        else {

        }

    }

    dr_type;
    payment_upper_info: any = {}
    payment_lower_info: any = []
    distributors: any = []
    skLoading: boolean = false;
    distributorDetail() {
        this.skLoading = true;
        this.hide_bar_chart = false;
        this.hide_line_chart = false
        this.hide_target_chart = true

        let id = { "id": this.dr_id }
        this.service.post_rqst(id, "CustomerNetwork/distributorDetail").subscribe((result) => {

            if (result['statusCode'] == 200) {

                this.dr_detail = result['distributor_detail'];
                this.distributors = this.dr_detail['distributors'];
                this.user_type = this.dr_detail['type']

                this.assignedBrands = this.dr_detail.brand.toString()
                // this.distributors.concat(this.dr_detail.assign_distributors_company_name)
                this.assign_sales_user = this.dr_detail.sales_user_data;
                this.payment_upper_info = result['dr_account_data']['dr_upper_info']
                this.payment_lower_info = result['dr_account_data']['previous_summary']
                this.skLoading = false;
                this.latitude = parseFloat(result['distributor_detail']['lat']);
                this.longitude = parseFloat(result['distributor_detail']['lng']);
                setTimeout(() => {
                    this.DistributorTarget();
                    this.DistributorSalesChr();
                    if (this.myMap) {
                        this.myMap.off(); // Remove the existing map if it exists
                        this.myMap.remove(); // Remove the existing map if it exists

                    }
                    this.myMap = L.map('map').setView([this.latitude, this.longitude], 16);
                    var OSM = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                        maxZoom: 22,
                        attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                    })
                    OSM.addTo(this.myMap);
                    const marker = L.marker([this.latitude, this.longitude]).addTo(this.myMap);
                    marker.setIcon(L.icon({
                        iconUrl: './assets/location/person.png',
                        iconSize: [40, 40],
                        iconAnchor: [16, 32],
                        riseOnHover: true,
                    }));
                    marker.bindPopup('Address :' + this.dr_detail.gps_address)
                }, 1000);

            } else {
                this.skLoading = false;
                this.toast.errorToastr(result['statusMsg'])
            }
        })
    }



    openDialog(from): void {
        const dialogRef = this.dialog.open(StatusModalComponent, {
            width: '400px',
            panelClass: 'cs-model',
            data: {
                drType: this.user_type,
                company_name: this.dr_detail.company_name,
                drId: this.dr_id,
                delivery_from: from,
                reason: ''
            }
        });

        dialogRef.afterClosed().subscribe(result => {
            if (result != false) {
                this.distributorDetail();
            }
        });
    }



    discountDialog(id, name, discountList): void {
        const dialogRef = this.dialog.open(StatusModalComponent, {
            width: '768px',
            panelClass: 'cs-model',
            data: {
                from: 'dr_detail',
                drType: this.user_type,
                company_name: this.dr_detail.company_name,
                drId: this.dr_id,
                cat_id: id,
                cat_name: name,
                discountList: discountList,
            }
        });

        dialogRef.afterClosed().subscribe(result => {
            if (result == true) {
                this.getSegment();
            }
        });
    }


    sales_amount: any = []
    salesMonth: any;
    sales_month: any = []
    distributor_saleschr_list: any = []
    DistributorSalesChr() {
        this.sales_amount = []
        this.sales_month = []
        setTimeout(() => {
            if (this.user_type != 3) {
                this.service.post_rqst({ 'dr_id': this.dr_id }, "CustomerNetwork/drPrimarySalesData").subscribe((result => {
                    if (result['statusCode'] == 200) {
                        this.distributor_saleschr_list = result['calenderInfo'];
                        this.salesMonth = result['current_year'];
                        this.sales_amount = []
                        this.sales_month = []
                        for (let index = 0; index < this.distributor_saleschr_list.length; index++) {
                            this.sales_amount.push(this.distributor_saleschr_list[index].sale)
                            this.sales_month.push(this.distributor_saleschr_list[index].monthname)
                        }
                    } else {
                        this.toast.errorToastr(result['statusMsg'])
                    }
                    this.lineChartMethod()
                }))
            } else if (this.user_type == 3) {
                this.service.post_rqst({ 'dr_id': this.dr_id }, "CustomerNetwork/drSecondarySalesData").subscribe((result => {

                    if (result['statusCode'] == 200) {
                        this.distributor_saleschr_list = result['calenderInfo'];
                        this.sales_amount = []
                        this.sales_month = []
                        for (let index = 0; index < this.distributor_saleschr_list.length; index++) {
                            this.sales_amount.push(this.distributor_saleschr_list[index].sale)
                            this.sales_month.push(this.distributor_saleschr_list[index].monthname)
                        }

                    } else {
                        this.toast.errorToastr(result['statusMsg'])
                    }
                    setTimeout(() => {
                        this.lineChartMethod();
                    }, 1000);
                }))
            }
        }, 1000);
    }

    lineChartMethod() {
        this.lineChart = new Chart(this.lineCanvas.nativeElement, {
            type: 'line',
            data: {
                labels: this.sales_month,
                datasets: [
                    {
                        label: '',
                        fill: false,
                        lineTension: 0.1,
                        backgroundColor: 'rgba(255,133,15,0.4)',
                        borderColor: 'rgba(255, 162, 71, 1)',
                        borderCapStyle: 'butt',
                        borderDash: [],
                        borderDashOffset: 0.0,
                        borderJoinStyle: 'miter',
                        pointBorderColor: 'rgba(255, 162, 71, 1)',
                        pointBackgroundColor: '#fff',
                        pointBorderWidth: 1,
                        pointHoverRadius: 5,
                        pointHoverBackgroundColor: 'rgba(255, 162, 71, 1)',
                        pointHoverBorderColor: 'rgba(161,85,11,1)',
                        pointHoverBorderWidth: 2,
                        pointRadius: 1,
                        pointHitRadius: 10,
                        data: this.sales_amount,
                        spanGaps: true,
                    }
                ]
            }
        });
    }
    dist_target: any = []
    dist_achieve: any = []
    target_not_achieved: any = []
    dist_segment: any = []
    distributor_target_list: any = []
    distributor_target_loader: any = []
    target_month: any;
    achieve_color: any = ''
    DistributorTarget() {
        this.dist_target = []
        this.dist_achieve = []
        this.dist_segment = []
        this.target_not_achieved = []
        this.service.post_rqst({ 'dr_id': this.dr_id }, "CustomerNetwork/drTargetData").subscribe((result => {

            if (result['statusCode'] == 200) {
                this.distributor_target_list = result['target_list'];
                this.target_month = result['current_month'];
                for (let index = 0; index < this.distributor_target_list.length; index++) {
                    this.dist_target.push(this.distributor_target_list[index].value)
                    this.dist_segment.push(this.distributor_target_list[index].brand_code)
                    if (this.distributor_target_list[index].achieved >= this.distributor_target_list[index].value) {

                        this.dist_achieve.push(this.distributor_target_list[index].achieved)
                        this.target_not_achieved.push(0)
                        this.achieve_color = '#27a302'
                    } else {
                        this.dist_achieve.push(0)
                        this.achieve_color = 'red'
                        this.target_not_achieved.push(this.distributor_target_list[index].achieved)
                    }

                }

                setTimeout(() => {
                    this.barChart = new Chart(this.barCanvas.nativeElement, {
                        type: 'bar',
                        data: {
                            labels: this.dist_segment,
                            datasets: [
                                {
                                    label: 'Target',
                                    data: this.dist_target,
                                    backgroundColor: 'grey',
                                    borderColor: 'white',
                                    borderWidth: 1
                                },
                                {
                                    label: 'Not Achieved',
                                    data: this.target_not_achieved,
                                    backgroundColor: 'red',
                                    borderColor: '#ffffff',
                                    borderWidth: 1
                                },
                                {
                                    label: 'Achieved',
                                    data: this.dist_achieve,
                                    backgroundColor: '#27a302',
                                    borderColor: '#ffffff',
                                    borderWidth: 1
                                },



                            ]
                        },

                    });
                }, 1000);
            } else {
                this.toast.errorToastr(result['statusMsg'])
            }

        }))
    }


    pervious(page) {
        this.start = this.start - this.page_limit;
        if (page == 'checkin') {
            this.getCheckin();
        } else if (page == 'segment') {
            this.getSegment()
        } else if (page == 'primary') {

            this.getPrimaryOrder('', this.currentMonth_no, this.currentYear, this.orderStatus)
        } else if (page == 'secondary') {

            this.getSecondaryOrder('', this.currentMonth_no, this.currentYear, this.orderStatus)
        } else if (page == 'retailer') {
            this.getRetailer()

        }
        else if (page == 'Product') {
            this.getProducts()
        }
        else if (page == 'ledger') {
            if (this.ledgerType == 'ledger') {
                this.getLedger()
            } else
                if (this.ledgerType == 'billing') {
                    this.invoice_data(this.invoiceMonth, this.invoiceYear)
                } else
                    if (this.ledgerType == 'payment') {
                        this.payment_data(this.paymentMonth, this.paymentYear);
                    } else
                        if (this.ledgerType == 'credit_note') {
                            this.cn_data(this.cnMonth, this.cnYear)
                        }
        }
        else if (page == 'Secondary Billing') {
            this.getsecBillList('');
        }
        else if (page == 'transferRequests') {
            this.getTransferRequests(this.activeTab);
        }
        else if (page == 'sendRequest') {
            this.getSendRequest(this.sendRequestTab);
        }
        else if (page == 'stock') {
            this.getDrStock(this.stockTab);
        }
        else if (page == 'Point Ledger') {
            this.getPointLedger()
        }
        else if (page == 'transaction') {
            this.getSecondaryWalletTransaction();
        }

        else if (page == 'scan') {
            this.scan_history_data();
        }
        else if (page == 'redeem') {
            this.redeem_history_data();
        }
        else {

        }

    }

    nextPage(page) {
        this.start = this.start + this.page_limit;
        
        if (page == 'checkin') {

            this.getCheckin();
        }
        else if (page == 'transaction') {
            this.getSecondaryWalletTransaction();
        } 
        else if (page == 'segment') {

            this.getSegment()
        } else if (page == 'primary') {

            this.getPrimaryOrder('', this.currentMonth_no, this.currentYear, this.orderStatus)
        } else if (page == 'secondary') {

            this.getSecondaryOrder('', this.currentMonth_no, this.currentYear, this.orderStatus)
        } else if (page == 'retailer') {
            this.getRetailer()

        }
        else if (page == 'Product') {
            this.getProducts()
        }
        else if (page == 'ledger') {
            console.log('line no 742');
            if (this.ledgerType == 'ledger') {
                console.log('line no 744');
                this.getLedger()
            } else
                if (this.ledgerType == 'billing') {
                    this.invoice_data(this.invoiceMonth, this.invoiceYear)
                } else
                    if (this.ledgerType == 'payment') {
                        this.payment_data(this.paymentMonth, this.paymentYear);
                    } else
                        if (this.ledgerType == 'credit_note') {
                            this.cn_data(this.cnMonth, this.cnYear)
                        }
        }
        else if (page == 'Secondary Billing') {
            this.getsecBillList('');
        }
        else if (page == 'Point Ledger') {
            this.getPointLedger()
        }
        else if (page == 'transferRequests') {
            this.getTransferRequests(this.activeTab);
        }
        else if (page == 'sendRequest') {
            this.getSendRequest(this.sendRequestTab);
        }
        else if (page == 'stock') {
            this.getDrStock(this.stockTab);
        }
        else if (page == 'Point Ledger') {
            this.getPointLedger()
        }else if (page == 'scan') {
            this.scan_history_data();
        }
        else if (page == 'redeem') {
            this.redeem_history_data();
        }
        else {

        }
    }

    checkinData: any = [];
    checkinLoader: boolean = false;

    getCheckin() {

        this.checkinLoader = true;
        if (this.pagenumber > this.total_page) {
            this.pagenumber = this.total_page;
            this.start = this.pageCount - this.page_limit;
        }

        if (this.start < 0) {
            this.start = 0;
        }
        let payLoad = { "filter": this.filter, "id": this.dr_id, 'start': this.start, 'pagelimit': this.page_limit }
        this.service.post_rqst(payLoad, "CustomerNetwork/drCheckinList").subscribe((result) => {

            if (result['statusCode'] == 200) {
                this.checkinData = result['dr_checkin_list'];
                this.totalCheckinTime = result['total_time'];
                this.pageCount = result['count'];
                if (this.pagenumber > this.total_page) {
                    this.pagenumber = this.total_page;
                    this.start = this.pageCount - this.page_limit;
                }
                else {
                    this.pagenumber = Math.ceil(this.start / this.page_limit) + 1;
                }
                this.total_page = Math.ceil(this.pageCount / this.page_limit);
                this.sr_no = this.pagenumber - 1;
                this.sr_no = this.sr_no * this.page_limit;
                this.checkinLoader = false;
            } else {
                this.checkinLoader = false;
                this.toast.errorToastr(result['statusMsg'])
            }
        });
    }
    goToImage(image) {
        const dialogRef = this.dialog.open(ImageModuleComponent, {
            panelClass: 'Image-modal',
            data: {
                'image': image,
                'type': 'base64'
            }
        });
        dialogRef.afterClosed().subscribe(result => {
        });

    }
    segment: any = [];
    segmentLoader: boolean = false;
    getSegment() {
        this.segmentLoader = true;
        if (this.pagenumber > this.total_page) {
            this.pagenumber = this.total_page;
            this.start = this.pageCount - this.page_limit;
        }
        if (this.start < 0) {
            this.start = 0;
        }
        let payLoad = { "filter": this.filter, "dr_id": this.dr_id, 'start': this.start, 'pagelimit': this.page_limit }
        this.service.post_rqst(payLoad, "CustomerNetwork/drSegmentDiscountList").subscribe((result) => {

            if (result['statusCode'] == 200) {
                this.segment = result['all_segment_with_discount_list'];
                this.pageCount = result['count'];
                if (this.pagenumber > this.total_page) {
                    this.pagenumber = this.total_page;
                    this.start = this.pageCount - this.page_limit;
                }
                else {
                    this.pagenumber = Math.ceil(this.start / this.page_limit) + 1;
                }
                this.total_page = Math.ceil(this.pageCount / this.page_limit);
                this.sr_no = this.pagenumber - 1;
                this.sr_no = this.sr_no * this.page_limit;
                this.segmentLoader = false;
            } else {
                this.segmentLoader = false;
                this.toast.errorToastr(result['statusMsg'])
            }
        })
    }


    productList: any = [];
    getProducts() {
        this.segmentLoader = true;
        if (this.pagenumber > this.total_page) {
            this.pagenumber = this.total_page;
            this.start = this.pageCount - this.page_limit;
        }
        if (this.start < 0) {
            this.start = 0;
        }
        let payLoad = { "filter": this.filter, "dr_id": this.dr_id, 'start': this.start, 'pagelimit': this.page_limit }
        this.service.post_rqst(payLoad, "CustomerNetwork/drNetPriceList").subscribe((result) => {

            if (result['statusCode'] == 200) {
                this.productList = result['result'];
                this.pageCount = result['count'];
                if (this.pagenumber > this.total_page) {
                    this.pagenumber = this.total_page;
                    this.start = this.pageCount - this.page_limit;
                }
                else {
                    this.pagenumber = Math.ceil(this.start / this.page_limit) + 1;
                }
                this.total_page = Math.ceil(this.pageCount / this.page_limit);
                this.sr_no = this.pagenumber - 1;
                this.sr_no = this.sr_no * this.page_limit;
                this.segmentLoader = false;
            } else {
                this.segmentLoader = false;
                this.toast.errorToastr(result['statusMsg'])
            }
        })
    }
    primary_order_list: any = [];
    calenderInfo: any = [];
    primary__count: any = {};
    OrderMonth: any;
    OrderYear: any;
    primaryLoader: boolean = false;
    getPrimaryOrder(action: any = '', month, year, status) {
        if (action == "refresh") {
            this.primary_order_list = [];
            this.start = 0;
        }
        this.primaryLoader = true;
        this.OrderMonth = month;
        this.OrderYear = year;
        if (this.pagenumber > this.total_page) {
            this.pagenumber = this.total_page;
            this.start = this.pageCount - this.page_limit;
        }
        if (this.start < 0) {
            this.start = 0;
        }
        let id = { "filter": this.filter, "dr_id": this.dr_id }
        this.service.post_rqst({ "dr_id": this.dr_id, 'status': status, 'month': Number(month), 'filter': this.filter, 'year': Number(year), 'start': this.start, 'pagelimit': this.page_limit }, "CustomerNetwork/drPrimaryOrderList").subscribe((result) => {

            if (result['statusCode'] == 200) {
                this.calenderInfo = result['calenderInfo'];
                this.primary__count = result['count'];
                this.primary_order_list = result['order_list'];
                for (let i = 0; i < this.primary_order_list.length; i++) {
                    this.primary_order_list[i]['encrypt_id'] = this.cryptoService.encryptId(this.primary_order_list[i]['id'].toString());
                }
                this.primaryLoader = false;
                if (status == 'Pending') {
                    this.pageCount = this.primary__count.Pending;
                    this.total_page = Math.ceil(this.pageCount / this.page_limit);

                }
                else if (status == 'Approved') {
                    this.pageCount = this.primary__count.Approved;
                    this.total_page = Math.ceil(this.pageCount / this.page_limit);

                }
                else if (status == 'Reject') {
                    this.pageCount = this.primary__count.Reject;
                    this.total_page = Math.ceil(this.pageCount / this.page_limit);

                }
                else if (status == 'Hold') {
                    this.pageCount = this.primary__count.Hold;
                    this.total_page = Math.ceil(this.pageCount / this.page_limit);
                }
                else if (status == 'Dispatched') {
                    this.pageCount = this.primary__count.Dispatched;
                    this.total_page = Math.ceil(this.pageCount / this.page_limit);
                }
                else if (status == 'completeDispatched') {
                    this.pageCount = this.primary__count.completeDispatched;
                    this.total_page = Math.ceil(this.pageCount / this.page_limit);
                }
                else if (status == 'orderPartial') {
                    this.pageCount = this.primary__count.orderPartial;
                    this.total_page = Math.ceil(this.pageCount / this.page_limit);
                }
                else if (status == 'partialDispatched') {
                    this.pageCount = this.primary__count.partialDispatched;
                    this.total_page = Math.ceil(this.pageCount / this.page_limit);
                }
                else if (status == 'dispatchPlanning') {
                    this.pageCount = this.primary__count.dispatchPlanning;
                    this.total_page = Math.ceil(this.pageCount / this.page_limit);
                }
                else {
                    this.pageCount = this.count.Dispact;
                    this.total_page = Math.ceil(this.pageCount / this.page_limit);
                }
                if (this.pagenumber > this.total_page) {
                    this.pagenumber = this.total_page;
                    this.start = this.pageCount - this.page_limit;
                }
                else {
                    this.pagenumber = Math.ceil(this.start / this.page_limit) + 1;
                }
                this.total_page = Math.ceil(this.pageCount / this.page_limit);
                this.sr_no = this.pagenumber - 1;
                this.sr_no = this.sr_no * this.page_limit;
                for (let index = 0; index < this.calenderInfo.length; index++) {
                    const date = new Date();
                    date.setMonth(this.calenderInfo[index].month - 1);
                    let MonthName = ''
                    MonthName = date.toLocaleString('en-US', { month: 'short' })
                    this.calenderInfo[index].month_name = MonthName
                }
            } else {
                this.primaryLoader = false;
                this.toast.errorToastr(result['statusMsg'])
            }
        })
    }
    secondary_order_list: any = [];
    Secondary_calenderInfo: any = [];
    secondary__count: any = {};
    secondaryLoader: boolean = false;
    SecOrderMonth: any;
    SecOrderYear: any;
    getSecondaryOrder(action: any = '', month, year, status) {
        if (action == "refresh") {
            this.secondary_order_list = [];
            this.start = 0;
        }
        this.secondaryLoader = true;
        this.SecOrderMonth = month;
        this.SecOrderYear = year;
        if (this.pagenumber > this.total_page) {
            this.pagenumber = this.total_page;
            this.start = this.pageCount - this.page_limit;
        }
        if (this.start < 0) {
            this.start = 0;
        }
        if (this.login_data.user_type == 'DMS') {
            this.user_type = this.login_data.type
        }
        let id = { "dr_id": this.dr_id }
        this.service.post_rqst({ "dr_id": this.dr_id, 'status': status, 'month': Number(month), 'year': Number(year), 'type': this.user_type, 'start': this.start, 'pagelimit': this.page_limit, 'filter': this.filter }, "CustomerNetwork/drSecondaryOrderList").subscribe((result) => {

            if (result['statusCode'] == 200) {
                this.Secondary_calenderInfo = result['calenderInfo'];
                this.secondary__count = result['count'];
                this.secondaryLoader = false;
                this.secondary_order_list = result['order_list'];
                this.secondary_order_list.forEach(item => item['encrypt_id'] = this.cryptoService.encryptId(item['id'].toString()));

                if (status == 'Pending') {
                    this.pageCount = this.secondary__count.Pending;
                    this.total_page = Math.ceil(this.pageCount / this.page_limit);

                }
                else if (status == 'Approved') {
                    this.pageCount = this.secondary__count.Approved;
                    this.total_page = Math.ceil(this.pageCount / this.page_limit);

                }
                else if (status == 'Reject') {
                    this.pageCount = this.secondary__count.Reject;
                    this.total_page = Math.ceil(this.pageCount / this.page_limit);

                }
                else if (status == 'Draft') {
                    this.pageCount = this.secondary__count.Draft;
                    this.total_page = Math.ceil(this.pageCount / this.page_limit);
                }
                else if (status == 'Dispatched') {
                    this.pageCount = this.secondary__count.Dispatched;
                    this.total_page = Math.ceil(this.pageCount / this.page_limit);
                }
                else {
                    this.pageCount = this.count.Dispact;
                    this.total_page = Math.ceil(this.pageCount / this.page_limit);
                }
                if (this.pagenumber > this.total_page) {
                    this.pagenumber = this.total_page;
                    this.start = this.pageCount - this.page_limit;
                }
                else {
                    this.pagenumber = Math.ceil(this.start / this.page_limit) + 1;
                }
                this.total_page = Math.ceil(this.pageCount / this.page_limit);
                this.sr_no = this.pagenumber - 1;
                this.sr_no = this.sr_no * this.page_limit;

                for (let index = 0; index < this.Secondary_calenderInfo.length; index++) {
                    const date = new Date();
                    date.setMonth(this.Secondary_calenderInfo[index].month - 1);
                    let MonthName = ''
                    MonthName = date.toLocaleString('en-US', { month: 'short' })
                    this.Secondary_calenderInfo[index].month_name = MonthName
                }
            } else {
                this.secondary_order_list = [];
                this.secondaryLoader = false;
                this.toast.errorToastr(result['statusMsg'])
            }


        })
    }

    target_list: any = [];
    target_calenderInfo: any = [];
    target__count: any = {};
    targetLoader: boolean = false;
    targetMonth: any;
    targetYear: any;
    target_Segment: any = [];
    Target: any = [];
    Achievement: any = [];
    Main_target_not_achieved: any = []
    getTarget(month, year) {
        this.Achievement = []
        this.Target = []
        this.Main_target_not_achieved = []
        this.target_Segment = []
        this.targetLoader = true;
        this.targetMonth = month;
        this.targetYear = year;
        this.hide_bar_chart = true
        this.hide_line_chart = true
        this.hide_target_chart = false
        // let id = { "dr_id": this.dr_id }
        this.service.post_rqst({ "dr_id": this.dr_id, 'month': Number(month), 'year': Number(year) }, "CustomerNetwork/drPrimaryTargetList").subscribe((result) => {

            if (result['statusCode'] == 200) {
                this.target_calenderInfo = result['calenderInfo'];
                this.target_list = result['target_list'];
                this.targetLoader = false;
                for (let index = 0; index < this.target_calenderInfo.length; index++) {
                    const date = new Date();
                    date.setMonth(this.target_calenderInfo[index].month - 1);
                    let MonthName = ''
                    MonthName = date.toLocaleString('en-US', { month: 'short' })
                    this.target_calenderInfo[index].month_name = MonthName
                }
                for (let index = 0; index < this.target_list.length; index++) {
                    this.Target.push(this.target_list[index].value)
                    this.target_Segment.push(this.target_list[index].brand_code)
                    this.target_list[index].target_percentage = (this.target_list[index].achieved / this.target_list[index].value) * 100;
                    if (this.target_list[index].achieved >= this.target_list[index].value) {
                        this.Achievement.push(this.target_list[index].achieved)
                        this.Main_target_not_achieved.push(0)
                    } else {
                        this.Achievement.push(0)
                        this.Main_target_not_achieved.push(this.target_list[index].achieved)
                    }
                }
            } else {
                this.targetLoader = false;
                this.toast.errorToastr(result['statusMsg'])
            }
            setTimeout(() => {
                this.TargetbarChartMethod()
            }, 1000);
        })
    }

    TargetbarChartMethod() {
        this.targetbarChart = new Chart(this.targetbarCanvas.nativeElement, {
            type: 'bar',
            data: {
                labels: this.target_Segment,
                datasets: [
                    {
                        label: 'Target',
                        data: this.Target,
                        backgroundColor: 'grey',
                        borderColor: 'black',
                        borderWidth: 1
                    },
                    {
                        label: 'Achieved',
                        data: this.Achievement,
                        backgroundColor: '#439B03',
                        borderColor: '#C6FF9B'
                        , borderWidth: 1
                    },
                    {
                        label: 'Not Achieved',
                        data: this.Main_target_not_achieved,
                        backgroundColor: 'red',
                        borderColor: 'red',
                        borderWidth: 1
                    },
                ]
            },

        });
    }
    retailer: any = [];
    retailerLoader: boolean = false;
    getRetailer() {
        this.retailerLoader = true;
        if (this.pagenumber > this.total_page) {
            this.pagenumber = this.total_page;
            this.start = this.pageCount - this.page_limit;
        }
        if (this.start < 0) {
            this.start = 0;
        }
        let id = { "filter": this.filter, "dr_id": this.dr_id, 'start': this.start, 'pagelimit': this.page_limit }
        this.service.post_rqst(id, "CustomerNetwork/distributorsAssignRetailersList").subscribe((result) => {

            if (result['statusCode'] == 200) {
                this.retailer = result['all_assign_retailers'];
                this.retailerLoader = false;
                this.pageCount = result['count'];
                if (this.pagenumber > this.total_page) {
                    this.pagenumber = this.total_page;
                    this.start = this.pageCount - this.page_limit;
                }
                else {
                    this.pagenumber = Math.ceil(this.start / this.page_limit) + 1;
                }
                this.total_page = Math.ceil(this.pageCount / this.page_limit);
                this.sr_no = this.pagenumber - 1;
                this.sr_no = this.sr_no * this.page_limit;
            } else {
                this.retailerLoader = false;
                this.toast.errorToastr(result['statusMsg'])
            }
        })
    }

    ledger_loader: boolean = false
    getLedger() {
        this.ledger_loader = true
        if (this.pagenumber > this.total_page) {
            this.pagenumber = this.total_page;
            this.start = this.pageCount - this.page_limit;
        }
        if (this.start < 0) {
            this.start = 0;
        }
        this.service.post_rqst({ id: this.dr_id, 'dr_code': this.dr_detail.dr_code, 'date_from': this.filter.date_from, 'date_to': this.filter.date_to, 'start': this.start, 'pagelimit': this.page_limit }, "Account/ledgerListing").subscribe((result) => {
            if (result['statusCode'] == 200) {
                this.ledger_loader = false
                this.ledger_data = result['dr_ledger_list'];
                this.pageCount = result['count'];
                if (this.pagenumber > this.total_page) {
                    this.pagenumber = this.total_page;
                    this.start = this.pageCount - this.page_limit;
                }
                else {
                    this.pagenumber = Math.ceil(this.start / this.page_limit) + 1;
                }
                this.total_page = Math.ceil(this.pageCount / this.page_limit);
                this.sr_no = this.pagenumber - 1;
                this.sr_no = this.sr_no * this.page_limit;
            } else {
                this.ledger_loader = false
                this.toast.errorToastr(result['statusMsg'])
            }
        });
    }


    total_list: any
    secBillSummaryrrayCounts: any;
    secBillCounts: any;
    secBillingActiveTab = 'Pending';
    secBillList: any = [];
    getsecBillList(action: any = '') {
        if (action == "refresh") {
            this.filter = {};
            this.secBillList = [];
            this.start = 0;
        }
        if (this.pagenumber > this.total_page) {
            this.pagenumber = this.total_page;
            this.start = this.pageCount - this.page_limit;
        }

        if (this.start < 0) {
            this.start = 0;
        }
        if (this.filter.date_created) {
            this.filter.date_created = moment(this.filter.date_created).format('YYYY-MM-DD');
        }
        if (this.filter.bill_date) {
            this.filter.bill_date = moment(this.filter.bill_date).format('YYYY-MM-DD');
        }
        this.loader = true;
        this.filter.active_tab = this.secBillingActiveTab;
        this.service.post_rqst({ 'filter': this.filter, 'start': this.start, 'pagelimit': this.page_limit }, "Order/secondaryOrdersBillListing")
            .subscribe((result => {
                if (result['statusCode'] == 200) {
                    this.secBillList = (result['result']);
                    this.secBillCounts = result['tab_count'];
                    this.secBillSummaryrrayCounts = result['sum_array'];

                    this.total_list = (result['total_count']);
                    this.loader = false;

                    if (this.secBillingActiveTab == 'Pending') {
                        this.pageCount = this.secBillCounts.Pending;
                        this.total_page = Math.ceil(this.pageCount / this.page_limit);
                    }
                    else if (this.secBillingActiveTab == 'Verified') {
                        this.pageCount = this.secBillCounts.Verified;
                        this.total_page = Math.ceil(this.pageCount / this.page_limit);
                    }
                    else if (this.secBillingActiveTab == 'Reject') {
                        this.pageCount = this.secBillCounts.Reject;
                        this.total_page = Math.ceil(this.pageCount / this.page_limit);
                    }
                    if (this.pagenumber > this.total_page) {
                        this.pagenumber = this.total_page;
                        this.start = this.pageCount - this.page_limit;
                    }
                    else {
                        this.pagenumber = Math.ceil(this.start / this.page_limit) + 1;
                    }
                    this.total_page = Math.ceil(this.pageCount / this.page_limit);
                    this.sr_no = this.pagenumber - 1;
                    this.sr_no = this.sr_no * this.page_limit;
                } else {
                    this.loader = false;
                    this.toast.errorToastr(result['statusMsg'])
                }
            }))
    }

    getSecondaryWalletTransaction() {
        this.filter.status = this.tabType;
        this.loader = true;
        if (this.pagenumber > this.total_page) {
            this.pagenumber = this.total_page;
            this.start = this.pageCount - this.page_limit;
        }
        if (this.start < 0) {
            this.start = 0;
        }
        this.service.post_rqst({ "id": this.dr_id, 'type': 'Secondary', 'filter': this.filter, 'start': this.start, 'pagelimit': this.page_limit }, 'CustomerNetwork/dealerLedger').subscribe((result) => {
            if (result['statusCode'] == 200) {
                this.walletTransaction = result['secondary_ledger'];
                this.loader = false;
                this.pageCount = result['count'];
                if (this.pagenumber > this.total_page) {
                    this.pagenumber = this.total_page;
                    this.start = this.pageCount - this.page_limit;
                }
                else {
                    this.pagenumber = Math.ceil(this.start / this.page_limit) + 1;
                }
                this.total_page = Math.ceil(this.pageCount / this.page_limit);
                this.sr_no = this.pagenumber - 1;
                this.sr_no = this.sr_no * this.page_limit;
                setTimeout(() => {
                }, 700)
            }
            else {
                this.toast.errorToastr(result['statusMsg']);
            }
        })
    }

    couponData: any = [];
    noResult: boolean = false;

    scan_history_data() {
        if (this.pagenumber > this.total_page) {
            this.pagenumber = this.total_page;
            this.start = this.pageCount - this.page_limit;
        }
        if (this.start < 0) {
            this.start = 0;
        }

        if (this.filter.date_created) {
            this.filter.date_created = moment(this.filter.date_created).format('YYYY-MM-DD');
        }
        this.loader = true;
        this.filter.id = this.dr_id;
        this.service.post_rqst({ 'filter': this.filter, 'start': this.start, 'pagelimit': this.page_limit }, 'CustomerNetwork/scanHistory').subscribe((result) => {
            if (result['statusCode'] == 200) {
                this.couponData = result['result']
                this.pageCount = result['count'];
                this.loader = false;


                if (this.pagenumber > this.total_page) {
                    this.pagenumber = this.total_page;
                    this.start = this.pageCount - this.page_limit;
                }

                else {
                    this.pagenumber = Math.ceil(this.start / this.page_limit) + 1;
                }
                this.total_page = Math.ceil(this.pageCount / this.page_limit);
                this.sr_no = this.pagenumber - 1;
                this.sr_no = this.sr_no * this.page_limit;

                setTimeout(() => {
                    if (this.couponData.length == 0) {
                        this.noResult = true;
                    }
                }, 500);
            }
            else {
                this.toast.errorToastr(result['statusMsg']);
            }

        })
    }

    redeemHistory: any = [];
    redeem_history_data() {
        if (this.pagenumber > this.total_page) {
            this.pagenumber = this.total_page;
            this.start = this.pageCount - this.page_limit;
        }
        if (this.start < 0) {
            this.start = 0;
        }
        this.loader = true;

        if (this.filter.date_created) {
            this.filter.date_created = moment(this.filter.date_created).format('YYYY-MM-DD');
        }
        this.filter.id = this.dr_id;
        this.service.post_rqst({ 'filter': this.filter, 'start': this.start, 'pagelimit': this.page_limit }, 'CustomerNetwork/redeemHistory').subscribe((result) => {

            if (result['statusCode'] == 200) {
                this.redeemHistory = result['result']
                this.pageCount = result['count'];
                this.loader = false;


                if (this.pagenumber > this.total_page) {
                    this.pagenumber = this.total_page;
                    this.start = this.pageCount - this.page_limit;
                }

                else {
                    this.pagenumber = Math.ceil(this.start / this.page_limit) + 1;
                }
                this.total_page = Math.ceil(this.pageCount / this.page_limit);
                this.sr_no = this.pagenumber - 1;
                this.sr_no = this.sr_no * this.page_limit;

                setTimeout(() => {
                    if (this.redeemHistory.length == 0) {
                        this.noResult = true;
                    }
                }, 500);
            }
            else {
                this.toast.errorToastr(result['statusMsg']);
            }

        })
    }

    openStockProductTransaction(stockProductTrans): void {
        const dialogRef = this.dialog.open(StatusModalComponent, {
            width: '500px',
            panelClass: 'cs-modal',
            disableClose: true,
            data: {
                from: 'stock_product_trans',
                id: this.dr_id,
                stockProductTrans: stockProductTrans
            }

        });

        dialogRef.afterClosed().subscribe(result => {
            if (result == true) {
                this.distributorDetail()
            }
        });
    }

    approveTransferRequest(requestData): void {
        const dialogRef = this.dialog.open(StatusModalComponent, {
            width: '500px',
            panelClass: 'cs-modal',
            disableClose: true,
            data: {
                from: 'approve_transfer_equest',
                requestData: requestData
            }
        });

        dialogRef.afterClosed().subscribe(result => {
            if (result == true) {
                this.distributorDetail()
            }
        });
    }

    transferRequestsListLoader: boolean = false
    getTransferRequests(activeTab) {
        this.transferRequestsListLoader = true
        if (this.pagenumber > this.total_page) {
            this.pagenumber = this.total_page;
            this.start = this.pageCount - this.page_limit;
        }
        if (this.start < 0) {
            this.start = 0;
        }
        this.service.post_rqst({ id: this.dr_id, 'filter': this.filter, 'start': this.start, 'pagelimit': this.page_limit, activeTab: activeTab }, "Stock/distributorRecieveRequest").subscribe((result) => {
            if (result['statusCode'] == 200) {
                this.transferRequestsListLoader = false
                this.transferRequestsList = result['result'];
                this.tabCount = result['tab_count'];
                this.pageCount = result['count'];
                if (this.pagenumber > this.total_page) {
                    this.pagenumber = this.total_page;
                    this.start = this.pageCount - this.page_limit;
                }
                else {
                    this.pagenumber = Math.ceil(this.start / this.page_limit) + 1;
                }
                this.total_page = Math.ceil(this.pageCount / this.page_limit);
                this.sr_no = this.pagenumber - 1;
                this.sr_no = this.sr_no * this.page_limit;
            } else {
                this.transferRequestsListLoader = false
                this.toast.errorToastr(result['statusMsg'])
            }
        });
    }

    sendRequestLoader: boolean = false
    getSendRequest(sendRequestTab) {
        this.sendRequestLoader = true
        if (this.pagenumber > this.total_page) {
            this.pagenumber = this.total_page;
            this.start = this.pageCount - this.page_limit;
        }
        if (this.start < 0) {
            this.start = 0;
        }
        this.service.post_rqst({ id: this.dr_id, 'filter': this.filter, 'start': this.start, 'pagelimit': this.page_limit, activeTab: sendRequestTab }, "Stock/retailerSendRequest").subscribe((result) => {
            if (result['statusCode'] == 200) {
                this.sendRequestLoader = false
                this.sendRequestList = result['result'];
                this.tabCount = result['tab_count'];
                this.pageCount = result['count'];
                if (this.pagenumber > this.total_page) {
                    this.pagenumber = this.total_page;
                    this.start = this.pageCount - this.page_limit;
                }
                else {
                    this.pagenumber = Math.ceil(this.start / this.page_limit) + 1;
                }
                this.total_page = Math.ceil(this.pageCount / this.page_limit);
                this.sr_no = this.pagenumber - 1;
                this.sr_no = this.sr_no * this.page_limit;
            } else {
                this.sendRequestLoader = false
                this.toast.errorToastr(result['statusMsg'])
            }
        });
    }

    drStockLoader: boolean = false
    getDrStock(stockTab) {
        this.drStockLoader = true
        if (this.pagenumber > this.total_page) {
            this.pagenumber = this.total_page;
            this.start = this.pageCount - this.page_limit;
        }
        if (this.start < 0) {
            this.start = 0;
        }
        this.service.post_rqst({ 'type': this.network_type, 'dr_id': this.dr_id, 'filter': this.filter, 'start': this.start, 'pagelimit': this.page_limit, activeTab: stockTab }, "Stock/stockDetailsWeb").subscribe((result) => {
            if (result['statusCode'] == 200) {
                this.drStockLoader = false
                this.drStockData = result['result'];
                this.tabCount = result['result']['tab_count'];
                this.pageCount = result['result']['count'];
                if (this.pagenumber > this.total_page) {
                    this.pagenumber = this.total_page;
                    this.start = this.pageCount - this.page_limit;
                }
                else {
                    this.pagenumber = Math.ceil(this.start / this.page_limit) + 1;
                }
                this.total_page = Math.ceil(this.pageCount / this.page_limit);
                this.sr_no = this.pagenumber - 1;
                this.sr_no = this.sr_no * this.page_limit;
            } else {
                this.drStockLoader = false
                this.toast.errorToastr(result['statusMsg'])
            }
        });
    }

    exportAsXLSX(stockTab) {
        this.loader = true;
        this.service.post_rqst({ 'dr_id': this.dr_id, activeTab: stockTab }, "Stock/stockExcel").subscribe((result => {

            if (result['statusCode'] == 200) {
                this.loader = false;
                window.open(this.downurl + result['filename'])
            } else {
                this.loader = false;
                this.toast.errorToastr('Data not found');
            }
        }));
    }


    invoice_listing: any = []
    invoice_calenderInfo: any = []
    overall_total_sum: any = {}
    invoiceMonth: any
    invoiceYear: any
    invoice_loader: boolean = false
    invoice_data(month, year) {

        this.invoiceMonth = month;
        this.invoiceYear = year;
        this.filter.customer_code2 = this.dr_detail.dr_code;
        this.invoice_loader = true
        if (this.pagenumber > this.total_page) {
            this.pagenumber = this.total_page;
            this.start = this.pageCount - this.page_limit;
        }
        if (this.start < 0) {
            this.start = 0;
        }
        this.service.post_rqst({ 'filter': this.filter, dr_id: this.dr_id, 'month': month, 'year': year, 'start': this.start, 'pagelimit': this.page_limit, }, "Account/tallyInvoiceCreditBillingListing").subscribe((result) => {

            if (result['statusCode'] == 200) {
                this.invoice_loader = false
                this.invoice_listing = result['credit_billing_list'];
                this.invoice_calenderInfo = result['calenderInfo'];
                this.overall_total_sum = result['overall_total_sum'];
                this.pageCount = result['count'];
                for (let i = 0; i < this.invoice_listing.length; i++) {
                    this.invoice_listing[i]['encrypt_id_invoice'] = this.cryptoService.encryptId(this.invoice_listing[i]['id'].toString());
                }
                if (this.pagenumber > this.total_page) {
                    this.pagenumber = this.total_page;
                    this.start = this.pageCount - this.page_limit;
                }
                else {
                    this.pagenumber = Math.ceil(this.start / this.page_limit) + 1;
                }
                this.total_page = Math.ceil(this.pageCount / this.page_limit);
                this.sr_no = this.pagenumber - 1;
                this.sr_no = this.sr_no * this.page_limit;
                for (let index = 0; index < this.invoice_calenderInfo.length; index++) {
                    const date = new Date();
                    date.setMonth(this.invoice_calenderInfo[index].month - 1);
                    let MonthName = ''
                    MonthName = date.toLocaleString('en-US', { month: 'short' })
                    this.invoice_calenderInfo[index].month_name = MonthName
                }
            } else {
                this.invoice_loader = false
                this.toast.errorToastr(result['statusMsg'])
            }
        });
    }
    public onDate(event): void {
        this.search_val.date = moment(event.value).format('YYYY-MM-DD');
        this.invoice_data(this.invoiceMonth, this.invoiceYear);
        this.payment_data(this.paymentMonth, this.paymentYear);
        this.cn_data(this.cnMonth, this.cnYear);
    }

    payment_listing: any = []
    payment_calenderInfo: any = []
    paymentoverall_total_sum: any = {}
    paymentMonth: any
    paymentYear: any
    payment_loader: boolean = false
    orgCode: any = [];
    payment_data(month, year) {
        this.paymentMonth = month;
        this.paymentYear = year;
        this.filter.account_code = this.dr_detail.dr_code;
        this.payment_loader = true
        if (this.pagenumber > this.total_page) {
            this.pagenumber = this.total_page;
            this.start = this.pageCount - this.page_limit;
        }
        if (this.start < 0) {
            this.start = 0;
        }
        this.service.post_rqst({ 'filter': this.filter, dr_id: this.dr_id, 'month': month, 'year': year, 'start': this.start, 'pagelimit': this.page_limit, }, "Account/pendingBillPaymentsListing").subscribe((result) => {
            console.log(result);
            if (result['statusCode'] == 200) {
                this.payment_listing = result['result'];
                for (let index = 0; index < this.payment_listing.length; index++) {
                    this.orgCode.push(this.payment_listing[index].organisation_id);
                    console.log(this.orgCode);
                }
                console.log(this.payment_listing);
                this.payment_loader = false
                // this.payment_calenderInfo = result['calenderInfo'];
                // this.paymentoverall_total_sum = result['overall_total_payment_amount'];
                this.pageCount = result['count'];
                if (this.pagenumber > this.total_page) {
                    this.pagenumber = this.total_page;
                    this.start = this.pageCount - this.page_limit;
                }
                else {
                    this.pagenumber = Math.ceil(this.start / this.page_limit) + 1;
                }
                this.total_page = Math.ceil(this.pageCount / this.page_limit);
                this.sr_no = this.pagenumber - 1;
                this.sr_no = this.sr_no * this.page_limit;
                // for (let index = 0; index < this.payment_calenderInfo.length; index++) {
                //     const date = new Date();
                //     date.setMonth(this.payment_calenderInfo[index].month - 1);
                //     let MonthName = ''
                //     MonthName = date.toLocaleString('en-US', { month: 'short' })
                //     this.payment_calenderInfo[index].month_name = MonthName
                // }
            } else {
                this.payment_loader = false
                this.toast.errorToastr(result['statusMsg'])
            }
        });
    }
    cn_listing: any = []
    cn_calenderInfo: any = []
    cn_total_sum: any = {}
    cnMonth: any
    cnYear: any
    cn_loader: boolean = false
    cn_data(month, year) {
        this.cnMonth = month;
        this.cnYear = year;
        this.filter.account_code = this.dr_detail.dr_code;
        this.cn_loader = true
        if (this.pagenumber > this.total_page) {
            this.pagenumber = this.total_page;
            this.start = this.pageCount - this.page_limit;
        }
        if (this.start < 0) {
            this.start = 0;
        }
        this.service.post_rqst({ 'filter': this.filter, dr_id: this.dr_id, 'month': month, 'year': year, 'start': this.start, 'pagelimit': this.page_limit, }, "Account/paymentListing").subscribe((result) => {

            if (result['statusCode'] == 200) {
                this.cn_loader = false
                this.cn_listing = result['result'];
                this.cn_calenderInfo = result['header_data'];
                this.cn_total_sum = result['overall_total_payment_amount'];
                this.pageCount = result['count'];
                if (this.pagenumber > this.total_page) {
                    this.pagenumber = this.total_page;
                    this.start = this.pageCount - this.page_limit;
                }
                else {
                    this.pagenumber = Math.ceil(this.start / this.page_limit) + 1;
                }
                this.total_page = Math.ceil(this.pageCount / this.page_limit);
                this.sr_no = this.pagenumber - 1;
                this.sr_no = this.sr_no * this.page_limit;
                // for (let index = 0; index < this.cn_calenderInfo.length; index++) {
                //     const date = new Date();
                //     date.setMonth(this.cn_calenderInfo[index].month - 1);
                //     let MonthName = ''
                //     MonthName = date.toLocaleString('en-US', { month: 'short' })
                //     this.cn_calenderInfo[index].month_name = MonthName
                // }
            } else {
                this.cn_loader = false
                this.toast.errorToastr(result['statusMsg'])
            }
        });
    }






    point_ledger: any = [];
    getPointLedger() {
        this.ledger_loader = true
        if (this.pagenumber > this.total_page) {
            this.pagenumber = this.total_page;
            this.start = this.pageCount - this.page_limit;
        }
        if (this.start < 0) {
            this.start = 0;
        }
        this.service.post_rqst({ 'id': this.dr_id, 'type': this.user_type, 'filter': this.filter, 'start': this.start, 'pagelimit': this.page_limit, }, "CustomerNetwork/drPointLedger").subscribe((result) => {

            if (result['statusCode'] == 200) {
                this.ledger_loader = false
                this.point_ledger = result['dr_ledger'];
                this.pageCount = result['count'];
                if (this.pagenumber > this.total_page) {
                    this.pagenumber = this.total_page;
                    this.start = this.pageCount - this.page_limit;
                }
                else {
                    this.pagenumber = Math.ceil(this.start / this.page_limit) + 1;
                }
                this.total_page = Math.ceil(this.pageCount / this.page_limit);
                this.sr_no = this.pagenumber - 1;
                this.sr_no = this.sr_no * this.page_limit;
            } else {
                this.ledger_loader = false
                this.toast.errorToastr(result['statusMsg'])
            }
        });
    }


    viewInvoice(start, end) {
        const dialogRef = this.dialog.open(InvoiceListModalComponent, {
            panelClass: 'full-width-modal',
            data: {
                'dr_code': this.dr_detail.dr_code,
                'start_date': start,
                'end_date': end,
            }
        });
        dialogRef.afterClosed().subscribe(result => {
            if (result != undefined) {
                this.distributorDetail();
            }
        });
    }

    update_google_location(country, state, district, city, pincode, address, type) {

        const dialogRef = this.dialog.open(DistributorModelComponent, {
            width: '500px',
            data: {
                id: this.dr_id,
                country,
                state,
                district,
                city,
                pincode,
                address,
                type,
            }
        });

        dialogRef.afterClosed().subscribe(latlong => {
            if (latlong != false) {
                this.distributorDetail();
                this.DistributorTarget();
                this.DistributorSalesChr();
            }


        })
    }

    back(): void {
        this.location.back()
    }

    editDetails() {
        let state = this.dr_detail.state;
        let id = this.dr_id;
        let type = this.user_type;
        this.rout.navigate(['/add-distribution/' + this.user_type + '/' + this.dr_id], { queryParams: { state, id, type } });
    }
    // edit details

    discountEdit() {
        this.discountFlag = true;
    }
    // Update Discount Start
    UpdateDiscount(data) {
        if (data.discount > 100) {
            this.toast.errorToastr('Discount not greater than 100');
            return
        }
        if (data.discount <= 0) {
            this.toast.errorToastr('Discount value more than 0');
            return
        }

        this.service.post_rqst({ 'discount_id': data.discount_id, 'discount': data.discount, 'id': data.id, "dr_id": this.dr_id, 'last_updated_by': this.userId, 'last_updated_by_name': this.userName }, "CustomerNetwork/updateDrSegmentDiscountList").subscribe((result => {

            if (result['statusCode'] == 200) {
                this.discountFlag = false;
                this.toast.successToastr(result['statusMsg']);
                this.getSegment();
            }
            else {
                this.toast.errorToastr(result['statusMsg']);
            }
        }))
    }

    UpdateNetPrice(data) {
        if (data.discount > data.mrp) {
            this.toast.errorToastr('Customize Net Price not be greater than mrp');
            return
        }
        this.service.post_rqst({ 'data': { 'dr_net_price': data.dr_net_price, 'product_id': data.id, "drId": this.dr_id, 'last_updated_by': this.userId, 'last_updated_by_name': this.userName } }, "CustomerNetwork/additionalDrNetPrice").subscribe((result => {
            if (result['statusCode'] == 200) {
                this.discountFlag = false;
                this.toast.successToastr(result['statusMsg']);
                this.getSegment();
            }
            else {
                this.toast.errorToastr(result['statusMsg']);
            }
        }))
    }

    // Update Discount End
    goTODetail(id, status) {
        this.rout.navigate(['/order-detail/' + id], { queryParams: { id, status } });
    }
    goTOSECONDARYDetail(id, status) {
        this.rout.navigate(['/secondary-order-detail/' + id], { queryParams: { id, status } });
    }

    convert_dr(type) {
        this.alert.confirm('Convert').then((result) => {
            if (result) {
                this.service.post_rqst({ type: type, dr_id: this.dr_id }, "CustomerNetwork/dr_type_update").subscribe((result => {


                    if (result['statusCode'] == 200) {
                        this.toast.successToastr(result['statusMsg']);
                        if (type == 1) {
                            this.rout.navigate(['/distribution-list/' + 1 + '/Channel Partner']);
                        }
                        if (type == 7) {
                            this.rout.navigate(['/distribution-list/' + 7 + '/Direct Dealers']);
                        }
                        if (type == 3) {
                            this.rout.navigate(['/distribution-list/' + 3 + '/Dealer']);
                        }
                    } else {
                        this.toast.errorToastr(result['statusMsg']);
                    }
                }));
            }
        });
    }

    convertDr(network_type): void {
        const dialogRef = this.dialog.open(StatusModalComponent, {
            width: '500px',
            panelClass: 'cs-modal',
            disableClose: true,
            data: {
                from: 'dr-convert',
                'dr_type': network_type == 'Primary' ? 3 : 1,
                'dr_id': this.dr_detail.id,
                'network_type': network_type == 'Primary' ? 'Secondary' : 'Primary'
            }
        });

        dialogRef.afterClosed().subscribe(result => {
            if (result == true) {
                this.distributorDetail()
            }
        });
    }





    mergeData(type) {
        const dialogRef = this.dialog.open(DesignationComponent, {
            width: '750px',
            panelClass: 'cs-modal',
            disableClose: true,
            data: {
                'type': type,
                'network_type': this.network_type
            }

        });

        dialogRef.afterClosed().subscribe(result => {
            if (result == true) {
                if (this.network_type == 'Primary') {
                    this.rout.navigate(['/distribution-list/1/Primary']);
                } else {
                    this.rout.navigate(['/distribution-list/3/Secondary']);
                }
            }
        });
    }

    openReqProductsDialog(reqProductData): void {
        const dialogRef = this.dialog.open(StatusModalComponent, {
            width: '500px',
            panelClass: 'cs-modal',
            disableClose: true,
            data: {
                from: 'request_product_data',
                reqProductData: reqProductData
            }

        });

        dialogRef.afterClosed().subscribe(result => {
            if (result == true) {
                this.distributorDetail()
            }
        });
    }

    openSendProductsDialog(sendProductData): void {
        const dialogRef = this.dialog.open(StatusModalComponent, {
            width: '500px',
            panelClass: 'cs-modal',
            disableClose: true,
            data: {
                from: 'send_product_data',
                sendProductData: sendProductData
            }

        });

        dialogRef.afterClosed().subscribe(result => {
            if (result == true) {
                this.distributorDetail()
            }
        });
    }

    imageModel(image) {
        const dialogRef = this.dialog.open(ImageModuleComponent, {
            panelClass: 'Image-modal',
            data: {
                image,
            }
        });
        dialogRef.afterClosed().subscribe(result => {
        });
    }

    openModalStockToRetailer(stockType): void {
        const dialogRef = this.dialog.open(StatusModalComponent, {
            width: '750px',
            panelClass: 'cs-model',
            data: {
                drType: this.user_type,
                company_name: this.dr_detail.company_name,
                drId: this.dr_id,
                from: 'sendStockToRetailer',
                type: stockType
            }
        });

        dialogRef.afterClosed().subscribe(result => {
            if (result != false) {
                this.getDrStock(this.stockTab);
            }
        });
    }

    getStatusChnage(reqProductData): void {
        const dialogRef = this.dialog.open(StatusModalComponent, {
            width: '600px',
            panelClass: 'cs-model',
            data: {
                drType: this.user_type,
                company_name: this.dr_detail.company_name,
                drId: this.dr_id,
                from: 'stockRequestDetailsModal',
                reqProductData: reqProductData
            }
        });

        dialogRef.afterClosed().subscribe(result => {
            if (result != false) {
                this.getTransferRequests(this.activeTab);
            }
        });
    }

    updateKycStatus(id): void {

        // if (!this.dr_detail.adhar_no || this.dr_detail.document_image == '' || this.dr_detail.document_image_back == '') {
        //     this.toast.errorToastr('Update document details first');
        //     return
        // }
        if (!this.dr_detail.bank_name || !this.dr_detail.account_no || !this.dr_detail.ifsc_code || !this.dr_detail.account_holder_name || this.dr_detail.bank_img == '') {
            this.toast.errorToastr('Update bank detail first');
            return
        }


        const dialogRef = this.dialog.open(UpdateKycComponent, {
            width: '500px',
            panelClass: 'cs-modal',
            data: {
                'kyc_id': id,
                'kyc_type': 'secondary'
            }
        });

        dialogRef.afterClosed().subscribe(result => {
            if (result == true) {
                this.distributorDetail();
            }
        });
    }



    openBottomSheet(): void {
        this.bottomSheet.open(BottomSheetComponent, {
            data: {
                'filterPage': 'Customer_network',
            }
        });
        this.bottomSheet._openedBottomSheetRef.afterDismissed().subscribe((data) => {
            if (data) {
                this.filter.date_from = data.date_from;
                this.filter.date_to = data.date_to;
                if (this.ledgerType == 'ledger') {
                    this.getLedger();
                } else {
                    this.getCheckin();
                }
            }

        })
    }
}