import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrManager } from 'ng6-toastr-notifications';
import { CryptoService } from 'src/_services/CryptoService';
import { DatabaseService } from 'src/_services/DatabaseService';
import { DialogComponent } from 'src/app/dialog.component';
import { sessionStorage } from 'src/app/localstorage.service';

@Component({
  selector: 'app-faq-list',
  templateUrl: './faq-list.component.html',
  styleUrls: ['./faq-list.component.scss']
})
export class FaqListComponent implements OnInit {
  
  fabBtnValue:any ='add';
  savingFlag: boolean = false;
  skLoading: boolean = false;
  form_statelist: any = [];
  questionsData: any = {};
  id: any;
  question_id:any;
  step = 0;
  excelLoader: boolean = false;
  
  
  
  constructor(
    public service: DatabaseService,
    public session: sessionStorage,
    public cryptoService:CryptoService,
    public toast: ToastrManager,
    public dialog: DialogComponent,
    public route: Router
  ) { 
    this.getQuestions();
  }
  
  ngOnInit() {
  }
  
  refresh() {
    this.getQuestions();
  }
  
  setStep(index: number) {
    this.step = index;
  }
  
  editright(question_id) {
    this.route.navigate(["/faq-add/" + question_id])
  }
  
  getQuestions() {
    this.excelLoader = true;
    this.service.post_rqst({ 'id': this.id }, 'FAQ/fetchQuestions').subscribe((result) => {
      if (result['statusCode'] == 200) {
        this.questionsData = result['data']
        this.excelLoader = false;
        
      }
      else {
        this.toast.errorToastr(result['statusMsg']);
      }
    })
  }
  
  lastBtnValue(value){
    this.fabBtnValue = value;
  } 
  
  deleteQue(question_id) {
    this.dialog.delete('Question!').then((res) => {
      if (res) {
        this.savingFlag = true;
        this.service.post_rqst({ 'question_id': question_id }, 'FAQ/deleteQuestions').subscribe((result) => {
          if (result['statusCode'] == 200) {
            this.toast.successToastr(result['statusMsg']);
            this.savingFlag = false;
            this.getQuestions()
          }
          else {
            this.toast.errorToastr(result['statusMsg']);
            this.savingFlag = false;
          }
        })
      }
    });
  }
  
}
