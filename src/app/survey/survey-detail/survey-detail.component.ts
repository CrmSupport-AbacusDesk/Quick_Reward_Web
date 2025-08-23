import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DatabaseService } from 'src/_services/DatabaseService';
import { EditSurveyComponent } from 'src/app/edit-survey/edit-survey.component';
import { MatDialog } from '@angular/material';
import { ToastrManager } from 'ng6-toastr-notifications';
import { sessionStorage } from 'src/app/localstorage.service';
import { SurveyInformationModalComponent } from '../survey-information-modal/survey-information-modal.component';
import { DialogComponent } from 'src/app/dialog.component';
import { CryptoService } from 'src/_services/CryptoService';

@Component({
  selector: 'app-survey-detail',
  templateUrl: './survey-detail.component.html'
})
export class SurveyDetailComponent implements OnInit {
  queData: any = [];
  form_statelist: any = [];
  surveAns: any = {};
  edit_answer: boolean = false;
  savingFlag: boolean = false;
  skLoading: boolean = false;
  surveyQue: any = {};
  data: any = {};
  Data: any = {};
  SurveyData: any = {};
  id: any;
  servey_detail: any = {};
  abhishek: any = [];
  userData: any = {}
  UserID: any = '';
  edit_question: boolean = false;
  labelPosition: any = 'before';
  assign_login_data: any;
  search_st: any;
  assign_login_data2: any;
  
  
  constructor(public route: ActivatedRoute,public alert: DialogComponent, public cryptoService:CryptoService, public service: DatabaseService, public rout: Router, public dialog: MatDialog, public toast: ToastrManager, public session: sessionStorage) {
    this.userData = JSON.parse(localStorage.getItem('st_user')); 
    this.assign_login_data = this.session.getSession();
    this.assign_login_data = this.assign_login_data.value;
    this.assign_login_data2 = this.assign_login_data.data;
    this.UserID = this.userData.data.id
    this.route.params.subscribe(params => {
      let id = params.id.replace(/_/g, '/');
      this.id = this.cryptoService.decryptId(id)
      this.service.currentUserID = this.cryptoService.decryptId(id);
      if(id){
        this.survey_detail();
      }
    });
    
  }
  ngOnInit() {
  }
  step = 0;
  
  setStep(index: number) {
    this.step = index;
  }
  survey_detail() {
    this.skLoading = true;
    this.service.post_rqst({ 'id': this.id }, 'Survey/surveyDetail').subscribe((result) => {
      if (result['statusCode'] == 200) {
        this.servey_detail = result['data']
        for (let i = 0; i < result['data']['state'].length; i++) {
          
          let arr = {
            'state_name': result['data']['state'][i]
          }
          this.skLoading = false;
          this.form_statelist.push(arr);
        }
        setTimeout(() => {
          this.skLoading = false;
        }, 700);
      }
      else {
        this.toast.errorToastr(result['statusMsg']);
      }
    })
    this.getState();
  }
  openDialog(edit_type): void {
    const dialogRef = this.dialog.open(EditSurveyComponent, {
      width: '400px',
      panelClass: 'cs-model',
      data: {
        id: this.servey_detail.id,
        Edit_type: edit_type,
        reason: ''
      }
    });
    
    dialogRef.afterClosed().subscribe(result => {
      if (result != false) {
        this.survey_detail();
      }
    });
  }
  
