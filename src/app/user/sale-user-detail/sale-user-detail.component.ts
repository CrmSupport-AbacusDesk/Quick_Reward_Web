import { Component, OnInit } from '@angular/core';
import { slideToTop } from '../../router-animation/router-animation.component';
import { DatabaseService } from 'src/_services/DatabaseService';
import { MatDialog } from '@angular/material';
import { Router, ActivatedRoute } from '@angular/router';
import { DialogService } from 'src/app/dialog.service';
import { DialogComponent } from 'src/app/dialog.component';
import { sessionStorage } from 'src/app/localstorage.service';

import * as moment from 'moment';
import { Location } from '@angular/common';
// import { DH_CHECK_P_NOT_PRIME } from 'constants';
// import { ToastrManager } from 'ng6-toastr-notifications';
import { DesignationComponent } from '../designation/designation.component';
import { ToastrManager } from 'ng6-toastr-notifications';
import { ImageModuleComponent } from 'src/app/image-module/image-module.component';
import { CryptoService } from 'src/_services/CryptoService';
import { HeaderSettingModalComponent } from 'src/app/header-setting-modal/header-setting-modal.component';
import { DesignationModalComponent } from 'src/app/userdesignation/designation-modal/designation-modal.component';

@Component({
  selector: 'app-sale-user-detail',
  templateUrl: './sale-user-detail.component.html',
  animations: [slideToTop()]
})
export class SaleUserDetailComponent implements OnInit {
  detail: any = {};
  skLoading: boolean = false;
  manager: any;
  user_id;
  loader: any;
  login_data: any = [];
  assign_module_data: any = [];
  checkin_data: any = [];
  userData: any;
  userId: any;
  userName: any;
  tabType: any = 'Profile';
  netWorkName: any = '';
  InfluencerNetWorkName: any = '';
  netWorkType: any = 1;
  InfluencerNetWorkType: any = 1;
  today_date: any;
  url: any;
  typeList: any = [];
  sr_no = 0;
  dataToReceive: { type: string, netWorkName: string, padding0: string } = {
    type: '',
    netWorkName: '',
    padding0: ''
  };
  encrypt_id: any;


  constructor(public alert: DialogComponent, public cryptoService: CryptoService, public toast: ToastrManager, private router: Router, public location: Location, public service: DatabaseService, public dialog: MatDialog, public rout: Router, public editdialog: DialogService,
    public session: sessionStorage, public route: ActivatedRoute) {

    this.netWorkName = service.drArray.length > 0 ? service.drArray[0]['module_name'] : '';
    this.InfluencerNetWorkName = service.InfluenceArray.length > 0 ? service.InfluenceArray[0]['module_name'] : '';
    this.InfluencerNetWorkType = service.InfluenceArray.length > 0 ? service.InfluenceArray[0]['type'] : '';
    this.route.params.subscribe(params => {
      let id = params.id.replace(/_/g, '/');
      if (this.route.queryParams['_value']['page'] == 'attendence') {
        this.tabType = 'Tracker';
        this.detail.id = this.cryptoService.decryptId(id);
      }
      this.encrypt_id = params.id;
      this.user_id = this.cryptoService.decryptId(id);
      this.service.currentUserID = this.cryptoService.decryptId(id)
      if (id) {
        this.userDetail();
      }
      this.login_data = this.session.getSession();
      this.login_data = this.login_data.value;
      this.login_data = this.login_data.data;
      console.log(this.service.InfluenceArray)
      this.userData = JSON.parse(localStorage.getItem('st_user'));
      this.userId = this.userData['data']['id'];
      this.userName = this.userData['data']['name'];
      this.url = this.service.uploadUrl + 'profile/'
      this.login_data.accessAllowed = ['Enquiry', 'Site', 'Influencer Network', 'Customer Network', 'Primary Orders', 'Secondary Orders', 'Attendance', 'Check In', 'Leave', 'Travel Plan', 'Followup', 'Expense', 'Event Plan', 'Pop & Gift', 'Survey', 'Gift Gallery', 'Bonus Point', 'Qr Code', 'Redeem Request', 'Task', 'Ticket', 'Brand Audit', 'Target', 'Category', 'Sub Category', 'Products', 'PDF', 'Leave Master', 'Users', 'Designation', 'Customer Category', 'Point Category', 'Holiday', 'Allowance Master']

    });



    this.today_date = moment(new Date()).subtract(1, 'day').format('YYYY-MM-DD');
  }

