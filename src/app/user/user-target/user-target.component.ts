import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DatabaseService } from 'src/_services/DatabaseService';
import { DialogComponent } from 'src/app/dialog.component';
import * as moment from 'moment';

@Component({
  selector: 'app-user-target',
  styleUrls: ['./user-target.component.scss'],
  templateUrl: './user-target.component.html',
})
export class UserTargetComponent implements OnInit {

  user_id: any;
  value: any = [];
  userLeadList: any = [];
  yearly_target: any = {};
  current_month_no: any = '';
  current_year_no: any = '';
  current_year: any = '';
  financialYear: any;
  next_Year: any;
  month_condition: any;
  type: any = {};

  march_date: any;
  feb_date: any;
  jan_date: any;
  dec_date: any;
  nov_date: any;
  oct_date: any;
  sep_date: any;
  aug_date: any;
  july_date: any;
  june_date: any;
  may_date: any;
  april_date: any;


  constructor(public route: ActivatedRoute, public serve: DatabaseService, public dialog: DialogComponent) {
    this.type.order_type = 'Primary';

    this.route.params.subscribe(params => {
      this.user_id = params.id;

    });

    this.current_month_no = moment().format('M');

    this.current_year_no = moment().format('Y');

    this.current_year = moment().format('YYYY');

    let today = moment();

    if (today.month() >= 3) {
      this.financialYear = today.format('YYYY') + '-' + today.add(1, 'years').format('YYYY');
    }
    else {
      this.financialYear = today.subtract(1, 'years').format('YYYY') + '-' + today.add(1, 'years').format('YYYY')
    }


    var c = new Date(new Date().setFullYear(new Date().getFullYear() + 1))
    this.next_Year = moment(c).format('YYYY');

    this.month_condition = new Date(this.current_year, this.current_month_no).toISOString().slice(0, 7);

    this.march_date = new Date(this.next_Year, 3).toISOString().slice(0, 7);
    this.feb_date = new Date(this.next_Year, 2).toISOString().slice(0, 7);
    this.jan_date = new Date(this.next_Year, 1).toISOString().slice(0, 7);
    this.dec_date = new Date(this.current_year, 12).toISOString().slice(0, 7);
    this.nov_date = new Date(this.current_year, 11).toISOString().slice(0, 7);
    this.oct_date = new Date(this.current_year, 10).toISOString().slice(0, 7);
    this.sep_date = new Date(this.current_year, 9).toISOString().slice(0, 7);
    this.aug_date = new Date(this.current_year, 8).toISOString().slice(0, 7);
    this.july_date = new Date(this.current_year, 7).toISOString().slice(0, 7);
    this.june_date = new Date(this.current_year, 6).toISOString().slice(0, 7);
    this.may_date = new Date(this.current_year, 5).toISOString().slice(0, 7);
    this.april_date = new Date(this.current_year, 4).toISOString().slice(0, 7);
  }

  ngOnInit() {
    this.userTargetList();
    this.yearly_target.primary_target = 0;
    this.yearly_target.secondary_target = 0;
    this.get_year_target();
    this.get_monthly_target_data();
    this.get_assign_sales_user();
  }
  year: any = 0;
  nextYear() {
    this.year++;
    this.userTargetList();
  }

  previousYear() {
    this.year--;
    this.userTargetList();
  }


  targets: any = [];
  userTargetList() {
    this.serve.post_rqst({ 'user_id': this.user_id, 'year': this.year }, "User/userTargetList").subscribe((response => {
      this.targets = response['targets'];

      for (var i = 0; i < this.targets[0].targets.length; i++) {

        for (var j = 0; j < this.targets[0].targets[i].months.length; j++) {
          this.targets[0].targets[i].months[j].target_info.pri_achivement = Math.round(this.targets[0].targets[i].months[j].target_info.pri_achivement);

          this.targets[0].targets[i].months[j].target_info.pri_balance = Math.round(this.targets[0].targets[i].months[j].target_info.pri_balance);

          this.targets[0].targets[i].months[j].target_info.sec_achivement = Math.round(this.targets[0].targets[i].months[j].target_info.sec_achivement);

          this.targets[0].targets[i].months[j].target_info.sec_balance = Math.round(this.targets[0].targets[i].months[j].target_info.sec_balance);
        }
      }
      this.getYearlyTarget();
    }));
  }

