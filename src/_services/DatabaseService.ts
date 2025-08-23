import { Injectable, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Location } from '@angular/common';
import { retry, catchError, retryWhen, delay, scan, take, map } from 'rxjs/operators';
import { Router, ActivatedRoute } from '@angular/router';
import { DialogComponent } from 'src/app/dialog.component';
import { Observable, timer } from 'rxjs';
import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';
import { componentRefresh } from '@angular/core/src/render3/instructions';
import { DatePikerFormat } from 'src/_Pipes/DatePikerFormat.pipe';
import { ErrorService } from './error.service';
import { Crypto } from 'src/_Pipes/Crypto.pipe';
import { CryptoService } from './CryptoService';
import { ProgressService } from 'src/app/progress.service';
import { ToastrManager } from 'ng6-toastr-notifications';

const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
const EXCEL_EXTENSION = '.xlsx';

@Injectable({ providedIn: 'root' })
export class DatabaseService implements OnInit {
  page_limit: any;
  PostRequest(arg0: { filter: any; }, arg1: string) {
    throw new Error('Method not implemented.');
  }


  // / build command:-  npm run ng-high-memory//
  // <------------------ Dev Link ------------------------------>
  dbUrl = "https://dev.basiq360.com/quickreward/api/index.php/";
  uploadUrl = "https://dev.basiq360.com/quickreward/api/uploads/";
  downloadUrl = "https://dev.basiq360.com/quickreward/api/uploads/Download_excel/";
  attachmentUrl = "https://dev.basiq360.com/quickreward/api/uploads/Attachment/";
  producation: boolean = false;





  devlopmentMode: boolean = true;
  payLoad: boolean = true;
  header: any = new HttpHeaders();
  data: any;
  myProduct: any = {};
  peraluser: any = {};
  tmp;
  detail: any = {};
  counterArray: any = {};
  drArray: any = [];
  orgUerArray: any = [];
  InfluenceArray: any = [];
  leadArray: any = [];
  counterArray1: any = {};
  st_user: any
  orderFilterPrimary: any = {}
  orderFilterSecondary: any = {}
  dealerListSearch: any = {}
  directDealerListSearch: any = {}
  distributorListSearch: any = {}
  login_data: any = {};
  filteredData: any = {}
  start: any = 0;
  datauser: any = {};
  loading: any;
  customer_name: any;
  franchise_name: any;
  franchise_id;
  franchise_location;
  challans: any = [];
  currentUserID: any;
  pageLimit = 50;
  resetTime: number
  tabData: any = {}
  activeAcc: any = {}



  constructor(public http: HttpClient, private toastr: ToastrManager, public cryptoService: CryptoService, private _errService: ErrorService, public location: Location, public dialog: DialogComponent, private router: Router, public route: ActivatedRoute, private progressService: ProgressService) {
    this.resetTime = 21600000;
    this.st_user = JSON.parse(localStorage.getItem('st_user')) || [];

  }

  ngOnInit() {
  }



  setTabData(data) {
    this.tabData = data;
  }
  getTabData() {
    return this.tabData;
  }

  setData(data) {
    this.filteredData = data;
  }
  setStart(data) {
    this.start = data;
  }
  getStart() {
    return this.start
  }

  getData() {
    return this.filteredData;
  }

  // **Login fetch data start** ///

  auth_rqust(data: any, fn: any) {
    this.header.append('Content-Type', 'application/json');
    return this.http.post(this.dbUrl + fn, data, { headers: this.header })
  }




  pickerFormat(val, format: any = 'Y-M-D') {
    if (val) return new DatePikerFormat().transform(val, format);
  }
  fetchData(data: any, fn: any) {
    this.header.append('Content-Type', 'application/json');
    return this.http.post(this.dbUrl + fn, JSON.stringify(data), { headers: this.header })
  }
  can_active: any = "";
  LogInCheck(username, password) {
    this.data = { username, password };
    return this.http.post(this.dbUrl + "/login/submitnew/", JSON.stringify(this.data), { headers: this.header });
  }

  public exportAsExcelFile(json: any[], excelFileName: string): void {
    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(json);
    const workbook: XLSX.WorkBook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
    const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    this.saveAsExcelFile(excelBuffer, excelFileName);
  }
  private saveAsExcelFile(buffer: any, fileName: string): void {
    const data: Blob = new Blob([buffer], {
      type: EXCEL_TYPE
    });
    FileSaver.saveAs(data, fileName + EXCEL_EXTENSION);
  }


  upload_image(val, fn_name) {
    return this.http.post(this.dbUrl + fn_name, val, { headers: this.header });

  }
  FileData(request_data: any, fn: any) {

    this.header.append('Content-Type', undefined);
    let headers;
    headers = this.header.set('Authorization', 'Bearer ' + this.st_user.token);
    // this.cryptoService.encryptData(request_data)

    // request_data

    return this.http.post(this.dbUrl + fn, request_data, { headers: headers })
      .pipe(
        map((result: any) => {
          // const decryptedData = this.devlopmentMode ? result : this.cryptoService.decryptData(JSON.stringify(result));
          return result;
        })
      );

    // return this.http.post(this.dbUrl + fn, request_data, { headers: headers });
  }









  goBack() {
    window.history.back();
  }
  crypto(val, mode: any = true) {
    if (val) return new Crypto().transform(val, mode);
    else return '';
  }

  numeric_Number(event: any) {
    const pattern = /[0-9\+\-\ ]/;
    let inputChar = String.fromCharCode(event.charCode);
    if (event.keyCode != 8 && !pattern.test(inputChar)) {
      event.preventDefault();
    }
  }


  count_list() {
    this.sessionTimer();
    this.st_user = JSON.parse(localStorage.getItem('st_user')) || [];
    if (this.st_user.data) {
      this.login_data = this.st_user.data
      this.post_rqst({}, "Left_Navigation/left_navigation_counter").subscribe(result => {
        result
        if (result) {
          this.counterArray = result['data'];
        }
        else {
        }
      });
    }
    else {
      this.post_rqst({}, "Left_Navigation/left_navigation_counter").subscribe(result => {
        result
        if (result) {
          this.counterArray = result['data'];
        }
        else {
        }
      });
    }


  }

  influencer_netwrk() {
    this.sessionTimer();
    this.st_user = JSON.parse(localStorage.getItem('st_user')) || [];

    if (this.st_user.data) {
      this.login_data = this.st_user.data;
      this.post_rqst({ 'user_id': this.login_data.id, 'user_type': this.login_data.type }, "Influencer/influencerMasterList").subscribe(result => {

        if (result) {
          this.InfluenceArray = result['result'];
        }
        else {
        }

      });
    }
    else {
      this.post_rqst({ 'user_id': this.login_data.id, 'user_type': this.login_data.type }, "Influencer/influencerMasterList").subscribe(result => {

        if (result) {
          this.InfluenceArray = result['result'];
        }
        else {
        }
      });
    }
  }
  dr_list() {
    this.sessionTimer();
    this.st_user = JSON.parse(localStorage.getItem('st_user')) || [];
    if (this.st_user.data) {
      this.login_data = this.st_user.data;
      this.post_rqst({ 'user_id': this.login_data.id, 'user_type': this.login_data.type }, "CustomerNetwork/distributionNetworkModule").subscribe(result => {
        if (result) {
          this.drArray = result['modules'];
        }
      });
    }
    else {
      this.post_rqst({ 'user_id': this.login_data.id, 'user_type': this.login_data.type }, "CustomerNetwork/distributionNetworkModule").subscribe(result => {
        if (result) {
          this.drArray = result['modules'];
        }
      });
    }
  }




  orgUserType() {
    this.sessionTimer();
    this.st_user = JSON.parse(localStorage.getItem('st_user')) || [];
    if (this.st_user.data) {
      this.login_data = this.st_user.data;
      this.post_rqst('', "Master/fetchUserTypeAsPerOrg").subscribe(result => {
        result
        if (result) {
          this.orgUerArray = result['data']['user_type'];
        }
      });
    }
  }

