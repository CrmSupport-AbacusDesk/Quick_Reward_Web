import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { ToastrManager } from 'ng6-toastr-notifications';
import { DatabaseService } from 'src/_services/DatabaseService';
import { DialogComponent } from '../dialog.component';
import { ImageModuleComponent } from '../image-module/image-module.component';
import { sessionStorage } from '../localstorage.service';
import { CheckindocumentComponent } from '../checkindocument/checkindocument.component';
import { CryptoService } from 'src/_services/CryptoService';

@Component({
  selector: 'app-attendance-detail',
  templateUrl: './attendance-detail.component.html',
  styleUrls: ['./attendance-detail.component.scss']
})
export class AttendanceDetailComponent implements OnInit {
  skLoading: boolean = false;
  attendance_data: any = {};
  checkin_data: any = [];
  editStartMeterreading:boolean=false;
  editStopMeterreading:boolean=false;
  url: any;
  assign_login_data2: any = {};
  editStartTime: boolean = false;
  editStopTime: boolean = false;
  header: any = [];
  imageData: any = [];
  dataArray = [];
  MeterImageUrl: any;
  encryptedData: any;
  decryptedData: any;
  Remarkarray: any = [];
  RemarkData: any = [];
  Checkindata: any = {};


  constructor(@Inject(MAT_DIALOG_DATA) public data, public cryptoService: CryptoService, public dialogs: MatDialog, public toast: ToastrManager, public service: DatabaseService, public session: sessionStorage, public dialog: DialogComponent, public dialogRef: MatDialogRef<AttendanceDetailComponent>) {
    if (data.from != 'attendence_images') {
      this.getDetails();
    }
    if (data.from == 'attendence_images') {
      this.imageData = data.images_data;
      for (let index = 0; index < data.images_data.length; index++) {
        if (data.images_data[index]['data'].length > 0) {
          this.dataArray.push(data.images_data[index]['data'])
        }

      }
      this.header = data.header;
    }
    let replaceUrl = ''
    if (this.header.module == 'Attendance') {
      replaceUrl = 'attendence/'
    }
    else if (this.header.module == 'Checkin') {
      replaceUrl = 'checkin/'
    }
    else if (this.header.module == 'Expesne') {
      replaceUrl = 'expense/'
    }
    else if (this.header.module == 'Event') {
      replaceUrl = 'event_file/'
    }

    this.url = this.service.uploadUrl + replaceUrl;
    this.MeterImageUrl = this.service.uploadUrl + 'meter_image/';
    this.assign_login_data2 = this.session.getSession();

    this.assign_login_data2 = this.assign_login_data2.value;
    this.assign_login_data2 = this.assign_login_data2.data;
  }

  ngOnInit() {
    this.service.currentUserID = this.data.attendance_id
  }

  close() {
    this.dialogRef.close();
  }

