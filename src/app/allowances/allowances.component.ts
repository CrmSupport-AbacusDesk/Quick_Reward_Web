import { Component, OnInit } from '@angular/core';
import { DatabaseService } from 'src/_services/DatabaseService';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common'
import { sessionStorage } from '../localstorage.service';
import { DialogComponent } from '../dialog.component';
import { ToastrManager } from 'ng6-toastr-notifications';
import { StatusModalComponent } from '../order/status-modal/status-modal.component';
import { MatDialog } from '@angular/material';
import { CryptoService } from 'src/_services/CryptoService';



@Component({
  selector: 'app-allowances',
  templateUrl: './allowances.component.html',
  styleUrls: ['./allowances.component.scss']
})
export class AllowancesComponent implements OnInit {
  designation: any = {};
  userRoleData: any = [];
  allowanceData: any = [];
  loader: any;
  skLoading: boolean = false;
  logined_user_data2: any;
  assign_login_data: any;
  downurl: any = '';
  logined_user_data: any;
  fixedAllowance: any = '';
  pagenumber: any = 1;
  total_page: any;
  start: any = 0;
  page_limit: any = 10;
  pageCount: any;
  sr_no: any = 0;



  constructor(public service: DatabaseService, public cryptoService: CryptoService, public toast: ToastrManager, public navparams: ActivatedRoute, public dialog2: MatDialog, public dialog: DialogComponent, public location: Location, public session: sessionStorage) {
    this.assign_login_data = this.session.getSession();
    this.logined_user_data = this.assign_login_data.value;
    this.logined_user_data2 = this.logined_user_data.data;
    this.downurl = service.downloadUrl
    this.get_designation();
    this.get_allowance();
  }

  ngOnInit() {
  }

  //   if(result['all_sales_user']['statusCode'] ==  200){
  //     this.report_manager = result['all_sales_user']['all_sales_user'];
  //   }
  //   else{
  //     this.toast.errorToastr(result['all_sales_user']['statusMsg'])
  //   }
  // }));
  get_designation() {
    this.service.post_rqst({ 'designation': this.designation }, "Master/getSalesUserForReporting").subscribe((result => {
      if (result['statusCode'] == 200) {
        this.userRoleData = result['all_sales_user'];
        this.get_allowance();
      }
      else {
        this.toast.errorToastr(result['statusMsg'])
      }
    }));


  }

