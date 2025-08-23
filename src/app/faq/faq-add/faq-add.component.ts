import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import * as moment from 'moment';
import { ToastrManager } from 'ng6-toastr-notifications';
import { CryptoService } from 'src/_services/CryptoService';
import { DatabaseService } from 'src/_services/DatabaseService';

@Component({
  selector: 'app-faq-add',
  templateUrl: './faq-add.component.html',
  styleUrls: ['./faq-add.component.scss']
})
export class FaqAddComponent implements OnInit {

  userData: any;
  userId: any;
  question_id: any;
  userName: any;
  data: any = {
    question: '',
    answer: ''
  };
  selected_image: any;
  encryptedData: any;
  decryptedData:any;
  savingFlag: boolean = false;
  gift_id: any;
  excelLoader: boolean = false;


  constructor(
    public toast: ToastrManager,
    public service: DatabaseService,
    public cryptoService:CryptoService,
    public router: Router,
    private route: ActivatedRoute,
  ) { }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.question_id = params.id;

      if (this.question_id) {
        this.getQuestions(this.question_id)       
      }
    });
  }

  stripHTML(html: string): string {
    return html ? html.replace(/<\/?[^>]+(>|$)/g, "") : "";
  }

  getQuestions(question_id) {
    this.excelLoader = true;
    this.encryptedData = this.service.payLoad ? { 'question_id': this.question_id }: this.cryptoService.encryptData({ 'question_id': this.question_id });
    this.service.post_rqst(this.encryptedData, 'FAQ/getQuestions').subscribe((result) => {
      this.decryptedData = this.service.payLoad ? result : this.cryptoService.decryptData(JSON.stringify(result));

      if (this.decryptedData['statusCode'] == 200) {
        this.data.answer = this.decryptedData['data'].answer;
        this.data.question = this.decryptedData['data'].question;
        this.excelLoader = false;

      }
      else {
        this.toast.errorToastr(this.decryptedData['statusMsg']);
      }
    })
  }

  submitDetail() {
    this.savingFlag = true;
    this.data.question = this.stripHTML(this.data.question);
    this.data.answer = this.stripHTML(this.data.answer);
    let header: any;
    if (this.question_id) {
      this.data.question_id = this.question_id
      this.encryptedData = this.service.payLoad ? this.data: this.cryptoService.encryptData(this.data);
      header = this.service.post_rqst(this.encryptedData, 'FAQ/updateQuestions')
    } 
    else {
    this.encryptedData = this.service.payLoad ? this.data: this.cryptoService.encryptData(this.data);
      header = this.service.post_rqst(this.encryptedData, 'FAQ/addQuestions')
    }
    header.subscribe((result) => {
    this.decryptedData = this.service.payLoad ? result : this.cryptoService.decryptData(JSON.stringify(result));
      if (this.decryptedData['statusCode'] == 200) {
        this.toast.successToastr(this.decryptedData['statusMsg']);
        this.savingFlag = false;
        this.router.navigate(['/banner-list']);
        this.service.count_list();
      }
      else {
        this.toast.errorToastr(this.decryptedData['statusMsg']);
        this.savingFlag = false;
      }
    }, error => {
      this.toast.errorToastr(error);
    })

  }

}
