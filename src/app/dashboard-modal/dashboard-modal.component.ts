import { Component,OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material';
import { ToastrManager } from 'ng6-toastr-notifications';
import { Router } from '@angular/router';
import { ProgressService } from '../progress.service';
import { CryptoService } from 'src/_services/CryptoService';
import { DialogComponent } from '../dialog.component';
import { sessionStorage } from 'src/app/localstorage.service';
import { DatabaseService } from 'src/_services/DatabaseService';

@Component({
  selector: 'app-dashboard-modal',
  templateUrl: './dashboard-modal.component.html',
  styleUrls: ['./dashboard-modal.component.scss'],
})
export class DashboardModalComponent implements OnInit {
  juniorWiseEnquiry: any = [];
  juniorWiseData: any = [];

  constructor(@Inject(MAT_DIALOG_DATA) public data, public rout: Router, public progressService: ProgressService, public cryptoService: CryptoService, public dialog: MatDialog, public dialog1: DialogComponent, public service: DatabaseService, public session: sessionStorage, public toast: ToastrManager, public dialogRef: MatDialogRef<DashboardModalComponent>,) {
    console.log('data', data);
   }

  ngOnInit() {
    if(this.data.type == 'rsmWiseSales'){
       this.getJuniorTarget(this.data.id);
    }else{
      this.getLeadData(this.data.id);
    }
    
  }

  getJuniorTarget(id){
    
    this.service.post_rqst({'id':id}, 'Dashboard/rsmWiseTargetAchievement').subscribe((result) => {

      if (result['statusCode'] == 200) {
        this.juniorWiseData = result['result'];
        console.log('juniorWiseData', this.juniorWiseData);
      }
      else {
        this.toast.errorToastr(result['statusMsg']);
      }
    }, err => {
      this.toast.errorToastr('Something went wrong');
    })
  }


  getLeadData(id){
    this.service.post_rqst({'id':id}, 'Dashboard/rsmWiseEnquiryData').subscribe((result) => {

      if (result['statusCode'] == 200) {
        this.juniorWiseEnquiry = result['result'];

      }
      else {
        this.toast.errorToastr(result['statusMsg']);
      }
    }, err => {
      this.toast.errorToastr('Something went wrong');
    })
  }

}