  updatePriTarget(month, i, x) {
    this.serve.post_rqst({ 'created_by': this.serve.peraluser.id, 'user_id': this.user_id, 'date': month.date, 'id': month.target_info.id, 'pri_target': month.target_info.pri_target }, "User/updatePriTarget").subscribe(r => {

      this.targets[0]['userYearTarget'].total_pri_target -= this.targets[0]['targets'][i]['userQuarterTarget'].total_pri_balance;

      this.targets[0]['targets'][i]['userQuarterTarget'].total_pri_balance -= this.targets[0]['targets'][i]['months'][x].target_info.pri_balance;
      this.targets[0]['targets'][i]['userQuarterTarget'].total_pri_target -= this.targets[0]['targets'][i]['months'][x].target_info.old_pri_target;

      this.targets[0]['targets'][i]['userQuarterTarget'].total_pri_balance += parseInt(r['target'].pri_balance);
      this.targets[0]['targets'][i]['userQuarterTarget'].total_pri_target += parseInt(r['target'].pri_target);




      this.targets[0]['userYearTarget'].total_pri_target += this.targets[0]['targets'][i]['userQuarterTarget'].total_pri_balance;


      this.targets[0]['targets'][i]['months'][x].target_info = r['target'];

    });
  }


  updateSecTarget(month, i, x) {
    this.serve.post_rqst({ 'created_by': this.serve.peraluser.id, 'user_id': this.user_id, 'date': month.date, 'id': month.target_info.id, 'sec_target': month.target_info.sec_target }, "User/updateSecTarget").subscribe(r => {
      this.targets[0]['userYearTarget'].total_sec_target -= this.targets[0]['targets'][i]['userQuarterTarget'].total_sec_balance;
      this.targets[0]['targets'][i]['userQuarterTarget'].total_sec_balance -= this.targets[0]['targets'][i]['months'][x].target_info.sec_balance;
      this.targets[0]['targets'][i]['userQuarterTarget'].total_sec_target -= this.targets[0]['targets'][i]['months'][x].target_info.old_sec_target;
      this.targets[0]['targets'][i]['userQuarterTarget'].total_sec_balance += parseInt(r['target'].sec_balance);
      this.targets[0]['targets'][i]['userQuarterTarget'].total_sec_target += parseInt(r['target'].sec_target);
      this.targets[0]['userYearTarget'].total_sec_target += this.targets[0]['targets'][i]['userQuarterTarget'].total_sec_balance;
      this.targets[0]['targets'][i]['months'][x].target_info = r['target'];
    });




  }


  getYearlyTarget() {

    this.serve.post_rqst({ 'user_id': this.user_id }, "User/getYearlyTarget").subscribe(response => {
      if (response['yearly_target'].length != 0) {
        this.yearly_target = response['yearly_target'];
      }

      this.yearly_target.pri_achivements = this.targets[0]['userYearTarget']['total_pri_achivement'];
      this.yearly_target.sec_achivements = this.targets[0]['userYearTarget']['total_sec_achivement'];
      this.yearly_target.pri_balance = parseInt(this.yearly_target.primary_target) - parseInt(this.yearly_target.pri_achivements);
      this.yearly_target.sec_balance = parseInt(this.yearly_target.secondary_target) - parseInt(this.yearly_target.sec_achivements);
    });

  }

  updateYearlyTarget() {
    this.yearly_target.year = this.targets[0].left_year;
    this.yearly_target.user_id = this.user_id;
    this.serve.post_rqst({ 'data': this.yearly_target }, "User/updateYearlyTarget").subscribe(response => {
      this.getYearlyTarget();
    })

  }

