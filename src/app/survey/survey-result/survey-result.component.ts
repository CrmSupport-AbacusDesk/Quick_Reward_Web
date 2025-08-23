import { Component, OnInit } from '@angular/core';
import { ToastrManager } from 'ng6-toastr-notifications';
import { DialogComponent } from 'src/app/dialog.component';
import { DatabaseService } from 'src/_services/DatabaseService';
import * as moment from 'moment';
import { MatBottomSheet, MatDialog } from '@angular/material';
// import { SupportStatusComponent } from '../support-status/support-status.component';

import { sessionStorage } from 'src/app/localstorage.service';

import { ImageModuleComponent } from 'src/app/image-module/image-module.component';
import { ActivatedRoute } from '@angular/router';
import { BottomSheetComponent } from 'src/app/bottom-sheet/bottom-sheet.component';
import { CryptoService } from 'src/_services/CryptoService';


@Component({
  selector: 'app-survey-result',
  templateUrl: './survey-result.component.html',
  styleUrls: ['./survey-result.component.scss']
})
export class SurveyResultComponent implements OnInit {

  surveyId: any = '';
  pagelimit: any;
  surveyResult: any = [];
  surveyAnswerList: any = [];
  loader: boolean = false;
  pageCount: any;
  sr_no: number;
  total_page: any = 0;
  pagenumber: any = 0;
  start: any = 0;
  downurl: any = '';
  surveyResultQuestions: any = [];
  assign_login_data2: any = [];
  id: any;
  downloadingloader: boolean = false;
  search: any = {};
  encryptedData: any;
  decryptedData:any;


  constructor( private bottomSheet:MatBottomSheet, public cryptoService:CryptoService, public route: ActivatedRoute, public service: DatabaseService, public toast: ToastrManager, public dialog: MatDialog, public alert: DialogComponent, public session: sessionStorage) {
    this.pagelimit = service.pageLimit;
    
    this.assign_login_data2 = this.session.getSession();
    this.assign_login_data2 = this.assign_login_data2.value;
    this.assign_login_data2 = this.assign_login_data2.data;
    this.downurl = service.downloadUrl


    this.route.params.subscribe(params => {
      let Id = params.id.replace(/_/g, '/');
      this.id = this.cryptoService.decryptId(Id)
    });
    // this.surveyId = modelData.rowData.id;
    // this.comes_from = modelData.from;
    // if (this.comes_from == "survey_result") {
    this.getSurveyResult();
    // } else {
    // this.getSurveyDetail();

  }

  ngOnInit() {
  }

  pervious() {
    this.start = this.start - this.pagelimit;
    this.getSurveyResult();
  }

  nextPage() {
    this.start = this.start + this.pagelimit;
    this.getSurveyResult();
  }

  back() {
    window.history.back();
  }

  refresh() {
    this.search={};
    this.getSurveyResult();
    
  }


  getSurveyResult() {
    if (this.pagenumber > this.total_page) {
      this.pagenumber = this.total_page;
      this.start = this.pageCount - this.pagelimit;
    }
    if (this.start < 0) {
      this.start = 0;
    }

    this.encryptedData = this.service.payLoad ? { 'id': this.id, 'start': this.start, 'pagelimit': this.pagelimit,'search': this.search, }: this.cryptoService.encryptData({ 'id': this.id, 'start': this.start, 'pagelimit': this.pagelimit,'search': this.search, });
    this.loader = true;
    this.service.post_rqst(this.encryptedData, "Survey/surveyReport").subscribe(result => {
      this.decryptedData = this.service.payLoad ? result : this.cryptoService.decryptData(JSON.stringify(result));
      if (this.decryptedData['statusCode'] == 200) {
        this.loader = false;
        this.surveyResult = this.decryptedData['result'];
        // this.surveyResultQuestions = result['result']['questions'];
       
        this.pageCount = this.decryptedData['count'];


       if (this.pagenumber > this.total_page) {
          this.pagenumber = this.total_page;
          this.start = this.pageCount - this.pagelimit;
        }
        else {
          this.pagenumber = Math.ceil(this.start / this.pagelimit) + 1;
        }
        this.total_page = Math.ceil(this.pageCount / this.pagelimit);
        this.sr_no = this.pagenumber - 1;
        this.sr_no = this.sr_no * this.pagelimit;


        for (let x = 0; x < this.surveyResult.length; x++) {
          this.surveyResultQuestions = Object.keys(this.surveyResult[x].surveydata);
          this.surveyResult[x].answer = Object.values(this.surveyResult[x].surveydata)
        }

      } else {
        this.loader = false;
        this.toast.errorToastr(this.decryptedData['statusMsg']);
      }
    }, err => {
      this.loader = false;
      this.toast.errorToastr('Something went wrong');
    });
  }



  downloadExcel() {
    this.loader = true;
    this.downloadingloader = true;
    this.encryptedData = this.service.payLoad ? {'search':this.search, 'id': this.id }: this.cryptoService.encryptData({'search':this.search, 'id': this.id });
    this.service.post_rqst(this.encryptedData, "Excel/survey_report").subscribe((result) => {
    this.decryptedData = this.service.payLoad ? result : this.cryptoService.decryptData(JSON.stringify(result));

      if (this.decryptedData['msg'] == true) {
        this.downloadingloader = false;
        this.loader = false;
        window.open(this.downurl + this.decryptedData['filename']);
      }
    }, () => { this.downloadingloader = false; });
  }


  openBottomSheet(): void {
    this.bottomSheet.open(BottomSheetComponent, {
      data: {
        'filterPage': 'survey_list',
      }
    });
    this.bottomSheet._openedBottomSheetRef.afterDismissed().subscribe((data) => {
      this.search.date_from = data.date_from;
      this.search.date_to = data.date_to;
      this.search.userId = data.user_id;
      this.getSurveyResult();
    })
  }

}
