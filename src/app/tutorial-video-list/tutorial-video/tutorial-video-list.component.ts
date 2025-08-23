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
  selector: 'app-tutorial-video-list',
  templateUrl: './tutorial-video-list.component.html',
  styleUrls: ['./tutorial-video-list.component.scss']
})
export class TutorialVideoListComponent implements OnInit {
  loader: boolean = false;
  videoloader: boolean = false;
  active_tab: any = 'Video Tutorial';
  video_list: any = [];
  assign_login_data: any = {};
  banner_count: number;
  page_count: number;
  bannerUlr: any;
  logined_user_data: any = {};
  total_page: any;
  fabBtnValue: any = 'add'
  page_limit: any;
  pagenumber: any = 1;
  start: any = 0;
  sr_no: number;
  encryptedData: any;
  decryptedData: any;

  constructor(public rout: Router, public cryptoService: CryptoService, public service: DatabaseService, public toast: ToastrManager, public dialog: DialogComponent, public session: sessionStorage, public dialog2: MatDialog) {
    this.page_limit = 15;
    this.bannerUlr = service.uploadUrl + 'banner/';

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


  videoList() {
    this.videoloader = true;

    if (this.pagenumber > this.total_page) {
      this.pagenumber = this.total_page;
      this.start = this.page_count - this.page_limit;
    }
    if (this.start < 0) {
      this.start = 0;
    }
    this.encryptedData = this.service.payLoad ? { 'start': this.start, 'pagelimit': this.page_limit } : this.cryptoService.encryptData({ 'start': this.start, 'pagelimit': this.page_limit });

    this.service.post_rqst(this.encryptedData, "TutorialVideos/videoList").subscribe((result => {
      this.decryptedData = this.service.payLoad ? result : this.cryptoService.decryptData(JSON.stringify(result));

      this.videoloader = false;
      if (this.decryptedData['statusCode'] == 200) {

        this.video_list = this.decryptedData['video_list'];
        // let dcryptVideo = toBase64String(this.video_list[0].video)

        this.page_count = this.decryptedData['count'];
        if (this.pagenumber > this.total_page) {
          this.pagenumber = this.total_page;
          this.start = this.page_count - this.page_limit;
        }

        else {
          this.pagenumber = Math.ceil(this.start / this.page_limit) + 1;
        }
        this.total_page = Math.ceil(this.page_count / this.page_limit);
        this.sr_no = this.pagenumber - 1;
        this.sr_no = this.sr_no * this.page_limit;



      }
      else {
        this.toast.errorToastr(this.decryptedData['statusMsg']);
      }

    }), err => {
      this.videoloader = false;
    });

  }


  // Video List End


}
