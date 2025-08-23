import { Component, OnInit } from '@angular/core';
import { slideToTop } from '../../router-animation/router-animation.component';
import { DatabaseService } from 'src/_services/DatabaseService';
import { Router } from '@angular/router';
import { DialogComponent } from 'src/app/dialog.component';
import { MatBottomSheet, MatDialog } from '@angular/material';
import { sessionStorage } from 'src/app/localstorage.service';
import { ToastrManager } from 'ng6-toastr-notifications';
import { UploadFileModalComponent } from 'src/app/upload-file-modal/upload-file-modal.component';
import * as moment from 'moment';
import { BottomSheetComponent } from 'src/app/bottom-sheet/bottom-sheet.component';
import { ImageModuleComponent } from 'src/app/image-module/image-module.component';
import { CryptoService } from 'src/_services/CryptoService';
import { ChunksUploaderComponent } from 'src/app/uploader-new/chunks-uploader/chunks-uploader.component';

@Component({
  selector: 'app-sale-user-list',
  templateUrl: './sale-user-list.component.html',
  animations: [slideToTop()]

})
export class SaleUserListComponent implements OnInit {
  userType: any = 'Sales User';
  logined_user_data: any = {};
  assign_login_data: any = {};
  nodatafound: boolean = true;
  excel_data: any = [];
  tmp: any = [];
  fabBtnValue: any = 'add';
  userlist: any = [];
  sales_count: any;
  system_count: any;
  service_count: any;
  org_count: any;
  filter: any = {}
  loader: boolean = false;
  Status: boolean = true;
  datanotfound = false;
  dialog: any;
  userData: any;
  userId: any;
  userName: any;
  sr_no: number;
  logined_user_data2: any;
  start: any = 0;
  total_page: any;
  pagenumber: any;
  count: any;
  page_limit: any;
  downurl: any = ''
  today_date: Date;

  constructor(public alert: DialogComponent, public cryptoService:CryptoService, public toast: ToastrManager, public service: DatabaseService, public rout: Router, public dialog2: MatDialog, public session: sessionStorage, private bottomSheet: MatBottomSheet) {
    this.page_limit = this.service.pageLimit;


    this.today_date = new Date();
    this.downurl = service.downloadUrl
 
  }

  ngOnInit() {
    this.assign_login_data = this.session.getSession();
    this.logined_user_data = this.assign_login_data.value;
    this.logined_user_data2 = this.logined_user_data.data;
    this.assign_login_data = this.assign_login_data.assignModule;
    this.userData = JSON.parse(localStorage.getItem('st_user'));
    this.userId = this.userData['data']['id'];
    this.userName = this.userData['data']['name'];

    this.filter = this.service.getData();
    if (this.logined_user_data2.id == '1') {
      this.userType = 'ORG';
    }
    else if(this.logined_user_data2.organisation_data !=  null){
      if(this.logined_user_data2.organisation_data.sfa == '1'){
        this.userType = 'Sales User';
      }
      else{
      this.userType = 'System User';
      }
    }
    else{
      this.userType = 'System User';
    }

    this.userType = this.service.getTabData();
    if((typeof this.userType === 'object' && Object.keys(this.userType).length === 0)){
      if (this.logined_user_data2.id == '1') {
        this.userType = 'ORG';
      }
      else if(this.logined_user_data2.organisation_data !=  null){
        if(this.logined_user_data2.organisation_data.sfa == '1'){
          this.userType = 'Sales User';
        }
        else{
        this.userType = 'System User';
        }
      }  
      else{
        this.userType = 'System User';
      }

    }
    this.getUserList(this.userType);
  }

  pervious() {
    this.start = this.start - this.page_limit;
    this.getUserList(this.userType);
  }

  nextPage() {
    this.start = this.start + this.page_limit;
    this.getUserList(this.userType);
  }

  lastBtnValue(value) {
    this.fabBtnValue = value;
  }

  date_format(): void {
    this.filter.date_created = moment(this.filter.date_created).format('YYYY-MM-DD');
    this.getUserList(this.userType);
  }
  date_format1(): void {
    this.filter.date_of_joining = moment(this.filter.date_of_joining).format('YYYY-MM-DD');
    this.getUserList(this.userType);
  }

