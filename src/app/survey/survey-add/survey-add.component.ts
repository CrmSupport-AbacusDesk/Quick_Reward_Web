import { Component, OnInit } from '@angular/core';
import { ToastrManager } from 'ng6-toastr-notifications';
import { DatabaseService } from 'src/_services/DatabaseService';
import * as moment from 'moment';
import { Router } from '@angular/router';
import { CryptoService } from 'src/_services/CryptoService';

@Component({
  selector: 'app-survey-add',
  templateUrl: './survey-add.component.html'
})
export class SurveyAddComponent implements OnInit {

  data: any = {};
  labelPosition = 'before';
  surveyQue: any = {};
  surveyAns: any = {};
  isChecked:boolean;
  questionData: any = [];
  states: any = [];
  salesExecutive:any=[]
  select_all: any = false;
  selState: any = [];
  savingFlag: boolean = false;
  userData: any;
  userId: any;
  userName: any;
  minDate: any;
  Users: any = [];
  edit_question: boolean = false;
  encryptedData: any;
  decryptedData:any;

  constructor(public toast: ToastrManager, public cryptoService:CryptoService, public service: DatabaseService, public rout: Router,) {
    this.minDate = new Date();
    this.userData = JSON.parse(localStorage.getItem('st_user'));
    this.userId = this.userData['data']['id'];
    this.userName = this.userData['data']['name'];
    this.surveyQue.question_type = 'optional_answer';
    this.service.orgUserType();
    this.data.types = 'sales_user'
  }

  ngOnInit() {
    this.getState()
    this.getNetworkType()

  }

  shufll(event){
    console.log(event.checked)
    if(event.checked==true){
      this.data.shuffle = 1;
    }else{
      this.data.shuffle = 0;
    }
   
  }


  getNetworkType() {
    this.encryptedData = this.service.payLoad ? { 'type': 'checkin' }: this.cryptoService.encryptData({ 'type': 'checkin' });
    this.service.post_rqst(this.encryptedData, "Survey/allNetworkModule").subscribe((result => {
    this.decryptedData = this.service.payLoad ? result : this.cryptoService.decryptData(JSON.stringify(result));
      if (this.decryptedData['statusCode'] == 200) {
        this.Users = this.decryptedData['modules']
      }
      else {
        this.toast.errorToastr(this.decryptedData['statusMsg']);
      }
    }))
  }
  AllsalesExecutive(searchValue) {
    this.encryptedData = this.service.payLoad ? { 'search': searchValue}: this.cryptoService.encryptData({ 'search': searchValue});
    this.service.post_rqst(this.encryptedData, "Expense/salesUserListExpense").subscribe((result => {
    this.decryptedData = this.service.payLoad ? result : this.cryptoService.decryptData(JSON.stringify(result));
      if (this.decryptedData['statusCode'] == 200) {
        this.salesExecutive = this.decryptedData['all_sales_user']
      }
      else {
        this.toast.errorToastr(this.decryptedData['statusMsg']);
      }
    }))
  }

  selectAllOption(action) {
    if (action == 'allsaleexecutive') {
      setTimeout(() => {
        if (this.data.allsaleexecutive == true) {
          const allsales_user = [];
          for (let i = 0; i < this.salesExecutive.length; i++) {
            allsales_user.push(this.salesExecutive[i].id)
          }
          this.data.selected_user = allsales_user;
          // console.table(this.data.selected_user)
        } else {
          this.data.selected_user=[];
        }
      }, 100);
    }
  }

  checkQuestion(value) {
    if (this.questionData.length != 0) {
      let index = this.questionData.findIndex(row => row.ques_name == value)
      if (index != -1) {
        if (this.questionData[index].ques_name === value) {
          this.toast.errorToastr('Question already exists');
          this.surveyQue.question = "";
          return
        }
        else {
          this.addQuestion();
        }
      }
      else {
        this.addQuestion();
      }

    }
    else {
      this.addQuestion();
    }

  }


  addQuestion() {
    console.log(this.surveyQue.question_type)
    let index = 0;
    index = this.questionData.length+1;
    this.questionData.push({ 'ques_name': this.surveyQue.question, 'question_type': this.surveyQue.question_type, 'index': index, 'options': [] });
    this.questionData.reverse();
    this.surveyQue.question = "";

  }


  addAnswer(index) {
    this.questionData[index]['options'].push(this.surveyAns.answer);
    this.questionData[index].isanswer = true;
    this.surveyAns.answer = "";
  }


  deleteQue(i) {
    this.questionData.splice(i, 1);
    this.toast.errorToastr('Question delete successfully');
  }


  delAns(pindex, cindex) {
    this.questionData[pindex]['options'].splice(cindex, 1);
    this.toast.errorToastr('Answer delete successfully');
  }
  getState() {

    this.service.post_rqst({}, 'Survey/getAllState').subscribe((result) => {
    this.decryptedData = this.service.payLoad ? result : this.cryptoService.decryptData(JSON.stringify(result));
      this.states =  this.decryptedData['all_state'];
    }, error => {
    })

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


  setState(e, state) {
    if (e.checked == true) {
      this.selState.push(state);
    }
    else {
      let removeindex = this.selState.findIndex(r => r == state);
      this.selState.splice(removeindex, 1);
    }
  }

  submitDetail() {
    if (this.data.selState == '') {
      this.toast.errorToastr('State can not be blank');
      return
    }
    if (this.questionData == '') {
      this.toast.errorToastr('Question can not be blank');
      return
    }
    for (let i = 0; i < this.questionData.length; i++) {
      const element = this.questionData[i].options;
      const type = this.questionData[i].question_type;

      if (element == '' && type == 'optional_answer') {
        this.toast.errorToastr('Question ' + i + ' answer is blank');
        return;
      }
    }

    if (this.data.start_date) {

      this.data.start_date = moment(this.data.start_date).format('YYYY-MM-DD');
    }
    if (this.data.end_date) {

      this.data.end_date = moment(this.data.end_date).format('YYYY-MM-DD');
    }
    this.data.uid = this.userId
    this.data.uname = this.userName
    this.data.state = this.selState;


    this.data.item_data = this.questionData;
    this.savingFlag = true;
    this.encryptedData = this.service.payLoad ? this.data: this.cryptoService.encryptData(this.data);
    this.service.post_rqst(this.encryptedData, 'Survey/addSurvey').subscribe((result) => {
      this.decryptedData = this.service.payLoad ? result : this.cryptoService.decryptData(JSON.stringify(result));
      if (this.decryptedData['statusCode'] == 200) {
        this.toast.successToastr(this.decryptedData['statusMsg']);
        this.rout.navigate(['/survey-list']);
        this.savingFlag = false;
        this.service.count_list();
      }
      else {
        this.toast.errorToastr(this.decryptedData['statusMsg']);
        this.savingFlag = false;
      }

    }, error => {
    })
  }



}
