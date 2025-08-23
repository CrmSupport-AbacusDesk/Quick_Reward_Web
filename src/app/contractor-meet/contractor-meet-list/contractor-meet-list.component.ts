import { PageEvent } from '@angular/material/paginator';
import { Component, OnInit, Input } from '@angular/core';
import { MatDialog } from '@angular/material';
import { ActivatedRoute, Router } from '@angular/router';
import { DatabaseService } from 'src/_services/DatabaseService';
import { ContractorMeetStatusModalComponent } from '../contractor-meet-status-modal/contractor-meet-status-modal.component';
import { DialogComponent } from 'src/app/dialog.component';
import * as moment from 'moment';
import { sessionStorage } from 'src/app/localstorage.service';
import { Location } from '@angular/common'
import { ToastrManager } from 'ng6-toastr-notifications';
import { CryptoService } from 'src/_services/CryptoService';


@Component({
  selector: 'app-contractor-meet-list',
  templateUrl: './contractor-meet-list.component.html'
})
export class ContractorMeetListComponent implements OnInit {
  tabActiveType: any = {};
  pageSize = 10;
  pageSizeOptions: number[] = [5, 10, 25, 100];
  length = 0;
  start = 0;
  end = 10;
  inc = 0;
  pageEvent: PageEvent;
  companyType: any;
  login_data: any = {};
  today_date: Date;
  searchData: any;
  backButton: boolean = false;
  data: any = [];
  allCount: any = {};
  contractorMeetListDetail: any = [];
  sendData: any = [];
  active_tab: any = 'Pending'
  assign_login_data: any = [];
  assign_login_data2: any = [];
  view_edit: boolean = true;
  view_add: boolean = true;
  view_delete: boolean = true;
  activePage_count: any;
  loader: boolean = false;
  datanotfound: boolean = false;
  // pagination
  total_page: any;
  pageCount: any;
  page_limit: any = 50;
  pagenumber: any = 1;
  sr_no: number;
  budget: any;

  @Input() dataToReceive: any;
  padding0: any;
  hide: any;
  downurl: any;


  constructor(public toast: ToastrManager, public cryptoService:CryptoService, public route: ActivatedRoute, public dialog: MatDialog, public location: Location, public dialog1: DialogComponent, public session: sessionStorage, public service: DatabaseService, public rout: Router) {
    this.downurl = service.downloadUrl;
    this.page_limit = this.service.pageLimit
    this.assign_login_data = this.session.getSession();
    this.assign_login_data = this.assign_login_data.value;
    this.assign_login_data2 = this.assign_login_data.data;
    this.assign_login_data = this.assign_login_data.assignModule;
    const index = this.assign_login_data.findIndex(row => row.module_name == 'Event');
    this.login_data = this.session.getSession();
    this.today_date = new Date();
    this.login_data = this.login_data.value;
    this.login_data = this.login_data.data;



  }
  ngOnInit() {
    this.data = this.service.getData()
    if (this.data.status) {
      this.active_tab = this.data.status
    }
    if (this.dataToReceive != undefined) {
      this.padding0 = this.dataToReceive.padding0;
      this.hide = this.dataToReceive.hide;
      this.sendData.created_by_id = this.dataToReceive.user_id;

      this.getContractorMeetList();
    }
    else {
      this.searchData = (this.route['params']['_value']);
      if (this.searchData.selectedUser && this.searchData.selectedDate) {
        this.backButton = true;
        this.data.date_from = this.searchData.selectedDate;
        this.data.created_by = this.searchData.selectedUser;
        this.getContractorMeetList();
      }
      else {
        this.getContractorMeetList();
      }
    }
  
  }

  selectType(type) {
    this.companyType = type;
    this.getContractorMeetList();
  }

  setPageSizeOptions(setPageSizeOptionsInput: string) {
    if (setPageSizeOptionsInput) {
      this.pageSizeOptions = setPageSizeOptionsInput.split(',').map(str => +str);


    }
  }

  pervious() {
    this.start = this.start - this.page_limit;
    this.getContractorMeetList();
  }

  nextPage() {

    this.start = this.start + this.page_limit;
    this.getContractorMeetList();
  }

  open() {
    this.rout.navigate(['/contractor-meet-detail']);
  }

  public DateOfMeeting(event): void {

    this.data.dom_from = moment(event.value).format('YYYY-MM-DD');
    this.getContractorMeetList();
  }


  public onDate(event): void {
    this.data.date_from = moment(event.value).format('YYYY-MM-DD');
    this.getContractorMeetList();
  }


