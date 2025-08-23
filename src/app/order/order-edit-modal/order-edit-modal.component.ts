import { Component, OnInit, Inject } from '@angular/core';
import { DatabaseService } from 'src/_services/DatabaseService';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material';

@Component({
  selector: 'app-order-edit-modal',
  templateUrl: './order-edit-modal.component.html',
  styleUrls: ['./order-edit-modal.component.scss']
})
export class OrderEditModalComponent implements OnInit {

  form: any = {};
  cp_list: any = [];

  constructor(@Inject(MAT_DIALOG_DATA) public data, public dialog: MatDialog, public serve: DatabaseService) {
    this.get_cp_list();
  }

  ngOnInit() {
  }

  get_cp_list() {
    this.serve.post_rqst(this.data.user_id, "Order/get_cp_list").subscribe(result => {
      this.cp_list = result['get_cp_list'];
    });
  }

  update_order() {
    this.form.order_id = this.data.order_id;

    this.serve.post_rqst(this.form, "Order/update_order_detail").subscribe(result => {
    });
    this.dialog.closeAll();
  }

}
