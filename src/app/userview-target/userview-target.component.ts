import { Component, OnInit } from '@angular/core';
import { DatabaseService } from 'src/_services/DatabaseService';
import { MatDialog } from '@angular/material';
import { UploadFileModalComponent } from 'src/app/upload-file-modal/upload-file-modal.component';
import { sessionStorage } from 'src/app/localstorage.service';
import { ToastrManager } from 'ng6-toastr-notifications';
import { DialogComponent } from '../dialog.component';
import { CryptoService } from 'src/_services/CryptoService';
import { ChunksUploaderComponent } from '../uploader-new/chunks-uploader/chunks-uploader.component';
import { ProgressService } from '../progress.service';
import { StatusModalComponent } from '../order/status-modal/status-modal.component';

@Component({
  selector: 'app-userview-target',
  templateUrl: './userview-target.component.html',
  styleUrls: ['./userview-target.component.scss']
})
export class UserviewTargetComponent implements OnInit {
  assign_login_data: any = [];
  assign_login_data2: any = [];
  fabBtnValue: any = 'excel';
  sub_active_tab: any = 'primary';
  view_edit: boolean = true;
  view_add: boolean = true;
  view_delete: boolean = true;
  value: any = {};
  target_list: any = [];
  active_tab: any = 'Secondary_Sale';
  loader: boolean = false;
  datanotfound: boolean = false;
  sr_no: any = 0;
  pageCount: any;
  total_page: any;
  page_limit: any;
  pagenumber: any = 1;
  start: any = 0;
  downurl: any;
  encryptedData:any;
  decryptedData:any;

  constructor(public service: DatabaseService,public progressService: ProgressService,  public cryptoService:CryptoService, public alrt: MatDialog, public dialog: DialogComponent, public session: sessionStorage, public toast: ToastrManager) {
    this.page_limit = service.pageLimit;
    this.downurl = service.downloadUrl
    this.assign_login_data = this.session.getSession();
    this.assign_login_data = this.assign_login_data.value;
    this.assign_login_data2 = this.assign_login_data.data;
    console.log(this.assign_login_data2.organisation_data.order_place);
    this.assign_login_data = this.assign_login_data.assignModule;
    this.get_user_data();
  }

  ngOnInit() {
  }

  refresh1() {
    this.value = {};
    this.get_user_data()
  }
  lastBtnValue(value) {
    this.fabBtnValue = value;
  }

  pervious() {
    this.start = this.start - this.page_limit;
    this.get_user_data();
  }

  nextPage() {
    this.start = this.start + this.page_limit;
    this.get_user_data();
  }


