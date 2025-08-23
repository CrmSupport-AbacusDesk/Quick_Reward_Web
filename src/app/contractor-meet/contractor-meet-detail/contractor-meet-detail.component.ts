import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, } from '@angular/router';
import { MatDialog } from '@angular/material';
import { ToastrManager } from 'ng6-toastr-notifications';
import { DatabaseService } from 'src/_services/DatabaseService';
import { DialogComponent } from 'src/app/dialog.component';
import { ImageModuleComponent } from 'src/app/image-module/image-module.component';
import { sessionStorage } from 'src/app/localstorage.service';
import { CryptoService } from 'src/_services/CryptoService';
import { ContractorMeetStatusModalComponent } from '../contractor-meet-status-modal/contractor-meet-status-modal.component';
import { ProgressService } from 'src/app/progress.service';


@Component({
  selector: 'app-contractor-meet-detail',
  templateUrl: './contractor-meet-detail.component.html'
})
export class ContractorMeetDetailComponent implements OnInit {
  meetingID: any;
  img_url = ''
  sendData: any = {};
  skLoading: boolean = false;
  contractorMeetDetail: any;
  downurl: any = '';
  logined_user_data: any = {};

  constructor(public route: ActivatedRoute,
    public rout: Router,
    public cryptoService: CryptoService,
    public toast: ToastrManager,
    public service: DatabaseService,
    public alert: DialogComponent,
    public dialogs: MatDialog,
    public router: Router,
    public progressService: ProgressService,
    public session: sessionStorage
  ) {
    this.img_url = this.service.uploadUrl + 'event_file/';
    this.route.params.subscribe(params => {
      let id = params.id.replace(/_/g, '/');
      this.meetingID = this.cryptoService.decryptId(id)
      this.service.currentUserID = this.cryptoService.decryptId(id)
    })
    this.downurl = service.downloadUrl
    this.logined_user_data = this.session.getSession();
    this.logined_user_data = this.logined_user_data.value;
    this.logined_user_data = this.logined_user_data.data;
    this.getMeetingDetails()
  }

  ngOnInit() {
  }

  tmparray: any = [];

  getMeetingDetails() {

    this.sendData = {
      id: this.meetingID
    }
    this.skLoading = true;
    this.service.post_rqst(this.sendData, "Event/eventDetail").subscribe((result) => {
      if (result['statusCode'] == 200) {
        this.contractorMeetDetail = result['result'];
        this.skLoading = false;
      } else {
        this.toast.errorToastr(result['statusMsg']);
        this.skLoading = false;

      }
    }, err => {
      this.toast.errorToastr('Something went wrong');
    })
  }


  goToImage(image) {
    const dialogRef = this.dialogs.open(ImageModuleComponent, {
      panelClass: 'Image-modal',
      data: {
        'image': image,
        'type': 'base64'
      }
    });
    dialogRef.afterClosed().subscribe(result => {
    });

  }

  getEventDetailExcel() {
    this.skLoading = true;
    this.sendData = {
      id: this.meetingID
    }
    this.service.post_rqst(this.sendData, "Excel/eventDetail").subscribe((result) => {
      if (result['msg'] == true) {
        window.open(this.downurl + result['filename'])
        this.getMeetingDetails();
      }
    });
  }




  // chunk data download start
  excelLoader: boolean = false;
  downloader: any = false;
  download_percent: any;
  remainingCount: any;
  totalCount: any;
  loader: boolean = false;
  page_limit: any;
  start: any = 0;
  downloadInChunks() {
    this.service.post_rqst({ 'user_id': this.logined_user_data.id, 'start': this.start, 'pagelimit': this.page_limit, 'search': this.sendData, 'user_type': this.logined_user_data.type }, "DownloadMaster/createQueueRequest").subscribe((result) => {
      if (result['statusCode'] == 200) {
        if (result['code'] == 0) {
          this.toast.errorToastr(result['statusMsg']);
          return;
        }
        if (result['code'] == 1) {
          this.downloadExcel2();
        }
      }
    }, err => {
      this.loader = false;
    });
  }

  downloadExcel2() {
    let can
    this.progressService.getCancelReq().subscribe(cancelReq => {
      console.log('line no 302' + cancelReq);
      can = cancelReq
    })
    if (can == false) {
      console.log('line no 305');
      this.downloader = true;
      if (this.download_percent == null) {
        this.download_percent = 0;
      }

      this.service.post_rqst({ 'user_id': this.logined_user_data.id, 'search': this.sendData, 'user_type': this.logined_user_data.type }, "DownloadMaster/eventDetail").subscribe((result) => {
        if (result['code'] === 1) {
          this.downloader = false;
          this.download_percent = null;
          window.open(this.downurl + result['filename']);
          this.progressService.setTotalCount(0);
          this.progressService.setRemainingCount(0);
          this.progressService.setDownloadProgress(0);
          this.progressService.setDownloaderActive(false);
          this.getMeetingDetails();
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
          this.downloadExcel2();
        }
      }, err => {
        this.excelLoader = false;

      });
    }
  }


  openDialog(mobileNumber, id) {
      const dialogRef = this.dialogs.open(ContractorMeetStatusModalComponent, {
        width: '500px',
        panelClass: 'cs-modal',
        disableClose: true,
        data: {
          'from': 'participentUser',
          'mobile_number': mobileNumber,
          'event_row_id': id,
        }
      });
      dialogRef.afterClosed().subscribe(result => {
        console.log(result)
        if (result != false) {
          this.meetingID = result;
          this.getMeetingDetails();
        }
      });
    
  }



}
