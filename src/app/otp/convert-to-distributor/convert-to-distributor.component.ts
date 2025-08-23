import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrManager } from 'ng6-toastr-notifications';
import { DatabaseService } from 'src/_services/DatabaseService';
import { sessionStorage } from 'src/app/localstorage.service';

@Component({
  selector: 'app-convert-to-distributor',
  templateUrl: './convert-to-distributor.component.html',
  styleUrls: ['./convert-to-distributor.component.scss']
})
export class ConvertToDistributorComponent implements OnInit {

  data: any = {};
  form: any = {};
  savingFlag: boolean = false;
  constructor(@Inject(MAT_DIALOG_DATA) public modelData, public rout: Router, public dialog: MatDialog, public serve: DatabaseService, public session: sessionStorage, public toast: ToastrManager, public dialogRef: MatDialogRef<ConvertToDistributorComponent>) {
  }

  ngOnInit() {
  }

  convert() {
    if (this.data.otp != this.modelData.otp) {
      this.toast.errorToastr("Otp Do Not Match");
      return;
    }

    setTimeout(() => {
      this.serve.fetchData({ type: this.data.type, dr_id: this.data.id }, "CustomerNetwork/dr_type_update").subscribe((result => {
        this.dialog.closeAll();
        if (this.data.type == 1) {
          this.rout.navigate(['/distribution-list']);
        }
        if (this.data.type == 7) {
          this.rout.navigate(['/direct-dealer']);
        }
        if (this.data.type == 3) {
          this.rout.navigate(['/dealer']);
        }
      }))
    }, 200);
  }

}
