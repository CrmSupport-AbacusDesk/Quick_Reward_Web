import { Component, OnInit } from '@angular/core';
import { slideToTop } from '../../router-animation/router-animation.component';
import { ActivatedRoute, Router } from '@angular/router';
import { DatabaseService } from 'src/_services/DatabaseService';
import { MatBottomSheet, MatDialog } from '@angular/material';
import { DialogComponent } from 'src/app/dialog.component';
import { Location } from '@angular/common';
//import { LeadAddFollowupModelComponent } from '../lead-add-followup-model/lead-add-followup-model.component';
import { sessionStorage } from 'src/app/localstorage.service';
// import { ChangeEnquiryStatusComponent } from '../change-enquiry-sta.tus/change-enquiry-status.component';
import * as moment from 'moment';
import { ToastrManager } from 'ng6-toastr-notifications';
import { ChangeEnquiryStatusComponent } from 'src/app/lead/change-enquiry-status/change-enquiry-status.component';
import { LeadAddFollowupModelComponent } from 'src/app/lead/lead-add-followup-model/lead-add-followup-model.component';
import { SiteAddFollowupComponent } from '../site-add-followup/site-add-followup.component';
import { ImageModuleComponent } from 'src/app/image-module/image-module.component';
import { CryptoService } from 'src/_services/CryptoService';
import { BottomSheetComponent } from 'src/app/bottom-sheet/bottom-sheet.component';

@Component({
  selector: 'app-site-detail',
  templateUrl: './site-detail.component.html'
})
export class SiteDetailComponent implements OnInit {
  
  exp_loader: any = false;
  tabType: any = 'Profile';
  fabBtnValue: any = 'status'
  lead_id: any;
  active: any = {};
  data: any = {};
  type: any;
  lead_detail: any = [];
  filter: any = {};
  loader: boolean = false;
  tabActiveType: any = {};
  data_not_found: boolean = false;
  userData: any;
  userId: any;
  userName: any;
  login_data: any = {};
  login_data5: any = {};
  add: any = {};
  lead_logs: any = []
  dr_id: any;
  url: any = '';
  sr_no: any = 0;
  total_page: any;
  pageCount: any;
  page_limit: any;
  pagenumber: any = 1;
  start: any = 0;
  minDate: any;
  site_detail: any = {};
  site_id: any;
  site_logs: any = [];
  checkinLoader: any = false;
  today_date: any;
  encryptedData:any;
  decryptedData:any;
  encrypt_id:any;
  
  constructor(
    public cryptoService:CryptoService,
    public route: ActivatedRoute,
    public service: DatabaseService,
    public router: Router,
    public dialog: MatDialog,
    public session: sessionStorage,
    public alert: DialogComponent,
    private bottomSheet: MatBottomSheet,
    public toast: ToastrManager,
    private _location: Location,) {
      this.url = service.uploadUrl + 'site/';
      this.page_limit = service.pageLimit;
      this.login_data = this.session.getSession();
      this.login_data = this.login_data.value;
      this.login_data5 = this.login_data.data;
      this.login_data = this.login_data.assignModule;
      this.minDate = new Date();
      const index = this.login_data.findIndex(row => row.module_name == 'Lead Distributors');
      this.userData = JSON.parse(localStorage.getItem('st_user'));
      this.userId = this.userData['data']['id'];
      this.userName = this.userData['data']['name'];
      this.tabActive('tab1');
      this.route.params.subscribe(params => {
        this.encrypt_id = params.id
        let id = params.id.replace(/_/g, '/');
        this.site_id = this.cryptoService.decryptId(id);
        this.service.currentUserID = this.cryptoService.decryptId(id);
        if(id){
          this.leadDetail();
        }
      });
      
      
    }
    
    backToList() {
      this._location.back();
    }
    
    tabActive(tab: any) {
      this.tabActiveType = {};
      this.tabActiveType[tab] = true;
    }
    
    
    ngOnInit() {
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
    
    
    
    
    
    
    leadDetail() {
      this.loader = true;
      this.encryptedData = this.service.payLoad ? { 'id': this.site_id }: this.cryptoService.encryptData({ 'id': this.site_id });
      
      this.service.post_rqst(this.encryptedData, "Enquiry/getSiteDetail").subscribe(result => {
        this.decryptedData = this.service.payLoad ? result : this.cryptoService.decryptData(JSON.stringify(result));
        
        if (this.decryptedData['statusCode'] == 200) {
          this.site_detail = this.decryptedData['enquiry_detail'];
          this.site_logs = this.decryptedData['enquiry_detail']['log'];
          
          setTimeout(() => {
            this.loader = false;
          }, 700);
        }
        else {
          this.toast.errorToastr(this.decryptedData['statusMsg']);
          this.loader = false;
        }
      })
    }
    
    
    openDialog(from, type, id, ownerName, created_by_name) {
      const dialogRef = this.dialog.open(SiteAddFollowupComponent, {
        width: '500px',
        panelClass: 'cs-modal',
        data: {
          id,
          created_by_name,
          ownerName,
          type,
          'user_id': this.site_detail.user_id,
          'estimate_date': this.site_detail.estimate_delivery_date,
          'form_type': 'site',
          
          from
        }
        
      });
      dialogRef.afterClosed().subscribe(result => {
        if (result != false) {
          this.leadDetail();
        }
      });
    }
    
    
    
    date_format(tabType): void {
      if (this.filter.date_created) {
        this.filter.date_created = moment(this.filter.date_created).format('YYYY-MM-DD');
      }
      if (tabType == 'Checkin') {
        this.getCheckin();
      }
    }
    
    
    
    lastBtnValue(value) {
      this.fabBtnValue = value;
    }
    
    checkinData: any = [];
    totalCheckinTime:any ={}
    
    
    getCheckin() {
      
      this.checkinLoader = true;
      if (this.pagenumber > this.total_page) {
        this.pagenumber = this.total_page;
        this.start = this.pageCount - this.page_limit;
      }
      
      if (this.start < 0) {
        this.start = 0;
      }
      let payLoad = { "filter": this.filter, "id": this.site_id, 'start': this.start, 'pagelimit': this.page_limit }
      this.service.post_rqst(payLoad, "Enquiry/drSiteList").subscribe((result) => {
        
        if (result['statusCode'] == 200) {
          this.checkinData = result['dr_site_list'];
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
    
    refresh() {
      this.filter = {};
      if (this.tabType == 'Checkin') {
        this.getCheckin();
      } 
    }
    
    nextPage(page) {
      this.start = this.start + this.page_limit;
      if (page == 'checkin') {
        this.getCheckin();
      } 
    }
    
    pervious(page) {
      this.start = this.start - this.page_limit;
      if (page == 'checkin') {
        this.getCheckin();
      } 
    }
    
    
    openBottomSheet(): void {
      this.bottomSheet.open(BottomSheetComponent, {
        data: {
          'filterPage': 'Sites',
        }
      });
      this.bottomSheet._openedBottomSheetRef.afterDismissed().subscribe((data) => {
        if(data){
          this.filter.date_from = data.date_from;
          this.filter.date_to = data.date_to;
          this.getCheckin();
        }
        
      })
    }
    
  }
  