  getUserList(user_type) {
    this.loader = true;
    if (this.pagenumber > this.total_page) {
      this.pagenumber = this.total_page;
      this.start = this.count - this.page_limit;
    }

    if (this.start < 0) {
      this.start = 0;
    }
    this.service.post_rqst({ "active_tab": user_type, "start": this.start, "pagelimit": this.page_limit, "filter": this.filter }, "Master/salesUserList").subscribe((result) => {
      
     
      if (result['statusCode'] == 200) {
        this.userlist = result['all_sales_user'];
        this.sales_count = result['type_count']['Sales User'];
        this.system_count = result['type_count']['System User'];
        this.service_count = result['type_count']['Service Engineer'];
        this.org_count = result['type_count']['ORG'];

        if (this.userlist.length == 0) {
          this.nodatafound = false;
        } else {
          this.nodatafound = true;
        }
        setTimeout(() => {
          this.loader = false;
        }, 700);
        this.count = result['count'];
        if (this.pagenumber > this.total_page) {
          this.pagenumber = this.total_page;
          this.start = this.count - this.page_limit;
        }

        else {
          this.pagenumber = Math.ceil(this.start / this.page_limit) + 1;
        }
        this.total_page = Math.ceil(this.count / this.page_limit);
        this.sr_no = this.pagenumber - 1;
        this.sr_no = this.sr_no * this.page_limit;
        for (let i = 0; i < this.userlist.length; i++) {
          this.userlist[i]['encrypt_id'] =  this.cryptoService.encryptId(this.userlist[i]['id'].toString());

          if (this.userlist[i].status == '1') {
            this.userlist[i].user_status = true
          }
          else if (this.userlist[i].status == '0') {
            this.userlist[i].user_status = false;

          }
        }

        if (this.userlist.length == 0) {
          this.datanotfound = true;
        }
        else {
          this.datanotfound = false;
        }
      }
      else {
        this.toast.errorToastr(result['statusMsg']);
        this.loader = false;
      }

    })
    this.service.count_list();
  }

  Filename: any = ''
  getUserExcel(user_type) {
    this.loader = true;
    this.service.post_rqst({ "active_tab": user_type, "filter": this.filter }, "Excel/user_list_for_export").subscribe((result) => {
      
      if (result['msg'] == true) {
        window.open(this.downurl + result['filename'])
        this.getUserList(user_type);
      }
    });
  }




  refresh() {
    this.start = 0;
    this.filter = {};
    this.service.setData(this.filter)
    this.service.currentUserID = ''
    this.getUserList(this.userType);
  }

 


  updateStatus(index, id, event) {
    this.alert.confirm("You Want To Change Status !").then((result) => {
      if (result) {
        if (event.checked == false) {
          this.userlist[index].status = "0";
        }
        else {
          this.userlist[index].status = "1";
        }
        let value = this.userlist[index].status;
        
        this.service.post_rqst({ 'id': id, 'status': value, 'status_changed_by_id': this.logined_user_data.data.id, 'status_changed_by_name': this.logined_user_data.data.name }, "Master/userStatusChange")
          .subscribe(result => {
      
            if (result['statusCode'] == 200) {
              this.toast.successToastr(result['statusMsg']);
              this.getUserList(this.userType);
            }
            else {
              this.toast.errorToastr(result['statusMsg']);
            }
          })
      }
    })
  }

  resetDevice(index, id) {
    this.alert.confirm("You Want To  Reset Device !").then((result) => {
      if (result) {
        this.service.post_rqst({ 'id': id, 'type': 'user' }, "Master/resetDeviceId")
          .subscribe(result => {
      
            if (result['statusCode'] == 200) {
              this.toast.successToastr(result['statusMsg']);
              this.getUserList(this.userType);
            }
            else {
              this.toast.errorToastr(result['statusMsg']);
            }
          })
      }
    })

  }

  openBottomSheet(): void {
    this.bottomSheet.open(BottomSheetComponent, {
      data: {
        'filterPage': 'distribution_list',
      }
    });
    this.bottomSheet._openedBottomSheetRef.afterDismissed().subscribe((data) => {
      if (data != undefined) {
        this.filter.date_from = data.date_from;
        this.filter.date_to = data.date_to;
        // this.search.userId = data.user_id;
        this.getUserList(this.userType);
      }
    })
  }

  sortData() {
    this.userlist.reverse();
  }


  upload_excel(type) {
    const dialogRef = this.dialog2.open(ChunksUploaderComponent, {
      width: '500px',
      panelClass: 'cs-modal',
      disableClose: true,
      data: {
        'For': type
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result == true) {
        this.getUserList(this.userType);
      }
    });
  }


  hierarchy: any = []
  getHierarchy() {
    this.loader = true;
    this.service.post_rqst({}, "Master/getUserhierarchy").subscribe((result) => {
      if(result['statusCode'] == 200) {
        this.hierarchy = result['level1'];
      }
      else {
        this.toast.errorToastr(result['statusMsg']);
      }
    });
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


}
