import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DatabaseService } from 'src/_services/DatabaseService'
import { DialogComponent } from 'src/app/dialog.component';
import { MatDialog } from '@angular/material';
import { ToastrManager } from 'ng6-toastr-notifications';
import { sessionStorage } from 'src/app/localstorage.service';
import { CryptoService } from 'src/_services/CryptoService';

@Component({
  selector: 'app-banner-list',
  templateUrl: './banner-list.component.html'
})
export class BannerListComponent implements OnInit {
  loader: boolean = false;
  videoloader: boolean = false;
  active_tab: any = 'Banner List';
  banner_list: any = [];
  video_list: any = [];
  assign_login_data: any = {};
  banner_count: number;
  video_count: number;
  bannerUlr: any;
  logined_user_data: any = {};
  pageCount: any;
  total_page: any;
  fabBtnValue: any = 'add'
  page_limit: any;
  pagenumber: any = 1;
  start: any = 0;
  sr_no: number;

  constructor(public rout: Router, public cryptoService:CryptoService, public service: DatabaseService, public toast: ToastrManager, public dialog: DialogComponent, public session: sessionStorage, public dialog2: MatDialog) {
    this.page_limit = this.service.pageLimit;
    this.bannerUlr = service.uploadUrl + 'banner/';
    this.assign_login_data = this.session.getSession();
    this.logined_user_data = this.assign_login_data.value.data;
    this.getbannerList();
    this.videoList();
  }
  count: any = 0;
  ngOnInit() {
  }


  pervious() {
    this.start = this.start - this.page_limit;
    this.videoList();
  }

  nextPage() {
    this.start = this.start + this.page_limit;
    this.videoList();
  }

  edit_banner(id) {
    this.rout.navigate(['/banner-banner-detail/' + id])
  }

  refresh(type) {

    this.start = 0;
    if (type == 'Banner List') {
      this.getbannerList();
    }
    else {
      this.videoList();
    }

  }



  // Banner List Start
  getbannerList() {
    this.loader = true;
    this.service.post_rqst({}, "Master/bannerList").subscribe((result => {
      

      if (result['statusCode'] == 200) {
        this.banner_list = result['banner_list'];
        this.banner_count = result['count'];

        this.loader = false;
      }
      else {
        this.toast.errorToastr(result['statusMsg']);
      }

    }));

  }

  delete(id) {
    this.dialog.delete('Banner!').then((result) => {

      if (result) {
        this.service.post_rqst({ 'banner_id': id }, "Master/deleteBanner").subscribe((result) => {
          if (result['statusCode'] == 200) {
            this.toast.successToastr(result['statusMsg']);
            this.getbannerList()
          }
          else {
            this.toast.errorToastr(result['statusMsg']);
          }
        })
      }
    });


  }

  // Banner List End



  // Video List Start
  videoList() {
    this.videoloader = true;

    if (this.pagenumber > this.total_page) {
      this.pagenumber = this.total_page;
      this.start = this.pageCount - this.page_limit;
    }
    if (this.start < 0) {
      this.start = 0;
    }
    this.service.post_rqst({ 'start': this.start, 'pagelimit': this.page_limit }, "Master/videoList").subscribe((result => {
      if (result['statusCode'] == 200) {
        this.video_list = result['video_list'];
        this.video_count = result['count'];
        this.videoloader = false;
        if (this.pagenumber > this.total_page) {
          this.pagenumber = this.total_page;
          this.start = this.video_count - this.page_limit;
        }

        else {
          this.pagenumber = Math.ceil(this.start / this.page_limit) + 1;
        }
        this.total_page = Math.ceil(this.video_count / this.page_limit);
        this.sr_no = this.pagenumber - 1;
        this.sr_no = this.sr_no * this.page_limit;

        for (let i = 0; i < this.video_list.length; i++) {
          this.video_list[i].video = this.video_list[i].video.replace('/shorts/', '/embed/');
          if (this.video_list[i].status == '1') {
            this.video_list[i].newStatus = true
          }
          else if (this.video_list[i].status == '0') {
            this.video_list[i].newStatus = false;

          }
        }

      }
      else {
        this.toast.errorToastr(result['statusMsg']);
      }

    }));

  }

  updateStatus(i, event, id) {
    this.dialog.confirm("You Want To Change Status !").then((result) => {
      if (result) {
        if (event.checked == false) {
          this.video_list[i].status = "0";
        }
        else {
          this.video_list[i].status = "1";
        }
        let value = this.video_list[i].status;
        this.service.post_rqst({ 'video_id': id, 'status': value, 'status_changed_by': this.logined_user_data.id, 'status_changed_by_name': this.logined_user_data.name }, "Master/videoStatusChange")
          .subscribe(result => {
            if (result['statusCode'] == 200) {
              this.toast.successToastr(result['statusMsg']);
              this.videoList();
            }
            else {
              this.toast.errorToastr(result['statusMsg']);
            }
          })
      }
    })
  }

  Update_sequence_no(i, id, sequenceNo) {
    this.dialog.confirm("You Want To Change Sequence !").then((result) => {
      if (result) {
        this.service.post_rqst({ 'banner_id': id, 'sequenceNo': sequenceNo, 'status_changed_by': this.logined_user_data.id, 'status_changed_by_name': this.logined_user_data.name }, "Master/changeSequenceNo")
          .subscribe(result => {
            if (result['statusCode'] == 200) {
              this.toast.successToastr(result['statusMsg']);
              // this.editSequenceNo = false
              this.getbannerList();
            }
            else {
              this.getbannerList();
              this.toast.errorToastr(result['statusMsg']);
            }
          })
      }
    })
  }

  edit_sequence_no(item) {
    // this.editSequenceNo = true
    item.editSequenceNo = true;
  }

  formatLabel(value: number): string {
    if (value >= 1000) {
      return Math.round(value / 1000) + 'k';
    }

    return `${value}`;
  }

  deleteVideo(id) {
    this.dialog.delete('Video!').then((result) => {
      if (result) {
        this.service.post_rqst({ 'id': id }, "Master/videoDelete").subscribe((result) => {
          if (result['statusCode'] == 200) {
            this.toast.successToastr(result['statusMsg']);
            this.videoList()
          }
          else {
            this.toast.errorToastr(result['statusMsg']);
          }
        })
      }
    });


  }

  // Video List End


}