  MobileNumber(event: any) {
    const pattern = /[0-9]/;
    let inputChar = String.fromCharCode(event.charCode);
    if (event.keyCode != 8 && !pattern.test(inputChar)) {
      event.preventDefault();
    }
  }

  assign_sales_user: any = [];
  edit_target1: any = false;
  edit_ach1: any = false;
  edit_target2: any = false;
  edit_ach2: any = false;
  edit_target3: any = false;
  edit_ach3: any = false;
  edit_target4: any = false;
  edit_ach4: any = false;
  edit_target5: any = false;
  edit_ach5: any = false;
  edit_target6: any = false;
  edit_ach6: any = false;
  edit_target7: any = false;
  edit_ach7: any = false;
  edit_target8: any = false;
  edit_ach8: any = false;
  edit_target9: any = false;
  edit_ach9: any = false;
  edit_target10: any = false;
  edit_ach10: any = false;
  edit_target11: any = false;
  edit_ach11: any = false;
  edit_target12: any = false;
  edit_ach12: any = false;
  data: any = {};
  form: any = {};
  target_data: any = [];
  year_target: any = false;
  year_target_data: any = [];
  year_achievement: any = 0;
  year_balance: any = 0;

  jan_team_ach: any = 0;
  feb_team_ach: any = 0;
  mar_team_ach: any = 0;
  apr_team_ach: any = 0;
  may_team_ach: any = 0;
  june_team_ach: any = 0;
  july_team_ach: any = 0;
  aug_team_ach: any = 0;
  sep_team_ach: any = 0;
  oct_team_ach: any = 0;
  nov_team_ach: any = 0;
  dec_team_ach: any = 0;

  total_jan_ach: any = 0;
  total_feb_ach: any = 0;
  total_mar_ach: any = 0;
  total_apr_ach: any = 0;
  total_may_ach: any = 0;
  total_june_ach: any = 0;
  total_july_ach: any = 0;
  total_aug_ach: any = 0;
  total_sep_ach: any = 0;
  total_oct_ach: any = 0;
  total_nov_ach: any = 0;
  total_dec_ach: any = 0;

  bal_jan_ach: any = 0;
  bal_feb_ach: any = 0;
  bal_mar_ach: any = 0;
  bal_apr_ach: any = 0;
  bal_may_ach: any = 0;
  bal_june_ach: any = 0;
  bal_july_ach: any = 0;
  bal_aug_ach: any = 0;
  bal_sep_ach: any = 0;
  bal_oct_ach: any = 0;
  bal_nov_ach: any = 0;
  bal_dec_ach: any = 0;

  loader: any;

