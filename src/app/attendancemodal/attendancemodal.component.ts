import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material';
import { ActivatedRoute } from '@angular/router';
import { ToastrManager } from 'ng6-toastr-notifications';
import { CryptoService } from 'src/_services/CryptoService';
import { DatabaseService } from 'src/_services/DatabaseService';

@Component({
  selector: 'app-attendancemodal',
  templateUrl: './attendancemodal.component.html',
  styleUrls: ['./attendancemodal.component.scss']
})
export class AttendancemodalComponent implements OnInit {
  savingFlag: boolean = false;
  leaveTypeList: any = [];
  leaveType: any = '';
  encryptedData: any;
  decryptedData:any;


  constructor(@Inject(MAT_DIALOG_DATA) public modelData: any, public cryptoService:CryptoService, public dialog: MatDialogRef<AttendancemodalComponent>, public navparams: ActivatedRoute, public toast: ToastrManager, public service: DatabaseService) {
    if (modelData.from == 'attendence_absent') {
      this.leaveType = modelData.item.attend
      this.getLeaveTypes();
    }

  }


  getLeaveTypes() {
    this.service.post_rqst({}, 'Attendance/leaveType').subscribe((result) => {
    this.decryptedData = this.service.payLoad ? result : this.cryptoService.decryptData(JSON.stringify(result));
      if (this.decryptedData['statusCode'] == 200) {
        this.leaveTypeList = this.decryptedData['result']
      }
      else {
        this.toast.errorToastr(this.decryptedData['statusMsg']);
      }
    }, err => {
    })
  }

  ngOnInit() {
  }

  changeStatus(attendenceStatus) {
    this.savingFlag = true;

    this.encryptedData = this.service.payLoad ? { 'data': this.modelData }: this.cryptoService.encryptData({ 'data': this.modelData });
    if (attendenceStatus == 'mark_attendance') {
      this.service.post_rqst( this.encryptedData, "Attendance/markPresent").subscribe((result) => {
        this.decryptedData = this.service.payLoad ? result : this.cryptoService.decryptData(JSON.stringify(result));
        if (this.decryptedData['statusCode'] == 200) {
          this.toast.successToastr(this.decryptedData['statusMsg']);
          this.dialog.close(true);
          this.savingFlag = false;
        }
        else if (this.decryptedData['statusCode'] == 400 && this.decryptedData['statusMsg'] == 'Stop Time is Mendatory!') {
          this.toast.errorToastr(this.decryptedData['statusMsg']);
          this.savingFlag = false;
        }
        else {
          this.savingFlag = false;
          this.toast.errorToastr(this.decryptedData['statusMsg']);
          this.dialog.close();
        }
      });
    } else if (attendenceStatus == 'Absent') {
      this.service.post_rqst(this.encryptedData , "Attendance/editLeave").subscribe((result) => {
        this.decryptedData = this.service.payLoad ? result : this.cryptoService.decryptData(JSON.stringify(result));

        if (this.decryptedData['statusCode'] == 200) {
          this.toast.successToastr(this.decryptedData['statusMsg']);
          this.dialog.close(true);
          this.savingFlag = false;
        }
        else {
          this.savingFlag = false;
          this.toast.errorToastr(this.decryptedData['statusMsg']);
          this.dialog.close();
        }
      });
    }

    else {
      if (this.leaveType == "Leave") {
        this.service.post_rqst(this.encryptedData, "Attendance/editLeave").subscribe((result) => {
        this.decryptedData = this.service.payLoad ? result : this.cryptoService.decryptData(JSON.stringify(result));

          if (this.decryptedData['statusCode'] == 200) {
            this.toast.successToastr(this.decryptedData['statusMsg']);
            this.dialog.close(true);
            this.savingFlag = false;
          } else {
            this.savingFlag = false;
            this.toast.errorToastr(this.decryptedData['statusMsg']);
            this.dialog.close();
          }
        });
      } else {
        this.service.post_rqst(this.encryptedData, "Attendance/markLeave").subscribe((result) => {
        this.decryptedData = this.service.payLoad ? result : this.cryptoService.decryptData(JSON.stringify(result));

          if (this.decryptedData['statusCode'] == 200) {
            this.toast.successToastr(this.decryptedData['statusMsg']);
            this.dialog.close(true);
            this.savingFlag = false;
          } else {
            this.savingFlag = false;
            this.toast.errorToastr(this.decryptedData['statusMsg']);
            this.dialog.close();
          }
        });
      }

    }




  }


}