  getDetails() {
    this.skLoading = true;
    this.service.post_rqst({ 'attendance_id': this.data.attendance_id, 'user_id': this.data.user_id, 'date': this.data.date }, "Attendance/attendenceForTravelDetail")
      .subscribe((result => {
        if (result['statusCode'] == 200) {
          this.attendance_data = result['result'];
          this.checkin_data = this.attendance_data['check_in_data'];
          this.RemarkData = this.attendance_data['remark_data'];
          this.skLoading = false;
        } else {
          this.toast.errorToastr(result['statusMsg'])
          this.skLoading = false;
        }
      }))
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

  blankvalue() {
    this.Checkindata.checkin_remark_type = '';
    this.Checkindata.remark = '';
  }

  Submit(){
    this.skLoading = true;
    this.encryptedData = this.service.payLoad ? { 'data':this.Remarkarray , 'id': this.data.user_id, 'date': this.data.date,'type':'attendance'} : this.cryptoService.encryptData({'data':this.Remarkarray, 'id': this.data.user_id, 'date': this.data.date,'type':'attendance'});
    this.service.post_rqst(this.encryptedData, "Checkin/saveCheckinRemarks")
      .subscribe((result => {
        this.decryptedData = this.service.payLoad ? result : this.cryptoService.decryptData(JSON.stringify(result));
        if (this.decryptedData['statusCode'] == 200) {
          this.skLoading = false;
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


  goToImage(image) {
    const dialogRef = this.dialogs.open(ImageModuleComponent, {
      panelClass: 'Image-modal',
      data: {
        'image': image,
        'type': 'base64'
      }
    });
    dialogRef.afterClosed().subscribe(result => {

    });

  }

  markAbsent(attenData) {
    this.dialog.confirm("You Want To  Mark Absent !").then((result) => {
      if (result) {
        this.service.post_rqst({ 'id': attenData.id, 'manual_absent': attenData.manual_absent }, "Attendance/markAbsent")
          .subscribe(result => {
            if (result['statusCode'] == 200) {
              this.toast.successToastr(result['statusMsg']);
              this.getDetails()
            }
            else {
              this.toast.errorToastr(result['statusMsg']);
            }
          });
      }
    })
  }
  DeleteItem(i:any,e:any){
    e.stopPropagation();
    e.preventDefault();
    this.Remarkarray.splice(i,1)
    this.toast.successToastr('Deleted');
  }
  saveNewStartTime(action) {
    let attendanceData = {}
    let msg = '';
    if (action == 'editStartTime') {
      if (this.attendance_data.start_time != '') {
        attendanceData = {
          'type': 'start_time',
          'start_time': this.attendance_data.start_time,
          'updated_by_id': this.assign_login_data2.id,
          'updated_by_name': this.assign_login_data2.name
        }
        msg = "You Want To  Start Attendence !"
      } else {
        this.toast.errorToastr("Start Time can't be blank");
        this.getDetails()
        return
      }

    } else {
      if (this.attendance_data.stop_time != '') {
        attendanceData = {
          'type': 'stop_time',
          'stop_time': this.attendance_data.stop_time,
          'updated_by_id': this.assign_login_data2.id,
          'updated_by_name': this.assign_login_data2.name
        }
        msg = "You Want To  Stop Attendence !"
      } else {
        this.toast.errorToastr("Stop Time can't be blank");
        this.getDetails()
        return
      }
    }


    this.dialog.confirm(msg).then((result) => {
      if (result) {
        this.service.post_rqst({ 'id': this.attendance_data.id, attendanceData }, "Attendance/editAttendenceTime")
          .subscribe(result => {
            if (result['statusCode'] == 200) {
              this.toast.successToastr(result['statusMsg']);
              this.getDetails()
            }
            else {
              this.toast.errorToastr(result['statusMsg']);
            }
          });
      }
    });
    this.editStartTime = false;
    this.editStopTime = false;
  }
  saveMeterReading(action) {
    let attendanceData = {}
    let msg = '';
    if (action == 'editStartMeterreading') {
      if (this.attendance_data.start_meter_reading != '') {
        attendanceData = {
          'type': 'start_meter_reading',
          'start_meter_reading': this.attendance_data.start_meter_reading,
          'updated_by_id': this.assign_login_data2.id,
          'updated_by_name': this.assign_login_data2.name
        }
        msg = "You Want To Edit Start Reading !"
      } else {
        this.toast.errorToastr("Start Meter Reading can't be blank");
        this.getDetails()
        return
      }

    } else {
      if (this.attendance_data.stop_meter_reading != '') {
        attendanceData = {
          'type': 'stop_meter_reading',
          'stop_meter_reading': this.attendance_data.stop_meter_reading,
          'updated_by_id': this.assign_login_data2.id,
          'updated_by_name': this.assign_login_data2.name
        }
        msg = "You Want To Edit Start Reading !"
      } else {
        this.toast.errorToastr("Stop Meter Reading can't be blank");
        this.getDetails()
        return
      }
    }


    this.dialog.confirm(msg).then((result) => {
      if (result) {
        this.service.post_rqst({ 'id': this.attendance_data.id, attendanceData }, "Attendance/editMeterReadings")
          .subscribe(result => {
            if (result['statusCode'] == 200) {
              this.toast.successToastr(result['statusMsg']);
              this.getDetails()
            }
            else {
              this.toast.errorToastr(result['statusMsg']);
            }
          });
      }
    });
    this.editStartMeterreading = false;
    this.editStopMeterreading = false;
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


}
