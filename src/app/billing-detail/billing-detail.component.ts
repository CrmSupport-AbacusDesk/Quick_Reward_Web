import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DatabaseService } from 'src/_services/DatabaseService';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { sessionStorage } from 'src/app/localstorage.service';
import { DialogComponent } from 'src/app/dialog.component';
import { ToastrManager } from 'ng6-toastr-notifications';
import { Location } from '@angular/common';
import { CryptoService } from 'src/_services/CryptoService';


@Component({
  selector: 'app-billing-detail',
  templateUrl: './billing-detail.component.html'
})
export class BillingDetailComponent implements OnInit {
  orderType: any = 'order';
  id: any;
  data: any = {};
  skLoading: boolean = false;
  savingFlag: boolean = false;
  userData: any;
  invoice_detail: any = {}
  billing_list: any = [];
  dispatchItem: any = [];
  payment_list: any = [];
  dispatch_coupon: any = [];
  dispatch_detail: any = {};
  login_data: any = {};
  nexturl: any;

  status: 'Pending';
  constructor(public route: ActivatedRoute, public service: DatabaseService, public cryptoService: CryptoService, public rout: Router,
    public dialog: MatDialog, public session: sessionStorage, public dialogs: DialogComponent, public toast: ToastrManager, public location: Location,) {

    this.userData = JSON.parse(localStorage.getItem('st_user'));
    this.data.created_by_id = this.userData['data']['id'];
    this.data.created_by_name = this.userData['data']['name'];
    this.login_data = this.session.getSession();
    this.login_data = this.login_data.value;
    this.login_data = this.login_data.data;

    this.route.params.subscribe(params => {
      let id = params.id.replace(/_/g, '/')
      this.id = this.cryptoService.decryptId(id);;
      this.service.currentUserID = this.cryptoService.decryptId(id);

      if (id) {
        this.billDatadetail()
      }
    });
  }

  ngOnInit() {
  }


  billDatadetail() {
    this.skLoading = true;
    this.service.post_rqst({ 'bill_id': this.id }, "Account/tallyInvoiceCreditBillingDetail")
      .subscribe((result => {
        if (result['statusCode'] == 200) {
          this.invoice_detail = result['invoice_bill'];
          this.dispatch_detail = result['dispatch_data'];
          this.billing_list = result['invoice_bill_item'];

          for (let i = 0; i < this.billing_list.length; i++) {
            this.dispatchItem.push({ 'item_code': this.billing_list[i]['item_code'], 'sale_qty': this.billing_list[i]['sale_qty'], 'item_name': this.billing_list[i]['item_name'], 'dispatch_qty': 0, })
          }
          this.payment_list = result['payment_list'];
          this.dispatch_coupon = result['all_dispatch'];
          this.skLoading = false;
          this.service.count_list();
        } else {
          this.skLoading = false;
          this.service.count_list();
          this.toast.errorToastr(result['statusMsg'])
        }
      }))
  }

  back() {
    if (this.login_data.user_type == 'DMS') {

      this.nexturl = this.route.snapshot.queryParams['returnUrl'] || '/distribution-list/1/Channel%20Partner/distribution-detail/' + this.login_data['id'] + '/Ledger';
      this.rout.navigate([this.nexturl]);
    }
    else {

      this.location.back()

    }
  }

  exportPdf() {

    this.skLoading = true;
    window.open('https://babasignature.in/AbacusBills/' + this.invoice_detail.pdf_name);
    this.skLoading = false;

  }

}