  async sessionCheck() {
    const fetchUrl = await fetch(this.dbUrl + "Login/sessionCheck", {
      headers: { Authorization: 'Bearer ' + this.st_user.token }
    })
    // console.log(fetchUrl);

    // const resp = await fetchUrl.json();
    // console.log(resp);

    // const data = this.cryptoService.decryptData(JSON.stringify(resp))
    // if (data['statusCode'] != 200) {
    //   localStorage.removeItem('st_user');
    //   this.datauser = {};
    //   this.router.navigate(['']);
    //   this.toastr.dismissAllToastr();
    //   // this.toastr.errorToastr("Session Expired");

    // } else if (data['statusCode'] == 200) {

    //   if (data['data']['id'] != '1' && data['data']['user_type'] != 'DMS') {
    //     for (let i = 0; i < data['assignModule'].length; i++) {
    //       if ((data['assignModule'][i]['module_name'] == 'Enquiry' && data['assignModule'][i]['view'] == '1')) {
    //         data['data']['view_enquiry'] = 1;
    //         if (data['assignModule'][i]['edit'] == '1') {
    //           data['data']['edit_enquiry'] = 1
    //         }
    //         if (data['assignModule'][i]['add'] == '1') {
    //           data['data']['add_enquiry'] = 1;
    //         }
    //         if (data['assignModule'][i]['export'] == '1') {
    //           data['data']['export_enquiry'] = 1;
    //         }
    //         if (data['assignModule'][i]['import'] == '1') {
    //           data['data']['import_enquiry'] = 1;
    //         }
    //       }
    //       else if (data['assignModule'][i]['module_name'] == 'Sfa Dashboard' && data['assignModule'][i]['view'] == '1') {
    //         data['data']['view_sfa_dashboard'] = 1
    //       }
    //       else if (data['assignModule'][i]['module_name'] == 'Dms Dashboard' && data['assignModule'][i]['view'] == '1') {
    //         data['data']['view_dms_dashboard'] = 1
    //       }
    //       else if (data['assignModule'][i]['module_name'] == 'Loyalty Dashboard' && data['assignModule'][i]['view'] == '1') {
    //         data['data']['view_loyalty_dashboard'] = 1
    //       }
    //       else if (data['assignModule'][i]['module_name'] == 'Service Dashboard' && data['assignModule'][i]['view'] == '1') {
    //         data['data']['view_service__dashboard'] = 1
    //       }
    //       else if (data['assignModule'][i]['module_name'] == 'Dispatch Dashboard' && data['assignModule'][i]['view'] == '1') {
    //         data['data']['view_dispatch_dashboard'] = 1
    //       }
    //       else if (data['assignModule'][i]['module_name'] == 'Enquiry' && data['assignModule'][i]['view'] == '1') {
    //         data['data']['view_enquiry'] = 1
    //       }
    //       else if (data['assignModule'][i]['module_name'] == 'Influencer Network' && data['assignModule'][i]['view'] == '1') {
    //         data['data']['view_influencer_network'] = 1
    //         if (data['assignModule'][i]['add'] == '1') {
    //           data['data']['add_influencer'] = 1;
    //         }
    //         if (data['assignModule'][i]['export'] == '1') {
    //           data['data']['export_influencer'] = 1;
    //         }
    //         if (data['assignModule'][i]['edit'] == '1') {
    //           data['data']['edit_influencer'] = 1;
    //         }
    //         if (data['assignModule'][i]['delete'] == '1') {
    //           data['data']['delete_influencer'] = 1;
    //         }
    //       }
    //       else if (data['assignModule'][i]['module_name'] == 'Customer Network' && data['assignModule'][i]['view'] == '1') {
    //         data['data']['view_customer_network'] = 1
    //         if (data['assignModule'][i]['add'] == '1') {
    //           data['data']['add_customer_network'] = 1;
    //         }
    //         if (data['assignModule'][i]['import'] == '1') {
    //           data['data']['import_customer_network'] = 1;
    //         }
    //         if (data['assignModule'][i]['export'] == '1') {
    //           data['data']['export_customer_network'] = 1;
    //         }
    //         if (data['assignModule'][i]['edit'] == '1') {
    //           data['data']['edit_customer_network'] = 1;
    //         }

    //       }

    //       else if (data['assignModule'][i]['module_name'] == 'Channel Partner' && data['assignModule'][i]['view'] == '1') {
    //         data['data']['view_customer_network'] = 1
    //         data['data']['view_channel_partner'] = 1
    //         if (data['assignModule'][i]['add'] == '1') {
    //           data['data']['add_channel_partner'] = 1;
    //         }
    //         if (data['assignModule'][i]['import'] == '1') {
    //           data['data']['import_channel_partner'] = 1;
    //         }
    //         if (data['assignModule'][i]['export'] == '1') {
    //           data['data']['export_channel_partner'] = 1;
    //         }
    //         if (data['assignModule'][i]['edit'] == '1') {
    //           data['data']['edit_channel_partner'] = 1;
    //         }

    //       }

    //       else if (data['assignModule'][i]['module_name'] == 'Primary Network' && data['assignModule'][i]['view'] == '1') {
    //         data['data']['view_primary_network'] = 1
    //         if (data['assignModule'][i]['add'] == '1') {
    //           data['data']['add_primary_network'] = 1;
    //         }
    //         if (data['assignModule'][i]['import'] == '1') {
    //           data['data']['import_primary_network'] = 1;
    //         }
    //         if (data['assignModule'][i]['export'] == '1') {
    //           data['data']['export_primary_network'] = 1;
    //         }
    //         if (data['assignModule'][i]['edit'] == '1') {
    //           data['data']['edit_primary_network'] = 1;
    //         }

    //       }

    //       else if (data['assignModule'][i]['module_name'] == 'Secondary Network' && data['assignModule'][i]['view'] == '1') {
    //         data['data']['view_secondary_network'] = 1
    //         if (data['assignModule'][i]['add'] == '1') {
    //           data['data']['add_secondary_network'] = 1;
    //         }
    //         if (data['assignModule'][i]['import'] == '1') {
    //           data['data']['import_secondary_network'] = 1;
    //         }
    //         if (data['assignModule'][i]['export'] == '1') {
    //           data['data']['export_secondary_network'] = 1;
    //         }
    //         if (data['assignModule'][i]['edit'] == '1') {
    //           data['data']['edit_secondary_network'] = 1;
    //         }

    //       }

    //       else if (data['assignModule'][i]['module_name'] == 'Dealer' && data['assignModule'][i]['view'] == '1') {
    //         data['data']['view_customer_network'] = 1
    //         data['data']['view_dealer'] = 1
    //         if (data['assignModule'][i]['add'] == '1') {
    //           data['data']['add_dealer'] = 1;
    //         }
    //         if (data['assignModule'][i]['import'] == '1') {
    //           data['data']['import_dealer'] = 1;
    //         }
    //         if (data['assignModule'][i]['export'] == '1') {
    //           data['data']['export_dealer'] = 1;
    //         }
    //         if (data['assignModule'][i]['edit'] == '1') {
    //           data['data']['edit_dealer'] = 1;
    //         }
    //       }

    //       else if (data['assignModule'][i]['module_name'] == 'Direct Dealers' && data['assignModule'][i]['view'] == '1') {
    //         data['data']['view_customer_network'] = 1
    //         data['data']['view_direct_dealers'] = 1
    //         if (data['assignModule'][i]['add'] == '1') {
    //           data['data']['add_direct_dealers'] = 1;
    //         }
    //         if (data['assignModule'][i]['import'] == '1') {
    //           data['data']['import_direct_dealers'] = 1;
    //         }
    //         if (data['assignModule'][i]['export'] == '1') {
    //           data['data']['export_direct_dealers'] = 1;
    //         }
    //         if (data['assignModule'][i]['edit'] == '1') {
    //           data['data']['edit_direct_dealers'] = 1;
    //         }
    //       }

    //       else if (data['assignModule'][i]['module_name'] == 'Primary Orders' && data['assignModule'][i]['view'] == '1') {
    //         data['data']['view_orders'] = 1
    //         data['data']['view_primary_orders'] = 1

    //         if (data['assignModule'][i]['add'] == '1') {
    //           data['data']['add_primary_order'] = 1;
    //         }
    //         if (data['assignModule'][i]['export'] == '1') {
    //           data['data']['export_primary_order'] = 1;
    //         }
    //         if (data['assignModule'][i]['edit'] == '1') {
    //           data['data']['edit_primary_order'] = 1;
    //         }
    //         if (data['assignModule'][i]['delete'] == '1') {
    //           data['data']['delete_primary_order'] = 1;
    //         }
    //       }

    //       else if (data['assignModule'][i]['module_name'] == 'Secondary Orders' && data['assignModule'][i]['view'] == '1') {
    //         data['data']['view_orders'] = 1
    //         data['data']['view_secondary_orders'] = 1

    //         if (data['assignModule'][i]['add'] == '1') {
    //           data['data']['add_secondary_orders'] = 1;
    //         }
    //         if (data['assignModule'][i]['export'] == '1') {
    //           data['data']['export_secondary_orders'] = 1;
    //         }
    //         if (data['assignModule'][i]['edit'] == '1') {
    //           data['data']['edit_secondary_orders'] = 1;
    //         }
    //         if (data['assignModule'][i]['delete'] == '1') {
    //           data['data']['delete_secondary_orders'] = 1;
    //         }
    //       }
    //       else if (data['assignModule'][i]['module_name'] == 'DMS Invoice' && data['assignModule'][i]['view'] == '1') {
    //         data['data']['view_accounts'] = 1
    //         data['data']['view_dms_invoice'] = 1

    //         if (data['assignModule'][i]['import'] == '1') {
    //           data['data']['import_invoice'] = 1;
    //         }
    //         if (data['assignModule'][i]['export'] == '1') {
    //           data['data']['export_invoice'] = 1;
    //         }
    //       }
    //       else if (data['assignModule'][i]['module_name'] == 'DMS Ledger' && data['assignModule'][i]['view'] == '1') {
    //         data['data']['view_accounts'] = 1
    //         data['data']['view_ledger'] = 1

    //         if (data['assignModule'][i]['import'] == '1') {
    //           data['data']['import_ledger'] = 1;
    //         }
    //         if (data['assignModule'][i]['export'] == '1') {
    //           data['data']['export_ledger'] = 1;
    //         }
    //       }
    //       else if (data['assignModule'][i]['module_name'] == 'DMS Pending Bills' && data['assignModule'][i]['view'] == '1') {
    //         data['data']['view_accounts'] = 1
    //         data['data']['view_bill'] = 1

    //         if (data['assignModule'][i]['import'] == '1') {
    //           data['data']['import_bill'] = 1;
    //         }
    //         if (data['assignModule'][i]['export'] == '1') {
    //           data['data']['export_bill'] = 1;
    //         }
    //       }
    //       else if (data['assignModule'][i]['module_name'] == 'Attendance' && data['assignModule'][i]['view'] == '1') {
    //         data['data']['view_attendence'] = 1
    //         if (data['assignModule'][i]['export'] == '1') {
    //           data['data']['export_attendence'] = 1
    //         }
    //         if (data['assignModule'][i]['edit'] == '1') {
    //           data['data']['edit_attendence'] = 1
    //         }
    //       }
    //       else if (data['assignModule'][i]['module_name'] == 'Check In' && data['assignModule'][i]['view'] == '1') {
    //         data['data']['view_check_in'] = 1;
    //         if (data['assignModule'][i]['export'] == '1') {
    //           data['data']['export_checkin'] = 1
    //         }
    //       }
    //       else if (data['assignModule'][i]['module_name'] == 'Leave' && data['assignModule'][i]['view'] == '1') {
    //         data['data']['view_leaves'] = 1
    //         if (data['assignModule'][i]['export'] == '1') {
    //           data['data']['export_leaves'] = 1
    //         }
    //         if (data['assignModule'][i]['edit'] == '1') {
    //           data['data']['edit_leaves'] = 1
    //         }
    //       }
    //       else if (data['assignModule'][i]['module_name'] == 'Travel Plan' && data['assignModule'][i]['view'] == '1') {
    //         data['data']['view_travel_plan'] = 1
    //         if (data['assignModule'][i]['edit'] == '1') {
    //           data['data']['edit_travel_list'] = 1
    //         }
    //         if (data['assignModule'][i]['add'] == '1') {
    //           data['data']['add_travel_list'] = 1
    //         }
    //         if (data['assignModule'][i]['export'] == '1') {
    //           data['data']['export_travel_list'] = 1
    //         }
    //         if (data['assignModule'][i]['delete'] == '1') {
    //           data['data']['delete_travel_list'] = 1
    //         }
    //         if (data['assignModule'][i]['import'] == '1') {
    //           data['data']['import_travel_list'] = 1
    //         }
    //       }
    //       else if (data['assignModule'][i]['module_name'] == 'Followup' && data['assignModule'][i]['view'] == '1') {
    //         data['data']['view_follow_up'] = 1
    //         if (data['assignModule'][i]['export'] == '1') {
    //           data['data']['export_follow_up'] = 1
    //         }
    //         if (data['assignModule'][i]['delete'] == '1') {
    //           data['data']['delete_follow_up'] = 1
    //         }
    //         if (data['assignModule'][i]['add'] == '1') {
    //           data['data']['add_follow_up'] = 1
    //         }
    //       }
    //       else if (data['assignModule'][i]['module_name'] == 'Announcement' && data['assignModule'][i]['view'] == '1') {
    //         data['data']['view_announcement'] = 1
    //         if (data['assignModule'][i]['add'] == '1') {
    //           data['data']['add_announcement'] = 1
    //         }
    //       }
    //       else if (data['assignModule'][i]['module_name'] == 'Expense' && data['assignModule'][i]['view'] == '1') {
    //         data['data']['view_expense'] = 1
    //         if (data['assignModule'][i]['export'] == '1') {
    //           data['data']['export_expense'] = 1
    //         }
    //         if (data['assignModule'][i]['edit'] == '1') {
    //           data['data']['edit_expense'] = 1
    //         }
    //         if (data['assignModule'][i]['add'] == '1') {
    //           data['data']['add_expense'] = 1
    //         }
    //       }
    //       else if (data['assignModule'][i]['module_name'] == 'Event Plan' && data['assignModule'][i]['view'] == '1') {
    //         data['data']['view_event_plan'] = 1
    //         if (data['assignModule'][i]['edit'] == '1') {
    //           data['data']['edit_event_plan'] = 1
    //         }
    //         if (data['assignModule'][i]['add'] == '1') {
    //           data['data']['add_event_plan'] = 1
    //         }
    //       }

    //       else if (data['assignModule'][i]['module_name'] == 'Pop & Gift' && data['assignModule'][i]['view'] == '1') {
    //         data['data']['view_pop_gift'] = 1
    //         if (data['assignModule'][i]['edit'] == '1') {
    //           data['data']['edit_pop_gift'] = 1
    //         }
    //         if (data['assignModule'][i]['delete'] == '1') {
    //           data['data']['delete_pop_gift'] = 1
    //         }
    //         if (data['assignModule'][i]['export'] == '1') {
    //           data['data']['export_pop_gift'] = 1
    //         }
    //         if (data['assignModule'][i]['add'] == '1') {
    //           data['data']['add_pop_gift'] = 1
    //         }

    //       }
    //       else if (data['assignModule'][i]['module_name'] == 'Survey' && data['assignModule'][i]['view'] == '1') {
    //         data['data']['view_survey'] = 1

    //         if (data['assignModule'][i]['export'] == '1') {
    //           data['data']['export_survey'] = 1
    //         }
    //         if (data['assignModule'][i]['add'] == '1') {
    //           data['data']['add_survey'] = 1
    //         }
    //         if (data['assignModule'][i]['edit'] == '1') {
    //           data['data']['edit_survey'] = 1
    //         }
    //       }
    //       else if (data['assignModule'][i]['module_name'] == 'Gift Gallery' && data['assignModule'][i]['view'] == '1') {
    //         data['data']['view_gift'] = 1
    //         if (data['assignModule'][i]['export'] == '1') {
    //           data['data']['export_gift_gallery'] = 1
    //         }
    //         if (data['assignModule'][i]['add'] == '1') {
    //           data['data']['add_gift_gallery'] = 1
    //         }
    //         if (data['assignModule'][i]['edit'] == '1') {
    //           data['data']['edit_gift_gallery'] = 1
    //         }
    //       }
    //       else if (data['assignModule'][i]['module_name'] == 'Bonus Point' && data['assignModule'][i]['view'] == '1') {
    //         data['data']['view_bonus_points'] = 1
    //         if (data['assignModule'][i]['export'] == '1') {
    //           data['data']['export_bonus_points'] = 1
    //         }
    //         if (data['assignModule'][i]['add'] == '1') {
    //           data['data']['add_bonus_points'] = 1
    //         }
    //         if (data['assignModule'][i]['edit'] == '1') {
    //           data['data']['edit_bonus_points'] = 1
    //         }
    //       }
    //       else if (data['assignModule'][i]['module_name'] == 'Qr Code') {

    //         if (data['assignModule'][i]['view'] == '1') {
    //           data['data']['view_coupon_code'] = 1
    //         }

    //         if (data['assignModule'][i]['export'] == '1') {
    //           data['data']['export_coupon_code'] = 1
    //         }
    //         if (data['assignModule'][i]['add'] == '1') {
    //           data['data']['add_coupon_code'] = 1
    //         }
    //         if (data['assignModule'][i]['delete'] == '1') {
    //           data['data']['delete_coupon_code'] = 1
    //         }
    //       }

    //       else if (data['assignModule'][i]['module_name'] == 'Purchase') {


    //         if (data['assignModule'][i]['view'] == '1') {
    //           data['data']['view_purchase'] = 1
    //         }

    //         if (data['assignModule'][i]['add'] == '1') {
    //           data['data']['add_purchase'] = 1
    //         }

    //         if (data['assignModule'][i]['export'] == '1') {
    //           data['data']['export_purchase'] = 1
    //         }
    //         if (data['assignModule'][i]['edit'] == '1') {
    //           data['data']['edit_purchase'] = 1
    //         }
    //       }

    //       else if (data['assignModule'][i]['module_name'] == 'Redeem Request' && data['assignModule'][i]['view'] == '1') {
    //         data['data']['view_redeem_request'] = 1
    //         if (data['assignModule'][i]['export'] == '1') {
    //           data['data']['export_redeem_request'] = 1
    //         }
    //         if (data['assignModule'][i]['edit'] == '1') {
    //           data['data']['edit_redeem_request'] = 1
    //         }
    //       }
    //       else if (data['assignModule'][i]['module_name'] == 'Target' && data['assignModule'][i]['view'] == '1') {
    //         data['data']['view_target'] = 1
    //         data['data']['view_employee_target'] = 1
    //         if (data['assignModule'][i]['add'] == '1') {
    //           data['data']['add_employee_target'] = 1
    //         }
    //         if (data['assignModule'][i]['edit'] == '1') {
    //           data['data']['edit_employee_target'] = 1
    //         }
    //         if (data['assignModule'][i]['export'] == '1') {
    //           data['data']['export_employee_target'] = 1
    //         }
    //         if (data['assignModule'][i]['delete'] == '1') {
    //           data['data']['delete_employee_target'] = 1
    //         }
    //         if (data['assignModule'][i]['import'] == '1') {
    //           data['data']['import_employee_target'] = 1
    //         }
    //       }
    //       else if (data['assignModule'][i]['module_name'] == 'Target' && data['assignModule'][i]['view'] == '1') {
    //         // else if (data['assignModule'][i]['module_name'] == 'Distributor Target' && data['assignModule'][i]['view'] == '1') {
    //         data['data']['view_target'] = 1
    //         data['data']['view_distributor_target'] = 1

    //         if (data['assignModule'][i]['add'] == '1') {
    //           data['data']['add_distributor_target'] = 1
    //         }
    //         if (data['assignModule'][i]['edit'] == '1') {
    //           data['data']['edit_distributor_target'] = 1
    //         }
    //         if (data['assignModule'][i]['export'] == '1') {
    //           data['data']['export_distributor_target'] = 1
    //         }
    //         if (data['assignModule'][i]['delete'] == '1') {
    //           data['data']['delete_distributor_target'] = 1
    //         }
    //         if (data['assignModule'][i]['import'] == '1') {
    //           data['data']['import_distributor_target'] = 1
    //         }
    //       }
    //       else if ((data['assignModule'][i]['module_name'] == 'Category') && data['assignModule'][i]['view'] == '1') {
    //         data['data']['view_master'] = 1
    //         data['data']['view_category'] = 1

    //         if (data['assignModule'][i]['add'] == '1') {
    //           data['data']['add_category_master'] = 1
    //         }
    //         if (data['assignModule'][i]['edit'] == '1') {
    //           data['data']['edit_category_master'] = 1
    //         }
    //         if (data['assignModule'][i]['export'] == '1') {
    //           data['data']['export_category_master'] = 1
    //         }
    //         if (data['assignModule'][i]['delete'] == '1') {
    //           data['data']['delete_category_master'] = 1
    //         }
    //         if (data['assignModule'][i]['import'] == '1') {
    //           data['data']['import_category_master'] = 1
    //         }
    //       }
    //       else if ((data['assignModule'][i]['module_name'] == 'Sub Category') && data['assignModule'][i]['view'] == '1') {
    //         data['data']['view_master'] = 1
    //         data['data']['view_sub_category'] = 1

    //         if (data['assignModule'][i]['add'] == '1') {
    //           data['data']['add_sub_category_master'] = 1
    //         }
    //         if (data['assignModule'][i]['edit'] == '1') {
    //           data['data']['edit_sub_category_master'] = 1
    //         }
    //         if (data['assignModule'][i]['export'] == '1') {
    //           data['data']['export_sub_category_master'] = 1
    //         }
    //         if (data['assignModule'][i]['delete'] == '1') {
    //           data['data']['delete_sub_category_master'] = 1
    //         }
    //         if (data['assignModule'][i]['import'] == '1') {
    //           data['data']['import_sub_category_master'] = 1
    //         }
    //       }
    //       else if ((data['assignModule'][i]['module_name'] == 'Products') && data['assignModule'][i]['view'] == '1') {
    //         data['data']['view_master'] = 1
    //         data['data']['view_products'] = 1

    //         if (data['assignModule'][i]['add'] == '1') {
    //           data['data']['add_products_master'] = 1
    //         }
    //         if (data['assignModule'][i]['edit'] == '1') {
    //           data['data']['edit_products_master'] = 1
    //         }
    //         if (data['assignModule'][i]['export'] == '1') {
    //           data['data']['export_products_master'] = 1
    //         }
    //         if (data['assignModule'][i]['delete'] == '1') {
    //           data['data']['delete_products_master'] = 1
    //         }
    //         if (data['assignModule'][i]['import'] == '1') {
    //           data['data']['import_products_master'] = 1
    //         }
    //       }
    //       else if ((data['assignModule'][i]['module_name'] == 'PDF') && data['assignModule'][i]['view'] == '1') {
    //         data['data']['view_master'] = 1
    //         data['data']['view_pdf'] = 1
    //         if (data['assignModule'][i]['add'] == '1') {
    //           data['data']['add_pdf_master'] = 1
    //         }
    //         if (data['assignModule'][i]['edit'] == '1') {
    //           data['data']['edit_pdf_master'] = 1
    //         }
    //         if (data['assignModule'][i]['export'] == '1') {
    //           data['data']['export_pdf_master'] = 1
    //         }
    //         if (data['assignModule'][i]['delete'] == '1') {
    //           data['data']['delete_pdf_master'] = 1
    //         }
    //         if (data['assignModule'][i]['import'] == '1') {
    //           data['data']['import_pdf_master'] = 1
    //         }
    //       }
    //       else if ((data['assignModule'][i]['module_name'] == 'Leave Master') && data['assignModule'][i]['view'] == '1') {
    //         data['data']['view_master'] = 1
    //         data['data']['view_leave_master'] = 1

    //         if (data['assignModule'][i]['add'] == '1') {
    //           data['data']['add_leave_master'] = 1
    //         }
    //         if (data['assignModule'][i]['edit'] == '1') {
    //           data['data']['edit_leave_master'] = 1
    //         }
    //         if (data['assignModule'][i]['export'] == '1') {
    //           data['data']['export_leave_master'] = 1
    //         }
    //         if (data['assignModule'][i]['delete'] == '1') {
    //           data['data']['delete_leave_master'] = 1
    //         }
    //         if (data['assignModule'][i]['import'] == '1') {
    //           data['data']['import_leave_master'] = 1
    //         }
    //       }
    //       else if ((data['assignModule'][i]['module_name'] == 'Users') && data['assignModule'][i]['view'] == '1') {
    //         data['data']['view_master'] = 1
    //         data['data']['view_users'] = 1
    //         if (data['assignModule'][i]['add'] == '1') {
    //           data['data']['add_users_master'] = 1
    //         }
    //         if (data['assignModule'][i]['edit'] == '1') {
    //           data['data']['edit_users_master'] = 1
    //         }
    //         if (data['assignModule'][i]['export'] == '1') {
    //           data['data']['export_users_master'] = 1
    //         }
    //         if (data['assignModule'][i]['delete'] == '1') {
    //           data['data']['delete_users_master'] = 1
    //         }
    //         if (data['assignModule'][i]['import'] == '1') {
    //           data['data']['import_users_master'] = 1
    //         }
    //       }
    //       else if ((data['assignModule'][i]['module_name'] == 'Designation') && data['assignModule'][i]['view'] == '1') {
    //         data['data']['view_master'] = 1
    //         data['data']['view_designation'] = 1
    //         if (data['assignModule'][i]['add'] == '1') {
    //           data['data']['add_users_designation'] = 1
    //         }
    //         if (data['assignModule'][i]['edit'] == '1') {
    //           data['data']['edit_users_designation'] = 1
    //         }
    //         if (data['assignModule'][i]['export'] == '1') {
    //           data['data']['export_users_designation'] = 1
    //         }
    //         if (data['assignModule'][i]['delete'] == '1') {
    //           data['data']['delete_users_designation'] = 1
    //         }
    //         if (data['assignModule'][i]['import'] == '1') {
    //           data['data']['import_users_designation'] = 1
    //         }
    //       }

    //       else if ((data['assignModule'][i]['module_name'] == 'Customer Category') && data['assignModule'][i]['view'] == '1') {
    //         data['data']['view_master'] = 1
    //         data['data']['view_customer_category'] = 1

    //         if (data['assignModule'][i]['add'] == '1') {
    //           data['data']['add_customer_master'] = 1
    //         }
    //         if (data['assignModule'][i]['edit'] == '1') {
    //           data['data']['edit_customer_master'] = 1
    //         }
    //         if (data['assignModule'][i]['export'] == '1') {
    //           data['data']['export_customer_master'] = 1
    //         }
    //         if (data['assignModule'][i]['delete'] == '1') {
    //           data['data']['delete_customer_master'] = 1
    //         }
    //         if (data['assignModule'][i]['import'] == '1') {
    //           data['data']['import_customer_master'] = 1
    //         }
    //       }
    //       else if ((data['assignModule'][i]['module_name'] == 'Influencer Category') && data['assignModule'][i]['view'] == '1') {
    //         data['data']['view_master'] = 1
    //         data['data']['view_infulencer_category'] = 1

    //         if (data['assignModule'][i]['add'] == '1') {
    //           data['data']['add_infulencer_master'] = 1
    //         }
    //         if (data['assignModule'][i]['edit'] == '1') {
    //           data['data']['edit_infulencer_master'] = 1
    //         }
    //         if (data['assignModule'][i]['export'] == '1') {
    //           data['data']['export_infulencer_master'] = 1
    //         }
    //         if (data['assignModule'][i]['delete'] == '1') {
    //           data['data']['delete_infulencer_master'] = 1
    //         }
    //         if (data['assignModule'][i]['import'] == '1') {
    //           data['data']['import_infulencer_master'] = 1
    //         }
    //       }
    //       else if ((data['assignModule'][i]['module_name'] == 'Point Category') && data['assignModule'][i]['view'] == '1') {
    //         data['data']['view_master'] = 1
    //         data['data']['view_point_category'] = 1


    //         if (data['assignModule'][i]['add'] == '1') {
    //           data['data']['add_point_master'] = 1
    //         }
    //         if (data['assignModule'][i]['edit'] == '1') {
    //           data['data']['edit_point_master'] = 1
    //         }
    //         if (data['assignModule'][i]['export'] == '1') {
    //           data['data']['export_point_master'] = 1
    //         }
    //         if (data['assignModule'][i]['delete'] == '1') {
    //           data['data']['delete_point_master'] = 1
    //         }
    //         if (data['assignModule'][i]['import'] == '1') {
    //           data['data']['import_point_master'] = 1
    //         }
    //       }
    //       else if ((data['assignModule'][i]['module_name'] == 'Holiday') && data['assignModule'][i]['view'] == '1') {
    //         data['data']['view_master'] = 1
    //         data['data']['view_holiday'] = 1
    //         if (data['assignModule'][i]['add'] == '1') {
    //           data['data']['add_holiday_master'] = 1
    //         }
    //         if (data['assignModule'][i]['edit'] == '1') {
    //           data['data']['edit_holiday_master'] = 1
    //         }
    //         if (data['assignModule'][i]['export'] == '1') {
    //           data['data']['export_holiday_master'] = 1
    //         }
    //         if (data['assignModule'][i]['delete'] == '1') {
    //           data['data']['delete_holiday_master'] = 1
    //         }
    //         if (data['assignModule'][i]['import'] == '1') {
    //           data['data']['import_holiday_master'] = 1
    //         }
    //       }
    //       else if ((data['assignModule'][i]['module_name'] == 'Gallery') && data['assignModule'][i]['view'] == '1') {
    //         data['data']['view_master'] = 1
    //         data['data']['view_gallery'] = 1
    //         if (data['assignModule'][i]['add'] == '1') {
    //           data['data']['add_gallery_master'] = 1
    //         }
    //         if (data['assignModule'][i]['edit'] == '1') {
    //           data['data']['edit_gallery_master'] = 1
    //         }
    //         if (data['assignModule'][i]['export'] == '1') {
    //           data['data']['export_gallery_master'] = 1
    //         }
    //         if (data['assignModule'][i]['delete'] == '1') {
    //           data['data']['delete_gallery_master'] = 1
    //         }
    //         if (data['assignModule'][i]['import'] == '1') {
    //           data['data']['import_gallery_master'] = 1
    //         }
    //       }
    //       else if ((data['assignModule'][i]['module_name'] == 'Referral Points Master') && data['assignModule'][i]['view'] == '1') {
    //         data['data']['view_master'] = 1
    //         data['data']['view_referral_point_master'] = 1

    //         if (data['assignModule'][i]['add'] == '1') {
    //           data['data']['add_referral_point_master'] = 1
    //         }
    //         if (data['assignModule'][i]['edit'] == '1') {
    //           data['data']['edit_referral_point_master'] = 1
    //         }
    //         if (data['assignModule'][i]['export'] == '1') {
    //           data['data']['export_referral_point_master'] = 1
    //         }
    //         if (data['assignModule'][i]['delete'] == '1') {
    //           data['data']['delete_referral_point_master'] = 1
    //         }
    //         if (data['assignModule'][i]['import'] == '1') {
    //           data['data']['import_referral_point_master'] = 1
    //         }
    //       }
    //       else if ((data['assignModule'][i]['module_name'] == 'Allowance Master') && data['assignModule'][i]['view'] == '1') {
    //         data['data']['view_master'] = 1
    //         data['data']['view_allowance_master'] = 1

    //         if (data['assignModule'][i]['add'] == '1') {
    //           data['data']['add_allowance_master'] = 1
    //         }
    //         if (data['assignModule'][i]['edit'] == '1') {
    //           data['data']['edit_allowance_master'] = 1
    //         }
    //         if (data['assignModule'][i]['export'] == '1') {
    //           data['data']['export_allowance_master'] = 1
    //         }
    //         if (data['assignModule'][i]['delete'] == '1') {
    //           data['data']['delete_allowance_master'] = 1
    //         }
    //         if (data['assignModule'][i]['import'] == '1') {
    //           data['data']['import_allowance_master'] = 1
    //         }
    //       }
    //       else if ((data['assignModule'][i]['module_name'] == 'Territory Code') && data['assignModule'][i]['view'] == '1') {
    //         data['data']['view_master'] = 1
    //         data['data']['view_territory_master'] = 1

    //         if (data['assignModule'][i]['add'] == '1') {
    //           data['data']['add_territory_master'] = 1
    //         }
    //         if (data['assignModule'][i]['edit'] == '1') {
    //           data['data']['edit_territory_master'] = 1
    //         }
    //         if (data['assignModule'][i]['export'] == '1') {
    //           data['data']['export_territory_master'] = 1
    //         }
    //         if (data['assignModule'][i]['delete'] == '1') {
    //           data['data']['delete_territory_master'] = 1
    //         }
    //         if (data['assignModule'][i]['import'] == '1') {
    //           data['data']['import_territory_master'] = 1
    //         }
    //       }
    //       else if (data['assignModule'][i]['module_name'] == 'Ticket' && data['assignModule'][i]['view'] == '1') {
    //         data['data']['view_support'] = 1
    //         if (data['assignModule'][i]['edit'] == '1') {
    //           data['data']['edit_support'] = 1
    //         }
    //         if (data['assignModule'][i]['export'] == '1') {
    //           data['data']['export_support'] = 1
    //         }
    //       }
    //       else if (data['assignModule'][i]['module_name'] == 'Task' && data['assignModule'][i]['view'] == '1') {
    //         data['data']['view_task'] = 1
    //         if (data['assignModule'][i]['add'] == '1') {
    //           data['data']['add_task'] = 1
    //         }
    //         if (data['assignModule'][i]['export'] == '1') {
    //           data['data']['export_task'] = 1
    //         }
    //       }
    //       else if (data['assignModule'][i]['module_name'] == 'kra kpi' && data['assignModule'][i]['view'] == '1') {
    //         data['data']['view_kra_kpi'] = 1
    //         if (data['assignModule'][i]['add'] == '1') {
    //           data['data']['add_kra_kpi'] = 1
    //         }
    //         if (data['assignModule'][i]['delete'] == '1') {
    //           data['data']['delete_kra_kpi'] = 1
    //         }
    //         if (data['assignModule'][i]['edit'] == '1') {
    //           data['data']['edit_kra_kpi'] = 1
    //         }
    //         if (data['assignModule'][i]['export'] == '1') {
    //           data['data']['export_kra_kpi'] = 1
    //         }
    //         if (data['assignModule'][i]['import'] == '1') {
    //           data['data']['import_kra_kpi'] = 1
    //         }
    //       }

    //       else if (data['assignModule'][i]['module_name'] == 'Sales Return' && data['assignModule'][i]['view'] == '1') {
    //         data['data']['view_sales_return'] = 1
    //         if (data['assignModule'][i]['edit'] == '1') {
    //           data['data']['edit_sales_return'] = 1
    //         }
    //         if (data['assignModule'][i]['delete'] == '1') {
    //           data['data']['delete_sales_return'] = 1
    //         }
    //         if (data['assignModule'][i]['add'] == '1') {
    //           data['data']['add_sales_return'] = 1
    //         }

    //         if (data['assignModule'][i]['export'] == '1') {
    //           data['data']['download_sales_return'] = 1
    //         }

    //         if (data['assignModule'][i]['import'] == '1') {
    //           data['data']['upload_sales_return'] = 1
    //         }
    //       }

    //       else if (data['assignModule'][i]['module_name'] == 'Manual Dispatch' && data['assignModule'][i]['view'] == '1') {
    //         data['data']['view_manual_dispatch'] = 1

    //         if (data['assignModule'][i]['edit'] == '1') {
    //           data['data']['edit_manual_dispatch'] = 1
    //         }
    //         if (data['assignModule'][i]['delete'] == '1') {
    //           data['data']['delete_manual_dispatch'] = 1
    //         }
    //         if (data['assignModule'][i]['add'] == '1') {
    //           data['data']['add_manual_dispatch'] = 1
    //         }

    //         if (data['assignModule'][i]['export'] == '1') {
    //           data['data']['download_manual_dispatch'] = 1
    //         }

    //         if (data['assignModule'][i]['import'] == '1') {
    //           data['data']['upload_manual_dispatch'] = 1
    //         }
    //       }

    //       else if (data['assignModule'][i]['module_name'] == 'Sfa Report' && data['assignModule'][i]['view'] == '1') {
    //         data['data']['view_sfa_report'] = 1
    //         if (data['assignModule'][i]['edit'] == '1') {
    //           data['data']['edit_sfa_report'] = 1
    //         }
    //         if (data['assignModule'][i]['export'] == '1') {
    //           data['data']['download_sfa_report'] = 1
    //         }
    //         if (data['assignModule'][i]['import'] == '1') {
    //           data['data']['upload_sfa_report'] = 1
    //         }
    //       }

    //       else if (data['assignModule'][i]['module_name'] == 'Loyalty Report' && data['assignModule'][i]['view'] == '1') {
    //         data['data']['view_loyalty_report'] = 1
    //         if (data['assignModule'][i]['edit'] == '1') {
    //           data['data']['edit_loyalty_report'] = 1
    //         }
    //         if (data['assignModule'][i]['export'] == '1') {
    //           data['data']['download_loyalty_report'] = 1
    //         }
    //         if (data['assignModule'][i]['import'] == '1') {
    //           data['data']['upload_loyalty_report'] = 1
    //         }
    //       }

    //       else if (data['assignModule'][i]['module_name'] == 'Sfa Report' && data['assignModule'][i]['view'] == '1') {
    //         data['data']['view_sfa_report'] = 1
    //         if (data['assignModule'][i]['edit'] == '1') {
    //           data['data']['edit_sfa_report'] = 1
    //         }
    //         if (data['assignModule'][i]['export'] == '1') {
    //           data['data']['download_sfa_report'] = 1
    //         }
    //         if (data['assignModule'][i]['import'] == '1') {
    //           data['data']['upload_sfa_report'] = 1
    //         }
    //       }






    //       else if (data['assignModule'][i]['module_name'] == 'Dispatch Packing' && data['assignModule'][i]['view'] == '1') {
    //         data['data']['view_dispatch_packing'] = 1
    //         if (data['assignModule'][i]['add'] == '1') {
    //           data['data']['add_dispatch_packing'] = 1
    //         }
    //         if (data['assignModule'][i]['export'] == '1') {
    //           data['data']['download_dispatch_packing'] = 1
    //         }
    //       }
    //       else if (data['assignModule'][i]['module_name'] == 'Dispatch Billing' && data['assignModule'][i]['view'] == '1') {
    //         data['data']['view_dispatch_billing'] = 1
    //         if (data['assignModule'][i]['add'] == '1') {
    //           data['data']['add_dispatch_billing'] = 1
    //         }
    //         if (data['assignModule'][i]['export'] == '1') {
    //           data['data']['download_dispatch_billing'] = 1
    //         }
    //       }
    //       else if (data['assignModule'][i]['module_name'] == 'Dispatch Guard' && data['assignModule'][i]['view'] == '1') {
    //         data['data']['view_dispatch_guard'] = 1
    //         if (data['assignModule'][i]['add'] == '1') {
    //           data['data']['add_dispatch_guard'] = 1
    //         }
    //         if (data['assignModule'][i]['export'] == '1') {
    //           data['data']['download_dispatch_guard'] = 1
    //         }
    //       }
    //       else if ((data['assignModule'][i]['module_name'] == 'Scheme Incentive') && data['assignModule'][i]['view'] == '1') {
    //         data['data']['view_scheme'] = 1
    //         if (data['assignModule'][i]['add'] == '1') {
    //           data['data']['add_scheme'] = 1
    //         }
    //         if (data['assignModule'][i]['edit'] == '1') {
    //           data['data']['edit_scheme'] = 1
    //         }
    //         if (data['assignModule'][i]['export'] == '1') {
    //           data['data']['export_scheme'] = 1
    //         }
    //         if (data['assignModule'][i]['delete'] == '1') {
    //           data['data']['delete_scheme'] = 1
    //         }
    //         if (data['assignModule'][i]['import'] == '1') {
    //           data['data']['import_scheme'] = 1
    //         }
    //       }
    //       else if ((data['assignModule'][i]['module_name'] == 'Stock') && data['assignModule'][i]['view'] == '1') {
    //         data['data']['view_stock'] = 1
    //         if (data['assignModule'][i]['add'] == '1') {
    //           data['data']['add_stock'] = 1
    //         }
    //         if (data['assignModule'][i]['edit'] == '1') {
    //           data['data']['edit_stock'] = 1
    //         }
    //         if (data['assignModule'][i]['export'] == '1') {
    //           data['data']['export_stock'] = 1
    //         }
    //         if (data['assignModule'][i]['delete'] == '1') {
    //           data['data']['delete_stock'] = 1
    //         }
    //         if (data['assignModule'][i]['import'] == '1') {
    //           data['data']['import_stock'] = 1
    //         }
    //       }
    //       else if ((data['assignModule'][i]['module_name'] == 'App Control') && data['assignModule'][i]['view'] == '1') {
    //         data['data']['view_app_control'] = 1
    //         if (data['assignModule'][i]['add'] == '1') {
    //           data['data']['add_app_control'] = 1
    //         }
    //         if (data['assignModule'][i]['edit'] == '1') {
    //           data['data']['edit_app_control'] = 1
    //         }
    //         if (data['assignModule'][i]['export'] == '1') {
    //           data['data']['export_app_control'] = 1
    //         }
    //         if (data['assignModule'][i]['delete'] == '1') {
    //           data['data']['delete_app_control'] = 1
    //         }
    //         if (data['assignModule'][i]['import'] == '1') {
    //           data['data']['import_app_control'] = 1
    //         }
    //       }
    //       else if ((data['assignModule'][i]['module_name'] == 'Brand Audit') && data['assignModule'][i]['view'] == '1') {
    //         data['data']['view_brand_audit'] = 1
    //         if (data['assignModule'][i]['add'] == '1') {
    //           data['data']['add_brand_audit'] = 1
    //         }
    //         if (data['assignModule'][i]['edit'] == '1') {
    //           data['data']['edit_brand_audit'] = 1
    //         }
    //         if (data['assignModule'][i]['export'] == '1') {
    //           data['data']['export_brand_audit'] = 1
    //         }
    //         if (data['assignModule'][i]['delete'] == '1') {
    //           data['data']['delete_brand_audit'] = 1
    //         }
    //         if (data['assignModule'][i]['import'] == '1') {
    //           data['data']['import_brand_audit'] = 1
    //         }
    //       }
    //       else if ((data['assignModule'][i]['module_name'] == 'Complaint List') && data['assignModule'][i]['view'] == '1') {
    //         data['data']['view_complaint'] = 1
    //         if (data['assignModule'][i]['add'] == '1') {
    //           data['data']['add_complaint'] = 1
    //         }
    //         if (data['assignModule'][i]['edit'] == '1') {
    //           data['data']['edit_complaint'] = 1
    //         }
    //         if (data['assignModule'][i]['export'] == '1') {
    //           data['data']['export_complaint'] = 1
    //         }
    //         if (data['assignModule'][i]['delete'] == '1') {
    //           data['data']['delete_complaint'] = 1
    //         }
    //         if (data['assignModule'][i]['import'] == '1') {
    //           data['data']['import_complaint'] = 1
    //         }
    //       }
    //       else if ((data['assignModule'][i]['module_name'] == 'Customer') && data['assignModule'][i]['view'] == '1') {
    //         data['data']['view_customer'] = 1
    //         if (data['assignModule'][i]['add'] == '1') {
    //           data['data']['add_customer'] = 1
    //         }
    //         if (data['assignModule'][i]['edit'] == '1') {
    //           data['data']['edit_customer'] = 1
    //         }
    //         if (data['assignModule'][i]['export'] == '1') {
    //           data['data']['export_customer'] = 1
    //         }
    //         if (data['assignModule'][i]['delete'] == '1') {
    //           data['data']['delete_customer'] = 1
    //         }
    //         if (data['assignModule'][i]['import'] == '1') {
    //           data['data']['import_customer'] = 1
    //         }
    //       }
    //       else if ((data['assignModule'][i]['module_name'] == 'Warranty Registration') && data['assignModule'][i]['view'] == '1') {
    //         data['data']['view_warranty'] = 1
    //         if (data['assignModule'][i]['add'] == '1') {
    //           data['data']['add_warranty'] = 1
    //         }
    //         if (data['assignModule'][i]['edit'] == '1') {
    //           data['data']['edit_warranty'] = 1
    //         }
    //         if (data['assignModule'][i]['export'] == '1') {
    //           data['data']['export_warranty'] = 1
    //         }
    //         if (data['assignModule'][i]['delete'] == '1') {
    //           data['data']['delete_warranty'] = 1
    //         }
    //         if (data['assignModule'][i]['import'] == '1') {
    //           data['data']['import_warranty'] = 1
    //         }
    //       }
    //       else if ((data['assignModule'][i]['module_name'] == 'Installation List') && data['assignModule'][i]['view'] == '1') {
    //         data['data']['view_installation'] = 1
    //         if (data['assignModule'][i]['add'] == '1') {
    //           data['data']['add_installation'] = 1
    //         }
    //         if (data['assignModule'][i]['edit'] == '1') {
    //           data['data']['edit_installation'] = 1
    //         }
    //         if (data['assignModule'][i]['export'] == '1') {
    //           data['data']['export_installation'] = 1
    //         }
    //         if (data['assignModule'][i]['delete'] == '1') {
    //           data['data']['delete_installation'] = 1
    //         }
    //         if (data['assignModule'][i]['import'] == '1') {
    //           data['data']['import_installation'] = 1
    //         }
    //       }
    //       else if ((data['assignModule'][i]['module_name'] == 'Spare Part') && data['assignModule'][i]['view'] == '1') {
    //         data['data']['view_spare'] = 1
    //         if (data['assignModule'][i]['add'] == '1') {
    //           data['data']['add_spare'] = 1
    //         }
    //         if (data['assignModule'][i]['edit'] == '1') {
    //           data['data']['edit_spare'] = 1
    //         }
    //         if (data['assignModule'][i]['export'] == '1') {
    //           data['data']['export_spare'] = 1
    //         }
    //         if (data['assignModule'][i]['delete'] == '1') {
    //           data['data']['delete_spare'] = 1
    //         }
    //         if (data['assignModule'][i]['import'] == '1') {
    //           data['data']['import_spare'] = 1
    //         }
    //       }
    //       else if ((data['assignModule'][i]['module_name'] == 'Invoice') && data['assignModule'][i]['view'] == '1') {
    //         data['data']['view_invoice'] = 1
    //         if (data['assignModule'][i]['add'] == '1') {
    //           data['data']['add_invoice'] = 1
    //         }
    //         if (data['assignModule'][i]['edit'] == '1') {
    //           data['data']['edit_invoice'] = 1
    //         }
    //         if (data['assignModule'][i]['export'] == '1') {
    //           data['data']['export_invoice'] = 1
    //         }
    //         if (data['assignModule'][i]['delete'] == '1') {
    //           data['data']['delete_invoice'] = 1
    //         }
    //         if (data['assignModule'][i]['import'] == '1') {
    //           data['data']['import_invoice'] = 1
    //         }
    //       }
    //       else if ((data['assignModule'][i]['module_name'] == 'Complaint Visit') && data['assignModule'][i]['view'] == '1') {
    //         data['data']['view_complaint_visit'] = 1
    //         if (data['assignModule'][i]['add'] == '1') {
    //           data['data']['add_complaint_visit'] = 1
    //         }
    //         if (data['assignModule'][i]['edit'] == '1') {
    //           data['data']['edit_complaint_visit'] = 1
    //         }
    //         if (data['assignModule'][i]['export'] == '1') {
    //           data['data']['export_complaint_visit'] = 1
    //         }
    //         if (data['assignModule'][i]['delete'] == '1') {
    //           data['data']['delete_complaint_visit'] = 1
    //         }
    //         if (data['assignModule'][i]['import'] == '1') {
    //           data['data']['import_complaint_visit'] = 1
    //         }
    //       }

    //       else if ((data['assignModule'][i]['module_name'] == 'Site') && data['assignModule'][i]['view'] == '1') {
    //         data['data']['view_site'] = 1
    //         if (data['assignModule'][i]['add'] == '1') {
    //           data['data']['add_site'] = 1
    //         }
    //         if (data['assignModule'][i]['edit'] == '1') {
    //           data['data']['edit_site'] = 1
    //         }
    //         if (data['assignModule'][i]['export'] == '1') {
    //           data['data']['export_site'] = 1
    //         }
    //         if (data['assignModule'][i]['delete'] == '1') {
    //           data['data']['delete_site'] = 1
    //         }
    //         if (data['assignModule'][i]['import'] == '1') {
    //           data['data']['import_site'] = 1
    //         }
    //       }


    //       else if ((data['assignModule'][i]['module_name'] == 'Loyalty') && data['assignModule'][i]['view'] == '1') {
    //         data['data']['view_loyalty'] = 1
    //       }

    //     }




    //   }

    //   else if (data['data']['id'] == '1' && data['data']['user_type'] != 'DMS') {

    //     // data['data']['view_enquiry'] = 1;
    //     // data['data']['edit_enquiry'] = 1;
    //     // data['data']['add_enquiry'] = 1;
    //     // data['data']['delete_enquiry'] = 1;
    //     // data['data']['export_enquiry'] = 1;
    //     // data['data']['import_enquiry'] = 1;

    //     // data['data']['view_dashboard'] = 1

    //     // data['data']['view_influencer_network'] = 1
    //     // data['data']['add_influencer'] = 1;
    //     // data['data']['export_influencer'] = 1;
    //     // data['data']['edit_influencer'] = 1;

    //     // data['data']['view_customer_network'] = 1;


    //     // data['data']['add_customer_network'] = 1;
    //     // data['data']['edit_customer_network'] = 1;
    //     // data['data']['export_customer_network'] = 1;
    //     // data['data']['import_customer_network'] = 1;

    //     // data['data']['view_channel_partner'] = 1;

    //     // data['data']['add_channel_partner'] = 1;
    //     // data['data']['import_channel_partner'] = 1;
    //     // data['data']['export_channel_partner'] = 1;
    //     // data['data']['edit_channel_partner'] = 1;

    //     // data['data']['view_dealer'] = 1
    //     // data['data']['add_dealer'] = 1;
    //     // data['data']['import_dealer'] = 1;
    //     // data['data']['export_dealer'] = 1;
    //     // data['data']['edit_dealer'] = 1;

    //     // data['data']['view_direct_dealers'] = 1
    //     // data['data']['add_direct_dealers'] = 1;
    //     // data['data']['import_direct_dealers'] = 1;
    //     // data['data']['export_direct_dealers'] = 1;
    //     // data['data']['edit_direct_dealers'] = 1;

    //     // data['data']['view_orders'] = 1
    //     // data['data']['add_order'] = 1;
    //     // data['data']['export_order'] = 1;
    //     // data['data']['edit_order'] = 1;
    //     // data['data']['delete_order'] = 1;

    //     // data['data']['view_primary_orders'] = 1
    //     // data['data']['add_primary_order'] = 1;
    //     // data['data']['export_primary_order'] = 1;
    //     // data['data']['edit_primary_order'] = 1;
    //     // data['data']['delete_primary_order'] = 1;

    //     // data['data']['view_secondary_orders'] = 1;
    //     // data['data']['add_secondary_orders'] = 1;
    //     // data['data']['export_secondary_orders'] = 1;
    //     // data['data']['edit_secondary_orders'] = 1;
    //     // data['data']['delete_secondary_orders'] = 1;



    //     // data['data']['view_accounts'] = 1
    //     // data['data']['view_invoice'] = 1
    //     // data['data']['view_payment'] = 1
    //     // data['data']['import_accounts'] = 1
    //     // data['data']['export_accounts'] = 1

    //     // data['data']['view_attendence'] = 1
    //     // data['data']['export_attendence'] = 1
    //     // data['data']['edit_attendence'] = 1

    //     // data['data']['view_check_in'] = 1
    //     // data['data']['export_checkin'] = 1

    //     // data['data']['view_leaves'] = 1
    //     // data['data']['export_leaves'] = 1
    //     // data['data']['edit_leaves'] = 1

    //     // data['data']['view_travel_plan'] = 1
    //     // data['data']['delete_travel_list'] = 1
    //     // data['data']['export_travel_list'] = 1
    //     // data['data']['edit_travel_list'] = 1
    //     // data['data']['import_travel_list'] = 1

    //     // data['data']['add_travel_list'] = 1

    //     // data['data']['view_follow_up'] = 1
    //     // data['data']['export_follow_up'] = 1
    //     // data['data']['delete_follow_up'] = 1
    //     // data['data']['add_follow_up'] = 1

    //     // data['data']['view_announcement'] = 1
    //     // data['data']['add_announcement'] = 1

    //     // data['data']['view_expense'] = 1
    //     // data['data']['export_expense'] = 1
    //     // data['data']['edit_expense'] = 1
    //     // data['data']['add_expense'] = 1

    //     // data['data']['view_event_plan'] = 1
    //     // data['data']['edit_event_plan'] = 1
    //     // data['data']['add_event_plan'] = 1




    //     // data['data']['view_pop_gift'] = 1
    //     // data['data']['edit_pop_gift'] = 1
    //     // data['data']['delete_pop_gift'] = 1
    //     // data['data']['export_pop_gift'] = 1
    //     // data['data']['add_pop_gift'] = 1

    //     // data['data']['view_survey'] = 1
    //     // data['data']['add_survey'] = 1
    //     // data['data']['edit_survey'] = 1
    //     // data['data']['export_survey'] = 1

    //     // data['data']['view_gift'] = 1
    //     // data['data']['edit_gift_gallery'] = 1
    //     // data['data']['export_gift_gallery'] = 1
    //     // data['data']['add_gift_gallery'] = 1


    //     // data['data']['view_bonus_points'] = 1
    //     // data['data']['add_bonus_points'] = 1
    //     // data['data']['edit_bonus_points'] = 1
    //     // data['data']['export_bonus_points'] = 1


    //     // data['data']['view_coupon_code'] = 1
    //     // data['data']['export_coupon_code'] = 1
    //     // data['data']['add_coupon_code'] = 1
    //     // data['data']['delete_coupon_code'] = 1

    //     // data['data']['view_redeem_request'] = 1
    //     // data['data']['export_redeem_request'] = 1
    //     // data['data']['edit_redeem_request'] = 1

    //     // data['data']['view_target'] = 1
    //     // data['data']['view_employee_target'] = 1
    //     // data['data']['add_employee_target'] = 1
    //     // data['data']['edit_employee_target'] = 1
    //     // data['data']['export_employee_target'] = 1
    //     // data['data']['delete_employee_target'] = 1
    //     // data['data']['import_employee_target'] = 1

    //     // data['data']['view_distributor_target'] = 1
    //     // data['data']['add_distributor_target'] = 1
    //     // data['data']['edit_distributor_target'] = 1
    //     // data['data']['export_distributor_target'] = 1
    //     // data['data']['delete_distributor_target'] = 1
    //     // data['data']['import_distributor_target'] = 1


    //     data['data']['view_master'] = 1

    //     data['data']['view_video_tutorial'] = 1
    //     data['data']['add_video_tutorial'] = 1
    //     data['data']['view_designation'] = 1
    //     data['data']['add_users_designation'] = 1
    //     data['data']['edit_users_designation'] = 1
    //     data['data']['export_users_designation'] = 1
    //     data['data']['delete_users_designation'] = 1
    //     data['data']['import_users_designation'] = 1

    //     // data['data']['view_category'] = 1
    //     // data['data']['view_sub_category'] = 1
    //     // data['data']['view_customer_category'] = 1
    //     // data['data']['view_infulencer_category'] = 1
    //     // data['data']['view_point_category'] = 1
    //     // data['data']['view_holiday'] = 1
    //     // data['data']['view_leave_master'] = 1
    //     // data['data']['view_referral_point_master'] = 1

    //     data['data']['view_users'] = 1
    //     data['data']['add_users_master'] = 1
    //     data['data']['edit_users_master'] = 1
    //     // data['data']['export_users_master'] = 1
    //     // data['data']['delete_users_master'] = 1
    //     // data['data']['import_users_master'] = 1


    //     // data['data']['view_sub_category'] = 1
    //     // data['data']['add_sub_category_master'] = 1
    //     // data['data']['edit_sub_category_master'] = 1
    //     // data['data']['export_sub_category_master'] = 1
    //     // data['data']['delete_sub_category_master'] = 1
    //     // data['data']['import_sub_category_master'] = 1


    //     data['data']['edit_master'] = 1
    //     data['data']['add_master'] = 1
    //     data['data']['delete_master'] = 1
    //     data['data']['export_master'] = 1
    //     data['data']['import_master'] = 1

    //     // data['data']['view_gallery'] = 1
    //     // data['data']['add_gallery_master'] = 1
    //     // data['data']['edit_gallery_master'] = 1
    //     // data['data']['export_gallery_master'] = 1
    //     // data['data']['delete_gallery_master'] = 1
    //     // data['data']['import_gallery_master'] = 1

    //     // data['data']['view_products'] = 1
    //     // data['data']['add_products_master'] = 1
    //     // data['data']['edit_products_master'] = 1
    //     // data['data']['export_products_master'] = 1
    //     // data['data']['delete_products_master'] = 1
    //     // data['data']['import_products_master'] = 1


    //     // data['data']['import_customer_master'] = 1
    //     // data['data']['delete_customer_master'] = 1
    //     // data['data']['export_customer_master'] = 1
    //     // data['data']['add_customer_master'] = 1
    //     // data['data']['edit_customer_master'] = 1

    //     // data['data']['add_infulencer_master'] = 1
    //     // data['data']['edit_infulencer_master'] = 1
    //     // data['data']['export_infulencer_master'] = 1
    //     // data['data']['delete_infulencer_master'] = 1
    //     // data['data']['import_infulencer_master'] = 1

    //     // data['data']['add_holiday_master'] = 1
    //     // data['data']['edit_holiday_master'] = 1
    //     // data['data']['export_holiday_master'] = 1
    //     // data['data']['delete_holiday_master'] = 1
    //     // data['data']['import_holiday_master'] = 1

    //     // data['data']['view_category'] = 1
    //     // data['data']['add_category_master'] = 1
    //     // data['data']['edit_category_master'] = 1
    //     // data['data']['export_category_master'] = 1
    //     // data['data']['delete_category_master'] = 1
    //     // data['data']['import_category_master'] = 1


    //     // data['data']['add_point_master'] = 1
    //     // data['data']['edit_point_master'] = 1
    //     // data['data']['export_point_master'] = 1
    //     // data['data']['delete_point_master'] = 1
    //     // data['data']['import_point_master'] = 1

    //     // data['data']['view_allowance_master'] = 1
    //     // data['data']['add_allowance_master'] = 1
    //     // data['data']['edit_allowance_master'] = 1
    //     // data['data']['export_allowance_master'] = 1
    //     // data['data']['delete_allowance_master'] = 1
    //     // data['data']['import_allowance_master'] = 1

    //     // data['data']['view_leave_master'] = 1
    //     // data['data']['add_leave_master'] = 1
    //     // data['data']['edit_leave_master'] = 1
    //     // data['data']['export_leave_master'] = 1
    //     // data['data']['delete_leave_master'] = 1
    //     // data['data']['import_leave_master'] = 1

    //     // data['data']['view_pdf'] = 1
    //     // data['data']['add_pdf_master'] = 1
    //     // data['data']['edit_pdf_master'] = 1
    //     // data['data']['export_pdf_master'] = 1
    //     // data['data']['delete_pdf_master'] = 1
    //     // data['data']['import_pdf_master'] = 1


    //     // data['data']['view_support'] = 1
    //     // data['data']['export_support'] = 1
    //     // data['data']['edit_support'] = 1

    //     // data['data']['view_task'] = 1
    //     // data['data']['add_task'] = 1
    //     // data['data']['export_task'] = 1

    //     // data['data']['view_sales_return'] = 1
    //     // data['data']['add_sales_return'] = 1
    //     // data['data']['edit_sales_return'] = 1
    //     // data['data']['delete_sales_return'] = 1
    //     // data['data']['download_sales_return'] = 1
    //     // data['data']['upload_sales_return'] = 1

    //     // data['data']['view_manual_dispatch'] = 1
    //     // data['data']['edit_manual_dispatch'] = 1
    //     // data['data']['delete_manual_dispatch'] = 1
    //     // data['data']['add_manual_dispatch'] = 1
    //     // data['data']['download_manual_dispatch'] = 1
    //     // data['data']['upload_manual_dispatch'] = 1




    //     //
    //     // data['data']['edit_sfa_report'] = 1
    //     // data['data']['download_sfa_report'] = 1
    //     // data['data']['upload_sfa_report'] = 1



    //     //  data['data']['edit_loyalty_report'] = 1
    //     // data['data']['download_loyalty_report'] = 1
    //     // data['data']['upload_loyalty_report'] = 1






    //     // data['data']['view_dispatch_packing'] = 1
    //     // data['data']['add_dispatch_packing'] = 1
    //     // data['data']['download_dispatch_packing'] = 1

    //     // data['data']['view_dispatch_billing'] = 1
    //     // data['data']['add_dispatch_billing'] = 1
    //     // data['data']['download_dispatch_billing'] = 1

    //     // data['data']['view_kra_kpi'] = 1
    //     // data['data']['add_kra_kpi'] = 1
    //     // data['data']['delete_kra_kpi'] = 1
    //     // data['data']['edit_kra_kpi'] = 1
    //     // data['data']['export_kra_kpi'] = 1
    //     // data['data']['import_kra_kpi'] = 1


    //     // data['data']['view_dispatch_guard'] = 1
    //     // data['data']['add_dispatch_guard'] = 1
    //     // data['data']['download_dispatch_guard'] = 1



    //     // data['data']['view_scheme'] = 1;
    //     // data['data']['edit_scheme'] = 1;
    //     // data['data']['add_scheme'] = 1;
    //     // data['data']['delete_scheme'] = 1;
    //     // data['data']['export_scheme'] = 1;
    //     // data['data']['import_scheme'] = 1;

    //     // data['data']['view_stock'] = 1;
    //     // data['data']['edit_stock'] = 1;
    //     // data['data']['add_stock'] = 1;
    //     // data['data']['delete_stock'] = 1;
    //     // data['data']['export_stock'] = 1;
    //     // data['data']['import_stock'] = 1;

    //     // data['data']['view_app_control'] = 1;
    //     // data['data']['edit_app_control'] = 1;
    //     // data['data']['add_app_control'] = 1;
    //     // data['data']['delete_app_control'] = 1;
    //     // data['data']['export_app_control'] = 1;
    //     // data['data']['import_app_control'] = 1;


    //     // data['data']['view_brand_audit'] = 1;
    //     // data['data']['edit_brand_audit'] = 1;
    //     // data['data']['add_brand_audit'] = 1;
    //     // data['data']['delete_brand_audit'] = 1;
    //     // data['data']['export_brand_audit'] = 1;
    //     // data['data']['import_brand_audit'] = 1;

    //     // data['data']['view_complaint'] = 1;
    //     // data['data']['edit_complaint'] = 1;
    //     // data['data']['add_complaint'] = 1;
    //     // data['data']['delete_complaint'] = 1;
    //     // data['data']['export_complaint'] = 1;
    //     // data['data']['import_complaint'] = 1;

    //     // data['data']['view_customer'] = 1;
    //     // data['data']['edit_customer'] = 1;
    //     // data['data']['add_customer'] = 1;
    //     // data['data']['delete_customer'] = 1;
    //     // data['data']['export_customer'] = 1;
    //     // data['data']['import_customer'] = 1;


    //     // data['data']['view_warranty'] = 1;
    //     // data['data']['edit_warranty'] = 1;
    //     // data['data']['add_warranty'] = 1;
    //     // data['data']['delete_warranty'] = 1;
    //     // data['data']['export_warranty'] = 1;
    //     // data['data']['import_warranty'] = 1;


    //     // data['data']['view_installation'] = 1;
    //     // data['data']['edit_installation'] = 1;
    //     // data['data']['add_installation'] = 1;
    //     // data['data']['delete_installation'] = 1;
    //     // data['data']['export_installation'] = 1;
    //     // data['data']['import_installation'] = 1;


    //     // data['data']['view_spare'] = 1;
    //     // data['data']['edit_spare'] = 1;
    //     // data['data']['add_spare'] = 1;
    //     // data['data']['delete_spare'] = 1;
    //     // data['data']['export_spare'] = 1;
    //     // data['data']['import_spare'] = 1;

    //     // data['data']['view_invoice'] = 1;
    //     // data['data']['export_nvoice'] = 1;
    //     // data['data']['import_nvoice'] = 1;


    //     // data['data']['view_complaint_visit'] = 1;
    //     // data['data']['edit_complaint_visit'] = 1;
    //     // data['data']['add_complaint_visit'] = 1;
    //     // data['data']['delete_complaint_visit'] = 1;
    //     // data['data']['export_complaint_visit'] = 1;
    //     // data['data']['import_complaint_visit'] = 1;


    //     // data['data']['view_site'] = 1
    //     // data['data']['add_site'] = 1
    //     // data['data']['edit_site'] = 1
    //     // data['data']['export_site'] = 1
    //     // data['data']['delete_site'] = 1
    //     // data['data']['import_site'] = 1
    //   }

    //   const st_user = data;
    //   let mode
    //   if (data.data.developement_mode == 0) {
    //     mode = true;
    //   } else {
    //     mode = false;
    //   }
    //   st_user.data.access_level = "1";
    //   st_user.data.project_login_code = data['data']['project_login_code'];
    //   st_user.data.company = data['data']['project_login_code'];
    //   st_user.data.organisation_data = data['organisation_data'];
    //   st_user.data.developement_mode = mode;
    //   st_user.st_log = true;
    //   localStorage.setItem('st_user', JSON.stringify(st_user));
    // }

  }


