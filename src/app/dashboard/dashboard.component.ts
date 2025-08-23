import { Component, OnInit, Renderer2, ElementRef, ViewChild } from '@angular/core';
import { DatabaseService } from 'src/_services/DatabaseService'
import { Router, ActivatedRoute } from '@angular/router';
import { MatBottomSheet, MatDialog } from '@angular/material';
import { sessionStorage } from '../localstorage.service';
import { FormControl } from '@angular/forms'
import { Chart } from 'chart.js';
import * as Highcharts from 'highcharts/highmaps';
import { DatePipe } from '@angular/common';
import indiaMap from '../../assets/indiaMap';
import { ToastrManager } from 'ng6-toastr-notifications';
import { CryptoService } from 'src/_services/CryptoService';
import * as moment from 'moment';
import { BottomSheetComponent } from '../bottom-sheet/bottom-sheet.component';
import { DashboardModalComponent } from '../dashboard-modal/dashboard-modal.component';


@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  providers: [DatePipe]
})


export class DashboardComponent implements OnInit {

  targetTilesData: any = {}
  today_date: any = new Date();
  search: any = {};
  currentFinancialYearTarget: any = {}
  currentMonthTarget: any = {}
  productCategoryReport: any = []
  financialYearSalesReport: any = []
  regionWiseReport: any = []
  rsmWiseOrders: any = [];
  salesMeterReport: any = {}
  visitMeterReport: any = {}
  segmentBrandWise: any = [];
  rsmTargetAchievement: any = [];
  stateTargetAchievement: any = [];
  financialYearSalesGrowth: any = [];
  multiStackedConfig: any = []
  // charts
  vbulletConfig: any;
  comparisionConfig: any;
  horizontalBarChart: ZingchartAngular.graphset;
  config: any;
  stateWiseData: any = [];
  filter: any = {}