  shufll(event) {
    if (event.checked == false) {
      this.alert.confirm("You Want To Change Status !").then((result) => {
        if (result) {
          if (event.checked == false) {
            this.servey_detail.shuffle_flag = "0";
          }
          else {
            this.servey_detail.shuffle_flag = "1";
          }
          let value = this.servey_detail.shuffle_flag;
          this.service.post_rqst({'id': this.id, 'shuffle': value}, "Survey/surveyShuffle")
          .subscribe(result => {
            if (result['statusCode'] == 200) {
              this.toast.successToastr(result['statusMsg']);
              // this.survey_detail();
            }
            else {
              this.toast.errorToastr(result['statusMsg']);
            }
          })
        }
      })
    }
    else if (event.checked == true) {
      this.alert.confirm("You Want To Change Status !").then((result) => {
        if (result) {
          if (event.checked == false) {
            this.servey_detail.shuffle_flag = "0";
            
          }
          else {
            this.servey_detail.shuffle_flag = "1";
            
          }
          let value = this.servey_detail.shuffle_flag;
          this.service.post_rqst(value, "Survey/surveyShuffle")
          .subscribe(result => {
            if (result['statusCode'] == 200) {
              this.toast.successToastr(result['statusMsg']);
              // this.survey_detail();
            }
            else {
              this.toast.errorToastr(result['statusMsg']);
            }
          })
        }
      })
    }
  }
  
  
  
  openAnswerModal(rowData,from): void {
    const dialogRef = this.dialog.open(SurveyInformationModalComponent, {
      width: '1000px',
      panelClass: 'cs-model',
      data: {
        rowData,
        'from': from,
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result != false) {
        this.survey_detail();
      }
    });
  }
  editSurvey(edit_type) {
    let id = ''
    let Edit_type = ''
    id = this.id
    Edit_type = edit_type
    this.rout.navigate(['/edit-survey'], { queryParams: { id, } });
  }
  editsurveyanswer(action, id, quans, survey_id) {
    this.SurveyData.action = action
    this.SurveyData.id = id
    if (this.SurveyData.action == 'question' || this.SurveyData.action == 'delete_question') {
      
      this.SurveyData.question = quans
    } else {
      this.SurveyData.answers = quans
    }
    this.SurveyData.survey_id = survey_id;
    this.service.post_rqst({ 'Data': this.SurveyData }, 'Survey/updateSurveyQuesAns').subscribe((result) => {
      if (result['statusCode'] == 200) {
        this.toast.successToastr(result['statusMsg']);
        this.survey_detail()
      }
      else {
        this.toast.errorToastr(result['statusMsg']);
      }
    }, error => {
    })
  }
  states = []
  selState = []
  getState() {
    
    this.service.post_rqst({}, 'Survey/getAllState').subscribe((result) => {
      if (result['statusCode'] == 200) {
        this.states = result['all_state'];
        this.datastateupdate()
      }
      else {
        this.toast.errorToastr(result['statusMsg']);
      }
    }, error => {
    })
    
  }
  
  datastateupdate() {
    for (let i = 0; i < this.states.length; i++) {
      let Index = this.states.findIndex(row => row.state_name == this.form_statelist[i]['state_name'])
      if (Index != -1) {
        this.states[Index].state_value = true;
      } else {
      }
    }
    
  }
  storestate(state_name) {
    if (state_name) {
      this.form_statelist.push({ state_name: state_name });
    }
  }
  setState(e, state) {
    if (e.checked == true) {
      this.selState.push(state);
    }
    else {
      let removeindex = this.selState.findIndex(r => r == state);
      this.selState.splice(removeindex, 1);
    }
  }
  allState() {
    if (!this.data.allStates) {
      this.selState = [];
      for (let i = 0; i < this.states.length; i++) {
        this.states[i].selected = false;
      }
    } else {
      this.selState = [];
      for (let i = 0; i < this.states.length; i++) {
        this.states[i].selected = true;
        this.selState.push(this.states[i].state_name);
      }
    }
  }
  areaUpdate() {
    
    this.savingFlag = true;
    this.data.state = this.form_statelist;
    this.data.survey_id = this.id;
    this.data.uid = this.UserID;
    this.service.post_rqst(this.data, 'Survey/updateSurveyState').subscribe((result) => {
      if (result['statusCode'] == 200) {
        this.toast.successToastr(result['statusMsg']);
        this.savingFlag = false;
        this.survey_detail()
      }
      else {
        this.toast.errorToastr(result['statusMsg']);
        this.savingFlag = false;
      }
    });
  }
}