  post_rqst(request_data: any, fn: any): any {
    let data
    data = JSON.parse(localStorage.getItem('st_user'))
    let headers = new HttpHeaders().set('Content-Type', 'application/json');
    headers = headers.set('Authorization', 'Bearer ' + this.st_user.token);
    if (data != null) {
      this.devlopmentMode = data.data.developement_mode
      this.sessionCheck()
    }

    const encryptedData = this.devlopmentMode ? JSON.stringify(request_data) : this.cryptoService.encryptData(request_data);


    return this.http.post(this.dbUrl + fn, (encryptedData), { headers: headers })
      .pipe(
        map((result: any) => {
          const decryptedData = this.devlopmentMode ? result : this.cryptoService.decryptData(JSON.stringify(result));
          return decryptedData;
        })
      );
  }


  upload_rqst(request_data: any, fn: any): any {
    let data
    data = JSON.parse(localStorage.getItem('st_user'))
    let headers = new HttpHeaders().set('Content-Type', 'application/json');
    headers = headers.set('Authorization', 'Bearer ' + this.st_user.token);
    if (data != null) {
      this.sessionCheck()
    }
    return this.http.post(this.dbUrl + fn, JSON.stringify(request_data), { headers: headers })
      .pipe(
        map((result: any) => {
          return result;
        })
      );
  }


  cancelDownloading() {
    this.post_rqst('', "DownloadMaster/cancelDownloadRequest").subscribe((result) => {
      result
      if (result['statusCode'] == 200) {
        this.progressService.setDownloaderActive(false);
        this.progressService.setTotalCount(0);
        this.progressService.setRemainingCount(0);
        this.progressService.setCancelReq(true);
      }

    }, err => {
    });
  }

  sessionTimer() {
    this.resetTime = 21600000;
  }
}