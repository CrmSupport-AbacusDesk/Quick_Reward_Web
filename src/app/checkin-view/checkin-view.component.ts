import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { ToastrManager } from 'ng6-toastr-notifications';
import { DatabaseService } from 'src/_services/DatabaseService';
import { DialogComponent } from '../dialog.component';
import { CheckindocumentComponent } from '../checkindocument/checkindocument.component';
import { CryptoService } from 'src/_services/CryptoService';
import { Router } from '@angular/router';

@Component({
  selector: 'app-checkin-view',
  templateUrl: './checkin-view.component.html',
  styleUrls: ['./checkin-view.component.scss']
})
export class CheckinViewComponent implements OnInit {
  skLoading: boolean = false;
  user_details: any = {};
  attedence_data: any = {}
  check_in_data: any = [];
  array: any = [];
  savingFlag:boolean=false;
  RemarkData:any=[]
  Remarkarray: any = []
  Checkindata: any = {}
  encryptedData: any;
  decryptedData: any;

  constructor(@Inject(MAT_DIALOG_DATA) public data, public route: Router, public cryptoService: CryptoService, public dialogs: MatDialog, public toast: ToastrManager, public service: DatabaseService, public dialog: DialogComponent, public dialogRef: MatDialogRef<CheckinViewComponent>) {
    this.array = new Array(10);
    this.getDetails();
  }

  ngOnInit() {
  }

  close() {
    this.dialogRef.close();
  }


  getDetails() {
    this.skLoading = true;
    this.encryptedData = this.service.payLoad ? { 'id': this.data.user_id, 'date': this.data.date } : this.cryptoService.encryptData({ 'id': this.data.user_id, 'date': this.data.date });
    this.service.post_rqst(this.encryptedData, "Checkin/checkinDetail")
      .subscribe((result => {
        this.decryptedData = this.service.payLoad ? result : this.cryptoService.decryptData(JSON.stringify(result));
        if (this.decryptedData['statusCode'] == 200) {
          this.skLoading = false;
          this.user_details = this.decryptedData['result'];
          this.attedence_data = this.user_details.attedence_data;
          this.check_in_data = this.attedence_data.check_in_data;
          this.RemarkData = this.user_details.remark_data;
        } else {
          this.toast.errorToastr(this.decryptedData['statusMsg'])
        }
      }))
  }
  DeleteItem(i:any,e:any){
    e.stopPropagation();
    e.preventDefault();
    this.Remarkarray.splice(i,1)
    this.toast.successToastr('Deleted');
  }
  blankvalue() {
    this.Checkindata.checkin_remark_type = '';
    this.Checkindata.remark = '';
  }
  addtolist(e:any) {
    e.stopPropagation();
    this.Remarkarray.push(
      {
        'checkin_remark_type': this.Checkindata.checkin_remark_type,
        'remark': this.Checkindata.remark,
      }
    )
    this.blankvalue()
  }


  Submit(){
    this.savingFlag = true;
    this.encryptedData = this.service.payLoad ? { 'data':this.Remarkarray , 'id': this.data.user_id, 'date': this.data.date,'type':'checkin'} : this.cryptoService.encryptData({'data':this.Remarkarray, 'id': this.data.user_id, 'date': this.data.date,'type':'checkin'});
    this.service.post_rqst(this.encryptedData, "Checkin/saveCheckinRemarks")
      .subscribe((result => {
        this.decryptedData = this.service.payLoad ? result : this.cryptoService.decryptData(JSON.stringify(result));
        if (this.decryptedData['statusCode'] == 200) {
          this.savingFlag = false;
          this.toast.successToastr(this.decryptedData['statusMsg'])
          this.Remarkarray=[];
          this.getDetails();
          
          // this.user_details = this.decryptedData['result'];
          // this.attedence_data = this.user_details.attedence_data;
          // this.check_in_data = this.attedence_data.check_in_data;
        } else {
          this.toast.errorToastr(this.decryptedData['statusMsg'])
        }
      }))
  }
  opendoc(list) {

    const dialogRef = this.dialogs.open(CheckindocumentComponent, {
      width: '768px',
      data: {
        list: [{ 'doc': list }]
      }
    });
    dialogRef.afterClosed().subscribe(result => {

    });

  }
  goToPage(dr_id, dr_type) {
    let id = this.cryptoService.encryptId(dr_id)
    if (dr_type == 4) {
      this.dialogs.closeAll();
      this.route.navigate(['checkin/distribution-detail/', id, 'Profile', 'lead-detail', id]);
    }
    if (dr_type == 5) {
      this.dialogs.closeAll();
      this.route.navigate(['checkin/distribution-detail/', id, 'Profile', 'site-detail', id]);
    }
    else if (dr_type == 1 || dr_type == 3) {
      this.dialogs.closeAll();
      this.route.navigate(['checkin/distribution-detail/', id, 'Profile'], { queryParams: { 'id': id, 'type': dr_type } });
    }
  }

}