  get_assign_sales_user() {
    this.loader = '1';
    this.serve.post_rqst({ 'user_id': this.user_id }, "User/get_assign_sales_user").subscribe(resp => {
      this.assign_sales_user = resp['data'];
      this.jan_team_ach = 0;
      this.feb_team_ach = 0;
      this.mar_team_ach = 0;
      this.apr_team_ach = 0;
      this.may_team_ach = 0;
      this.june_team_ach = 0;
      this.july_team_ach = 0;
      this.aug_team_ach = 0;
      this.sep_team_ach = 0;
      this.oct_team_ach = 0;
      this.nov_team_ach = 0;
      this.dec_team_ach = 0;

      this.total_jan_ach = 0;
      this.bal_jan_ach = 0;
      this.total_feb_ach = 0;
      this.bal_feb_ach = 0;
      this.total_mar_ach = 0;
      this.bal_mar_ach = 0;
      this.total_apr_ach = 0;
      this.bal_apr_ach = 0;
      this.total_may_ach = 0;
      this.bal_may_ach = 0;
      this.total_june_ach = 0;
      this.bal_june_ach = 0;
      this.total_july_ach = 0;
      this.bal_july_ach = 0;
      this.total_aug_ach = 0;
      this.bal_aug_ach = 0;
      this.total_sep_ach = 0;
      this.bal_sep_ach = 0;
      this.total_oct_ach = 0;
      this.bal_oct_ach = 0;
      this.total_nov_ach = 0;
      this.bal_nov_ach = 0;
      this.total_dec_ach = 0;
      this.bal_dec_ach = 0;

      this.year_achievement = 0;
      this.year_balance = 0;

      for (var i = 0; i < this.assign_sales_user.length; i++) {
        if (this.assign_sales_user[i].target) {
          if (this.assign_sales_user[i].target[1]) {
            if (this.type.order_type == 'Primary') {
              this.jan_team_ach = parseInt(this.jan_team_ach) + parseInt(this.assign_sales_user[i].target[1].pri_achivement);
            }
            else {
              this.jan_team_ach = parseInt(this.jan_team_ach) + parseInt(this.assign_sales_user[i].target[1].sec_achivement);
            }

          }
          if (this.assign_sales_user[i].target[2]) {
            if (this.type.order_type == 'Primary') {
              this.feb_team_ach = parseInt(this.feb_team_ach) + parseInt(this.assign_sales_user[i].target[2].pri_achivement);
            }
            else {
              this.feb_team_ach = parseInt(this.feb_team_ach) + parseInt(this.assign_sales_user[i].target[2].sec_achivement);
            }
          }
          if (this.assign_sales_user[i].target[3]) {
            if (this.type.order_type == 'Primary') {
              this.mar_team_ach = parseInt(this.mar_team_ach) + parseInt(this.assign_sales_user[i].target[3].pri_achivement);
            }
            else {
              this.mar_team_ach = parseInt(this.mar_team_ach) + parseInt(this.assign_sales_user[i].target[3].sec_achivement);
            }

          }
          if (this.assign_sales_user[i].target[4]) {
            if (this.type.order_type == 'Primary') {
              this.apr_team_ach = parseInt(this.apr_team_ach) + parseInt(this.assign_sales_user[i].target[4].pri_achivement);
            }
            else {
              this.apr_team_ach = parseInt(this.apr_team_ach) + parseInt(this.assign_sales_user[i].target[4].sec_achivement);
            }
          }
          if (this.assign_sales_user[i].target[5]) {
            if (this.type.order_type == 'Primary') {
              this.may_team_ach = parseInt(this.may_team_ach) + parseInt(this.assign_sales_user[i].target[5].pri_achivement);
            }
            else {
              this.may_team_ach = parseInt(this.may_team_ach) + parseInt(this.assign_sales_user[i].target[5].sec_achivement);
            }
          }
          if (this.assign_sales_user[i].target[6]) {
            if (this.type.order_type == 'Primary') {
              this.june_team_ach = parseInt(this.june_team_ach) + parseInt(this.assign_sales_user[i].target[6].pri_achivement);
            }
            else {
              this.june_team_ach = parseInt(this.june_team_ach) + parseInt(this.assign_sales_user[i].target[6].sec_achivement);
            }
          }
          if (this.assign_sales_user[i].target[7]) {
            if (this.type.order_type == 'Primary') {
              this.july_team_ach = parseInt(this.july_team_ach) + parseInt(this.assign_sales_user[i].target[7].pri_achivement);
            }
            else {
              this.july_team_ach = parseInt(this.july_team_ach) + parseInt(this.assign_sales_user[i].target[7].sec_achivement);
            }
          }
          if (this.assign_sales_user[i].target[8]) {
            if (this.type.order_type == 'Primary') {
              this.aug_team_ach = parseInt(this.aug_team_ach) + parseInt(this.assign_sales_user[i].target[8].pri_achivement);
            }
            else {
              this.aug_team_ach = parseInt(this.aug_team_ach) + parseInt(this.assign_sales_user[i].target[8].sec_achivement);
            }
          }
          if (this.assign_sales_user[i].target[9]) {
            if (this.type.order_type == 'Primary') {
              this.sep_team_ach = parseInt(this.sep_team_ach) + parseInt(this.assign_sales_user[i].target[9].pri_achivement);
            }
            else {
              this.sep_team_ach = parseInt(this.sep_team_ach) + parseInt(this.assign_sales_user[i].target[9].sec_achivement);
            }
          }
          if (this.assign_sales_user[i].target[10]) {
            if (this.type.order_type == 'Primary') {
              this.oct_team_ach = parseInt(this.oct_team_ach) + parseInt(this.assign_sales_user[i].target[10].pri_achivement);
            }
            else {
              this.oct_team_ach = parseInt(this.oct_team_ach) + parseInt(this.assign_sales_user[i].target[10].sec_achivement);
            }
          }
          if (this.assign_sales_user[i].target[11]) {
            if (this.type.order_type == 'Primary') {
              this.nov_team_ach = parseInt(this.nov_team_ach) + parseInt(this.assign_sales_user[i].target[11].pri_achivement);
            }
            else {
              this.nov_team_ach = parseInt(this.nov_team_ach) + parseInt(this.assign_sales_user[i].target[11].sec_achivement);
            }
          }
          if (this.assign_sales_user[i].target[12]) {
            if (this.type.order_type == 'Primary') {
              this.dec_team_ach = parseInt(this.dec_team_ach) + parseInt(this.assign_sales_user[i].target[12].pri_achivement);
            }
            else {
              this.dec_team_ach = parseInt(this.dec_team_ach) + parseInt(this.assign_sales_user[i].target[12].sec_achivement);
            }
          }
        }
      }

      if (this.form.january_ach) {
        this.total_jan_ach = parseInt(this.jan_team_ach) + parseInt(this.form.january_ach);
      }
      else {
        this.total_jan_ach = parseInt(this.jan_team_ach);
      }
      this.bal_jan_ach = parseInt(this.form.january_target) - parseInt(this.total_jan_ach);

      if (this.form.february_ach) {
        this.total_feb_ach = parseInt(this.feb_team_ach) + parseInt(this.form.february_ach);
      }
      else {
        this.total_feb_ach = parseInt(this.feb_team_ach);
      }
      this.bal_feb_ach = parseInt(this.form.february_target) - parseInt(this.total_feb_ach);

      if (this.form.march_ach) {
        this.total_mar_ach = parseInt(this.mar_team_ach) + parseInt(this.form.march_ach);
      }
      else {
        this.total_mar_ach = parseInt(this.mar_team_ach);
      }
      this.bal_mar_ach = parseInt(this.form.march_target) - parseInt(this.total_mar_ach);

      if (this.form.april_ach) {
        this.total_apr_ach = parseInt(this.apr_team_ach) + parseInt(this.form.april_ach);
      }
      else {
        this.total_apr_ach = parseInt(this.apr_team_ach);
      }
      this.bal_apr_ach = parseInt(this.form.april_target) - parseInt(this.total_apr_ach);

      if (this.form.may_ach) {
        this.total_may_ach = parseInt(this.may_team_ach) + parseInt(this.form.may_ach);
      }
      else {
        this.total_may_ach = parseInt(this.may_team_ach);
      }
      this.bal_may_ach = parseInt(this.form.may_target) - parseInt(this.total_may_ach);

      if (this.form.june_ach) {
        this.total_june_ach = parseInt(this.june_team_ach) + parseInt(this.form.june_ach);
      }
      else {
        this.total_june_ach = parseInt(this.june_team_ach);
      }
      this.bal_june_ach = parseInt(this.form.june_target) - parseInt(this.total_june_ach);

      if (this.form.july_ach) {
        this.total_july_ach = parseInt(this.july_team_ach) + parseInt(this.form.july_ach);
      }
      else {
        this.total_july_ach = parseInt(this.july_team_ach);
      }
      this.bal_july_ach = parseInt(this.form.july_target) - parseInt(this.total_july_ach);

      if (this.form.august_ach) {
        this.total_aug_ach = parseInt(this.aug_team_ach) + parseInt(this.form.august_ach);
      }
      else {
        this.total_aug_ach = parseInt(this.aug_team_ach);
      }
      this.bal_aug_ach = parseInt(this.form.august_target) - parseInt(this.total_aug_ach);

      if (this.form.september_ach) {
        this.total_sep_ach = parseInt(this.sep_team_ach) + parseInt(this.form.september_ach);
      }
      else {
        this.total_sep_ach = parseInt(this.sep_team_ach);
      }
      this.bal_sep_ach = parseInt(this.form.september_target) - parseInt(this.total_sep_ach);

      if (this.form.october_ach) {
        this.total_oct_ach = parseInt(this.oct_team_ach) + parseInt(this.form.october_ach);
      }
      else {
        this.total_oct_ach = parseInt(this.oct_team_ach);
      }
      this.bal_oct_ach = parseInt(this.form.october_target) - parseInt(this.total_oct_ach);

      if (this.form.november_ach) {
        this.total_nov_ach = parseInt(this.nov_team_ach) + parseInt(this.form.november_ach);
      }
      else {
        this.total_nov_ach = parseInt(this.nov_team_ach);
      }
      this.bal_nov_ach = parseInt(this.form.november_target) - parseInt(this.total_nov_ach);

      if (this.form.december_ach) {
        this.total_dec_ach = parseInt(this.dec_team_ach) + parseInt(this.form.december_ach);
      }
      else {
        this.total_dec_ach = parseInt(this.dec_team_ach);
      }
      this.bal_dec_ach = parseInt(this.form.december_target) - parseInt(this.total_dec_ach);


      if (this.total_jan_ach) {
        this.year_achievement += parseInt(this.total_jan_ach);
      }
      if (this.total_feb_ach) {
        this.year_achievement += parseInt(this.total_feb_ach);
      }
      if (this.total_mar_ach) {
        this.year_achievement += parseInt(this.total_mar_ach);
      }
      if (this.total_apr_ach) {
        this.year_achievement += parseInt(this.total_apr_ach);
      }
      if (this.total_may_ach) {
        this.year_achievement += parseInt(this.total_may_ach);
      }
      if (this.total_june_ach) {
        this.year_achievement += parseInt(this.total_june_ach);
      }
      if (this.total_july_ach) {
        this.year_achievement += parseInt(this.total_july_ach);
      }
      if (this.total_aug_ach) {
        this.year_achievement += parseInt(this.total_aug_ach);
      }
      if (this.total_sep_ach) {
        this.year_achievement += parseInt(this.total_sep_ach);
      }
      if (this.total_oct_ach) {
        this.year_achievement += parseInt(this.total_oct_ach);
      }
      if (this.total_nov_ach) {
        this.year_achievement += parseInt(this.total_nov_ach);
      }
      if (this.total_dec_ach) {
        this.year_achievement += parseInt(this.total_dec_ach);
      }

      this.year_balance = parseInt(this.data.target) - parseInt(this.year_achievement);

      this.loader = '';
    });
  }