  get_allowance() {
    this.loader = 1;
    if (this.pagenumber > this.total_page) {
      this.pagenumber = this.total_page;
      this.start = this.pageCount - this.page_limit;
    }
    if (this.start < 0) {
      this.start = 0;
    }
    this.service.post_rqst({ 'designation': this.designation, 'start': this.start, 'pagelimit': this.page_limit }, "Master/getAllowanceData").subscribe((result => {
      if (result['statusCode'] == 200) {
        this.allowanceData = result['result'];
        this.pageCount = result['count'];
        this.fixedAllowance = this.allowanceData[0].fixedAllowance;
        for (var i = 0; i < this.userRoleData.length; i++) {
          for (var j = 0; j < this.allowanceData.length; j++) {
            if (this.userRoleData[i]['id'] == this.allowanceData[j]['userId']) {
              this.userRoleData[i]['id'] = this.allowanceData[j]['userId']
              this.userRoleData[i]['name'] = this.allowanceData[j]['name']
              this.userRoleData[i]['flight'] = this.allowanceData[j]['flight'];
              this.userRoleData[i]['train'] = this.allowanceData[j]['train'];
              this.userRoleData[i]['bus'] = this.allowanceData[j]['bus'];
              this.userRoleData[i]['tolltax'] = this.allowanceData[j]['tolltax'];
              this.userRoleData[i]['other'] = this.allowanceData[j]['other'];
              this.userRoleData[i]['auto'] = this.allowanceData[j]['auto'];
              this.userRoleData[i]['taxi'] = this.allowanceData[j]['taxi'];
              this.userRoleData[i]['car'] = this.allowanceData[j]['car'];
              this.userRoleData[i]['bike'] = this.allowanceData[j]['bike'];
              this.userRoleData[i]['metro'] = this.allowanceData[j]['metro'];
              this.userRoleData[i]['public_transport_limit'] = this.allowanceData[j]['public_transport_limit'];
              this.userRoleData[i]['hotel'] = this.allowanceData[j]['hotel'];
              this.userRoleData[i]['food'] = this.allowanceData[j]['food'];
            }
          }
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
        setTimeout(() => {
          this.loader = '';
        }, 5000);
      }
      else {
        this.toast.errorToastr(result['statusMsg']);
      }

    }));
  }
  refresh() {
    this.start=0;
    this.designation = {};
    this.get_allowance();

  }
  updateAllowance() {
    for (var i = 0; i < this.userRoleData.length; i++) {
      for (var j = 0; j < this.allowanceData.length; j++) {
        if (this.userRoleData[i]['id'] == this.allowanceData[j]['userId']) {
          this.userRoleData[i]['id'] = this.allowanceData[j]['userId']
          this.userRoleData[i]['flight'] = this.allowanceData[j]['flight'];
          this.userRoleData[i]['train'] = this.allowanceData[j]['train'];
          this.userRoleData[i]['bus'] = this.allowanceData[j]['bus'];
          this.userRoleData[i]['name'] = this.allowanceData[j]['name']
          this.userRoleData[i]['tolltax'] = this.allowanceData[j]['tolltax'];
          this.userRoleData[i]['other'] = this.allowanceData[j]['other'];
          this.userRoleData[i]['auto'] = this.allowanceData[j]['auto'];
          this.userRoleData[i]['taxi'] = this.allowanceData[j]['taxi'];
          this.userRoleData[i]['car'] = this.allowanceData[j]['car'];
          this.userRoleData[i]['bike'] = this.allowanceData[j]['bike'];
          this.userRoleData[i]['metro'] = this.allowanceData[j]['metro'];
          this.userRoleData[i]['public_transport_limit'] = this.allowanceData[j]['public_transport_limit'];
          this.userRoleData[i]['hotel'] = this.allowanceData[j]['hotel'];
          this.userRoleData[i]['food'] = this.allowanceData[j]['food'];
        }
      }
    }
    this.skLoading = true;
    this.dialog.confirm("Update Allowance !").then((result) => {
      if (result) {
        this.service.post_rqst({ 'data': this.userRoleData }, "Master/updateAllowance").subscribe((result) => {
          if (result['statusCode'] == 200) {
            this.toast.successToastr(result['statusMsg']);
            this.skLoading = false;
            this.get_allowance();
          }
          else {
            this.skLoading = false;
            this.toast.errorToastr(result['statusMsg']);
          }
        }, err => {
          this.skLoading = false;
        });
      } else {
        this.skLoading = false;
      }
    })
  }

  getAlllowanceExcel() {
    this.loader = true;
    this.service.post_rqst({ 'designation': this.designation }, "Excel/allownceCsv").subscribe((result) => {
      if (result['msg'] == true) {
        window.open(this.downurl + result['filename'])
        this.get_allowance();
      }
    });
  }

  openDialog(): void {
    const dialogRef = this.dialog2.open(StatusModalComponent, {
      width: '400px',
      panelClass: 'cs-model',
      data: {
        delivery_from: 'fixed_allowance_amount',
        fixedAllowance: this.fixedAllowance
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result != false) {
        this.get_allowance();
      }
    });
  }


  pervious() {
    if (this.start > 0) {
      this.start -= this.page_limit;
      this.pagenumber = Math.ceil(this.start / this.page_limit) + 1; // Update current page number

      this.get_allowance();
    }
  }

  nextPage() {
    if (this.pagenumber < this.total_page) {
      this.start += this.page_limit;
      this.pagenumber = Math.ceil(this.start / this.page_limit) + 1; // Update current page number

      this.get_allowance();
    }
  }

}
