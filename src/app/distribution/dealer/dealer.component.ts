import { Component, OnInit } from '@angular/core';
// import { import { slideToTop } from '../../router-animation/router-animation.component';
import { DatabaseService } from 'src/_services/DatabaseService';

import { Router } from '@angular/router';
import { DialogComponent } from 'src/app/dialog.component';
import * as moment from 'moment';
import { NavigationComponent } from '../../navigation/navigation.component';
import { sessionStorage } from 'src/app/localstorage.service';

@Component({
  selector: 'app-dealer',
  templateUrl: './dealer.component.html',
  styleUrls: ['./dealer.component.scss']
})
export class DealerComponent implements OnInit {
  data_not_found = false;
  skelton: any = {}
  value: any = {};
  distributor_list: any = [];
  start: any = 0;
  count: any;
  total_page: any;
  pagenumber: any;
  page_limit: any = 50
  exp_loader: any;
  loader: any;
  data: any = [];
  state_values: any = [];
  dr_list_temp: any = [];
  search_val: any = {}
  all_count: any = {}
  type: any = 3;
  dr_count: any;
  today_date: Date;
  active_tab = 'active';
  assign_login_data2: any = [];
  sort: any = {}
  assign_login_data: any = [];
  constructor(public serve: DatabaseService, public route: Router, public session: sessionStorage, public dialog: DialogComponent) {
    this.today_date = new Date();
    this.search_val.contact_person = '';
    this.search_val.company_name = '';
    this.search_val.created_by = '';
    this.search_val.date_created = '';
    this.search_val.contact_number = '';
    this.search_val.state = '';
    this.search_val.assign_user = '';
    this.assign_login_data = this.session.getSession();
    this.assign_login_data = this.assign_login_data.value;
    this.assign_login_data2 = this.assign_login_data.data;
  }

  ngOnInit() {
    this.search_val = this.serve.dealerListSearch
    this.distributorList();
    this.skelton = new Array(10);
  }

  public onDate(event): void {
    this.search_val.date_created = moment(event.value).format('YYYY-MM-DD');
    this.distributorList();
  }

  distributorList(action: any = '') {
    this.distributor_list = [];

    if (action == "refresh") {
      this.search_val = {};
      this.distributor_list = [];
    }
    if (this.sort.type1 == 'DESC') {
      this.sort.value = "company_name"
      this.sort.type = "DESC"

    }
    else if (this.sort.type1 == 'ASC') {
      this.sort.value = "company_name"
      this.sort.type = "ASC"

    }
    else {
      this.sort.value = "date_created"
      this.sort.type = "DESC"
    }

    this.loader = true;
    this.serve.post_rqst({ 'sort': this.sort, 'user_id': this.assign_login_data2.id, 'start': this.start, 'pagelimit': this.page_limit, 'search': this.search_val, 'type': this.type, 'active_tab': this.active_tab }, "Distributors/distributor")
      .subscribe((result => {
        this.count = result['distributor']['count'];
        this.state_values = result['distributor']['states'];
        this.dr_list_temp = result['distributor']['distributor'];
        this.dr_count = result['distributor']['count'];
        // this.distributor_list = this.distributor_list.concat(result['distributor']['distributor']);
        this.distributor_list = result['distributor']['distributor'];
        this.all_count = result['distributor']['all_count']
        this.total_page = Math.ceil(this.dr_count / this.page_limit);
        this.pagenumber = Math.ceil(this.start / this.page_limit) + 1;
        this.sort.type = ""
        setTimeout(() => {
          this.loader = false;

        }, 2000);
        if (this.distributor_list.length == 0) {
          this.data_not_found = true;
        } else {
          this.data_not_found = false;

        }
        this.serve.count_list();
      }))
  }

  deleteUser(id) {
    this.dialog.delete('Distributor Data !').then((result) => {
      if (result) {
        this.serve.post_rqst({ "id": id }, "Distributors/distributors_delete").subscribe((result => {
          this.distributorList('refresh');
          this.route.navigate([NavigationComponent]);
        }))
      }
    })

  }

  refresh() {
    this.distributorList();
    this.search_val = ""
  }

  userDetail(id) {
    this.serve.dealerListSearch = this.search_val
    this.route.navigate(['/distribution-detail/' + id]);

  }

  getItemsList(index, search) {
    this.distributor_list = [];
    if (index == 'created_by') {
      for (var i = 0; i < this.dr_list_temp.length; i++) {
        search = search.toLowerCase();
        this.tmpsearch1 = this.dr_list_temp[i]['created_name']['name'].toLowerCase();
        if (this.tmpsearch1.includes(search)) {
          this.distributor_list.push(this.dr_list_temp[i]);
        }

      }
    }
    if (index != 'created_by') {
      for (var i = 0; i < this.dr_list_temp.length; i++) {
        search = search.toLowerCase();
        this.tmpsearch1 = this.dr_list_temp[i][index].toLowerCase();
        if (this.tmpsearch1.includes(search)) {
          this.distributor_list.push(this.dr_list_temp[i]);
        }

      }
    }
  }
  tmpsearch1: any = {};
  exp_data: any = [];
  excel_data: any = [];
  exportAsXLSX(): void {
    this.exp_loader = true;
    this.serve.FileData({ 'user_id': this.assign_login_data2.id, 'search': this.search_val, 'type': this.type }, "Distributors/distributor")
      .subscribe(resp => {
        this.exp_data = resp['distributor']['distributor'];
        for (let i = 0; i < this.exp_data.length; i++) {
          this.excel_data.push({ 'Company Name': this.exp_data[i].company_name, 'Contact Person': this.exp_data[i].name, Mobile: this.exp_data[i].mobile, 'WhatsApp No.': this.exp_data[i].whatsapp_no, Email: this.exp_data[i].email, 'Address ': this.exp_data[i].address, 'State ': this.exp_data[i].state, 'District ': this.exp_data[i].district, 'City ': this.exp_data[i].city, 'Pincode ': this.exp_data[i].pincode, 'Distributor ': this.exp_data[i].assign_distributor, 'Assigned Sales User': this.exp_data[i].assign_user, ' Total Secondary Sale': this.exp_data[i].secondary_sale.count, 'Secondary sale amount': this.exp_data[i].secondary_sale.sum });
        }
        this.serve.exportAsExcelFile(this.excel_data, 'RETAILER SHEET');
        this.excel_data = [];
        this.exp_data = [];
      });
  }
}
