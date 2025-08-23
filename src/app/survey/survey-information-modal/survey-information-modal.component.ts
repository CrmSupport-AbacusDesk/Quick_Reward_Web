import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material';
import { ToastrManager } from 'ng6-toastr-notifications';
import { CryptoService } from 'src/_services/CryptoService';
import { DatabaseService } from 'src/_services/DatabaseService';
import { sessionStorage } from 'src/app/localstorage.service';

@Component({
  selector: 'app-survey-information-modal',
  templateUrl: './survey-information-modal.component.html',
  styleUrls: ['./survey-information-modal.component.scss']
})
export class SurveyInformationModalComponent implements OnInit {

  skLoading: boolean = false;
  savingFlag: boolean = false;
  surveyId: any = '';
  surveyAnswerList: any = [];
  surveyResult: any = [];
  surveyResultQuestions: any = [];
  pagelimit: any = 50;
  comes_from: any = '';
  assign_login_data2: any;
  downurl: any;
  encryptedData: any;
  decryptedData:any;

  constructor(@Inject(MAT_DIALOG_DATA) public modelData,  public cryptoService:CryptoService,public dialog: MatDialog, public service: DatabaseService, public session: sessionStorage, public toast: ToastrManager, public dialogRef: MatDialogRef<SurveyInformationModalComponent>) {
    console.log(modelData);

    this.assign_login_data2 = this.session.getSession();
    this.assign_login_data2 = this.assign_login_data2.value;
    this.assign_login_data2 = this.assign_login_data2.data;
    this.downurl = service.downloadUrl

    this.surveyId = modelData.rowData.id;
    this.comes_from = modelData.from;
    if (this.comes_from == "survey_result") {
      this.getSurveyResult();
    } else {
      this.getSurveyDetail();
    }
  }

  ngOnInit() {
  }

  getSurveyDetail() {
    this.skLoading = true;
    this.encryptedData = this.service.payLoad ? { 'id': this.surveyId, 'start': this.surveyAnswerList.length, 'pagelimit': this.pagelimit }: this.cryptoService.encryptData({ 'id': this.surveyId, 'start': this.surveyAnswerList.length, 'pagelimit': this.pagelimit });
    this.service.post_rqst(this.encryptedData, "Survey/answerList").subscribe(result => {
    this.decryptedData = this.service.payLoad ? result : this.cryptoService.decryptData(JSON.stringify(result));
      if (this.decryptedData['statusCode'] == 200) {
        this.skLoading = false;
        this.surveyAnswerList = this.surveyAnswerList.concat(this.decryptedData['result']);
      } else {
        this.skLoading = false;
        this.toast.errorToastr(this.decryptedData['statusMsg']);
      }
    }, err => {
      this.skLoading = false;
      this.toast.errorToastr('Something went wrong');
    });
  }

  getSurveyResult() {
    this.skLoading = true;
    this.encryptedData = this.service.payLoad ? { 'id': this.surveyId, 'start': this.surveyResult.length, 'pagelimit': this.pagelimit }: this.cryptoService.encryptData({ 'id': this.surveyId, 'start': this.surveyResult.length, 'pagelimit': this.pagelimit });
    this.service.post_rqst(this.encryptedData, "Survey/surveyReport").subscribe(result => {
    this.decryptedData = this.service.payLoad ? result : this.cryptoService.decryptData(JSON.stringify(result));
      if (this.decryptedData['statusCode'] == 200) {
        this.skLoading = false;
        this.surveyResult = this.surveyAnswerList.concat(this.decryptedData['result']['Answers']);
        this.surveyResultQuestions = this.decryptedData['result']['questions']

      } else {
        this.skLoading = false;
        this.toast.errorToastr(this.decryptedData['statusMsg']);
      }
    }, err => {
      this.skLoading = false;
      this.toast.errorToastr('Something went wrong');
    });
  }

  downloadExcel() {
    this.skLoading = true;
    this.encryptedData = this.service.payLoad ? { 'id': this.surveyId }: this.cryptoService.encryptData({ 'id': this.surveyId });
    this.service.post_rqst(this.encryptedData, "Excel/allownceCsv").subscribe((result) => {
      this.decryptedData = this.service.payLoad ? result : this.cryptoService.decryptData(JSON.stringify(result));
      if (this.decryptedData['msg'] == true) {
        window.open(this.downurl + this.decryptedData['filename'])
        this.dialog.closeAll();
      }
    });
  }

}