  complaintTabValue: any = '< 24 Hrs';
  monthList: any = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December"
  ]

  today: any = new Date();
  lastDay: any = new Date(this.today.getFullYear(), this.today.getMonth() + 1, 0).getDate()
  currentDay: any = this.today.getDate()
  logined_user_data: any = {};
  loaderInfluencer: boolean = false;
  last30Loader: boolean = false;
  sourceWiseConversion: any = [];
  // ---DMS---//
  yearlyMonth: any = [];
  yearlyInvoice: any = [];
  yearlyCollection: any = [];
  yearlyOrders: any = [];
  dailyDays: any = [];
  dailyInvoice: any = [];
  dailyCollection: any = [];
  ageValue: any = [];
  overdueByRegion: any = [];
  overdueByRegionStateWise: any = [];
  topOverDueCustomerData: any = [];
  topOverDueTotalData: any = [];
  totalOutstandingBalance: any = 0;
  totalWithinDueBalance: any = 0;
  totalOverdueBalance: any = 0;
  overduePercentage: any = 0;
  invoiceCollectionBarChart: any = {};
  invoiceOrderBarChart: any = {};
  invoiceCollectionChart: any = {};
  duBalanceAgeChart: any = {};
  overdueByRegionPieChart: any = {};
  totalExpense: any = {};
  WithinDueBalanceGraphSkeleton = true;
  OutstandingBalanceGraphSkeleton = true;
  totalOverdueBalanceSkeleton = true;
  topOverDueCustomerDataSkeleton: boolean = true;

  overduePercentageSkeleton = false;
  requestsend: boolean = false;
  currentMonth: any = this.today.getMonth();
  currentYear: any = this.today.getFullYear();
  categoryWisestock: any = [];
  sorting_type: any = ''
  column: any = ''
  sortingfilter: any = {}
  departmentType: any;
  dashboardView: boolean = false;
  currentYearComparisionReport: any = [];
  previousComparisionReport: any = [];


  constructor(public toast: ToastrManager, private bottomSheet: MatBottomSheet, public cryptoService: CryptoService, public service: DatabaseService, public dialog: MatDialog, public route: Router, private renderer: Renderer2, public session: sessionStorage, public rout: ActivatedRoute,) {
    let assign_login_data: any
    assign_login_data = this.session.getSession();
    this.logined_user_data = assign_login_data.value.data;
    this.search.enquirycounts = '';
    this.search.enquirySources = '';
  }


  ngOnInit() {
    this.rout.params.subscribe(params => {
      console.log('parms ', params)
      this.departmentType = params['type'];
      if ((this.tabValue == 'Sales' && this.logined_user_data.view_sfa_dashboard == '1' && (this.departmentType == 'SFA' || this.departmentType == 'All')) ||
        (this.tabValue == 'Enquiry' && this.logined_user_data.view_sfa_dashboard == '1' && (this.departmentType == 'SFA' || this.departmentType == 'All')) ||
        (this.tabValue == 'Account' && this.logined_user_data.view_dms_dashboard == '1' && (this.departmentType == 'DMS' || this.departmentType == 'All')) ||
        (this.tabValue == 'Influencer Reward' && this.logined_user_data.view_loyalty_dashboard == '1' && (this.departmentType == 'LOYALTY' || this.departmentType == 'All'))
      ) {
        this.dashboardView = false;
      }
      else {
        this.dashboardView = true;
      }
      // this.getTabValueBasedOnDepartment();
    });


    // setTimeout(() => {
    //   this.getindiaMap();
    // }, 700);
  }

  openModal(type, id) {
    const dialogRef = this.dialog.open(DashboardModalComponent, {
      width: '1200px',
      data: {
        'type': type,
        'id': id,
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result != false) {
      }
    });
  }


  getTabValueBasedOnDepartment() {
    if ((this.departmentType == 'SFA' || this.departmentType == 'All') && this.logined_user_data.view_sfa_dashboard == '1') {
      this.getTabValue({ tab: { textLabel: 'Sales' } });
    } else if ((this.departmentType == 'DMS' || this.departmentType == 'All') && this.logined_user_data.view_dms_dashboard == '1') {
      this.getTabValue({ tab: { textLabel: 'Account' } });
    } else if ((this.departmentType == 'LOYALTY' || this.departmentType == 'All') && this.logined_user_data.view_loyalty_dashboard == '1') {
      this.getTabValue({ tab: { textLabel: 'Influencer Reward' } });
    }
  }


  tabs = ['Sales', 'Enquiry', 'Influencer Reward', 'Account',];
  // tabs = ['Sales', 'Enquiry', 'Account', 'Influencer Reward', 'Service'];

  transectionValue: any = [100, 0, 25, 12, 25, 10, 100, 80, 25, 12, 25, 10];
  invoiceValue: any = [40000, 50000, 35000, 21000, 10000, 17000, 80000, 13000, 40000, 50000, 35000, 21000];
  collectionValue: any = [35000, 40000, 35000, 17000, 5000, 12000, 40000, 3000, 35000, 40000, 15000, 17000];
  invoiceValue1: any = [40000, 50000, 35000, 60000, 20000, 17000, 30000, 13000, 40000, 50000, 35000, 24000, 40000, 50000, 35000, 21000, 10000, 17000, 13000, 13000, 40000, 50000, 35000, 21000, 40000, 50000, 35000, 21000, 10000, 17000, 10000];
  collectionValue1: any = [35000, 40000, 35000, 17000, 5000, 12000, 25000, 3000, 35000, 40000, 15000, 18000, 35000, 40000, 35000, 17000, 5000, 12000, 10000, 3000, 35000, 40000, 15000, 17000, 35000, 40000, 35000, 17000, 10000, 17000, 10000];
  currentDate = new Date();



  segment = [
    { 'state': 'Andhra Pradesh' },
    { 'state': 'Arunachal Pradesh' },
    { 'state': 'Assam' },
    { 'state': 'Bihar' },
    { 'state': 'Chhattisgarh' },
    { 'state': 'Goa' },
    { 'state': 'Gujarat' },
    { 'state': 'Haryana' },
    { 'state': 'Himachal Pradesh' },
    { 'state': 'Jharkhand' },
    { 'state': 'Karnataka' },
    { 'state': 'Kerala' },
    { 'state': 'Madhya Pradesh	' },
    { 'state': 'Maharashtra' },
    { 'state': 'Manipur' },
    { 'state': 'Meghalaya' },
    { 'state': 'Mizoram' },
    { 'state': 'Nagaland' },
    { 'state': 'Odisha' },
    { 'state': 'Punjab' },
    { 'state': 'Rajasthan' },
    { 'state': 'Sikkim' },
    { 'state': 'Tamil Nadu' },
    { 'state': 'Telangana' },
    { 'state': 'Tripura' },
    { 'state': 'Uttar Pradesh' },
    { 'state': 'Uttarakhand' },
    { 'state': 'West Bengal' },
  ]
  tabValue: any = 'Sales';



  transform(percentage) {
    return parseInt(percentage, 10);
  }

  sfa() {
    this.get_targetTilesData();
    this.get_financialYearSalesReport();
    this.get_financialYearComparison();
    this.get_regionWiseReport();
    this.getIndiaMapData();
    this.get_segmentByPercent();
    this.get_financialYearSalesGrowth();


    setTimeout(() => {

      if (this.logined_user_data.org_id == '17') {
        this.getStateWiseTargetAchievement();
        this.getRsmWiseTargetAchievement();
      }

    }, 5000);

    // this.getRsmWiseOrders();
  }

  getindiaMap() {
    let mapIndiaOpt: any = {
      chart: {
        map: indiaMap
      },

      title: {
        text: ''
      },


      mapNavigation: {
        enabled: true,
        buttonOptions: {
          verticalAlign: 'bottom'
        }
      },

      colorAxis: {
        min: 0
      },

      series: [{
        data: this.stateWiseData,
        name: 'State Wise Sales Matrix',
        states: {
          hover: {
            color: '#BADA55'
          }
        },
        dataLabels: {
          enabled: true,
          format: '{point.name}'
        }
      }]
    }
    Highcharts.mapChart('indiaMapBox', mapIndiaOpt);
  }




  totalDays: any;
  dayInMonth: any;


  loyalty() {

    this.getInfluencerData();
    this.getTopInfluencer();


    this.getThirtyDaysScanningItemBox();
    this.getCouponStatus();
    this.getAreaWiseCouponScan();
    this.getRegionInfluencer();
    this.getScanAgeing();
    this.getTopProductCategory();
    this.getTopInflucencerSource();
    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth() + 1;
    this.totalDays = new Date(year, month, 0).getDate();
    this.dayInMonth = currentDate.getDate();
  }

  dms() {

    this.getIndiainvoices();
    this.getTotalOutstandingBalance();
    this.getTotalWithinDueBalance();
    this.getTotalOverdueBalance();
    this.gettopOverDueCustomer(this.column, this.sorting_type);
    this.getOverDuePercentage();
    this.getTotalExpense();
    this.getInvoiceOrderBarBox();
  }

  enquiry() {
    this.getTotalEnquiry();
    this.getEnquiryScore();
    this.getQualifiedEnquiry();
    this.getSourceWiseEnquiry();
    this.getSourceWiseConversion();
    this.getTopSalesUsers();
    this.getLeastSalesUser();
    this.getDataAccuracyRate();
    this.getcategoryWiseConversion();
    setTimeout(() => {
      this.getDisqualifiedEnquiry();
      this.getStateWiseEnquiry();
      if (this.logined_user_data.org_id == '17') {

        this.getRsmWiseEnquiry();
        this.getTop5dealerEnquiry();
      }

    }, 5000);

  }



  getTabValue(value) {

    this.tabValue = value.tab.textLabel;
    this.clearAll();
    // if (this.tabValue == 'Sales') {
    //   setTimeout(() => {
    //     this.getIndiaMapData();
    //     this.get_targetTilesData();
    //     this.get_financialYearSalesReport();
    //     this.get_financialYearComparison();
    //     this.get_regionWiseReport();
    //     this.get_segmentByPercent();
    //     this.get_financialYearSalesGrowth();
    //   }, 700);
    // }

    // if (this.tabValue == 'Account') {
    //   this.getIndiainvoices();
    //   this.getTotalOutstandingBalance();
    //   this.getTotalWithinDueBalance();
    //   this.getTotalOverdueBalance();
    //   this.gettopOverDueCustomer(this.column, this.sorting_type);
    //   this.getOverDuePercentage();
    //   this.getTotalExpense();
    //   this.getInvoiceOrderBarBox();
    // }

    // if (this.tabValue == 'Influencer Reward') {
    //   this.loyalty();
    // }


    // if (this.tabValue == 'Enquiry') {
    //   this.enquiry()
    // }
  }



  // DMS GRAPH HANDLERS

  getInvoiceOrderBarBox() {
    this.service.post_rqst({}, "DmsDashboard/invoiceVsOrderLast12Months").subscribe((result) => {
      if (result['statusCode'] == 200) {
        this.yearlyOrders = result['total_order_amount'];
        this.yearlyInvoice = result['invoice'];
        this.yearlyMonth = result['month'];

        this.invoiceOrderBarChart = {
          type: "bar",
          scaleX: {
            labels: this.yearlyMonth,
          },
          plot: {
            valueBox: {
              text: '%v',
              short: false,
              placement: "top-out",
              'font-color': "black",
              'font-weight': 'normal',
              'font-size': '10px',
              // thousandsSeparator: ',',
            },
            animation: {
              effect: 11,
              speed: 3000,
            }
          },
          plotarea: {
            backgroundColor: 'transparent',
            marginTop: '60px',
            marginRight: '15px',
            marginLeft: '80px'
          },
          series: [
            {
              text: 'Invoice',
              values: this.yearlyInvoice,
              backgroundColor: '#0071bd'
            },
            {
              text: 'Orders',
              values: this.yearlyOrders,
              backgroundColor: '#6ec44d'
            }
          ]
        };
      } else {
        this.toast.errorToastr(result['statusMsg'])
      }
    });
  }

  getTotalExpense() {
    this.service.post_rqst({}, "DmsDashboard/expense").subscribe((result) => {
      if (result['statusCode'] == 200) {
        this.totalExpense = result['result'];
        this.getInvoiceCollectionDailtyChart();
      } else {
        this.toast.errorToastr(result['statusMsg'])
        this.getInvoiceCollectionDailtyChart();
      }
    });
  }

  getInvoiceCollectionBarBox() {
    this.service.post_rqst({}, "DmsDashboard/invoiceVsCollectionLast12Months").subscribe((result) => {
      if (result['statusCode'] == 200) {
        this.yearlyCollection = result['collection'];
        this.yearlyInvoice = result['invoice'];
        this.yearlyMonth = result['month'];
        this.invoiceCollectionBarChart = {
          type: "bar",
          scaleX: {
            labels: this.yearlyMonth,
          },
          plot: {
            valueBox: {
              text: '%v',
              short: false,
              placement: "top-out",
              'font-color': "black",
              'font-weight': 'normal',
              'font-size': '10px',
              // thousandsSeparator: ',',
            },
            animation: {
              effect: 11,
              speed: 3000,
            }
          },
          plotarea: {
            backgroundColor: 'transparent',
            marginTop: '60px',
            marginRight: '15px',
            marginLeft: '80px'
          },
          series: [
            {
              text: 'Invoice',
              values: this.yearlyInvoice,
              backgroundColor: '#0071bd'

            },
            {
              text: 'Collection',
              values: this.yearlyCollection,
              backgroundColor: '#6ec44d'
            }
          ]
        };
      } else {
        this.toast.errorToastr(result['statusMsg'])
      }
    });
  }

  getDueBalanceAgeChart() {
    this.service.post_rqst({}, "DmsDashboard/ageAnalysisOfDueBalance").subscribe((result) => {
      if (result['statusCode'] == 200) {
        this.ageValue = result['ageValue'];
        this.duBalanceAgeChart = {
          type: 'bar',
          plot: {
            barWidth: '25px',
            tooltip: {
              borderRadius: '3px',
              borderWidth: '1px',
              fontSize: '14px',
              shadow: true,
            },
            animation: {
              effect: 4,
              method: 0,
              speed: 1600,
            },
            valueBox:
            {
              type: 'all',
              placement: "top-out",
              // short: true,
              text: '%v',
              angle: 0,
              fontSize: '10px',
              fontWeight: '100',
              "font-color": "black",

            },
          },
          scaleX: {
            "transform": {
              "type": "text",

            },
            "item": {
              "font-size": 9
            },
            wrapText: true,
            labels: ['Within<br/>Due Days', 'Over Due<br/>0-30<br/>Days', 'Over Due<br/>31-60<br/>Days', 'Over Due<br/>61-90<br/>Days', 'Due Over<br/>90 Days'],
          },
          scaleY: {
            visible: false
          },
          series: [
            {
              values: this.ageValue,
              styles: [
                { 'background-color': '#00ff00' },
                { 'background-color': '#0073bd' },
                { 'background-color': '#0073bd' },
                { 'background-color': '#0073bd' },
                { 'background-color': '#ea4335' },
              ]
            },

          ],

        };
      } else {
        this.toast.errorToastr(result['statusMsg'])
      }
    });
  }

  formatNumberIndianStyle(number: number): string {
    if (typeof number !== 'number' || isNaN(number)) {
      return ''; // Return empty string or any default value if 'number' is not a valid number
    }
    const roundedNumber = Number(number.toFixed(2));
    return roundedNumber.toLocaleString('en-IN');
  }

  getOverdueByRegion() {
    this.service.post_rqst({}, "DmsDashboard/overdueByRegion").subscribe((result) => {
      if (result['statusCode'] == 200) {
        this.overdueByRegion = result['result'];
        this.overdueByRegionPieChart = {
          type: 'ring',
          backgroundColor: '#fff',

          plot: {
            tooltip: {
              borderWidth: '0px',
              fontSize: '9px',
              sticky: true,
              thousandsSeparator: ',',
              text: "%kl %t: %v",
            },
            valueBox:
            {
              type: 'all',
              text: '%t<br>%npv%',
              placement: 'out',
              fontSize: '9px'
            },

            animation: {
              effect: 2,
              sequence: 3,
              speed: 100
            },
            backgroundColor: '#FBFCFE',
            borderWidth: '0px',
            slice: 60,
          },
          plotarea: {
            margin: '0px',
            backgroundColor: 'transparent',
            borderRadius: '10px',
            borderWidth: '0px',
          },
          series: this.overdueByRegion,
          noData: {
            text: 'No Selection',
            alpha: 0.6,
            backgroundColor: '#20b2db',
            bold: true,
            fontSize: '10px',
            textAlpha: 0.9,
          },
        };
      } else {
        this.toast.errorToastr(result['statusMsg'])
      }
    });
  }

  getInvoiceCollectionDailtyChart() {
    this.service.post_rqst({}, "DmsDashboard/invoiceVsCollection").subscribe((result) => {
      if (result['statusCode'] == 200) {
        this.dailyCollection = result['collection'];
        this.dailyInvoice = result['invoice'];
        this.dailyDays = result['days'];
        this.getInvoiceCollectionBarBox();
        this.getDueBalanceAgeChart();
        this.getOverdueByRegion();
        // this.getOverdueByRegionStateWise();

        this.invoiceCollectionChart = {
          type: "line",
          scaleX: {
            labels: this.dailyDays,
            "step": "86400000",
            "transform": {
              "type": "text",
              "all": "%d<br/>date"
            },
            "item": {
              "font-size": 9
            },
          },
          "tooltip": {
            "visible": false
          },
          plot: {
            aspect: "spline",
            "tooltip-text": "%t views: %v<br>%k",
            "shadow": 0,
            "line-width": "2px",
            "marker": {
              "type": "circle",
              "size": 3
            }
          },
          plotarea: {
            backgroundColor: 'transparent',
            marginTop: '20px',
          },
          "crosshair-x": {
            "line-color": "#efefef",
            "plot-label": {
              "border-radius": "5px",
              "border-width": "1px",
              "border-color": "#f6f7f8",
              "padding": "10px",
              "font-weight": "bold"
            },
            "scale-label": {
              "font-color": "#000",
              "background-color": "#f6f7f8",
              "border-radius": "5px"
            }
          },
          series: [
            {
              values: this.dailyInvoice,
              monotone: true,
              text: "Invoice",
              lineColor: '#0071bd',
              "marker": {
                "background-color": "#0071bd",
              },

            },
            {
              values: this.dailyCollection,
              monotone: true,
              text: "Collection",
              lineColor: '#6ec44d',
              "marker": {
                "background-color": "#6ec44d",
              },
              "highlight-state": {
                "line-width": 3
              },
            },

          ]
        }
      } else {
        this.getInvoiceCollectionBarBox();
        this.getDueBalanceAgeChart();
        this.getOverdueByRegion();
        // this.getOverdueByRegionStateWise();
        this.toast.errorToastr(result['statusMsg'])
      }
    });
  }

  getOverDuePercentage() {
    this.overduePercentageSkeleton = true;
    this.service.post_rqst({}, "DmsDashboard/overduePercentage").subscribe((result) => {
      if (result['statusCode'] == 200) {
        this.overduePercentage = result['result'];
        this.overduePercentageSkeleton = false;
      } else {
        this.toast.errorToastr(result['statusMsg'])
      }
    });
  }

  gettopOverDueCustomer(column_name, sorting_type) {
    this.topOverDueCustomerDataSkeleton = true; // Show skeleton immediately
    // Fetch data from API
    this.sortingfilter.column_name = column_name;
    this.sortingfilter.sorting_type = sorting_type;
    this.service.post_rqst({ 'filter': this.sortingfilter }, "DmsDashboard/topOverDueCustomer").subscribe((result) => {
      if (result['statusCode'] == 200) {
        // Hide skeleton and populate data
        this.topOverDueCustomerDataSkeleton = false;
        this.topOverDueCustomerData = result['result'];
        this.topOverDueTotalData = result['total'];
      } else {
        // Hide skeleton and show error message
        this.topOverDueCustomerDataSkeleton = false;
        this.toast.errorToastr(result['statusMsg'])
      }
    });
  }

  getTotalOutstandingBalance() {
    this.OutstandingBalanceGraphSkeleton = true;
    this.service.post_rqst({}, "DmsDashboard/totalOutstandingBalance").subscribe((result) => {
      if (result['statusCode'] == 200) {
        this.totalOutstandingBalance = result['result'];
        this.OutstandingBalanceGraphSkeleton = false;
      } else {
        this.toast.errorToastr(result['statusMsg'])
      }
    });
  }

  getTotalWithinDueBalance() {
    this.WithinDueBalanceGraphSkeleton = true;
    this.service.post_rqst({}, "DmsDashboard/totalWithinDueBalance").subscribe((result) => {
      if (result['statusCode'] == 200) {
        this.totalWithinDueBalance = result['result'];
        this.WithinDueBalanceGraphSkeleton = false;
      } else {
        this.toast.errorToastr(result['statusMsg'])
      }
    });
  }

  getTotalOverdueBalance() {
    this.totalOverdueBalanceSkeleton = true;
    this.service.post_rqst({}, "DmsDashboard/totalOverdueBalance").subscribe((result) => {
      if (result['statusCode'] == 200) {
        this.totalOverdueBalance = result['result'];
        this.totalOverdueBalanceSkeleton = false;
      } else {
        this.toast.errorToastr(result['statusMsg'])
      }
    });
  }
  // DMS GRAPH HANDLERS



  get_targetTilesData() {

    this.service.post_rqst({ 'data': { 'date_from': this.filter.date_from, 'date_to': this.filter.date_to } }, 'Dashboard/sales').subscribe((result) => {

      if (result['statusCode'] == 200) {
        this.targetTilesData = result['TargetData'];
        this.currentMonthTarget = this.targetTilesData.current_month_target;
        this.currentFinancialYearTarget = this.targetTilesData.current_financial_year_target;
      }
      else {
        this.toast.errorToastr(result['statusMsg']);
      }
    }, err => {
      this.toast.errorToastr('Something went wrong');
    })
  }

  getStateWiseTargetAchievement() {

    this.service.post_rqst({ 'data': { 'date_from': this.filter.date_from, 'date_to': this.filter.date_to } }, 'Dashboard/stateWiseTargetAchievement').subscribe((result) => {

      if (result['statusCode'] == 200) {
        this.stateTargetAchievement = result['result'];
      }
      else {
        this.toast.errorToastr(result['statusMsg']);
      }
    }, err => {
      this.toast.errorToastr('Something went wrong');
    })
  }

  getRsmWiseOrders() {
    this.service.post_rqst({ 'data': { 'date_from': this.filter.date_from, 'date_to': this.filter.date_to } }, 'Dashboard/rsmWiseOrderData').subscribe((result) => {

      if (result['statusCode'] == 200) {
        this.rsmWiseOrders = result['result'];
      }
      else {
        this.toast.errorToastr(result['statusMsg']);
      }
    }, err => {
      this.toast.errorToastr('Something went wrong');
    })
  }

  getRsmWiseTargetAchievement() {

    this.service.post_rqst({ 'data': { 'date_from': this.filter.date_from, 'date_to': this.filter.date_to } }, 'Dashboard/rsmWiseTargetAchievement').subscribe((result) => {

      if (result['statusCode'] == 200) {
        this.rsmTargetAchievement = result['result'];
      }
      else {
        this.toast.errorToastr(result['statusMsg']);
      }
    }, err => {
      this.toast.errorToastr('Something went wrong');
    })
  }


  get_financialYearSalesReport() {
    this.service.post_rqst({ 'data': { 'date_from': this.filter.date_from, 'date_to': this.filter.date_to } }, 'Dashboard/financialYearSalesReport').subscribe((result) => {
      if (result['statusCode'] == 200) {
        this.financialYearSalesReport = result['result'];
        let yearList = []
        let achieveList = []
        let targetList = []
        let monthList = []
        this.financialYearSalesReport.map((row, i) => {
          yearList[i] = row.year;
          achieveList[i] = row.achieve;
          targetList[i] = row.target;
          monthList[i] = row.month;
        })

        this.vbulletConfig = {
          type: 'vbullet',
          title: {
            text: '',
          },
          plot: {
            tooltip: {
              backgroundColor: 'black',
              borderRadius: '3px',
              borderWidth: '1px',
              fontSize: '14px',
              shadow: true,
            },
            animation: {
              effect: 4,
              method: 0,
              speed: 1600,
            },
            valueBox:
            {
              type: 'all',
              text: '%node-goal-value',
              'font-color': '#000',
              placement: 'goal',
            },
          },
          scaleX: {
            labels: monthList,
          },
          series: [
            {
              values: achieveList,
              dataDragging: true,
              goal: {
                backgroundColor: '#64b5f6',
                borderWidth: '1px',
                height: 0,
                borderColor: '#000'
              },
              goals: targetList,
              rules: [
                {
                  backgroundColor: '#009fb5',
                  rule: '%v >= %g',
                },
                {
                  backgroundColor: '#ef5350',
                  rule: '%v < %g/2',
                },
                {
                  backgroundColor: '#ffca28',
                  rule: '%v >= %g/2 && %v < %g',
                },
              ],
            },
          ],
        };

      }
      else {
        this.toast.errorToastr(result['statusMsg']);
      }
    }, err => {
      this.toast.errorToastr('Something went wrong');
    })
  }

  get_financialYearComparison() {
    this.service.post_rqst({ 'data': { 'date_from': this.filter.date_from, 'date_to': this.filter.date_to } }, 'Dashboard/financialYearSalesGrowthComparison').subscribe((result) => {
      if (result['statusCode'] == 200) {
        this.currentYearComparisionReport = result['result'][0]['current_fy'];
        this.previousComparisionReport = result['result'][0]['previous_fy'];
        let yearList = []
        let currentAchieveList = []
        let previousAchieveList = []
        let monthList = []
        this.currentYearComparisionReport.map((row, i) => {
          yearList[i] = row.year;
          currentAchieveList[i] = row.achievement;
          monthList[i] = row.month;
        })
        this.previousComparisionReport.map((row, i) => {
          previousAchieveList[i] = row.achievement;
        })

        this.comparisionConfig = {
          type: 'bar',
          title: {
            text: '',
          },
          plot: {
            tooltip: {
              backgroundColor: 'black',
              borderRadius: '3px',
              borderWidth: '1px',
              fontSize: '14px',
              shadow: true,
            },
            animation: {
              effect: 4,
              method: 0,
              speed: 1600,
            },
          },
          scaleX: {
            labels: monthList,
          },
          series: [
            {
              values: previousAchieveList,
              dataDragging: true,
              goal: {
                backgroundColor: '#64b5f6',
                borderWidth: '1px',
                height: 0,
                borderColor: '#000'
              },
            },

            {
              values: currentAchieveList,
              dataDragging: true,
              goal: {
                backgroundColor: '#64b5f6',
                borderWidth: '1px',
                height: 0,
                borderColor: '#000'
              },
            },
          ],
        };

      }
      else {
        this.toast.errorToastr(result['statusMsg']);
      }
    }, err => {
      this.toast.errorToastr('Something went wrong');
    })
  }

  get_regionWiseReport() {
    this.service.post_rqst({ 'data': { 'date_from': this.filter.date_from, 'date_to': this.filter.date_to } }, 'Dashboard/regionWiseReport').subscribe((result) => {
      if (result['statusCode'] == 200) {
        this.regionWiseReport = result['result'];
        let regionList = []
        let achieveList = []
        let targetList = []
        this.regionWiseReport.map((row, i) => {
          regionList[i] = row.region;
          achieveList[i] = row.achieve;
          targetList[i] = row.target;
        })

        this.horizontalBarChart = {
          type: "hbar",
          scaleX: {
            labels: regionList,
          },
          plot: {
            valueBox: {
              text: '%v',
              placement: "top-in",
              'font-color': "black",
              thousandsSeparator: ',',
            },
            animation: {
              effect: 11,
              speed: 3000,
            }
          },
          plotarea: {
            backgroundColor: 'transparent',
            marginTop: '0',
            marginRight: '15px',
            marginLeft: '80px'
          },
          series: [
            {
              values: achieveList,
              backgroundColor: '#00ccfd'
            },
            {
              values: targetList,
              backgroundColor: '#bac0c3'
            }
          ]
        };

      }
      else {
        this.toast.errorToastr(result['statusMsg']);
      }
    }, err => {
      this.toast.errorToastr('Something went wrong');
    })
  }


  get_visitMeter() {
    this.service.post_rqst({ 'data': { 'date_from': this.filter.date_from, 'date_to': this.filter.date_to } }, 'Dashboard/visitTargetReport').subscribe((result) => {
      if (result['statusCode'] == 200) {
        this.visitMeterReport = result['result'];

        this.gaugeConfig = {
          type: 'gauge',
          globals: {
            fontSize: '18px',
          },
          plot: {
            tooltip: {
              borderRadius: '5px',
              fontSize: '10px'
            },
            valueBox: {
              text: '%v',
              fontSize: '14px',
              placement: 'center',
              rules: [
                {
                  text: '%v<br>Days',
                  rule: '%v <= 30',
                },
              ],
            },
            size: '100%',
          },
          plotarea: {
            backgroundColor: 'transparent',
            marginTop: '40px',
            fontSize: '10px'
          },
          scaleR: {
            "values": `0:${this.lastDay}:10`,
            aperture: 180,
            center: {
              visible: false,
            },
            item: {
              offsetR: 0,

            },
            labels: ['1', '', '', this.lastDay],
            maxValue: this.lastDay,
            minValue: 1,
            ring: {
              rules: [
                {
                  backgroundColor: '#b5a1c8',
                  rule: '%v <= 10',
                },
                {
                  backgroundColor: '#654779',
                  rule: '%v >= 10 && %v <= 20',
                },
                {
                  backgroundColor: '#433051',
                  rule: '%v >= 20 && %v <= 30',
                },
              ],
              size: '50px'
            },
            step: 10,
            tick: {
              visible: false,
            },
          },
          refresh: {
            type: 'feed',
            url: 'feed()',
            interval: 1500,
            resetTimeout: 1000,
            transport: 'js',
          },
          series: [
            {
              values: [this.currentDay],
              animation: {
                delay: 1200,
                effect: 2,
                method: 3,
                speed: 3000,
              },
              backgroundColor: 'black',
              indicator: [0.1, 4, 5, 5, 0.3],
            },
          ],


        };

      }
      else {
        this.toast.errorToastr(result['statusMsg']);
      }
    }, err => {
      this.toast.errorToastr('Something went wrong');
    })
  }

  getIndiainvoices() {
    this.service.post_rqst({ 'data': { 'date_from': this.filter.date_from, 'date_to': this.filter.date_to } }, 'Dashboard/stateWiseReportInvoiceReport').subscribe((result) => {
      if (result['statusCode'] == 200) {
        this.stateWiseData = result['result'];
        this.getindiaMap();

      }
      else {
        this.toast.errorToastr(result['statusMsg']);
      }
    }, err => {
      this.toast.errorToastr('Something went wrong');
    })
  }

  getIndiaMapData() {
    this.service.post_rqst({ 'data': { 'date_from': this.filter.date_from, 'date_to': this.filter.date_to } }, 'Dashboard/stateWiseReport').subscribe((result) => {
      if (result['statusCode'] == 200) {
        this.stateWiseData = result['result'];
        this.getindiaMap();

      }
      else {
        this.toast.errorToastr(result['statusMsg']);
      }
    }, err => {
      this.toast.errorToastr('Something went wrong');
    })
  }

  get_segmentByPercent() {
    this.service.post_rqst({ 'data': { 'date_from': this.filter.date_from, 'date_to': this.filter.date_to } }, 'Dashboard/segmentByPercent').subscribe((result) => {
      if (result['statusCode'] == 200) {
        this.segmentBrandWise = result['brandData'];


        const colors = [
          "#FF6347",
          "#87CEEB",
          "#FFA500",
          "#00FF7F",
          "#4B0082",
          "#F0E68C",
          "#FF69B4",
          "#FF1493",
          "#3CB371",
          "#7B68EE",
          "#ADFF2F",
          "#EE82EE",
          "#00BFFF",
          "#DAA520",
          "#40E0D0",
          "#DB7093",
          "#FF8C00",
          "#48D1CC",
          "#C71585",
          "#191970",
          "#FFD700",
          "#20B2AA",
          "#7CFC00",
          "#FFB6C1",
          "#FF4500",
          "#4169E1",
          "#00FA9A",
          "#D2691E",
          "#DDA0DD",
          "#1E90FF",
          "#FFF8DC",
          "#FFDAB9",
          "#006400",
          "#90EE90",
          "#FFA07A",
          "#008080",
          "#FFFF00",
          "#FFE4B5",
          "#6495ED",
          "#2E8B57",

          "#7FFFD4",
          "#228B22",
          "#FF7F50",
          "#F08080",
          "#800080",
          "#B0E0E6",
          "#FFEFD5",
          "#9932CC"
        ];


        this.segmentPieChart = {
          type: 'ring',
          backgroundColor: '#fff',

          plot: {
            tooltip: {
              backgroundColor: 'none',
              borderWidth: '0px',
              fontSize: '10px',

              sticky: true,
              thousandsSeparator: ',',

            },
            valueBox:
            {
              type: 'all',
              text: '%t<br>%npv%',
              placement: 'out',
              fontSize: '10px'
            },
            animation: {
              effect: 2,
              sequence: 3,
              speed: 1000
            },
            backgroundColor: '#FBFCFE',
            borderWidth: '0px',
            slice: 30,
          },
          plotarea: {
            margin: '0px',
            backgroundColor: 'transparent',
            borderRadius: '10px',
            borderWidth: '0px',
          },
          series: this.segmentBrandWise.map((row, index) => ({
            text: row.category,
            values: [row.achieve],
            backgroundColor: colors[index % colors.length],
            lineColor: '#00889f',
            lineWidth: '1px',
            marker: {
              backgroundColor: '#00889f',
            },
          })),
          noData: {
            text: 'No Data Available',
            alpha: 0.6,
            backgroundColor: '#fffff',
            bold: true,
            fontSize: '10px',
            textAlpha: 0.9,
          },
        };


      }
      else {
        this.toast.errorToastr(result['statusMsg']);
      }
    }, err => {
      this.toast.errorToastr('Something went wrong');
    })
  }



  get_financialYearSalesGrowth() {


    this.service.post_rqst({ 'data': { 'date_from': this.filter.date_from, 'date_to': this.filter.date_to } }, 'Dashboard/financialYearSalesGrowth').subscribe((result) => {

      if (result['statusCode'] == 200) {
        this.financialYearSalesGrowth = result['result'];

        let yearList = []
        let achieveList = []
        let percentList = []
        let monthList = []
        this.financialYearSalesGrowth.map((row, i) => {
          yearList[i] = row.year;
          achieveList[i] = row.achieve;
          percentList[i] = row.percent;
          monthList[i] = row.month;
        })

        this.multiStackedConfig = {
          type: 'bar',
          stacked: true,
          title: {
            text: '',
            adjustLayout: true,
          },

          plot: {
            tooltip: {
              text: '%v%',
              borderRadius: '3px',
              fontColor: '#ffffff',
            },
            animation: {
              effect: 12,
              method: 0,
              speed: 1600,
            },


            valueBox: {
              text: '%total%',
              placement: "top-in",
              'font-color': "white",
              thousandsSeparator: ',',
              rules: [
                {
                  rule: '%stack-top == 0',
                  visible: false,
                },
              ],
            },
            offsetY: '-1px',
            rules: [
              {
                offsetY: '1px',
                rule: '%v <= 0',
              },
            ],
          },
          plotarea: {
            backgroundColor: 'transparent',
            margin: 'dynamic',
          },
          scaleX: {
            labels: monthList,
          },
          scaleY: {
            format: '%v',
            guide: {
              items: [
                {
                  backgroundColor: '#fff',
                }
              ],
            },
            multiplier: true,
            negation: 'currency',
            refLine: {
              lineColor: '#212121',
              lineWidth: '1px',
            },
          },
          series: [
            {
              text: 'Distributed Product',
              values: percentList,
              rules: [
                {
                  rule: '%v >= 0',
                  backgroundColor: '#00889f',
                },
                {
                  backgroundColor: '#ff4f3f',
                  rule: '%v < 0'
                }
              ],
              stack: 1,
            },
          ],

        };

      }
      else {
        this.toast.errorToastr(result['statusMsg']);
      }
    }, err => {
      this.toast.errorToastr('Something went wrong');
    })
  }




  /////////////////////////////influencers rewards/////////////



  influencerWiseCount: any = [];
  influencerStatusWiseCount: any = [];
  redeemKycCount: any = [];
  couponCount: any = [];
  couponScanCount: any = {};
  kycStatusPieChart: any;
  totalInfluencerPieChart: any;
  influencerStatusPieChart: any;
  totalInfluencer: any = 0;
  totalStatus: any = 0;
  totalKyc: any = 0;



  getInfluencerData() {
    this.loaderInfluencer = true;

    this.service.post_rqst({ 'data': { 'date_from': this.filter.date_from, 'date_to': this.filter.date_to } }, "Dashboard/dashboardCount")
      .subscribe((result => {

        if (result['statusCode'] == 200) {
          this.influencerWiseCount = result['influencer_wise_count'];
          this.influencerStatusWiseCount = result['influencer_status_wise_count'];
          this.redeemKycCount = result['redeem_kyc_count'];
          this.couponScanCount = result['coupon_type_wise_count'];
          this.loaderInfluencer = false;
          const colors = ['#D32F2F', '#C2185B', '#7B1FA2', '#3949AB', '#039BE5', '#00ACC1', '#43A047', '#C0CA33', '#FDD835', '#FB8C00', '#F4511E', '#6D4C41', '#5E35B1', '#D81B60', '#26C6DA', '#4DB6AC', '#66BB6A', '#607D8B', '#757575'];
          const statusColors = ['#00a855', '#ffc000', '#ff3636', '#fe5b19', '#039BE5', '#00ACC1', '#43A047', '#C0CA33', '#FDD835', '#FB8C00', '#F4511E', '#6D4C41', '#5E35B1', '#D81B60', '#26C6DA', '#4DB6AC', '#66BB6A', '#607D8B', '#757575'];
          this.totalInfluencer = 0;
          this.totalStatus = 0;
          for (let index = 0; index < this.influencerWiseCount.length; index++) {
            this.totalInfluencer += Number(this.influencerWiseCount[index]['influencer_count']);
            this.influencerWiseCount[index]['color'] = colors[index];
          }
          for (let index = 0; index < this.influencerStatusWiseCount.length; index++) {
            this.totalStatus += Number(this.influencerStatusWiseCount[index]['influencer_count']);
            this.influencerStatusWiseCount[index]['color'] = statusColors[index];
          }
          for (let index = 0; index < this.redeemKycCount.length; index++) {
            this.totalKyc += Number(this.redeemKycCount[index]['redeem_kyc_count']);
            this.redeemKycCount[index]['color'] = statusColors[index];
          }

          this.totalInfluencerPieChart = {
            type: 'ring',
            backgroundColor: '#fff',

            plot: {
              tooltip: {

                backgroundColor: '#000',
                borderWidth: '0px',
                fontSize: '10px',
                sticky: true,
                thousandsSeparator: ',',
              },
              valueBox:
              {
                type: 'all',
                text: '%npv%',
                "offset-r": "-4%",
                fontSize: '8px',

              },
              animation: {
                effect: 2,
                sequence: 3,
                speed: 1000
              },
              backgroundColor: '#FBFCFE',
              borderWidth: '0px',
              slice: 0,
            },
            plotarea: {
              margin: '0px',
              backgroundColor: 'transparent',
              borderRadius: '10px',
              borderWidth: '0px',
            },



            series: this.influencerWiseCount.map((row, index) => {
              if (index === 0) {
                console.log("Index 0 Value 1364:", row); // Logs the first element
              }
              if (row) {
                console.log("Index 0 Value: 1367", row); // Logs the first element
              }
              return {
                text: row.influencer_type,
                values: [Number(row.influencer_count)],
                backgroundColor: colors[index % colors.length],
                lineColor: '#00889f',
                lineWidth: '1px',
                marker: {
                  backgroundColor: '#00889f',
                },
              };
            }),
            noData: {
              text: 'No Data Available',
              alpha: 0.6,
              backgroundColor: '#ffffff',
              bold: true,
              fontSize: '10px',
              textAlpha: 0.9,
            },
          };

          this.influencerStatusPieChart = {
            type: 'ring',
            backgroundColor: '#fff',

            plot: {
              tooltip: {

                backgroundColor: '#000',
                borderWidth: '0px',
                fontSize: '10px',
                sticky: true,
                thousandsSeparator: ',',
              },
              valueBox:
              {
                type: 'all',
                text: '%npv%',
                "offset-r": "-4%",
                fontSize: '8px',

              },
              animation: {
                effect: 2,
                sequence: 3,
                speed: 1000
              },
              backgroundColor: '#FBFCFE',
              borderWidth: '0px',
              slice: 0,
            },
            plotarea: {
              margin: '0px',
              backgroundColor: 'transparent',
              borderRadius: '10px',
              borderWidth: '0px',
            },

            series: this.influencerStatusWiseCount.map((row, index) => ({
              text: row.status,
              values: [Number(row.influencer_count)],
              backgroundColor: statusColors[index % statusColors.length],
              lineColor: '#00889f',
              lineWidth: '1px',
              marker: {
                backgroundColor: '#00889f',
              },
            })),
            noData: {
              text: 'No Data Available',
              alpha: 0.6,
              backgroundColor: '#ffffff',
              bold: true,
              fontSize: '10px',
              textAlpha: 0.9,
            },
          };
          this.kycStatusPieChart = {
            type: 'ring',
            backgroundColor: '#fff',

            plot: {
              tooltip: {

                backgroundColor: '#000',
                borderWidth: '0px',
                fontSize: '10px',
                sticky: true,
                thousandsSeparator: ',',
              },
              valueBox:
              {
                type: 'all',
                text: '%npv%',
                "offset-r": "-4%",
                fontSize: '8px',

              },
              animation: {
                effect: 2,
                sequence: 3,
                speed: 1000
              },
              backgroundColor: '#FBFCFE',
              borderWidth: '0px',
              slice: 0,
            },
            plotarea: {
              margin: '0px',
              backgroundColor: 'transparent',
              borderRadius: '10px',
              borderWidth: '0px',
            },

            series: this.redeemKycCount.map((row, index) => ({
              text: row.type,
              values: [Number(row.redeem_kyc_count)],
              backgroundColor: statusColors[index % statusColors.length],
              lineColor: '#00889f',
              lineWidth: '1px',
              marker: {
                backgroundColor: '#00889f',
              },
            })),
            noData: {
              text: 'No Data Available',
              alpha: 0.6,
              backgroundColor: '#ffffff',
              bold: true,
              fontSize: '10px',
              textAlpha: 0.9,
            },
          };
        }
        else {
          result['statusMsg'];
          this.loaderInfluencer = false;
        }

      }))
  }



  bottom: any = []
  items: any = [];
  boxes: any = [];
  lastMonthDaysCouponScanCount: any = [];
  scanningInDaysChart: any;
  getThirtyDaysScanningItemBox() {

    this.last30Loader = true;

    this.service.post_rqst({ 'data': { 'date_from': this.filter.date_from, 'date_to': this.filter.date_to } }, "Dashboard/dashboardGraph").subscribe((result => {
      this.bottom = [];
      this.items = [];
      this.boxes = [];
      if (result['statusCode'] == 200) {
        this.last30Loader = false;
        this.lastMonthDaysCouponScanCount = result['result']

        for (let i = 0; i < this.lastMonthDaysCouponScanCount.scanned_date.length; i++) {
          this.bottom.push(moment(this.lastMonthDaysCouponScanCount.scanned_date[i].lable).format('D MMM YY'))

        }

        for (let i = 0; i < this.lastMonthDaysCouponScanCount.item_wise_coupon_count.length; i++) {
          this.items.push(Number(this.lastMonthDaysCouponScanCount.item_wise_coupon_count[i].value))

        }

        // for (let i = 0; i < this.lastMonthDaysCouponScanCount.master_wise_coupon_count.length; i++) {
        //   this.boxes.push(Number(this.lastMonthDaysCouponScanCount.master_wise_coupon_count[i].value))
        // }

        this.scanningInDaysChart = {
          type: "line",
          scaleX: {
            labels: this.bottom,
            "step": "86400000",
            "transform": {
              "type": "date",
              "all": "%d<br/>day"
            },
            "item": {
              "font-size": 9
            },
          },
          "tooltip": {
            "visible": false
          },
          plot: {
            aspect: "spline",
            "tooltip-text": "%t views: %v<br>%k",
            "shadow": 0,
            "line-width": "2px",
            "marker": {
              "type": "circle",
              "size": 3
            }
          },
          plotarea: {
            backgroundColor: 'transparent',
            marginTop: '20px',
          },
          "crosshair-x": {
            "line-color": "#efefef",
            "plot-label": {
              "border-radius": "5px",
              "border-width": "1px",
              "border-color": "#f6f7f8",
              "padding": "10px",
              "font-weight": "bold"
            },
            "scale-label": {
              "font-color": "#000",
              "background-color": "#f6f7f8",
              "border-radius": "5px"
            }
          },
          series: [{
            values: this.items,
            monotone: true,
            text: "Items",
            lineColor: 'var(--primary-tint)',
            "marker": {
              "background-color": "var(--primary-tint)",
            },

          },

            // {
            //   values: this.boxes,
            //   monotone: true,
            //   text: "Boxes",
            //   lineColor: 'var(--primary-tint)',
            //   "marker": {
            //     "background-color": "var(--primary-tint)",
            //   },

            // },
          ]
        }
      }
      else {
        this.last30Loader = false;
        this.toast.errorToastr(result['statusMsg'])
      }



    }))

  }


  lastCouponCount: any = [];
  lastYearCouponScanCount: any = [];
  lables: any = [];
  scannedCoupon: any = [];
  generatedCoupon: any = [];
  couponStatusBarChart: any;

  getCouponStatus() {
    this.service.post_rqst({ 'data': { 'date_from': this.filter.date_from, 'date_to': this.filter.date_to } }, "Dashboard/dashboardGraphCouponStatus").subscribe((result => {
      this.generatedCoupon = [];
      this.scannedCoupon = [];
      this.lables = [];
      if (result['statusCode'] == 200) {
        this.lastYearCouponScanCount = result['last_year_coupon_scan_count'];
        this.lastCouponCount = result['last_year_coupon_count']['coupon_count'];
        for (let i = 0; i < this.lastYearCouponScanCount.scanned_date.length; i++) {
          this.lables.push(moment(this.lastYearCouponScanCount.scanned_date[i].lable).format(' MMM '));
        }


        for (let i = 0; i < this.lastCouponCount.length; i++) {
          this.generatedCoupon.push(Number(this.lastCouponCount[i].value))
        }

        for (let i = 0; i < this.lastYearCouponScanCount.coupon_count.length; i++) {
          this.scannedCoupon.push(Number(this.lastYearCouponScanCount.coupon_count[i].value))
        }

        this.couponStatusBarChart = {
          type: "bar",
          scaleX: {
            labels: this.lables,
          },
          plot: {
            valueBox: {
              text: '%v',
              short: true,
              placement: "top-out",
              'font-color': "black",
              'font-weight': 'normal',
              'font-size': '10px',
              thousandsSeparator: ',',
            },
            animation: {
              effect: 11,
              speed: 3000,
            }
          },
          plotarea: {
            backgroundColor: 'transparent',
            marginTop: '60px',
            marginRight: '15px',
            marginLeft: '80px'
          },
          series: [
            {
              text: 'Invoice',
              values: this.generatedCoupon,
              backgroundColor: '#0071bd'

            },
            {
              text: 'Collection',
              values: this.scannedCoupon,
              backgroundColor: '#6ec44d'
            }
          ]
        };
      }
      else {
        this.toast.errorToastr(result['statusMsg'])
      }

    }))
  }



  areaWiseCouponScanChart: any;
  scanlables: any = [];
  areaWiseCoupons: any = [];
  areaWiseCoupon: any = [];
  areaWiseScanState: any = [];
  getAreaWiseCouponScan() {
    this.last30Loader = true;
    this.service.post_rqst({ 'data': { 'date_from': this.filter.date_from, 'date_to': this.filter.date_to } }, "Dashboard/stateWiseScanningGraph").subscribe((result => {
      this.areaWiseCoupon = [];
      this.scanlables = [];
      if (result['statusCode'] == 200) {
        this.last30Loader = false;
        this.areaWiseScanState = result['states'];
        this.areaWiseCoupons = result['scanned_coupon_count'];

        for (let i = 0; i < this.areaWiseScanState.length; i++) {
          this.scanlables.push(this.areaWiseScanState[i].lable)

        }

        for (let i = 0; i < this.areaWiseCoupons.length; i++) {
          this.areaWiseCoupon.push(this.areaWiseCoupons[i].value)

        }

        this.areaWiseCouponScanChart = {
          type: "line",
          scaleX: {
            labels: this.scanlables,
            "step": "86400000",
            "transform": {
              "type": "date",
              "all": "%d<br/>day"
            },
            "item": {
              "font-size": 9
            },
          },
          "tooltip": {
            "visible": false
          },
          plot: {
            aspect: "spline",
            "tooltip-text": "%t views: %v<br>%k",
            "shadow": 0,
            "line-width": "2px",
            "marker": {
              "type": "circle",
              "size": 3
            }
          },
          plotarea: {
            backgroundColor: 'transparent',
            marginTop: '20px',
          },
          "crosshair-x": {
            "line-color": "#efefef",
            "plot-label": {
              "border-radius": "5px",
              "border-width": "1px",
              "border-color": "#f6f7f8",
              "padding": "10px",
              "font-weight": "bold"
            },
            "scale-label": {
              "font-color": "#000",
              "background-color": "#f6f7f8",
              "border-radius": "5px"
            }
          },
          series: [{
            values: this.areaWiseCoupon,
            monotone: true,
            text: "Coupon Count",
            lineColor: 'var(--primary-tint)',
            "marker": {
              "background-color": "var(--primary-tint)",
            },

          },


          ]
        }

      }
      else {
        this.toast.errorToastr(result['statusMsg'])
      }

    }))
  }


  topInfluencer: any = [];
  getTopInfluencer() {

    this.service.post_rqst({ 'data': { 'date_from': this.filter.date_from, 'date_to': this.filter.date_to } }, "Dashboard/topTenInfluencerList").subscribe((result => {

      if (result['statusCode'] == 200) {
        this.topInfluencer = result['result']
      }
      else {
        this.toast.errorToastr(result['statusMsg'])
      }
    }))

  }


  RegionWise: any = [];
  regionScanningBarChart: any = {};


  getRegionInfluencer() {
    this.service.post_rqst({ 'data': { 'date_from': this.filter.date_from, 'date_to': this.filter.date_to } }, "Dashboard/regionWiseData").subscribe((result => {

      if (result['statusCode'] == 200) {
        this.RegionWise = result['result'];
        let region = [];
        let scanPercent = [];
        let influencerPercent = [];
        for (let index = 0; index < this.RegionWise.length; index++) {
          region.push(this.RegionWise[index]['region']);
          scanPercent.push(this.RegionWise[index]['scan_percent']);
          influencerPercent.push(this.RegionWise[index]['influencer_percent']);
        }

        this.regionScanningBarChart = {
          type: "hbar",
          scaleX: {
            labels: region
          },
          scaleY: {
            visible: false
          },
          plot: {
            valueBox: {
              text: '%v%',
              placement: "top-in",
              'font-color': "#fff",
              'font-weight': '400',
              thousandsSeparator: ',',
            },
            animation: {
              effect: 11,
              speed: 3000,
            }
          },
          plotarea: {
            backgroundColor: 'transparent',
            marginTop: '0',
            marginRight: '15px',
            marginLeft: '80px'
          },
          series: [
            {
              values: scanPercent,
              backgroundColor: 'var(--text)'
            },
            {
              values: influencerPercent,
              backgroundColor: 'var(--primary-tint)'
            }
          ],
          noData: {
            text: 'No Data Available',
            alpha: 0.6,
            backgroundColor: '#ffffff',
            bold: true,
            fontSize: '10px',
            textAlpha: 0.9,
          },
        };
      }
      else {
        this.toast.errorToastr(result['statusMsg']);
      }






    }))

  }



  ScanAgeing: any = {};
  scanningAgeChart: any = {};

  getScanAgeing() {

    this.service.post_rqst({ 'data': { 'date_from': this.filter.date_from, 'date_to': this.filter.date_to } }, "Dashboard/couponScanAgeing").subscribe((result => {

      if (result['statusCode'] == 200) {
        this.ScanAgeing = result['data'];
        let lastSevenDaysCount = this.ScanAgeing.count_0_7_days;
        let lastOneMonthCount = this.ScanAgeing.count_last_30_days;
        let lastSixMonthCount = this.ScanAgeing.count_last_6_months;
        let lastOneYearCount = this.ScanAgeing.count_last_1_year;
        let NotScannedCount = this.ScanAgeing.count_not_scanned;
        this.scanningAgeChart = {
          type: 'bar',
          plot: {
            barWidth: '25px',
            tooltip: {
              borderRadius: '3px',
              borderWidth: '1px',
              fontSize: '14px',
              shadow: true,
            },
            animation: {
              effect: 4,
              method: 0,
              speed: 1600,
            },
            valueBox:
            {
              type: 'all',
              placement: "top-out",
              short: true,
              // text: '%v%',
              angle: 0,
              fontSize: '10px',
              fontWeight: '100',
              "font-color": "black",

            },
          },
          scaleX: {
            "transform": {
              "type": "text",

            },
            "item": {
              "font-size": 9
            },
            wrapText: true,
            labels: ['0-7<br/>Days', 'Last 30<br/>Days', 'Last 06<br/>Months', 'Last<br/>01 Year', 'Not<br/>Scanning'],
          },
          scaleY: {
            visible: false
          },
          series: [
            {
              values: [lastSevenDaysCount, lastOneMonthCount, lastSixMonthCount, lastOneYearCount, NotScannedCount],
              styles: [
                { 'background-color': 'var(--success)' },
                { 'background-color': 'var(--primary-tint)' },
                { 'background-color': 'var(--primary-tint)' },
                { 'background-color': 'var(--primary-tint)' },
                { 'background-color': '#ea4335' },
              ]
            },

          ],
          noData: {
            text: 'No Data Available',
            alpha: 0.6,
            backgroundColor: '#ffffff',
            bold: true,
            fontSize: '10px',
            textAlpha: 0.9,
          },

        };
      }
      else {
        this.toast.errorToastr(result['statusMsg'])
      }
    }))

  }


  topProductCategory: any = [];
  topState: any = [];
  getTopProductCategory() {

    this.service.post_rqst({ 'data': { 'date_from': this.filter.date_from, 'date_to': this.filter.date_to } }, "Dashboard/topProductCategory").subscribe((result => {
      if (result['statusCode'] == 200) {
        this.topProductCategory = result['data']['top_scans_categorywise'];
        this.topState = result['data']['top_scans_statewise'];
      }
      else {
        this.toast.errorToastr(result['statusMsg']);
      }


    }))

  }


  ScanMeter: any = []
  ReddemMeter: any = []
  InflunecerSource: any = [];
  influencerConversionPieChart: any

  getTopInflucencerSource() {

    this.service.post_rqst({ 'data': { 'date_from': this.filter.date_from, 'date_to': this.filter.date_to } }, "Dashboard/topInfluencerSource").subscribe((result => {


      if (result['statusCode'] == 200) {
        this.InflunecerSource = result['result']
        const colors = ['#D32F2F', '#C2185B', '#7B1FA2', '#3949AB', '#039BE5', '#00ACC1', '#43A047', '#C0CA33', '#FDD835', '#FB8C00', '#F4511E', '#6D4C41', '#5E35B1', '#D81B60', '#26C6DA', '#4DB6AC', '#66BB6A', '#607D8B', '#757575'];

        for (let index = 0; index < this.InflunecerSource.length; index++) {
          this.InflunecerSource[index]['color'] = colors[index];
        }


        this.influencerConversionPieChart = {
          type: 'ring',
          backgroundColor: '#fff',

          plot: {
            tooltip: {
              backgroundColor: 'black',
              borderWidth: '0px',
              fontSize: '10px',
              sticky: true,
              thousandsSeparator: ',',
              text: '%t<br/>%npv%'
            },
            valueBox:
            {
              type: 'all',
              text: '%npv%',
              placement: 'out',
              fontSize: '10px'
            },

            animation: {
              effect: 2,
              sequence: 3,
              speed: 1000
            },
            backgroundColor: '#FBFCFE',
            borderWidth: '0px',

            slice: 60,
          },
          plotarea: {
            margin: '0px',
            backgroundColor: 'transparent',
            borderRadius: '10px',
            borderWidth: '0px',
          },


          series: this.InflunecerSource.map((row, index) => ({
            text: row.registration_source,
            values: [row.percentage],
            backgroundColor: colors[index % colors.length],
            lineColor: colors[index % colors.length],
            lineWidth: '1px',
            marker: {
              backgroundColor: 'var(--success)',
            },
          })),
          noData: {
            text: 'No Data Available',
            alpha: 0.6,
            backgroundColor: '#ffffff',
            bold: true,
            fontSize: '10px',
            textAlpha: 0.9,
          },
        };

      }
      else {
        this.toast.errorToastr(result['statusMsg']);
      }



    }))

  }

  /////////////////////////////////////////CHARTS/////////////////////////////////////
  segmentPieChart: ZingchartAngular.graphset = {
    type: 'ring',
    backgroundColor: '#fff',

    plot: {
      tooltip: {
        backgroundColor: 'none',
        borderWidth: '0px',
        fontSize: '10px',

        sticky: true,
        thousandsSeparator: ',',

      },
      valueBox:
      {
        type: 'all',
        text: '%t<br>%npv%',
        placement: 'out',
        fontSize: '10px'
      },
      animation: {
        effect: 2,
        sequence: 3,
        speed: 1000
      },
      backgroundColor: '#FBFCFE',
      borderWidth: '0px',
      slice: 30,
    },
    plotarea: {
      margin: '0px',
      backgroundColor: 'transparent',
      borderRadius: '10px',
      borderWidth: '0px',
    },
    noData: {
      text: 'No Data Available',
      alpha: 0.6,
      backgroundColor: '#ffffff',
      bold: true,
      fontSize: '10px',
      textAlpha: 0.9,
    },
  };

  leadPieChart: ZingchartAngular.graphset = {
    type: 'ring',
    backgroundColor: '#fff',

    plot: {
      tooltip: {
        backgroundColor: 'none',
        borderWidth: '0px',
        fontSize: '10px',

        sticky: true,
        thousandsSeparator: ',',
      },
      valueBox:
      {
        type: 'all',
        text: '%t<br>%npv%',
        placement: 'out',
        fontSize: '10px'
      },
      animation: {
        effect: 2,
        sequence: 3,
        speed: 1000
      },
      backgroundColor: '#FBFCFE',
      borderWidth: '0px',
      slice: 40,
    },
    plotarea: {
      margin: '0px',
      backgroundColor: 'transparent',
      borderRadius: '10px',
      borderWidth: '0px',
    },
    series: [
      {
        text: 'Contractor',
        values: [16541],
        backgroundColor: '#26a0fc',
        lineColor: '#26a0fc',
        lineWidth: '1px',
        marker: {
          backgroundColor: '#26a0fc',
        },
      },
      {
        text: 'Architect',
        values: [36711],
        backgroundColor: '#68d4cd',
        lineColor: '#68d4cd',
        lineWidth: '1px',
        marker: {
          backgroundColor: '#68d4cd',
        },
      },
      {
        text: 'Site',
        values: [50011],
        backgroundColor: '#ffc000',
        lineColor: '#ffc000',
        lineWidth: '1px',
        marker: {
          backgroundColor: '#ffc000',
        },
      },

    ],
    noData: {
      text: 'No Data Available',
      alpha: 0.6,
      backgroundColor: '#ffffff',
      bold: true,
      fontSize: '10px',
      textAlpha: 0.9,
    },
  };

  totalEnquiryPieChart: ZingchartAngular.graphset = {
    type: 'ring',
    backgroundColor: '#fff',

    plot: {
      tooltip: {

        backgroundColor: '#000',
        borderWidth: '0px',
        fontSize: '10px',
        sticky: true,
        thousandsSeparator: ',',
      },
      valueBox:
      {
        type: 'all',
        text: '%npv%',
        placement: 'in',
        fontSize: '8px'
      },
      animation: {
        effect: 2,
        sequence: 3,
        speed: 1000
      },
      backgroundColor: '#FBFCFE',
      borderWidth: '0px',
      slice: 40,
    },
    plotarea: {
      margin: '0px',
      backgroundColor: 'transparent',
      borderRadius: '10px',
      borderWidth: '0px',
    },
    noData: {
      text: 'No Data Available',
      alpha: 0.6,
      backgroundColor: '#ffffff',
      bold: true,
      fontSize: '10px',
      textAlpha: 0.9,
    },
  };

  qualifiedEnquiryPieChart: ZingchartAngular.graphset = {
    type: 'ring',
    backgroundColor: '#fff',

    plot: {
      tooltip: {
        backgroundColor: 'black',
        borderWidth: '0px',
        fontSize: '10px',

        sticky: true,

      },
      valueBox:
      {
        type: 'all',
        text: '%npv%',
        placement: 'in',
        fontSize: '8px'
      },

      animation: {
        effect: 2,
        sequence: 3,
        speed: 1000
      },
      backgroundColor: '#FBFCFE',
      borderWidth: '0px',
      slice: 40,
    },
    plotarea: {
      margin: '0px',
      backgroundColor: 'transparent',
      borderRadius: '10px',
      borderWidth: '0px',
    },

    series: [
      {
        text: 'Win',
        values: [200],
        backgroundColor: '#46a345',
        lineColor: '#46a345',
        lineWidth: '1px',
        marker: {
          backgroundColor: '#46a345',
        },
      },
      {
        text: 'Lost',
        values: [200],
        backgroundColor: '#ff4b4a',
        lineColor: '#ff4b4a',
        lineWidth: '1px',
        marker: {
          backgroundColor: '#ff4b4a',
        },
      },
      {
        text: 'In Process',
        values: [200],
        backgroundColor: '#ffc300',
        lineColor: '#ffc300',
        lineWidth: '1px',
        marker: {
          backgroundColor: '#ffc300',
        },
      },
    ],
    noData: {
      text: 'No Data Available',
      alpha: 0.6,
      backgroundColor: '#ffffff',
      bold: true,
      fontSize: '10px',
      textAlpha: 0.9,
    },
  };

  sourceEnquiryPieChart: ZingchartAngular.graphset = {};




  // invoiceCollectionBarChart: any = {
  //   type: "bar",
  //   scaleX: {
  //     labels: ['Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar'],
  //   },
  //   plot: {
  //     valueBox: {
  //       text: '%v',
  //       short: true,
  //       placement: "top-out",
  //       'font-color': "black",
  //       'font-weight': 'normal',
  //       'font-size': '10px',
  //       thousandsSeparator: ',',
  //     },
  //     animation: {
  //       effect: 11,
  //       speed: 3000,
  //     }
  //   },
  //   plotarea: {
  //     backgroundColor: 'transparent',
  //     marginTop: '60px',
  //     marginRight: '15px',
  //     marginLeft: '80px'
  //   },
  //   series: [
  //     {
  //       text: 'Invoice',
  //       values: this.invoiceValue,
  //       backgroundColor: '#0071bd'
  //     },
  //     {
  //       text: 'Collection',
  //       values: this.collectionValue,
  //       backgroundColor: '#6ec44d'
  //     }
  //   ]
  // };

  accountBarChart: ZingchartAngular.graphset = {
    type: "bar",
    scaleX: {
      labels: ['0 or less', '1 ~ 30', '31 ~ 60', '61 ~ 90', 'Over 90'],
    },
    plot: {
      valueBox: {
        text: '%v',
        placement: "top-in",
        'font-color': "black",
        thousandsSeparator: ',',
      },
      animation: {
        effect: 11,
        speed: 3000,
      }
    },
    plotarea: {
      backgroundColor: 'transparent',
      marginTop: '0',
      marginRight: '15px',
      marginLeft: '80px'
    },
    series: [
      {
        values: [2012, 4220, 2445, 5000, 2500],
        backgroundColor: '#00ccfd'
      },
      {
        values: [5233, 3000, 2123, 3875, 3000],
        backgroundColor: '#bac0c3'
      }
    ]
  };



  enquiryScore: any = {
    type: 'gauge',
    globals: {
      fontSize: '18px',
    },
    plot: {
      tooltip: {
        borderRadius: '5px',
        fontSize: '10px'
      },
      valueBox: {
        text: '%v%',
        fontSize: '18px',
        placement: 'center',
        rules: [
          {
            text: '%v',
            rule: '%v <= 30',
          },
        ],
      },
      size: '100%',
      animation: {
        effect: 11,
        speed: 3000,
      }
    },
    plotarea: {
      backgroundColor: 'transparent',
      marginTop: '40px',
    },
    scaleR: {
      aperture: 240,
      center: {
        visible: false,
      },
      item: {
        offsetR: 0,

      },
      labels: ['0', '', '', '', '100'],
      maxValue: 100,
      minValue: 0,
      ring: {
        rules: [
          {
            backgroundColor: '#ea4335',
            rule: '%v <= 25',
          },
          {
            backgroundColor: '#ffc300',
            rule: '%v >= 25 && %v <= 50',
          },
          {
            backgroundColor: '#2e7d32',
            rule: '%v > 50 && %v <= 100',
          },
        ],
        size: '20px',
      },
      step: 25,
      tick: {
        visible: false,
      },
    },
    refresh: {
      type: 'feed',
      url: 'feed()',
      interval: 1500,
      resetTimeout: 1000,
      transport: 'js',
    },
    series: [
      {
        values: [74],
        animation: {
          delay: 1200,
          effect: 2,
          method: 3,
          speed: 3000,
        },
        backgroundColor: 'black',
        indicator: [0.1, 4, 5, 5, 0.3],
      },
    ],

  };

  accuracyLead: any = {
    type: 'gauge',
    globals: {
      fontSize: '18px',
    },
    plot: {
      tooltip: {
        borderRadius: '5px',
        fontSize: '10px'
      },
      valueBox: {
        text: '%v%',
        fontSize: '18px',
        placement: 'center',
        rules: [
          {
            text: '%v',
            rule: '%v <= 30',
          },
        ],
      },
      size: '100%',
      animation: {
        effect: 11,
        speed: 3000,
      }
    },
    plotarea: {
      backgroundColor: 'transparent',
      marginTop: '40px',
    },
    scaleR: {
      aperture: 240,
      center: {
        visible: false,
      },
      item: {
        offsetR: 0,

      },
      labels: ['0', '', '', '', '100'],
      maxValue: 100,
      minValue: 0,
      ring: {
        rules: [
          {
            backgroundColor: '#ea4335',
            rule: '%v <= 25',
          },
          {
            backgroundColor: '#ffc300',
            rule: '%v >= 25 && %v <= 50',
          },
          {
            backgroundColor: '#2e7d32',
            rule: '%v > 50 && %v <= 100',
          },
        ],
        size: '20px',
      },
      step: 25,
      tick: {
        visible: false,
      },
    },
    refresh: {
      type: 'feed',
      url: 'feed()',
      interval: 1500,
      resetTimeout: 1000,
      transport: 'js',
    },
    series: [
      {
        values: [74],
        animation: {
          delay: 1200,
          effect: 2,
          method: 3,
          speed: 3000,
        },
        backgroundColor: 'black',
        indicator: [0.1, 4, 5, 5, 0.3],
      },
    ],

  };

  disqualifiedMeter: any = {
    type: 'ring',
    backgroundColor: '#fff',
    plot: {
      tooltip: {

        backgroundColor: 'none',
        borderWidth: '0px',
        fontSize: '0px',
        visible: false,
        sticky: true,
      },
      valueBox:
      {
        type: 'min',
        text: '%v%',
        // text: `${parseInt(data[0]/(data[0]+data[1])*100)}%`,
        fontColor: '#718096',
        fontSize: '20px',
        placement: 'center',
        visible: true,
        offsetY: '25px',
      },
      animation: {
        effect: 2,
        sequence: 3,
        speed: 1000
      },
      backgroundColor: '#FBFCFE',
      borderWidth: '0px',

      slice: 50,
    },

    plotarea: {
      margin: '0px',
      backgroundColor: 'transparent',
      borderRadius: '10px',
      borderWidth: '0px',
    },
    scaleR: {
      refAngle: 130,
      aperture: 280,
    },
    series: [
      {
        text: 'Disqualified',
        values: [50],
        backgroundColor: '#ff4b4a',
        lineColor: '#ff4b4a',
        lineWidth: '1px',
        marker: {
          backgroundColor: '#ff4b4a',
        },
      },
      {
        text: 'total',
        values: [50],
        backgroundColor: '#009fb5',
        lineColor: '#009fb5',
        lineWidth: '1px',
        marker: {
          backgroundColor: '#009fb5',
        },
      },

    ],
    noData: {
      text: 'No Data Available',
      alpha: 0.6,
      backgroundColor: '#ffffff',
      bold: true,
      fontSize: '10px',
      textAlpha: 0.9,
    },
  };

  gaugeConfig: any = {
    type: 'gauge',
    globals: {
      fontSize: '18px',
    },
    plot: {
      tooltip: {
        borderRadius: '5px',
        fontSize: '10px'
      },
      valueBox: {
        text: '%v',
        fontSize: '14px',
        placement: 'center',
        rules: [
          {
            text: '%v<br>Days',
            rule: '%v <= 30',
          },
        ],
      },
      size: '100%',
    },
    plotarea: {
      backgroundColor: 'transparent',
      marginTop: '40px',
      fontSize: '10px'
    },
    scaleR: {
      "values": `0:${this.lastDay}:10`,
      aperture: 180,
      center: {
        visible: false,
      },
      item: {
        offsetR: 0,

      },
      labels: ['1', '', '', this.lastDay],
      maxValue: this.lastDay,
      minValue: 1,
      ring: {
        rules: [
          {
            backgroundColor: '#b5a1c8',
            rule: '%v <= 10',
          },
          {
            backgroundColor: '#654779',
            rule: '%v >= 10 && %v <= 20',
          },
          {
            backgroundColor: '#433051',
            rule: '%v >= 20 && %v <= 30',
          },
        ],
        size: '50px'
      },
      step: 10,
      tick: {
        visible: false,
      },
    },
    refresh: {
      type: 'feed',
      url: 'feed()',
      interval: 1500,
      resetTimeout: 1000,
      transport: 'js',
    },
    series: [
      {
        values: [this.currentDay],
        animation: {
          delay: 1200,
          effect: 2,
          method: 3,
          speed: 3000,
        },
        backgroundColor: 'black',
        indicator: [0.1, 4, 5, 5, 0.3],
      },
    ],

  };





  sourceleadConfig: any = {};

  // duBalanceAgeChart: any = {
  //   type: 'bar',
  //   plot: {
  //     barWidth: '25px',
  //     tooltip: {
  //       borderRadius: '3px',
  //       borderWidth: '1px',
  //       fontSize: '14px',
  //       shadow: true,
  //     },
  //     animation: {
  //       effect: 4,
  //       method: 0,
  //       speed: 1600,
  //     },
  //     valueBox:
  //     {
  //       type: 'all',
  //       placement: "top-out",
  //       short: true,
  //       text: '%v',
  //       angle: 0,
  //       fontSize: '10px',
  //       fontWeight: '100',
  //       "font-color": "black",

  //     },
  //   },
  //   scaleX: {
  //     "transform": {
  //       "type": "text",

  //     },
  //     "item": {
  //       "font-size": 9
  //     },
  //     wrapText: true,
  //     labels: ['Within<br/>Due Days', 'Over Due<br/>0-30<br/>Days', 'Over Due<br/>31-60<br/>Days', 'Over Due<br/>61-90<br/>Days', 'Due Over<br/>90 Days'],
  //   },
  //   scaleY: {
  //     visible: false
  //   },
  //   series: [
  //     {
  //       values: [40000, 10000, 14000, 50000, 15000],
  //       styles: [
  //         { 'background-color': '#00ff00' },
  //         { 'background-color': '#0073bd' },
  //         { 'background-color': '#0073bd' },
  //         { 'background-color': '#0073bd' },
  //         { 'background-color': '#ea4335' },
  //       ]
  //     },

  //   ],

  // };

  categoryleadConfig: any = {};



  invoicePieChart: ZingchartAngular.graphset = {
    type: 'ring',
    backgroundColor: '#fff',

    plot: {
      tooltip: {

        backgroundColor: 'none',
        borderWidth: '0px',
        fontSize: '10px',
        sticky: true,
        thousandsSeparator: ',',
      },
      valueBox:
      {
        type: 'all',
        text: '%t<br>%npv%',
        placement: 'out',
        fontSize: '10px'
      },

      animation: {
        effect: 2,
        sequence: 3,
        speed: 1000
      },
      backgroundColor: '#FBFCFE',
      borderWidth: '0px',

      slice: 40,
    },
    plotarea: {
      margin: '0px',
      backgroundColor: 'transparent',
      borderRadius: '10px',
      borderWidth: '0px',
    },
    series: [
      {
        text: 'Invoice 1',
        values: [16541],
        backgroundColor: '#00889f',
        lineColor: '#00889f',
        lineWidth: '1px',
        marker: {
          backgroundColor: '#00889f',
        },
      },
      {
        text: 'Invoice 2',
        values: [36711],
        backgroundColor: '#3691d6',
        lineColor: '#3691d6',
        lineWidth: '1px',
        marker: {
          backgroundColor: '#3691d6',
        },
      },
      {
        text: 'Invoice 3',
        values: [50011],
        backgroundColor: '#b5a1c8',
        lineColor: '#b5a1c8',
        lineWidth: '1px',
        marker: {
          backgroundColor: '#b5a1c8',
        },
      },

    ],
    noData: {
      text: 'No Data Available',
      alpha: 0.6,
      backgroundColor: '#ffffff',
      bold: true,
      fontSize: '10px',
      textAlpha: 0.9,
    },
  };

  // overdueByRegionPieChart: ZingchartAngular.graphset = {
  //   type: 'ring',
  //   backgroundColor: '#fff',

  //   plot: {
  //     tooltip: {
  //       backgroundColor: 'black',
  //       borderWidth: '0px',
  //       fontSize: '10px',
  //       sticky: true,
  //       thousandsSeparator: ',',
  //     },
  //     valueBox:
  //     {
  //       type: 'all',
  //       text: '%t<br>%npv%',
  //       placement: 'out',
  //       fontSize: '10px'
  //     },

  //     animation: {
  //       effect: 2,
  //       sequence: 3,
  //       speed: 1000
  //     },
  //     backgroundColor: '#FBFCFE',
  //     borderWidth: '0px',

  //     slice: 60,
  //   },
  //   plotarea: {
  //     margin: '0px',
  //     backgroundColor: 'transparent',
  //     borderRadius: '10px',
  //     borderWidth: '0px',
  //   },
  //   series: [
  //     {
  //       text: 'East',
  //       values: [16541],
  //       backgroundColor: '#95ce50',
  //       lineColor: '#95ce50',
  //       lineWidth: '1px',
  //       marker: {
  //         backgroundColor: '#95ce50',
  //       },
  //     },
  //     {
  //       text: 'West',
  //       values: [36711],
  //       backgroundColor: '#ffb300',
  //       lineColor: '#ffb300',
  //       lineWidth: '1px',
  //       marker: {
  //         backgroundColor: '#ffb300',
  //       },
  //     },
  //     {
  //       text: 'North',
  //       values: [50011],
  //       backgroundColor: '#ff6f00',
  //       lineColor: '#ff6f00',
  //       lineWidth: '1px',
  //       marker: {
  //         backgroundColor: '#ff6f00',
  //       },
  //     },
  //     {
  //       text: 'South',
  //       values: [50011],
  //       backgroundColor: '#0071bd',
  //       lineColor: '#0071bd',
  //       lineWidth: '1px',
  //       marker: {
  //         backgroundColor: '#0071bd',
  //       },
  //     },

  //   ],
  //   noData: {
  //     text: 'No Data Available',
  //     alpha: 0.6,
  //     backgroundColor: '#ffffff',
  //     bold: true,
  //     fontSize: '10px',
  //     textAlpha: 0.9,
  //   },
  // };

  transectionChart: ZingchartAngular.graphset = {
    type: "line",
    scaleX: {
      // labels: ['Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar'],
      visible: false
    },
    scaleY: {
      visible: false
    },
    plot: {
      aspect: "spline",
    },
    series: [{
      values: this.transectionValue,
      monotone: true,
      text: "monotone: true"
    },

    ]
  }

  // invoiceCollectionChart: any = {
  //   type: "line",
  //   scaleX: {
  //     // labels: ['Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar'],
  //     "step": "86400000",
  //     "transform": {
  //       "type": "date",
  //       "all": "%d<br/>day"
  //     },
  //     "item": {
  //       "font-size": 9
  //     },
  //   },
  //   "tooltip": {
  //     "visible": false
  //   },
  //   plot: {
  //     aspect: "spline",
  //     "tooltip-text": "%t views: %v<br>%k",
  //     "shadow": 0,
  //     "line-width": "2px",
  //     "marker": {
  //       "type": "circle",
  //       "size": 3
  //     }
  //   },
  //   plotarea: {
  //     backgroundColor: 'transparent',
  //     marginTop: '20px',
  //   },
  //   "crosshair-x": {
  //     "line-color": "#efefef",
  //     "plot-label": {
  //       "border-radius": "5px",
  //       "border-width": "1px",
  //       "border-color": "#f6f7f8",
  //       "padding": "10px",
  //       "font-weight": "bold"
  //     },
  //     "scale-label": {
  //       "font-color": "#000",
  //       "background-color": "#f6f7f8",
  //       "border-radius": "5px"
  //     }
  //   },
  //   series: [{
  //     values: this.invoiceValue1,
  //     monotone: true,
  //     text: "Invoice",
  //     lineColor: '#0071bd',
  //     "marker": {
  //       "background-color": "#0071bd",
  //     },

  //   },
  //   {
  //     values: this.collectionValue1,
  //     monotone: true,
  //     text: "Collection",
  //     lineColor: '#6ec44d',
  //     "marker": {
  //       "background-color": "#6ec44d",
  //     },
  //     "highlight-state": {
  //       "line-width": 3
  //     },
  //   },

  //   ]
  // }




  complaintStatusBar: any = {
    type: 'bar',
    title: {
      text: '',
    },
    plot: {
      tooltip: {
        borderRadius: '3px',
        borderWidth: '1px',
        fontSize: '14px',
        shadow: true,
      },
      animation: {
        effect: 4,
        method: 0,
        speed: 1600,
      },
      valueBox:
      {
        type: 'all',
        placement: "top-in",
        text: '',
        angle: 0,
        fontSize: '10px',
        fontWeight: '100',
        "font-color": "white"
      },
    },
    scaleX: {
      labels: ['Open', 'Close', 'Spare Pending', 'Happy Calling'],
    },
    series: [
      {
        values: [20, 25, 35, 65],
        dataDragging: true,
        goal: {
          borderWidth: '1px',
          height: 0,
          borderColor: '#000'
        },
        goals: [25, 25, 25, 25],
        styles: [
          { backgroundColor: '#ff4b4a' },
          { backgroundColor: '#007f39' },
          { backgroundColor: '#ffc300' },
          { backgroundColor: '#1bb3e8' },
        ],
      },
    ],
  };





  categoryWise: any = {};


  totalEnquiryPieChart2: ZingchartAngular.graphset = {
    type: 'ring',
    backgroundColor: '#fff',

    plot: {
      tooltip: {

        backgroundColor: '#000',
        borderWidth: '0px',
        fontSize: '10px',
        sticky: true,
        thousandsSeparator: ',',
      },
      valueBox:
      {
        type: 'all',
        text: '%npv%',
        placement: 'in',
        fontSize: '8px'
      },
      animation: {
        effect: 2,
        sequence: 3,
        speed: 1000
      },
      backgroundColor: '#FBFCFE',
      borderWidth: '0px',
      slice: 40,
    },
    plotarea: {
      margin: '0px',
      backgroundColor: 'transparent',
      borderRadius: '10px',
      borderWidth: '0px',
    },

    series: [
      {
        text: 'Review Pending',
        values: [20],
        backgroundColor: '#ffc300',
        lineColor: '#ffc300',
        lineWidth: '1px',
        marker: {
          backgroundColor: '#ffc300',
        },
      },
      {
        text: 'Qualified',
        values: [60],
        backgroundColor: '#00a54d',
        lineColor: '#009fb5',
        lineWidth: '1px',
        marker: {
          backgroundColor: '#009fb5',
        },
      },
      {
        text: 'Disqualified',
        values: [20],
        backgroundColor: '#ff4b4a',
        lineColor: '#ff4b4a',
        lineWidth: '1px',
        marker: {
          backgroundColor: '#ff4b4a',
        },
      }

    ],
    noData: {
      text: 'No Data Available',
      alpha: 0.6,
      backgroundColor: '#ffffff',
      bold: true,
      fontSize: '10px',
      textAlpha: 0.9,
    },
  };







  // ENQUIRY START

  totalEnquiry: any = {};
  getTotalEnquiry() {


    this.service.post_rqst({ 'data': { 'date_from': this.filter.date_from, 'date_to': this.filter.date_to, 'search': this.search.enquirycounts } }, 'Dashboard/totalEnquiry').subscribe((result) => {

      if (result['statusCode'] == 200) {
        this.totalEnquiry = result['result'];

        this.totalEnquiryPieChart = {
          type: 'ring',
          backgroundColor: '#fff',

          plot: {
            tooltip: {
              backgroundColor: '#000',
              borderWidth: '0px',
              fontSize: '10px',
              sticky: true,
              thousandsSeparator: ',',
            },
            valueBox:
            {
              type: 'all',
              text: '%npv%',
              placement: 'in',
              fontSize: '8px'
            },
            animation: {
              effect: 2,
              sequence: 3,
              speed: 1000
            },
            backgroundColor: '#FBFCFE',
            borderWidth: '0px',
            slice: 40,
          },
          plotarea: {
            margin: '0px',
            backgroundColor: 'transparent',
            borderRadius: '10px',
            borderWidth: '0px',
          },

          series: [
            {
              text: 'Review Pending',
              values: [this.totalEnquiry.Pending],
              backgroundColor: '#ffc300',
              lineColor: '#ffc300',
              lineWidth: '1px',
              marker: {
                backgroundColor: '#ffc300',
              },
            },
            {
              text: 'Assigned',
              values: [this.totalEnquiry.Assigned],
              backgroundColor: '#03a9f4',
              lineColor: '#009fb5',
              lineWidth: '1px',
              marker: {
                backgroundColor: '#009fb5',
              },
            },
            {
              text: 'Inprocess',
              values: [this.totalEnquiry.Inprocess],
              backgroundColor: '#ff9800',
              lineColor: '#009fb5',
              lineWidth: '1px',
              marker: {
                backgroundColor: '#009fb5',
              },
            },
            {
              text: 'Win',
              values: [this.totalEnquiry.Win],
              backgroundColor: '#00a54d',
              lineColor: '#009fb5',
              lineWidth: '1px',
              marker: {
                backgroundColor: '#009fb5',
              },
            },
            {
              text: 'Disqualified',
              values: [this.totalEnquiry.Disqualified],
              backgroundColor: '#ff4b4a',
              lineColor: '#ff4b4a',
              lineWidth: '1px',
              marker: {
                backgroundColor: '#ff4b4a',
              },
            }

          ],
          noData: {
            text: 'No Data Available',
            alpha: 0.6,
            backgroundColor: '#ffffff',
            bold: true,
            fontSize: '10px',
            textAlpha: 0.9,
          },
        };


      }
      else {
        this.toast.errorToastr(result['statusMsg']);
      }
    }, err => {
      this.toast.errorToastr('Something went wrong');
    })
  }


  enquiryScoreData: any = {};
  getEnquiryScore() {


    this.service.post_rqst({ 'data': { 'date_from': this.filter.date_from, 'date_to': this.filter.date_to } }, 'Dashboard/enquiryScore').subscribe((result) => {

      if (result['statusCode'] == 200) {
        this.enquiryScoreData = result['result'];
        this.enquiryScore = {
          type: 'gauge',
          globals: {
            fontSize: '18px',
          },
          plot: {
            tooltip: {
              borderRadius: '5px',
              fontSize: '10px'
            },
            valueBox: {
              text: '%v%',
              // text: '%v',
              fontSize: '18px',
              placement: 'center',
              rules: [
                {
                  text: '%v',
                  rule: '%v <= 30',
                },
              ],
            },
            size: '100%',
            animation: {
              effect: 11,
              speed: 3000,
            }
          },
          plotarea: {
            backgroundColor: 'transparent',
            marginTop: '40px',
          },
          scaleR: {
            aperture: 240,
            center: {
              visible: false,
            },
            item: {
              offsetR: 0,

            },
            labels: ['0', '', '', '', '100'],
            maxValue: 100,
            minValue: 0,
            ring: {
              rules: [
                {
                  backgroundColor: '#ea4335',
                  rule: '%v <= 25',
                },
                {
                  backgroundColor: '#ffc300',
                  rule: '%v >= 25 && %v <= 50',
                },
                {
                  backgroundColor: '#2e7d32',
                  rule: '%v > 50 && %v <= 100',
                },
              ],
              size: '20px',
            },
            step: 25,
            tick: {
              visible: false,
            },
          },
          refresh: {
            type: 'feed',
            url: 'feed()',
            interval: 1500,
            resetTimeout: 1000,
            transport: 'js',
          },
          series: [
            {
              values: [this.enquiryScoreData.Qualified],
              animation: {
                delay: 1200,
                effect: 2,
                method: 3,
                speed: 3000,
              },
              backgroundColor: 'black',
              indicator: [0.1, 4, 5, 5, 0.3],
            },
          ],

        };


      }
      else {
        this.toast.errorToastr(result['statusMsg']);
      }
    }, err => {
      this.toast.errorToastr('Something went wrong');
    })
  }

  qualifiedEnquiry: any = {};
  getQualifiedEnquiry() {


    this.service.post_rqst({ 'data': { 'date_from': this.filter.date_from, 'date_to': this.filter.date_to } }, 'Dashboard/qualifiedEnquiry').subscribe((result) => {

      if (result['statusCode'] == 200) {
        this.qualifiedEnquiry = result['result'];
        this.qualifiedEnquiryPieChart = {
          type: 'ring',
          backgroundColor: '#fff',

          plot: {
            tooltip: {
              backgroundColor: 'black',
              borderWidth: '0px',
              fontSize: '10px',

              sticky: true,

            },
            valueBox:
            {
              type: 'all',
              text: '%npv%',
              placement: 'in',
              fontSize: '8px'
            },

            animation: {
              effect: 2,
              sequence: 3,
              speed: 1000
            },
            backgroundColor: '#FBFCFE',
            borderWidth: '0px',
            slice: 40,
          },
          plotarea: {
            margin: '0px',
            backgroundColor: 'transparent',
            borderRadius: '10px',
            borderWidth: '0px',
          },

          series: [
            {
              text: 'Win',
              values: [this.qualifiedEnquiry.Win],
              backgroundColor: '#46a345',
              lineColor: '#46a345',
              lineWidth: '1px',
              marker: {
                backgroundColor: '#46a345',
              },
            },
            {
              text: 'Lost',
              values: [this.qualifiedEnquiry.Lost],
              backgroundColor: '#ff4b4a',
              lineColor: '#ff4b4a',
              lineWidth: '1px',
              marker: {
                backgroundColor: '#ff4b4a',
              },
            },
            {
              text: 'In Process',
              values: [this.qualifiedEnquiry.Inprocess],
              backgroundColor: '#ffc300',
              lineColor: '#ffc300',
              lineWidth: '1px',
              marker: {
                backgroundColor: '#ffc300',
              },
            },
          ],
          noData: {
            text: 'No Data Available',
            alpha: 0.6,
            backgroundColor: '#ffffff',
            bold: true,
            fontSize: '10px',
            textAlpha: 0.9,
          },
        };



      }
      else {
        this.toast.errorToastr(result['statusMsg']);
      }
    }, err => {
      this.toast.errorToastr('Something went wrong');
    })
  }


  disqualifiedEnquiry: any = {};
  getDisqualifiedEnquiry() {


    this.service.post_rqst({ 'data': { 'date_from': this.filter.date_from, 'date_to': this.filter.date_to } }, 'Dashboard/disqualifiedEnquiry').subscribe((result) => {

      if (result['statusCode'] == 200) {
        this.disqualifiedEnquiry = result['result'];
        this.disqualifiedMeter = {
          type: 'ring',
          backgroundColor: '#fff',
          plot: {
            tooltip: {

              backgroundColor: 'none',
              borderWidth: '0px',
              fontSize: '0px',
              visible: false,
              sticky: true,
            },
            valueBox:
            {
              type: 'min',
              text: '%v%',
              // text: `${parseInt(data[0]/(data[0]+data[1])*100)}%`,
              fontColor: '#718096',
              fontSize: '20px',
              placement: 'center',
              visible: true,
              offsetY: '25px',
            },
            animation: {
              effect: 2,
              sequence: 3,
              speed: 1000
            },
            backgroundColor: '#FBFCFE',
            borderWidth: '0px',

            slice: 50,
          },

          plotarea: {
            margin: '0px',
            backgroundColor: 'transparent',
            borderRadius: '10px',
            borderWidth: '0px',
          },
          scaleR: {
            refAngle: 130,
            aperture: 280,
          },
          series: [
            {
              text: 'total',
              values: [this.disqualifiedEnquiry.Disqualified],
              // values: [20],
              backgroundColor: '#ff4b4a',
              lineColor: '#ff4b4a',
              lineWidth: '1px',
              marker: {
                backgroundColor: '#ff4b4a',
              },
            },

          ],
          noData: {
            text: 'No Data Available',
            alpha: 0.6,
            backgroundColor: '#ffffff',
            bold: true,
            fontSize: '10px',
            textAlpha: 0.9,
          },
        };



      }
      else {
        this.toast.errorToastr(result['statusMsg']);
      }
    }, err => {
      this.toast.errorToastr('Something went wrong');
    })
  }


  stateWiseEnquiry: any = {};
  getStateWiseEnquiry() {

    this.service.post_rqst({ 'data': { 'date_from': this.filter.date_from, 'date_to': this.filter.date_to, 'search': this.search.stateWiseenq } }, 'Dashboard/stateWiseEnquiry').subscribe((result) => {

      if (result['statusCode'] == 200) {
        this.stateWiseEnquiry = result['result'];

      }
      else {
        this.toast.errorToastr(result['statusMsg']);
      }
    }, err => {
      this.toast.errorToastr('Something went wrong');
    })
  }

  rsmWiseEnquiry: any = [];
  getRsmWiseEnquiry() {

    this.service.post_rqst({ 'data': { 'date_from': this.filter.date_from, 'date_to': this.filter.date_to, 'search': this.search.rsmWiseenq } }, 'Dashboard/rsmWiseEnquiryData').subscribe((result) => {

      if (result['statusCode'] == 200) {
        this.rsmWiseEnquiry = result['result'];

      }
      else {
        this.toast.errorToastr(result['statusMsg']);
      }
    }, err => {
      this.toast.errorToastr('Something went wrong');
    })
  }


  topDealersEnquiry: any = [];
  getTop5dealerEnquiry() {
    this.service.post_rqst({ 'data': { 'date_from': this.filter.date_from, 'date_to': this.filter.date_to } }, 'Dashboard/fetchTopUserEnquiryWise').subscribe((result) => {

      if (result['statusCode'] == 200) {
        this.topDealersEnquiry = result['result'];

      }
      else {
        this.toast.errorToastr(result['statusMsg']);
      }
    }, err => {
      this.toast.errorToastr('Something went wrong');
    })
  }

  sourceWiseEnquiry: any = [];
  getSourceWiseEnquiry() {

    this.service.post_rqst({ 'data': { 'date_from': this.filter.date_from, 'date_to': this.filter.date_to, 'search': this.search.enquirySources } }, 'Dashboard/sourceWiseEnquiry').subscribe((result) => {

      if (result['statusCode'] == 200) {
        this.sourceWiseEnquiry = result['result'];
        const colors =
          [
            "#FFA07A",
            "#008080",
            "#FFFF00",
            "#FFE4B5",
            "#6495ED",
            "#2E8B57",

            "#7FFFD4",
            "#228B22",
            "#FF7F50",
            "#F08080",
            "#800080",
            "#B0E0E6",
            "#FFEFD5",
            "#9932CC",
            "#FF6347",
            "#87CEEB",
            "#FFA500",
            "#00FF7F",
            "#4B0082",
            "#F0E68C",
            "#FF69B4",
            "#FF1493",
            "#3CB371",
            "#7B68EE",
            "#ADFF2F",
            "#EE82EE",
            "#00BFFF",
            "#DAA520",
            "#40E0D0",
            "#DB7093",
            "#FF8C00",
            "#48D1CC",
            "#C71585",
            "#191970",
            "#FFD700",
            "#20B2AA",
            "#7CFC00",
            "#FFB6C1",
            "#FF4500",
            "#4169E1",
            "#00FA9A",
            "#D2691E",
            "#DDA0DD",
            "#1E90FF",
            "#FFF8DC",
            "#FFDAB9",
            "#006400",
            "#90EE90",
          ];

        for (let index = 0; index < this.sourceWiseEnquiry.length; index++) {
          this.sourceWiseEnquiry[index]['color'] = colors[index];
        }


        this.sourceEnquiryPieChart = {
          type: 'ring',
          backgroundColor: '#fff',

          plot: {
            tooltip: {
              backgroundColor: '#000',
              borderWidth: '0px',
              fontSize: '10px',
              sticky: true,
              thousandsSeparator: ',',
            },
            valueBox:
            {
              type: 'all',
              text: '%v%',
              placement: 'in',
              fontSize: '8px'
            },
            animation: {
              effect: 2,
              sequence: 3,
              speed: 1000
            },
            backgroundColor: '#FBFCFE',
            borderWidth: '0px',

            slice: 40,
          },
          plotarea: {
            margin: '0px',
            backgroundColor: 'transparent',
            borderRadius: '10px',
            borderWidth: '0px',
          },

          series: this.sourceWiseEnquiry.map((row, index) => ({
            text: row.source,
            values: [row.value],
            backgroundColor: colors[index % colors.length],
            lineColor: '#00889f',
            lineWidth: '1px',
            marker: {
              backgroundColor: '#00889f',
            },
          })),

          noData: {
            text: 'No Data Available',
            alpha: 0.6,
            backgroundColor: '#ffffff',
            bold: true,
            fontSize: '10px',
            textAlpha: 0.9,
          },
        };


      }
      else {
        this.toast.errorToastr(result['statusMsg']);
      }
    }, err => {
      this.toast.errorToastr('Something went wrong');
    })
  }
  getSourceWiseConversion() {

    this.service.post_rqst({ 'data': { 'date_from': this.filter.date_from, 'date_to': this.filter.date_to, 'search': this.search.Sourcewiseconv } }, 'Dashboard/sourceWiseConversion').subscribe((result) => {

      if (result['statusCode'] == 200) {
        this.sourceWiseConversion = result['result'];

        let lableText = []
        let lableValue = []


        for (let index = 0; index < this.sourceWiseConversion.length; index++) {
          lableText.push(this.sourceWiseConversion[index]['source'])
          lableValue.push(this.sourceWiseConversion[index]['value'])
        }

        const colors =
          [
            "#FFA07A",
            "#008080",
            "#FFFF00",
            "#FFE4B5",
            "#6495ED",
            "#2E8B57",

            "#7FFFD4",
            "#228B22",
            "#FF7F50",
            "#F08080",
            "#800080",
            "#B0E0E6",
            "#FFEFD5",
            "#9932CC",
            "#FF6347",
            "#87CEEB",
            "#FFA500",
            "#00FF7F",
            "#4B0082",
            "#F0E68C",
            "#FF69B4",
            "#FF1493",
            "#3CB371",
            "#7B68EE",
            "#ADFF2F",
            "#EE82EE",
            "#00BFFF",
            "#DAA520",
            "#40E0D0",
            "#DB7093",
            "#FF8C00",
            "#48D1CC",
            "#C71585",
            "#191970",
            "#FFD700",
            "#20B2AA",
            "#7CFC00",
            "#FFB6C1",
            "#FF4500",
            "#4169E1",
            "#00FA9A",
            "#D2691E",
            "#DDA0DD",
            "#1E90FF",
            "#FFF8DC",
            "#FFDAB9",
            "#006400",
            "#90EE90",
          ];

        this.sourceleadConfig = {
          type: 'bar',
          plot: {
            barWidth: '25px',
            tooltip: {
              borderRadius: '3px',
              borderWidth: '1px',
              fontSize: '14px',
              shadow: true,
            },
            animation: {
              effect: 4,
              method: 0,
              speed: 1600,
            },
            valueBox:
            {
              type: 'all',
              placement: "top-in",
              text: '%v%',
              // text: '%v',
              angle: 0,
              fontSize: '10px',
              fontWeight: '100',
              "font-color": "white",

            },
          },
          scaleX: {
            labels: lableText

          },



          series: [
            {
              values: lableValue,
              styles: [
                { backgroundColor: '#95ce50' },
                { backgroundColor: '#ffb300' },
                { backgroundColor: '#ff6f00' },
                { backgroundColor: '#00897b' },
                { backgroundColor: '#43a047' },
                { backgroundColor: '#2e7d32' },
                { backgroundColor: '#989c25' },
                { backgroundColor: '#f70474' },
                { backgroundColor: '#0077b5' },
                { backgroundColor: '#d778b3' },
                { backgroundColor: '#1bd741' },
                { backgroundColor: '#ea4335' },
                { backgroundColor: '#1c124f' },
                { backgroundColor: '#fc6904' },
              ],
            },

          ],
          noData: {
            text: 'No Data Available',
            alpha: 0.6,
            backgroundColor: '#ffffff',
            bold: true,
            fontSize: '10px',
            textAlpha: 0.9,
          },
        };
      }
      else {
        this.toast.errorToastr(result['statusMsg']);
      }
    }, err => {
      this.toast.errorToastr('Something went wrong');
    })
  }

  salesusers: any = [];
  getTopSalesUsers() {
    this.service.post_rqst({ 'data': { 'date_from': this.filter.date_from, 'date_to': this.filter.date_to } }, 'Dashboard/topSalesUser').subscribe((result) => {
      if (result['statusCode'] == 200) {
        this.salesusers = result['result'];
      }
      else {
        this.toast.errorToastr(result['statusMsg']);
      }
    }, err => {
      this.toast.errorToastr('Something went wrong');
    })
  }

  leastSalesUsers: any = [];
  getLeastSalesUser() {

    this.service.post_rqst({ 'data': { 'date_from': this.filter.date_from, 'date_to': this.filter.date_to } }, 'Dashboard/leastSalesUser').subscribe((result) => {

      if (result['statusCode'] == 200) {
        this.leastSalesUsers = result['result'];
      }
      else {
        this.toast.errorToastr(result['statusMsg']);
      }
    }, err => {
      this.toast.errorToastr('Something went wrong');
    })
  }

  dataAccuracy: any = {};
  getDataAccuracyRate() {

    this.service.post_rqst({ 'data': { 'date_from': this.filter.date_from, 'date_to': this.filter.date_to } }, 'Dashboard/dataAccuracyRate').subscribe((result) => {


      if (result['statusCode'] == 200) {
        this.dataAccuracy = result['result'];
        let totalPercent = this.dataAccuracy.accurate;

        this.accuracyLead = {
          type: 'gauge',
          globals: {
            fontSize: '20px',
          },
          plot: {
            tooltip: {
              borderRadius: '5px',
              fontSize: '10px'
            },
            valueBox: {
              text: '%v%',
              fontSize: '20px',
              placement: 'center',
              rules: [
                {
                  text: '%v',
                  rule: '%v <= 30',
                },
              ],
            },
            size: '100%',
            animation: {
              effect: 11,
              speed: 3000,
            }
          },
          plotarea: {
            backgroundColor: 'transparent',
            marginTop: '40px',
          },
          scaleR: {
            aperture: 240,
            center: {
              visible: false,
            },
            item: {
              offsetR: 0,

            },
            labels: ['0', '', '', '', '100'],
            maxValue: 100,
            minValue: 0,
            ring: {
              rules: [
                {
                  backgroundColor: '#ea4335',
                  rule: '%v <= 25',
                },
                {
                  backgroundColor: '#ffc300',
                  rule: '%v >= 25 && %v <= 50',
                },
                {
                  backgroundColor: '#2e7d32',
                  rule: '%v > 50 && %v <= 100',
                },
              ],
              size: '25px',
            },
            step: 25,
            tick: {
              visible: false,
            },
          },
          refresh: {
            type: 'feed',
            url: 'feed()',
            interval: 1500,
            resetTimeout: 1000,
            transport: 'js',
          },
          series: [
            {
              values: [totalPercent],
              animation: {
                delay: 1200,
                effect: 2,
                method: 3,
                speed: 3000,
              },
              backgroundColor: 'black',
              indicator: [0.1, 4, 5, 5, 0.3],
            },
          ],

        };
      }
      else {
        this.toast.errorToastr(result['statusMsg']);
      }
    }, err => {
      this.toast.errorToastr('Something went wrong');
    })
  }



  getcategoryWiseConversion() {


    this.service.post_rqst({ 'data': { 'date_from': this.filter.date_from, 'date_to': this.filter.date_to, 'search': this.search.categoryWiseenq } }, 'Dashboard/categoryWiseEnquiry').subscribe((result) => {


      if (result['statusCode'] == 200) {
        this.categoryWise = result['result'];
        let lableValue = [];
        let lableText = [];
        for (let index = 0; index < this.categoryWise.length; index++) {
          lableValue.push(this.categoryWise[index]['value']);
          lableText.push(this.categoryWise[index]['type']);
        }

        this.categoryleadConfig = {
          type: 'bar',
          title: {
            text: '',
          },
          plot: {
            tooltip: {
              borderRadius: '3px',
              borderWidth: '1px',
              fontSize: '14px',
              shadow: true,
            },
            animation: {
              effect: 4,
              method: 0,
              speed: 1600,
            },
            valueBox:
            {
              type: 'all',
              placement: "top-in",
              // text: '%v%',
              text: '%v',
              angle: 0,
              fontSize: '10px',
              fontWeight: '100',
              "font-color": "white"
            },
          },
          scaleX: {
            labels: lableText,
          },
          series: [
            {
              values: lableValue,
              dataDragging: true,
              goal: {
                borderWidth: '1px',
                height: 0,
                borderColor: '#000'
              },
              goals: [25, 30, 30],
              styles: [
                { backgroundColor: '#989c25' },
                { backgroundColor: '#1d9379' },
                { backgroundColor: '#5df1cc' },
                { backgroundColor: '#7fceb7' },
                { backgroundColor: '#872a93' },
                { backgroundColor: '#a81ac6' },
                { backgroundColor: '#f70474' },
                { backgroundColor: '#0077b5' },
              ],
            },
          ],
          noData: {
            text: 'No Data Available',
            alpha: 0.6,
            backgroundColor: '#ffffff',
            bold: true,
            fontSize: '10px',
            textAlpha: 0.9,
          },
        };


      }
      else {
        this.toast.errorToastr(result['statusMsg']);
      }
    }, err => {
      this.toast.errorToastr('Something went wrong');
    })
  }


  openBottomSheet(): void {
    this.bottomSheet.open(BottomSheetComponent, {
      data: {
        'filterPage': 'Dashboard',
      }
    });
    this.bottomSheet._openedBottomSheetRef.afterDismissed().subscribe((data) => {
      if (data != '' && data != undefined) {
        this.filter.date_from = data.date_from;
        this.filter.date_to = data.date_to;
        if (this.tabValue == 'Sales') {
          this.sfa();
        }
        if (this.tabValue == 'Enquiry') {
          this.enquiry()
        }
        if (this.tabValue == 'Influencer Reward') {
          this.loyalty();
        }
        if (this.tabValue == 'Account') {
          this.dms();
        }
      }
    })
  }


  clearAll() {
    this.filter.date_from = '';
    this.filter.date_to = '';
    if (this.tabValue == 'Sales') {
      this.sfa();
    }
    if (this.tabValue == 'Enquiry') {
      this.enquiry()
    }
    if (this.tabValue == 'Influencer Reward') {
      this.loyalty();
    }
    if (this.tabValue == 'Account') {
      this.dms();
    }
  }





  // ENQUIRY END

}
