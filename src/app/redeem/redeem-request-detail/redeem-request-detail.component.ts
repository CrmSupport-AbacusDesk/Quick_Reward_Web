import { Component, OnInit } from '@angular/core';
import { DatabaseService } from 'src/_services/DatabaseService';
import { MatDialog } from '@angular/material';
import { ActivatedRoute } from '@angular/router';
import { ToastrManager } from 'ng6-toastr-notifications';
import { Location } from '@angular/common'

@Component({
  selector: 'app-redeem-request-detail',
  templateUrl: './redeem-request-detail.component.html'
})
export class RedeemRequestDetailComponent implements OnInit {

  fabBtnValue: any = 'add';
  active_tab: any = 'Pending'
  filter: any = {};
  redeemRequestList_data: any = []

  // pegination
  pageCount: any;
  total_page: any;
  page_limit: any = 50;
  pagenumber: any = 1;
  start: any = 0;
  sr_no: number;
  loader: boolean = false;
  redeem_count: any = {}
  redeem_detail: any = {}
  data: any = {}
  id: any = ''
  constructor(public service: DatabaseService, public dialog: MatDialog, public route: ActivatedRoute, public toast: ToastrManager, public location: Location) {
    this.route.params.subscribe(params => {
      this.id = params.id;
      this.service.currentUserID = params.id
    });
    this.redeemRequestList();
  }

  ngOnInit() {
  }


  redeemRequestList(action: any = '') {

    this.loader = true;
    if (this.pagenumber > this.total_page) {
      this.pagenumber = this.total_page;
      this.start = this.pageCount - this.page_limit;
    }
    this.filter.status = this.active_tab
    this.service.post_rqst({ 'id': this.id }, 'RedeemRequest/redeemGiftRequestDetail').subscribe((resp) => {
      if (resp['statusCode'] == 200) {
        this.redeem_detail = resp['gift_master_list']
        setTimeout(() => {
          this.loader = false;
        }, 700);
      }
      else {
        this.toast.errorToastr(resp['statusMsg']);
      }
    })
  }


  lastBtnValue(value) {
    this.fabBtnValue = value;
  }

  back(): void {
    this.location.back()
  }

}