  getContractorMeetList(action: any = '') {
    this.data.status -= this.active_tab
    if (action == "refresh") {
      this.data = {};
      this.contractorMeetListDetail = [];
    }

    if (this.pagenumber > this.total_page) {
      this.pagenumber = this.total_page;
      this.start = this.pageCount - this.page_limit;
    }

    let created_by_id
    if (this.dataToReceive != undefined) {
      created_by_id = this.dataToReceive.user_id;
    }
    this.sendData = {
      created_by_id: created_by_id,
      user_id: this.login_data.id,
      created_by_user: this.data.created_by,
      firm_mobile: this.data.firm_mobile,
      created_by_user_email: this.data.email,
      firm_name: this.data.firm_name,
      event_type: this.data.event_type,
      date_from: this.data.date_from,
      dom_from: this.data.dom_from,
      type: this.companyType,
      status: this.active_tab,
    };
    this.loader = true;

    if(!this.data.status){
      this.data.status = this.active_tab;
    }


    this.service.post_rqst({'start': this.start, 'filter': this.data}, "Event/eventList").subscribe((result) => {
      if (result['statusCode'] == 200) {
        this.contractorMeetListDetail = result['result']['result'];
        this.contractorMeetListDetail.forEach(item => item['encrypt_id'] = this.cryptoService.encryptId(item['id']));
        this.allCount = result['result']['all_cont'];
        this.length = result['result'].length;
        this.activePage_count = this.allCount[this.active_tab];
        if (this.contractorMeetListDetail.length == 0) {
          this.datanotfound = true
        } else {
          this.datanotfound = false
        }

        if (this.pagenumber > this.total_page) {
          this.pagenumber = this.total_page;
          this.start = this.activePage_count - this.page_limit;
        }
        else {
          this.pagenumber = Math.ceil(this.start / this.page_limit) + 1;
        }
        this.total_page = Math.ceil(this.activePage_count / this.page_limit);
        this.sr_no = this.pagenumber - 1;
        this.sr_no = this.sr_no * this.page_limit;
        this.loader = false;
      } else {
        this.loader = false;
        this.toast.errorToastr(result['statusMsg']);
      }

    }, err => {
      this.loader = false;

      this.toast.errorToastr('Something went wrong');
    })

    // this.loader = true;
    // this.service.post_rqst({ 'filter': this.sendData, start: this.start, pagelimit: this.page_limit }, "Event/showPerPlumberBudget").subscribe((result) => {
    //   if (result['statusCode'] == 200) {
    //     this.budget = result['budget']
    //   } else {
    //     this.loader = false;
    //     this.toast.errorToastr(result['statusMsg']);
    //   }

    // }, err => {
    //   this.loader = false;

    //   this.toast.errorToastr('Something went wrong');
    // })




  }

  refresh() {
    this.data = {};
    this.sendData = {};
    this.pagenumber = 0;
    this.service.setData(this.data)
    this.getContractorMeetList(this.active_tab);
  }

  statusModal(id, status, approvalAmt,type) {
    const dialogRef = this.dialog.open(ContractorMeetStatusModalComponent, {
      width: '500px',
      panelClass: 'cs-modal',
      disableClose: true,
      data: {
        'id': id,
        'status': status,
        'approvalAmt':approvalAmt,
        'approvalType':type
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      this.getContractorMeetList();
    });
  }

  statusModal2() {
    const dialogRef = this.dialog.open(ContractorMeetStatusModalComponent, {
      width: '500px',
      panelClass: 'cs-modal',
      disableClose: true,
      data: {
        'from': 'budget_per_plumber',
        'per_plumber_budget': this.budget
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result == true) this.getContractorMeetList();
    });
  }

  public getServerData(event: PageEvent) {
    this.sendData = {
      date_created: this.data.date_created,

      created_by_user: this.data.created_by,
      firm_mobile: this.data.firm_mobile,
      created_by_user_email: this.data.email,
      firm_name: this.data.firm_name,
      event_type: this.data.event_type,
      start: this.start,
      page_size: this.pageSize,
      end: this.end,
    };
    if (event.pageIndex != 0) {
      this.inc = 1;

    }
    else {
      this.inc = 0;
    }

    // alert(event.pageIndex);
    this.start = event.pageIndex * 10;
    this.end = (event.pageIndex + 1) * 10;
    this.getContractorMeetList();
  }

  back(): void {


    this.location.back()
  }



  downloadExcel() {
    this.loader = true;
    this.service.post_rqst({ 'filter': this.sendData, start: this.start, pagelimit: this.page_limit }, "Excel/filterMeetingData")
      .subscribe(((result: any) => {
        if (result['msg'] == true) {
          this.loader = false;
          window.open(this.downurl + result['filename'])
          this.getContractorMeetList('');
        } else {
          this.loader = false;
        }
      }));
  }


}
