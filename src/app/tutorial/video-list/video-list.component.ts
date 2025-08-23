import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DatabaseService } from 'src/_services/DatabaseService'
import { DialogComponent } from 'src/app/dialog.component';
import { MatDialog } from '@angular/material';
import { ToastrManager } from 'ng6-toastr-notifications';
import { sessionStorage } from 'src/app/localstorage.service';
import { CryptoService } from 'src/_services/CryptoService';
import { toBase64String } from '@angular/compiler/src/output/source_map';

// function asadsf() {
// let selement = document.getElementById("videoContainer");
// selement.addEventListener('contextmenu', event => event.preventDefault());

// }

@Component({
  selector: 'app-video-list',
  templateUrl: './video-list.component.html',
  styleUrls: ['./video-list.component.scss']
})

export class VideoListComponent implements OnInit {
  loader: boolean = false;
  videoloader: boolean = false;
  active_tab: any = 'App';
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
  encryptedData: any;
  decryptedData: any;

  constructor(public rout: Router, public cryptoService: CryptoService, public service: DatabaseService, public toast: ToastrManager, public dialog: DialogComponent, public session: sessionStorage, public dialog2: MatDialog) {
    this.page_limit = this.service.pageLimit;
    this.bannerUlr = service.uploadUrl + 'banner/';
    this.assign_login_data = this.session.getSession();
    this.logined_user_data = this.assign_login_data.value.data;

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

    }
    else {
      this.videoList();
    }

  }

  revok(event) {
    event.preventDefault()
  }


  delete(id, event) {
    // event.preventDefault()

    this.dialog.delete('Video!').then((result) => {

      if (result) {
        this.encryptedData = this.service.payLoad ? { 'video_id': id } : this.cryptoService.encryptData({ 'video_id': id });
        this.service.post_rqst(this.encryptedData, "Master/tutorialDeleteVideo").subscribe((result) => {
          this.decryptedData = this.service.payLoad ? result : this.cryptoService.decryptData(JSON.stringify(result));
          if (this.decryptedData['statusCode'] == 200) {
            this.toast.successToastr(this.decryptedData['statusMsg']);
            this.videoList();
          }
          else {
            this.toast.errorToastr(this.decryptedData['statusMsg']);
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
    this.encryptedData = this.service.payLoad ? { 'start': this.start, 'pagelimit': this.page_limit, 'active_tab': this.active_tab } : this.cryptoService.encryptData({ 'start': this.start, 'pagelimit': this.page_limit });

    this.service.post_rqst(this.encryptedData, "Master/tutorialVideoList").subscribe((result => {
      this.decryptedData = this.service.payLoad ? result : this.cryptoService.decryptData(JSON.stringify(result));

      this.videoloader = false;
      if (this.decryptedData['statusCode'] == 200) {

        this.video_list = this.decryptedData['video_list'];
        // let dcryptVideo = toBase64String(this.video_list[0].video)

        this.video_count = this.decryptedData['count'];
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
          if (this.video_list[i].status == '1') {
            this.video_list[i].newStatus = true
          }
          else if (this.video_list[i].status == '0') {
            this.video_list[i].newStatus = false;

          }
        }

      }
      else {
        this.toast.errorToastr(this.decryptedData['statusMsg']);
      }

    }), err => {
      this.videoloader = false;
    });

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
        this.encryptedData = this.service.payLoad ? { 'video_id': id, 'status': value, 'status_changed_by': this.logined_user_data.id, 'status_changed_by_name': this.logined_user_data.name } : this.cryptoService.encryptData({ 'video_id': id, 'status': value, 'status_changed_by': this.logined_user_data.id, 'status_changed_by_name': this.logined_user_data.name });

        this.service.post_rqst(this.encryptedData, "Master/videoStatusChange")
          .subscribe(result => {
            this.decryptedData = this.service.payLoad ? result : this.cryptoService.decryptData(JSON.stringify(result));

            if (this.decryptedData['statusCode'] == 200) {
              this.toast.successToastr(this.decryptedData['statusMsg']);
              this.videoList();
            }
            else {
              this.toast.errorToastr(this.decryptedData['statusMsg']);
            }
          })
      }
    })
  }

  Update_sequence_no(i, id, sequenceNo) {
    this.dialog.confirm("You Want To Change Sequence !").then((result) => {
      if (result) {
        this.encryptedData = this.service.payLoad ? { 'banner_id': id, 'sequenceNo': sequenceNo, 'status_changed_by': this.logined_user_data.id, 'status_changed_by_name': this.logined_user_data.name } : this.cryptoService.encryptData({ 'banner_id': id, 'sequenceNo': sequenceNo, 'status_changed_by': this.logined_user_data.id, 'status_changed_by_name': this.logined_user_data.name });
        this.service.post_rqst(this.encryptedData, "Master/changeSequenceNo")
          .subscribe(result => {
            this.decryptedData = this.service.payLoad ? result : this.cryptoService.decryptData(JSON.stringify(result));

            if (this.decryptedData['statusCode'] == 200) {
              this.toast.successToastr(this.decryptedData['statusMsg']);
              // this.editSequenceNo = false

            }
            else {

              this.toast.errorToastr(this.decryptedData['statusMsg']);
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

  // Video List End


}