  add_year_target() {
    this.loader = '1';

    this.data.user_id = this.user_id;
    this.data.year = this.financialYear;

    this.serve.post_rqst({ 'data': this.data }, "User/updateYearlyTarget").subscribe(resp => {
      this.get_year_target();
      this.loader = '';
    });
  }

  get_year_target() {
    this.loader = '1';

    this.serve.post_rqst({ 'user_id': this.user_id, 'year': this.financialYear }, "User/get_year_target").subscribe(resp => {
      this.year_target_data = resp['data'];

      if (this.type.order_type == 'Primary') {
        this.data.target = this.year_target_data.primary_target;
      }

      if (this.type.order_type == 'Secondary') {
        this.data.target = this.year_target_data.secondary_target;
      }
      this.get_assign_sales_user();
      this.loader = '';
    });
  }

  add_monthly_target(month) {
    this.loader = '1';

    if (month == 'March') {
      this.form.target = this.form.march_target;
      this.form.month = '3';
    }
    if (month == 'February') {
      this.form.target = this.form.february_target;
      this.form.month = '2';
    }
    if (month == 'January') {
      this.form.target = this.form.january_target;
      this.form.month = '1';
    }
    if (month == 'December') {
      this.form.target = this.form.december_target;
      this.form.month = '12';
    }
    if (month == 'November') {
      this.form.target = this.form.november_target;
      this.form.month = '11';
    }
    if (month == 'October') {
      this.form.target = this.form.october_target;
      this.form.month = '10';
    }
    if (month == 'September') {
      this.form.target = this.form.september_target;
      this.form.month = '9';
    }
    if (month == 'August') {
      this.form.target = this.form.august_target;
      this.form.month = '8';
    }
    if (month == 'July') {
      this.form.target = this.form.july_target;
      this.form.month = '7';
    }
    if (month == 'June') {
      this.form.target = this.form.june_target;
      this.form.month = '6';
    }
    if (month == 'May') {
      this.form.target = this.form.may_target;
      this.form.month = '5';
    }
    if (month == 'April') {
      this.form.target = this.form.april_target;
      this.form.month = '4';
    }

    this.form.user_id = this.user_id;
    this.form.year = this.current_year;
    this.form.ach_type = this.type.order_type;
    this.serve.post_rqst(this.form, "User/add_monthly_target").subscribe(resp => {
      this.get_monthly_target_data();
      this.get_assign_sales_user();
      this.loader = '';
    });
  }

