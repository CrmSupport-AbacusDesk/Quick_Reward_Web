import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialog } from '@angular/material';
import { DatabaseService } from 'src/_services/DatabaseService'

import { DialogComponent } from 'src/app/dialog.component';

@Component({
  selector: 'app-add-primary-order-value',
  templateUrl: './add-primary-order-value.component.html',
  styleUrls: ['./add-primary-order-value.component.scss']
})
export class AddPrimaryOrderValueComponent implements OnInit {

  val: any = {};
  sales_user: any = [];

  constructor(@Inject(MAT_DIALOG_DATA) public data, public serve: DatabaseService, public dialog2: MatDialog, public alrt: DialogComponent) {
    this.get_sales_user();
  }

  get_sales_user() {
    this.serve.post_rqst({}, "Distributors/get_sales_user")
      .subscribe(result => {
        this.sales_user = result['get_sales_user'];
      });
  }

  submit() {
    this.val.dr_id = this.data.id;
    this.alrt.confirm('').then((result) => {

      if (result) {
        if (this.val.ord_value != '' && this.val.user != '') {
          this.serve.post_rqst(this.val, "Distributors/add_primary_ord")
            .subscribe(result => {
              this.dialog2.closeAll();
            });
        }
      }
      else {
        this.dialog2.closeAll();

      }

    });

  }

  ngOnInit() {

  }

}
