import { Component, OnInit } from '@angular/core';
import { slideToRight } from '../router-animation/router-animation.component';
import { DatabaseService } from 'src/_services/DatabaseService';
import { Router, ActivatedRoute } from '@angular/router';
import { sessionStorage } from '../localstorage.service';
import { DialogComponent } from '../dialog.component';
import { CryptoService } from 'src/_services/CryptoService';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  animations: [slideToRight()]
})
export class LoginComponent implements OnInit {

  data: any = [];
  peraluser: any = {};
  st_user: any = {};
  nexturl: any;
  channel_partner: boolean = false;
  cp_otp: any;
  edit_view: boolean = false;
  tokenInfo: any = '';
  encryptedData: any;
  decryptedData: any;
  savingFlag: boolean = false;



  constructor(public serve: DatabaseService, public cryptoService: CryptoService, public rout: Router, public session: sessionStorage, public dialog: DialogComponent, private route: ActivatedRoute, private router: Router) { }

  ngOnInit() {
  }

  login() {
    this.savingFlag = true;
    this.encryptedData = this.cryptoService.encryptData({ "username": this.data['username'], "password": this.data['password'] });
    this.serve.auth_rqust(this.encryptedData, "login/submitnew").subscribe((result: any) => {


      let data
      this.serve.tabData = {};
      this.serve.filteredData = {};
      data = this.cryptoService.decryptData(JSON.stringify(result));

      if (data['data']['id'] != '1' && data['data']['user_type'] != 'DMS') {
        for (let i = 0; i < data['assignModule'].length; i++) {
          if ((data['assignModule'][i]['module_name'] == 'Enquiry' && data['assignModule'][i]['view'] == '1')) {
            data['data']['view_enquiry'] = 1;
            if (data['assignModule'][i]['edit'] == '1') {
              data['data']['edit_enquiry'] = 1
            }
            if (data['assignModule'][i]['add'] == '1') {
              data['data']['add_enquiry'] = 1;
            }
            if (data['assignModule'][i]['export'] == '1') {
              data['data']['export_enquiry'] = 1;
            }
            if (data['assignModule'][i]['import'] == '1') {
              data['data']['import_enquiry'] = 1;
            }
          }
          else if (data['assignModule'][i]['module_name'] == 'Sfa Dashboard' && data['assignModule'][i]['view'] == '1') {
            data['data']['view_sfa_dashboard'] = 1
          }
          else if (data['assignModule'][i]['module_name'] == 'Dms Dashboard' && data['assignModule'][i]['view'] == '1') {
            data['data']['view_dms_dashboard'] = 1
          }
          else if (data['assignModule'][i]['module_name'] == 'Loyalty Dashboard' && data['assignModule'][i]['view'] == '1') {
            data['data']['view_loyalty_dashboard'] = 1
          }
          else if (data['assignModule'][i]['module_name'] == 'Service Dashboard' && data['assignModule'][i]['view'] == '1') {
            data['data']['view_service__dashboard'] = 1
          }
          else if (data['assignModule'][i]['module_name'] == 'Dispatch Dashboard' && data['assignModule'][i]['view'] == '1') {
            data['data']['view_dispatch_dashboard'] = 1
          }
          else if (data['assignModule'][i]['module_name'] == 'Enquiry' && data['assignModule'][i]['view'] == '1') {
            data['data']['view_enquiry'] = 1
          }
          else if (data['assignModule'][i]['module_name'] == 'Influencer Network' && data['assignModule'][i]['view'] == '1') {
            data['data']['view_influencer_network'] = 1
            if (data['assignModule'][i]['add'] == '1') {
              data['data']['add_influencer'] = 1;
            }
            if (data['assignModule'][i]['export'] == '1') {
              data['data']['export_influencer'] = 1;
            }
            if (data['assignModule'][i]['edit'] == '1') {
              data['data']['edit_influencer'] = 1;
            }
            if (data['assignModule'][i]['delete'] == '1') {
              data['data']['delete_influencer'] = 1;
            }
          }
          else if (data['assignModule'][i]['module_name'] == 'Customer Network' && data['assignModule'][i]['view'] == '1') {
            data['data']['view_customer_network'] = 1
            if (data['assignModule'][i]['add'] == '1') {
              data['data']['add_customer_network'] = 1;
            }
            if (data['assignModule'][i]['import'] == '1') {
              data['data']['import_customer_network'] = 1;
            }
            if (data['assignModule'][i]['export'] == '1') {
              data['data']['export_customer_network'] = 1;
            }
            if (data['assignModule'][i]['edit'] == '1') {
              data['data']['edit_customer_network'] = 1;
            }

          }

          else if (data['assignModule'][i]['module_name'] == 'Primary Network' && data['assignModule'][i]['view'] == '1') {
            data['data']['view_primary_network'] = 1
            if (data['assignModule'][i]['add'] == '1') {
              data['data']['add_primary_network'] = 1;
            }
            if (data['assignModule'][i]['import'] == '1') {
              data['data']['import_primary_network'] = 1;
            }
            if (data['assignModule'][i]['export'] == '1') {
              data['data']['export_primary_network'] = 1;
            }
            if (data['assignModule'][i]['edit'] == '1') {
              data['data']['edit_primary_network'] = 1;
            }

          }

          else if (data['assignModule'][i]['module_name'] == 'Secondary Network' && data['assignModule'][i]['view'] == '1') {
            data['data']['view_secondary_network'] = 1
            if (data['assignModule'][i]['add'] == '1') {
              data['data']['add_secondary_network'] = 1;
            }
            if (data['assignModule'][i]['import'] == '1') {
              data['data']['import_secondary_network'] = 1;
            }
            if (data['assignModule'][i]['export'] == '1') {
              data['data']['export_secondary_network'] = 1;
            }
            if (data['assignModule'][i]['edit'] == '1') {
              data['data']['edit_secondary_network'] = 1;
            }

          }

          else if (data['assignModule'][i]['module_name'] == 'Channel Partner' && data['assignModule'][i]['view'] == '1') {
            data['data']['view_customer_network'] = 1
            data['data']['view_channel_partner'] = 1
            if (data['assignModule'][i]['add'] == '1') {
              data['data']['add_channel_partner'] = 1;
            }
            if (data['assignModule'][i]['import'] == '1') {
              data['data']['import_channel_partner'] = 1;
            }
            if (data['assignModule'][i]['export'] == '1') {
              data['data']['export_channel_partner'] = 1;
            }
            if (data['assignModule'][i]['edit'] == '1') {
              data['data']['edit_channel_partner'] = 1;
            }

          }

          else if (data['assignModule'][i]['module_name'] == 'Dealer' && data['assignModule'][i]['view'] == '1') {
            data['data']['view_customer_network'] = 1
            data['data']['view_dealer'] = 1
            if (data['assignModule'][i]['add'] == '1') {
              data['data']['add_dealer'] = 1;
            }
            if (data['assignModule'][i]['import'] == '1') {
              data['data']['import_dealer'] = 1;
            }
            if (data['assignModule'][i]['export'] == '1') {
              data['data']['export_dealer'] = 1;
            }
            if (data['assignModule'][i]['edit'] == '1') {
              data['data']['edit_dealer'] = 1;
            }
          }

          else if (data['assignModule'][i]['module_name'] == 'Direct Dealers' && data['assignModule'][i]['view'] == '1') {
            data['data']['view_customer_network'] = 1
            data['data']['view_direct_dealers'] = 1
            if (data['assignModule'][i]['add'] == '1') {
              data['data']['add_direct_dealers'] = 1;
            }
            if (data['assignModule'][i]['import'] == '1') {
              data['data']['import_direct_dealers'] = 1;
            }
            if (data['assignModule'][i]['export'] == '1') {
              data['data']['export_direct_dealers'] = 1;
            }
            if (data['assignModule'][i]['edit'] == '1') {
              data['data']['edit_direct_dealers'] = 1;
            }
          }

          else if (data['assignModule'][i]['module_name'] == 'Primary Orders' && data['assignModule'][i]['view'] == '1') {
            data['data']['view_orders'] = 1
            data['data']['view_primary_orders'] = 1

            if (data['assignModule'][i]['add'] == '1') {
              data['data']['add_primary_order'] = 1;
            }
            if (data['assignModule'][i]['export'] == '1') {
              data['data']['export_primary_order'] = 1;
            }
            if (data['assignModule'][i]['edit'] == '1') {
              data['data']['edit_primary_order'] = 1;
            }
            if (data['assignModule'][i]['delete'] == '1') {
              data['data']['delete_primary_order'] = 1;
            }
          }

          else if (data['assignModule'][i]['module_name'] == 'Secondary Orders' && data['assignModule'][i]['view'] == '1') {
            data['data']['view_orders'] = 1
            data['data']['view_secondary_orders'] = 1

            if (data['assignModule'][i]['add'] == '1') {
              data['data']['add_secondary_orders'] = 1;
            }
            if (data['assignModule'][i]['export'] == '1') {
              data['data']['export_secondary_orders'] = 1;
            }
            if (data['assignModule'][i]['edit'] == '1') {
              data['data']['edit_secondary_orders'] = 1;
            }
            if (data['assignModule'][i]['delete'] == '1') {
              data['data']['delete_secondary_orders'] = 1;
            }
          }
          else if (data['assignModule'][i]['module_name'] == 'DMS Invoice' && data['assignModule'][i]['view'] == '1') {
            data['data']['view_accounts'] = 1
            data['data']['view_dms_invoice'] = 1

            if (data['assignModule'][i]['import'] == '1') {
              data['data']['import_invoice'] = 1;
            }
            if (data['assignModule'][i]['export'] == '1') {
              data['data']['export_invoice'] = 1;
            }
          }
          else if (data['assignModule'][i]['module_name'] == 'DMS Ledger' && data['assignModule'][i]['view'] == '1') {
            data['data']['view_accounts'] = 1
            data['data']['view_ledger'] = 1

            if (data['assignModule'][i]['import'] == '1') {
              data['data']['import_ledger'] = 1;
            }
            if (data['assignModule'][i]['export'] == '1') {
              data['data']['export_ledger'] = 1;
            }
          }
          else if (data['assignModule'][i]['module_name'] == 'DMS Pending Bills' && data['assignModule'][i]['view'] == '1') {
            data['data']['view_accounts'] = 1
            data['data']['view_bill'] = 1

            if (data['assignModule'][i]['import'] == '1') {
              data['data']['import_bill'] = 1;
            }
            if (data['assignModule'][i]['export'] == '1') {
              data['data']['export_bill'] = 1;
            }
          }
          else if (data['assignModule'][i]['module_name'] == 'Attendance' && data['assignModule'][i]['view'] == '1') {
            data['data']['view_attendence'] = 1
            if (data['assignModule'][i]['export'] == '1') {
              data['data']['export_attendence'] = 1
            }
            if (data['assignModule'][i]['edit'] == '1') {
              data['data']['edit_attendence'] = 1
            }
          }
          else if (data['assignModule'][i]['module_name'] == 'Check In' && data['assignModule'][i]['view'] == '1') {
            data['data']['view_check_in'] = 1;
            if (data['assignModule'][i]['export'] == '1') {
              data['data']['export_checkin'] = 1
            }
          }
          else if (data['assignModule'][i]['module_name'] == 'Leave' && data['assignModule'][i]['view'] == '1') {
            data['data']['view_leaves'] = 1
            if (data['assignModule'][i]['export'] == '1') {
              data['data']['export_leaves'] = 1
            }
            if (data['assignModule'][i]['edit'] == '1') {
              data['data']['edit_leaves'] = 1
            }
          }
          else if (data['assignModule'][i]['module_name'] == 'Travel Plan' && data['assignModule'][i]['view'] == '1') {
            data['data']['view_travel_plan'] = 1
            if (data['assignModule'][i]['edit'] == '1') {
              data['data']['edit_travel_list'] = 1
            }
            if (data['assignModule'][i]['add'] == '1') {
              data['data']['add_travel_list'] = 1
            }
            if (data['assignModule'][i]['export'] == '1') {
              data['data']['export_travel_list'] = 1
            }
            if (data['assignModule'][i]['delete'] == '1') {
              data['data']['delete_travel_list'] = 1
            }
            if (data['assignModule'][i]['import'] == '1') {
              data['data']['import_travel_list'] = 1
            }
          }
          else if (data['assignModule'][i]['module_name'] == 'Followup' && data['assignModule'][i]['view'] == '1') {
            data['data']['view_follow_up'] = 1
            if (data['assignModule'][i]['export'] == '1') {
              data['data']['export_follow_up'] = 1
            }
            if (data['assignModule'][i]['delete'] == '1') {
              data['data']['delete_follow_up'] = 1
            }
            if (data['assignModule'][i]['add'] == '1') {
              data['data']['add_follow_up'] = 1
            }
          }
          else if (data['assignModule'][i]['module_name'] == 'Announcement' && data['assignModule'][i]['view'] == '1') {
            data['data']['view_announcement'] = 1
            if (data['assignModule'][i]['add'] == '1') {
              data['data']['add_announcement'] = 1
            }
          }
          else if (data['assignModule'][i]['module_name'] == 'Expense' && data['assignModule'][i]['view'] == '1') {
            data['data']['view_expense'] = 1
            if (data['assignModule'][i]['export'] == '1') {
              data['data']['export_expense'] = 1
            }
            if (data['assignModule'][i]['edit'] == '1') {
              data['data']['edit_expense'] = 1
            }
            if (data['assignModule'][i]['add'] == '1') {
              data['data']['add_expense'] = 1
            }
          }
          else if (data['assignModule'][i]['module_name'] == 'Event Plan' && data['assignModule'][i]['view'] == '1') {
            data['data']['view_event_plan'] = 1
            if (data['assignModule'][i]['edit'] == '1') {
              data['data']['edit_event_plan'] = 1
            }
            if (data['assignModule'][i]['add'] == '1') {
              data['data']['add_event_plan'] = 1
            }
          }

          else if (data['assignModule'][i]['module_name'] == 'Pop & Gift' && data['assignModule'][i]['view'] == '1') {
            data['data']['view_pop_gift'] = 1
            if (data['assignModule'][i]['edit'] == '1') {
              data['data']['edit_pop_gift'] = 1
            }
            if (data['assignModule'][i]['delete'] == '1') {
              data['data']['delete_pop_gift'] = 1
            }
            if (data['assignModule'][i]['export'] == '1') {
              data['data']['export_pop_gift'] = 1
            }
            if (data['assignModule'][i]['add'] == '1') {
              data['data']['add_pop_gift'] = 1
            }

          }
          else if (data['assignModule'][i]['module_name'] == 'Survey' && data['assignModule'][i]['view'] == '1') {
            data['data']['view_survey'] = 1

            if (data['assignModule'][i]['export'] == '1') {
              data['data']['export_survey'] = 1
            }
            if (data['assignModule'][i]['add'] == '1') {
              data['data']['add_survey'] = 1
            }
            if (data['assignModule'][i]['edit'] == '1') {
              data['data']['edit_survey'] = 1
            }
          }
          else if (data['assignModule'][i]['module_name'] == 'Gift Gallery' && data['assignModule'][i]['view'] == '1') {
            data['data']['view_gift'] = 1
            if (data['assignModule'][i]['export'] == '1') {
              data['data']['export_gift_gallery'] = 1
            }
            if (data['assignModule'][i]['add'] == '1') {
              data['data']['add_gift_gallery'] = 1
            }
            if (data['assignModule'][i]['edit'] == '1') {
              data['data']['edit_gift_gallery'] = 1
            }
          }
          else if (data['assignModule'][i]['module_name'] == 'Bonus Point' && data['assignModule'][i]['view'] == '1') {
            data['data']['view_bonus_points'] = 1
            if (data['assignModule'][i]['export'] == '1') {
              data['data']['export_bonus_points'] = 1
            }
            if (data['assignModule'][i]['add'] == '1') {
              data['data']['add_bonus_points'] = 1
            }
            if (data['assignModule'][i]['edit'] == '1') {
              data['data']['edit_bonus_points'] = 1
            }
          }
          else if (data['assignModule'][i]['module_name'] == 'Qr Code') {

            if (data['assignModule'][i]['view'] == '1') {
              data['data']['view_coupon_code'] = 1
            }

            if (data['assignModule'][i]['export'] == '1') {
              data['data']['export_coupon_code'] = 1
            }
            if (data['assignModule'][i]['add'] == '1') {
              data['data']['add_coupon_code'] = 1
            }
            if (data['assignModule'][i]['delete'] == '1') {
              data['data']['delete_coupon_code'] = 1
            }
          }

          else if (data['assignModule'][i]['module_name'] == 'Purchase') {

            if (data['assignModule'][i]['view'] == '1') {
              data['data']['view_purchase'] = 1
            }
            if (data['assignModule'][i]['add'] == '1') {
              data['data']['add_purchase'] = 1
            }
            if (data['assignModule'][i]['export'] == '1') {
              data['data']['export_purchase'] = 1
            }
            if (data['assignModule'][i]['edit'] == '1') {
              data['data']['edit_purchase'] = 1
            }
            if (data['assignModule'][i]['import'] == '1') {
              data['data']['import_purchase'] = 1
            }
          }

          else if (data['assignModule'][i]['module_name'] == 'Redeem Request' && data['assignModule'][i]['view'] == '1') {
            data['data']['view_redeem_request'] = 1
            if (data['assignModule'][i]['export'] == '1') {
              data['data']['export_redeem_request'] = 1
            }
            if (data['assignModule'][i]['edit'] == '1') {
              data['data']['edit_redeem_request'] = 1
            }
          }
          else if (data['assignModule'][i]['module_name'] == 'Target' && data['assignModule'][i]['view'] == '1') {
            data['data']['view_target'] = 1
            data['data']['view_employee_target'] = 1
            if (data['assignModule'][i]['add'] == '1') {
              data['data']['add_employee_target'] = 1
            }
            if (data['assignModule'][i]['edit'] == '1') {
              data['data']['edit_employee_target'] = 1
            }
            if (data['assignModule'][i]['export'] == '1') {
              data['data']['export_employee_target'] = 1
            }
            if (data['assignModule'][i]['delete'] == '1') {
              data['data']['delete_employee_target'] = 1
            }
            if (data['assignModule'][i]['import'] == '1') {
              data['data']['import_employee_target'] = 1
            }
          }
          else if (data['assignModule'][i]['module_name'] == 'Target' && data['assignModule'][i]['view'] == '1') {
            // else if (data['assignModule'][i]['module_name'] == 'Distributor Target' && data['assignModule'][i]['view'] == '1') {
            data['data']['view_target'] = 1
            data['data']['view_distributor_target'] = 1

            if (data['assignModule'][i]['add'] == '1') {
              data['data']['add_distributor_target'] = 1
            }
            if (data['assignModule'][i]['edit'] == '1') {
              data['data']['edit_distributor_target'] = 1
            }
            if (data['assignModule'][i]['export'] == '1') {
              data['data']['export_distributor_target'] = 1
            }
            if (data['assignModule'][i]['delete'] == '1') {
              data['data']['delete_distributor_target'] = 1
            }
            if (data['assignModule'][i]['import'] == '1') {
              data['data']['import_distributor_target'] = 1
            }
          }
          else if ((data['assignModule'][i]['module_name'] == 'Category') && data['assignModule'][i]['view'] == '1') {
            data['data']['view_master'] = 1
            data['data']['view_category'] = 1

            if (data['assignModule'][i]['add'] == '1') {
              data['data']['add_category_master'] = 1
            }
            if (data['assignModule'][i]['edit'] == '1') {
              data['data']['edit_category_master'] = 1
            }
            if (data['assignModule'][i]['export'] == '1') {
              data['data']['export_category_master'] = 1
            }
            if (data['assignModule'][i]['delete'] == '1') {
              data['data']['delete_category_master'] = 1
            }
            if (data['assignModule'][i]['import'] == '1') {
              data['data']['import_category_master'] = 1
            }
          }
          else if ((data['assignModule'][i]['module_name'] == 'Sub Category') && data['assignModule'][i]['view'] == '1') {
            data['data']['view_master'] = 1
            data['data']['view_sub_category'] = 1

            if (data['assignModule'][i]['add'] == '1') {
              data['data']['add_sub_category_master'] = 1
            }
            if (data['assignModule'][i]['edit'] == '1') {
              data['data']['edit_sub_category_master'] = 1
            }
            if (data['assignModule'][i]['export'] == '1') {
              data['data']['export_sub_category_master'] = 1
            }
            if (data['assignModule'][i]['delete'] == '1') {
              data['data']['delete_sub_category_master'] = 1
            }
            if (data['assignModule'][i]['import'] == '1') {
              data['data']['import_sub_category_master'] = 1
            }
          }
          else if ((data['assignModule'][i]['module_name'] == 'Products') && data['assignModule'][i]['view'] == '1') {
            data['data']['view_master'] = 1
            data['data']['view_products'] = 1

            if (data['assignModule'][i]['add'] == '1') {
              data['data']['add_products_master'] = 1
            }
            if (data['assignModule'][i]['edit'] == '1') {
              data['data']['edit_products_master'] = 1
            }
            if (data['assignModule'][i]['export'] == '1') {
              data['data']['export_products_master'] = 1
            }
            if (data['assignModule'][i]['delete'] == '1') {
              data['data']['delete_products_master'] = 1
            }
            if (data['assignModule'][i]['import'] == '1') {
              data['data']['import_products_master'] = 1
            }
          }
          else if ((data['assignModule'][i]['module_name'] == 'PDF') && data['assignModule'][i]['view'] == '1') {
            data['data']['view_master'] = 1
            data['data']['view_pdf'] = 1
            if (data['assignModule'][i]['add'] == '1') {
              data['data']['add_pdf_master'] = 1
            }
            if (data['assignModule'][i]['edit'] == '1') {
              data['data']['edit_pdf_master'] = 1
            }
            if (data['assignModule'][i]['export'] == '1') {
              data['data']['export_pdf_master'] = 1
            }
            if (data['assignModule'][i]['delete'] == '1') {
              data['data']['delete_pdf_master'] = 1
            }
            if (data['assignModule'][i]['import'] == '1') {
              data['data']['import_pdf_master'] = 1
            }
          }
          else if ((data['assignModule'][i]['module_name'] == 'Leave Master') && data['assignModule'][i]['view'] == '1') {
            data['data']['view_master'] = 1
            data['data']['view_leave_master'] = 1

            if (data['assignModule'][i]['add'] == '1') {
              data['data']['add_leave_master'] = 1
            }
            if (data['assignModule'][i]['edit'] == '1') {
              data['data']['edit_leave_master'] = 1
            }
            if (data['assignModule'][i]['export'] == '1') {
              data['data']['export_leave_master'] = 1
            }
            if (data['assignModule'][i]['delete'] == '1') {
              data['data']['delete_leave_master'] = 1
            }
            if (data['assignModule'][i]['import'] == '1') {
              data['data']['import_leave_master'] = 1
            }
          }
          else if ((data['assignModule'][i]['module_name'] == 'Users') && data['assignModule'][i]['view'] == '1') {
            data['data']['view_master'] = 1
            data['data']['view_users'] = 1
            if (data['assignModule'][i]['add'] == '1') {
              data['data']['add_users_master'] = 1
            }
            if (data['assignModule'][i]['edit'] == '1') {
              data['data']['edit_users_master'] = 1
            }
            if (data['assignModule'][i]['export'] == '1') {
              data['data']['export_users_master'] = 1
            }
            if (data['assignModule'][i]['delete'] == '1') {
              data['data']['delete_users_master'] = 1
            }
            if (data['assignModule'][i]['import'] == '1') {
              data['data']['import_users_master'] = 1
            }
          }
          else if ((data['assignModule'][i]['module_name'] == 'Designation') && data['assignModule'][i]['view'] == '1') {
            data['data']['view_master'] = 1
            data['data']['view_designation'] = 1
            if (data['assignModule'][i]['add'] == '1') {
              data['data']['add_users_designation'] = 1
            }
            if (data['assignModule'][i]['edit'] == '1') {
              data['data']['edit_users_designation'] = 1
            }
            if (data['assignModule'][i]['export'] == '1') {
              data['data']['export_users_designation'] = 1
            }
            if (data['assignModule'][i]['delete'] == '1') {
              data['data']['delete_users_designation'] = 1
            }
            if (data['assignModule'][i]['import'] == '1') {
              data['data']['import_users_designation'] = 1
            }
          }

          else if ((data['assignModule'][i]['module_name'] == 'Customer Category') && data['assignModule'][i]['view'] == '1') {
            data['data']['view_master'] = 1
            data['data']['view_customer_category'] = 1

            if (data['assignModule'][i]['add'] == '1') {
              data['data']['add_customer_master'] = 1
            }
            if (data['assignModule'][i]['edit'] == '1') {
              data['data']['edit_customer_master'] = 1
            }
            if (data['assignModule'][i]['export'] == '1') {
              data['data']['export_customer_master'] = 1
            }
            if (data['assignModule'][i]['delete'] == '1') {
              data['data']['delete_customer_master'] = 1
            }
            if (data['assignModule'][i]['import'] == '1') {
              data['data']['import_customer_master'] = 1
            }
          }
          else if ((data['assignModule'][i]['module_name'] == 'Influencer Category') && data['assignModule'][i]['view'] == '1') {
            data['data']['view_master'] = 1
            data['data']['view_infulencer_category'] = 1

            if (data['assignModule'][i]['add'] == '1') {
              data['data']['add_infulencer_master'] = 1
            }
            if (data['assignModule'][i]['edit'] == '1') {
              data['data']['edit_infulencer_master'] = 1
            }
            if (data['assignModule'][i]['export'] == '1') {
              data['data']['export_infulencer_master'] = 1
            }
            if (data['assignModule'][i]['delete'] == '1') {
              data['data']['delete_infulencer_master'] = 1
            }
            if (data['assignModule'][i]['import'] == '1') {
              data['data']['import_infulencer_master'] = 1
            }
          }
          else if ((data['assignModule'][i]['module_name'] == 'Point Category') && data['assignModule'][i]['view'] == '1') {
            data['data']['view_master'] = 1
            data['data']['view_point_category'] = 1


            if (data['assignModule'][i]['add'] == '1') {
              data['data']['add_point_master'] = 1
            }
            if (data['assignModule'][i]['edit'] == '1') {
              data['data']['edit_point_master'] = 1
            }
            if (data['assignModule'][i]['export'] == '1') {
              data['data']['export_point_master'] = 1
            }
            if (data['assignModule'][i]['delete'] == '1') {
              data['data']['delete_point_master'] = 1
            }
            if (data['assignModule'][i]['import'] == '1') {
              data['data']['import_point_master'] = 1
            }
          }
          else if ((data['assignModule'][i]['module_name'] == 'Holiday') && data['assignModule'][i]['view'] == '1') {
            data['data']['view_master'] = 1
            data['data']['view_holiday'] = 1
            if (data['assignModule'][i]['add'] == '1') {
              data['data']['add_holiday_master'] = 1
            }
            if (data['assignModule'][i]['edit'] == '1') {
              data['data']['edit_holiday_master'] = 1
            }
            if (data['assignModule'][i]['export'] == '1') {
              data['data']['export_holiday_master'] = 1
            }
            if (data['assignModule'][i]['delete'] == '1') {
              data['data']['delete_holiday_master'] = 1
            }
            if (data['assignModule'][i]['import'] == '1') {
              data['data']['import_holiday_master'] = 1
            }
          }
          else if ((data['assignModule'][i]['module_name'] == 'Gallery') && data['assignModule'][i]['view'] == '1') {
            data['data']['view_master'] = 1
            data['data']['view_gallery'] = 1
            if (data['assignModule'][i]['add'] == '1') {
              data['data']['add_gallery_master'] = 1
            }
            if (data['assignModule'][i]['edit'] == '1') {
              data['data']['edit_gallery_master'] = 1
            }
            if (data['assignModule'][i]['export'] == '1') {
              data['data']['export_gallery_master'] = 1
            }
            if (data['assignModule'][i]['delete'] == '1') {
              data['data']['delete_gallery_master'] = 1
            }
            if (data['assignModule'][i]['import'] == '1') {
              data['data']['import_gallery_master'] = 1
            }
          }
          else if ((data['assignModule'][i]['module_name'] == 'Faq') && data['assignModule'][i]['view'] == '1') {
            data['data']['view_master'] = 1
            data['data']['view_faq'] = 1
            if (data['assignModule'][i]['add'] == '1') {
              data['data']['add_faq_master'] = 1
            }
            if (data['assignModule'][i]['edit'] == '1') {
              data['data']['edit_faq_master'] = 1
            }
            if (data['assignModule'][i]['export'] == '1') {
              data['data']['export_faq_master'] = 1
            }
            if (data['assignModule'][i]['delete'] == '1') {
              data['data']['delete_faq_master'] = 1
            }
            if (data['assignModule'][i]['import'] == '1') {
              data['data']['import_faq_master'] = 1
            }
          }
          else if ((data['assignModule'][i]['module_name'] == 'Referral Points Master') && data['assignModule'][i]['view'] == '1') {
            data['data']['view_master'] = 1
            data['data']['view_referral_point_master'] = 1

            if (data['assignModule'][i]['add'] == '1') {
              data['data']['add_referral_point_master'] = 1
            }
            if (data['assignModule'][i]['edit'] == '1') {
              data['data']['edit_referral_point_master'] = 1
            }
            if (data['assignModule'][i]['export'] == '1') {
              data['data']['export_referral_point_master'] = 1
            }
            if (data['assignModule'][i]['delete'] == '1') {
              data['data']['delete_referral_point_master'] = 1
            }
            if (data['assignModule'][i]['import'] == '1') {
              data['data']['import_referral_point_master'] = 1
            }
          }
          else if ((data['assignModule'][i]['module_name'] == 'Allowance Master') && data['assignModule'][i]['view'] == '1') {
            data['data']['view_master'] = 1
            data['data']['view_allowance_master'] = 1

            if (data['assignModule'][i]['add'] == '1') {
              data['data']['add_allowance_master'] = 1
            }
            if (data['assignModule'][i]['edit'] == '1') {
              data['data']['edit_allowance_master'] = 1
            }
            if (data['assignModule'][i]['export'] == '1') {
              data['data']['export_allowance_master'] = 1
            }
            if (data['assignModule'][i]['delete'] == '1') {
              data['data']['delete_allowance_master'] = 1
            }
            if (data['assignModule'][i]['import'] == '1') {
              data['data']['import_allowance_master'] = 1
            }
          }
          else if ((data['assignModule'][i]['module_name'] == 'Territory Code') && data['assignModule'][i]['view'] == '1') {
            data['data']['view_master'] = 1
            data['data']['view_territory_master'] = 1

            if (data['assignModule'][i]['add'] == '1') {
              data['data']['add_territory_master'] = 1
            }
            if (data['assignModule'][i]['edit'] == '1') {
              data['data']['edit_territory_master'] = 1
            }
            if (data['assignModule'][i]['export'] == '1') {
              data['data']['export_territory_master'] = 1
            }
            if (data['assignModule'][i]['delete'] == '1') {
              data['data']['delete_territory_master'] = 1
            }
            if (data['assignModule'][i]['import'] == '1') {
              data['data']['import_territory_master'] = 1
            }
          }
          else if (data['assignModule'][i]['module_name'] == 'Ticket' && data['assignModule'][i]['view'] == '1') {
            data['data']['view_support'] = 1
            if (data['assignModule'][i]['edit'] == '1') {
              data['data']['edit_support'] = 1
            }
            if (data['assignModule'][i]['export'] == '1') {
              data['data']['export_support'] = 1
            }
          }
          else if (data['assignModule'][i]['module_name'] == 'Task' && data['assignModule'][i]['view'] == '1') {
            data['data']['view_task'] = 1
            if (data['assignModule'][i]['add'] == '1') {
              data['data']['add_task'] = 1
            }
            if (data['assignModule'][i]['export'] == '1') {
              data['data']['export_task'] = 1
            }
          }
          else if (data['assignModule'][i]['module_name'] == 'kra kpi' && data['assignModule'][i]['view'] == '1') {
            data['data']['view_kra_kpi'] = 1
            if (data['assignModule'][i]['add'] == '1') {
              data['data']['add_kra_kpi'] = 1
            }
            if (data['assignModule'][i]['delete'] == '1') {
              data['data']['delete_kra_kpi'] = 1
            }
            if (data['assignModule'][i]['edit'] == '1') {
              data['data']['edit_kra_kpi'] = 1
            }
            if (data['assignModule'][i]['export'] == '1') {
              data['data']['export_kra_kpi'] = 1
            }
            if (data['assignModule'][i]['import'] == '1') {
              data['data']['import_kra_kpi'] = 1
            }
          }

          else if (data['assignModule'][i]['module_name'] == 'Sales Return' && data['assignModule'][i]['view'] == '1') {
            data['data']['view_sales_return'] = 1
            if (data['assignModule'][i]['edit'] == '1') {
              data['data']['edit_sales_return'] = 1
            }
            if (data['assignModule'][i]['delete'] == '1') {
              data['data']['delete_sales_return'] = 1
            }
            if (data['assignModule'][i]['add'] == '1') {
              data['data']['add_sales_return'] = 1
            }

            if (data['assignModule'][i]['export'] == '1') {
              data['data']['download_sales_return'] = 1
            }

            if (data['assignModule'][i]['import'] == '1') {
              data['data']['upload_sales_return'] = 1
            }
          }

          else if (data['assignModule'][i]['module_name'] == 'Manual Dispatch' && data['assignModule'][i]['view'] == '1') {
            data['data']['view_manual_dispatch'] = 1

            if (data['assignModule'][i]['edit'] == '1') {
              data['data']['edit_manual_dispatch'] = 1
            }
            if (data['assignModule'][i]['delete'] == '1') {
              data['data']['delete_manual_dispatch'] = 1
            }
            if (data['assignModule'][i]['add'] == '1') {
              data['data']['add_manual_dispatch'] = 1
            }

            if (data['assignModule'][i]['export'] == '1') {
              data['data']['download_manual_dispatch'] = 1
            }

            if (data['assignModule'][i]['import'] == '1') {
              data['data']['upload_manual_dispatch'] = 1
            }
          }

          else if (data['assignModule'][i]['module_name'] == 'Sfa Report' && data['assignModule'][i]['view'] == '1') {
            data['data']['view_sfa_report'] = 1
            if (data['assignModule'][i]['edit'] == '1') {
              data['data']['edit_sfa_report'] = 1
            }
            if (data['assignModule'][i]['export'] == '1') {
              data['data']['download_sfa_report'] = 1
            }
            if (data['assignModule'][i]['import'] == '1') {
              data['data']['upload_sfa_report'] = 1
            }
          }

          else if (data['assignModule'][i]['module_name'] == 'Loyalty Report' && data['assignModule'][i]['view'] == '1') {
            data['data']['view_loyalty_report'] = 1
            if (data['assignModule'][i]['edit'] == '1') {
              data['data']['edit_loyalty_report'] = 1
            }
            if (data['assignModule'][i]['export'] == '1') {
              data['data']['download_loyalty_report'] = 1
            }
            if (data['assignModule'][i]['import'] == '1') {
              data['data']['upload_loyalty_report'] = 1
            }
          }

          else if (data['assignModule'][i]['module_name'] == 'Sfa Report' && data['assignModule'][i]['view'] == '1') {
            data['data']['view_sfa_report'] = 1
            if (data['assignModule'][i]['edit'] == '1') {
              data['data']['edit_sfa_report'] = 1
            }
            if (data['assignModule'][i]['export'] == '1') {
              data['data']['download_sfa_report'] = 1
            }
            if (data['assignModule'][i]['import'] == '1') {
              data['data']['upload_sfa_report'] = 1
            }
          }






          else if (data['assignModule'][i]['module_name'] == 'Dispatch Packing' && data['assignModule'][i]['view'] == '1') {
            data['data']['view_dispatch_packing'] = 1
            if (data['assignModule'][i]['add'] == '1') {
              data['data']['add_dispatch_packing'] = 1
            }
            if (data['assignModule'][i]['export'] == '1') {
              data['data']['download_dispatch_packing'] = 1
            }
          }
          else if (data['assignModule'][i]['module_name'] == 'Dispatch Billing' && data['assignModule'][i]['view'] == '1') {
            data['data']['view_dispatch_billing'] = 1
            if (data['assignModule'][i]['add'] == '1') {
              data['data']['add_dispatch_billing'] = 1
            }
            if (data['assignModule'][i]['export'] == '1') {
              data['data']['download_dispatch_billing'] = 1
            }
          }
          else if (data['assignModule'][i]['module_name'] == 'Dispatch Guard' && data['assignModule'][i]['view'] == '1') {
            data['data']['view_dispatch_guard'] = 1
            if (data['assignModule'][i]['add'] == '1') {
              data['data']['add_dispatch_guard'] = 1
            }
            if (data['assignModule'][i]['export'] == '1') {
              data['data']['download_dispatch_guard'] = 1
            }
          }
          else if ((data['assignModule'][i]['module_name'] == 'Scheme Incentive') && data['assignModule'][i]['view'] == '1') {
            data['data']['view_scheme'] = 1
            if (data['assignModule'][i]['add'] == '1') {
              data['data']['add_scheme'] = 1
            }
            if (data['assignModule'][i]['edit'] == '1') {
              data['data']['edit_scheme'] = 1
            }
            if (data['assignModule'][i]['export'] == '1') {
              data['data']['export_scheme'] = 1
            }
            if (data['assignModule'][i]['delete'] == '1') {
              data['data']['delete_scheme'] = 1
            }
            if (data['assignModule'][i]['import'] == '1') {
              data['data']['import_scheme'] = 1
            }
          }
          else if ((data['assignModule'][i]['module_name'] == 'Stock') && data['assignModule'][i]['view'] == '1') {
            data['data']['view_stock'] = 1
            if (data['assignModule'][i]['add'] == '1') {
              data['data']['add_stock'] = 1
            }
            if (data['assignModule'][i]['edit'] == '1') {
              data['data']['edit_stock'] = 1
            }
            if (data['assignModule'][i]['export'] == '1') {
              data['data']['export_stock'] = 1
            }
            if (data['assignModule'][i]['delete'] == '1') {
              data['data']['delete_stock'] = 1
            }
            if (data['assignModule'][i]['import'] == '1') {
              data['data']['import_stock'] = 1
            }
          }
          else if ((data['assignModule'][i]['module_name'] == 'App Control') && data['assignModule'][i]['view'] == '1') {
            data['data']['view_app_control'] = 1
            if (data['assignModule'][i]['add'] == '1') {
              data['data']['add_app_control'] = 1
            }
            if (data['assignModule'][i]['edit'] == '1') {
              data['data']['edit_app_control'] = 1
            }
            if (data['assignModule'][i]['export'] == '1') {
              data['data']['export_app_control'] = 1
            }
            if (data['assignModule'][i]['delete'] == '1') {
              data['data']['delete_app_control'] = 1
            }
            if (data['assignModule'][i]['import'] == '1') {
              data['data']['import_app_control'] = 1
            }
          }
          else if ((data['assignModule'][i]['module_name'] == 'Brand Audit') && data['assignModule'][i]['view'] == '1') {
            data['data']['view_brand_audit'] = 1
            if (data['assignModule'][i]['add'] == '1') {
              data['data']['add_brand_audit'] = 1
            }
            if (data['assignModule'][i]['edit'] == '1') {
              data['data']['edit_brand_audit'] = 1
            }
            if (data['assignModule'][i]['export'] == '1') {
              data['data']['export_brand_audit'] = 1
            }
            if (data['assignModule'][i]['delete'] == '1') {
              data['data']['delete_brand_audit'] = 1
            }
            if (data['assignModule'][i]['import'] == '1') {
              data['data']['import_brand_audit'] = 1
            }
          }
          else if ((data['assignModule'][i]['module_name'] == 'Complaint List') && data['assignModule'][i]['view'] == '1') {
            data['data']['view_complaint'] = 1
            if (data['assignModule'][i]['add'] == '1') {
              data['data']['add_complaint'] = 1
            }
            if (data['assignModule'][i]['edit'] == '1') {
              data['data']['edit_complaint'] = 1
            }
            if (data['assignModule'][i]['export'] == '1') {
              data['data']['export_complaint'] = 1
            }
            if (data['assignModule'][i]['delete'] == '1') {
              data['data']['delete_complaint'] = 1
            }
            if (data['assignModule'][i]['import'] == '1') {
              data['data']['import_complaint'] = 1
            }
          }
          else if ((data['assignModule'][i]['module_name'] == 'Customer') && data['assignModule'][i]['view'] == '1') {
            data['data']['view_customer'] = 1
            if (data['assignModule'][i]['add'] == '1') {
              data['data']['add_customer'] = 1
            }
            if (data['assignModule'][i]['edit'] == '1') {
              data['data']['edit_customer'] = 1
            }
            if (data['assignModule'][i]['export'] == '1') {
              data['data']['export_customer'] = 1
            }
            if (data['assignModule'][i]['delete'] == '1') {
              data['data']['delete_customer'] = 1
            }
            if (data['assignModule'][i]['import'] == '1') {
              data['data']['import_customer'] = 1
            }
          }
          else if ((data['assignModule'][i]['module_name'] == 'Warranty Registration') && data['assignModule'][i]['view'] == '1') {
            data['data']['view_warranty'] = 1
            if (data['assignModule'][i]['add'] == '1') {
              data['data']['add_warranty'] = 1
            }
            if (data['assignModule'][i]['edit'] == '1') {
              data['data']['edit_warranty'] = 1
            }
            if (data['assignModule'][i]['export'] == '1') {
              data['data']['export_warranty'] = 1
            }
            if (data['assignModule'][i]['delete'] == '1') {
              data['data']['delete_warranty'] = 1
            }
            if (data['assignModule'][i]['import'] == '1') {
              data['data']['import_warranty'] = 1
            }
          }
          else if ((data['assignModule'][i]['module_name'] == 'Installation List') && data['assignModule'][i]['view'] == '1') {
            data['data']['view_installation'] = 1
            if (data['assignModule'][i]['add'] == '1') {
              data['data']['add_installation'] = 1
            }
            if (data['assignModule'][i]['edit'] == '1') {
              data['data']['edit_installation'] = 1
            }
            if (data['assignModule'][i]['export'] == '1') {
              data['data']['export_installation'] = 1
            }
            if (data['assignModule'][i]['delete'] == '1') {
              data['data']['delete_installation'] = 1
            }
            if (data['assignModule'][i]['import'] == '1') {
              data['data']['import_installation'] = 1
            }
          }
          else if ((data['assignModule'][i]['module_name'] == 'Spare Part') && data['assignModule'][i]['view'] == '1') {
            data['data']['view_spare'] = 1
            if (data['assignModule'][i]['add'] == '1') {
              data['data']['add_spare'] = 1
            }
            if (data['assignModule'][i]['edit'] == '1') {
              data['data']['edit_spare'] = 1
            }
            if (data['assignModule'][i]['export'] == '1') {
              data['data']['export_spare'] = 1
            }
            if (data['assignModule'][i]['delete'] == '1') {
              data['data']['delete_spare'] = 1
            }
            if (data['assignModule'][i]['import'] == '1') {
              data['data']['import_spare'] = 1
            }
          }
          else if ((data['assignModule'][i]['module_name'] == 'Invoice') && data['assignModule'][i]['view'] == '1') {
            data['data']['view_invoice'] = 1
            if (data['assignModule'][i]['add'] == '1') {
              data['data']['add_invoice'] = 1
            }
            if (data['assignModule'][i]['edit'] == '1') {
              data['data']['edit_invoice'] = 1
            }
            if (data['assignModule'][i]['export'] == '1') {
              data['data']['export_invoice'] = 1
            }
            if (data['assignModule'][i]['delete'] == '1') {
              data['data']['delete_invoice'] = 1
            }
            if (data['assignModule'][i]['import'] == '1') {
              data['data']['import_invoice'] = 1
            }
          }
          else if ((data['assignModule'][i]['module_name'] == 'Complaint Visit') && data['assignModule'][i]['view'] == '1') {
            data['data']['view_complaint_visit'] = 1
            if (data['assignModule'][i]['add'] == '1') {
              data['data']['add_complaint_visit'] = 1
            }
            if (data['assignModule'][i]['edit'] == '1') {
              data['data']['edit_complaint_visit'] = 1
            }
            if (data['assignModule'][i]['export'] == '1') {
              data['data']['export_complaint_visit'] = 1
            }
            if (data['assignModule'][i]['delete'] == '1') {
              data['data']['delete_complaint_visit'] = 1
            }
            if (data['assignModule'][i]['import'] == '1') {
              data['data']['import_complaint_visit'] = 1
            }
          }

          else if ((data['assignModule'][i]['module_name'] == 'Site') && data['assignModule'][i]['view'] == '1') {
            data['data']['view_site'] = 1
            if (data['assignModule'][i]['add'] == '1') {
              data['data']['add_site'] = 1
            }
            if (data['assignModule'][i]['edit'] == '1') {
              data['data']['edit_site'] = 1
            }
            if (data['assignModule'][i]['export'] == '1') {
              data['data']['export_site'] = 1
            }
            if (data['assignModule'][i]['delete'] == '1') {
              data['data']['delete_site'] = 1
            }
            if (data['assignModule'][i]['import'] == '1') {
              data['data']['import_site'] = 1
            }
          }


          else if ((data['assignModule'][i]['module_name'] == 'Loyalty') && data['assignModule'][i]['view'] == '1') {
            data['data']['view_loyalty'] = 1
          }

        }




      }

      else if (data['data']['id'] == '1' && data['data']['user_type'] != 'DMS') {

        // data['data']['view_enquiry'] = 1;
        // data['data']['edit_enquiry'] = 1;
        // data['data']['add_enquiry'] = 1;
        // data['data']['delete_enquiry'] = 1;
        // data['data']['export_enquiry'] = 1;
        // data['data']['import_enquiry'] = 1;

        // data['data']['view_dashboard'] = 1

        // data['data']['view_influencer_network'] = 1
        // data['data']['add_influencer'] = 1;
        // data['data']['export_influencer'] = 1;
        // data['data']['edit_influencer'] = 1;

        // data['data']['view_customer_network'] = 1;


        // data['data']['add_customer_network'] = 1;
        // data['data']['edit_customer_network'] = 1;
        // data['data']['export_customer_network'] = 1;
        // data['data']['import_customer_network'] = 1;

        // data['data']['view_channel_partner'] = 1;

        // data['data']['add_channel_partner'] = 1;
        // data['data']['import_channel_partner'] = 1;
        // data['data']['export_channel_partner'] = 1;
        // data['data']['edit_channel_partner'] = 1;

        // data['data']['view_dealer'] = 1
        // data['data']['add_dealer'] = 1;
        // data['data']['import_dealer'] = 1;
        // data['data']['export_dealer'] = 1;
        // data['data']['edit_dealer'] = 1;

        // data['data']['view_direct_dealers'] = 1
        // data['data']['add_direct_dealers'] = 1;
        // data['data']['import_direct_dealers'] = 1;
        // data['data']['export_direct_dealers'] = 1;
        // data['data']['edit_direct_dealers'] = 1;

        // data['data']['view_orders'] = 1
        // data['data']['add_order'] = 1;
        // data['data']['export_order'] = 1;
        // data['data']['edit_order'] = 1;
        // data['data']['delete_order'] = 1;

        // data['data']['view_primary_orders'] = 1
        // data['data']['add_primary_order'] = 1;
        // data['data']['export_primary_order'] = 1;
        // data['data']['edit_primary_order'] = 1;
        // data['data']['delete_primary_order'] = 1;

        // data['data']['view_secondary_orders'] = 1;
        // data['data']['add_secondary_orders'] = 1;
        // data['data']['export_secondary_orders'] = 1;
        // data['data']['edit_secondary_orders'] = 1;
        // data['data']['delete_secondary_orders'] = 1;



        // data['data']['view_accounts'] = 1
        // data['data']['view_invoice'] = 1
        // data['data']['view_payment'] = 1
        // data['data']['import_accounts'] = 1
        // data['data']['export_accounts'] = 1

        // data['data']['view_attendence'] = 1
        // data['data']['export_attendence'] = 1
        // data['data']['edit_attendence'] = 1

        // data['data']['view_check_in'] = 1
        // data['data']['export_checkin'] = 1

        // data['data']['view_leaves'] = 1
        // data['data']['export_leaves'] = 1
        // data['data']['edit_leaves'] = 1

        // data['data']['view_travel_plan'] = 1
        // data['data']['delete_travel_list'] = 1
        // data['data']['export_travel_list'] = 1
        // data['data']['edit_travel_list'] = 1
        // data['data']['import_travel_list'] = 1

        // data['data']['add_travel_list'] = 1

        // data['data']['view_follow_up'] = 1
        // data['data']['export_follow_up'] = 1
        // data['data']['delete_follow_up'] = 1
        // data['data']['add_follow_up'] = 1

        // data['data']['view_announcement'] = 1
        // data['data']['add_announcement'] = 1

        // data['data']['view_expense'] = 1
        // data['data']['export_expense'] = 1
        // data['data']['edit_expense'] = 1
        // data['data']['add_expense'] = 1

        // data['data']['view_event_plan'] = 1
        // data['data']['edit_event_plan'] = 1
        // data['data']['add_event_plan'] = 1




        // data['data']['view_pop_gift'] = 1
        // data['data']['edit_pop_gift'] = 1
        // data['data']['delete_pop_gift'] = 1
        // data['data']['export_pop_gift'] = 1
        // data['data']['add_pop_gift'] = 1

        // data['data']['view_survey'] = 1
        // data['data']['add_survey'] = 1
        // data['data']['edit_survey'] = 1
        // data['data']['export_survey'] = 1

        // data['data']['view_gift'] = 1
        // data['data']['edit_gift_gallery'] = 1
        // data['data']['export_gift_gallery'] = 1
        // data['data']['add_gift_gallery'] = 1


        // data['data']['view_bonus_points'] = 1
        // data['data']['add_bonus_points'] = 1
        // data['data']['edit_bonus_points'] = 1
        // data['data']['export_bonus_points'] = 1


        // data['data']['view_coupon_code'] = 1
        // data['data']['export_coupon_code'] = 1
        // data['data']['add_coupon_code'] = 1
        // data['data']['delete_coupon_code'] = 1

        // data['data']['view_redeem_request'] = 1
        // data['data']['export_redeem_request'] = 1
        // data['data']['edit_redeem_request'] = 1

        // data['data']['view_target'] = 1
        // data['data']['view_employee_target'] = 1
        // data['data']['add_employee_target'] = 1
        // data['data']['edit_employee_target'] = 1
        // data['data']['export_employee_target'] = 1
        // data['data']['delete_employee_target'] = 1
        // data['data']['import_employee_target'] = 1

        // data['data']['view_distributor_target'] = 1
        // data['data']['add_distributor_target'] = 1
        // data['data']['edit_distributor_target'] = 1
        // data['data']['export_distributor_target'] = 1
        // data['data']['delete_distributor_target'] = 1
        // data['data']['import_distributor_target'] = 1


        data['data']['view_master'] = 1

        data['data']['view_video_tutorial'] = 1
        data['data']['add_video_tutorial'] = 1
        data['data']['view_designation'] = 1
        data['data']['add_users_designation'] = 1
        data['data']['edit_users_designation'] = 1
        data['data']['export_users_designation'] = 1
        data['data']['delete_users_designation'] = 1
        data['data']['import_users_designation'] = 1

        // data['data']['view_category'] = 1
        // data['data']['view_sub_category'] = 1
        // data['data']['view_customer_category'] = 1
        // data['data']['view_infulencer_category'] = 1
        // data['data']['view_point_category'] = 1
        // data['data']['view_holiday'] = 1
        // data['data']['view_leave_master'] = 1
        // data['data']['view_referral_point_master'] = 1

        data['data']['view_users'] = 1
        data['data']['add_users_master'] = 1
        data['data']['edit_users_master'] = 1
        // data['data']['export_users_master'] = 1
        // data['data']['delete_users_master'] = 1
        // data['data']['import_users_master'] = 1


        // data['data']['view_sub_category'] = 1
        // data['data']['add_sub_category_master'] = 1
        // data['data']['edit_sub_category_master'] = 1
        // data['data']['export_sub_category_master'] = 1
        // data['data']['delete_sub_category_master'] = 1
        // data['data']['import_sub_category_master'] = 1

        // data['data']['view_purchase'] = 1
        // data['data']['add_purchase'] = 1
        // data['data']['export_purchase'] = 1
        // data['data']['edit_purchase'] = 1
        // data['data']['import_purchase'] = 1

        data['data']['edit_master'] = 1
        data['data']['add_master'] = 1
        data['data']['delete_master'] = 1
        data['data']['export_master'] = 1
        data['data']['import_master'] = 1

        // data['data']['view_gallery'] = 1
        // data['data']['add_gallery_master'] = 1
        // data['data']['edit_gallery_master'] = 1
        // data['data']['export_gallery_master'] = 1
        // data['data']['delete_gallery_master'] = 1
        // data['data']['import_gallery_master'] = 1

        // data['data']['view_products'] = 1
        // data['data']['add_products_master'] = 1
        // data['data']['edit_products_master'] = 1
        // data['data']['export_products_master'] = 1
        // data['data']['delete_products_master'] = 1
        // data['data']['import_products_master'] = 1


        // data['data']['import_customer_master'] = 1
        // data['data']['delete_customer_master'] = 1
        // data['data']['export_customer_master'] = 1
        // data['data']['add_customer_master'] = 1
        // data['data']['edit_customer_master'] = 1

        // data['data']['add_infulencer_master'] = 1
        // data['data']['edit_infulencer_master'] = 1
        // data['data']['export_infulencer_master'] = 1
        // data['data']['delete_infulencer_master'] = 1
        // data['data']['import_infulencer_master'] = 1

        // data['data']['add_holiday_master'] = 1
        // data['data']['edit_holiday_master'] = 1
        // data['data']['export_holiday_master'] = 1
        // data['data']['delete_holiday_master'] = 1
        // data['data']['import_holiday_master'] = 1

        // data['data']['view_category'] = 1
        // data['data']['add_category_master'] = 1
        // data['data']['edit_category_master'] = 1
        // data['data']['export_category_master'] = 1
        // data['data']['delete_category_master'] = 1
        // data['data']['import_category_master'] = 1


        // data['data']['add_point_master'] = 1
        // data['data']['edit_point_master'] = 1
        // data['data']['export_point_master'] = 1
        // data['data']['delete_point_master'] = 1
        // data['data']['import_point_master'] = 1

        // data['data']['view_allowance_master'] = 1
        // data['data']['add_allowance_master'] = 1
        // data['data']['edit_allowance_master'] = 1
        // data['data']['export_allowance_master'] = 1
        // data['data']['delete_allowance_master'] = 1
        // data['data']['import_allowance_master'] = 1

        // data['data']['view_leave_master'] = 1
        // data['data']['add_leave_master'] = 1
        // data['data']['edit_leave_master'] = 1
        // data['data']['export_leave_master'] = 1
        // data['data']['delete_leave_master'] = 1
        // data['data']['import_leave_master'] = 1

        // data['data']['view_pdf'] = 1
        // data['data']['add_pdf_master'] = 1
        // data['data']['edit_pdf_master'] = 1
        // data['data']['export_pdf_master'] = 1
        // data['data']['delete_pdf_master'] = 1
        // data['data']['import_pdf_master'] = 1


        // data['data']['view_support'] = 1
        // data['data']['export_support'] = 1
        // data['data']['edit_support'] = 1

        // data['data']['view_task'] = 1
        // data['data']['add_task'] = 1
        // data['data']['export_task'] = 1

        // data['data']['view_sales_return'] = 1
        // data['data']['add_sales_return'] = 1
        // data['data']['edit_sales_return'] = 1
        // data['data']['delete_sales_return'] = 1
        // data['data']['download_sales_return'] = 1
        // data['data']['upload_sales_return'] = 1

        // data['data']['view_manual_dispatch'] = 1
        // data['data']['edit_manual_dispatch'] = 1
        // data['data']['delete_manual_dispatch'] = 1
        // data['data']['add_manual_dispatch'] = 1
        // data['data']['download_manual_dispatch'] = 1
        // data['data']['upload_manual_dispatch'] = 1




        // 
        // data['data']['edit_sfa_report'] = 1
        // data['data']['download_sfa_report'] = 1
        // data['data']['upload_sfa_report'] = 1



        //  data['data']['edit_loyalty_report'] = 1
        // data['data']['download_loyalty_report'] = 1
        // data['data']['upload_loyalty_report'] = 1






        // data['data']['view_dispatch_packing'] = 1
        // data['data']['add_dispatch_packing'] = 1
        // data['data']['download_dispatch_packing'] = 1

        // data['data']['view_dispatch_billing'] = 1
        // data['data']['add_dispatch_billing'] = 1
        // data['data']['download_dispatch_billing'] = 1

        // data['data']['view_kra_kpi'] = 1
        // data['data']['add_kra_kpi'] = 1
        // data['data']['delete_kra_kpi'] = 1
        // data['data']['edit_kra_kpi'] = 1
        // data['data']['export_kra_kpi'] = 1
        // data['data']['import_kra_kpi'] = 1


        // data['data']['view_dispatch_guard'] = 1
        // data['data']['add_dispatch_guard'] = 1
        // data['data']['download_dispatch_guard'] = 1



        // data['data']['view_scheme'] = 1;
        // data['data']['edit_scheme'] = 1;
        // data['data']['add_scheme'] = 1;
        // data['data']['delete_scheme'] = 1;
        // data['data']['export_scheme'] = 1;
        // data['data']['import_scheme'] = 1;

        // data['data']['view_stock'] = 1;
        // data['data']['edit_stock'] = 1;
        // data['data']['add_stock'] = 1;
        // data['data']['delete_stock'] = 1;
        // data['data']['export_stock'] = 1;
        // data['data']['import_stock'] = 1;

        // data['data']['view_app_control'] = 1;
        // data['data']['edit_app_control'] = 1;
        // data['data']['add_app_control'] = 1;
        // data['data']['delete_app_control'] = 1;
        // data['data']['export_app_control'] = 1;
        // data['data']['import_app_control'] = 1;


        // data['data']['view_brand_audit'] = 1;
        // data['data']['edit_brand_audit'] = 1;
        // data['data']['add_brand_audit'] = 1;
        // data['data']['delete_brand_audit'] = 1;
        // data['data']['export_brand_audit'] = 1;
        // data['data']['import_brand_audit'] = 1;

        // data['data']['view_complaint'] = 1;
        // data['data']['edit_complaint'] = 1;
        // data['data']['add_complaint'] = 1;
        // data['data']['delete_complaint'] = 1;
        // data['data']['export_complaint'] = 1;
        // data['data']['import_complaint'] = 1;

        // data['data']['view_customer'] = 1;
        // data['data']['edit_customer'] = 1;
        // data['data']['add_customer'] = 1;
        // data['data']['delete_customer'] = 1;
        // data['data']['export_customer'] = 1;
        // data['data']['import_customer'] = 1;


        // data['data']['view_warranty'] = 1;
        // data['data']['edit_warranty'] = 1;
        // data['data']['add_warranty'] = 1;
        // data['data']['delete_warranty'] = 1;
        // data['data']['export_warranty'] = 1;
        // data['data']['import_warranty'] = 1;


        // data['data']['view_installation'] = 1;
        // data['data']['edit_installation'] = 1;
        // data['data']['add_installation'] = 1;
        // data['data']['delete_installation'] = 1;
        // data['data']['export_installation'] = 1;
        // data['data']['import_installation'] = 1;


        // data['data']['view_spare'] = 1;
        // data['data']['edit_spare'] = 1;
        // data['data']['add_spare'] = 1;
        // data['data']['delete_spare'] = 1;
        // data['data']['export_spare'] = 1;
        // data['data']['import_spare'] = 1;

        // data['data']['view_invoice'] = 1;
        // data['data']['export_nvoice'] = 1;
        // data['data']['import_nvoice'] = 1;


        // data['data']['view_complaint_visit'] = 1;
        // data['data']['edit_complaint_visit'] = 1;
        // data['data']['add_complaint_visit'] = 1;
        // data['data']['delete_complaint_visit'] = 1;
        // data['data']['export_complaint_visit'] = 1;
        // data['data']['import_complaint_visit'] = 1;


        // data['data']['view_site'] = 1
        // data['data']['add_site'] = 1
        // data['data']['edit_site'] = 1
        // data['data']['export_site'] = 1
        // data['data']['delete_site'] = 1
        // data['data']['import_site'] = 1
      }


      if (data['message'] == 'Success') {
        if (data['assignModule'].length == 0 && data['data']['id'] != '1' && data['data']['type'] != '1') {
          this.savingFlag = false;
          this.dialog.error("No module assigned to you. Please contact to Support.");
          return;
        }
        this.savingFlag = false;
        this.dialog.success("LogIn", "Success");
        this.st_user = data;
        let mode
        if (data.data.developement_mode == 0) {
          mode = true;
        } else {
          mode = false;
        }
        this.st_user.data.access_level = "1";
        this.st_user.data.project_login_code = data['data']['project_login_code'];
        this.st_user.data.company = data['data']['project_login_code'];
        this.st_user.data.organisation_data = data['organisation_data'];
        this.st_user.data.developement_mode = mode;
        this.st_user.st_log = true;
        localStorage.setItem('st_user', JSON.stringify(this.st_user));
        localStorage.setItem('activeAcc', JSON.stringify(this.st_user.data))

        let influenceArray = []
        let drArray = [];


        if (this.st_user.data.id != '1') {
          if (this.st_user.data.organisation_data.loyalty == '1') {
            this.serve.influencer_netwrk();
            setTimeout(() => {
              influenceArray = this.serve.InfluenceArray;
            }, 300);
          }

        }
        if (this.st_user.data.id != '1') {
          if (this.st_user.data.organisation_data.sfa == '1' || this.st_user.data.organisation_data.dms == '1') {
            this.serve.dr_list();
            setTimeout(() => {
              drArray = this.serve.drArray;
            }, 200);
          }
        }


        setTimeout(() => {
          if (data['data']['user_type'] == 'DMS') {
            this.nexturl = this.route.snapshot.queryParams['returnUrl'] || '/distribution-list/1/Channel%20Partner/distribution-detail/' + this.cryptoService.encryptId(data['data']['id'].toString()) + '/Profile';
            this.router.navigate([this.nexturl]);
          }
          else {
            if (this.st_user.data.view_sfa_dashboard == '1' || this.st_user.data.view_dms_dashboard == '1' || this.st_user.data.view_loyalty_dashboard == '1' || this.st_user.data.view_service_dashboard == '1' || this.st_user.data.view_dispatch_dashboard == '1') {
              let type = ''
              if (this.st_user.data.view_loyalty_dashboard == '1') {
                type = 'LOYALTY'
              }
              if (this.st_user.data.view_dms_dashboard == '1') {
                type = 'DMS'
              }
              if (this.st_user.data.view_sfa_dashboard == '1') {
                type = 'SFA'
              }
              if (
                (this.st_user.data.view_sfa_dashboard == '1' && this.st_user.data.view_dms_dashboard == '1') ||
                (this.st_user.data.view_sfa_dashboard == '1' && this.st_user.data.view_loyalty_dashboard == '1') ||
                (this.st_user.data.view_dms_dashboard == '1' && this.st_user.data.view_loyalty_dashboard == '1') ||
                this.st_user.data.view_sfa_dashboard == '1' && this.st_user.data.view_dms_dashboard == '1' && this.st_user.data.view_loyalty_dashboard == '1') {
                type = 'All'
              }
              this.nexturl = this.route.snapshot.queryParams['returnUrl'] || '/dashboard/' + type;
              this.router.navigate([this.nexturl]);
            }
            else if (this.st_user.data.view_site == '1') {
              this.nexturl = this.route.snapshot.queryParams['returnUrl'] || '/site';
              this.router.navigate([this.nexturl]);
            }
            else if (this.st_user.data.view_enquiry == '1') {
              this.nexturl = this.route.snapshot.queryParams['returnUrl'] || '/lead-list';
              this.router.navigate([this.nexturl]);
            }
            else if (this.st_user.data.view_lead_direct_dealer == '1' || this.st_user.data.view_lead_end_user == '1' || this.st_user.data.view_lead_project == '1' || this.st_user.data.view_lead_others == '1') {
              this.nexturl = this.route.snapshot.queryParams['returnUrl'] || '/lead-list';
              this.router.navigate([this.nexturl]);
            }

            else if (this.st_user.data.view_dist_n_w_channel_partner == '1') {
              this.nexturl = this.route.snapshot.queryParams['returnUrl'] || '/distribution-list';
              this.router.navigate([this.nexturl]);
            }

            else if (this.st_user.data.view_primary_orders == '1') {
              this.nexturl = this.route.snapshot.queryParams['returnUrl'] || '/order-list';
              this.router.navigate([this.nexturl]);
            }
            else if (this.st_user.data.view_secondary_orders == '1') {
              this.nexturl = this.route.snapshot.queryParams['returnUrl'] || '/secondary-order-list';
              this.router.navigate([this.nexturl]);
            }

            else if (this.st_user.data.view_sfa_dashboard == '1' || this.st_user.data.view_dms_dashboard == '1') {
              this.nexturl = this.route.snapshot.queryParams['returnUrl'] || '/distribution-list/' + drArray[0].type + '/' + drArray[0].module_name;
              this.router.navigate([this.nexturl]);
            }


            else if (this.st_user.data.view_dms_invoice == '1') {
              this.nexturl = this.route.snapshot.queryParams['returnUrl'] || '/billing'
              this.router.navigate([this.nexturl]);
            }
            else if (this.st_user.data.view_ledger == '1') {
              this.nexturl = this.route.snapshot.queryParams['returnUrl'] || '/ledger'
              this.router.navigate([this.nexturl]);
            }
            else if (this.st_user.data.view_bill == '1') {
              this.nexturl = this.route.snapshot.queryParams['returnUrl'] || '/pending-bills'
              this.router.navigate([this.nexturl]);
            }

            else if (this.st_user.data.view_influencer_network == '1' && influenceArray.length > 0) {
              this.nexturl = this.route.snapshot.queryParams['returnUrl'] || '/influencer/' + influenceArray[0].type + '/' + influenceArray[0].module_name;
              this.router.navigate([this.nexturl]);
            }
            else if (this.st_user.data.view_coupon_code == '1') {
              this.nexturl = this.route.snapshot.queryParams['returnUrl'] || '/coupon-list';
              this.router.navigate([this.nexturl]);
            }
            else if (this.st_user.data.add_coupon_code == '1') {
              this.nexturl = this.route.snapshot.queryParams['returnUrl'] || '/coupon-list/coupon-add';
              this.router.navigate([this.nexturl]);
            }
            else if (this.st_user.data.view_purchase == '1') {
              this.nexturl = this.route.snapshot.queryParams['returnUrl'] || '/purchase';
              this.router.navigate([this.nexturl]);
            }
            else if (this.st_user.data.view_check_in == '1') {
              this.nexturl = this.route.snapshot.queryParams['returnUrl'] || '/checkin';
              this.router.navigate([this.nexturl]);
            }
            else if (this.st_user.data.view_leaves == '1') {
              this.nexturl = this.route.snapshot.queryParams['returnUrl'] || '/leave-list';
              this.router.navigate([this.nexturl]);
            }
            else if (this.st_user.data.view_travel_plan == '1') {
              this.nexturl = this.route.snapshot.queryParams['returnUrl'] || '/travel-list';
              this.router.navigate([this.nexturl]);
            }
            else if (this.st_user.data.view_products == '1') {
              this.nexturl = this.route.snapshot.queryParams['returnUrl'] || '/product-list';
              this.router.navigate([this.nexturl]);
            }
            else if (this.st_user.data.view_users == '1') {
              this.nexturl = this.route.snapshot.queryParams['returnUrl'] || '/sale-user-list';
              this.router.navigate([this.nexturl]);
            }
            else if (this.st_user.data.view_quotation == '1') {
              this.nexturl = this.route.snapshot.queryParams['returnUrl'] || '/quotation';
              this.router.navigate([this.nexturl]);
            }
            else if (this.st_user.data.view_follow_up == '1') {
              this.nexturl = this.route.snapshot.queryParams['returnUrl'] || '/followup-list';
              this.router.navigate([this.nexturl]);
            }
            else if (this.st_user.data.view_announcement == '1') {
              this.nexturl = this.route.snapshot.queryParams['returnUrl'] || '/announcement-list';
              this.router.navigate([this.nexturl]);
            }
            else if (this.st_user.data.view_expense == '1') {
              this.nexturl = this.route.snapshot.queryParams['returnUrl'] || '/expense-list';
              this.router.navigate([this.nexturl]);
            }
            else if (this.st_user.data.view_event_plan == '1') {
              this.nexturl = this.route.snapshot.queryParams['returnUrl'] || '/contractor-meet';
              this.router.navigate([this.nexturl]);
            }
            else if (this.st_user.data.view_survey == '1') {
              this.nexturl = this.route.snapshot.queryParams['returnUrl'] || '/survey-list';
              this.router.navigate([this.nexturl]);
            }
            else if (this.st_user.data.view_survey == '1') {
              this.nexturl = this.route.snapshot.queryParams['returnUrl'] || '/survey-list';
              this.router.navigate([this.nexturl]);
            }
            else if (this.st_user.data.view_survey == '1') {
              this.nexturl = this.route.snapshot.queryParams['returnUrl'] || '/survey-list';
              this.router.navigate([this.nexturl]);
            }

            else if (this.st_user.data.view_pop_gift == '1') {
              this.nexturl = this.route.snapshot.queryParams['returnUrl'] || '/pop-gift-list';
              this.router.navigate([this.nexturl]);
            }
            else if (this.st_user.data.view_location_master == '1') {
              this.nexturl = this.route.snapshot.queryParams['returnUrl'] || '/location-Master';
              this.router.navigate([this.nexturl]);
            }
            else if (this.st_user.data.view_dispatch_billing == '1' || this.st_user.data.view_dispatch_packing == '1' || this.st_user.data.view_dispatch_guard == '1') {
              this.nexturl = this.route.snapshot.queryParams['returnUrl'] || '/company-dispatch';
              this.router.navigate([this.nexturl]);
            }
            else if (this.st_user.data.view_attendence == '1') {
              this.nexturl = this.route.snapshot.queryParams['returnUrl'] || '/attendance';
              this.router.navigate([this.nexturl]);
            }
            else if (this.st_user.data.view_manual_dispatch == '1') {
              this.nexturl = this.route.snapshot.queryParams['returnUrl'] || '/manual-dispatch';
              this.router.navigate([this.nexturl]);
            }
            else if (this.st_user.data.view_sales_return == '1') {
              this.nexturl = this.route.snapshot.queryParams['returnUrl'] || '/sales-return';
              this.router.navigate([this.nexturl]);
            }
            else if (this.st_user.data.view_category == '1') {
              this.nexturl = this.route.snapshot.queryParams['returnUrl'] || '/segment-list';
              this.router.navigate([this.nexturl]);
            }
            else if (this.st_user.data.view_sub_category == '1') {
              this.nexturl = this.route.snapshot.queryParams['returnUrl'] || '/subcategory';
              this.router.navigate([this.nexturl]);
            }
            else if (this.st_user.data.view_products == '1') {
              this.nexturl = this.route.snapshot.queryParams['returnUrl'] || '/product-list';
              this.router.navigate([this.nexturl]);
            }
            else if (this.st_user.data.view_pdf == '1') {
              this.nexturl = this.route.snapshot.queryParams['returnUrl'] || '/catalogue';
              this.router.navigate([this.nexturl]);
            }
            else if (this.st_user.data.view_users == '1') {
              this.nexturl = this.route.snapshot.queryParams['returnUrl'] || '/sale-user-list';
              this.router.navigate([this.nexturl]);
            }
            else if (this.st_user.data.view_customer_category == '1') {
              this.nexturl = this.route.snapshot.queryParams['returnUrl'] || '/customer-category';
              this.router.navigate([this.nexturl]);
            }
            else if (this.st_user.data.view_infulencer_category == '1') {
              this.nexturl = this.route.snapshot.queryParams['returnUrl'] || '/influencer-user-list';
              this.router.navigate([this.nexturl]);
            }
            else if (this.st_user.data.view_point_category == '1') {
              this.nexturl = this.route.snapshot.queryParams['returnUrl'] || '/point-list';
              this.router.navigate([this.nexturl]);
            }
            else if (this.st_user.data.view_holiday == '1') {
              this.nexturl = this.route.snapshot.queryParams['returnUrl'] || '/holiday-list';
              this.router.navigate([this.nexturl]);
            }
            else if (this.st_user.data.view_gallery == '1') {
              this.nexturl = this.route.snapshot.queryParams['returnUrl'] || '/banner-list';
              this.router.navigate([this.nexturl]);
            }
            else if (this.st_user.data.view_faq == '1') {
              this.nexturl = this.route.snapshot.queryParams['returnUrl'] || '/faq-list';
              this.router.navigate([this.nexturl]);
            }
            else if (this.st_user.data.view_gift == '1') {
              this.nexturl = this.route.snapshot.queryParams['returnUrl'] || '/gift-list';
              this.router.navigate([this.nexturl]);
            }
            else if (this.st_user.data.view_bonus_points == '1') {
              this.nexturl = this.route.snapshot.queryParams['returnUrl'] || '/bonus-list';
              this.router.navigate([this.nexturl]);
            }
            else if (this.st_user.data.view_redeem_request == '1') {
              this.nexturl = this.route.snapshot.queryParams['returnUrl'] || '/redeem-request/paytm';
              this.router.navigate([this.nexturl]);
            }
            else if (this.st_user.data.view_support == '1') {
              this.nexturl = this.route.snapshot.queryParams['returnUrl'] || '/support';
              this.router.navigate([this.nexturl]);
            }
            else if (this.st_user.data.view_invoice == '1') {
              this.nexturl = this.route.snapshot.queryParams['returnUrl'] || '/invoice';
              this.router.navigate([this.nexturl]);
            }
            else if (this.st_user.data.view_payment == '1') {
              this.nexturl = this.route.snapshot.queryParams['returnUrl'] || '/billing';
              this.router.navigate([this.nexturl]);
            }
            else if (this.st_user.data.view_payment == '1') {
              this.nexturl = this.route.snapshot.queryParams['returnUrl'] || '/billing';
              this.router.navigate([this.nexturl]);
            }
            else if (this.st_user.data.view_designation == '1') {
              this.nexturl = this.route.snapshot.queryParams['returnUrl'] || '/user-designation';
              this.router.navigate([this.nexturl]);
            }

            else if (this.st_user.data.view_video_tutorial == '1') {
              this.nexturl = this.route.snapshot.queryParams['returnUrl'] || '/video-tutorial';
              this.router.navigate([this.nexturl]);
            }

            else if (this.st_user.data.view_referral_point_master == '1') {
              this.nexturl = this.route.snapshot.queryParams['returnUrl'] || '/point-master';
              this.router.navigate([this.nexturl]);
            }
            else if (this.st_user.data.view_leave_master == '1') {
              this.nexturl = this.route.snapshot.queryParams['returnUrl'] || '/leave-master-list';
              this.router.navigate([this.nexturl]);
            }
            else if (this.st_user.data.view_allowance_master == '1') {
              this.nexturl = this.route.snapshot.queryParams['returnUrl'] || '/allowances';
              this.router.navigate([this.nexturl]);
            }

            else if (this.st_user.data.view_territory_master == '1') {
              this.nexturl = this.route.snapshot.queryParams['returnUrl'] || '/beat-code';
              this.router.navigate([this.nexturl]);
            }

            else if (this.st_user.data.view_distributor_target == '1') {
              this.nexturl = this.route.snapshot.queryParams['returnUrl'] || '/distributor-target';
              this.router.navigate([this.nexturl]);
            }
            else if (this.st_user.data.view_employee_target == '1') {
              this.nexturl = this.route.snapshot.queryParams['returnUrl'] || '/userview-target';
              this.router.navigate([this.nexturl]);
            }
            // reports

            else if (this.st_user.data.view_sfa_report == '1') {
              this.nexturl = this.route.snapshot.queryParams['returnUrl'] || '/report-list/primary-target-report';
              this.router.navigate([this.nexturl]);
            }

            else if (this.st_user.data.view_loyalty_report == '1') {
              this.nexturl = this.route.snapshot.queryParams['returnUrl'] || '/loyalty-report/loyalty-report-influencer-reward-point';
              this.router.navigate([this.nexturl]);
            }

            else if (this.st_user.data.view_sfa_report == '1') {
              this.nexturl = this.route.snapshot.queryParams['returnUrl'] || '/sfa-reports/individual-attendance';
              this.router.navigate([this.nexturl]);
            }


            else if (this.st_user.data.view_scheme == '1') {
              this.nexturl = this.route.snapshot.queryParams['returnUrl'] || '/scheme/dealerscheme';
              this.router.navigate([this.nexturl]);
            }

            else if (this.st_user.data.view_stock == '1') {
              this.nexturl = this.route.snapshot.queryParams['returnUrl'] || '/stock-list';
              this.router.navigate([this.nexturl]);
            }

            else if (this.st_user.data.view_app_control == '1') {
              this.nexturl = this.route.snapshot.queryParams['returnUrl'] || '/app-control/System Alerts';
              this.router.navigate([this.nexturl]);
            }
            else if (this.st_user.data.view_brand_audit == '1') {
              this.nexturl = this.route.snapshot.queryParams['returnUrl'] || '/brand-audit';
              this.router.navigate([this.nexturl]);
            }
            else if (this.st_user.data.view_customer == '1') {
              this.nexturl = this.route.snapshot.queryParams['returnUrl'] || '/customer-list';
              this.router.navigate([this.nexturl]);
            }
            else if (this.st_user.data.view_warranty == '1') {
              this.nexturl = this.route.snapshot.queryParams['returnUrl'] || '/warranty-list';
              this.router.navigate([this.nexturl]);
            }
            else if (this.st_user.data.view_complaint == '1') {
              this.nexturl = this.route.snapshot.queryParams['returnUrl'] || '/complaint-list';
              this.router.navigate([this.nexturl]);
            }
            else if (this.st_user.data.view_installation == '1') {
              this.nexturl = this.route.snapshot.queryParams['returnUrl'] || '/installation-list';
              this.router.navigate([this.nexturl]);
            }
            else if (this.st_user.data.view_spare == '1') {
              this.nexturl = this.route.snapshot.queryParams['returnUrl'] || '/spare-list';
              this.router.navigate([this.nexturl]);
            }
            else if (this.st_user.data.view_invoice == '1') {
              this.nexturl = this.route.snapshot.queryParams['returnUrl'] || '/service-invoice-list';
              this.router.navigate([this.nexturl]);
            }
            else if (this.st_user.data.view_complaint_visit == '1') {
              this.nexturl = this.route.snapshot.queryParams['returnUrl'] || '/Complaint-visit-list';
              this.router.navigate([this.nexturl]);
            }
            else {
              this.session.LogOutSession();
              this.serve.datauser = {};
              this.router.navigate(['']);
            }
          }
        }, 300);
      }

      else {
        this.savingFlag = false;
        this.dialog.error("Incorrect UserName or Password");
      }

    }, error => {
      this.savingFlag = false;
    });
  }


  submit_otp() {
    if (this.cp_otp == this.data.otp) {
      this.dialog.success("LogIn", "Success");
      this.st_user.data.access_level = "2";
      this.st_user.st_log = true;
      localStorage.setItem('st_user', JSON.stringify(this.st_user));
      this.router.navigate(['/distribution-detail/' + this.st_user['data'].id]);
    }
    else {
      this.dialog.error("Incorrect Otp");
    }
  }

  visible_password() {
    this.edit_view = true
  }
  not_visible_password() {
    this.edit_view = false
  }

}