  update_ach(month) {
    this.loader = '1';

    if (month == 'March') {
      this.form.achievement = this.form.march_ach;
      this.form.month = '3';
    }
    if (month == 'February') {
      this.form.achievement = this.form.february_ach;
      this.form.month = '2';
    }
    if (month == 'January') {
      this.form.achievement = this.form.january_ach;
      this.form.month = '1';
    }
    if (month == 'December') {
      this.form.achievement = this.form.december_ach;
      this.form.month = '12';
    }
    if (month == 'November') {
      this.form.achievement = this.form.november_ach;
      this.form.month = '11';
    }
    if (month == 'October') {
      this.form.achievement = this.form.october_ach;
      this.form.month = '10';
    }
    if (month == 'September') {
      this.form.achievement = this.form.september_ach;
      this.form.month = '9';
    }
    if (month == 'August') {
      this.form.achievement = this.form.august_ach;
      this.form.month = '8';
    }
    if (month == 'July') {
      this.form.achievement = this.form.july_ach;
      this.form.month = '7';
    }
    if (month == 'June') {
      this.form.achievement = this.form.june_ach;
      this.form.month = '6';
    }
    if (month == 'May') {
      this.form.achievement = this.form.may_ach;
      this.form.month = '5';
    }
    if (month == 'April') {
      this.form.achievement = this.form.april_ach;
      this.form.month = '4';
    }

    this.form.user_id = this.user_id;
    this.form.year = this.current_year;
    this.form.ach_type = this.type.order_type;
    this.serve.post_rqst(this.form, "User/update_monthly_ach").subscribe(resp => {
      this.get_monthly_target_data();
      this.get_assign_sales_user();
      this.loader = '';
    });
  }