  ngOnInit() {
    this.service.influencer_netwrk();
  }


  back(): void {
    this.location.back()
  }

  copyAddress(address) {
    // copy text 
    window.navigator['clipboard'].writeText(address);
    this.toast.successToastr("Copied 😊");
  }

  updateNetworkInfo(row: any) {
    this.netWorkName = row.module_name;
    this.netWorkType = row.type;
    this.updateDataToReceive();
  }

  updateDataToReceive() {
    this.dataToReceive = {
      type: this.netWorkType,
      netWorkName: this.netWorkName,
      padding0: 'padding0'
    };
  }

  delteDataRequest(data) {
    this.alert.confirm(`This action will delete whole data of this client`).then((resp) => {
      if (!resp) return;

      this.service.post_rqst({ ...data }, "Master/deleteMasterData").subscribe((result) => {

        if (result['statusCode'] == 200) {
          this.toast.successToastr(result['statusMsg']);
        } else {
          this.toast.errorToastr(result['statusMsg'])
        }
      }, err => { }
      );


    })
  }



  userDetail() {
    this.skLoading = true;
    this.service.post_rqst({ 'id': this.user_id }, "Master/salesUserDetail").subscribe((result) => {

      if (result['statusCode'] == 200) {
        this.detail = result.sales_detail;
        this.skLoading = false;
        if (this.detail.user_type == 'System User' || this.detail.user_type == 'ORG' || this.detail.user_type == 'Sales User') {
          this.assign_module_data = this.detail.assign_module;
        }
      }
      else {
        this.toast.errorToastr(result['statusMsg']);
      }
    })

  }


  assign_module(module_name, event, index) {
    if (event.checked) {
      this.assign_module_data[index][module_name] = 'true';
      this.assign_module_data[index]['view'] = 'true';
    }
    else {
      this.assign_module_data[index][module_name] = 'false';
    }
    this.service.post_rqst(this.assign_module_data[index], "user/update_user_module").subscribe(response => {
      this.userDetail();
    });
  }





  openDialog(type) {
    const dialogRef = this.dialog.open(DesignationComponent, {
      width: '750px',
      panelClass: 'cs-modal',
      disableClose: true,
      data: {
        'type': type,
        'user_detail': this.detail
      }

    });

    dialogRef.afterClosed().subscribe(result => {
      if (result == true) {
        this.userDetail();
      }
    });
  }



  fetchData() {
    this.typeList = [];
    this.loader = true;
    this.service.post_rqst({}, "Master/masterDropdownList").subscribe((result) => {
      if (result['statusCode'] == 200) {
        this.loader = false;
        this.typeList = result['data'];
      } else {
        this.toast.errorToastr(result['statusMsg'])
      }
    }, err => {
      this.loader = false;

    });
  }

  openDialog2(roData) {
    const dialogRef = this.dialog.open(DesignationModalComponent, {
      width: '700px',
      data: {
        info: roData,
        org_id: this.detail.org_id,
        'type': 'loyaltyBaseManagement'
      }
    });
    dialogRef.afterClosed().subscribe(res => {
      if (res == true) {
        this.fetchData()
      }
    })

  }

  refresh() {
    this.fetchData();
  }

  reset() {
    this.alert.confirm("Do You Want To Reset Attendance Punchin Address!").then((result) => {
      if (result) {
        this.service.post_rqst({ 'user_id': this.detail.id }, "Master/resetGeolocation")
          .subscribe(result => {
            if (result['statusCode'] == 200) {
              this.toast.successToastr(result['statusMsg']);
              this.userDetail();
            }
            else {
              this.toast.errorToastr(result['statusMsg']);
            }
          })
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

  settingModal(module_id, module_name, app_id) {
    console.log(module_id);

    const dialogRef = this.dialog.open(HeaderSettingModalComponent, {
      width: '900px',
      data: {
        'module_id': module_id,
        'module_name': module_name,
        'app_id': app_id,
      }
    });
    dialogRef.afterClosed().subscribe(result => {
    });

  }

}
