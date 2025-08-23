import { Component, OnInit } from '@angular/core';
import { slideToTop } from '../../router-animation/router-animation.component';
// import { MyserviceService } from 'src/app/myservice.service';
import { DatabaseService } from 'src/_services/DatabaseService';
import { DialogComponent } from 'src/app/dialog.component';
import { ToastrManager } from 'ng6-toastr-notifications';
import { sessionStorage } from 'src/app/localstorage.service';
import { CryptoService } from 'src/_services/CryptoService';

@Component({
  selector: 'app-holiday-list',
  templateUrl: './holiday-list.component.html',
  animations: [slideToTop()]
})
export class HolidayListComponent implements OnInit {
  holidays_data: any = [];
  holidays_state: any = [];
  skLoading: boolean = false;
  data: any = {};
  datanotfound: boolean = false;
  pageCount: any;
  total_page: any;
  page_limit: any;
  pagenumber: any = 1;
  assign_user_data: any;
  logined_user_data: any = {};
  start: any = 0;
  sr_no: number;


  constructor(public service: DatabaseService, public cryptoService:CryptoService, public toast: ToastrManager, public dialog: DialogComponent, public session: sessionStorage) {
    this.page_limit = this.service.pageLimit;
    this.assign_user_data = this.session.getSession();
    this.logined_user_data = this.assign_user_data.value.data;
    this.holiday_data();
  }


  ngOnInit() {
  }

  pervious() {
    this.start = this.start - this.page_limit;
    this.holiday_data();
  }

  nextPage() {
    this.start = this.start + this.page_limit;
    this.holiday_data();
  }


  refresh() {
    this.holiday_data();
    this.data = '';
  }

  holiday_data() {
    this.skLoading = true;

    if (this.pagenumber > this.total_page) {
      this.pagenumber = this.total_page;
      this.start = this.pageCount - this.page_limit;
    }

    if (this.start < 0) {
      this.start = 0;
    }
    this.service.post_rqst({ 'filter': this.data, 'start': this.start, 'pagelimit': this.page_limit }, 'Master/holidayList').subscribe((result) => {
      if (result['statusCode'] == 200) {
        this.skLoading = false;
        this.holidays_data = result['result_array'];
        this.pageCount = this.holidays_data.length;

        if (this.holidays_data.length == 0) {
          this.datanotfound = true;
        } else {
          this.datanotfound = false;
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
      }
      else {
        this.toast.errorToastr(result['statusMsg'])
      }
    }
    )
  }


  delete(id) {
    this.dialog.delete('Holiday!').then((result) => {
      if (result) {
        this.service.post_rqst({ "id": id }, "Master/holidayDelete").subscribe((result => {
          if (result['statusCode'] == 200) {
            this.toast.successToastr(result['statusMsg']);
            this.holiday_data();
          }
          else {
            this.toast.errorToastr(result['statusMsg']);
          }

        }))
      }
    })

  }


}