  get_monthly_target_data() {
    this.loader = '1';
    this.serve.post_rqst({ 'user_id': this.user_id, 'year': this.current_year }, "User/get_monthly_target_data").subscribe(resp => {
      this.target_data = resp['data'];

      for (var i = 0; i < this.target_data.length; i++) {
        this.target_data[i].pri_target = parseInt(this.target_data[i].pri_target);
        this.target_data[i].pri_achivement = parseInt(this.target_data[i].pri_achivement);

        if (this.target_data[i].month == '1') {
          if (this.type.order_type == 'Primary') {
            this.form.january_target = this.target_data[i].pri_target;
            this.form.january_ach = this.target_data[i].pri_achivement;
          }
          else {
            this.form.january_target = this.target_data[i].sec_target;
            this.form.january_ach = this.target_data[i].sec_achivement;
          }

        }
        if (this.target_data[i].month == '2') {
          if (this.type.order_type == 'Primary') {
            this.form.february_target = this.target_data[i].pri_target;
            this.form.february_ach = this.target_data[i].pri_achivement;
          }
          else {
            this.form.february_target = this.target_data[i].sec_target;
            this.form.february_ach = this.target_data[i].sec_achivement;
          }
        }
        if (this.target_data[i].month == '3') {
          if (this.type.order_type == 'Primary') {
            this.form.march_target = this.target_data[i].pri_target;
            this.form.march_ach = this.target_data[i].pri_achivement;
          }
          else {
            this.form.march_target = this.target_data[i].sec_target;
            this.form.march_ach = this.target_data[i].sec_achivement;
          }
        }
        if (this.target_data[i].month == '4') {
          if (this.type.order_type == 'Primary') {
            this.form.april_target = this.target_data[i].pri_target;
            this.form.april_ach = this.target_data[i].pri_achivement;
          }
          else {
            this.form.april_target = this.target_data[i].sec_target;
            this.form.april_ach = this.target_data[i].sec_achivement;
          }
        }
        if (this.target_data[i].month == '5') {
          if (this.type.order_type == 'Primary') {
            this.form.may_target = this.target_data[i].pri_target;
            this.form.may_ach = this.target_data[i].pri_achivement;
          }
          else {
            this.form.may_target = this.target_data[i].sec_target;
            this.form.may_ach = this.target_data[i].sec_achivement;
          }
        }
        if (this.target_data[i].month == '6') {
          if (this.type.order_type == 'Primary') {
            this.form.june_target = this.target_data[i].pri_target;
            this.form.june_ach = this.target_data[i].pri_achivement;
          }
          else {
            this.form.june_target = this.target_data[i].sec_target;
            this.form.june_ach = this.target_data[i].sec_achivement;
          }
        }
        if (this.target_data[i].month == '7') {
          if (this.type.order_type == 'Primary') {
            this.form.july_target = this.target_data[i].pri_target;
            this.form.july_ach = this.target_data[i].pri_achivement;
          }
          else {
            this.form.july_target = this.target_data[i].sec_target;
            this.form.july_ach = this.target_data[i].sec_achivement;
          }
        }
        if (this.target_data[i].month == '8') {
          if (this.type.order_type == 'Primary') {
            this.form.august_target = this.target_data[i].pri_target;
            this.form.august_ach = this.target_data[i].pri_achivement;
          }
          else {
            this.form.august_target = this.target_data[i].sec_target;
            this.form.august_ach = this.target_data[i].sec_achivement;
          }
        }
        if (this.target_data[i].month == '9') {
          if (this.type.order_type == 'Primary') {
            this.form.september_target = this.target_data[i].pri_target;
            this.form.september_ach = this.target_data[i].pri_achivement;
          }
          else {
            this.form.september_target = this.target_data[i].sec_target;
            this.form.september_ach = this.target_data[i].sec_achivement;
          }
        }
        if (this.target_data[i].month == '10') {
          if (this.type.order_type == 'Primary') {
            this.form.october_target = this.target_data[i].pri_target;
            this.form.october_ach = this.target_data[i].pri_achivement;
          }
          else {
            this.form.october_target = this.target_data[i].sec_target;
            this.form.october_ach = this.target_data[i].sec_achivement;
          }
        }
        if (this.target_data[i].month == '11') {
          if (this.type.order_type == 'Primary') {
            this.form.november_target = this.target_data[i].pri_target;
            this.form.november_ach = this.target_data[i].pri_achivement;
          }
          else {
            this.form.november_target = this.target_data[i].sec_target;
            this.form.november_ach = this.target_data[i].sec_achivement;
          }
        }
        if (this.target_data[i].month == '12') {
          if (this.type.order_type == 'Primary') {
            this.form.december_target = this.target_data[i].pri_target;
            this.form.december_ach = this.target_data[i].pri_achivement;
          }
          else {
            this.form.december_target = this.target_data[i].sec_target;
            this.form.december_ach = this.target_data[i].sec_achivement;
          }
        }
      }
      this.get_assign_sales_user();
      this.loader = '';
    });
  }


}
