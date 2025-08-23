import { Component, OnInit } from '@angular/core';
import { slideToTop } from '../../router-animation/router-animation.component';
import { Router } from '@angular/router';
import { DatabaseService } from 'src/_services/DatabaseService'
import { DialogComponent } from 'src/app/dialog.component';

@Component({
  selector: 'app-discount-list',
  templateUrl: './discount-list.component.html',
  animations: [slideToTop()]
})
export class DiscountListComponent implements OnInit {

  discountList: any = [];
  value: any = {};
  start: any = 0;
  count: any;
  total_page: any;
  pagenumber: any;
  page_limit: any = 10
  tmp_discountlist: any = [];
  loader: any;
  skelton: any = {};
  tmp: any = [];
  data_not_found = false;

  constructor(
    public rout: Router,
    public serve: DatabaseService,
    public dialog: DialogComponent) {
    // this.mydiscountList();
    this.getDiscountList();
    this.skelton = new Array(10);
  }

  ngOnInit() {
  }

  mydiscountList() {

    this.loader = 1;

    this.serve.post_rqst({ 'start': this.start, 'pagelimit': this.page_limit, 'search': this.value.search }, "Discount/discount_list").subscribe((result => {
      this.discountList = result['Discount_list']['discount_list'];
      this.count = result['Discount_list']['count'];

      this.tmp_discountlist = this.discountList;
      this.total_page = Math.ceil(this.count / this.page_limit);
      this.pagenumber = Math.ceil(this.start / this.page_limit) + 1;

      setTimeout(() => {
        this.loader = '';

      }, 700);
    }))

  }



  deletediscount(id) {
    this.dialog.delete("This Category").then((result) => {
      if (result) {
        let data = { 'id': id }
        this.serve.post_rqst(data, "Discount/delete_discount").subscribe((result => {
          if (result) {
            this.mydiscountList();
          }
        }));
      }
    });
  }

  getDiscountList() {
    // this.loader=1;

    this.serve.post_rqst({ 'start': this.start, 'pagelimit': this.page_limit, 'search': this.value.search }, "Discount/Discount_list").subscribe((result => {

      this.discountList = result['Discount_list']['discount_list'];
      this.tmp_discountlist = this.discountList;

      // if(this.discountList.length ==0)
      // {
      //   this.data_not_found=true;
      // } 
      // else 
      // {
      //   this.data_not_found=false;
      // }

      // this.total_page = Math.ceil(this.count/this.page_limit);
      // this.pagenumber = Math.ceil(this.start/this.page_limit)+1;

      setTimeout(() => {
        // this.loader='';

      }, 700);
    }))

  }

  getItemsList() {
    this.discountList = [];
    for (var i = 0; i < this.tmp_discountlist.length; i++) {
      this.value.search = this.value.search.toLowerCase();

      this.tmp = this.tmp_discountlist[i]['category_code'].toLowerCase();
      if (this.tmp.includes(this.value.search)) {
        this.discountList.push(this.tmp_discountlist[i]);
      }
    }
  }

  refresh() {
    // this.mydiscountList();
  }

  total_discount(index) {
    if (this.discountList[index].basic_discount != null && this.discountList[index].sr_discount != null &&
      this.discountList[index].dd_discount != null && this.discountList[index].family_discount != null && this.discountList[index].ss_discount != null && this.discountList[index].cd_discount != null) {
      this.discountList[index].discount = (parseFloat(this.discountList[index].basic_discount) + parseFloat(this.discountList[index].sr_discount) + parseFloat(this.discountList[index].dd_discount) + parseFloat(this.discountList[index].family_discount) + parseFloat(this.discountList[index].ss_discount) + parseFloat(this.discountList[index].cd_discount)).toFixed(2);
    }
  }
}