  get_user_data() {

    if (this.pagenumber > this.total_page) {
      this.pagenumber = this.total_page;
      this.start = this.pageCount - this.page_limit;
    }

    if (this.start < 0) {
      this.start = 0;
    }


    this.loader = true;
    if (this.active_tab == 'Sale') {
      this.target_list = [];
      this.encryptedData = this.service.payLoad ? { 'user_id': this.assign_login_data2.id, 'start': this.start, 'pagelimit': this.page_limit, 'search': this.value }: this.cryptoService.encryptData({ 'user_id': this.assign_login_data2.id, 'start': this.start, 'pagelimit': this.page_limit, 'search': this.value });
      this.service.post_rqst(this.encryptedData, "Target/userTargetList").subscribe((result => {
        this.decryptedData = this.service.payLoad ? result : this.cryptoService.decryptData(JSON.stringify(result));
        if (this.decryptedData['statusCode'] == 200) {
          this.target_list = this.decryptedData['target_list'];
          this.pageCount = this.decryptedData['count'];
          if (this.target_list.length == 0) {
            this.datanotfound = true
          } else {
            this.datanotfound = false
          }
          this.loader = false;
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
          this.toast.errorToastr(this.decryptedData['statusMsg']);
        }

      }));
    } else
      if (this.active_tab == 'Visit' || this.active_tab == 'Emp') {
        this.target_list = [];
      this.encryptedData = this.service.payLoad ? { 'user_id': this.assign_login_data2.id, 'start': this.start, 'pagelimit': this.page_limit, 'search': this.value }: this.cryptoService.encryptData({ 'user_id': this.assign_login_data2.id, 'start': this.start, 'pagelimit': this.page_limit, 'search': this.value });
        this.service.post_rqst(this.encryptedData, "Target/userVisitTargetList").subscribe((result => {
        this.decryptedData = this.service.payLoad ? result : this.cryptoService.decryptData(JSON.stringify(result));
          if (this.decryptedData['statusCode'] == 200) {
            this.target_list = this.decryptedData['target_list'];
            this.loader = false;
            this.pageCount = this.decryptedData['count'];
            // for (let i = 0; i < this.target_list.length; i++) {
            //   this.target_list[i].achieve = parseFloat(this.target_list[i].achieve)
            //   this.target_list[i].achieve = this.target_list[i].achieve.toFixed(2)
            // }

            if (this.target_list.length == 0) {
              this.datanotfound = true
            } else {
              this.datanotfound = false
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
            this.toast.errorToastr(this.decryptedData['statusMsg']);
          }
        }));
      } else if (this.active_tab == 'Secondary_Sale') {
        this.target_list = [];
       this.encryptedData = this.service.payLoad ? { 'user_id': this.assign_login_data2.id, 'start': this.start, 'pagelimit': this.page_limit, 'search': this.value }: this.cryptoService.encryptData({ 'user_id': this.assign_login_data2.id, 'start': this.start, 'pagelimit': this.page_limit, 'search': this.value });
        this.service.post_rqst(this.encryptedData,  this.sub_active_tab == 'primary' ? "Target/directPrimaryTargetList" : "Target/distributorsSecondaryTargetList").subscribe((result => {
        this.decryptedData = this.service.payLoad ? result : this.cryptoService.decryptData(JSON.stringify(result));
          if (this.decryptedData['statusCode'] == 200) {
            this.target_list = this.decryptedData['target_list'];
            this.pageCount = this.decryptedData['count'];
            this.loader = false;
            if (this.target_list.length == 0) {
              this.datanotfound = true
            } else {
              this.datanotfound = false
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
            this.toast.errorToastr(this.decryptedData['statusMsg']);
          }
        }));
      }
  }
  exp_data: any = [];
  excel_data: any = [];

  exportAsXLSX(): void {
    this.encryptedData = this.service.payLoad ? { 'search': this.value }: this.cryptoService.encryptData({ 'search': this.value });
    this.service.FileData(this.encryptedData, "Excel/employee_primary_sale_target_list_for_export").subscribe(result => {
      this.decryptedData = this.service.payLoad ? result : this.cryptoService.decryptData(JSON.stringify(result));
      if (this.decryptedData['msg'] == true) {
        window.open(this.downurl + this.decryptedData['filename'])
        this.get_user_data();
      } else {
      }

    })


  }
  exportAsXLSX1(): void {
    this.encryptedData = this.service.payLoad ? { 'search': this.value }: this.cryptoService.encryptData({ 'search': this.value });
    this.service.FileData(this.encryptedData, "Excel/user_visit_target_list").subscribe(result => {
      this.decryptedData = this.service.payLoad ? result : this.cryptoService.decryptData(JSON.stringify(result));
      if (this.decryptedData['msg'] == true) {
        window.open(this.downurl + this.decryptedData['filename'])
        this.get_user_data();
      } else {
      }

    })


  }
  
  exportAsXLSX2(): void {
    this.encryptedData = this.service.payLoad ? { 'search': this.value }: this.cryptoService.encryptData({ 'search': this.value });
    this.service.FileData(this.encryptedData, "Excel/employee_secondary_sale_target_list_for_export").subscribe(result => {
      this.decryptedData = this.service.payLoad ? result : this.cryptoService.decryptData(JSON.stringify(result));
      if (this.decryptedData['msg'] == true) {
        window.open(this.downurl + this.decryptedData['filename'])
        this.get_user_data();
      } else {
      }

    })

  }


  openDialog(id,target): void {  
    const dialogRef = this.alrt.open(StatusModalComponent, {
      width: '600px',
      panelClass:'cs-modal',
      data:{
        from:'secondarySaleTarget',
        id: id,
        target:target,
      }
      
    });
    
    dialogRef.afterClosed().subscribe(result => {
        this.get_user_data()
});
}


  modal_type:any='';
  upload_excel(sub_active_tab) {
    if (sub_active_tab == 'primary') {
      this.modal_type = 'Direct Primary Target';
    } else if (sub_active_tab == 'secondary') {
      this.modal_type = 'Direct Secondary Target';
    }
    const dialogRef = this.alrt.open(ChunksUploaderComponent, {
      width: '500px',
      panelClass: 'cs-modal',
      data: {
        'For': this.modal_type,
        'customer_type': sub_active_tab,
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result != false) {
        this.get_user_data()
      }
    });
  }

  visit_upload_excel(type) {
    const dialogRef = this.alrt.open(ChunksUploaderComponent, {
      width: '500px',
      panelClass: 'cs-modal',
      data: {
        'For': 'User Visit Target',
        'modal_type': type

      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result != false) {
        this.get_user_data()
      }
    });
  }

  // upload_excel1()
  // {
  //   const dialogRef = this.alrt.open(UploadFileModalComponent,{
  //     width: '500px',
  //     panelClass:'cs-modal',
  //     data:{
  //       'from':'user_visit_target',
  //     }
  //   });
  //   dialogRef.afterClosed().subscribe(result => {
  //     this.get_user_data()
  //   });
  // }
  // upload_excel2()
  // {
  //   const dialogRef = this.alrt.open(UploadFileModalComponent,{
  //     width: '500px',
  //     panelClass:'cs-modal',
  //     data:{
  //       'from':'secondary_target',
  //     }
  //   });
  //   dialogRef.afterClosed().subscribe(result => {
  //     this.get_user_data();

  //   });
  // }

  RoundOffNumber(achieve) {
    return Math.ceil(achieve);
  }

  delete(active_tab, id) {
    let func='';
    if(active_tab=='Secondary_Sale'){
      func='Target/deleteSecondaryTarget'
    }else{
      func='Target/deleteVisitTarget'
    }
    this.dialog.delete("Orders ?").then((result) => {
      if (result) {
        this.service.post_rqst({ "id": id,'active_tab':active_tab,'sub_active_tab':this.sub_active_tab}, func).subscribe((result => {
          if (result['statusCode'] == 200) {
            this.toast.successToastr(result['statusMsg']);
            this.get_user_data();
          }
          else {
            this.toast.errorToastr(result['statusMsg']);
          }
        }));
      }
    })
  }


  downloadInChunks(activeTab) {
    console.log(activeTab);
    this.service.post_rqst({ 'search': this.value, 'start': this.start, 'pagelimit': this.page_limit }, "DownloadMaster/createQueueRequest").subscribe((result) => {
      if(result['statusCode'] == 200){
          if(result['code']== 0){
            this.toast.errorToastr(result['statusMsg']);
            return;
          }

          if(result['code']== 1 ){
            this.downloadExcel2(activeTab);
          }
      }
    }, err => {
      this.excelLoader = false;
    });
  }

  downloader: any = false;
  download_percent: any;
  excelLoader: boolean = false;
  totalCount: any;
  remainingCount: any;
  downloadExcel2(activeTab) {
    let can
    this.progressService.getCancelReq().subscribe(cancelReq => {
      can = cancelReq
    })
    if (can == false) {
      this.downloader = true;
      if (this.download_percent == null) {
        this.download_percent = 0;
      }
      let header
      if(activeTab == 'Visit'){
        header = "DownloadMaster/user_visit_target_list"
      }
      if(activeTab == 'Sale'){
        header = "DownloadMaster/employee_primary_sale_target_list_for_export"
      }
      if(activeTab == 'Secondary_Sale'){
        header = "DownloadMaster/employee_secondary_sale_target_list_for_export"
      }
      this.service.post_rqst({ 'search': this.value, 'start': this.start, 'pagelimit': this.page_limit },header).subscribe((result) => {
        
        if (result['code'] === 1) {
          this.downloader = false;
          this.download_percent = null;
          window.open(this.downurl + result['filename']);
          this.progressService.setTotalCount(0);
          this.progressService.setRemainingCount(0);
          this.progressService.setDownloadProgress(0);
          this.progressService.setDownloaderActive(false);
          this.get_user_data();
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
          this.downloadExcel2(activeTab);
        }
      }, err => {
        this.excelLoader = false;

      });
    }
  }

}
