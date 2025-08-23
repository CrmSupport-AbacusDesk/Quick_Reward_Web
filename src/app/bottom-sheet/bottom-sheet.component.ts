import { Inject } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { MatBottomSheetRef, MAT_BOTTOM_SHEET_DATA } from '@angular/material';
import { ToastrManager } from 'ng6-toastr-notifications';
import { DatabaseService } from 'src/_services/DatabaseService';
import * as moment from 'moment';
import { CryptoService } from 'src/_services/CryptoService';




@Component({
  selector: 'app-bottom-sheet',
  templateUrl: './bottom-sheet.component.html'
})
export class BottomSheetComponent implements OnInit {
  search: any = {};
  maxDateForTo: string | null = null;
  today_date: any = new Date();
  lastPageData: any = {}
  monthlyWorkReport: any = [];
    newToday_date: string;
  encryptedData: any;
  decryptedData: any;
  currentYear: any = this.today_date.getFullYear()
  minDate: any;
  maxDate:any;
  targetTypeList: any = [
    "Primary Target(Emp wise)",
    "Primary Target(Party wise)",
    "Secondary Target",
    "Visit Target"
  ]
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

  filterList: any = [
    "State",
    "District",
    "Employee",
    "Party"
  ]

  yearList: any = []

  typeList: any = [
    "Primary",
    "Secondary"
  ]

  enquiryTypeList: any = [
    "State",
    "District",
    "Employee",
    "Source",
    "Type"
  ]

  ScanRatioReportTypeList: any = [
    "State",
    "District",

  ]

  states: any = []
  district_list: any = []

  constructor(@Inject(MAT_BOTTOM_SHEET_DATA) public data: any, public cryptoService: CryptoService, public service: DatabaseService, private bottomSheetRef: MatBottomSheetRef<BottomSheetComponent>, public toast: ToastrManager) {
      this.newToday_date = moment(this.today_date).format('YYYY-MM-DD')
    console.log('today date',this.newToday_date)

    this.lastPageData = data;
    this.yearList.push(this.currentYear - 1)
    this.yearList.push(this.currentYear)

    if (this.lastPageData.filterPage != 'dateRangeFeildsOnly') {
      this.getSalesUser('');
    }
    if (this.lastPageData.filterPage == 'enquiryReport' || this.lastPageData.filterPage == 'productSalesReport' || this.lastPageData.filterPage == 'ScanRatioReport') {
      this.getStateList()
    }
    if (this.lastPageData.filterPage == 'today_checkin_list') {
      this.getSalesUser('');
    }
    this.minDate = moment().subtract(90, 'days').format('YYYY-MM-DD');
    console.log('mindate',this.minDate )
  }

  ngOnInit() {
  }

  // public date(date) {
  //   if (this.search.date_from) {
  //     this.search.date_from = moment(this.search.date_from).format('YYYY-MM-DD');
  //   }
  //   if (this.lastPageData.filterPage != 'dateFrom') {
  //     if (this.search.date_to) {
  //       this.search.date_to = moment(this.search.date_to).format('YYYY-MM-DD');
  //     }
  //   }
  // }
public date(event: any) {
  if (event && event.value) {
    // Format Date From
    if (this.search.date_from) {
      this.search.date_from = moment(this.search.date_from).format('YYYY-MM-DD');
      // Set max date for Date To as 90 days after Date From
      const maxDate = moment(this.search.date_from).add(90, 'days').format('YYYY-MM-DD');
      this.maxDateForTo = maxDate;

      // Check if date_to is out of range and reset if needed
      if (this.search.date_to && moment(this.search.date_to).isAfter(maxDate)) {
        this.search.date_to = null;
      }
    }

    // Format Date To only if filterPage != 'dateFrom'
    if (this.lastPageData.filterPage !== 'dateFrom' && this.search.date_to) {
      this.search.date_to = moment(this.search.date_to).format('YYYY-MM-DD');
    }
  }
}


  salesUser: any = [];
  getSalesUser(searchValue) {
    let header;
    if (this.lastPageData.filterPage == 'Expense') {
      header = 'Expense/salesUserListExpense';
    } else {
      header = 'Expense/salesUserList';
    }

    this.encryptedData = this.service.payLoad ? { 'search': searchValue } : this.cryptoService.encryptData({ 'search': searchValue });
    this.service.post_rqst(this.encryptedData, header).subscribe((result => {
      this.decryptedData = this.service.payLoad ? result : this.cryptoService.decryptData(JSON.stringify(result));
      if (this.decryptedData['statusCode'] == 200) {
        this.salesUser = this.decryptedData['all_sales_user'];
        if (this.lastPageData.filterPage == 'product_wise_secondary_report') {
          this.salesUser.unshift({ 'id': 'All', 'name': 'All', 'role_name': '' })
        }

        this.search = this.lastPageData;

      } else {
        this.toast.errorToastr(this.decryptedData['statusMsg']);
      }
    }));
  }

  searchHandler(value) {
    if (this.search.sortBy == 'Party') {
      this.getPartyList(value)
    } else if (this.search.sortBy == 'Employee') {
      this.getSalesUser(value)
    }
  }

  getPartyList(searchValue: any = '') {
    let header = 'Reports/customerTypeData';
    let payload = this.search


    this.encryptedData = this.service.payLoad ? { 'search': searchValue, "filter": payload } : this.cryptoService.encryptData({ 'search': searchValue, "filter": payload });
    this.service.post_rqst(this.encryptedData, header).subscribe((result => {
      this.decryptedData = this.service.payLoad ? result : this.cryptoService.decryptData(JSON.stringify(result));
      if (this.decryptedData['statusCode'] == 200) {
        this.salesUser = this.decryptedData['result'];

      } else {
        this.toast.errorToastr(this.decryptedData['statusMsg']);
      }
    }));
  }




  getSalesuserName() {
    setTimeout(() => {

      const findIndex = this.salesUser.findIndex((row) => row.id == this.search.user_id)
      this.search.user_name = this.salesUser[findIndex].name

    }, 100);
  }

  getValue() {
    this.bottomSheetRef.dismiss(this.search);
  }


  getStateList() {
    this.service.post_rqst(0, "Master/getAllState").subscribe((result => {
      this.decryptedData = this.service.payLoad ? result : this.cryptoService.decryptData(JSON.stringify(result));
      if (this.decryptedData['statusCode'] == 200) {
        this.states = this.decryptedData['all_state'];
      }
      else {
        this.toast.errorToastr(this.decryptedData['statusMsg'])
      }
    }));
  }

  getDistrict(val) {
    let st_name;
    if (val == 1) {
      st_name = this.data.state;
    }
    if (!st_name.length) {
      return this.toast.errorToastr('Please Select State');
    }
    this.encryptedData = this.service.payLoad ? { 'state_name': st_name } : this.cryptoService.encryptData({ 'state_name': st_name });

    this.service.post_rqst(this.encryptedData, "Master/getAllDistrict").subscribe((result => {
      this.decryptedData = this.service.payLoad ? result : this.cryptoService.decryptData(JSON.stringify(result));
      if (this.decryptedData['statusCode'] == 200) {
        this.district_list = this.decryptedData['all_district'];
      }
      else {
        this.toast.errorToastr(this.decryptedData['statusMsg'])
      }
    }));

  }

  selectAllEmployees(action) {
    if (action == 'allemployees') {
      if (this.search.allemployees == true) {
        const employeeData = [];
        for (let i = 0; i < this.salesUser.length; i++) {
          employeeData.push(this.salesUser[i].id)
        }
        this.search.user_id = employeeData;
      } else {
        this.search.user_id = [];
      }
    }
  }

}
