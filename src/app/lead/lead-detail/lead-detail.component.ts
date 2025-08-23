import { Component, OnInit } from '@angular/core';
import { slideToTop } from '../../router-animation/router-animation.component';
import { ActivatedRoute, Router } from '@angular/router';
import { DatabaseService } from 'src/_services/DatabaseService';
import { MatBottomSheet, MatDialog } from '@angular/material';
import { DialogComponent } from 'src/app/dialog.component';
import { Location } from '@angular/common';
import { LeadAddFollowupModelComponent } from '../lead-add-followup-model/lead-add-followup-model.component';
import { sessionStorage } from 'src/app/localstorage.service';
import { ChangeEnquiryStatusComponent } from '../change-enquiry-status/change-enquiry-status.component';
import * as moment from 'moment';
import { ToastrManager } from 'ng6-toastr-notifications';
import { CryptoService } from 'src/_services/CryptoService';
import { ImageModuleComponent } from 'src/app/image-module/image-module.component';
import { LeadModalComponent } from '../lead-modal/lead-modal.component';
import { BottomSheetComponent } from 'src/app/bottom-sheet/bottom-sheet.component';





@Component({
  selector: 'app-lead-detail',
  templateUrl: './lead-detail.component.html',
  styles: ['agm-map { height: 300px; }'],
  animations: [slideToTop()]
})
export class LeadDetailComponent implements OnInit {
  exp_loader: any = false;
  tabType: any = 'Profile';
  fabBtnValue: any = 'status'
  lead_id: any='';
  active: any = {};
  data: any = {};
  type: any;
  lead_detail: any = [];
  filter: any = {};
  loader: boolean = false;
  tabActiveType: any = {};
  data_not_found: boolean = false;
  followup_list: any = [];
  login_data: any = {};
  add: any = {};
  lead_logs: any = []
  stageListData: any = [];
  dr_id: any;
  enquiryUrl: any
  sr_no: any = 0;
  total_page: any;
  pageCount: any;
  page_limit: any;
  pagenumber: any = 1;
  start: any = 0;
  minDate: any;
  skLoading: boolean = false;
  activeStageIndex: number;
  stageCompletionPercentage: number = 0;
  stageCompletionCount: number = 0;
  totalCheckinTime:any ={}
  today_date = new Date();
  encrypt_id:any;
  constructor(
    public cryptoService: CryptoService,
    public route: ActivatedRoute,
    public service: DatabaseService,
    public router: Router,
    public dialog: MatDialog,
    private bottomSheet: MatBottomSheet,
    public session: sessionStorage,
    public alert: DialogComponent,
    public toast: ToastrManager,
    private _location: Location,) {
      this.page_limit = service.pageLimit;
      this.login_data = this.session.getSession();
      this.login_data = this.login_data.value.data;
      this.minDate = new Date();
      this.enquiryUrl = service.uploadUrl + 'enquiry/';
      this.tabActive('tab1');
      
      this.route.params.subscribe(params => {
        let id = params.id.replace(/_/g, '/');
        this.encrypt_id = params.id
        this.lead_id =   this.cryptoService.decryptId(id);
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
    
    
    pervious(page) {
      this.start = this.start - this.page_limit;
      if (page == 'checkin') {
        this.getCheckin();
      } else {
        this.followupList();
      }
    }
    
    nextPage(page) {
      this.start = this.start + this.page_limit;
      if (page == 'checkin') {
        this.getCheckin();
      } else {
        this.followupList();
      }
    }
    
    
    refresh() {
      this.filter = {};
      if (this.tabType == 'Checkin') {
        this.getCheckin();
      } else {
        this.followupList();
      }
      
    }
    
    transform(percentage) {
      // Ensure percentage is a number and convert to floating value between 0 and 1
      return parseInt(percentage, 10);
    }
    
    
    
    leadDetail() {
      this.loader = true;
      this.service.post_rqst({ 'id': this.lead_id } , "Enquiry/enquiryDetail").subscribe(result => {
        if (result['statusCode'] == 200) {
          this.lead_detail = result['enquiry_detail'];
          this.lead_logs = result['enquiry_detail']['log'];
          this.stageListData = result['enquiry_detail']['stages_detail'];
          
          if (this.stageListData.length > 0) {
            this.calculateStageCompletion(this.stageListData);
          }
          setTimeout(() => {
            this.loader = false;
          }, 700);
        }
        else {
          this.toast.errorToastr(result['statusMsg']);
          this.loader = false;
        }
      })
    }
    
    calculateStageCompletion(stageListData) {
      let count = 0;
      stageListData.forEach(stage => {
        if (stage.last_updated_date !== "0000-00-00 00:00:00") {
          count++;
          this.stageCompletionCount = count;
        }
      });
      let totalStages = stageListData.length;
      this.stageCompletionPercentage = (count / totalStages) * 100;
      return this.stageCompletionPercentage;
    }
    
    updateStage(id, date) {
      this.alert.confirm("Do you want to Update this Stage !").then((result) => {
        if (result) {
          this.service.post_rqst({ 'id': id, 'update_id': this.lead_id, 'status': date != '0000-00-00 00:00:00' ? 'deactive' : 'active' }, "Master/updateStages").subscribe((result) => {
            
            if (result['statusCode'] == 200) {
              this.toast.successToastr(result['statusMsg']);
              this.leadDetail();
            }
            else {
              this.toast.errorToastr(result['statusMsg']);
            }
          }, err => {
          });
        } else {
        }
      })
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
    
    openDialog2(shareType) {
      const dialogRef = this.dialog.open(LeadModalComponent, {
        width: '800px',
        data: {
          'customer_name': this.lead_detail.name,
          'customer_mobile': this.lead_detail.mobile,
          'customer_email': this.lead_detail.email ? this.lead_detail.email : '',
          'shareType': shareType,
        }
      });
      dialogRef.afterClosed().subscribe(result => {
        if (result != false) {
          console.log('lead modal close...')
        }
      });
    }
    
    openDialog(dr_type, value, company_name, name, type) {
      const dialogRef = this.dialog.open(LeadAddFollowupModelComponent, {
        width: '500px',
        panelClass: 'cs-modal',
        data: {
          dr_type,
          value,
          type,
          name,
          company_name,
          id: this.lead_id,
          state: this.lead_detail.state,
          'user_id': this.lead_detail.user_id
          
        }
      });
      dialogRef.afterClosed().subscribe(result => {
        if (result != false) {
          this.leadDetail();
          this.followupList();
        }
      });
    }
    
    followupList() {
      this.loader = true;
      if (this.pagenumber > this.total_page) {
        this.pagenumber = this.total_page;
        this.start = this.pageCount - this.page_limit;
      }
      if (this.start < 0) {
        this.start = 0;
      }
      
      
      if (this.filter.date_created) {
        this.filter.date_created = moment(this.filter.date_created).format('YYYY-MM-DD');
      }
      if (this.filter.next_follow_date) {
        this.filter.next_follow_date = moment(this.filter.next_follow_date).format('YYYY-MM-DD');
      }
      this.service.post_rqst({ 'filter': this.filter, 'start': this.start, 'pagelimit': this.page_limit, 'dr_id': this.lead_id, 'dr_type': this.lead_detail.type, 'dr_type_name': 'Enquiry' }, "Enquiry/followupList").subscribe(result => {
        if (result['statusCode'] == 200) {
          this.followup_list = result['result'];
          this.loader = false;
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
          this.sr_no = this.sr_no * this.page_limit
          
          if (this.followup_list.length == 0) {
            this.data_not_found = true;
          } else {
            this.data_not_found = false;
          }
          
        }
        else {
          this.toast.errorToastr(result['statusMsg']);
          this.loader = false;
        }
        
      }, error => {
      })
    }
    
    changeStatus(assignType) {
      const dialogRef = this.dialog.open(ChangeEnquiryStatusComponent, {
        width: '600px',
        panelClass: 'cs-modal',
        data: {
          'id': this.lead_id,
          'user_employee_code': this.lead_detail.user_employee_code,
          'user_id': this.lead_detail.user_id,
          'user_name': this.lead_detail.user_name,
          'dr_type': this.lead_detail.type,
          'lead_data': this.lead_detail,
          'assignType': assignType,
        }
      });
      dialogRef.afterClosed().subscribe(result => {
        if (result != false) {
          this.leadDetail();
          this.followupList();
        }
      });
    }
    lastBtnValue(value) {
      this.fabBtnValue = value;
    }
    
    
    checkinData: any = [];
    checkinLoader: boolean = false;
    
    getCheckin() {
      
      this.checkinLoader = true;
      if (this.pagenumber > this.total_page) {
        this.pagenumber = this.total_page;
        this.start = this.pageCount - this.page_limit;
      }
      
      if (this.start < 0) {
        this.start = 0;
      }
      let payLoad = { "filter": this.filter, "id": this.lead_id, 'start': this.start, 'pagelimit': this.page_limit }
      this.service.post_rqst(payLoad, "Enquiry/drEnquryList").subscribe((result) => {
        
        if (result['statusCode'] == 200) {
          this.checkinData = result['dr_enquiry_list'];
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
    
    date_format(tabType): void {
      this.filter.date_created = moment(this.filter.date_created).format('YYYY-MM-DD');
      if (tabType == 'Checkin') {
        this.getCheckin();
      }
      else {
        this.followupList();
      }
    }
    
    
    openBottomSheet(): void {
      this.bottomSheet.open(BottomSheetComponent, {
        data: {
          'filterPage': 'Customer_network',
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
  