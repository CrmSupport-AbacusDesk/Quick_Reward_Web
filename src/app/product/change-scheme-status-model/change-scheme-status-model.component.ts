import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialog } from '@angular/material';
import { DatabaseService } from 'src/_services/DatabaseService';
import { Router } from '@angular/router';
import { ToastrManager } from 'ng6-toastr-notifications';

@Component({
  selector: 'app-change-scheme-status-model',
  templateUrl: './change-scheme-status-model.component.html',
  styleUrls: ['./change-scheme-status-model.component.scss']
})
export class ChangeSchemeStatusModelComponent implements OnInit {
  form: any = {};
  product_id: any;

  constructor(@Inject(MAT_DIALOG_DATA) public data, public serve: DatabaseService, public rout: Router, public dialog2: MatDialog, public toast: ToastrManager) {
    this.product_id = data.product_id;
  }

  ngOnInit() {
  }

  submit_scheme() {
    this.form.product_id = this.product_id;

    this.serve.fetchData(this.form, "Product/change_scheme_status").subscribe((result => {
      this.toast.successToastr("changes update");
      this.dialog2.closeAll();
    }));
  }
}
